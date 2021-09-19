import { Command } from "@oclif/command";

import { loadConfig } from "../config";
import { IIssue } from "../jira/issue";
import { JiraIssueApi } from "../jira/issue-api";

import {
  storeJiraEnv,
  JiraPrompter,
  getPrjEnv,
  savePrjEnv,
  createIssue,
  createJiraApi,
  loadJiraEnv,
  getJiraIssueId,
} from "..";

export interface IJiraIssueDetails {
  id?: string;
  type?: string;
  summary?: string;
}

interface IAppConfig {
  [key: string]: any;
}

export class JiraCommand extends Command {
  jiraIssue: IJiraIssueDetails = {};
  issue?: IIssue;
  api?: JiraIssueApi;
  appConfig: IAppConfig = {};

  get prompter() {
    return new JiraPrompter();
  }

  async run() {
    this.appConfig = loadConfig();
    const jiraEnv = loadJiraEnv();
    if (!jiraEnv.hostname) {
      jiraEnv.hostname = this.prompter.promptHostName();
    }
    if (!jiraEnv.username) {
      jiraEnv.username = this.prompter.promptUsername();
    }

    if (!jiraEnv.basicAuthToken) {
      jiraEnv.basicAuthToken = this.prompter.retrieveJiraBasicAuthToken(
        jiraEnv.username
      );
    }
    storeJiraEnv(jiraEnv);

    let prjEnv = getPrjEnv();
    if (!prjEnv || !prjEnv.issueId) {
      const issueId = this.prompter.promptIssueId();
      savePrjEnv({ issueId });
    }
    prjEnv = getPrjEnv();

    const { jiraIssueId } = getJiraIssueId(prjEnv);
    const api = createJiraApi(jiraEnv);
    this.api = api;
    const issue = await createIssue(api, jiraIssueId);
    this.issue = issue;
  }
}
