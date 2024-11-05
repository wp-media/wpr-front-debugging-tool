import 'webext-bridge/background';
// import { onMessage } from 'webext-bridge/background';
import { RequestInterceptor } from './RequestInterceptor';
import { setContextMenus } from './setContextMenus';
const URLPatterns = ['https://*/*', 'http://*/*'];

export default defineBackground({
  type: 'module',
  main() {
    // RequestInterceptor gets page headers
    new RequestInterceptor(URLPatterns).listen();
    setContextMenus(URLPatterns);
  }
});
