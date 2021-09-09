import dotenv from "dotenv";

import JsBase64 from "js-base64";
import * as fs from "fs-extra";

import * as utils from "./utils";
import * as os from "os";

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

export const computeBasicAuthToken = (basicAuthToken: string) =>
  Base64.decode(basicAuthToken);

export const storeJiraEnv = ({
  configPath,
  jiraHost,
  username,
  basicAuthToken,
}: any) => {
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
