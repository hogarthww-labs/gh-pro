import { Command, flags } from "@oclif/command";

import { cosmiconfig } from "cosmiconfig";

import execa from "execa";

import { JiraPrompter } from "./../utils";
import { branchNameFromJiraIssue } from "../utils";
import JiraCommand from "../utils/command/JiraCommand";
import { IIssue } from "./../utils/jira/issue";
interface IJiraIssueDetails {
  id?: string;
  type?: string;
  summary?: string;
}
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

  async loadConfig() {
    const explorer = cosmiconfig("gh-pro");
    const result = await explorer.search();
    if (!result) return;
    const { config } = result;
    if (!config) return;
    this.config = config;
  }

  get prompter() {
    return new JiraPrompter();
  }

  async run() {
    await super.run();

    this.branchName = branchNameFromJiraIssue(this.issue as IIssue);

    await this.createBranch();

    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`);
    // }
  }
}
