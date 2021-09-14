# gh-pro

Git Pro is a CLI that facilitates working with Git, Github and JIRA from the terminal so the developer can stay focused and avoid context switching to different applications.

## createJiraIssueApi

Create JIRA Issue API

```ts
import { createJiraIssueApi } from "gh-pro";
const api = createJiraIssueApi({
    host,
    username,
    password,
})
```

## setIssueStatus

Set JIRA Issue Status

```ts
api.setIssueStatus("ZN-1234", "Development")
```

## Create Github PR

Create Github PR

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/gh-pro.svg)](https://npmjs.org/package/gh-pro)
[![Downloads/week](https://img.shields.io/npm/dw/gh-pro.svg)](https://npmjs.org/package/gh-pro)
[![License](https://img.shields.io/npm/l/gh-pro.svg)](https://github.com/hogarthww-labs/gh-pro/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
## Usage
<!-- usage -->
```sh-session
$ npm install -g gh-pro
$ gh-pr COMMAND
running command...
$ gh-pr (-v|--version|version)
gh-pro/0.0.0 darwin-x64 node-v14.15.0
$ gh-pr --help [COMMAND]
USAGE
  $ gh-pr COMMAND
...
```
<!-- usagestop -->
### Commands
<!-- commands -->
* [`gh-pr pr`](#gh-pr-pr)
* [`gh-pr branch`](#gh-pr-branch)

## `gh-pr pr`

Create a standardised Github PR

```bash
USAGE
  $ gh-pr pr

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -t, --title=title  title of PR
  -j, --jira=jira JIRA issue ID
  -r, --reviewers=iwo,lukasz List of PR reviewers
  -l, --labels=fix,api PR labels
  -d, --draft Draft PR
  -w, --web Open PR in web browser

EXAMPLE
  $ gh-pr pr
  > Title?
  > Description?
  > JIRA Id [ZN-XXXX]?
  > Reviewers?
  > Labels?
  > Draft?
  > Open PR in web browser?
```

_See code: [src/commands/hello.ts](https://github.com/hogarthww-labs/gh-pro/blob/v0.0.0/src/commands/hello.ts)_

## `gh-pr help [COMMAND]`

display help for gh-pr

```bash
USAGE
  $ gh-pr help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.3/src/commands/help.ts)_
<!-- commandsstop -->
