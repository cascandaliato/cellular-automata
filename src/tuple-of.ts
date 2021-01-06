// https://github.com/microsoft/TypeScript/issues/26223#issuecomment-674500430

type _TupleOf<N extends number, T, R extends unknown[]> = R['length'] extends N
  ? R
  : _TupleOf<N, T, [T, ...R]>;

type TupleOf<N extends number, T> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<N, T, []>
  : never;

export { TupleOf };
