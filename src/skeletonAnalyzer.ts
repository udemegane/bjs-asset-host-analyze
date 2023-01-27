import {
  Scene,
  SceneLoader,
  Skeleton,
  Bone,
  NullEngine,
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { Ok, Err, Result } from "ts-results-es";
import { colors, assertIsDefined } from "./util";
import * as fs from "fs";

type BoneHash = {
  id: number; // このスケルトンのボーンのid
  baseId: number; // ベーススケルトンのボーンのid
  value: 0 | 1;
};

export type SkeletonMetadata = {
  bones: BoneHash[];
  groupId: string;
  isNewGroup: boolean;
  name: string;
  fileName: string;
  type: "Animation" | "Model";
};
/*
type SkeletalAnimationNode = {
  id: number;
  baseId: number;
  animation: Animation;
};
*/
export class SkeletonAnalyzer {
  public static async AnalyzeFromFileAsync(
    root: string,
    fileName: string,
    engine?: NullEngine,
    baseResource?: string | SkeletonMetadata,
    saveMetadata = true,
    extractAnimation = true
  ): Promise<Result<SkeletonMetadata, string>> {
    const isCreateingEngine = (() => {
      if (engine) {
        return true;
      } else {
        return false;
      }
    })();
    if (!engine) {
      engine = new NullEngine();
    }

    const scene = new Scene(engine);
    const result = await SceneLoader.ImportMeshAsync("", root, fileName, scene);
    if (result.skeletons.length === 0) {
      return Err("No skeleton in this file.");
    }
    if (result.skeletons.length > 1) {
      return Err("Too many skeletons in this file.");
    }
    const skeleton = result.skeletons[0];
    assertIsDefined(skeleton);

    // release resource
    scene.dispose();
    if (isCreateingEngine) engine.dispose();

    if (baseResource) {
      // まだ
      const resource = (() => {
        if (typeof baseResource === "string") {
          // 敗北しました....ごめんなさい....
          const mayBeMeta = JSON.parse(
            fs.readFileSync(baseResource, "utf-8")
          ) as SkeletonMetadata;
          return mayBeMeta;
        } else {
          return baseResource;
        }
      })();

      return Ok(
        SkeletonAnalyzer.Analyze(
          skeleton,
          saveMetadata,
          extractAnimation,
          resource,
          fileName
        )
      );
    } else {
      return Ok(
        SkeletonAnalyzer.Analyze(
          skeleton,
          saveMetadata,
          extractAnimation,
          undefined,
          fileName
        )
      );
    }
  }
  //  const scene

  public static Analyze(
    skeleton: Skeleton,
    saveMetadata = true,
    extractAnimation = true,
    baseSkeleton?: SkeletonMetadata,
    fileName?: string
  ): SkeletonMetadata {
    const uuid = () =>
      "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    const filename = fileName || "";
    console.info(colors.white(`Analyzing skeleton "${skeleton.name}"...`));
    const hash = SkeletonAnalyzer._MakeBoneHash(skeleton);
    if (baseSkeleton) {
      console.info(
        colors.white(
          `Check Bone hieralchy compatibility of ${skeleton.name} and ${baseSkeleton.name}...`
        )
      );

      if (SkeletonAnalyzer._IsValiedSkeleton(hash, baseSkeleton.bones)) {
        console.info(colors.green(`Compatible!`));
        return Object.freeze({
          bones: this._SetBaseId(hash, baseSkeleton.bones),
          groupId: baseSkeleton.groupId,
          isNewGroup: false,
          name: skeleton.name,
          type: "Model",
          fileName: filename,
        });
      } else {
        console.warn(
          colors.yellow(`Not Compatible. Make new skeleton group id.`)
        );
      }
    }
    console.info(colors.white(`Make new skeleton group id.`));
    return Object.freeze({
      bones: hash,
      groupId: uuid(),
      isNewGroup: true,
      name: skeleton.name,
      type: "Model",
      fileName: filename,
    });
  }

  public static ShowMetadata(data: SkeletonMetadata) {
    console.info(colors.cyan(`Show skeleton metadata of ${data.fileName}`));
    console.log(`Show bones hash array: `);
    data.bones.forEach((hash) =>
      process.stdout.write(`${hash.value === 0 ? "(" : ")"}`)
    );
    console.log("");
    console.log(`Length:   ${data.bones.length}`);
    console.log(`ID:       ${data.groupId}`);
    console.log(`Name:     ${data.name}`);
  }

  private static _MakeBoneHash(skeleton: Skeleton): BoneHash[] {
    console.info(colors.white(`Create Bone hierarchy array...`));
    const constructHash = (bone: Bone): BoneHash[] => {
      if (bone.children.length === 0) {
        return [
          {
            id: bone.getIndex(),
            baseId: -1,
            value: 0,
          },
          {
            id: bone.getIndex(),
            baseId: -1,
            value: 1,
          },
        ];
      } else {
        // あるボーンの子要素のボーンツリーを再帰的にソートする
        // localecompareしてるので構造が一致すれば列は一意に定まるはず
        const childrenHash = bone.children
          .map((childbone) => constructHash(childbone))
          .sort((a, b) => {
            const str1 = a.map((h) => h.value).join("");
            const str2 = b.map((h) => h.value).join("");
            return str1.localeCompare(str2);
          })
          .reduce((acc, cur) => {
            acc.push(...cur);
            return acc;
          });
        // この呼び出しに対応するボーンのハッシュを埋め込む
        childrenHash.unshift({
          id: bone.getIndex(),
          baseId: -1,
          value: 0,
        });
        childrenHash.push({
          id: bone.getIndex(),
          baseId: -1,
          value: 1,
        });
        return childrenHash;
      }
    };

    const rootBone = ((maybeBone) => {
      assertIsDefined(maybeBone);
      return maybeBone;
    })(skeleton.bones[0]);

    return constructHash(rootBone);
  }

  private static _SetBaseId(
    hash: BoneHash[],
    baseHash: BoneHash[]
  ): BoneHash[] {
    let i = 0;
    let ib = 0;
    const isLongerThanBase = hash.length > baseHash.length;
    const max = isLongerThanBase ? hash.length : baseHash.length;
    while (!(i >= max || ib >= max)) {
      const h = hash[i];
      const hb = baseHash[ib];
      assertIsDefined(h);
      assertIsDefined(hb);
      if (h.value === hb.value) {
        h.baseId = hb.id;
        i++;
        ib++;
      } else {
        let surplus = 0;
        if (isLongerThanBase) {
          while (1) {
            const h = hash[i];
            assertIsDefined(h);
            if (h.value === 0) {
              surplus++;
            } else {
              surplus--;
            }
            if (surplus < 0) {
              break;
            } else {
              i++;
            }
          }
        } else {
          while (1) {
            const hb = baseHash[ib];
            assertIsDefined(hb);
            if (hb.value === 0) {
              surplus++;
            } else {
              surplus--;
            }
            if (surplus < 0) {
              break;
            } else {
              ib++;
            }
          }
        }
      }
    }
    return hash;
  }

  private static _ExtractAnimation(skeleton: Skeleton) {}
  private static _IsValiedSkeleton(
    hash1: BoneHash[],
    hash2: BoneHash[]
  ): boolean {
    const [longerHash, shooterHash] = (() => {
      if (hash1.length > hash2.length) {
        return [hash1, hash2];
      } else {
        return [hash2, hash1];
      }
    })();
    const hashSequence = ((hash) => {
      function* gen() {
        yield* hash;
      }
      return gen();
    })(longerHash);

    let isValied = true;
    // 小さいほうのスケルトンが大きいスケルトンのサブセットであることを確認する
    for (let i = 0; i < shooterHash.length; i++) {
      const hshooter = shooterHash[i];
      assertIsDefined(hshooter);
      const next = hashSequence.next();
      if (next.done) {
        break;
      }
      const hlonger = next.value as BoneHash;
      if (hshooter.value === hlonger.value) {
        continue;
      } else {
        // ここの節は、一致しないハッシュから始まるボーン階層が簡潔したサブツリーであることを確認し、
        // それを取り除いた部分が一致するか考える
        let surplus = hlonger.value === 0 ? 1 : -1;
        while (1) {
          const next = hashSequence.next();
          if (next.done) {
            break;
          }
          const hlonger = next.value as BoneHash;
          if (hlonger.value & 0) {
            surplus++;
          } else {
            surplus--;
          }
          if (surplus < 0) {
            const hshooterNext = shooterHash[++i];
            if (!hshooterNext) {
              isValied = false;
              break;
            }
            if (hshooterNext.value === hlonger.value) {
              continue;
            } else {
              isValied = false;
              break;
            }
          } else {
            continue;
          }
        }
      }
    }
    return isValied;
  }

  public static SaveMetadata(rootDir: string, metadata: SkeletonMetadata) {
    fs.writeFileSync(
      `${rootDir}${metadata.fileName}.meta`,
      JSON.stringify(metadata, null, 2)
    );
  }
}
