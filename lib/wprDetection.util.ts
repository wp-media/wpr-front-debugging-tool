import type { PreloadedResources, WPRDetections } from '@/Types';
import { FDTExcludedResource, LAZYLOAD_EXCLUSIONS_LIST, WPRDeferAttribute } from '@/Globals';
// import { DELAYJS_SRC, LAZYLOAD_EXCLUSIONS_LIST } from '../../../Globals';
export type CheckOptimizationFunctionPayload = {
  HTMLDocument: Document;
  pageHTML: string;
  pageScripts: Array<HTMLScriptElement>;
  pageLinkElements: Array<HTMLLinkElement>;
};
export type CheckOptimizationFunction = (payload: CheckOptimizationFunctionPayload) => {
  present: boolean;
  [k: string]: any;
};
export const DELAYJS_SRC = 'data-rocket-src';

const CheckOptimizationFunctions: Record<keyof WPRDetections, CheckOptimizationFunction> = {
  wpr: wprCached,
  remove_unused_css: checkRUCSS,
  async_css: checkCPCSS,
  delay_js: checkDelayJS,
  defer_all_js: checkScriptsDeferred,
  lazyload: checkLazyLoad,
  lazyload_iframes: checkLazyLoadIframes,
  lazyload_css_bg_img: checkLLCSSBG,
  rocket_above_the_fold_optimization: checkOptimizeCriticalImages,
  minify_css: checkMinifyCSS,
  minify_js: checkMinifyJS,
  preload_links: checkPreloadLinks,
  rocket_cdn: checkRocketCDN
} as const;

/**
 * Function that looks for WP Rocket footprint on the page and checks if the cache is detected or not
 * @return Returns a {@link WPRDetections['wpr']} object which content depends on whether WP Rocket or it's cache is detected on the page
 */
export function wprCached({
  HTMLDocument
}: CheckOptimizationFunctionPayload): WPRDetections['wpr'] {
  const wpr: WPRDetections['wpr'] = {
    present: false,
    cached: false,
    timeStamp: null
  };
  let documentSibling = HTMLDocument.documentElement.nextSibling as Comment;
  while (documentSibling) {
    if (documentSibling.data && documentSibling.data.includes('This website is like a Rocket')) {
      wpr.present = true;
      if (documentSibling.data.includes('Debug: cached')) {
        wpr.cached = true;
        let timeStamp = documentSibling.data.match(/cached@(.*)/)?.[1];
        if (timeStamp) {
          wpr.timeStamp = parseInt(timeStamp);
        }
      }
      break;
    }
    documentSibling = documentSibling.nextSibling as Comment;
  }
  return wpr;
}
/**
 * Function that looks for signs of 'Lazyload for CSS Background images' on the page
 * @return Returns a {@link WPRDetections['llcssbg']} object which content depends on whether WP Rocket's Remove Unused CSS is detected on the page
 */
export function checkLLCSSBG({
  HTMLDocument
}: CheckOptimizationFunctionPayload): WPRDetections['lazyload_css_bg_img'] {
  const llcssbg =
    HTMLDocument.getElementById('wpr-lazyload-bg-container') ||
    HTMLDocument.getElementById('wpr-lazyload-bg-exclusion');
  return { present: Boolean(llcssbg) };
}
/**
 * Function that looks for signs of Remove Unused CSS on the page
 * @return Returns a {@link WPRDetections['rucss']} object which content depends on whether WP Rocket's Remove Unused CSS is detected on the page
 */
export function checkRUCSS({
  HTMLDocument
}: CheckOptimizationFunctionPayload): WPRDetections['remove_unused_css'] {
  const rucss = HTMLDocument.querySelector<HTMLStyleElement>('style#wpr-usedcss');
  if (rucss) return { present: true };
  return { present: false };
}
/**
 * Function that looks for signs of Load CSS Asynchronously on the page
 * @return Returns a {@link WPRDetections['cpcss']} object which content depends on whether WP Rocket's Load CSS Asynchronously is detected on the page
 */
export function checkCPCSS({
  pageScripts
}: CheckOptimizationFunctionPayload): WPRDetections['async_css'] {
  const present = pageScripts.some((script) => {
    if (!script.getAttribute('src')) return script.textContent?.includes('wprRemoveCPCSS');
    return false;
  });
  return { present };
}
/**
 * Function that looks for signs of Delay JavaScript Execution on the page
 * @return Returns a {@link WPRDetections['delayjs']} object which content depends on whether WP Rocket's Delay JavaScript Execution is detected on the page
 */
export function checkDelayJS({
  pageScripts
}: CheckOptimizationFunctionPayload): WPRDetections['delay_js'] {
  const delayjs: WPRDetections['delay_js'] = {
    present: false,
    scripts: [],
    delayedScripts: 0,
    version: null
  };
  for (const script of pageScripts) {
    const s: any = {
      delayed: false,
      inline: false
    };
    if (!delayjs.present && !script.hasAttribute('src')) {
      if (script.textContent?.includes('RocketLazyLoadScripts')) {
        delayjs.present = true;
        delayjs.version = extractVersion(script.textContent) ?? null;
      }
    }
    if ('rocketlazyloadscript' === script.getAttribute('type')) {
      delayjs.present = true;
      s.delayed = true;
      if (script.hasAttribute(DELAYJS_SRC)) {
        s.src = script.getAttribute(DELAYJS_SRC);
      } else {
        s.inline = true;
        s.content = script.innerText;
      }
      delayjs.delayedScripts++;
    } else {
      if (script.hasAttribute('src')) {
        s.src = script.getAttribute('src');
      } else {
        s.inline = true;
        s.content = script.innerText;
      }
    }
    s.deferred = script.hasAttribute('defer');
    s.deferredByWPR = script.hasAttribute(WPRDeferAttribute);
    s.fdtExcluded = script.getAttribute(FDTExcludedResource);
    delayjs.scripts?.push(s);
  }

  return delayjs;
}
/**
 * Extracts the version from the Delay JS script
 *
 * @param scriptCode - The full script as a string.
 * @returns Returns the version string if found, or null if not.
 */
function extractVersion(scriptCode: string): string | null {
  // Regular expression to match: this.v = "version"
  // Breakdown:
  //   - this\.v matches "this.v"
  //   - \s*=\s* matches an equals sign with optional whitespace
  //   - "([^"]+)" captures one or more characters that are not a double quote
  const versionRegex = /this\.v\s*=\s*"([^"]+)"/;
  const match = scriptCode.match(versionRegex);

  // If a match is found, return the captured version; otherwise, return null
  return match ? match[1] : null;
}
/**
 * Function that looks for signs of Lazyload for images on the page
 * @return Returns a {@link WPRDetections['lazyload']} object which content depends on whether WP Rocket's Lazyload for images is detected on the page
 */
export function checkLazyLoad({
  pageScripts,
  HTMLDocument
}: CheckOptimizationFunctionPayload): WPRDetections['lazyload'] {
  let containsLazloadScript = false;
  let containsLazloadInlineScript = false;
  const last = pageScripts.length - 1;
  // Looping in reverse because Lazyload scripts use to be at the end
  for (let i = last; i >= 0; i--) {
    if (containsLazloadScript && containsLazloadInlineScript) break;
    const script = pageScripts[i];
    const src = script.getAttribute('src');
    if (src && isLazyloadScriptPresent(src)) {
      containsLazloadScript = true;
      continue;
    }
    if (script.textContent?.match(/window.lazyLoadOptions=(.*)img\[data-lazy-src\]/)) {
      containsLazloadInlineScript = true;
    }
  }
  const isPresent = containsLazloadScript && containsLazloadInlineScript;
  const allImages: WPRDetections['lazyload']['images'] = Array.from(
    HTMLDocument.querySelectorAll('img')
  ).map((img) => {
    const llItem: any = {
      src: img.src,
      lazyloadDetected: img.hasAttribute('data-lazy-src') || img.hasAttribute('data-lazy-srcset'),
      excludedReasonsFound: []
    };
    llItem.src = llItem.lazyloadDetected
      ? img.getAttribute('data-lazy-src')
      : (img.getAttribute('data-src') ?? img.src ?? '');
    llItem.excludedReasonsFound = LAZYLOAD_EXCLUSIONS_LIST.filter((ex) => {
      return ex !== 'data-lazy-src' && img.outerHTML.includes(ex);
    });
    return llItem;
  });

  return { present: Boolean(isPresent), images: allImages };
}
/**
 * Function that looks for signs of "Lazyload for iframes and videos" on the page
 * @return Returns a {@link WPRDetections['lazyloadIframes']} object which content depends on whether WP Rocket's Minify CSS Files is detected on the page
 */
export function checkLazyLoadIframes({
  pageScripts
}: CheckOptimizationFunctionPayload): WPRDetections['lazyload_iframes'] {
  let containsLazloadScript = false;
  let containsLazloadInlineScript = false;
  let replaceImageScript = false;
  const last = pageScripts.length - 1;
  // Looping in reverse because Lazyload scripts use to be at the end
  for (let i = last; i >= 0; i--) {
    if (containsLazloadScript && containsLazloadInlineScript) break;
    const script = pageScripts[i];
    const src = script.getAttribute('src');
    if (src && isLazyloadScriptPresent(src)) {
      containsLazloadScript = true;
      continue;
    }
    if (script.textContent?.match(/window.lazyLoadOptions=(.*)iframe\[data-lazy-src\]/)) {
      containsLazloadInlineScript = true;
    }

    if (
      script.textContent?.match(/function lazyLoadThumb\((.*)function lazyLoadYoutubeIframe\(\)/)
    ) {
      replaceImageScript = true;
    }
  }
  const isPresent = containsLazloadScript && containsLazloadInlineScript;
  const replaceImage = isPresent && replaceImageScript;

  return { present: isPresent, replaceImage };
}
function isLazyloadScriptPresent(src: string): boolean {
  if (src && src.match(/(wp-rocket\/assets\/js\/lazyload\/.*\/lazyload(\.min)?\.js)/)) {
    return true;
  }
  return false;
}
/**
 * Function that looks for signs of Minify CSS Files on the page
 * @return Returns a {@link WPRDetections['minify_css']} object which content depends on whether WP Rocket's Minify CSS Files is detected on the page
 */
export function checkMinifyCSS({
  pageLinkElements
}: CheckOptimizationFunctionPayload): WPRDetections['minify_css'] {
  const isPresent = pageLinkElements.some((link) => {
    if (link.rel === 'stylesheet') {
      if (link.href?.match(/(.*)cache\/min\/\d+\/[a-zA-Z0-9_](.*).css(.*)/)) {
        return true;
      }
    }
    return false;
  });
  return isPresent ? { present: true } : { present: false };
}
/**
 * Function that looks for signs of Minify JavaScript Files on the page
 * @return Returns a {@link WPRDetections['minify_js']} object which content depends on whether WP Rocket's Minify JavaScript Files is detected on the page
 */
export function checkMinifyJS({
  pageScripts
}: CheckOptimizationFunctionPayload): WPRDetections['minify_js'] {
  const isPresent = pageScripts.some((script) => {
    if (script.getAttribute('src')) {
      if (script.src?.match(/(.*)cache\/min\/\d+\/[a-zA-Z0-9_](.*).js(.*)/)) {
        return true;
      }
    }
    return false;
  });
  return isPresent ? { present: true } : { present: false };
}
/**
 * Function that looks for signs of Preload Links on the page
 * @return Returns a {@link WPRDetections['preloadLinks']} object which content depends on whether WP Rocket's Preload Links is detected on the page
 */
export function checkPreloadLinks({
  HTMLDocument
}: CheckOptimizationFunctionPayload): WPRDetections['preload_links'] {
  const preloadLinks = {
    present: false
  };
  if (HTMLDocument.querySelector('#rocket-preload-links-js-extra')) {
    preloadLinks.present = true;
  }
  return preloadLinks;
}
/**
 * Function that looks for signs of RocketCDN on the page
 * @return Returns a {@link WPRDetections['rocket_cdn']} object which content depends on whether RocketCDN is detected on the page
 */
export function checkRocketCDN({
  HTMLDocument
}: CheckOptimizationFunctionPayload): WPRDetections['rocket_cdn'] {
  const prefetchElements = Array.from(
    HTMLDocument.querySelectorAll<HTMLLinkElement>('link[rel="dns-prefetch"]')
  );
  if (prefetchElements.length === 0) return { present: false };
  for (const link of prefetchElements) {
    if (link.href?.includes('.rocketcdn.me')) {
      return { present: true };
    }
  }
  return { present: false };
}
export function checkScriptsDeferred({
  HTMLDocument
}: CheckOptimizationFunctionPayload): WPRDetections['defer_all_js'] {
  const scripts = Array.from(
    HTMLDocument.querySelectorAll<HTMLScriptElement>(`script[${WPRDeferAttribute}]`)
  )
    .map(
      (script: HTMLScriptElement) =>
        script.getAttribute(DELAYJS_SRC) ?? script.getAttribute('src') ?? ''
    )
    .filter((src) => Boolean(src));
  if (scripts.length > 0) {
    return {
      present: true,
      scripts
    };
  }
  return { present: false, scripts: [] };
}
export function checkOptimizeCriticalImages({
  HTMLDocument
}: CheckOptimizationFunctionPayload): WPRDetections['rocket_above_the_fold_optimization'] {
  const beacon = HTMLDocument.querySelector('script[data-name="wpr-wpr-beacon"]');
  if (beacon) {
    return {
      present: true,
      beacon: true
    };
  }
  const preloadedImagesLinks = HTMLDocument.querySelectorAll<HTMLLinkElement>(
    'link[data-rocket-preload][as="image"]'
  );
  if (preloadedImagesLinks.length > 0) {
    const preloadedImagesURL = Array.from(preloadedImagesLinks).map((link) => link.href ?? '');
    return {
      present: true,
      beacon: false,
      preloadedImages: preloadedImagesURL
    };
  }
  return {
    present: false,
    beacon: false
  };
}
export function checkPreloadedResourced(HTMLDocument: Document): PreloadedResources {
  const preloadedResourcesLinks = HTMLDocument.querySelectorAll<HTMLLinkElement>(
    'link[data-rocket-preload]'
  );
  if (preloadedResourcesLinks.length === 0) {
    return {
      present: false
    };
  }
  const resourcesURLs = Array.from(preloadedResourcesLinks).map((link) => ({
    href: link.href,
    type: link.as ?? ''
  }));
  return {
    present: true,
    resources: resourcesURLs
  };
}
export default CheckOptimizationFunctions;
