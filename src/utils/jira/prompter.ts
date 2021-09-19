import readlineSync from "readline-sync";

import { Base64 } from "js-base64";

import { encodeBasicAuthToken } from "./jiraenv";

export class JiraPrompter {
  promptText(text: string): string {
    return readlineSync.question(text);
  }

  promptPasswordText(text: string): string {
    return readlineSync.question(text, { hideEchoBack: true });
  }

  promptHostName(): string {
    return this.promptText(this.jiraQuestions.host);
  }

  promptUsername(): string {
    return this.promptText(this.jiraQuestions.username);
  }

  promptIssueId(): string {
    return this.promptText(this.jiraQuestions.issueId);
  }

  promptPassword(): string {
    return this.promptPasswordText(this.jiraQuestions.password);
  }

  retrieveJiraBasicAuthToken = (username: string) => {
    const password = this.promptPassword();
    return encodeBasicAuthToken({ username, password });
  };

  get jiraQuestions() {
    return {
      host: "Enter your JIRA host (e.g.: jira.domain.com): ",
      username: "Enter your JIRA username: ",
      password: "Enter your JIRA password: ",
      issueId: "Enter current JIRA issue ID: ",
    };
  }
}
