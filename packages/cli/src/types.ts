export interface PluginAnswers {
  pluginName: string;
  displayName: string;
  description: string;
  npmScope: string;
  authorName: string;
  authorEmail: string;
  githubOrg: string;
  githubRepo: string;
  license: string;
  installDeps: boolean;
  initGit: boolean;
}

export interface GitDefaults {
  authorName: string;
  authorEmail: string;
}
