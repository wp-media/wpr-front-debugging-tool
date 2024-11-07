import { undefinedReferencesCapture } from '@/content-scripts/undefinedReferencesCapture';

export default defineContentScript({
  // Set manifest options
  matches: ['https://*/*', 'http://*/*'],
  runAt: 'document_start',
  world: 'MAIN',
  main() {
    undefinedReferencesCapture();
  }
});
