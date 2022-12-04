import { assertEquals } from "testing/asserts.ts";

import * as day03 from "../src/03.ts";

const input = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`

Deno.test('getCharScore', () => {
  assertEquals(day03.getCharScore("z"), 26);
  assertEquals(day03.getCharScore("c"), 3);
  assertEquals(day03.getCharScore("Z"), 52);
  assertEquals(day03.getCharScore("f"), 6);
  assertEquals(day03.getCharScore("F"), 32);
});

Deno.test('getCharScore', () => {
  assertEquals(day03.getDuplicateChar(["abcdef", "fghijklmn"]), "f");
});

Deno.test('day 03', () => {
  assertEquals(day03.run(input), [157]);
});
