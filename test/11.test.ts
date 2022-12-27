import { assertEquals } from "testing/asserts.ts";

import * as day11 from "../src/11.ts";

const input = `
Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
`;

Deno.test("day 11 - part1", () => {
  assertEquals(day11.run(input)?.[0], 10605);
});

Deno.test("day 11 - part2", () => {
  assertEquals(day11.run(input)?.[1], 2713310158);
});
