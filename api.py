from fastapi import FastAPI, File, UploadFile, HTTPException, Response
from typing import List
import os
import imageio
from io import BytesIO
import convertapi
import requests
from pptx import Presentation
import time
from moviepy.editor import *
import firebase_admin
from firebase_admin import credentials, storage
from fastapi.responses import JSONResponse
#from moviepy.video.io.VideoFileClip import VideoFileClip
from moviepy.editor import *
from pydantic import BaseModel
import uuid
from fastapi.middleware.cors import CORSMiddleware
from openai_enricher import enrich_note
from video_functions import *

class UploadPPTXRequest(BaseModel):
    pptx_url: str
    avatar_img_url: str
    speech_motion: str
    gender: str


cred = credentials.Certificate("vectordatabase-95677-firebase-adminsdk-8bg6n-f9507e3032.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'vectordatabase-95677.appspot.com'
})
    
# FastAPI app
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload_pptx/")
async def upload_pptx(request: UploadPPTXRequest):
    try:
        pptx_url = request.pptx_url

        avatar_img_url = convertUrl(request)
        
        speech_motion = request.speech_motion
        gender = request.gender

        # Download the .pptx file
        pptx_file_content = requests.get(pptx_url).content
        pptx_filename = "uploaded.pptx"
        with open(pptx_filename, "wb") as pptx_file:
            pptx_file.write(pptx_file_content)

        # Download the avatar image (currently unused)
        avatar_img_content = requests.get(avatar_img_url).content
        avatar_img_filename = "avatar.jpg"
        with open(avatar_img_filename, "wb") as avatar_img_file:
            avatar_img_file.write(avatar_img_content)

        # Process the PowerPoint presentation
        notes, img_paths, slide_txts = read_pptx(pptx_filename)

        print(speech_motion)

        """ if speech_motion != "normal":
            for i,note in enumerate(notes):
                notes[i][0] = enrich_note(note[0],speech_motion) """
        
        #generate avatar video
        
        ids = []
        videos = []
        durations = []

        for text in notes:#[:2]:
            print(avatar_img_url)
            print(text[0])
            id = avatarVideoRequest(avatar_img_url,text[0],speech_motion,gender)
            ids.append(id)
        
        # Sleep for 5 seconds
        time.sleep(10)    

        for i,_ in enumerate(notes):#notes[:2]):
            id = ids[i]
            video,duration = getAvatarVideo(id)
            videos.append(video)
            durations.append(duration)
        print(durations)

        wholevideo = concatenate_videos(videos)
        presentation = generate_video(img_paths, durations, 'presentation.mp4')
        # Save three files on firebase and return their URLs
        urlConcat = uploadToFirebase(wholevideo)
        urlPresentation = uploadToFirebase(presentation)

        # Create a JSON response with the URLs
        response_data = {
            "urlAvatarVideo": urlConcat,
            "urlPresentation": urlPresentation,
            "total_duration": sum(durations)
            # Add more URLs as needed
        }

        return JSONResponse(content=response_data)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

# Run the FastAPI server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)