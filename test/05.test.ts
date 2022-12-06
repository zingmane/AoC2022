import { assertEquals } from "testing/asserts.ts";

import * as day05 from "../src/05.ts";
import { Instruction, Stack } from "../src/05.ts";
import { splitByEmptyRows } from "../src/helper.ts";

const input = `
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`;

Deno.test("toInstruction", () => {
  assertEquals(day05.toInstruction("move 1 from 2 to 1"), { move: 1, from: 2, to: 1 });
  assertEquals(day05.toInstruction("move 3 from 1 to 3"), { move: 3, from: 1, to: 3 });
});

Deno.test("toStackLine", () => {
  assertEquals(day05.toStackLine(1)("[Z] [M] [P]"), ["Z", "M", "P"]);
  assertEquals(day05.toStackLine(2)("  X   X   X"), ["X", "X", "X"]);
});

Deno.test("initializeStack", () => {
  const [rawStack, _rawInstructions] = splitByEmptyRows(input);
  assertEquals(day05.initializeStack(rawStack), {
    1: [
      "Z",
      "N",
    ],
    2: [
      "M",
      "C",
      "D",
    ],
    3: [
      "P",
    ],
  });
});

Deno.test("executeInstruction", () => {
  const instruction: Instruction = {
    move: 2,
    from: 1,
    to: 3,
  };
  const stack: Stack = {
    1: ["A", "B", "C"],
    2: ["D", "E", "F"],
    3: ["G", "H"],
  };

  const expected = {
    "1": ["A"],
    "2": ["D", "E", "F"],
    "3": ["G", "H", "C", "B"],
  };
  assertEquals(day05.executeInstruction(instruction)(stack), expected);
});

Deno.test("day 05 - part1", () => {
  assertEquals(day05.run(input)?.[0], "CMZ");
});

// Deno.test("day 05 - part2", () => {
//   assertEquals(day05.run(input)?.[1], 4);
// });
