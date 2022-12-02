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

export const splitByEmptyRows = (str: string) => str.split(/\n\s*\n/g);
export const splitByNewline = (str: string) => str.split(/\n/g);
export const splitByBlank = (str: string) => str.split(/ /g);

export type Values<Const> = Const[keyof Const];
