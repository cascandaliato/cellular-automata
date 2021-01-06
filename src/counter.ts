class Counter<E extends number | string> {
  private map = new Map<E, number>();

  constructor(iterable: Iterable<E> = []) {
    for (const element of iterable) this.add(element);
  }

  add(element: E): Counter<E> {
    this.map.set(element, (this.map.get(element) || 0) + 1);
    return this;
  }

  remove(element: E): Counter<E> {
    this.map.set(element, (this.map.get(element) || 0) - 1);
    return this;
  }

  get(element: E): number {
    if (!this.map.has(element)) return 0;
    return this.map.get(element) as number;
  }
}

export { Counter };
