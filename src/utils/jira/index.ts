import { Issue } from "./issue";
import dotenv from "dotenv";
import JsBase64 from "js-base64";
import request from "request";
import fs from "fs-extra";
import os from "os";
import path from "path";
import readlineSync from "readline-sync";

import * as utils from "./utils";

const { Base64 } = JsBase64;

export const loadEnv = () => dotenv.config();

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
  utils.debug(`Writing settings to .env`);
  var configFileContents = [
    `JIRA_HOST=${jiraHost}`,
    `JIRA_USER=${username}`,
    `JIRA_BASICAUTH=${Base64.encode(basicAuthToken)}`,
    "",
  ].join(os.EOL);
  fs.writeFileSync("./.env", configFileContents);
};

export const branchNameFromJiraIssue = (issue: Issue) => {
  const { summary } = issue;
  // Use body.fields.summary as the branch name
  if (!summary) return;
  let branch = utils.branchFromSummary(summary);
  branch = utils.addTicketPrefix(branch, jiraTicket);
  branch = utils.truncateBranch(branch);
  return branch;
};
