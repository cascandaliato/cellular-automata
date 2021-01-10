import { merge } from 'lodash';
import { Automaton, AutomatonConfig, Coords, Entries } from './automaton';
import * as InitialState from './initial-state';
import * as Limits from './limits';
import * as Neighbors from './neighbors';
import { TupleOf } from './tuple-of';
import { countEntriesByState, DeepPartial, HyperRectangle } from './utils';

const Conway = (
  dimensions: number,
  dead: string,
  alive: string,
  initialState: Entries<typeof dimensions, typeof dead | typeof alive> = [],
  overrides: DeepPartial<
    AutomatonConfig<typeof dimensions, typeof dead | typeof alive>
  > = {}
) => {
  type DIMENSIONS = typeof dimensions;
  type DEAD = typeof dead;
  type ALIVE = typeof alive;
  type STATE = DEAD | ALIVE;

  return Automaton<DIMENSIONS, DEAD | ALIVE>(
    merge(
      {
        cell: {
          defaultState: dead,
          states: {
            [alive]: (
              _: TupleOf<DIMENSIONS, number>,
              neighbors: {
                coords: TupleOf<DIMENSIONS, number>;
                state: STATE;
              }[]
            ) =>
              [2, 3].includes(countEntriesByState(neighbors, alive))
                ? alive
                : dead,
            [dead]: (
              _: TupleOf<DIMENSIONS, number>,
              neighbors: {
                coords: TupleOf<DIMENSIONS, number>;
                state: STATE;
              }[]
            ) => (countEntriesByState(neighbors, alive) === 3 ? alive : dead),
          } as Record<
            STATE,
            (
              coords: Coords<DIMENSIONS>,
              neighbors: Entries<DIMENSIONS, STATE>
            ) => STATE
          >, // https://github.com/microsoft/TypeScript/issues/13948
        },
        initialState,
        getNeighbors: Neighbors.moore(dimensions),
        isWithinLimits: () => true,
      },
      overrides
    )
  );
};

Conway.fromMatrix = (
  dimensions: number,
  dead: string,
  alive: string,
  matrix: HyperRectangle<typeof dead | typeof alive> = []
) =>
  Conway(
    dimensions,
    dead,
    alive,
    (InitialState.fromMatrix<typeof dead | typeof alive>(
      matrix
    ) as unknown) as Entries<typeof dimensions, typeof dead | typeof alive>
  );

const ConwayInfinite = Conway;

const Conway2D = (
  dead: string,
  alive: string,
  initialState: Entries<2, typeof dead | typeof alive> = [],
  overrides: DeepPartial<AutomatonConfig<2, typeof dead | typeof alive>> = {}
) => Conway(2, dead, alive, initialState as Entries<number, string>, overrides);

Conway2D.fromMatrix = (
  dead: string,
  alive: string,
  matrix: HyperRectangle<typeof dead | typeof alive> = []
) => Conway.fromMatrix(2, dead, alive, matrix);

const ConwayFinite = (
  limits: number[] | [number, number][],
  dead: string,
  alive: string,
  initialState: Entries<typeof limits.length, typeof dead | typeof alive> = [],
  overrides: DeepPartial<
    AutomatonConfig<typeof limits.length, typeof dead | typeof alive>
  > = {}
) =>
  Conway(limits.length, dead, alive, initialState, {
    ...overrides,
    isWithinLimits: Limits.fromArray(limits),
  });

ConwayFinite.fromMatrix = (
  limits: number[] | [number, number][],
  dead: string,
  alive: string,
  matrix: HyperRectangle<typeof dead | typeof alive> = []
) =>
  ConwayFinite(
    limits,
    dead,
    alive,
    (InitialState.fromMatrix<typeof dead | typeof alive>(
      matrix
    ) as unknown) as Entries<typeof limits.length, typeof dead | typeof alive>
  );

export { Conway, Conway2D, ConwayInfinite, ConwayFinite };
