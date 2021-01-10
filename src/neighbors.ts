import { range } from 'lodash';
import { Coords } from './automaton';
import { TupleOf } from './tuple-of';
import { product } from './utils';

const getNeighborsFromDirections = <DIMENSIONS extends number>(
  directions: TupleOf<DIMENSIONS, number>[]
) => (coords: Coords<DIMENSIONS>): Coords<DIMENSIONS>[] =>
  directions.map(d => coords.map((n, idx) => n + d[idx]) as Coords<DIMENSIONS>);

const mooreDirections = (dimensions: number): Coords<typeof dimensions>[] =>
  product([0, 1, -1], dimensions).filter(p => p.some(v => v !== 0));

/**
 *  [Moore neighborhood](https://en.wikipedia.org/wiki/Moore_neighborhood):
 *```
 * 1D:               2D:
 *  0 1 2 3 4           0 1 2 3 4
 *    X O X           0
 *                    1   X X X
 *                    2   X O X
 *                    3   X X X
 *                    4
 * ```
 */
const moore = (dimensions: number) =>
  getNeighborsFromDirections(mooreDirections(dimensions));

const vonNeumannDirections = (
  dimensions: number,
  distance: number,
  residue: number = distance
): Coords<typeof dimensions>[] => {
  if (dimensions === 0) return residue === 0 ? [[]] : [];

  return range(residue !== 0 ? -residue : 0, residue + 1).flatMap(r =>
    vonNeumannDirections(
      dimensions - 1,
      distance,
      residue - Math.abs(r)
    ).map(d => [...d, r])
  );
};

/**
 *  [Von Neumann neighborhood](https://en.wikipedia.org/wiki/Von_Neumann_neighborhood):
 *```
 * Distance 1:      Distance 2:
 *    0 1 2            0 1 2 3 4
 * 0   X            0     X
 * 1 X O X          1   X X X
 * 2   X            2 X X O X X
 *                   3   X X X
 *                   4     X
 * ```
 */
const vonNeumann = (dimensions: number, distance: number = 1) =>
  getNeighborsFromDirections<typeof dimensions>(
    range(1, distance + 1).flatMap(d => vonNeumannDirections(dimensions, d))
  );

const hexGridDirections: [number, number][] = [
  [0, 1], // east
  [1, 0], // south-east
  [1, -1], // south-west
  [0, -1], // west
  [-1, 0], // north-west
  [-1, 1], // north-east
];

/**
 * Hex cell orientation and directions:
 * ```
 *                 0  1  2
 *  nw /\ ne    0     nw ne
 *  w |  | e    1  w  O  e
 *  sw \/ se    2 sw  se
 * ```
 */
const hexGrid2D = () => getNeighborsFromDirections<2>(hexGridDirections);

export {
  hexGrid2D,
  moore,
  moore as surrounding,
  vonNeumann,
  vonNeumann as byManhattanDistance,
};
