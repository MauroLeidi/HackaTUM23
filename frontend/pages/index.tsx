import { Player, RenderLoading } from "@remotion/player";
import type { NextPage } from "next";
import bucket from "./firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Head from "next/head";
import React, { useCallback, useMemo, useState } from "react";
import { Main } from "../remotion/MyComp/Main";
import { MyVideo } from "../remotion/MyComp/myVideo";
import {
  CompositionProps,
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../types/constants";
import { set, z } from "zod";
import { RenderControls } from "../components/RenderControls";
import { Tips } from "../components/Tips/Tips";
import { Spacing } from "../components/Spacing";
import { AbsoluteFill } from "remotion";

const container: React.CSSProperties = {
  maxWidth: 768,
  margin: "auto",
  marginBottom: 20,
};

const outer: React.CSSProperties = {
  borderRadius: "var(--geist-border-radius)",
  overflow: "hidden",
  boxShadow: "0 0 200px rgba(0, 0, 0, 0.15)",
  paddingBottom: 60,
  marginTop: 20,
};

const player: React.CSSProperties = {
  width: "100%",
};

const Home: NextPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [picture, setPicture] = useState<File | null>(null);
  const [selectedOption, setSelectedOption] = useState("normal"); // Default value
  const [selectedGender, setSelectedGender] = useState("male");

  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [id, setId] = useState(null);
  const [videoReady, setVideoReady] = useState(false);
  const [avatarVideoUrl, setAvatarVideoUrl] = useState(
    "https://storage.googleapis.com/vectordatabase-95677.appspot.com/0b7b2e2c65364ed3a2abb84a0f75850e"
  );
  const [presVideoUrl, setPresVideoUrl] = useState(
    "https://storage.googleapis.com/vectordatabase-95677.appspot.com/110becd3aeb040c9adfbe440c4e28aee"
  );
  const [presentationURL, setPresentationURL] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(60 * 2.8);

  async function createAndUploadVideo() {
    //const leftVideoUrl =
    "https://firebasestorage.googleapis.com/v0/b/vectordatabase-95677.appspot.com/o/concatenated.mp4?alt=media&token=b653f231-613c-4c47-9896-000c7b92a8c0";
    //const rightVideoUrl = "http://example.com/rightVideo.mp4";

    // Create the request body
    /* const requestBody = {
      leftVideoUrl: leftVideoUrl,
      rightVideoUrl: rightVideoUrl,
    }; */

    /* // Send the POST request
    const response = await fetch("/api/render", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
  
    // Handle the response
    if (response.ok) {
      const data = await response.json();
      console.log(response);
      console.log(data.downloadUrl); // Use the URL as needed
      // Handle success (e.g., show a message or process returned data)
    } else {
      console.error("Error initiating render:", response.statusText);
      // Handle error (e.g., show an error message)
    } */

    //make api call to mauros server

    /* setAvatarVideoUrl(
      "https://storage.googleapis.com/vectordatabase-95677.appspot.com/fca22b632e914552a13c8748cf672902"
    );
    setPresVideoUrl(
      "https://storage.googleapis.com/vectordatabase-95677.appspot.com/8002cae585ff46a6885b2588e8964e7f"
    );
    setVideoReady(true);
    return; */

    const requestBody2 = {
      pptx_url: presentationURL,
      avatar_img_url: imageURL,
      speech_motion: selectedOption,
      gender: selectedGender,
    };
    console.log(requestBody2);

    setLoading(true);
    const response = await fetch(
      "https://4b68-194-230-158-188.ngrok-free.app/upload_pptx",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody2),
      }
    );

    // Handle the response
    if (response.ok) {
      setLoading(false);
      const data = await response.json();
      console.log(response);
      setAvatarVideoUrl(data.urlAvatarVideo);
      setPresVideoUrl(data.urlPresentation);
      setDuration(data.total_duration);
      setVideoReady(true);
      // Handle success (e.g., show a message or process returned data)
    } else {
      setLoading(false);
      console.error("Error initiating render:", response.statusText);
      // Handle error (e.g., show an error message)
    }
  }

  const inputProps: z.infer<typeof CompositionProps> = useMemo(() => {
    return {
      title: "Your Title Here", // Provide a title
      avatarVideo: avatarVideoUrl,
      presentationVideo: presVideoUrl,
    };
  }, [avatarVideoUrl, presVideoUrl]);

  const renderLoading: RenderLoading = useCallback(({ height, width }) => {
    return (
      <AbsoluteFill style={{ backgroundColor: "gray" }}>
        Loading player ({height}x{width})
      </AbsoluteFill>
    );
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setFile(files[0]);
      uploadFile(files[0], "pptx");
    }
  };
  const uploadFile = async (file: File, url_tye: string) => {
    const storageRef = ref(bucket, `uploads/${file.name}`);

    // 'file' comes from the Blob or File API
    await uploadBytes(storageRef, file).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
    await getDownloadURL(storageRef).then((downloadURL) => {
      console.log("File available at", downloadURL);
      if (url_tye == "pptx") {
        setPresentationURL(downloadURL);
      } else {
        setImageURL(downloadURL);
      }
    });

    /* const fileRef = storageRef.child(`uploads/${file.name}`);
    fileRef.put(file).then(() => {
      console.log("Uploaded a file: ", file.name);
      // Optionally, you can get the download URL after the upload is complete
      fileRef.getDownloadURL().then((url: any) => {
        console.log("File available at", url);
        // You can set the URL to state or perform other actions as needed
      });
    }); */
  };
  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setPicture(files[0]);
      uploadFile(files[0], "image");
    }
  };
  const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
    console.log(selectedOption);
  };
  const handleSelectGenderChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedGender(event.target.value);
    console.log(setSelectedGender);
  };

  return (
    <div class="bg-white">
      <Head>
        <title>Remotion and Next.js</title>
        <meta name="description" content="Remotion and Next.js" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div class="bg-white min-h-screen  pt-10 bg-gray-100">
        <div class="container mx-auto p-4 text-center space-y-8 ">
          <p className="text-7xl">🔥🌶️🔥</p>
          <h1 class="text-4xl font-extrabold text-black pb-14">
            ... In good company
          </h1>
          <div>
            <h4 class="text-2xl font-bold mb-6 text-black">
              1. Upload your presentation (pptx) here 📄
            </h4>
            <input
              type="file"
              class="text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-blue-50 file:text-blue-700
      hover:file:bg-blue-100
    "
              onChange={handleFileChange}
            />
          </div>
          <div>
            <h4 class="text-2xl font-bold mb-6 text-black">
              2. Upload a picture of yourself! 📷
            </h4>
            <input
              type="file"
              class="text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-blue-50 file:text-blue-700
      hover:file:bg-blue-100
    "
              onChange={handlePictureChange}
            />
          </div>
          <div>
            <h4 class="text-2xl font-bold mb-6 text-black">
              3. Enhance your presentation 🗣
            </h4>
            <select
              class=" w-40 bg-blue-50 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleSelectChange}
              value={selectedOption}
            >
              <option value="normal">Normal</option>
              <option value="cheerful">Convincing</option>
              <option value="friendly">Friendly</option>
            </select>
          </div>
          <div>
            <h4 class="text-2xl font-bold mb-6 text-black">
              4. Choose your gender 👨👩
            </h4>
            <select
              class=" w-40 bg-blue-50 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleSelectGenderChange}
              value={selectedGender}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <h4 class="text-2xl font-bold mb-6 text-black">You are ready! 🚀</h4>

          <button
            onClick={createAndUploadVideo}
            disabled={loading}
            class="bg-blue-700 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            {loading ? (
              <>
                <div role="status">
                  <svg
                    aria-hidden="true"
                    class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span class="sr-only">Loading...</span>
                </div>
              </>
            ) : (
              "Generate video"
            )}
          </button>
          <div>
            {videoUrl && (
              <a href={videoUrl} download>
                Download Video
              </a>
            )}
          </div>
        </div>
        {true && (
          <div style={container}>
            <div className="cinematics" style={outer}>
              <Player
                component={MyVideo}
                inputProps={inputProps}
                durationInFrames={Math.round(duration * VIDEO_FPS + 10)}
                fps={VIDEO_FPS}
                compositionHeight={VIDEO_HEIGHT}
                compositionWidth={VIDEO_WIDTH}
                style={player}
                controls
                renderLoading={renderLoading}
              />
              {/* <video width="100%" controls>
                <source
                  src={
                    "https://firebasestorage.googleapis.com/v0/b/vectordatabase-95677.appspot.com/o/1700264353806.mp4?alt=media"
                  }
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
