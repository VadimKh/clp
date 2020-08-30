clp
===

ClickUp cli

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/clp.svg)](https://npmjs.org/package/clp)
[![Downloads/week](https://img.shields.io/npm/dw/clp.svg)](https://npmjs.org/package/clp)
[![License](https://img.shields.io/npm/l/clp.svg)](https://github.com/VadimKh/clp/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g clp
$ clp COMMAND
running command...
$ clp (-v|--version|version)
clp/0.0.0 darwin-x64 node-v13.10.1
$ clp --help [COMMAND]
USAGE
  $ clp COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`clp init`](#clp-init)
* [`clp hello [FILE]`](#clp-hello-file)
* [`clp help [COMMAND]`](#clp-help-command)

## `clp init`

Run it to setup clickup cli

```
USAGE
  $ clp init

OPTIONS
  -h  Help 

EXAMPLE
  $ clp init
```

_See code: [src/commands/init.ts](https://github.com/VadimKh/clp/blob/v0.0.0/src/commands/init.ts)_

## `clp hello [FILE]`

Text

```
USAGE
  $ clp help

OPTIONS
  -h  Help 

EXAMPLE
  $ clp help
```

_See code: [src/commands/help.ts](https://github.com/VadimKh/clp/blob/v0.0.0/src/commands/help.ts)_

## `clp help [COMMAND]`

display help for clp

```
USAGE
  $ clp help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_
<!-- commandsstop -->
