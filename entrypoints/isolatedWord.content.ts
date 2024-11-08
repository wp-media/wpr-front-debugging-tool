import { devToolsContentScript } from '@/content-scripts/devtoolsContentScript';
import { pageImprovements } from '@/content-scripts/improvements';
import { knownConflictsContentScript } from '@/content-scripts/known-conflicts';
import { sideBySideContentScript } from '@/content-scripts/sideBySide';
import { MessageBride } from '@/Types';
import { onMessage, sendMessage } from 'webext-bridge/content-script';

export default defineContentScript({
  // Set manifest options
  matches: ['https://*/*', 'http://*/*'],
  runAt: 'document_start',
  main(cxt) {
    const messageBridge: MessageBride = {
      onMessage,
      sendMessage
    };
    devToolsContentScript(cxt, messageBridge);
    sideBySideContentScript(cxt, messageBridge);
    pageImprovements();
    knownConflictsContentScript();
  }
});
