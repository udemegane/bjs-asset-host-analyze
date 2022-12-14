import * as http from "http";
import * as fs from "fs";
import * as path from "path";
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename);

// jest用のサーバー
// 普通に使ってもesmなので__dirnameが使えないので動きませーーん
export const server = http.createServer((req, res) => {
  console.log(`request : ${req.url}`);
  const url = req.url ? req.url : "index.html";
  const filePath = path.join(__dirname, "./public", url);
  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    ".babylon": "application/json",
    ".meta": "application/json",
    ".glb": "application/octet-stream",
    ".gltf": "application/octet-stream",
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".woff": "application/font-woff",
    ".ttf": "application/font-ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".otf": "application/font-otf",
    ".svg": "application/image/svg+xml",
  };
  const contentType = mimeTypes[extname] || "application/octet-stream";
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        res.writeHead(404);
        res.end("404 Not Found");
      } else {
        res.writeHead(500);
        res.end(
          "Sorry, check with the site admin for error: " + error.code + " ..\n"
        );
        res.end();
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});
