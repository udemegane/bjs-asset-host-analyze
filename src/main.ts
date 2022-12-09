import { NullEngine, Scene, SceneLoader } from "@babylonjs/core";
import { SkeletonAnalyzer } from "./skeletonAnalyzer";
import "@babylonjs/loaders/glTF";
// @ts-ignore
import xhr2 from "xhr2";

export const main = () => {
  global.XMLHttpRequest = xhr2;
  const engine = new NullEngine();
  const scene = new Scene(engine);
  SceneLoader.ImportMesh(
    "",
    "https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/packages/tools/playground/public/scenes/",
    "dummy2.babylon",
    scene,
    () => {
      console.log("success!");
    }
  );
  // SkeletonAnalyzer.AnalyzeFromFileAsync("sample/", "dummy2.babylon");
};
