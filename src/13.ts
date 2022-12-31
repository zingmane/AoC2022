// @deno-types="@types/lodash/fp"
import fp from "lodash/fp";
import { splitByEmptyRows, splitByNewline } from "./helper.ts";
import { match, P } from "ts-pattern";

export type NumberOrArray = number | NumberOrArray[];

const isArray = (x: unknown): x is Array<unknown> => Array.isArray(x);
const isNumber = (x: unknown): x is number => typeof x === "number";
const toArray = (tuple: [any, any]) => [JSON.parse(tuple[0]), JSON.parse(tuple[1])];

const normalizeArray = ([array1, array2]: [any, any]) =>
  match([array1, array2])
    .with([P._, undefined], () => [array1, array2])
    .with([undefined, P._], () => [array1, array2])
    .with([P.when(isArray), P.when(isArray)], () => [array1, array2])
    .with([P.when(isArray), P.when(isNumber)], ([a1, a2]: [Array<unknown>, number]) => [a1, [a2]])
    .with([P.when(isNumber), P.when(isArray)], ([a1, a2]: [number, Array<unknown>]) => [[a1], a2])
    .with([P.when(isNumber), P.when(isNumber)], () => [array1, array2])
    .run();

export const compareArrays = ([array1, array2]: [NumberOrArray, NumberOrArray]) => {
  const isInRightOrder = (array1: NumberOrArray, array2: NumberOrArray): boolean | undefined => {
    const tuples = fp.zip(array1 as any, array2 as any) as unknown as [NumberOrArray, NumberOrArray][];

    for (const [item1, item2] of tuples) {
      if (fp.isNil(item1)) {
        return true;
      }

      if (fp.isNil(item2)) {
        return false;
      }
      const tuple = normalizeArray([item1, item2]) as unknown as [NumberOrArray, NumberOrArray];

      if (isArray(tuple[0])) {
        const res = compareArrays(tuple);
        if (!fp.isNil(res)) {
          return compareArrays(tuple);
        }
      }

      if (item1 < item2) {
        return true;
      }
      if (item1 > item2) {
        return false;
      }
    }
  };

  return isInRightOrder(array1, array2);
};

const sumRightIndices = (isRightList: boolean[]) => {
  let i = 0;
  return fp.reduce(
    (acc: number, cur: boolean) => {
      i++;
      return cur ? acc + i : acc;
    },
    0,
    isRightList,
  );
};

const getPart1 = fp.compose(
  sumRightIndices,
  fp.map(compareArrays),
  fp.map(toArray),
  fp.map(fp.compact),
  fp.map(splitByNewline),
  splitByEmptyRows,
);

const divider1 = [[2]];
const divider2 = [[6]];

const multiplyDividersIndices = (arr: NumberOrArray[]) => {
  let i = 1;
  let dividerIndex1 = 0;
  let dividerIndex2 = 0;

  for (const packet of arr) {
    if (fp.isEqual(packet, divider1)) {
      dividerIndex1 = i;
    }
    if (fp.isEqual(packet, divider2)) {
      dividerIndex2 = i;
    }

    i++;
  }

  return dividerIndex1 * dividerIndex2;
};

const addDividers = (arr: NumberOrArray[]) => [...arr, divider1, divider2];
const orderPackets = (arr: NumberOrArray[]) =>
  arr.sort((a, b) => {
    const res = compareArrays([a, b]);
    return res ? -1 : 1;
  });

const getPart2 = fp.compose(
  multiplyDividersIndices,
  orderPackets,
  addDividers,
  fp.map(JSON.parse),
  fp.compact,
  splitByNewline,
);

export const run = (raw: string) => {
  const part1 = getPart1(raw);
  const part2 = getPart2(raw);

  return [part1, part2];
};
