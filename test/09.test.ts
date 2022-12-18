import { assertEquals } from "testing/asserts.ts";

import * as day09 from "../src/09.ts";
import { tailMustKeepUpAlongside, tailMustKeepUpDiagonally } from "../src/09.ts";

Deno.test("tailMustKeepUpDiagonally", () => {
  assertEquals(tailMustKeepUpDiagonally({ x: 0, y: 0 }, { x: 0, y: 2 }), false);
  assertEquals(tailMustKeepUpDiagonally({ x: 0, y: 0 }, { x: 1, y: 3 }), true);
  assertEquals(tailMustKeepUpDiagonally({ x: 0, y: 0 }, { x: 1, y: 0 }), false);
  assertEquals(tailMustKeepUpDiagonally({ x: 0, y: 0 }, { x: 2, y: 1 }), true);
});

Deno.test("tailMustKeepUpAlongside", () => {
  assertEquals(tailMustKeepUpAlongside({ x: 0, y: 0 }, { x: 0, y: 1 }), false);
  assertEquals(tailMustKeepUpAlongside({ x: 0, y: 0 }, { x: 0, y: 2 }), true);
  assertEquals(tailMustKeepUpAlongside({ x: 0, y: 0 }, { x: 1, y: 0 }), false);
  assertEquals(tailMustKeepUpAlongside({ x: 0, y: 0 }, { x: 2, y: 0 }), true);

  assertEquals(tailMustKeepUpAlongside({ x: 2, y: 2 }, { x: 1, y: 2 }), false);
  assertEquals(tailMustKeepUpAlongside({ x: 2, y: 2 }, { x: 0, y: 2 }), true);
});

const input = `
R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`;

Deno.test("day 09 - part1", () => {
  assertEquals(day09.run(input)?.[0], 13);
});

// Deno.test("day 09 - part2", () => {
//   assertEquals(day09.run(input)?.[1], 8);
// });
