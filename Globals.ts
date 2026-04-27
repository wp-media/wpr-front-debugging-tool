import { KnownPlatform } from './Types';

export const ExtensionAlarms = {
  updateKnownConflictsDB: 'update-known-conflicts-db'
};

export const ExtensionContextMenuIds = {
  wprSideBySide: 'wprSideBySide',
  psiSideBySide: 'psiSideBySide',
  updateKnownConflictsDB: 'updateKnownConflictsDB',
  exclusionBuilderPage: 'exclusionBuilderPage'
};

export const Channels = {
  reloadDevTools: 'reload-dev-tools',
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
  undefinedReferencesUpdated: 'undefined-references-updated'
};

export const CustomEvents = {
  reportErrorToExtension: 'report-error-to-extension'
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
export const FDTExcludedResource = 'data-wpr-fdt-excluded';
export const WPRDeferAttribute = 'data-rocket-defer';
/** Legacy type value used by older WP Rocket versions (pre-3.20.6). */
export const DelayJSScriptTypeOld = 'rocketlazyloadscript';
/** Current type value used by WP Rocket 3.20.6+. */
export const DelayJSScriptTypeCurrent = 'text/rocketlazyloadscript';
/**
 * All known DelayJS script type attribute values, ordered old → current.
 * Extend this tuple if WP Rocket ever introduces a third variant.
 */
export const DelayJSScriptTypes = [DelayJSScriptTypeOld, DelayJSScriptTypeCurrent] as const;
/**
 * Returns true when the provided type attribute value corresponds to a
 * WP Rocket delayed script — regardless of whether the page was generated
 * by an old or current version of WP Rocket.
 *
 * Matching strategy: `DelayJSScriptTypeOld` ("rocketlazyloadscript") is a
 * literal substring of `DelayJSScriptTypeCurrent` ("text/rocketlazyloadscript"),
 * so a single String.prototype.includes() call covers both values with no
 * risk of false positives (the string is unique enough that no other valid
 * type attribute would accidentally contain it).
 *
 * Handles null / undefined gracefully — returns false.
 */
export function isDelayJSType(type: string | null | undefined): boolean {
  if (!type) return false;
  return type.includes(DelayJSScriptTypeOld);
}
/**
 * Builds a CSS attribute selector string that matches script elements
 * carrying any of the known DelayJS type attribute values.
 *
 * Example output:
 *   'script[type="rocketlazyloadscript"], script[type="text/rocketlazyloadscript"]'
 *
 * The result is valid for Document.querySelectorAll() — comma-separated
 * selectors are part of the CSS Selectors Level 3 spec (§5 "Groups of
 * selectors") and supported universally.
 * @see https://www.w3.org/TR/selectors-3/#grouping
 */
export function delayJSScriptSelector(): string {
  return DelayJSScriptTypes.map((t) => `script[type="${t}"]`).join(', ');
}
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
  'image-compare__',
  FDTExcludedResource
];

export const undefinedReferenceExternalError = '__EXTERNAL_ORIGIN_ERROR__';
// This is to stop using magic strings along the extension.
export const WPROptions = {
  rocket_lrc_optimization: 'rocket_lrc_optimization',
  remove_unused_css: 'remove_unused_css',
  delay_js: 'delay_js',
  defer_all_js: 'defer_all_js',
  async_css: 'async_css',
  lazyload: 'lazyload',
  lazyload_iframes: 'lazyload_iframes',
  lazyload_css_bg_img: 'lazyload_css_bg_img',
  minify_css: 'minify_css',
  minify_js: 'minify_js',
  preload_links: 'preload_links',
  rocket_above_the_fold_optimization: 'rocket_above_the_fold_optimization',
  cdn: 'cdn'
};
