# tree-sitter-rust

[![CI][ci]](https://github.com/tree-sitter/tree-sitter-rust/actions/workflows/ci.yml)
[![discord][discord]](https://discord.gg/w7nTvsVJhm)
[![matrix][matrix]](https://matrix.to/#/#tree-sitter-chat:matrix.org)
[![crates][crates]](https://crates.io/crates/tree-sitter-rust)
[![npm][npm]](https://www.npmjs.com/package/tree-sitter-rust)
[![pypi][pypi]](https://pypi.org/project/tree-sitter-rust)

Rust grammar for [tree-sitter](https://github.com/tree-sitter/tree-sitter).

## Local module-grammar prototype

This working copy uses the experimental module grammar DSL in `grammar.mjs`.
It requires matching local `tree-sitter-rust` and `tree-sitter` checkouts on
`prototype/module-grammar-dsl`, with the prototype changes present.
These prototype branches are not released CLI versions.
Arrange the checkouts as siblings:

```text
workspace/
  tree-sitter/
  tree-sitter-rust/
```

With Node.js, npm, Rust/Cargo, and a C/C++ toolchain installed:

```sh
cd workspace/tree-sitter-rust
npm install --ignore-scripts
npm run generate -- --js-runtime native
npm run test:corpus
npm run lint
```

The local `file:../tree-sitter/crates/cli/npm` development dependency supplies
the prototype DSL types. `--ignore-scripts` skips its release-binary downloader
and the native binding build. Development commands use `scripts/tree-sitter.mjs`
to run `cargo run --manifest-path ../tree-sitter/Cargo.toml -p tree-sitter-cli --`
instead of that downloaded binary. Cargo builds the CLI on first use.
For non-sibling checkouts, `TREE_SITTER_DIR` can override the wrapper's CLI
checkout path; npm's local dependency still requires the sibling layout.
Other CLI commands can be run with `npm run tree-sitter -- <command>`.

The grammar exports `rule()` bindings and a default configuration with arrays;
`start: source_file` selects the entry rule. `override()` and `external()`
are supplied by the prototype DSL. The package remains CommonJS for its native
Node bindings; only the grammar and development wrapper are ES modules.

Alias-only node names use exported `rule()` declarations without a body.
The `arguments` and `super` symbols use local names `arguments_` and `super_`
and are exported under their original names, since those bindings are reserved
in JavaScript modules. The explicit `.d.ts` extension in the grammar's type
reference also supports TypeScript's NodeNext module resolution.

`npm test` still runs the native Node binding tests. To build those bindings
after installing with scripts disabled, run `npm rebuild node-addon-api tree-sitter`
and `npm run install` before `npm test`.

The existing hosted workflows use released tooling and do not provision these
local prototype checkouts. They cannot validate this grammar syntax as-is;
use the local commands above unless CI also builds the matching Tree-sitter branch.
The CMake and Makefile builds still consume generated `src/grammar.json` and C
sources; regenerate them with the prototype CLI before building bindings.

## Features

- **Speed** — When initially parsing a file, `tree-sitter-rust` takes around two to three times
  as long as rustc's hand-written parser.

  ```sh
  $ wc -l examples/ast.rs
    2157 examples/ast.rs

  $ rustc -Z unpretty=ast-tree -Z time-passes examples/ast.rs | head -n0
    time:   0.002; rss:   55MB ->   60MB (   +5MB)  parse_crate

  $ tree-sitter parse examples/ast.rs --quiet --time
    examples/ast.rs    6.48 ms        9908 bytes/ms
  ```

  But if you _edit_ the file after parsing it, tree-sitter can generally _update_
  the previous existing syntax tree to reflect your edit in less than a millisecond,
  thanks to its incremental parsing system.

## References

- [The Rust Reference](https://doc.rust-lang.org/reference/) — While Rust does
  not have a specification, the reference tries to describe its working in detail.
  It tends to be out of date.
- [Keywords](https://doc.rust-lang.org/stable/book/appendix-01-keywords.html) and
  [Operators and Symbols](https://doc.rust-lang.org/stable/book/appendix-02-operators.html).

[ci]: https://img.shields.io/github/actions/workflow/status/tree-sitter/tree-sitter-rust/ci.yml?logo=github&label=CI
[discord]: https://img.shields.io/discord/1063097320771698699?logo=discord&label=discord
[matrix]: https://img.shields.io/matrix/tree-sitter-chat%3Amatrix.org?logo=matrix&label=matrix
[npm]: https://img.shields.io/npm/v/tree-sitter-rust?logo=npm
[crates]: https://img.shields.io/crates/v/tree-sitter-rust?logo=rust
[pypi]: https://img.shields.io/pypi/v/tree-sitter-rust?logo=pypi&logoColor=ffd242
