import { JiraIssueApi } from "./issue-api";

export const createIssue = async (jira: JiraIssueApi, id: string) => {
  const issue = new Issue(jira, id);
  return await issue.fetch();
};

interface IFields {
  [key: string]: any;
}
export interface IIssue {
  id: string;
  status: string;
  typeName?: string;
  epicName?: string;
  summary: string;
  description: string;
  fields: IFields;
  project: any;
  workLog: any[];
  subTasks: any[];
  issueLinks: any[];
  timeTracking: any;
  labels: string[];
  comments: any[];
}

class Issue {
  jira: JiraIssueApi;
  id: string;
  typeName?: string;
  epicName?: string;
  issue: any;

  constructor(jira: JiraIssueApi, id: string) {
    this.jira = jira;
    this.id = id;
  }

  async fetch() {
    const { jira, id } = this;
    this.issue = await jira.findIssue(id);
    this.typeName = await jira.findIssueTypeNameById(id);
    this.epicName = await jira.getEpicFieldName(id);
    return this;
  }

  get fields(): IFields {
    return this.issue.fields;
  }

  get project(): any {
    return this.fields.project;
  }

  get subTasks(): any[] {
    return this.fields["sub-tasks"];
  }

  get issueLinks(): any[] {
    return this.fields.issueLinks;
  }

  get workLog(): any[] {
    return this.fields.workLog;
  }

  get timeTracking(): any {
    return this.fields.timeTracking;
  }

  get labels(): string[] {
    return this.fields.labels;
  }

  get comments(): any[] {
    return this.fields.comment;
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
