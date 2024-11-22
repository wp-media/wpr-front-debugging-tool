import { Channels, ChannelTargets, ExtensionContextMenuIds } from '@/Globals';
import { sendMessage } from 'webext-bridge/background';
import type { Menus } from 'wxt/browser';

export function setContextMenus(URLPatterns: Array<string>) {
  const wprSideBySideMenuItem: Menus.CreateCreatePropertiesType = {
    id: ExtensionContextMenuIds.wprSideBySide,
    title: 'Open Side By Side',
    contexts: ['all'],
    documentUrlPatterns: URLPatterns
  };
  const psiSideBySideMenuItem: Menus.CreateCreatePropertiesType = {
    id: ExtensionContextMenuIds.psiSideBySide,
    title: 'Open Side By Side Performance',
    contexts: ['all'],
    documentUrlPatterns: URLPatterns
  };
  const updateKnownConflictsDB: Menus.CreateCreatePropertiesType = {
    id: ExtensionContextMenuIds.updateKnownConflictsDB,
    title: 'Update Known Conflicts Database',
    contexts: ['action']
  };
  const exclusionBuilderPage: Menus.CreateCreatePropertiesType = {
    id: 'exclusionBuilderPage',
    title: 'Exclusion Builder',
    contexts: ['action'],
    documentUrlPatterns: URLPatterns
  };
  // Creting the context menu items passing the defined objects when the extension is installed
  browser.runtime.onInstalled.addListener(function () {
    browser.contextMenus.create(wprSideBySideMenuItem);
    browser.contextMenus.create(psiSideBySideMenuItem);
    browser.contextMenus.create(exclusionBuilderPage);
    browser.contextMenus.create(updateKnownConflictsDB);
  });

  browser.contextMenus.onClicked.addListener(async function (clickData) {
    let [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;
    if (clickData.menuItemId === psiSideBySideMenuItem.id) {
      sendMessage(
        Channels.openSideBySidePerformance,
        {},
        ChannelTargets.contentScript + `@${tab.id}`
      ).catch((e) => e);
    } else if (clickData.menuItemId === wprSideBySideMenuItem.id) {
      sendMessage(Channels.openSideBySide, {}, ChannelTargets.contentScript + `@${tab.id}`).catch(
        (e) => e
      );
    } else if (clickData.menuItemId === exclusionBuilderPage.id) {
      if (tab.incognito) return;
      const url = chrome.runtime.getURL('exclusion-builder.html');
      chrome.tabs.create({ url });
    }
  });
}
