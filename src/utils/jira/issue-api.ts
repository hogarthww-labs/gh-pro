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

  findIssueTypeNameById(issueNumber: string) {
    return this.findIssueTypeById(issueNumber).name;
  }
}
