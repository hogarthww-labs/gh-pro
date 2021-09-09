import { IIssue } from "./issue";
import * as utils from "./utils";

export const branchNameFromJiraIssue = (issue: IIssue) => {
  const { summary, id } = issue;
  // Use body.fields.summary as the branch name
  if (!summary) return;
  let branch = utils.branchFromSummary(summary);
  branch = utils.addTicketPrefix(branch, id);
  branch = utils.truncateBranch(branch);
  return branch;
};
