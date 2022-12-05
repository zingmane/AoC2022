import { assertEquals } from "testing/asserts.ts";

import * as day02 from "../src/02.ts";

const input = `A Y
B X
C Z
`;

Deno.test("day 02", () => {
  assertEquals(day02.run(input), [15, 12]);
});
