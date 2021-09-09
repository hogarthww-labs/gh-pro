import fs from "fs-extra";

interface IPrjEnv {
  issueId: string;
}

export const getJiraIssueId = (prjEnv?: any) => {
  prjEnv = prjEnv || getPrjEnv();
  return prjEnv.issueId;
};

const prjCacheFilePath = "./prjcache";

export const getPrjEnv = () => {
  const content = fs.readFileSync(prjCacheFilePath, "utf-8");
  return JSON.parse(content);
};

export const savePrjEnv = (prjEnv: IPrjEnv) => {
  return fs.writeFileSync(prjCacheFilePath, JSON.stringify(prjEnv, null, 2));
};
