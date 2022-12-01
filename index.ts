import { parse } from "flags";
import { Logger } from "logger";
// @deno-types="@types/lodash/fp"
import fp from "lodash/fp";

const logger = new Logger();

const main = async (args: string[]) => {
  const config = parse(args);
  const day = fp.getOr(null, ["_", 0], config);
  const padDay = fp.padCharsStart("0", 2, day);

  try {
    const runner = (await import(`./src/${padDay}.ts`)).run;

    const result = runner();

    logger.info(`Result of day ${day} is: '${result}'`);
  } catch (error) {
    logger.error(`Could not load module: ${error}`);
  }
};

main(Deno.args);
