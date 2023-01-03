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

  return { x: xMax, y: yMax };
};

const Element = {
  ROCK: "#",
  SAND: "O",
  AIR: ".",
  SANDSOURCE: "+",
} as const;
type Element = Values<typeof Element>;

const SandSource = { x: 500, y: 0 };

const createCaveMap = (extent: Coord) => {
  const row = fp.times(() => Element.AIR, extent.x + extent.y + 2);
  return fp.times(() => [...row], extent.y + 3) as CaveMap;
};

type CaveMap = Element[][];

const isHorizontalRock = (head: Coord, tail: Coord) => tail.y === head.y;
const isVerticalRock = (head: Coord, tail: Coord) => tail.x === head.x;

const fillWithRocks = (map: CaveMap, coordsList: Coord[][], withBottom = false) => {
  for (const coords of coordsList) {
    for (let i = 0; i < coords.length - 1; i++) {
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

  if (withBottom) {
    const yBottom = map.length - 1;
    for (let cols = 0; cols < map[0].length; cols++) {
      map[yBottom][cols] = Element.ROCK;
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
const canFall = (coord: Coord, map: CaveMap) => {
  return canFallToBottom(coord, map) || canFallToLeft(coord, map) || canFallToRight(coord, map);
};

const fillWithSand = (map: CaveMap, exitCondition: (coord: Coord) => boolean) => {
  let grainOfSandCount = 0;
  let canDropNextGrainOfSand = true;

  const dropGrainOfSand = (map: CaveMap, exitCondition: (coord: Coord) => boolean) => {
    let currentCoord = { x: SandSource.x, y: SandSource.y };
    let canFallFurther = true;

    do {
      if (exitCondition(currentCoord)) {
        canFallFurther = false;
        canDropNextGrainOfSand = false;
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

    if (canDropNextGrainOfSand) {
      map[currentCoord.y][currentCoord.x] = Element.SAND;
      grainOfSandCount++;
    }
  };

  do {
    dropGrainOfSand(map, exitCondition);
  } while (canDropNextGrainOfSand);

  printCaveMap(map);

  return grainOfSandCount;
};

const getPart1 = (raw: string) => {
  const coordsList = getCoords(raw);

  const extent = getExtent(coordsList);
  const emptyCaveMap = createCaveMap(extent);
  const caveMap = fillWithRocks(emptyCaveMap, coordsList);

  const grainOfSandCount = fillWithSand(caveMap, (currentCoord: Coord) => currentCoord.y >= caveMap.length);
  return grainOfSandCount;
};

const getPart2 = (raw: string) => {
  const coordsList = getCoords(raw);

  const extent = getExtent(coordsList);
  const emptyCaveMap = createCaveMap(extent);
  const caveMap = fillWithRocks(emptyCaveMap, coordsList, true);

  const grainOfSandCount = fillWithSand(caveMap, (currentCoord: Coord) => {
    return !canFall(currentCoord, caveMap) && currentCoord.y < 1;
  });
  return grainOfSandCount + 1; // add one, the source ot the sand
};

export const run = (raw: string) => {
  const part1 = getPart1(raw);
  const part2 = getPart2(raw);

  return [part1, part2];
};
