import { Coords } from './automaton';

const isSimpleArray = <V>(x: V[] | V[][]): x is V[] => {
  return 'length' in x;
};

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
