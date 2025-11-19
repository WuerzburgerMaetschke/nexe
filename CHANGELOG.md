# Nexe ChangeLog

## 2025-11-19, Version v6.0.0

### Breaking Changes

Nexe 6.0 is a major modernization release with full ES Module support and updated dependencies.

#### ES Module Migration
  * **BREAKING**: Converted entire codebase to ES Modules (ESM)
  * **BREAKING**: Node.js >= 18 now required (was >= 10)
  * Replaced CommonJS `require()` with ESM `import` statements
  * Updated TypeScript to target ES2022 with ESM modules
  * Added `.js` extensions to all relative imports per ESM requirements

#### Major Dependency Updates
  * `chalk`: 4.1.2 → 5.6.2 (ESM)
  * `node-fetch`: 2.7.0 → 3.3.2 (ESM)
  * `globby`: 11.1.0 → 16.0.0 (ESM)
  * `got`: 11.8.6 → 14.6.4 (ESM)
  * `ora`: 5.4.1 → 9.0.0 (ESM)
  * `mkdirp`: 1.0.4 → 3.0.1 (ESM)
  * `rimraf`: 3.0.2 → 6.1.0 (ESM)
  * `tar`: 6.2.1 → 7.5.2
  * `chai`: 4.5.0 → 6.2.1 (ESM)
  * `execa`: 5.1.1 → 9.6.0 (ESM)
  * `mocha`: 10.2.0 → 11.7.5
  * `prettier`: 2.8.8 → 3.6.2
  * `typescript`: 5.0.3 → 5.9.3
  * `@types/node`: Added at 24.10.1

#### Removed Dependencies
  * Removed deprecated `tslint` (replaced with prettier)
  * Removed deprecated `caw` proxy package
  * Removed various outdated @types packages

#### New Features
  * Added `tsx` for modern TypeScript ESM execution
  * Added `lodash-es` for ESM-compatible lodash utilities
  * Updated webpack configuration for ESM compatibility

#### Security
  * Fixed all npm audit vulnerabilities (0 vulnerabilities)
  * Replaced vulnerable `download` package with `node-fetch` and `tar`
  * Updated all dependencies to latest secure versions

### Migration Guide

To migrate from 5.x to 6.x:

1. **Update Node.js**: Ensure you're running Node.js 18 or higher
2. **Update imports**: If extending nexe, convert any CommonJS requires to ESM imports
3. **API compatibility**: The core nexe API remains backwards compatible for most use cases

## 2017-05-29, Version v2.0.0-beta.1, @calebboyd

Nexe 2.0 is a rewrite to enable some new features. These include:
  * Quick Builds!
  * Userland build patches
  * Resource storage/access rewrite
  * stdin interface
  * Optional, pluggable bundling

### Breaking Changes
  * New options -- Please see the [readme](README.md#options)
  * Bundling is no longer enabled by default
  * To access included resources `fs.readFile` and `fs.readFileSync` should be used

## 2015-02-20, Version v0.3.7, @jaredallard

### Noteable Changes

  * Fixed #103.
  * Made not-available require not a fatal error.
  * Stub and system to ignore certain requires.
  * Added 'sys' to ignore list.
  * We have a gitter!
  * Gave win32 a 100 length progress bar.

### Commits

  * [**2cacd83**] Update README.md (@crcn)
  * [**0e90ac9**] Update README.md (@crcn)
  * [**54967d1**] Added Gitter badge (@jaredallard)
  * [**bb489a3**] Fixes #98 by giving win32 a 100 length progress bar. (@jaredallard)
  * [**39665a8**] Lighter weight way to accomplish the exclusion of the sys module (@CKarper)
  * [**5aca22d**] This handles embedding 'bin' scripts with shebang interpreter... (@CKarper)
  * [**e79b0fb**] Stub to ignore require('sys') (@CKarper)

## 2015-02-15, Version v0.3.6, @jaredallard

### Noteable Changes

  * Now support .json in require.
  * Fixed a major --python flag bug.

### Commits

  * [**cac6986**] V bump to solve critical error. (@jaredallard)
  * [**b040337**] Fixes #99, resolves #97 by warning on missing file. New examples... (@jaredallard)
  * [**ad4da1d**] Support .json extensions in require() resolution (@CKarper)

## 2015-02-14, Version v0.3.5, @jaredallard

### Noteable Changes

  * Added new flag: `--python </path/to/python>`
  * Added resourceFiles option which allows embedding files and getting them via embed.js
  * Updated a bunch of the dependencies.
  * `process.argv` is now consistent in a child fork case.
  * Added `child_process.fork` support.
  * Added new collaborators:
    * Jared Allard (@jaredallard)

### Commits

  * [**e4155c8**] Version bump 0.3.5, update depends (@jaredallard)
  * [**e91f5b5**] Add example, fix outdated examples (@jaredallard)
  * [**3b1d5a9**] Modify README, implement cross-plat `--python <loc>` closes #94 (@jaredallard)
  * [**29d5f6a**] Make `process.argv` consistent in the child fork case (@LorenzGardner)
  * [**97dbd37**] Add support for embedded files. (@LorenzGardner)
  * [**b615e12**] Make the example code demonstrate forked process and dynamic require (@LorenzGardner)
  * [**333cc69**] update read me mentioning usage of `child_process.fork` (@LorenzGardner)
  * [**ece4b2d**] Add `child_process.fork` support. (@LorenzGardner)
