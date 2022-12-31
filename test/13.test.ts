import { assertEquals } from "testing/asserts.ts";

import * as day13 from "../src/13.ts";
import { compareArrays, NumberOrArray } from "../src/13.ts";

const input = `
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]
`;

Deno.test("compareArrays1", () => {
  const arr1 = [[1, 1, 3, 1, 1], [1, 1, 5, 1, 1]] as [NumberOrArray, NumberOrArray];
  assertEquals(compareArrays(arr1), true);
});

Deno.test("compareArrays2", () => {
  const arr = [[[1], [2, 3, 4]], [[1], 4]] as [NumberOrArray, NumberOrArray];
  assertEquals(compareArrays(arr), true);
});

Deno.test("compareArrays3", () => {
  const arr = [[9], [[8, 7, 6]]] as [NumberOrArray, NumberOrArray];
  assertEquals(compareArrays(arr), false);
});

Deno.test("compareArrays4", () => {
  const arr = [[[4, 4], 4, 4], [[4, 4], 4, 4, 4]] as [NumberOrArray, NumberOrArray];
  assertEquals(compareArrays(arr), true);
});

Deno.test("compareArrays5", () => {
  const arr = [[7, 7, 7, 7], [7, 7, 7]] as [NumberOrArray, NumberOrArray];
  assertEquals(compareArrays(arr), false);
});
Deno.test("compareArrays6", () => {
  const arr = [[], [3]] as [NumberOrArray, NumberOrArray];
  assertEquals(compareArrays(arr), true);
});
Deno.test("compareArrays7", () => {
  const arr = [[[[]]], [[]]] as [NumberOrArray, NumberOrArray];
  assertEquals(compareArrays(arr), false);
});
Deno.test("compareArrays8", () => {
  const arr = [[1, [2, [3, [4, [5, 6, 7]]]], 8, 9], [1, [2, [3, [4, [5, 6, 0]]]], 8, 9]] as [
    NumberOrArray,
    NumberOrArray,
  ];
  assertEquals(compareArrays(arr), false);
});

Deno.test("day 13 - part1", () => {
  assertEquals(day13.run(input)?.[0], 13);
});

// Deno.test("day 13 - part2", () => {
//   assertEquals(day13.run(input)?.[1], "");
// });
