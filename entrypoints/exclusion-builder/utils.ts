import NoticeHTML from './pages/ExclusionBuilder/override-notice.html?raw';

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
  const allScripts = Array.from(htmlDocument.querySelectorAll('script'));
  for (const script of allScripts) {
    const scriptHTML = script.outerHTML;
    for (let exclusion of exclusions) {
      if (script.type !== 'rocketlazyloadscript') continue;
      let regExpResult = scriptHTML.match(new RegExp(exclusion));
      if (regExpResult) {
        excludeScriptDelayJS(script);
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
}
/**
 * Apply Lazyload exclusions to the HTML document
 *
 * @param htmlDocument - The HTML document to apply the exclusions to
 */
export function applyLazyloadExclusions(htmlDocument: Document, exclusions: string[]) {
  if (exclusions.length === 0) return;
}
/**
 * Apply ALR exclusions to the HTML document
 *
 * @param htmlDocument - The HTML document to apply the exclusions to
 */
export function applyALRExclusions(htmlDocument: Document, exclusions: string[]) {
  if (exclusions.length === 0) return;
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
  if (script.type !== 'rocketlazyloadscript') return;
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
  }
}
