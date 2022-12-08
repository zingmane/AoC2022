// @deno-types="@types/lodash/fp"
import fp from "lodash/fp";

export const getMarkerPosition = (dataStream: string, markerSize = 4): number => {
  for (let i = 0; i < dataStream.length; i++) {
    const subst = fp.slice(i, i + markerSize, dataStream);
    if (fp.uniq(subst).length === markerSize) {
      return i + markerSize;
    }
  }
  return Infinity;
};

export const run = (raw: string) => {
  const part1 = getMarkerPosition(raw);
  const part2 = getMarkerPosition(raw, 14);

  return [part1, part2];
};
