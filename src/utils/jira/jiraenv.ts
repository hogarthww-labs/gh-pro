import dotenv from "dotenv";

import JsBase64 from "js-base64";

import * as fs from "fs-extra";

import * as os from "os";

import * as utils from "./utils";

const { Base64 } = JsBase64;

export const configPath = "./.jiraenv";
export const loadEnv = () => dotenv.config({ path: configPath });

interface IJiraEnv {
  statusList?: string[];
  hostname?: string;
  username?: string;
  password?: string;
  basicAuthToken?: string;
}

export const loadJiraEnv = (): IJiraEnv => {
  let loadedEnv = loadEnv() as any;
  delete loadedEnv["password"];
  const processEnvObj = {
    hostname: process.env.JIRA_HOST,
    username: process.env.JIRA_USER,
    password: process.env.JIRA_PASSWORD,
    basicAuthToken: process.env.JIRA_BASICAUTH,
  };

  // remove any undefined entries
  const processEnv = JSON.parse(JSON.stringify(processEnvObj));

  const env = {
    ...loadedEnv,
    ...processEnv,
  };

  env.basicAuthToken = env.basicAuthToken || encodeBasicAuthToken(env);
  return env;
};

export const encodeBasicAuthToken = ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => Base64.encode(`${username}:${password}`);

export const decodeBasicAuthToken = (basicAuthToken: string) =>
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
