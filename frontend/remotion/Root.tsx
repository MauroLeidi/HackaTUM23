import { Composition } from "remotion";
import { Main } from "./MyComp/Main";
import {
  COMP_NAME,
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../types/constants";
import { NextLogo } from "./MyComp/NextLogo";
import { MyVideo } from "./MyComp/myVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={COMP_NAME}
        component={Main}
        durationInFrames={DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultMyCompProps}
      />
      <Composition
        id="NextLogo"
        component={NextLogo}
        durationInFrames={100}
        fps={30}
        width={140}
        height={140}
        defaultProps={{
          outProgress: 0,
        }}
      />
      <Composition
        id="MyVideo"
        component={MyVideo}
        durationInFrames={30 * 16}
        fps={30}
        width={1920}
        height={1080}
        /* defaultProps={{
          leftVideoUrl: "http://example.com/left.mp4",
          rightVideoUrl: "http://example.com/right.mp4",
        }} */
      />
    </>
  );
};
