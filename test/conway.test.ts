import { vonNeumann } from '../src/neighbors';
import { Conway } from '../src/presets';

describe("Conway's Game of Life", () => {
  test('After one iteration', () => {
    const gol = Conway.fromMatrix(2, '.', '#', [
      ['.', '#', '.'],
      ['.', '.', '#'],
      ['#', '#', '#'],
    ]);

    gol.evolve(1);
    expect(gol.toEntries()).toMatchSnapshot();
  });
});

describe('Neighbors', () => {
  test("VonNeumann's neighborhood (1d, distance 1)", () => {
    expect(vonNeumann(1, 1)([1])).toMatchSnapshot();
  });

  test("VonNeumann's neighborhood (1d, distance 2)", () => {
    expect(vonNeumann(1, 2)([1])).toMatchSnapshot();
  });

  test("VonNeumann's neighborhood (2d, distance 1)", () => {
    expect(vonNeumann(2, 2)([1, 1])).toMatchSnapshot();
  });
  test("VonNeumann's neighborhood (2d, distance 2)", () => {
    expect(vonNeumann(2, 2)([1, 1])).toMatchSnapshot();
  });

  test("VonNeumann's neighborhood (3d, distance 1)", () => {
    expect(vonNeumann(3, 1)([1, 1, 0])).toMatchSnapshot();
  });
  test("VonNeumann's neighborhood (3d, distance 2)", () => {
    expect(vonNeumann(3, 2)([1, 1, 0])).toMatchSnapshot();
  });
});
