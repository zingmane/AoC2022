// @deno-types="@types/lodash/fp"
import fp from "lodash/fp";
import { splitByEmptyRows, splitByNewline } from "./helper.ts";

export const run = (raw: string) => {
  const splitUp = fp.compose(
    fp.map(splitByNewline),
    splitByEmptyRows,
  );

  const elvesCaloriesMap = splitUp(raw);

  const getHighestCalorieSum = fp.compose(
    fp.max,
    fp.map(fp.sum),
    fp.map(fp.map(fp.parseInt(10))),
  );

  const result = getHighestCalorieSum(elvesCaloriesMap);

  return result;
};
