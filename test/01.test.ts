import { assertEquals } from "testing/asserts.ts";

import * as day01 from "../src/01.ts";

const input = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`

Deno.test('day 01', () => {
  assertEquals(day01.run(input), [24000, 45000]);
});
