import { assertEquals } from "testing/asserts.ts";

import * as day08 from "../src/08.ts";
import { getScenicScore } from "../src/08.ts";

Deno.test("rotateArray", () => {
  const arr = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15],
  ];

  const expected = [
    [1, 6, 11],
    [2, 7, 12],
    [3, 8, 13],
    [4, 9, 14],
    [5, 10, 15],
  ];

  assertEquals(day08.rotateArray(arr), expected);
});

Deno.test("getScenicScore", () => {
  assertEquals(getScenicScore([3, 5, 3], 5), 2);
  assertEquals(getScenicScore([3, 3], 5), 2);
  assertEquals(getScenicScore([3], 5), 1);
  assertEquals(getScenicScore([4, 9], 5), 2);

  assertEquals(getScenicScore([3], 5), 1);
  assertEquals(getScenicScore([5, 2], 5), 1);
  assertEquals(getScenicScore([1, 2], 5), 2);
  assertEquals(getScenicScore([3, 5, 3], 5), 2);

  assertEquals(getScenicScore([3, 3, 4], 5), 3);
});

const input = `
30373
25512
65332
33549
35390
`;

Deno.test("day 08 - part1", () => {
  assertEquals(day08.run(input)?.[0], 21);
});

Deno.test("day 08 - part2", () => {
  assertEquals(day08.run(input)?.[1], 8);
});
