import { NullEngine, Scene, SceneLoader, Skeleton } from "@babylonjs/core";
import { SkeletonAnalyzer } from "./skeletonAnalyzer";
import { server } from "./test/simpleServer";
import "@babylonjs/loaders/glTF";
// @ts-ignore
import xhr2 from "xhr2";

export const main = () => {
  global.XMLHttpRequest = xhr2;
  server.listen(8080);
  asyncFn();
  // const engine = new NullEngine();
  // const scene = new Scene(engine);
};

const asyncFn = async () => {
  const dummy2 = await SkeletonAnalyzer.AnalyzeFromFileAsync(
    "http://localhost:8080/",
    "dummy2.babylon"
  );
  // const metaNohead = await SkeletonAnalyzer.AnalyzeFromFileAsync(
  //   "http://172.28.66.189:8080/",
  //   "nohead.babylon",
  //   meta
  // );
  // SkeletonAnalyzer.ShowMetadata(metaNohead);
  // SkeletonAnalyzer.SaveMetadata(metaNohead);
};
