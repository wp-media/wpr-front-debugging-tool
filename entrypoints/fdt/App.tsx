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
import type { FDTData } from '../devtoolsContentScript.content';
import PreloadedResourcesPage from './pages/PreloadedResources';
import UndefinedReferencesPage from './pages/UndefinedReferencesFinderPage';
import { onMessage } from 'webext-bridge/content-script';

const wprData = sendMessage(Channels.getFDTData, {}, ChannelTargets.contentScript);
const menuItems = [
  { name: 'WPR Detections', path: '/' },
  { name: 'JavaScript', path: '/JavaScriptPage' },
  { name: 'Lazyload', path: '/LazyLoadPage' },
  { name: 'Preloaded Resources', path: '/PreloadedResourcesPage' },
  { name: 'Undefined Reference Finder', path: '/UndefinedReferencesFinderPage' }
];
const isLoading = Symbol('isLoading');
const isError = Symbol('isError');
const isOk = Symbol('isOk');
export default function App() {
  const [fetchState, setFetchState] = useState<Symbol>(isLoading);
  const [fdtData, setFdtData] = useState<FDTData | undefined>(undefined);
  const [undefinedReferencesOnPage, setUndefinedReferencesOnPage] = useState<string[]>([]);
  const [areScriptsLoaded, setAreScriptsLoaded] = useState(false);

  useEffect(() => {
    onMessage(Channels.allScriptsLoaded, ({ data }) => {
      setAreScriptsLoaded(!!data);
    });
    onMessage(Channels.newUndefinedReference, ({ data }) => {
      if (!data) return;
      const word = data as unknown as string;
      setUndefinedReferencesOnPage(Array.from(new Set([...undefinedReferencesOnPage, word])));
    });
    wprData
      .then((data) => {
        if (!data) {
          setFetchState(isError);
        } else {
          const fdtData = data as unknown as FDTData;
          setFdtData(fdtData);
          setAreScriptsLoaded(fdtData.allScriptsLoaded);
          setUndefinedReferencesOnPage(Array.from(new Set(fdtData.undefinedWordsOnPage)));
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
              <Route path="/LazyloadPage" children={<LazyloadResourcesPage fdtData={fdtData} />} />
              <Route
                path="/PreloadedResourcesPage"
                children={<PreloadedResourcesPage fdtData={fdtData} />}
              />
              <Route
                path="/UndefinedReferencesFinderPage"
                children={
                  <UndefinedReferencesPage
                    fdtData={fdtData}
                    undefinedReferencesOnPage={undefinedReferencesOnPage}
                    areScriptsLoaded={areScriptsLoaded}
                  />
                }
              />
              <Route children={<WPRDetectionsPage fdtData={fdtData} />} />
            </Switch>
          </div>
        </Router>
      )}
    </>
  );
}
