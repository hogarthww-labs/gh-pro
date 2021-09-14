# gh-pro

Git Pro is a CLI that facilitates working with Git, Github and JIRA from the terminal so the developer can stay focused and avoid context switching to different applications.

## OCLIF

The CLI is built on the [OCLIF](https://oclif.io/docs/multi) framework for CLI development.

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

### Commands

* [`gh-pr create-pr`](#gh-pr-pr)
* [`gh-pr create-branch`](#gh-pr-branch)

The CLI supports the following "smart" commands

* `create-pr`
* `create-branch`

## Create new oclif command

`npx oclif command goodbye`

The command name is the same as the file name in the `commands` folder

## Create Github PR

Create a standardised Github PR

`gh-pr create-pr`

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

_See code: [src/commands/create-pr.ts](https://github.hogarthww.com/lab-experiments/github-pro/blob/v0.0.0/src/commands/create-pr.ts)_

## Create Git branch

Create a standardised Git branch linked to JIRA ticket

`gh-pr create-branch`

If Jira credentials have not yet been entered and saved locally

```bash
USAGE
  $ gh-pr create-branch

OPTIONS
  -f, --force
  -h, --help       show CLI help

EXAMPLE
  $ gh-pr create-branch
  > Enter your JIRA host (e.g.: jira.domain.com):
  > Enter your JIRA username:
  > Enter your JIRA password:  
```

If JIRA issue ID has not been entered

```bash
> Enter current JIRA issue ID:
```

If Jira issue has been entered it will prompt if you want to confirm to continue with saved Issue ID

```bash
> Enter current JIRA issue ID: ZN-1234 
```

The command will then fetch the following JIRA issue details:

- Epic name
- Issue ID
- Summary

The branch name will be generated from this data as follows

`<Issue ID>/<epic name>/<Summary dashified>`

Example:

`ZN-1234/Featured-Collections/add-collection-to-parent`

_See code: [src/commands/create-branch.ts](https://github.hogarthww.com/lab-experiments/github-pro/blob/v0.0.0/src/commands/create-pr.ts)_

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
