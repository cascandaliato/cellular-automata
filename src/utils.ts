import { Entries } from './automaton';
import { TupleOf } from './tuple-of';

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

type HyperRectangle<STATE extends string> = STATE[] | HyperRectangle<STATE>[];

const countEntriesByState = <N extends number, STATE extends string>(
  entries: Entries<N, STATE>,
  targetState: STATE
): number => entries.filter(({ state }) => state === targetState).length;

const product = <V>(elements: V[], times: number): TupleOf<typeof times, V>[] =>
  times === 1
    ? elements.map(e => [e])
    : elements.flatMap(e =>
        product<V>(elements, times - 1).map(c => [e, ...c])
      );

export { DeepPartial, HyperRectangle, countEntriesByState, product };
