// @deno-types="@types/lodash/fp"
import fp from "lodash/fp";
import { splitByNewline } from "./helper.ts";

const getCharScore = (char: string) => {
  const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  return ALPHABET.indexOf(char) + 1;
};

type Topographie = Map<string, number>;
type Coord = `${number}-${number}`;

const toTopographie = (lines: string[]) => {
  const topography = new Map<string, number>();
  let startCoord: Coord = "0-0";
  let endCoord: Coord = "0-0";

  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      const value = lines[i][j];
      const currentCoord: Coord = `${j}-${i}`;
      const heightValue = value === "S" ? "a" : value === "E" ? "z" : value;
      const height = getCharScore(heightValue);
      topography.set(currentCoord, height);

      if (value === "S") {
        startCoord = currentCoord;
      }

      if (value === "E") {
        endCoord = currentCoord;
      }
    }
  }

  return [topography, startCoord, endCoord];
};

const getXY = (coord: Coord) => coord.split("-").map(Number);

const getNeighbors = (topography: Topographie) => (coord: Coord): Coord[] => {
  const [x, y] = getXY(coord);
  const up = topography.has(`${x}-${y - 1}`) ? `${x}-${y - 1}` as Coord : undefined;
  const down = topography.has(`${x}-${y + 1}`) ? `${x}-${y + 1}` as Coord : undefined;
  const left = topography.has(`${x - 1}-${y}`) ? `${x - 1}-${y}` as Coord : undefined;
  const right = topography.has(`${x + 1}-${y}`) ? `${x + 1}-${y}` as Coord : undefined;

  return fp.compact([up, down, left, right]);
};

const getWalkableNeighbors = (topography: Topographie) => (coord: Coord): Coord[] => {
  const currentHeight = getHeightFor(coord)(topography);
  // console.log(`###LOG###: ${currentHeight}`);
  return fp.compose(
    filterByCanWalk(topography, currentHeight),
    getNeighbors(topography),
  )(coord);
};

const getHeightFor = (coord: Coord) => (topography: Topographie) => topography.get(coord) ?? -1;

const filterByCanWalk = (topography: Topographie, currentHeight: number) => (coords: Coord[]) =>
  coords.filter((coord) => {
    const height = topography.get(coord) ?? -1;
    // we can jump down more than one hight difference e.g. from 12 to 10
    return currentHeight + 1 - height >= 0;
  });

const isVisited = (visitedCoords: Set<Coord>) => (coord: Coord) => fp.contains(coord, Array.from(visitedCoords));

const routeBfs = ([topography, startCoord, endCoord]: [Topographie, Coord, Coord]) => {
  //A Queue to manage the coords that have yet to be visited
  const queue: Coord[] = [];
  //Adding the coord to start from
  queue.push(startCoord);
  const visitedCoords = new Set<Coord>();

  let distances = {};
  distances = fp.assoc(startCoord, 0, distances);

  while (queue.length > 0) {
    const coord = queue.shift()!;

    const neighbors = getWalkableNeighbors(topography)(coord);

    for (const neighbor of neighbors) {
      if (!isVisited(visitedCoords)(neighbor)) {
        // Visit the node, set the distance and add it to the queue
        visitedCoords.add(neighbor);
        const distanceToStart = fp.get(coord, distances) ?? 0;
        distances = fp.assoc(neighbor, distanceToStart + 1, distances);

        if (neighbor === endCoord) {
          return distances;
        }

        queue.push(neighbor);
      }
    }
  }

  // not reachable
  return { [startCoord]: -1 };
};

const calcDistance = (distances: Record<string, number>) => fp.max(Object.values(distances));

const getPart1 = fp.compose(
  calcDistance,
  routeBfs,
  toTopographie,
  fp.compact,
  splitByNewline,
);

// const getPart1 = fp.compose();

// const getPart2 = fp.compose(
//   getLevelOfMonkeyBusiness,
//   playRounds(10_000, true),
//   parseMonkeySpecs,
// );

export const run = (raw: string) => {
  const part1 = getPart1(raw);
  // const part2 = getPart2(raw);

  return [part1, "part2"];
};
