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

class ConfigurableAutomaton<DIMENSIONS extends number, STATE extends string> {
  private grid: HyperGrid<DIMENSIONS, STATE>;
  private history: Entries<DIMENSIONS, STATE>[] = [];

  constructor(private config: AutomatonConfig<DIMENSIONS, STATE>) {
    this.grid = new HyperGrid<DIMENSIONS, STATE>(config.cell.defaultState);
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
      const newGrid = new HyperGrid<DIMENSIONS, STATE>(
        this.config.cell.defaultState
      );
      [...expanded].forEach(coords => {
        const neighborsLocal: Entries<
          DIMENSIONS,
          STATE
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
      this.history.push(this.toEntries());
      this.grid = newGrid;
    }

    return this;
  }

  toEntries(): Entries<DIMENSIONS, STATE> {
    return [...this.grid].map(([coords, state]) => ({
      coords,
      state,
    }));
  }

  countByState(): Counter<STATE> {
    return new Counter<STATE>(this.toEntries().map(({ state }) => state));
  }
}

const Automaton = <DIMENSIONS extends number, STATE extends string>(
  config: AutomatonConfig<DIMENSIONS, STATE>
) => new ConfigurableAutomaton<DIMENSIONS, STATE>(config);

export { Automaton, AutomatonConfig, ConfigurableAutomaton, Coords, Entries };
