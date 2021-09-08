import JiraApi from "jira-client";

interface JiraArgs {
  host?: string;
  username?: string;
  password?: string;
}

export const createJiraApi = ({
  host,
  username,
  password,
}: JiraArgs): JiraApi => {
  host = host || process.env.JIRA_HOST;
  username || process.env.JIRA_USER;
  password || process.env.JIRA_PASSWORD;
  if (!host) {
    throw "Missing JIRA host";
  }
  if (!username) {
    throw "Missing JIRA username";
  }
  if (!password) {
    throw "Missing JIRA password";
  }

  return new JiraApi({
    protocol: "https",
    apiVersion: "2",
    host,
    username,
    password,
    strictSSL: true,
  });
};
