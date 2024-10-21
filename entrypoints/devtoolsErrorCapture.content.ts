export default defineContentScript({
  // Set manifest options
  matches: ['https://*/*', 'http://*/*'],
  runAt: 'document_start',
  world: 'MAIN',
  main() {
    const LIMIT = 50;
    const errors = 0;
    const customEventName = 'ReportErrorToExtension';
    const referenceErrorRegExp = /ReferenceError: (.*) is not defined/;
    const propertyOfUndefinedRegExp =
      /TypeError: Cannot read properties of undefined \(reading '(.*)'\)/;
    const notAFunction = /TypeError: (.*) is not a function/;
    function getTheWord(message: string): string | null {
      if (errors >= LIMIT) return null;
      let word: string | null;
      word = message.match(referenceErrorRegExp)?.[1] ?? null;
      if (word) return word;
      word = message.match(propertyOfUndefinedRegExp)?.[1] ?? null;
      if (word) return word;
      word = message.match(notAFunction)?.[1] ?? null;
      if (word) {
        const split = word.split('.');
        return split[split.length - 1];
      }
      return word;
    }
    window.addEventListener('error', (event) => {
      // Handle errors comming from script loaded from external servers / domains (Errors can't be read)
      if (event.message && event.message === 'Script error.') {
        document.dispatchEvent(
          new CustomEvent(customEventName, {
            detail: {
              word: '__EXTERNAL_ORIGIN_ERROR__'
            }
          })
        );
      }
      if (event.error && typeof event.error.stack === 'string') {
        const word = getTheWord(event.error.stack);
        if (word) {
          document.dispatchEvent(
            new CustomEvent(customEventName, {
              detail: {
                word
              }
            })
          );
        }
      }
    });
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && typeof event.reason.stack === 'string') {
        const word = getTheWord(event.reason.stack);
        if (word) {
          document.dispatchEvent(
            new CustomEvent(customEventName, {
              detail: {
                word
              }
            })
          );
        }
      }
    });
  }
});
