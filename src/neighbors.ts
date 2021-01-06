import { Coords } from './automaton';
import { TupleOf } from './tuple-of';
import { product } from './utils';

const getNeighborsFromDirections = <DIMENSIONS extends number>(
  directions: TupleOf<DIMENSIONS, number>[]
) => (coords: Coords<DIMENSIONS>): Coords<DIMENSIONS>[] =>
  directions.map(d => coords.map((n, idx) => n + d[idx]) as Coords<DIMENSIONS>);

const mooreDirections = (n = 2) =>
  product([0, 1, -1], n).filter(p => p.some(v => v !== 0));

const moore = (dimensions: number) =>
  getNeighborsFromDirections<typeof dimensions>(mooreDirections(dimensions));

// https://en.wikipedia.org/wiki/Von_Neumann_neighborhood
// const vonNeumann = (dimensions: number, distance: number = 1) => {};

// const hexGrid

export {
  moore,
  moore as surrounding,
  // vonNeumann,
  // vonNeumann as byManhattanDistance,
};
