import { camelCase } from "change-case";

import { IIssue } from "./issue";
import * as utils from "./utils";

interface TicketMap {
  [key: string]: string;
}

const defaults = {
  ticketMap: {
    story: "feature",
    task: "chore",
    bug: "patch",
    spike: "experimental",
    testCase: "test",
  },
};

export const mapTicketType = (typeName?: string, ticketMap?: TicketMap) => {
  if (!typeName) return;
  const type = camelCase(typeName);
  ticketMap = ticketMap || defaults.ticketMap;
  return (ticketMap && ticketMap[type]) || type;
};

export const branchNameFromJiraIssue = (issue: IIssue) => {
  const { summary, epicName, typeName, id } = issue;
  // Use body.fields.summary as the branch name
  if (!summary) return;
  let branch = utils.branchFromSummary(summary);
  if (epicName) {
    branch = utils.addTicketPrefix(branch, epicName);
  }
  branch = utils.addTicketPrefix(branch, id);
  const type = mapTicketType(typeName);
  if (type) {
    branch = utils.addTicketPrefix(branch, type);
  }
  branch = utils.truncateBranch(branch);
  return branch;
};
