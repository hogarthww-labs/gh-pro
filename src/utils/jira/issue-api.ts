import JiraApi from "jira-client";

export class JiraIssueApi extends JiraApi {
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

  findField(fieldsKv: any, name: string = "Epic Link"): any {
    const keys = Object.keys(fieldsKv);
    const key = keys.find((key: string) => {
      const item = fieldsKv[key];
      return item.name === name;
    });
    if (!key) {
      throw `No ${name} field could be found in JIRA`;
    }
    const value = fieldsKv[key];
    return { key, value };
  }

  async getEpicFieldName(issueNumber: string) {
    const { key } = this.findField(issueNumber, "Epic Link");
    const issue = await this.findIssue(issueNumber, undefined, key);
    const result = this.findField(issue.fields, key);
    return result.value;
  }

  findIssueTypeNameById(issueNumber: string) {
    return this.findIssueTypeById(issueNumber).name;
  }
}
