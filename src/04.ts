// @deno-types="@types/lodash/fp"
import fp from "lodash/fp";
import { splitByComma, splitByNewline } from "./helper.ts";

export type Range = number[];

export const getRange = (str: string) => {
  const [start, end] = str.split("-").map(fp.parseInt(10));

  return fp.range(start, end + 1);
};

export const isOneContainingTheOther = ([r1, r2]: [Range, Range]) =>
  fp.isEmpty(fp.without(r1, r2)) || fp.isEmpty(fp.without(r2, r1));

const getPart1 = fp.compose(
  fp.size,
  fp.filter(fp.identity),
  fp.map(isOneContainingTheOther),
  fp.map(fp.map(getRange)),
  fp.map(splitByComma),
  fp.compact,
  splitByNewline,
);

export const run = (raw: string) => {
  const part1 = getPart1(raw);
  // const part2 = getPart2(raw);

  return [part1, ""];
};
