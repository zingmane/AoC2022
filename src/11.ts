// @deno-types="@types/lodash/fp"
import fp from "lodash/fp";
import { splitByEmptyRows, splitByNewline } from "./helper.ts";

const worryIncrease = 3;

const parseItems = (raw: string): number[] =>
  fp.compose(
    fp.map(fp.parseInt(10)),
    fp.split(","),
    (raw: string) => raw.match(/.*: ([\d+,\s]+\d+)/)?.[1],
  )(raw);

const parseOperation = (raw: string) => raw.match(/Operation: new = (.*)/)?.[1] ?? "nn";
const parseDivisibleBy = (raw: string): number => fp.parseInt(10, raw.match(/.* divisible by (\d+)/)?.[1] ?? "1");
const parseMonkeyId = (raw: string) => raw.match(/Monkey (\d+):/)?.[1] ?? "nn";
const parseTargetMonkeyId = (raw: string) => raw.match(/.* throw to monkey (.*)/)?.[1] ?? "nn";

type Monkey = {
  id: string;
  items: number[];
  calcWorryLevel: (old: number) => number;
  testWorryLevel: (old: number) => boolean;
  okTargetMonkeyId: string;
  nokTargetMonkeyId: string;
  inspectCount: number;
  divisibleBy: number;
};

const getMonkeyById = (id: string) => (monkeys: Monkey[]) =>
  fp.find((monkey: Monkey) => id === monkey.id, monkeys) as Monkey;

const toMonkeySpecs = (raw: string): Monkey => {
  const specLines = fp.compact(splitByNewline(raw));

  const id = parseMonkeyId(specLines[0]);
  const items = parseItems(specLines[1]);
  const operation = parseOperation(specLines[2]);
  const divisibleBy = parseDivisibleBy(specLines[3]);
  const okTargetMonkeyId = parseTargetMonkeyId(specLines[4]);
  const nokTargetMonkeyId = parseTargetMonkeyId(specLines[5]);

  return {
    id,
    items,
    // deno-lint-ignore no-unused-vars
    calcWorryLevel: (old: number) => eval(operation),
    testWorryLevel: (old: number) => old % divisibleBy === 0,
    okTargetMonkeyId,
    nokTargetMonkeyId,
    inspectCount: 0,
    divisibleBy,
  };
};

const parseMonkeySpecs = fp.compose(
  fp.map(toMonkeySpecs),
  splitByEmptyRows,
);

const getSuperModulo = (monkeys: Monkey[]) =>
  Object.keys(monkeys).reduce((acc, cur) => {
    const divisibleBy = fp.get([cur, "divisibleBy"], monkeys);
    return divisibleBy * acc;
  }, 1);

const playRounds = (rounds: number, useSuperModulo = false) => (monkeys: Monkey[]) => {
  const calcNewWorryItem = (monkey: Monkey, worryItem: number) => {
    if (useSuperModulo) {
      const superModulo = getSuperModulo(monkeys);
      return monkey.calcWorryLevel(worryItem) % superModulo;
    } else {
      return Math.floor(monkey.calcWorryLevel(worryItem) / worryIncrease);
    }
  };

  const doRound = (m: Monkey[]) => {
    return fp.reduce(
      (accMonkeys: Monkey[], monkey: Monkey) => {
        // monkey could have changed over iterations
        const currentMonkey = getMonkeyById(monkey.id)(accMonkeys);
        for (const worryItem of currentMonkey.items) {
          const newWorryItem = calcNewWorryItem(monkey, worryItem);
          const isWorryTest = monkey.testWorryLevel(newWorryItem);

          const monkeyIdToChange = isWorryTest ? monkey.okTargetMonkeyId : monkey.nokTargetMonkeyId;
          const newItems = getMonkeyById(monkeyIdToChange)(accMonkeys).items;
          accMonkeys = fp.assoc([monkeyIdToChange, "items"], [...newItems, newWorryItem], accMonkeys);
        }

        const newInspectCount = currentMonkey.inspectCount + currentMonkey.items.length;
        const currentMonkeyWithEmptyItems = { ...monkey, items: [], inspectCount: newInspectCount };

        return fp.assoc(monkey.id, currentMonkeyWithEmptyItems, accMonkeys);
      },
      m,
      m,
    );
  };

  for (let i = 0; i < rounds; i++) {
    monkeys = doRound(monkeys);
  }

  return monkeys;
};

const getLevelOfMonkeyBusiness = fp.compose(
  fp.reduce((acc: number, cur: number) => acc * cur, 1),
  fp.take(2),
  (inspectCounts: number[]) => inspectCounts.sort((a, b) => b - a),
  fp.map(fp.prop("inspectCount")),
);

const getPart1 = fp.compose(
  getLevelOfMonkeyBusiness,
  playRounds(20),
  parseMonkeySpecs,
);

const getPart2 = fp.compose(
  getLevelOfMonkeyBusiness,
  playRounds(10_000, true),
  parseMonkeySpecs,
);

export const run = (raw: string) => {
  const part1 = getPart1(raw);
  const part2 = getPart2(raw);

  return [part1, part2];
};
