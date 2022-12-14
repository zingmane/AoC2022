// @deno-types="@types/lodash/fp"
import fp from "lodash/fp";
import { splitByNewline } from "./helper.ts";

type FILE = {
  size: number;
  name: string;
};

type DIR = {
  size?: number;
  name: string;
};

const dirRegex = /dir (.*)/;
const fileRegex = /^(\d+) (.*)/;
const commandListRegex = /\$ ls/;
const commandChangeDirToRegex = /\$ cd (\w.*)$/;
const commandChangeDirOutRegex = /\$ cd \.\.$/;
const commandChangeDirRootRegex = /\$ cd \/$/;

const isDir = (str: string): str is never => dirRegex.test(str);
const getDir = (str: string, path: string): DIR => {
  const res = str.match(dirRegex);
  return {
    name: path + "/" + res?.[1] ?? "NN",
  };
};
const isFile = (str: string): str is never => fileRegex.test(str);
const getFile = (str: string): FILE => {
  const res = str.match(fileRegex);
  return {
    name: res?.[2] ?? "nn",
    size: fp.parseInt(10, res?.[1] ?? "") ?? 0,
  };
};
const isCommandChangeDirTo = (str: string): str is never => commandChangeDirToRegex.test(str);
const getCommandChangeDirTo = (str: string) => {
  const res = str.match(commandChangeDirToRegex);
  return res?.[1] ?? "nn";
};
const isCommandChangeDirOut = (str: string): str is never => commandChangeDirOutRegex.test(str);
const isCommandChangeDirRoot = (str: string): str is never => commandChangeDirRootRegex.test(str);
const isCommandList = (str: string): str is never => commandListRegex.test(str);

type DirObj = {
  name: string;
  files: { [key: string]: FILE };
  dirs: DIR[];
  size?: number;
};

const toDir = (input: string) => {
  let curPath: string[] = ["root"];

  const dirs = new Map<string, DirObj>(
    [
      ["root", { name: "root" } as DirObj],
    ],
  );

  for (const line of input) {
    const dirObj: DirObj = dirs.get(curPath.join("/")) ?? {} as DirObj;
    switch (true) {
      case isCommandChangeDirRoot(line):
        curPath = ["root"];
        break;
      case isCommandChangeDirOut(line):
        curPath.pop();
        break;
      case isCommandChangeDirTo(line): {
        const dir = getCommandChangeDirTo(line);
        curPath.push(dir);
        break;
      }
      case isCommandList(line):
        continue;
      case isDir(line): {
        const dir = getDir(line, curPath.join("/"));
        const curDirs = dirObj.dirs ?? [];
        dirObj.dirs = [...curDirs, dir];
        dirs.set(curPath.join("/"), dirObj);
        break;
      }
      case isFile(line): {
        const file = getFile(line);
        const curFiles = dirObj.files ?? {};
        dirObj.files = { ...curFiles, [file.name]: file };
        dirs.set(curPath.join("/"), dirObj);
        break;
      }
      default:
        console.log("Didn't match");
        break;
    }
  }

  return dirs;
};

const getDirDepth = (key: string) => (key.match(/\//g) || []).length;

const getHierarchyDepth = (map: Map<string, DirObj>) => {
  let depth = 0;
  for (const key of map.keys()) {
    const keyDepth = getDirDepth(key);
    if (keyDepth > depth) {
      depth = keyDepth;
    }
  }
  return depth;
};

const calculateDirSizes = (map: Map<string, DirObj>) => {
  const depth = getHierarchyDepth(map);
  for (let curDepth = depth; curDepth >= 0; curDepth--) {
    for (const [key, value] of map) {
      if (getDirDepth(key) === curDepth) {
        const sizeFiles = Object.keys(value.files ?? {}).reduce((acc, key) => {
          acc += value.files[key].size ?? 0;
          return acc;
        }, 0);

        const sizeDirs = (value.dirs ?? []).map((dir) => {
          return map.get(dir.name)?.size ?? 0;
        }).reduce((acc, value) => acc + value, 0);

        map.set(key, { ...value, size: sizeFiles + sizeDirs });
      }
    }
  }
  return map;
};

const filterBySize = (maxSize: number) => (map: Map<string, DirObj>) => {
  const newMap = new Map<string, DirObj>();

  for (const [key, value] of map) {
    if (value.size && value?.size < maxSize) {
      newMap.set(key, value);
    }
  }

  return newMap;
};

const sumSize = (map: Map<string, DirObj>) => {
  let size = 0;
  for (const value of map.values()) {
    size += value.size ?? 0;
  }

  return size;
};

const sizeThreshold = 100000;

const buildDirectory = fp.compose(
  toDir,
  fp.compact,
  splitByNewline,
);

const getPart1 = fp.compose(
  sumSize,
  filterBySize(sizeThreshold),
  calculateDirSizes,
  buildDirectory,
);

export const run = (raw: string) => {
  const part1 = getPart1(raw);

  return [part1, "part2"];
};
