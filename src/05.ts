// @deno-types="@types/lodash/fp"
import fp from "lodash/fp";
import { splitByNewline } from "./helper.ts";

type Instruction = {
  move: number;
  from: number;
  to: number;
};

export const toInstruction = (str: string): Instruction => {
  const res = str.match(/move (\d) from (\d) to (\d)/);

  if (res?.[1] === undefined || res?.[2] === undefined || res?.[3] === undefined) {
    throw new Error("error in instruction");
  }

  return {
    move: fp.parseInt(10, res[1]),
    from: fp.parseInt(10, res[2]),
    to: fp.parseInt(10, res[3]),
  };
};

export const toStackLine = (start: number) => (str: string) => {
  const res = [];
  for (let i = start; i < str.length; i += 4) {
    const value = fp.trim(str[i]);
    !fp.isEmpty(value) && res.push(str[i]);
  }
  return res;
};

type Stack = {
  [key: number]: string[];
};

export const toStack = (sss: [[string, ...string[]]]) => {
  const stack: Stack = {};

  for (const ss of sss) {
    const [index, ...rest] = ss;
    stack[fp.parseInt(10, index)] = fp.compact(rest);
  }

  return stack;
};

export const initializeStack = fp.compose(
  toStack,
  fp.unzip,
  fp.map(toStackLine(1)),
  fp.reverse,
  fp.compact,
  splitByNewline,
);

export const initializeInstructions = fp.compose(
  fp.map(toInstruction),
  fp.compact,
  splitByNewline,
);

// const [rawStack, rawInstructions] = splitByEmptyRows(input);

// const getPart1 = fp.compose(
//   fp.size,
//   fp.filter(fp.identity),
//   fp.map(isOneContainingTheOther),
//   fp.map(fp.map(getRange)),
//   fp.map(splitByComma),
//   fp.compact,
//   splitByNewline,
// );

// const getPart2 = fp.compose(
//   fp.size,
//   fp.filter(fp.identity),
//   fp.map(isOverlapping),
//   fp.map(fp.map(getRange)),
//   fp.map(splitByComma),
//   fp.compact,
//   splitByNewline,
// );

export const run = (raw: string) => {
  // const part1 = getPart1(raw);
  // const part2 = getPart2(raw);
  const part1 = "";
  const part2 = "";

  return [part1, part2];
};
