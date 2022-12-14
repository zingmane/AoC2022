// @deno-types="@types/lodash/fp"
import fp from "lodash/fp";
import { splitByNewline } from "./helper.ts";

type TreeMatrix = number[][];

const splitAndParse = fp.compose(fp.map(fp.parseInt(10)), fp.split(""));

const buildTreeMatrix = fp.compose(
  fp.map(splitAndParse),
  fp.compact,
  splitByNewline,
);

export const rotateArray = (arr: TreeMatrix): TreeMatrix =>
  arr[0].map((_, colIndex) => arr.map((row) => row[colIndex]));

const countVisibleTrees = (arr: TreeMatrix) => {
  const mapToIsVisibleMatrix = (arr: TreeMatrix) => {
    return arr.map((row, rowIndex) =>
      row.map((col, colIndex) => {
        const leftOrUpArray = arr[rowIndex].slice(0, colIndex);
        const rightOrDownArray = arr[rowIndex].slice(colIndex + 1);
        const leftOrUpHighestTree = fp.max(leftOrUpArray) ?? -1;
        const rightOrDownHighestTree = fp.max(rightOrDownArray) ?? -1;

        if (leftOrUpHighestTree < col || rightOrDownHighestTree < col) {
          return true;
        } else {
          return false;
        }
      })
    );
  };

  const visibleFromLeftAndRight = mapToIsVisibleMatrix(arr);
  const visibleFromUpAndDown = fp.compose(
    rotateArray,
    mapToIsVisibleMatrix,
    rotateArray,
  )(arr);

  let visibleTreeCount = 0;

  arr.map((row, rowIndex) =>
    row.map((_, colIndex) => {
      if (visibleFromLeftAndRight[rowIndex][colIndex] || visibleFromUpAndDown[rowIndex][colIndex]) {
        visibleTreeCount++;
      }
    })
  );

  return visibleTreeCount;
};

export const getScenicScore = (treeList: number[], initTreeHight: number): number => {
  for (let treeIndex = 0; treeIndex < treeList.length; treeIndex++) {
    if (treeList[treeIndex] >= initTreeHight) {
      return treeIndex + 1;
    }
  }
  // can see the whole tree list
  return treeList.length;
};

const getHighestScenicScore = (arr: TreeMatrix) => {
  const mapToScore = (arr: TreeMatrix) => {
    const scoreMatrix: TreeMatrix = [[]];
    return arr.map((row, rowIndex) =>
      row.map((col, colIndex) => {
        if (scoreMatrix[rowIndex] === undefined) {
          scoreMatrix[rowIndex] = [];
        }

        const leftOrUpScenicScore = getScenicScore(arr[rowIndex].slice(0, colIndex).reverse(), col);
        const rightOrDownScenicScore = getScenicScore(arr[rowIndex].slice(colIndex + 1), col);

        return scoreMatrix[rowIndex][colIndex] = leftOrUpScenicScore * rightOrDownScenicScore;
      })
    );
  };

  const scenicScoreMatrixFromLeftAndRight = mapToScore(arr);
  const scenicScoreMatrixFromUpAndDown = fp.compose(
    rotateArray,
    mapToScore,
    rotateArray,
  )(arr);

  return arr.map((row, rowIndex) =>
    row.map((_, colIndex) =>
      scenicScoreMatrixFromLeftAndRight[rowIndex][colIndex] * scenicScoreMatrixFromUpAndDown[rowIndex][colIndex]
    )
  );
};

const getPart1 = fp.compose(
  countVisibleTrees,
  buildTreeMatrix,
);

const getPart2 = fp.compose(
  fp.max,
  fp.map(fp.max),
  getHighestScenicScore,
  buildTreeMatrix,
);

export const run = (raw: string) => {
  const part1 = getPart1(raw);
  const part2 = getPart2(raw);

  return [part1, part2];
};
