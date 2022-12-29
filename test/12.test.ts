import { assertEquals } from "testing/asserts.ts";

import * as day12 from "../src/12.ts";

const input = `
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
`;

Deno.test("day 12 - part1", () => {
  assertEquals(day12.run(input)?.[0], 31);
});

Deno.test("day 12 - part2", () => {
  assertEquals(day12.run(input)?.[1], 29);
});
