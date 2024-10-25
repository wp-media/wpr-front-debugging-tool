import type { WPRDetections } from '@/Types';

const cacheOptionName = 'wpr_cache';
const optionList = [
  'minify_css',
  'minify_js',
  'minify_concatenate_js',
  'remove_unused_css',
  'async_css',
  'delay_js',
  'defer_all_js',
  'lazyload',
  'lazyload_iframes',
  'lazyload_css_bg_img',
  'cdn'
] as const;

export function ActivateDeactivateOptions(props: { wprDetections: WPRDetections }) {
  return (
    <div className="activate-deactivate-options-page">
      <h3>Disable or enable optimizations</h3>
      <div className="top-toolbar">
        <button id="enable-all" type="button">
          Enable All
        </button>
        <button id="disable-all" type="button">
          Disable All
        </button>
      </div>
      <div className="feature-list"></div>
      <div>
        <button id="apply" type="button">
          Apply
        </button>
      </div>
      <div>
        <button
          id="reset"
          type="button"
          title="Removes all the querystrings related to the diagnoser"
        >
          Reset URL
        </button>
      </div>
      <p className="info-message">
        For this to work, make sure to have{' '}
        <a href="https://github.com/wp-media/wp-rocket-diagnoser/releases" target="_blank">
          WP Rocket - Support Diagnoser
        </a>{' '}
        plugin installed and active on the site.
      </p>
    </div>
  );
}
