// @deno-types="@types/lodash/fp"
import fp from "lodash/fp";

const splitByEmptyRows = (str: string) => str.split(/\n\s*\n/g);
const splitByNewline = (str: string) => str.split(/\n/g);

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
