import * as ca from '../src';

describe("Conway's Game of Life", () => {
  test('After one iteration', () => {
    const gol = ca.Conway.fromMatrix(2, '.', '#', [
      ['.', '#', '.'],
      ['.', '.', '#'],
      ['#', '#', '#'],
    ]);

    gol.evolve(1);
    expect(gol.toEntries()).toMatchSnapshot();
  });
});

describe('Neighbors', () => {
  test('Moore neighborhood (1d)', () => {
    expect(ca.Neighbors.moore(1)([1])).toMatchSnapshot();
  });

  test('Moore neighborhood (2d)', () => {
    expect(ca.Neighbors.moore(2)([1, 2])).toMatchSnapshot();
  });

  test('VonNeumann neighborhood (1d, distance 1)', () => {
    expect(ca.Neighbors.vonNeumann(1, 1)([1])).toMatchSnapshot();
  });

  test('VonNeumann neighborhood (1d, distance 2)', () => {
    expect(ca.Neighbors.vonNeumann(1, 2)([1])).toMatchSnapshot();
  });

  test('VonNeumann neighborhood (2d, distance 1)', () => {
    expect(ca.Neighbors.vonNeumann(2, 2)([1, 1])).toMatchSnapshot();
  });
  test('VonNeumann neighborhood (2d, distance 2)', () => {
    expect(ca.Neighbors.vonNeumann(2, 2)([1, 1])).toMatchSnapshot();
  });

  test('VonNeumann neighborhood (3d, distance 1)', () => {
    expect(ca.Neighbors.vonNeumann(3, 1)([1, 1, 0])).toMatchSnapshot();
  });
  test('VonNeumann neighborhood (3d, distance 2)', () => {
    expect(ca.Neighbors.vonNeumann(3, 2)([1, 1, 0])).toMatchSnapshot();
  });

  test('Hex grid neighbors of [1,2]', () => {
    expect(ca.Neighbors.hexGrid2D()([1, 2])).toMatchSnapshot();
  });
});
