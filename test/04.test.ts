import { assertEquals } from "testing/asserts.ts";

import * as day04 from "../src/04.ts";

const input = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

Deno.test("getCharScore", () => {
  assertEquals(day04.getRange("2-7"), [2, 3, 4, 5, 6, 7]);
  assertEquals(day04.getRange("80-80"), [80]);
  assertEquals(day04.getRange("10-12"), [10, 11, 12]);
  // assertEquals(day04.getRange("5-3"), [5]);
});

Deno.test("isOneContainingTheOther", () => {
  assertEquals(day04.isOneContainingTheOther([[1, 2], [2, 3]]), false);
  assertEquals(day04.isOneContainingTheOther([[1, 2, 3], [5, 6]]), false);
  assertEquals(day04.isOneContainingTheOther([[1, 2, 3, 4], [2, 3]]), true);
  assertEquals(day04.isOneContainingTheOther([[2, 3], [1, 2, 3, 4]]), true);
  assertEquals(day04.isOneContainingTheOther([[1, 2], [1, 2, 3, 4]]), true);
  assertEquals(day04.isOneContainingTheOther([[1, 2, 3, 4], [1, 2, 3, 4]]), true);
  assertEquals(day04.isOneContainingTheOther([[1], []]), true);
});

Deno.test("day 04 - part1", () => {
  assertEquals(day04.run(input)?.[0], 2);
});

// Deno.test("day 04 - part2", () => {
//   assertEquals(day04.run(input)?.[1], 70);
// });
