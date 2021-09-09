import { JiraPrompter, getPrjEnv, savePrjEnv } from "./../utils";
import {
  createIssue,
  branchNameFromJiraIssue,
  createJiraApi,
  loadJiraEnv,
  getJiraIssueId,
} from "../utils";
import { Command, flags } from "@oclif/command";

import { cosmiconfig } from "cosmiconfig";

import execa from "execa";
interface IJiraIssueDetails {
  id?: string;
  type?: string;
  summary?: string;
}
export default class CreateBranch extends Command {
  static description = "create branch";

  static examples = [`$ gh-pro branch`];

  static flags = {
    help: flags.help({ char: "h" }),
  };

  branchName?: string;
  jiraIssue: IJiraIssueDetails = {};

  async createBranch() {
    const args = [];
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
    await this.loadConfig();

    const jiraEnv = loadJiraEnv();
    const prjEnv = getPrjEnv();
    if (!prjEnv || !prjEnv.issueId) {
      const issueId = this.prompter.promptIssueId();
      savePrjEnv({ issueId });
    }

    const { jiraIssueId } = getJiraIssueId();
    const jira = createJiraApi(jiraEnv);
    const issue = await createIssue(jira, jiraIssueId);
    this.branchName = branchNameFromJiraIssue(issue);

    await this.createBranch();

    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`);
    // }
  }
}
