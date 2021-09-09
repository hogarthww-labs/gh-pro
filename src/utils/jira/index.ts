import dotenv from "dotenv";

import JsBase64 from "js-base64";

import fs from "fs-extra";

import os from "os";

import readlineSync from "readline-sync";

import { IIssue } from "./issue";
import * as utils from "./utils";

const { Base64 } = JsBase64;

export const configPath = "./.jiraenv";
export const loadEnv = () => dotenv.config({ path: configPath });

export const loadJiraEnv = () => {
  loadEnv();
  return {
    hostname: process.env.JIRA_HOST,
    username: process.env.JIRA_USER,
    basicAuthToken: process.env.JIRA_BASICAUTH,
  };
};

let jiraTicket: any = null;

// Gather JIRA host
var jiraHost = process.env.JIRA_HOST;
if (!jiraHost) {
  jiraHost = readlineSync.question(
    "Enter your JIRA host (e.g.: jira.domain.com): "
  );
}

// Gather credentials
var username = process.env.JIRA_USER;
var password = null;
var basicAuthToken = process.env.JIRA_BASICAUTH;
if (!basicAuthToken) {
  if (!username) {
    username = readlineSync.question("Enter your JIRA username: ");
  }
}

export const getJiraIssueId = (prjEnv?: any) => {
  prjEnv = prjEnv || getPrjEnv();
  return prjEnv.issueId;
};

export const getPrjEnv = () => {
  const content = fs.readFileSync("./prjcache", "utf-8");
  return JSON.parse(content);
};

export const retrieveJiraBasicAuthToken = (username: string) => {
  password = readlineSync.question("Enter your JIRA password: ", {
    hideEchoBack: true,
  });
  basicAuthToken = Base64.encode(`${username}:${password}`);
};

export const computeBasicAuthToken = (basicAuthToken: string) =>
  Base64.decode(basicAuthToken);

export const storeJiraEnv = ({ jiraHost, username, basicAuthToken }: any) => {
  // Persist settings to $HOME/.jirabrancher file
  utils.debug(`Writing settings to {configPath}`);
  var configFileContents = [
    `JIRA_HOST=${jiraHost}`,
    `JIRA_USER=${username}`,
    `JIRA_BASICAUTH=${Base64.encode(basicAuthToken)}`,
    "",
  ].join(os.EOL);
  fs.writeFileSync(configPath, configFileContents);
};

export const branchNameFromJiraIssue = (issue: IIssue) => {
  const { summary } = issue;
  // Use body.fields.summary as the branch name
  if (!summary) return;
  let branch = utils.branchFromSummary(summary);
  branch = utils.addTicketPrefix(branch, jiraTicket);
  branch = utils.truncateBranch(branch);
  return branch;
};
