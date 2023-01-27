/* eslint-disable no-undef */
import { NullEngine } from "@babylonjs/core";
import { SkeletonAnalyzer } from "../skeletonAnalyzer";
import { dummy2Metadata, noheadMetadata } from "./loadMannequin.data";
import { server } from "./simpleServer";
// @ts-ignore
import xhr2 from "xhr2";
global.XMLHttpRequest = xhr2;
const engine = new NullEngine();

test("Launch server", async () => {
  server.listen(12380);
  // pingとかしたいよね
  expect(true).toBe(true);
});
//   await new Promise((resolve) => setTimeout(resolve, 800));
test("Load and analyze .babylon file", async () => {
  const meta = await SkeletonAnalyzer.AnalyzeFromFileAsync(
    "http://localhost:12380/",
    "dummy2.babylon",
    engine
  );
  expect(meta.ok).toBe(true);
});

test("Load and analyze .glb file", async () => {
  const meta = await SkeletonAnalyzer.AnalyzeFromFileAsync(
    "http://localhost:12380/",
    "Xbot.glb",
    engine
  );
  expect(meta.ok).toBe(true);
});

test("Accept compatible skeletons (dummy2 and dummy3)", async () => {
  const meta = await SkeletonAnalyzer.AnalyzeFromFileAsync(
    "http://localhost:12380/",
    "dummy3.babylon",
    engine,
    dummy2Metadata
  );
  expect(meta.ok).toBe(true);
  if (meta.ok) {
    expect(meta.val.isNewGroup).toBe(false);
  }
});

test("Accept compatible skeletons (Xbot based dummy2)", async () => {
  const meta = await SkeletonAnalyzer.AnalyzeFromFileAsync(
    "http://localhost:12380/",
    "Xbot.glb",
    engine,
    dummy2Metadata
  );
  expect(meta.ok).toBe(true);
  if (meta.ok) {
    expect(meta.val.isNewGroup).toBe(false);
  }
});

test("Accept compatible skeletons (dummy2 based nohead)", async () => {
  const meta = await SkeletonAnalyzer.AnalyzeFromFileAsync(
    "http://localhost:12380/",
    "dummy3.babylon",
    engine,
    noheadMetadata
  );
  expect(meta.ok).toBe(true);
  if (meta.ok) {
    expect(meta.val.isNewGroup).toBe(false);
  }
});

test("Accept compatible skeletons (nohead based dummy2)", async () => {
  const meta = await SkeletonAnalyzer.AnalyzeFromFileAsync(
    "http://localhost:12380/",
    "nohead.babylon",
    engine,
    dummy2Metadata
  );
  expect(meta.ok).toBe(true);
  if (meta.ok) {
    expect(meta.val.isNewGroup).toBe(false);
  }
});

test("Reject incompatible skeletons (dummy2 and dude)", async () => {
  const meta = await SkeletonAnalyzer.AnalyzeFromFileAsync(
    "http://localhost:12380/",
    "dude.babylon",
    engine,
    dummy2Metadata
  );
  expect(meta.ok).toBe(true);
  if (meta.ok) {
    expect(meta.val.isNewGroup).toBe(true);
  }
});
test("Close Server", async () => {
  server.close();
  expect(true).toBe(true);
});
