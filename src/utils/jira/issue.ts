import JiraApi from "jira-client";

export class Issue {
  jira: JiraApi;
  id: string;
  issue: any;

  constructor(jira: JiraApi, id: string) {
    this.jira = jira;
    this.id = id;
    this.fetch();
  }

  async fetch() {
    const { jira, id } = this;
    this.issue = await jira.findIssue(id);
  }

  get fields() {
    return this.issue.fields;
  }

  get status() {
    return this.fields.status;
  }

  get summary() {
    return this.fields.summary;
  }
}
