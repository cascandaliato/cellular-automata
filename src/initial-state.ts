import { Entries } from './automaton';
import { HyperRectangle } from './utils';

const fromMatrix = <STATE extends string>(
  matrix: HyperRectangle<STATE>
): Entries<number, STATE> => {
  const entries: Entries<number, STATE> = [];
  matrix.forEach((value: STATE | HyperRectangle<STATE>, idx: number) => {
    if (Array.isArray(value)) {
      for (const { coords, state } of fromMatrix(value)) {
        entries.push({ coords: [idx, ...coords], state });
      }
    } else {
      entries.push({ coords: [idx], state: value });
    }
  });
  return entries;
};

const fromHyperRectangle = fromMatrix;

export { fromHyperRectangle, fromMatrix };
