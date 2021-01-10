import { Coords } from './automaton';

const isSimpleArray = <V>(x: V[] | V[][]): x is V[] => {
  return 'length' in x;
};

/**
 * Creates a function that checks whether some coordinates fall within the grid boundaries.
 *
 * Boundaries must be provided via the `limits` array. Each entry is either a pair of `[min, max]` (`min` and `max` inclusive), or a number `n`, in which case `min = 0` and `max = n`.
 *
 * e.g. for a 2(rows)x3(cols) rectangle, provide `[ [0, 1], [0, 2] ]` or just `[ 1, 2 ]`
 * ```
 *     0 1 2
 *   0 . . .
 *   1 . . .
 * ```
 */
const fromArray = (limits: number[] | [number, number][]) => {
  const limitsAsPairs: [number, number][] = isSimpleArray<number>(limits)
    ? limits.map(n => [0, n - 1])
    : limits;

  return (coords: Coords<typeof limits.length>): boolean =>
    coords.every(
      (c, idx) => c >= limitsAsPairs[idx][0] && c <= limitsAsPairs[idx][1]
    );
};

export { fromArray };
