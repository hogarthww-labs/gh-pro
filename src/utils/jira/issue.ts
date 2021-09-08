import JiraApi from "jira-client";

export const createIssue = async (jira: JiraApi, id: string) =>
  await new Issue(jira, id).fetch();

interface IFields {
  [key: string]: any;
}
export interface IIssue {
  status: string;
  summary: string;
  description: string;
  fields: IFields;
}

class Issue {
  jira: JiraApi;
  id: string;
  issue: any;

  constructor(jira: JiraApi, id: string) {
    this.jira = jira;
    this.id = id;
  }

  async fetch() {
    const { jira, id } = this;
    this.issue = await jira.findIssue(id);
  }

  get fields(): IFields {
    return this.issue.fields;
  }

  get status(): string {
    return this.fields.status;
  }

  get summary(): string {
    return this.fields.summary;
  }

  get description(): string {
    return this.fields.description;
  }
}
