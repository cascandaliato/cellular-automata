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
