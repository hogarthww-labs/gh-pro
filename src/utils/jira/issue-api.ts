import JiraApi from "jira-client";

export const createJiraIssueApi = (options: JiraApi.JiraApiOptions) => {
  return new JiraIssueApi(options);
};

const defaults = {
  options: {
    protocol: "https",
    apiVersion: "2",
    strictSSL: true,
  },
};
export class JiraIssueApi extends JiraApi {
  constructor(options: JiraApi.JiraApiOptions) {
    super({
      ...defaults.options,
      ...options,
    });
  }

  /**
   * @name findIssue
   * @function
   * Find an issue in jira
   * [Jira Doc](http://docs.atlassian.com/jira/REST/latest/#id290709)
   * @param {string} issueNumber - The issue number to search for including the project key
   * @param {string} expand - The resource expansion to return additional fields in the response
   * @param {string} fields - Comma separated list of field ids or keys to retrieve
   * @param {string} properties - Comma separated list of properties to retrieve
   * @param {boolean} fieldsByKeys - False by default, used to retrieve fields by key instead of id
   */
  findIssueTypeById(issueNumber: string): any {
    return this["doRequest"](
      this["makeRequestHeader"](
        this["makeUri"]({
          pathname: `/issueType/${issueNumber}`,
        })
      )
    );
  }

  findIssueMeta(issueNumber: string): any {
    return this["doRequest"](
      this["makeRequestHeader"](
        this["makeUri"]({
          pathname: `/issue/${issueNumber}/editmeta`,
        })
      )
    );
  }

  // search for case insensitive match
  findByName(fieldsKv: any, name: string): any {
    const keys = Object.keys(fieldsKv);
    const key = keys.find((key: string) => {
      const item = fieldsKv[key];
      return item.name.toLowerCase() === name.toLowerCase();
    });
    if (!key) {
      throw `No ${name} entry could be found`;
    }
    const value = fieldsKv[key];
    return { key, value };
  }

  async getEpicFieldName(issueNumber: string) {
    const { key } = this.findByName(issueNumber, "Epic Link");
    const issue = await this.findIssue(issueNumber, undefined, key);
    const result = this.findByName(issue.fields, key);
    return result.value;
  }

  async findTransition(issueNumber: string, status: string) {
    const transitionsAvailable = await this.listTransitions(issueNumber);
    const { value } = this.findByName(transitionsAvailable, status);
    return value;
  }

  async setIssueStatus(issueNumber: string, status: string) {
    const { id } = await this.findTransition(issueNumber, status);
    return await this.transitionIssue(issueNumber, { id });
  }

  findIssueTypeNameById(issueNumber: string) {
    return this.findIssueTypeById(issueNumber).name;
  }
}
