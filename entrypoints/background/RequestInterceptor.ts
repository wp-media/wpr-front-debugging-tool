import { Channels } from '@/Globals';
import { onMessage } from 'webext-bridge/background';
import type { WebRequest } from 'wxt/browser';

export class RequestInterceptor {
  #pagesHeaders: Map<number, WebRequest.HttpHeaders | undefined>;
  #listening = false;
  URLPatterns: string[];
  constructor(URLPatterns: string[]) {
    this.URLPatterns = URLPatterns;
    this.#pagesHeaders = new Map();
  }
  listen() {
    if (this.#listening) {
      return;
    }
    this.#listening = true;
    /**
     * Intercepts the TABs requests reponses to get the headers
     */
    browser.webRequest.onResponseStarted.addListener(
      (details: any) => {
        this.#pagesHeaders.set(details.tabId, details.responseHeaders);
      },
      {
        urls: this.URLPatterns,
        types: ['main_frame']
      },
      ['responseHeaders']
    );
    browser.tabs.onRemoved.addListener((tabId) => {
      this.#pagesHeaders.delete(tabId);
    });
    this.#listenRuntimeMessages();
  }
  #listenRuntimeMessages() {
    onMessage(Channels.getPageHeaders, (data) => {
      return this.#pagesHeaders.get(data.sender.tabId);
    });
  }
}
