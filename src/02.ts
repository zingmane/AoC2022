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

export const run = (raw: string) => {
  const mapToRPS = (t: string) =>
    match(t)
      .with("A", "X", () => RPS.ROCK)
      .with("B", "Y", () => RPS.PAPER)
      .with("C", "Z", () => RPS.SCISSORS)
      .run();

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

  const result = getMatchScore(strategyGuide);

  return result;
};
