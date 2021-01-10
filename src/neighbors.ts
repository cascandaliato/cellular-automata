import { range } from 'lodash';
import { Coords } from './automaton';
import { TupleOf } from './tuple-of';
import { product } from './utils';

const getNeighborsFromDirections = <DIMENSIONS extends number>(
  directions: TupleOf<DIMENSIONS, number>[]
) => (coords: Coords<DIMENSIONS>): Coords<DIMENSIONS>[] =>
  directions.map(d => coords.map((n, idx) => n + d[idx]) as Coords<DIMENSIONS>);

const mooreDirections = (n: number): TupleOf<typeof n, number>[] =>
  product([0, 1, -1], n).filter(p => p.some(v => v !== 0));

const moore = (dimensions: number) =>
  getNeighborsFromDirections<typeof dimensions>(mooreDirections(dimensions));

const vonNeumannDirections = (
  dimensions: number,
  distance: number,
  residue: number = distance
): TupleOf<typeof dimensions, number>[] => {
  if (dimensions === 0) return residue === 0 ? [[]] : [];

  return range(residue !== 0 ? -residue : 0, residue + 1).flatMap(r =>
    vonNeumannDirections(
      dimensions - 1,
      distance,
      residue - Math.abs(r)
    ).map(d => [...d, r])
  );
};

// https://en.wikipedia.org/wiki/Von_Neumann_neighborhood
const vonNeumann = (dimensions: number, distance: number = 1) =>
  getNeighborsFromDirections<typeof dimensions>(
    range(1, distance + 1).flatMap(d => vonNeumannDirections(dimensions, d))
  );

export {
  moore,
  moore as surrounding,
  vonNeumann,
  vonNeumann as byManhattanDistance,
};
