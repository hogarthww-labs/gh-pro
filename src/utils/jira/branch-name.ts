import { paramCase, camelCase } from "change-case";

import { IIssue } from "./issue";

interface TicketMap {
  [key: string]: string;
}

const defaults = {
  parts: ["id", "epic", "type", "summary"],
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

export const createBranchName = (issue: IIssue, parts: string[]) =>
  new BranchName(issue, parts);

export class BranchName {
  branch: string = "";
  summary: string;
  epicName?: string;
  typeName?: string;
  id: string;
  parts: string[];

  constructor(issue: IIssue, parts: string[] = defaults.parts) {
    const { summary, epicName, typeName, id } = issue;
    this.parts = parts;
    this.summary = summary;
    this.epicName = epicName;
    this.typeName = typeName;
    this.id = id;
  }

  truncateBranch = (len: number = 64) => {
    return this.branch.substring(0, len);
  };

  fromId() {
    return this.id;
  }

  fromType() {
    return mapTicketType(this.typeName);
  }

  fromSummary() {
    if (!this.summary) return;
    return paramCase(this.summary);
  }

  fromEpic() {
    if (!this.epicName) return;
    return camelCase(this.epicName);
  }

  fromJiraIssue() {
    this.branch = this.parts
      .map((part) => {
        const meth = `from${camelCase(part)}`;
        const fun = (this as any)[meth] as any;
        return fun();
      })
      .join("/");
    return this.truncateBranch();
  }
}
