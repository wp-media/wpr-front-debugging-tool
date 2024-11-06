import { ExtensionAlarms, ExtensionContextMenuIds } from '@/Globals';
const endPoint = 'https://mega.wp-rocket.me/support/kc/known-conflicts.json';
import { knownConflictsStore } from '@/lib/storage';
// As soon as the browser starts, the Known Conflicts Database is updated
browser.runtime.onStartup.addListener(updateKnownConflictsDB);
let updating = false;
export async function knownConflictsBackground() {
  const alarm = await browser.alarms.get(ExtensionAlarms.updateKnownConflictsDB);
  if (!alarm) {
    // If the alarm doesn't exist, it is created so the Known Conflicts database is updated every hour
    browser.alarms.create(ExtensionAlarms.updateKnownConflictsDB, { periodInMinutes: 60 });
  }
  browser.alarms.onAlarm.addListener((alarm) => {
    // Updates the database when the alarm fires
    if (alarm.name === ExtensionAlarms.updateKnownConflictsDB) updateKnownConflictsDB();
  });
  browser.contextMenus.onClicked.addListener(async function (clickData) {
    if (clickData.menuItemId === ExtensionContextMenuIds.updateKnownConflictsDB) {
      updateKnownConflictsDB();
    }
  });
}

async function updateKnownConflictsDB() {
  if (updating) return;
  updating = true;
  const result = await fetch(endPoint)
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
  if (!result) return;
  knownConflictsStore.setValue(result);
  knownConflictsStore.setMeta({ lastUpdate: Date.now() });
  updating = false;
}
