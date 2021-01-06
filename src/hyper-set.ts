import { TupleOf } from './tuple-of';

const SEP = ';';

class HyperSet<N extends number> implements Iterable<TupleOf<N, number>> {
  private set = new Set<string>();

  has(coords: TupleOf<N, number>): boolean {
    return this.set.has(coords.join(SEP));
  }

  add(coords: TupleOf<N, number>): HyperSet<N> {
    this.set.add(coords.join(SEP));
    return this;
  }

  remove(coords: TupleOf<N, number>): boolean {
    return this.delete(coords);
  }

  delete(coords: TupleOf<N, number>): boolean {
    return this.set.delete(coords.join(SEP));
  }

  toggle(coords: TupleOf<N, number>): boolean {
    if (this.has(coords)) {
      this.delete(coords);
      return false;
    } else {
      this.add(coords);
      return true;
    }
  }

  *[Symbol.iterator]() {
    for (const coords of this.set) {
      yield coords.split(SEP).map(Number) as TupleOf<N, number>;
    }
  }

  toArray() {
    return [...this.set].map(coords =>
      coords.split(SEP).map(Number)
    ) as TupleOf<N, number>[];
  }

  get size(): number {
    return this.set.size;
  }
}

export { HyperSet };
