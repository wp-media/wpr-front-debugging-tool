export type PostMetaDisabledOptions = string[];

export type PluginInfo = {
  wprStatus: string;
  wprInstalledVersion?: string;
  diagnoserInstalledVersion: string;
  queryStringsInUrl: { [k: string]: string };
  userAgent: string;
  imagify: string | null;
};

export type ServerInfo = {
  serverLoad: number | null;
  webServer: string;
  phpMemoryLimit: string;
  wpMemoryLimit: string;
  wpMaxMemoryLimit: string;
};

export type Constants = { [k: string]: { defined: boolean; value?: boolean } };
export type PreloadRUCSSTaskStatus = {
  [k: string]: number;
};

export type PreloadRUCSSParameters = {
  [k: string]: number;
};

export type SomeOptions = {
  [k: string]: unknown;
};
export type SomeFilters = {
  [k: string]: unknown;
};

export type GeneralInfo = {
  postMetaDisabledOptions: PostMetaDisabledOptions;
  pluginInfo: PluginInfo;
  serverInfo: ServerInfo;
  constants: Constants;
  preloadRUCSSTaskStatus: PreloadRUCSSTaskStatus;
  preloadRUCSSParameters: PreloadRUCSSParameters;
  someOptions?: SomeOptions;
  someFilters?: SomeFilters;
};
