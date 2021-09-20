import * as inquirer from "inquirer";
import { IJiraIssueDetails } from "./../utils/command/jira";
import { flags } from "@oclif/command";
import { loadConfig, IIssue, JiraIssueApi } from "./../utils";
import { JiraCommand } from "../utils/command/jira";
import * as Config from "@oclif/config";
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
    return loadConfig().statusList || [];
  }

  status: string = "Development";
  jiraIssue: IJiraIssueDetails = {};
  statusList: string[];

  constructor(argv: string[], config: Config.IConfig) {
    super(argv, config);
    this.statusList = loadConfig().statusList;
  }

  async promptStatus() {
    return await inquirer.prompt([
      {
        name: "status",
        message: "Issue status",
        type: "list",
        choices: this.statusList,
      },
    ]);
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
    const answers = await this.promptStatus();
    this.status = answers.status;
    await this.updateStatus();
  }
}
