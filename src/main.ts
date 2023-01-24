import express from "express";
import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const main = () => {
  const app = express();
  app.set("port", 12380);
  app.get("/", (req: express.Request, res: express.Response) => {
    res.send("This is simple static server.");
  });
  app.use(express.static(path.join(__dirname, "../public")));

  const server = http.createServer(app);
  app.use((req, res, next) => {
    const err = new Error("Not Found");
    // @ts-ignore
    err["status"] = 404;
    next(err);
  });

  server.listen(app.get("port"), () => {
    console.log("Express server listening on port " + app.get("port"));
  });
};

const asyncFn = async () => {
  // const dummy2 = await SkeletonAnalyzer.AnalyzeFromFileAsync(
  //   "http://localhost:8080/",
  //   "dummy2.babylon"
  // );
  // const metaNohead = await SkeletonAnalyzer.AnalyzeFromFileAsync(
  //   "http://172.28.66.189:8080/",
  //   "nohead.babylon",
  //   meta
  // );
  // SkeletonAnalyzer.ShowMetadata(metaNohead);
  // SkeletonAnalyzer.SaveMetadata(metaNohead);
};
