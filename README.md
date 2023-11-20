# 2nd Place VoiceCraft: AI-Enhanced Inclusivity - HackaTUM23

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/D3r6sV6Q71U/0.jpg)](https://www.youtube.com/watch?v=D3r6sV6Q71U)

Our solution for the Burda challenge at HackaTUM23. We Leverage AI generated video to enhance the integration of mute people in the workplace by enabling them to give presentations with their avatar. We simplify as much as possible the generation of the presentations, by allowing them to use a web app where they just need to upload a selfie and a powerpoint presentation.

In the code you can find:

- api.py: A fastAPI server wthat is processing many files and using video_functions.py. Note in this code the api requests are done to the D-ID api's.
- video_functions.py: helper function to create the videos and concatenate them
- openai_enhancer.py: python code to integrate openai chatgpt api
- frontend: A React Remotion frontend with a customized template. This side uses the API provided by the fastAPI to receive the videos that are needed to build the presentation. Note also that the interaction with OPENAI apis is done here.
- We also store data on a firebase database.
