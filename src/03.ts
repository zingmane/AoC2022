// @deno-types="@types/lodash/fp"
import fp from "lodash/fp";
import { splitByNewline } from "./helper.ts";

const splitIntoHalves = (str: string) => {
  const midIndex = str.length / 2;
  return [str.slice(0, midIndex), str.slice(midIndex)];
};

export const getDuplicateCharOutOf2 = ([str1, str2]: [string, string]) => {
  for (let i = 0; i < str1.length; i++) {
    const char = str1.charAt(i);
    if (fp.contains(char, str2)) {
      return char;
    }
  }
};

export const getDuplicateCharOutOf3 = ([str1, str2, str3]: [string, string, string]) => {
  const duplicateChars = [];

  for (const char of str1) {
    if (fp.contains(char, str2)) {
      duplicateChars.push(char);
    }
  }

  for (const d of duplicateChars) {
    if (fp.contains(d, str3)) {
      return d;
    }
  }
};

export const getCharScore = (char: string) => {
  const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  return ALPHABET.indexOf(char) + 1;
};

const getPart1 = fp.compose(
  fp.sum,
  fp.map(getCharScore),
  fp.map(getDuplicateCharOutOf2),
  fp.map(splitIntoHalves),
  fp.compact,
  splitByNewline,
);

const divideIntoGroupsOfThree = fp.chunk(3);

const getPart2 = fp.compose(
  fp.sum,
  fp.map(getCharScore),
  fp.map(getDuplicateCharOutOf3),
  divideIntoGroupsOfThree,
  fp.compact,
  splitByNewline,
);

export const run = (raw: string) => {
  const part1 = getPart1(raw);
  const part2 = getPart2(raw);

  return [part1, part2];
};
