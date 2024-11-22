import { OptionsStore } from '@/lib/storage';

export async function pageImprovements() {
  const storedOptions = await OptionsStore.getValue();
  if (!storedOptions?.improvements) return;
  window.addEventListener('load', () => {
    if (storedOptions.improvements['wp-dashboard-dbugger-entry']) {
      wpDashboardDbuggerEntry();
    }
  });
}
/**
 * Adds an entry in the WP Rocket's menu (in WordPress Dashboard) to access the D-bugger
 */
function wpDashboardDbuggerEntry() {
  const ID = 'wp-admin-bar-d-bugger';
  if (document.querySelector(`#${ID}`)) return;
  const wpRocketMenu = document.querySelector('#wp-admin-bar-wp-rocket-default');
  if (!wpRocketMenu) return;
  const dbuggerEntry = document.createElement('li');
  dbuggerEntry.id = ID;
  dbuggerEntry.innerHTML =
    '<a class="ab-item" href="/wp-admin/tools.php?page=wprockettoolset">WPR D-bugger</a>';
  wpRocketMenu.appendChild(dbuggerEntry);
}
