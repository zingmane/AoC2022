import { assertEquals } from "testing/asserts.ts";

import * as day07 from "../src/07.ts";

const input = `
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`;

Deno.test("day 07 - part1", () => {
  assertEquals(day07.run(input)?.[0], 95437);
});

Deno.test("day 07 - part2", () => {
  assertEquals(day07.run(input)?.[1], 24933642);
});
