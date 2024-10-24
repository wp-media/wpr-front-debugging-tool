export type ImprovementOption = 'wp-dashboard-dbugger-entry' | 'hs-highlight-open-conversations';

export type StoredImprovementOptions = {
  [k in ImprovementOption]?: boolean;
};

export type StoredOptions = {
  improvements: StoredImprovementOptions;
};

export const OptionsStore = storage.defineItem<StoredOptions>('sync:options', {
  fallback: {
    improvements: {
      'wp-dashboard-dbugger-entry': false,
      'hs-highlight-open-conversations': false
    }
  }
});
