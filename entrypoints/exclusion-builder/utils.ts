import { DelayJSScriptType, FDTExcludedResource } from '@/Globals';
import NoticeHTML from './pages/ExclusionBuilder/override-notice.html?raw';
const deferJSAttr = 'data-rocket-defer';
const alrAttr = 'data-wpr-lazyrender';
const lazyloadAttr = 'data-lazy-src';
const lazyloadSrcsetAttr = 'data-lazy-srcset';
const lazyloadSizesAttr = 'data-lazy-sizes';
const alrStyleId = 'rocket-lazyrender-inline-css';

export class InvalidExclusionError extends Error {
  static name = 'InvalidExclusionError';
  constructor(
    m: string,
    public invalidExclusions: string[]
  ) {
    super(m);
    this.name = 'InvalidExclusionError';
  }
}
export class SavingFileError extends Error {
  static name = 'SavingFileError';
  constructor(m: string) {
    super(m);
    this.name = 'SavingFileError';
  }
}
export class HTMLFileEmpty extends Error {
  static name = 'HTMLFileEmpty';
  constructor(m: string = 'The HTML file is empty') {
    super(m);
    this.name = 'HTMLFileEmpty';
  }
}
export class DocumentCreationError extends Error {
  static name = 'DocumentCreationError';
  constructor(m: string) {
    super(m);
    this.name = 'DocumentCreationError';
  }
}
export function createDocument(inputHTML: string): Document {
  try {
    const parser = new DOMParser();
    const inputDOM = parser.parseFromString(inputHTML, 'text/html');
    return inputDOM;
  } catch (e: any) {
    throw new DocumentCreationError(e.message);
  }
}
/**
 * Apply DelayJS exclusions to the HTML document
 *
 * @param htmlDocument - The HTML document to apply the exclusions to
 */
export function applyDelayJSExclusions(htmlDocument: Document, exclusions: string[]) {
  if (exclusions.length === 0) return;
  const invalidRegExps = getInvalidRegExps(exclusions);
  if (invalidRegExps.length > 0) {
    throw new InvalidExclusionError(
      'Invalid exclusion for DelayJS found. Check the console for more information',
      invalidRegExps
    );
  }
  const allDelayedScripts = Array.from(
    htmlDocument.querySelectorAll<HTMLScriptElement>(`script[type="${DelayJSScriptType}"]`)
  );
  for (const script of allDelayedScripts) {
    const scriptHTML = script.outerHTML;
    for (const exclusion of exclusions) {
      if (exclusion.trim() === '') continue;
      const regExpResult = scriptHTML.match(new RegExp(exclusion));
      if (regExpResult) {
        excludeScriptDelayJS(script);
        break;
      }
    }
  }
}
/**
 * Apply DeferJS exclusions to the HTML document
 *
 * @param htmlDocument - The HTML document to apply the exclusions to
 */
export function applyDeferJSExclusions(htmlDocument: Document, exclusions: string[]) {
  if (exclusions.length === 0) return;
  const invalidRegExps = getInvalidRegExps(exclusions);
  if (invalidRegExps.length > 0) {
    throw new InvalidExclusionError(
      'Invalid exclusion for DeferJS found. Check the console for more information',
      invalidRegExps
    );
  }
  const allDeferredJS = Array.from(
    htmlDocument.querySelectorAll<HTMLScriptElement>(`script[${deferJSAttr}]`)
  );
  for (const script of allDeferredJS) {
    let realSrc = '';
    if (script.type === DelayJSScriptType) {
      realSrc = script.getAttribute('data-rocket-src') ?? '';
    } else {
      realSrc = script.src ?? '';
    }
    for (const exclusion of exclusions) {
      if (exclusion.trim() === '') continue;
      const regExpResult = realSrc.match(new RegExp(exclusion));
      if (regExpResult) {
        script.removeAttribute(deferJSAttr);
        script.removeAttribute('defer');
        script.setAttribute(FDTExcludedResource, '');
        break;
      }
    }
  }
}
/**
 * Apply Lazyload exclusions to the HTML document
 *
 * @param htmlDocument - The HTML document to apply the exclusions to
 */
export function applyLazyloadExclusions(htmlDocument: Document, exclusions: string[]) {
  if (exclusions.length === 0) return;
  const lazyloadedImages = Array.from(
    htmlDocument.querySelectorAll<HTMLImageElement>(`img[${lazyloadAttr}]`)
  );
  for (const img of lazyloadedImages) {
    if (!img.getAttribute(lazyloadAttr)) continue;
    // Cloning the IMG to "simulate" the original img element
    const imgClone = img.cloneNode(true) as HTMLImageElement;
    imgClone.setAttribute('src', img.getAttribute(lazyloadAttr)!);
    imgClone.removeAttribute(lazyloadAttr);
    const outerHTML = imgClone.outerHTML;
    for (const exclusion of exclusions) {
      if (exclusion.trim() === '') continue;
      if (outerHTML.includes(exclusion)) {
        img.setAttribute('src', img.getAttribute(lazyloadAttr)!);
        img.removeAttribute(lazyloadAttr);
        if (img.hasAttribute(lazyloadSrcsetAttr)) {
          img.setAttribute('srcset', img.getAttribute(lazyloadSrcsetAttr)!);
          img.removeAttribute(lazyloadSrcsetAttr);
        }
        if (img.hasAttribute(lazyloadSizesAttr)) {
          img.setAttribute('sizes', img.getAttribute(lazyloadSizesAttr)!);
          img.removeAttribute(lazyloadSizesAttr);
        }
        img.setAttribute(FDTExcludedResource, '');
        break;
        // NOTE: Remove the <noscript> after the <img>???
      }
    }
  }
}
/**
 * Apply ALR exclusions to the HTML document
 *
 * @param htmlDocument - The HTML document to apply the exclusions to
 */
export function applyALRExclusions(htmlDocument: Document, exclusions: string[]) {
  if (exclusions.length === 0) return;
  const allElementWithALR = Array.from(htmlDocument.querySelectorAll<HTMLElement>(`*[${alrAttr}]`));
  for (const element of allElementWithALR) {
    const elementClone = element.cloneNode() as HTMLElement;
    elementClone.innerHTML = '';
    for (const exclusion of exclusions) {
      if (exclusion.trim() === '') continue;
      if (elementClone.outerHTML.includes(exclusion)) {
        element.removeAttribute(alrAttr);
        element.setAttribute(FDTExcludedResource, '');
        break;
      }
    }
  }
}

/**
 * @param htmlDocument - The HTML document to convert to a string with the proper DOCTYPE
 * @returns the HTML document as a string with the proper DOCTYPE
 */
export function outerHTMLWithDocType(htmlDocument: Document) {
  const out = '<!DOCTYPE html> \n' + htmlDocument.documentElement.outerHTML;
  return out;
}
/**
 * @returns A Node of the Chrome Overrides Notice
 */
export function createChromeOverridesNotice() {
  const template = document.createElement('template');
  template.innerHTML = NoticeHTML;
  const noticeFragment = template.content.cloneNode(true);
  return noticeFragment;
}

export const ChromeOverridesNotice: Node = createChromeOverridesNotice();
/**
 * Tests the array of exclusions to ensure they are valid RegExps
 *
 * @param exclusions - Array of strings to be validated as RegExps
 * @returns True if all exclusions are valid RegExps, otherwise an array of invalid exclusion strings
 */
export function getInvalidRegExps(exclusions: string[]): string[] {
  const invalidExclusions = exclusions.filter((exclusion: string) => {
    try {
      new RegExp(exclusion);
    } catch (_) {
      return true;
    }
    return false;
  });
  return invalidExclusions;
}

export function linesToArray(exclusionsText: string): string[] {
  if (!exclusionsText || exclusionsText === '') return [];
  const exclusionsArray = exclusionsText
    .split('\n')
    .map((e) => {
      return e.trim();
    })
    .filter((e) => {
      return e !== '';
    });
  return exclusionsArray;
}

export async function saveFile(fileHandle: FileSystemFileHandle, htmlText: string) {
  try {
    const writableStream = await fileHandle.createWritable();
    if (!htmlText.trim()) {
      throw new HTMLFileEmpty('Nothing to save, content is empty');
    }
    // write our file
    await writableStream.write(htmlText);
    // close the file and write the contents to disk.
    await writableStream.close();
  } catch (e: any) {
    throw new SavingFileError(e.message);
  }
}
function excludeScriptDelayJS(script: HTMLScriptElement) {
  if (script.type !== DelayJSScriptType) return;
  const realType = script.getAttribute('data-rocket-type');
  script.removeAttribute('data-rocket-type');
  script.removeAttribute('type');
  if (realType) {
    script.setAttribute('type', realType);
  }
  const realSrc = script.getAttribute('data-rocket-src');
  if (realSrc) {
    script.removeAttribute('data-rocket-src');
    script.setAttribute('src', realSrc);
    script.setAttribute(FDTExcludedResource, '');
  }
}
export function disableDelayJS(htmlDocument: Document) {
  const allScript = Array.from(htmlDocument.querySelectorAll<HTMLScriptElement>('script'));
  let userAgentScript = false;
  let delayJSScript = false;
  let elementorAnimation = false;
  for (const script of allScript) {
    if (script.textContent) {
      if (
        !userAgentScript &&
        script.textContent.match(/navigator\.userAgent\.match((.|\n|\r)*)\?nowprocket=1/)
      ) {
        script.remove();
        userAgentScript = true;
        continue;
      }
      if (!delayJSScript && script.textContent?.trim().includes('RocketLazyLoadScripts.run')) {
        script.remove();
        delayJSScript = true;
        continue;
      }
      if (
        !elementorAnimation &&
        script.textContent?.trim().includes('RocketElementorAnimation.run')
      ) {
        script.remove();
        elementorAnimation = true;
        continue;
      }
    }
    excludeScriptDelayJS(script);
  }
}
export function disableDeferJS(htmlDocument: Document) {
  const allDeferredJS = Array.from(
    htmlDocument.querySelectorAll<HTMLScriptElement>(`script[${deferJSAttr}]`)
  );
  for (const script of allDeferredJS) {
    script.removeAttribute(deferJSAttr);
    script.removeAttribute('defer');
  }
}
export function disableALR(htmlDocument: Document) {
  const allElementWithALR = Array.from(
    htmlDocument.querySelectorAll<HTMLScriptElement>(`*[${alrAttr}]`)
  );
  for (const element of allElementWithALR) {
    element.removeAttribute(alrAttr);
  }
  document.querySelector(`#${alrStyleId}`)?.remove();
}
