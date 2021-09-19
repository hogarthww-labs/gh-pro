import { cosmiconfigSync } from "cosmiconfig";

export const loadConfig = () => {
  const explorerSync = cosmiconfigSync("gh-pro");
  const result = explorerSync.search();
  if (!result) return;
  const { config } = result;
  if (!config) return;
  return config;
};
