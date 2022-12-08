import { assertEquals } from "testing/asserts.ts";

import * as day06 from "../src/06.ts";

const input1 = "mjqjpqmgbljsphdztnvjfqwrcgsmlb"; // 7
const input2 = "bvwbjplbgvbhsrlpgdmjqwftvncz"; // 5
const input3 = "nppdvjthqldpwncqszvftbrmjlhg"; // 6
const input4 = "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"; // 10
const input5 = "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"; // 11

Deno.test("getMarkerPosition - marker length 4", () => {
  assertEquals(day06.getMarkerPosition(input1), 7);
  assertEquals(day06.getMarkerPosition(input2), 5);
  assertEquals(day06.getMarkerPosition(input3), 6);
  assertEquals(day06.getMarkerPosition(input4), 10);
});

Deno.test("getMarkerPosition - marker length 14", () => {
  assertEquals(day06.getMarkerPosition(input1, 14), 19);
  assertEquals(day06.getMarkerPosition(input2, 14), 23);
  assertEquals(day06.getMarkerPosition(input3, 14), 23);
  assertEquals(day06.getMarkerPosition(input4, 14), 29);
});

Deno.test("day 06 - part1", () => {
  assertEquals(day06.run(input5)?.[0], 11);
});

Deno.test("day 06 - part2", () => {
  assertEquals(day06.run(input5)?.[1], 26);
});
