import { Counter } from './counter';
import { HyperGrid } from './hyper-grid';
import { HyperSet } from './hyper-set';
import { TupleOf } from './tuple-of';

type Coords<N extends number> = TupleOf<N, number>;

type Entry<N extends number, STATE extends string> = {
  coords: Coords<N>;
  state: STATE;
};

type Entries<N extends number, STATE extends string> = Entry<N, STATE>[];

type AutomatonConfig<N extends number, STATE extends string> = {
  cell: {
    defaultState: STATE;
    states: Record<
      STATE,
      (coords: Coords<N>, neighbors: Entries<N, STATE>) => STATE
    >;
  };
  initialState: Entries<N, STATE>;
  getNeighbors(coords: Coords<N>): Coords<N>[];
  isWithinLimits(coords: Coords<N>): boolean;
};

class ConfigurableAutomaton<
  DIMENSIONS extends number,
  STATES extends string[]
> {
  private grid: HyperGrid<DIMENSIONS, STATES[number]>;
  private generation: number = 0;
  private history: Entries<DIMENSIONS, STATES[number]>[] = [];

  constructor(private config: AutomatonConfig<DIMENSIONS, STATES[number]>) {
    this.grid = new HyperGrid<DIMENSIONS, STATES[number]>(
      config.cell.defaultState
    );
    for (const cell of config.initialState)
      this.grid.set(cell.coords, cell.state);
  }

  evolve(n: number = 1) {
    const getNeighborsWithinLimits = (coords: Coords<DIMENSIONS>) =>
      this.config.getNeighbors(coords).filter(this.config.isWithinLimits);
    for (let gen = 1; gen <= n; gen++) {
      let expanded = new HyperSet<DIMENSIONS>();
      [...this.grid].forEach(([coords]) => {
        expanded.add(coords);
        getNeighborsWithinLimits(coords).forEach(nCoords =>
          expanded.add(nCoords)
        );
      });
      const newGrid = new HyperGrid<DIMENSIONS, STATES[number]>(
        this.config.cell.defaultState
      );
      [...expanded].forEach(coords => {
        const neighborsLocal: Entries<
          DIMENSIONS,
          STATES[number]
        > = getNeighborsWithinLimits(coords).map(nCoords => ({
          coords: nCoords,
          state: this.grid.get(nCoords),
        }));
        const newState = this.config.cell.states[this.grid.get(coords)](
          coords,
          neighborsLocal
        );
        newGrid.set(coords, newState);
      });
      this.generation += 1;
      this.history.push(this.toEntries());
      this.grid = newGrid;
    }

    return this;
  }

  toEntries(): Entries<DIMENSIONS, STATES[number]> {
    return [...this.grid].map(([coords, state]) => ({
      coords,
      state,
    }));
  }

  countByState(): Counter<STATES[number]> {
    return new Counter<STATES[number]>(
      this.toEntries().map(({ state }) => state)
    );
  }

  print(): void {
    const entries = this.toEntries();
    if (entries.length === 0) return;

    const dims = entries[0].coords.length;

    const minMax = this.toEntries()
      .map(({ coords }) => coords)
      .reduce(
        (acc, coords) => {
          for (let d = 0; d < coords.length; d++) {
            acc[d][0] = Math.min(acc[d][0], coords[d]);
            acc[d][1] = Math.max(acc[d][1], coords[d]);
          }
          return acc;
        },
        Array.from({ length: dims }, () => [+Infinity, -Infinity])
      );

    if (dims === 1) {
      let line = '';
      for (let i = minMax[0][0]; i <= minMax[0][1]; i++) {
        line += this.grid.get([i] as TupleOf<DIMENSIONS, number>);
      }
      console.log(line);
      console.log();
    } else if (dims === 2) {
      console.log(`gen=${this.generation}`);
      for (let r = minMax[0][0]; r <= minMax[0][1]; r++) {
        let row = '';
        for (let c = minMax[1][0]; c <= minMax[1][1]; c++) {
          row += this.grid.get([r, c] as TupleOf<DIMENSIONS, number>);
        }
        console.log(row);
      }
      console.log();
    }
  }
}

const Automaton = <DIMENSIONS extends number, STATES extends string[]>(
  config: AutomatonConfig<DIMENSIONS, STATES[number]>
) => new ConfigurableAutomaton<DIMENSIONS, STATES>(config);

export { Automaton, AutomatonConfig, ConfigurableAutomaton, Coords, Entries };
