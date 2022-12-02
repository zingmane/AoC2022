import { Logger } from "logger";

const logger = new Logger();

export const readFile = async (path: string) => {
  try {
    logger.info(`Reading content from: ${path}`);
    const content = await Deno.readTextFile(path);
    return content;
  } catch (_error) {
    throw new Error(`Could not load input file: '${path}'`);
  }
};
