# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Nothing yet!

## [1.0.0] - 2021-01-10

### Added

- Constructor function for a generic automaton: `Automaton`.
- Presets:
  - `Conway2D` (aka [Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)),
  - `Conway` (arbitrary dimensions),
  - `ConwayInfinite` (alias for `Conway`),
  - `ConwayFinite` (arbitrary dimensions, finite grid).
- Limit function helpers: `Limits.fromArray`.
- Neighborhood function helpers `Neighbors.`:
  - `hexGrid2D`,
  - [`moore`](https://en.wikipedia.org/wiki/Moore_neighborhood),
  - `surrounding` (alias for `moore`),
  - [`vonNeumann`](https://en.wikipedia.org/wiki/Von_Neumann_neighborhood),
  - `byManhattanDistance` (alias for `vonNeumann`),
- Tests for `Neighbors` and `Conway`.

[unreleased]: https://github.com/cascandaliato/cellular-automata/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/cascandaliato/cellular-automata/releases/tag/v1.0.0
