// @deno-types="@types/lodash/fp"
import fp from "lodash/fp";
import { splitByEmptyRows, splitByNewline } from "./helper.ts";

export const run = (raw: string) => {
  const splitUp = fp.compose(
    fp.map(splitByNewline),
    splitByEmptyRows,
  );

  const elvesCaloriesMap = splitUp(raw);

  const getPart1 = fp.compose(
    fp.max,
    fp.map(fp.sum),
    fp.map(fp.map(fp.parseInt(10))),
  );

  const orderCalories = (calories: number[]) => calories.sort((a, b) => b - a);

  const getPart2 = fp.compose(
    fp.sum,
    fp.take(3),
    orderCalories,
    fp.map(fp.sum),
    fp.map(fp.map(fp.parseInt(10))),
  );

  const part1 = getPart1(elvesCaloriesMap);
  const part2 = getPart2(elvesCaloriesMap);

  return [part1, part2];
};
