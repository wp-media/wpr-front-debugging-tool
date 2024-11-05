import { onMessage } from 'webext-bridge/content-script';
import CSS from './sideBySide.css?raw';
import HTML from './sideBySide.html?raw';
import { Channels } from '@/Globals';
export type WPRIframesURLs = { cached: string; bypassed: string };
export default defineContentScript({
  matches: ['https://*/*', 'http://*/*'],
  runAt: 'document_start',
  main(cxt) {
    if (cxt.isInvalid) return;
    SideBySideContentScript();
  }
});
function SideBySideContentScript() {
  /**
   * Saves the original value of the overflow style property for html and body elements of the page
   */
  const pageOverflow = {
    html: '',
    body: ''
  };
  /**
   * This will be true if the Side by Side modal is being showed, false otherwise
   */
  let showing = false;
  /**
   * Used to track if the Side by Side Modal is showed for the first time or not
   */
  let first = true;
  /**
   * A URL object with a copy of the current site's URL (Will be used later to set the URLs for cached and non-cached versions to the corresponding iframe)
   */
  const SITEURL = new URL(window.location.href);
  window.addEventListener('DOMContentLoaded', () => {
    // Saving a copy of the original value of the overflow, to be able to restore it later
    pageOverflow.html = document.documentElement.style.overflow;
    pageOverflow.body = document.body.style.overflow;
    // Create a template element to parse the HTML into an HTMLElement
    const template = document.createElement('template');
    template.innerHTML = `<div class="side-by-side" id="side-by-side"></div>`;
    const sideBySideFragment = template.content.cloneNode(true) as DocumentFragment;
    // The modal that will be injected to the page
    const sideBySideModal = sideBySideFragment.getElementById('side-by-side')!;
    sideBySideModal.attachShadow({ mode: 'open' });
    sideBySideModal.shadowRoot!.innerHTML = `<style>${CSS}</style>` + HTML;
    const closeButton = sideBySideModal.shadowRoot!.querySelector('.sbs-close-button');
    const refreshCachedButton = sideBySideModal.shadowRoot!.querySelector(
      '.sbs-refresh-cached-button'
    );
    const refreshBypassedButton = sideBySideModal.shadowRoot!.querySelector(
      '.sbs-refresh-bypassed-button'
    );
    closeButton?.addEventListener('click', closeSideBySide);
    refreshCachedButton?.addEventListener('click', refreshCached);
    refreshBypassedButton?.addEventListener('click', refreshBypassed);
    // Saving a reference of the iframes that will be used for the side by side
    const iframes = {
      cached: sideBySideModal.shadowRoot!.querySelector('.sbs-cached') as HTMLIFrameElement,
      bypassed: sideBySideModal.shadowRoot!.querySelector('.sbs-bypassed') as HTMLIFrameElement
    };
    /**
     * Creates the correct site URLs (Cached and non-cached) to be used on the Side by Side iframes
     * @return Returns an object containing the URLs for the cached version and the non-cached (with the ?nowprocket query string)
     */
    function getSiteURLs(siteURL: URL): WPRIframesURLs {
      const urls = {
        cached: '',
        bypassed: ''
      };
      if (!siteURL.searchParams.has('nowprocket')) {
        urls.cached = siteURL.href;
        siteURL.searchParams.append('nowprocket', '1');
        urls.bypassed = siteURL.href;
      } else {
        urls.bypassed = siteURL.href;
        siteURL.searchParams.delete('nowprocket');
        urls.cached = siteURL.href;
      }
      return urls;
    }
    /**
     * Creates the correct PSI URLs (to test Cached and non-cached) to be used on the Side by Side iframes
     * @return Returns an object containing the PSI URLs for the cached version and the non-cached versions of the site's URL
     */
    function getPSIURLs(siteURL: URL): WPRIframesURLs {
      // https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwp-rocket.me%2F
      const siteURls = getSiteURLs(siteURL);
      const urls = {
        cached: '',
        bypassed: ''
      };
      const psiURL = new URL('https://pagespeed.web.dev/analysis');
      psiURL.searchParams.append('url', siteURls.cached);
      urls.cached = psiURL.href;
      psiURL.searchParams.set('url', siteURls.bypassed);
      urls.bypassed = psiURL.href;
      return urls;
    }
    /**
     * Gets the correct URLs to be used on the Side by Side iframes depending on whether it is PSI or not
     * @return Returns an object containing the URLs
     */
    function getIframesURLs(): WPRIframesURLs {
      if (SITEURL.host === 'pagespeed.web.dev' && SITEURL.searchParams.get('wpr-sbs')) {
        const siteURL = new URL(SITEURL.searchParams.get('wpr-sbs')!);
        return getPSIURLs(siteURL);
      }
      return getSiteURLs(SITEURL);
    }
    /**
     * Used to open the Side by Side modal, it makes it visible.
     */
    function openSideBySide() {
      if (first) {
        // Injecting the modal to the page
        document.body.append(sideBySideModal);
        const urls = getIframesURLs();
        iframes.cached.src = urls.cached;
        iframes.bypassed.src = urls.bypassed;
        first = false;
      }
      showing = true;
      setTimeout(() => {
        sideBySideModal.classList.add('sbs-active');
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
      }, 10);
    }
    /**
     *  Used to close the Side by Side modal, it makes it invisible.
     */
    function closeSideBySide() {
      sideBySideModal.classList.remove('sbs-active');
      showing = false;
      document.documentElement.style.overflow = pageOverflow.html;
      document.body.style.overflow = pageOverflow.body;
    }
    /**
     * Refreshes cached side only
     */
    function refreshCached() {
      iframes.cached.src = iframes.cached.src;
    }
    /**
     * Refreshes bypassed side only
     */
    function refreshBypassed() {
      iframes.bypassed.src = iframes.bypassed.src;
    }
    onMessage(Channels.openSideBySide, () => {
      if (showing) return;
      openSideBySide();
    });
    onMessage(Channels.openSideBySidePerformance, () => {
      if (SITEURL.host === 'pagespeed.web.dev') return;
      // Opens a new tab / window with the https://pagespeed.web.dev/ to open side by side performance test
      const siteURL = new URL(window.location.href);
      const pageSpeedURL = new URL('https://pagespeed.web.dev/');
      siteURL.searchParams.delete('nowprocket');
      siteURL.searchParams.delete('wpr-sbs');
      pageSpeedURL.searchParams.append('wpr-sbs', siteURL.href);
      window.open(pageSpeedURL.href, '_blank');
    });

    // console.log(HTML);
    if (SITEURL.host === 'pagespeed.web.dev' && SITEURL.searchParams.get('wpr-sbs')) {
      closeButton?.classList.add('hidden');
      refreshCachedButton?.classList.add('hidden');
      refreshBypassedButton?.classList.add('hidden');
      openSideBySide();
    }
  });
}
