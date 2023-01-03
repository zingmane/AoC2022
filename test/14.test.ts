import { assertEquals } from "testing/asserts.ts";

import * as day14 from "../src/14.ts";

const input = `
498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
`;

Deno.test("day 14 - part1", () => {
  assertEquals(day14.run(input)?.[0], 24);
});

Deno.test("day 14 - part2", () => {
  assertEquals(day14.run(input)?.[1], 140);
});
