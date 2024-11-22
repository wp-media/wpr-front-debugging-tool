import KnownConflictsDBJSON from '@/known-conflicts-db.json?raw';
let KnownConflictsDBParsed: any[] = JSON.parse(KnownConflictsDBJSON);

export type ImprovementOption = 'wp-dashboard-dbugger-entry';

export type StoredImprovementOptions = {
  [k in ImprovementOption]?: boolean;
};

export type StoredOptions = {
  improvements: StoredImprovementOptions;
};

export const OptionsStore = storage.defineItem<StoredOptions>('sync:options', {
  fallback: {
    improvements: {
      'wp-dashboard-dbugger-entry': false
    }
  }
});

export const knownConflictsStore = storage.defineItem<any[]>('local:known-conflicts-db', {
  fallback: KnownConflictsDBParsed
});
