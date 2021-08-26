/* eslint-disable lines-between-class-members */
/* eslint-disable no-return-await */
/* eslint-disable no-console */
/* eslint-disable semi */
/* eslint-disable object-curly-spacing */
/* eslint-disable quotes */
// eslint-disable-next-line semi
import { Command, flags } from "@oclif/command";

import { cosmiconfig } from "cosmiconfig";

import cli from "cli-ux";

import inquirer from "inquirer";

import execa from "execa";

export default class CreatePr extends Command {
  static description = "describe the command here";

  static examples = [
    `$ gh-pr --title "add tabs" --jira 1234`,
    `$ gh-pr -t "add tabs" -j 1234`,
  ];

  static flags = {
    help: flags.help({ char: "h" }),

    // flag with a value (-t, --title="add tabs")
    title: flags.string({ char: "t", description: "PR title" }),
    // flag with a value (-j, --jira=ZN-1234)
    jira: flags.string({ char: "j", description: "JIRA ticket ID" }),
    // flag with a value (-j, --jira=ZN-1234)
    reviewers: flags.string({ char: "r", description: "Reviewers" }),
    // flag with a value (-j, --jira=ZN-1234)
    labels: flags.string({ char: "l", description: "Labels" }),
    // flag with no value (-d, --draft)
    draft: flags.boolean({ char: "d" }),
    web: flags.boolean({ char: "w" }),
  };

  // static args = [
  //   {
  //     name: "title", // name of arg to show in help and reference with args[name]
  //     required: false, // make the arg required with `required: true`
  //     description: "PR title", // help description
  //     hidden: true, // hide this arg from help
  //     parse: (input) => "output", // instead of the user input, return a different value
  //     default: "world", // default value if no arg input
  //     options: ["a", "b"], // only allow input to be from a discrete set
  //   },
  // ];

  aliases: any;
  title?: string;
  description?: string;
  jiraId?: string;
  reviewers?: string[];
  labels?: string[];
  web = false;
  draft = false;
  choices: {
    reviewers?: string | string[];
    labels?: string | string[];
  } = {};

  async createPr() {
    const { description, title, jiraId, reviewers, labels, web, draft } = this;
    const args = [];
    const pr: any = {};
    if (title && jiraId) {
      pr.title = `[${jiraId}] ${title}`;
      args.push(`---title ${pr.title}`);
    }
    if (description) {
      args.push(`---body ${description}`);
    }
    if (labels) {
      args.push(`---label ${labels}`);
    }
    if (reviewers) {
      args.push(`---reviewer ${reviewers}`);
    }
    if (web) {
      args.push(`---web`);
    }
    if (draft) {
      args.push(`---draft`);
    }
    if (args.length > 0) {
      const { stdout } = await execa("gh pr", args);
      this.log(stdout);
    }
  }

  async promptTitle() {
    return await cli.prompt("Title");
  }

  async promptLabels() {
    return await inquirer.prompt([
      {
        name: "labels",
        message: "Labels",
        type: "list",
        choices: this.choices.labels,
      },
    ]);
  }

  async promptReviewers() {
    return await inquirer.prompt([
      {
        name: "reviewers",
        message: "Reviewers",
        type: "list",
        choices: this.choices.reviewers,
      },
    ]);
  }

  async promptJiraID() {
    return await cli.prompt("JIRA Id [ZN-XXXX]");
  }

  async promptDesc() {
    return await cli.prompt("Description");
  }

  async promptWeb() {
    return await cli.confirm("Open PR in web browser");
  }

  async loadConfig() {
    const explorer = cosmiconfig("gh-pro");
    const result = await explorer.search();
    if (!result) return;
    const { config } = result;
    if (!config) return;
    this.config = config;
    const { reviewers, labels, aliases } = config;
    this.aliases = aliases;
    this.choices = {
      reviewers,
      labels,
    };
  }

  parseStrToList(txt: string | undefined) {
    if (!txt) return [];
    return txt.split(",").map((item: string) => item.trim());
  }

  validateTicketNumber(txt: string | undefined) {
    if (!txt) {
      throw new Error("Missing ticket number. Must be 1 or more digits (0-9)");
    }
    const digits = /^\d+$/;
    if (!txt.match(digits)) {
      throw new Error("Invalid ticket number. Must be 1 or more digits (0-9)");
    }
    return txt;
  }

  validateTicketPrefix(prefix: string) {
    if (prefix !== "ZN") {
      throw new Error("Invalid ticket prefix. Ticket ID must start with ZN-");
    }
  }

  parseJiraIdSections(prefix: string, id: string): string {
    this.validateTicketNumber(id);
    this.validateTicketPrefix(prefix);
    return [prefix, id].join("-");
  }

  parseJiraId(txt: string | undefined) {
    if (!txt) return;
    txt = txt.replace("[", "");
    txt = txt.replace("]", "");
    let prefix;
    let id;
    if (txt.includes("-")) {
      const args = txt.split("-");
      prefix = args[0];
      id = args[1];
    } else {
      prefix = "ZN";
      id = txt;
    }
    return this.parseJiraIdSections(prefix, id);
  }

  parseLabels(str: string | undefined) {
    return this.parseStrToList(str);
  }

  parseReviewers(str: string | undefined) {
    const list = this.parseStrToList(str);
    list.map((item: string) => this.aliases[item] || item);
    return list;
  }

  async run() {
    await this.loadConfig();

    const { flags } = this.parse(CreatePr);
    this.title = flags.title && (await this.promptTitle());
    const jiraId = flags.jira || (await this.promptJiraID());
    this.jiraId = this.parseJiraId(jiraId);
    this.description = await this.promptDesc();
    this.reviewers =
      this.parseReviewers(flags.reviewers) && (await this.promptReviewers());
    this.labels = this.parseLabels(flags.labels) && (await this.promptLabels());
    this.web = flags.web && (await this.promptWeb());

    await this.createPr();

    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`);
    // }
  }
}
