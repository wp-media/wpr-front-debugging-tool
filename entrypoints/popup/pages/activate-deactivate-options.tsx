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
const allOptions = [cacheOptionName, ...optionList] as const;
type Option = (typeof allOptions)[number];

export function ActivateDeactivateOptions(props: { tabUrl: string; wprDetections: WPRDetections }) {
  const url = new URL(props.tabUrl);
  const { wprDetections } = props;
  if (url.searchParams.has('nowprocket')) url.searchParams.delete('nowprocket');
  const [activeOptions, setActiveOptions] = useState<Set<Option>>(new Set());
  useEffect(() => {
    const newSet = new Set<Option>();
    if (wprDetections.wpr.cached) {
      newSet.add(cacheOptionName);
    }
    for (const option of optionList) {
      if (option === 'cdn' || option === 'minify_concatenate_js') continue;
      if (wprDetections[option].present) {
        newSet.add(option);
      }
    }
    setActiveOptions(newSet);
  }, []);
  const handleToggle = (optionName: Option) => {
    const newSet = new Set<Option>(activeOptions);
    if (newSet.has(optionName)) {
      newSet.delete(optionName);
    } else {
      newSet.add(optionName);
    }
    setActiveOptions(newSet);
  };
  return (
    <div className="activate-deactivate-options-page">
      <h3>Disable or enable optimizations</h3>
      <div className="top-toolbar">
        <button
          id="enable-all"
          type="button"
          onClick={() => {
            setActiveOptions(new Set(allOptions));
          }}
        >
          Enable All
        </button>
        <button
          id="disable-all"
          type="button"
          onClick={() => {
            setActiveOptions(new Set());
          }}
        >
          Disable All
        </button>
      </div>
      <div className="feature-list">
        <div className="item">
          <span id="option-name">Cache</span>
          {/* Using old switch here because the other (@/components/ui/switch) requires tailwind here and using it here will break the styles */}
          <label className="switch">
            <input
              type="checkbox"
              checked={activeOptions.has(cacheOptionName)}
              onChange={() => handleToggle(cacheOptionName)}
            />
            <span className="slider round"></span>
          </label>
        </div>
        {optionList.map((optionName, index) => {
          return (
            <div className="item" key={index}>
              <span id="option-name">{getRealOptionName(optionName)}</span>
              <label className="switch">
                <input type="checkbox" checked={activeOptions.has(optionName)} />
                <span onClick={() => handleToggle(optionName)} className="slider round"></span>
              </label>
            </div>
          );
        })}
      </div>
      <div>
        <button id="apply" type="button" onClick={() => applyUrl(url, activeOptions)}>
          Apply
        </button>
      </div>
      <div>
        <button
          id="reset"
          type="button"
          title="Removes all the querystrings related to the diagnoser"
          onClick={() => resetUrl(url)}
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

async function applyUrl(url: URL, activeOptions: Set<Option>) {
  for (const option of allOptions) {
    url.searchParams.set(option, '0');
  }
  for (const option of activeOptions) {
    url.searchParams.set(option, '1');
  }
  url.searchParams.delete('nowprocket');
  url.searchParams.delete('wpr_activate_all');
  url.searchParams.delete('wpr_deactivate_all');
  await chrome.tabs.update({ url: url.href });
  window.close();
}
async function resetUrl(url: URL) {
  for (const option of allOptions) {
    url.searchParams.delete(option);
  }
  url.searchParams.delete('nowprocket');
  url.searchParams.delete('wpr_activate_all');
  url.searchParams.delete('wpr_deactivate_all');
  url.searchParams.delete('wpr_new_cache');
  await chrome.tabs.update({ url: url.href });
  window.close();
}
