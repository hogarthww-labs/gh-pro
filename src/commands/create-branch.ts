import { Command, flags } from "@oclif/command";

import { cosmiconfig } from "cosmiconfig";

import execa from "execa";

import {
  IJiraIssueDetails,
  JiraCommand,
  IIssue,
  createBranchName,
  JiraPrompter,
} from "../utils";
export default class CreateBranch extends JiraCommand {
  static description = "create branch";

  static examples = [`$ gh-pro create-branch`];

  static flags = {
    help: flags.help({ char: "h" }),
    // name: flags.help({ char: "n", description: "name of branch" }),
  };

  branchName?: string;
  jiraIssue: IJiraIssueDetails = {};

  async createBranch() {
    // const args = [];
    const { branchName } = this;
    const { stdout } = await execa(`git branch ${branchName}`);
    this.log(stdout);
  }

  get prompter() {
    return new JiraPrompter();
  }

  branchNameFromJiraIssue(issue: IIssue) {
    const { branchParts } = this.appConfig;
    const branchName = createBranchName(issue, branchParts);
    return branchName.fromJiraIssue();
  }

  async run() {
    await super.run();

    this.branchName = this.branchNameFromJiraIssue(this.issue as IIssue);

    await this.createBranch();

    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`);
    // }
  }
}
