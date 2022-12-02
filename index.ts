import { parse } from "flags";
import { Logger } from "logger";
// @deno-types="@types/lodash/fp"
import fp from "lodash/fp";
import { readFile } from "./src/helper.ts";

const logger = new Logger();

const main = async (args: string[]) => {
  const config = parse(args);
  const day = fp.getOr(null, ["_", 0], config) as string;
  const padDay = fp.padCharsStart("0", 2, day);

  try {
    const runner = (await import(`./src/${padDay}.ts`)).run;
    const rawContent = await readFile(`./input/${padDay}.txt`);

    const result = await runner(rawContent);

    logger.info(`Result of day ${day} is: '${result}'`);
  } catch (error) {
    logger.error(`Could not load module: ${error}`);
  }
};

main(Deno.args);
