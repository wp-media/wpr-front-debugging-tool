import { KnownPlatform } from './Types';

export const Channels = {
  devToolsSearch: 'dev-tools-search',
  devToolsFDTTabId: 'dev-tools-fdt-tab-id',
  getFDTData: 'get-fdt-data',
  getWPRDetections: 'get-wpr-detections',
  getDiagnoserData: 'get-diagnoser-data',
  getAllPageData: 'get-processed-page-data',
  getPageHeaders: 'get-page-headers',
  processPageData: 'process-page-data',
  getKnownConflictsDB: 'get-known-conflicts-db',
  popupGetDetections: 'popup-get-detections',
  newErrorOnPage: 'NewErrorOnPage',
  allScriptsLoaded: 'rocket-allScriptsLoaded',
  sendPageData: 'send-page-data',
  pageLoaded: 'PageLoaded',
  wakeUpContentScript: 'wake-up-content-script',
  printDataInConsole: 'print-data-in-console',
  openSideBySidePerformance: 'open-side-by-side-performance',
  openSideBySide: 'open-side-by-side',
  toggleRUCSSTester: 'toggle-rucss-tester',
  getFreshPageHTML: 'get-fresh-page-html',
  newUndefinedReference: 'new-undefined-reference'
};

export const ChannelTargets = {
  background: 'background',
  contentScript: 'content-script',
  devTools: 'devtools',
  popup: 'popup',
  options: 'options',
  window: 'window',
  offscreen: 'offscreen'
};
export const DiagnoserIDs = {
  noRocketDataID: 'wpr-diagnoser-no-rocket-json-data',
  rocketDataID: 'wpr-diagnoser-rocket-json-data'
};
export const DELAYJS_SRC = 'data-rocket-src';
export const KnownPlatforms: Map<string, KnownPlatform> = new Map([
  [
    'WP Engine',
    [
      {
        headerName: 'X-Powered-By',
        value: 'WP Engine'
      }
    ]
  ],
  ['Kinsta', ['X-Kinsta-Cache']],
  ['Hostinger', [{ headerName: 'Platform', value: 'hostinger' }]]
]);
export const LAZYLOAD_EXCLUSIONS_LIST = [
  'data-src',
  'data-no-lazy',
  'data-lazy-original',
  'data-lazy-src',
  'data-lazysrc',
  'data-lazyload',
  'data-bgposition',
  'data-envira-src',
  'fullurl',
  'lazy-slider-img',
  'data-srcset',
  'class="ls-l',
  'class="ls-bg',
  'soliloquy-image',
  'loading="eager"',
  'swatch-img',
  'data-height-percentage',
  'data-large_image',
  'avia-bg-style-fixed',
  'data-skip-lazy',
  'skip-lazy',
  'class="skip-lazy"',
  'image-compare__'
];
