import { NullEngine, Scene, SceneLoader, Skeleton } from "@babylonjs/core";
import { SkeletonAnalyzer } from "./skeletonAnalyzer";
import "@babylonjs/loaders/glTF";
// @ts-ignore
import xhr2 from "xhr2";

export const main = () => {
  global.XMLHttpRequest = xhr2;
  asyncFn();
  // const engine = new NullEngine();
  // const scene = new Scene(engine);
};

const asyncFn = async () => {
  const meta = await SkeletonAnalyzer.AnalyzeFromFileAsync(
    "https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/packages/tools/playground/public/scenes/",
    "dummy2.babylon"
  );
  SkeletonAnalyzer.ShowMetadata(meta);
  SkeletonAnalyzer.SaveMetadata(meta);
  console.log();
  const meta3 = await SkeletonAnalyzer.AnalyzeFromFileAsync(
    "https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/packages/tools/playground/public/scenes/",
    "dummy3.babylon",
    meta
  );
  SkeletonAnalyzer.ShowMetadata(meta3);
  SkeletonAnalyzer.SaveMetadata(meta3);
  console.log();
  const metaDude = await SkeletonAnalyzer.AnalyzeFromFileAsync(
    "https://raw.githubusercontent.com/BabylonJS/Assets/master/meshes/Dude/",
    "dude.babylon",
    meta
  );
  SkeletonAnalyzer.ShowMetadata(metaDude);
  SkeletonAnalyzer.SaveMetadata(metaDude);
};
