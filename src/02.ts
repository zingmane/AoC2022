// @deno-types="@types/lodash/fp"
import fp from "lodash/fp";
import { splitByBlank, splitByNewline, Values } from "./helper.ts";
import { match, P } from "ts-pattern";

const RPS = {
  ROCK: "rock",
  PAPER: "paper",
  SCISSORS: "scissors",
} as const;
type RPS = Values<typeof RPS>;

const MatchResult = {
  LOSE: "lose",
  DRAW: "draw",
  WIN: "win",
} as const;
type MatchResult = Values<typeof MatchResult>;

const mapToRPS = (t: string) =>
  match(t)
    .with("A", "X", () => RPS.ROCK)
    .with("B", "Y", () => RPS.PAPER)
    .with("C", "Z", () => RPS.SCISSORS)
    .run();

const getPart1 = (raw: string) => {
  const mapToScore = (rps: [RPS, RPS]): number => {
    const winLooseScore = match(rps)
      .with([RPS.ROCK, RPS.ROCK], () => 3)
      .with([RPS.PAPER, RPS.PAPER], () => 3)
      .with([RPS.SCISSORS, RPS.SCISSORS], () => 3)
      .with([RPS.ROCK, RPS.PAPER], () => 6)
      .with([RPS.PAPER, RPS.SCISSORS], () => 6)
      .with([RPS.SCISSORS, RPS.ROCK], () => 6)
      .with([RPS.ROCK, RPS.SCISSORS], () => 0)
      .with([RPS.PAPER, RPS.ROCK], () => 0)
      .with([RPS.SCISSORS, RPS.PAPER], () => 0)
      .exhaustive();

    const itemScore = match(rps)
      .with([P._, RPS.ROCK], () => 1)
      .with([P._, RPS.PAPER], () => 2)
      .with([P._, RPS.SCISSORS], () => 3)
      .exhaustive();

    return itemScore + winLooseScore;
  };

  const splitUp = fp.compose(
    fp.map(splitByBlank),
    fp.compact,
    splitByNewline,
  );

  const getMatchScore = fp.compose(
    fp.sum,
    fp.map(mapToScore),
    fp.map(fp.map(mapToRPS)),
  );

  const strategyGuide = splitUp(raw);

  return getMatchScore(strategyGuide);
};

const getPart2 = (raw: string) => {
  const mapToMatchResult = (t: string) =>
    match(t)
      .with("X", () => MatchResult.LOSE)
      .with("Y", () => MatchResult.DRAW)
      .with("Z", () => MatchResult.WIN)
      .run();

  const mapToScore = (rps: [RPS, MatchResult]): number => {
    const winLooseScore = match(rps)
      .with([P._, MatchResult.LOSE], () => 0)
      .with([P._, MatchResult.DRAW], () => 3)
      .with([P._, MatchResult.WIN], () => 6)
      .exhaustive();

    const itemScore = match(rps)
      .with([RPS.ROCK, MatchResult.LOSE], () => 3) // we have to choose 'scissors'
      .with([RPS.ROCK, MatchResult.DRAW], () => 1) // we have to choose 'rock'
      .with([RPS.ROCK, MatchResult.WIN], () => 2) // we have to choose 'paper'
      .with([RPS.PAPER, MatchResult.LOSE], () => 1) // we have to choose 'rock'
      .with([RPS.PAPER, MatchResult.DRAW], () => 2) // we have to choose 'paper'
      .with([RPS.PAPER, MatchResult.WIN], () => 3) // we have to choose 'scissors'
      .with([RPS.SCISSORS, MatchResult.LOSE], () => 2) // we have to choose 'paper'
      .with([RPS.SCISSORS, MatchResult.DRAW], () => 3) // we have to choose 'scissors'
      .with([RPS.SCISSORS, MatchResult.WIN], () => 1) // we have to choose 'rock'
      .exhaustive();

    return itemScore + winLooseScore;
  };

  const splitUp = fp.compose(
    fp.map(splitByBlank),
    fp.compact,
    splitByNewline,
  );

  const mapToInputAndResult = (
    [enemyInput, matchResult]: [string, string],
  ) => [mapToRPS(enemyInput), mapToMatchResult(matchResult)];

  const getMatchScore = fp.compose(
    fp.sum,
    fp.map(mapToScore),
    fp.map(mapToInputAndResult),
  );

  const strategyGuide = splitUp(raw);

  return getMatchScore(strategyGuide);
};

export const run = (raw: string) => {
  const part1 = getPart1(raw);
  const part2 = getPart2(raw);

  return [part1, part2];
};
