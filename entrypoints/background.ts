import 'webext-bridge/background';
import { onMessage } from 'webext-bridge/background';
export default defineBackground({
  type: 'module',
  main() {
    onMessage('testing', test);
    async function test() {
      // Do whatever processing you need here.
      return {};
    }
  }
});
