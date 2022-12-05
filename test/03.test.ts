import { assertEquals } from "testing/asserts.ts";

import * as day03 from "../src/03.ts";

const input = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`;

Deno.test("getCharScore", () => {
  assertEquals(day03.getCharScore("z"), 26);
  assertEquals(day03.getCharScore("c"), 3);
  assertEquals(day03.getCharScore("Z"), 52);
  assertEquals(day03.getCharScore("f"), 6);
  assertEquals(day03.getCharScore("F"), 32);
});

Deno.test("getDuplicateCharOutOf2", () => {
  assertEquals(day03.getDuplicateCharOutOf2(["abcdef", "fghijklmn"]), "f");
});

Deno.test("getDuplicateCharOutOf3", () => {
  assertEquals(day03.getDuplicateCharOutOf3(["abcdefg", "defghij", "tzitztzutzue"]), "e");
});

Deno.test("day 03 - part1", () => {
  assertEquals(day03.run(input)?.[0], 157);
});

Deno.test("day 03 - part2", () => {
  assertEquals(day03.run(input)?.[1], 70);
});
