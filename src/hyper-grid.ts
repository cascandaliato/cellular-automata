import { TupleOf } from './tuple-of';

const SEP = ';';

class HyperGrid<N extends number, V>
  implements Iterable<[TupleOf<N, number>, V]> {
  private map = new Map<string, V>();

  constructor(private defaultValue: V) {}

  get(coords: TupleOf<N, number>): V {
    return this.map.get(coords.join(SEP)) ?? this.defaultValue;
  }

  set(coords: TupleOf<N, number>, value: V) {
    if (value === this.defaultValue) {
      this.map.delete(coords.join(SEP));
    } else {
      this.map.set(coords.join(SEP), value);
    }
  }

  delete(coords: TupleOf<N, number>) {
    this.map.delete(coords.join(SEP));
  }

  *[Symbol.iterator]() {
    for (const [key, value] of this.map) {
      yield [key.split(SEP).map(Number), value] as [TupleOf<N, number>, V];
    }
  }

  get size(): number {
    return this.map.size;
  }
}

export { HyperGrid };
