import url from "url";

import { paramCase } from "change-case";

export const debug = (msg: string) => {
  if (process.env.JB_DEBUG) {
    console.log(msg);
  }
  return !!process.env.JB_DEBUG;
};

export const parseJiraTicket = (jiraTicket: any) => {
  if (jiraTicket.indexOf("http") === 0) {
    // parse URL
    let parsed = url.parse(jiraTicket);
    module.exports.debug(parsed.pathname);
    if (!parsed || !parsed.pathname) {
      throw "Missing or invalid JiraTicket";
    }
    jiraTicket = parsed.pathname.replace("/browse/", "");
    return jiraTicket;
  } else if (jiraTicket.indexOf("-") < 1) {
    throw new Error(`Invalid JIRA ticket "${jiraTicket}"`);
  } else {
    // Assume it's valid if it contains a dash
    return jiraTicket;
  }
};
