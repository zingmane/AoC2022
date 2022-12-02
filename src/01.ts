// @deno-types="@types/lodash/fp"
import fp from "lodash/fp";

const splitByEmptyRows = (str: string) => str.split(/\n\s*\n/g);
const splitByNewline = (str: string) => str.split(/\n/g);

export const run = (raw: string) => {
  const splitUp = fp.compose(
    fp.map(splitByNewline),
    splitByEmptyRows,
  );

  const xxx = splitUp(raw);

  console.log(`###LOG###: ${xxx[0]}`);
  console.log(`###LOG###: ${xxx[1]}`);
  console.log(`###LOG###: ${xxx[2]}`);
  console.log(`###LOG###: ${xxx[3]}`);
  console.log(`###LOG###: ${xxx[4]}`);

  return "42";
};
