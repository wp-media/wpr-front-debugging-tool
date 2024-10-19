import { Route, Router, Switch } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import WPRDetectionsPage from './pages/WPRDetectionsPage';
import DevToolsMenu from '@/components/app/devtools/menu';
import JavaScriptResourcesPage from './pages/JavaScriptPage';
import { sendMessage } from 'webext-bridge/devtools';
import ErrorGettingInformationPage from './pages/Error';
import FetchingPage from './pages/Fetching';
import LazyloadResourcesPage from './pages/LazyloadPage';
import { Channels, ChannelTargets } from '@/Globals';
import { WPRDetections } from '@/Types';
import type { FDTData } from '../devtoolsContentScript.content';

const wprData = sendMessage(Channels.getFDTData, {}, ChannelTargets.contentScript);
const menuItems = [
  { name: 'WPR Detections', path: '/' },
  { name: 'JavaScript', path: '/JavaScriptPage' },
  { name: 'Lazyload', path: '/LazyLoadPage' },
  { name: 'Preloaded Resources', path: '/PreloadedResourcesPage' },
  { name: 'Undefined Reference Finder', path: '/UndefinedReferenceFinderPage' }
];
const isLoading = Symbol('isLoading');
const isError = Symbol('isError');
const isOk = Symbol('isOk');
export default function App() {
  const [fetchState, setFetchState] = useState<Symbol>(isLoading);
  const [fdtData, setFdtData] = useState<FDTData | undefined>(undefined);
  useEffect(() => {
    wprData
      .then((data) => {
        if (!data) {
          setFetchState(isError);
        } else {
          setFdtData(data as unknown as FDTData);
          setFetchState(isOk);
        }
      })
      .catch(() => {
        setFetchState(isError);
      });
  }, []);
  return (
    <>
      {/* Depending on the state, a different component is mounted */}
      {fetchState === isLoading && <FetchingPage />}
      {(fetchState === isError || (fetchState !== isLoading && !fdtData)) && (
        <ErrorGettingInformationPage />
      )}
      {fetchState === isOk && fdtData && (
        <Router hook={useHashLocation}>
          <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-100">
            <DevToolsMenu items={menuItems} />
            <Switch>
              <Route
                path="/JavaScriptPage"
                children={<JavaScriptResourcesPage fdtData={fdtData} />}
              />
              <Route path="/LazyloadPage" children={<LazyloadResourcesPage />} />
              <Route children={<WPRDetectionsPage fdtData={fdtData} />} />
            </Switch>
          </div>
        </Router>
      )}
    </>
  );
}
