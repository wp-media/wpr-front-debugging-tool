import type { onMessage, sendMessage } from 'webext-bridge/content-script';

export type ChangeFields<T, R> = Omit<T, keyof R> & R;
export type KnownPlatform = Array<string | { headerName: string; value: string }>;
export type WPRDetections = {
  wpr: {
    present: boolean;
    cached: boolean;
    timeStamp: number | null;
  };
  remove_unused_css: {
    present: boolean;
  };
  delay_js: {
    present: boolean;
    scripts: Array<{
      inline: boolean;
      src?: string;
      content?: string;
      delayed: boolean;
      deferred: boolean;
      deferredByWPR: boolean;
      fdtExcluded: string | null;
    }>;
    delayedScripts: number;
  };
  defer_all_js: {
    present: boolean;
    scripts: string[];
  };
  async_css: {
    present: boolean;
  };
  lazyload: {
    present: boolean;
    images: Array<{ src: string; lazyloadDetected: boolean; excludedReasonsFound: string[] }>;
  };
  lazyload_iframes: {
    present: boolean;
    replaceImage: boolean;
  };
  lazyload_css_bg_img: {
    present: boolean;
  };
  minify_css: {
    present: boolean;
  };
  minify_js: {
    present: boolean;
  };
  preload_links: {
    present: boolean;
  };
  rocket_cdn: {
    present: boolean;
  };
  rocket_above_the_fold_optimization: {
    present: boolean;
    beacon: boolean;
    preloadedImages?: Array<string>;
  };
};
export type PreloadedResources = {
  present: boolean;
  resources?: Array<{ href: string; type: string }>;
};
export type DiagnoserRocketData = {
  options: {
    [key: string]: RocketDataOption;
  };
  post_meta_excluded_options: {
    [k: string]: boolean;
  };
};
export type RocketDataOption = {
  option_name: string;
} & {
  get_rocket_option: {
    [k: string]: unknown;
  };
  filters: {
    [k: string]: unknown;
  };
};

export type OnMessage = typeof onMessage;
export type SendMessage = typeof sendMessage;
export type MessageBride = {
  onMessage: OnMessage;
  sendMessage: SendMessage;
};
