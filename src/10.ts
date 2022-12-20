// @deno-types="@types/lodash/fp"
import fp from "lodash/fp";
import { match } from "ts-pattern";
import { splitByBlank, splitByNewline, Values } from "./helper.ts";

const Command = {
  ADDX: "addx",
  NOOP: "noop",
} as const;
type Command = Values<typeof Command>;

type Instruction = {
  command: Command;
  value?: number;
};

const toInstruction = (str: string): Instruction => {
  const [command, value] = str.split(" ");
  if (command === "addx") {
    return { command: "addx", value: fp.parseInt(10, value) };
  }
  if (command === "noop") {
    return { command: "noop" };
  } else {
    throw new Error("Invalid command");
  }
};

const parseInstructions = fp.compose(
  fp.map(toInstruction),
  fp.compact,
  splitByNewline,
);

const strengthCycleStep = 40;
const strengthInitCycle = 20;

const doProcess = (initInstructions: Instruction[]) => {
  let cycle = 1;
  let currentInstructionDuration = 0;

  let currentInstruction = fp.first(initInstructions) as Instruction;
  let instructions = fp.tail(initInstructions);
  let signalStrengths = {};
  let X = 1;

  const execInstruction = () => {
    if (currentInstruction?.value) {
      X += currentInstruction?.value;
    }
    currentInstruction = fp.first(instructions) as Instruction;
    instructions = fp.tail(instructions);
    currentInstructionDuration = 0;
  };

  const doCycleProcess = () => {
    while (instructions.length > 0) {
      cycle;
      if (currentInstruction.command === "addx" && currentInstructionDuration >= 2) {
        execInstruction();
      } else if (currentInstruction.command === "noop" && currentInstructionDuration >= 1) {
        execInstruction();
      }

      if (cycle <= 220 && (cycle === strengthInitCycle || (cycle + strengthInitCycle) % strengthCycleStep === 0)) {
        cycle;
        signalStrengths = fp.assoc(cycle, cycle * X, signalStrengths);
      }

      cycle++;
      currentInstructionDuration++;
    }
  };

  doCycleProcess();
  return signalStrengths;
};

const sumSignalStrengths = (signalStrengths: Record<number, number>) => fp.sum(Object.values(signalStrengths));

const getPart1 = fp.compose(
  sumSignalStrengths,
  doProcess,
  parseInstructions,
);

const getPart2 = (_input: any) => "";

export const run = (raw: string) => {
  const part1 = getPart1(raw);
  const part2 = getPart2(raw);

  return [part1, part2];
};
