import { flags } from "@oclif/command";

import cli from "cli-ux";

import { loadJiraEnv, IIssue, JiraIssueApi } from "./../utils";
import JiraCommand from "../utils/command/JiraCommand";

interface IJiraIssueDetails {
  id?: string;
  type?: string;
  summary?: string;
}
export default class UpdateStatus extends JiraCommand {
  static description = "update JIRA issue status";
  static examples = [`$ gh-pro update-status Development`];

  static flags = {
    help: flags.help({ char: "h" }),
    // name: flags.help({ char: "n", description: "name of branch" }),
  };

  static args = [
    {
      name: "status", // name of arg to show in help and reference with args[name]
      required: false, // make the arg required with `required: true`
      description: "New JIRA issue status such as Development", // help description
      parse: (input: string) => input, // instead of the user input, return a different value
      default: "Development", // default value if no arg input
      options: this.loadOptions(),
    },
  ];

  static defaultIssueStatusOptions = [["Development", "Completed"]];

  static loadOptions() {
    return loadJiraEnv().statusList || [];
  }

  status: string = "Development";
  jiraIssue: IJiraIssueDetails = {};

  async promptStatus() {
    return await cli.prompt("Issue status");
  }

  async updateStatus() {
    // const args = [];
    const { status } = this;
    const issue = this.issue as IIssue;
    const api = this.api as JiraIssueApi;
    await api.setIssueStatus(issue.id, status);
    // this.log(stdout);
  }

  async run() {
    await super.run();
    this.status = await this.promptStatus();
    await this.updateStatus();
  }
}
