import '@/legacy/styles/switch.css';
import { useState } from 'react';
import { sendMessage } from 'webext-bridge/popup';
import { ActivateDeactivateOptions } from './pages/activate-deactivate-options';
import { Channels, ChannelTargets } from '@/Globals';
import type { WPRDetections } from '@/Types';
let [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
const isLoading = Symbol('isLoading');
const isError = Symbol('isError');
const isOk = Symbol('isOk');
const isIncompatible = Symbol('isIncompatible');

function App() {
  const [fetchState, setFetchState] = useState<Symbol>(isLoading);
  const [wprDetections, setWprDetections] = useState<WPRDetections | undefined>(undefined);
  const [tabUrl, setTabUrl] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!currentTab.url?.startsWith('http')) {
      setFetchState(isIncompatible);
      return;
    }
    if (!currentTab || !currentTab.id) {
      setFetchState(isError);
      return;
    }
    setTabUrl(currentTab.url!);
    const wprData = sendMessage(
      Channels.getWPRDetections,
      {},
      ChannelTargets.contentScript + `@${currentTab.id}`
    );
    wprData
      .then((data) => {
        console.log(data);
        if (!data) {
          setFetchState(isError);
        } else {
          const detections = data as unknown as WPRDetections;
          setWprDetections(detections);
          setFetchState(isOk);
        }
      })
      .catch(() => {
        setFetchState(isError);
      });
  }, []);

  if (fetchState === isLoading || fetchState === isIncompatible) {
    return (
      <div className="info-message full-screen">
        <span>
          {fetchState === isLoading ? 'Loading..' : 'Page incompatible with this feature'}
        </span>
      </div>
    );
  }
  if (fetchState === isError || (fetchState !== isLoading && !wprDetections)) {
    return (
      <div className="info-message full-screen">
        <span>An error ocurred fetching data from the extension :(</span>
      </div>
    );
  }
  return <ActivateDeactivateOptions wprDetections={wprDetections!} tabUrl={tabUrl!} />;
}

export default App;
