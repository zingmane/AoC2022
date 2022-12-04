// @deno-types="@types/lodash/fp"
import fp from "lodash/fp";
import { splitByBlank, splitByNewline, Values } from "./helper.ts";
import { match, P } from "ts-pattern";

const splitIntoHalves = (str: string) => {
  const midIndex = str.length / 2;
  return [str.slice(0, midIndex), str.slice(midIndex)];
};

export const getDuplicateChar = ([str1, str2]: [string, string]) => {
  for (let i = 0; i < str1.length; i++) {
    const char = str1.charAt(i);
    if (fp.contains(char, str2)) {
      return char;
    }
  }
};

export const getCharScore = (char: string) => {
  const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  return ALPHABET.indexOf(char) + 1;
};

const getDuplicateItemScore = fp.compose(
  fp.sum,
  fp.map(getCharScore),
  fp.map(getDuplicateChar),
  fp.map(splitIntoHalves),
  fp.compact,
  splitByNewline,
);

export const run = (raw: string) => {
  const part1 = getDuplicateItemScore(raw);

  return [part1];
};
