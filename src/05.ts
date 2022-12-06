// @deno-types="@types/lodash/fp"
import fp from "lodash/fp";
import { splitByEmptyRows, splitByNewline } from "./helper.ts";

export type Instruction = {
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
    if (fp.isEmpty(value)) {
      res.push(null);
    } else {
      res.push(str[i]);
    }
  }
  return res;
};

export type Stack = {
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

export const executeInstruction = (ins: Instruction) => (stack: Stack) => {
  const oldFromStack = fp.get(ins.from, stack);
  const oldToStack = fp.get(ins.to, stack);

  const cutEndBy = (ff: number) => (arr: string[]) => fp.slice(arr.length - ff, arr.length, arr);

  const trans = fp.compose(
    fp.reverse,
    cutEndBy(ins.move),
  )(oldFromStack);

  const newFromStack = fp.take(oldFromStack.length - ins.move, oldFromStack);
  const newToStack = fp.concat(oldToStack, trans);

  return { ...stack, [ins.from]: newFromStack, [ins.to]: newToStack };
};

const applyInstructions = (stack: Stack) =>
  fp.reduce((acc: Stack, curr: Instruction) => {
    return executeInstruction(curr)(acc);
  }, stack);

const getPart1 = (raw: string) => {
  const [rawStack, rawInstructions] = splitByEmptyRows(raw);

  const stack: Stack = initializeStack(rawStack);
  const instructions: Instruction[] = initializeInstructions(rawInstructions);

  return fp.compose(
    fp.join(""),
    fp.values,
    fp.mapValues(fp.last),
    applyInstructions(stack),
  )(instructions);
};

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
  const part1 = getPart1(raw);
  // const part2 = getPart2(raw);
  const part2 = "";

  return [part1, part2];
};
