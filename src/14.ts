// @deno-types="@types/lodash/fp"
import fp from "lodash/fp";
import { splitBy, splitByComma, splitByNewline, Values } from "./helper.ts";

type Coord = {
  x: number;
  y: number;
};

const tupleToCoord = ([x, y]: [x: string, y: string]): Coord => ({ x: fp.parseInt(10, x), y: fp.parseInt(10, y) });

const toCoords = fp.compose(
  fp.map(tupleToCoord),
  fp.map(splitByComma),
);

const getCoords = fp.compose(
  fp.map(toCoords),
  fp.map(splitBy(" -> ")),
  fp.compact,
  splitByNewline,
) as ((raw: string) => Coord[][]);

const getExtent = (coords: Coord[][]) => {
  let xMax = 0;
  let yMax = 0;

  coords.forEach((coordList) =>
    coordList.forEach((coord: Coord) => {
      if (coord.x > xMax) {
        xMax = coord.x;
      }
      if (coord.y > yMax) {
        yMax = coord.y;
      }
    })
  );

  return { xMax, yMax };
};

const Element = {
  ROCK: "#",
  SAND: "O",
  AIR: ".",
  SANDSOURCE: "+",
} as const;
type Element = Values<typeof Element>;

const SandSource = { x: 500, y: 0 };

const createCaveMap = (x: number, y: number) => {
  const row = fp.times(() => Element.AIR, x + 2);
  return fp.times(() => [...row], y + 2) as CaveMap;
};

type CaveMap = Element[][];

const isHorizontalRock = (head: Coord, tail: Coord) => tail.y === head.y;
const isVerticalRock = (head: Coord, tail: Coord) => tail.x === head.x;

const fillWithRocks = (map: CaveMap, coordsList: Coord[][]) => {
  for (const coords of coordsList) {
    for (let i = 0; i < coords.length - 1; i++) {
      i;
      const tail = coords[i];
      const head = coords[i + 1];

      if (isHorizontalRock(head, tail)) {
        const xDistance = head.x - tail.x;
        const y = head.y;

        if (xDistance > 0) {
          for (let d = 0; d <= xDistance; d++) {
            const x = tail.x + d;
            map[y][x] = Element.ROCK;
          }
        } else {
          for (let d = 0; d <= -xDistance; d++) {
            const x = head.x + d;
            map[y][x] = Element.ROCK;
          }
        }
      }
      if (isVerticalRock(head, tail)) {
        const yDistance = head.y - tail.y;
        const x = head.x;

        if (yDistance > 0) {
          for (let d = 0; d <= yDistance; d++) {
            const y = tail.y + d;
            map[y][x] = Element.ROCK;
          }
        } else {
          for (let d = 0; d <= -yDistance; d++) {
            const y = head.y + d;
            map[y][x] = Element.ROCK;
          }
        }
      }
    }
  }

  map[SandSource.y][SandSource.x] = Element.SANDSOURCE;

  return map;
};

const printCaveMap = (caveMap: CaveMap) => {
  const output = caveMap
    .map((col: string[]) => {
      return col.join("");
    }).join("\n");
  console.log(output);
};

const fillWithSand = (map: CaveMap) => {
  let grainOfSandCount = 0;
  let isFallingIntoVoid = false;

  const getElement = (x: number, y: number, map: CaveMap) => {
    try {
      return map[y][x];
    } catch (_error) {
      // fall into void
      return Element.AIR;
    }
  };

  const canFallToBottom = (coord: Coord, map: CaveMap) => {
    const elem = getElement(coord.x, coord.y + 1, map);
    return elem === Element.AIR;
  };
  const canFallToLeft = (coord: Coord, map: CaveMap) => {
    const elem = getElement(coord.x - 1, coord.y + 1, map);
    return elem === Element.AIR;
  };
  const canFallToRight = (coord: Coord, map: CaveMap) => {
    const elem = getElement(coord.x + 1, coord.y + 1, map);
    return elem === Element.AIR;
  };

  const dropGrainOfSand = (map: CaveMap) => {
    let currentCoord = { x: SandSource.x, y: SandSource.y + 1 };
    let canFallFurther = true;

    do {
      if (currentCoord.y >= map.length) {
        canFallFurther = false;
        isFallingIntoVoid = true;
        break;
      }

      if (canFallToBottom(currentCoord, map)) {
        currentCoord = { x: currentCoord.x, y: currentCoord.y + 1 };
        continue;
      }

      if (canFallToLeft(currentCoord, map)) {
        currentCoord = { x: currentCoord.x - 1, y: currentCoord.y + 1 };
        continue;
      }

      if (canFallToRight(currentCoord, map)) {
        currentCoord = { x: currentCoord.x + 1, y: currentCoord.y + 1 };
        continue;
      }

      canFallFurther = false;
    } while (canFallFurther);

    if (!isFallingIntoVoid) {
      map[currentCoord.y][currentCoord.x] = Element.SAND;
      grainOfSandCount++;
    }
  };

  do {
    dropGrainOfSand(map);
  } while (!isFallingIntoVoid);

  // printCaveMap(map);

  return grainOfSandCount;
};

const getPart1 = (raw: string) => {
  const coordsList = getCoords(raw);

  const extent = getExtent(coordsList);
  const emptyCaveMap = createCaveMap(extent.xMax, extent.yMax);
  const caveMap = fillWithRocks(emptyCaveMap, coordsList);

  const grainOfSandCount = fillWithSand(caveMap);
  return grainOfSandCount;
};

// const getPart2 = fp.compose(
//   multiplyDividersIndices,
//   orderPackets,
//   addDividers,
//   fp.map(JSON.parse),
//   fp.compact,
//   splitByNewline,
// );

export const run = (raw: string) => {
  const part1 = getPart1(raw);
  // const part2 = getPart2(raw);
  const part2 = "";

  return [part1, part2];
};
