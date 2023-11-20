// pages/api/render-and-upload.js
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);
export default async function handler(req, res) {
  const { leftVideoUrl, rightVideoUrl } = req.body;

  // Serialize your props to a JSON string
  const serializedProps = JSON.stringify({ leftVideoUrl, rightVideoUrl });
  console.log(serializedProps);
  console.log(`remotion render MyVideo out5.mp4 --props='${serializedProps}'`);
  try {
    console.log("rendering..");
    const renderCommand = `remotion render MyVideo out5.mp4 --props '${serializedProps}'`;
    const { stdout, stderr } = await execPromise(renderCommand);
    console.log(stdout);
    console.error(stderr);
    const renderedVideoPath = "out5.mp4";
    const downloadUrl = await uploadToFirebase(renderedVideoPath);
    res.status(200).json({ downloadUrl });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
