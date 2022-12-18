// @deno-types="@types/lodash/fp"
import fp from "lodash/fp";
import { match } from "ts-pattern";
import { splitByBlank, splitByNewline, Values } from "./helper.ts";

const Direction = {
  UP: "up",
  RIGHT: "right",
  DOWN: "down",
  LEFT: "left",
} as const;
type Direction = Values<typeof Direction>;

export type Instruction = {
  direction: Direction;
  steps: number;
};

export type Position = {
  x: number;
  y: number;
};

const mapToDirection = (dir: string) =>
  match(dir)
    .with("U", () => Direction.UP)
    .with("R", () => Direction.RIGHT)
    .with("D", () => Direction.DOWN)
    .with("L", () => Direction.LEFT)
    .run();

const toInstruction = ([direction, steps]: [string, string]) => {
  return {
    direction: mapToDirection(direction),
    steps: fp.parseInt(10, steps),
  };
};

const parseInstructions = fp.compose(
  fp.map(toInstruction),
  fp.map(splitByBlank),
  fp.compact,
  splitByNewline,
);

export const tailMustKeepUpDiagonally = (headPos: Position, tailPos: Position) =>
  headPos.x !== tailPos.x && headPos.y !== tailPos.y &&
  (Math.abs(headPos.x - tailPos.x) > 1 || Math.abs(headPos.y - tailPos.y) > 1);

export const tailMustKeepUpAlongside = (headPos: Position, tailPos: Position) =>
  (Math.abs(headPos.x - tailPos.x) > 1 && headPos.y === tailPos.y) ||
  (Math.abs(headPos.y - tailPos.y) > 1 && headPos.x === tailPos.x);

const toVisitedMatrix = (instructions: Instruction[]) => {
  let tailPosition = { x: 0, y: 0 };
  let headPosition = { x: 0, y: 0 };

  let visitedTailPositions = {};

  const goRight = () => {
    headPosition = { x: headPosition.x + 1, y: headPosition.y };
    if (tailMustKeepUpDiagonally(headPosition, tailPosition)) {
      tailPosition = { x: tailPosition.x + 1, y: headPosition.y };
    } else if (tailMustKeepUpAlongside(headPosition, tailPosition)) {
      tailPosition = { x: tailPosition.x + 1, y: tailPosition.y };
    } else {
      tailPosition = { x: tailPosition.x, y: tailPosition.y };
    }
  };

  const goLeft = () => {
    headPosition = { x: headPosition.x - 1, y: headPosition.y };
    if (tailMustKeepUpDiagonally(headPosition, tailPosition)) {
      tailPosition = { x: tailPosition.x - 1, y: headPosition.y };
    } else if (tailMustKeepUpAlongside(headPosition, tailPosition)) {
      tailPosition = { x: tailPosition.x - 1, y: tailPosition.y };
    } else {
      tailPosition = { x: tailPosition.x, y: tailPosition.y };
    }
  };

  const goUp = () => {
    headPosition = { x: headPosition.x, y: headPosition.y + 1 };
    if (tailMustKeepUpDiagonally(headPosition, tailPosition)) {
      tailPosition = { x: headPosition.x, y: tailPosition.y + 1 };
    } else if (tailMustKeepUpAlongside(headPosition, tailPosition)) {
      tailPosition = { x: tailPosition.x, y: tailPosition.y + 1 };
    } else {
      tailPosition = { x: tailPosition.x, y: tailPosition.y };
    }
  };

  const goDown = () => {
    headPosition = { x: headPosition.x, y: headPosition.y - 1 };
    if (tailMustKeepUpDiagonally(headPosition, tailPosition)) {
      tailPosition = { x: headPosition.x, y: tailPosition.y - 1 };
    } else if (tailMustKeepUpAlongside(headPosition, tailPosition)) {
      tailPosition = { x: tailPosition.x, y: tailPosition.y - 1 };
    } else {
      tailPosition = { x: tailPosition.x, y: tailPosition.y };
    }
  };

  for (const instruction of instructions) {
    for (let step = 0; step < instruction.steps; step++) {
      match(instruction.direction)
        .with(Direction.UP, () => goUp())
        .with(Direction.RIGHT, () => goRight())
        .with(Direction.DOWN, () => goDown())
        .with(Direction.LEFT, () => goLeft())
        .run();

      visitedTailPositions = fp.assoc(tailPosition.x + "_" + tailPosition.y, true, visitedTailPositions);
    }
  }

  return visitedTailPositions;
};

const countTailPositions = (tailPositions: Record<string, boolean>) => Object.keys(tailPositions).length;

const getPart1 = fp.compose(
  countTailPositions,
  toVisitedMatrix,
  parseInstructions,
);

const getPart2 = (_raw: any) => "";

export const run = (raw: string) => {
  const part1 = getPart1(raw);
  const part2 = getPart2(raw);

  return [part1, part2];
};
