import { AbsoluteFill, Img, Sequence, Video } from "remotion";

// Define the shape of your expected props
interface MyVideoProps {
  avatarVideo: string;
  presentationVideo: string;
}

export const MyVideo = ({
  avatarVideo = "https://storage.googleapis.com/vectordatabase-95677.appspot.com/ea4318ef80b64f5eb39da8d32ae5477d",
  presentationVideo = "https://storage.googleapis.com/vectordatabase-95677.appspot.com/b72e47c0a0e6499a81ee67483fd87674",
}: MyVideoProps) => {
  console.log(avatarVideo);
  console.log(presentationVideo);
  const leftVideoUrl =
    "https://firebasestorage.googleapis.com/v0/b/vectordatabase-95677.appspot.com/o/1700264353806.mp4?alt=media";
  const rightVideoUrl =
    "https://firebasestorage.googleapis.com/v0/b/vectordatabase-95677.appspot.com/o/1700264353806.mp4?alt=media";
  const leftFirstImageUrl =
    "https://firebasestorage.googleapis.com/v0/b/vectordatabase-95677.appspot.com/o/files%2FCisco_Challenge_Long_Version_page-0014.jpg?alt=media";
  const leftSecondImageUrl =
    "https://firebasestorage.googleapis.com/v0/b/vectordatabase-95677.appspot.com/o/files%2FCisco_Challenge_Long_Version_page-0013.jpg?alt=media";

  /*   preloadImage(leftFirstImageUrl);
  preloadImage(leftSecondImageUrl); */
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        overflow: "hidden",
      }}
    >
      {/* Left Side Presentation */}
      <AbsoluteFill
        style={{
          width: "100%",
          padding: "10px",
          boxSizing: "border-box",
          backgroundColor: "white",
          border: `${"10px"} solid black`,
        }}
      >
        <Video
          src={presentationVideo}
          style={{ width: "100%", height: "100%", objectFit: "fill" }}
        />

        {/*  <Sequence from={0} durationInFrames={50}>
          {" "}
   
          <Img
            src={leftFirstImageUrl}
            style={{ width: "100%", height: "100%", objectFit: "fill" }}
          />
        </Sequence>


        <Sequence from={50} durationInFrames={150}>
          {" "}

          <Img
            src={leftSecondImageUrl}
            style={{ width: "100%", height: "100%", objectFit: "fill" }}
          />
        </Sequence> */}
      </AbsoluteFill>
      {/* 		<Video
				src={leftVideoUrl}
				style={{width: '100%', height: '700px', marginRight: '5%'}}
			/> */}

      {/* Right Video */}
      <AbsoluteFill
        style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
      >
        <Video
          src={avatarVideo}
          style={{
            width: "15%", // Adjust the size of the video as needed
            height: "auto",
            borderRadius: "50%",
            position: "absolute",
            right: "3%", // Adjust the position as needed
            bottom: "3%", // Adjust the position as needed
          }}
        />
      </AbsoluteFill>
      {/*  <Video
        src={avatarVideo}
        style={{
          width: "15%",
          borderRadius: "50%",
          marginLeft: "80%", // Additional margin to push it to the right
          marginTop: "40%",
        }}
      /> */}
    </AbsoluteFill>
  );
};
