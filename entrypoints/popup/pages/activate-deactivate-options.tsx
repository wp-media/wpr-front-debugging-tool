import type { WPRDetections } from '@/Types';
import { getRealOptionName } from '@/lib/optionNamesMap.util';

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

export function ActivateDeactivateOptions(props: { tabUrl: string; wprDetections: WPRDetections }) {
  const url = new URL(props.tabUrl);
  const { wprDetections } = props;
  if (url.searchParams.has('nowprocket')) url.searchParams.delete('nowprocket');
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
      <div className="feature-list">
        <div className="item">
          <span id="option-name">Cache</span>
          <label className="switch">
            <input type="checkbox" checked={wprDetections.wpr.cached} />
            <span className="slider round"></span>
          </label>
        </div>
        {optionList.map((optionName) => {
          return (
            <div className="item">
              <span id="option-name">{getRealOptionName(optionName)}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={Boolean(wprDetections[optionName as keyof WPRDetections])}
                />
                <span className="slider round"></span>
              </label>
            </div>
          );
        })}
      </div>
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
