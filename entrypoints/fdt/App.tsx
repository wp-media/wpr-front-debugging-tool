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
import type { FDTData } from '@/content-scripts/devtoolsContentScript';
import PreloadedResourcesPage from './pages/PreloadedResources';
import UndefinedReferencesPage from './pages/UndefinedReferencesFinderPage';
import { onMessage } from 'webext-bridge/devtools';
import { DiagnoserPage } from './pages/DiagnoserPage';
import type { DevToolsSearch } from '@/Types';

const wprData = sendMessage(Channels.getFDTData, {}, ChannelTargets.contentScript);
const menuItems = [
  { name: 'Detections', path: '/' },
  { name: 'Diagnoser', path: '/DiagnoserPage' },
  { name: 'JavaScript', path: '/JavaScriptPage' },
  { name: 'Lazyload', path: '/LazyLoadPage' },
  { name: 'Preloaded Resources', path: '/PreloadedResourcesPage' },
  { name: 'Undefined Reference', path: '/UndefinedReferencesFinderPage' }
];
const isLoading = Symbol('isLoading');
const isError = Symbol('isError');
const isOk = Symbol('isOk');

export default function App() {
  const [fetchState, setFetchState] = useState<Symbol>(isLoading);
  const [fdtData, setFdtData] = useState<FDTData | undefined>(undefined);
  const [undefinedReferencesOnPageState, setUndefinedReferencesOnPageState] = useState<string[]>(
    []
  );
  const [areScriptsLoaded, setAreScriptsLoaded] = useState(false);
  const [devtoolsSearch, setDevtoolsSearch] = useState<DevToolsSearch>(undefined);

  useEffect(() => {
    wprData
      .then((data) => {
        if (!data) {
          setFetchState(isError);
        } else {
          const fdtData = data as unknown as FDTData;
          setFdtData(fdtData);
          setAreScriptsLoaded(fdtData.allScriptsLoaded);
          setUndefinedReferencesOnPageState(fdtData.undefinedReferencesOnPage);
          setFetchState(isOk);
          onMessage(Channels.allScriptsLoaded, ({ data }) => {
            setAreScriptsLoaded(!!data);
          });
          onMessage(Channels.undefinedReferencesUpdated, ({ data }) => {
            if (!data) return;
            const undefinedReferences = data as unknown as string[];
            setUndefinedReferencesOnPageState(undefinedReferences);
          });
          let bouncer: NodeJS.Timeout | null = null;
          onMessage(Channels.devToolsSearch, ({ data }) => {
            const searchData = data as DevToolsSearch;
            if (bouncer) clearTimeout(bouncer);
            bouncer = setTimeout(() => {
              setDevtoolsSearch(searchData);
              bouncer = null;
            }, 400);
          });
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
                path="/DiagnoserPage"
                children={<DiagnoserPage diagnoserData={fdtData.diagnoserData} />}
              />
              <Route
                path="/JavaScriptPage"
                children={
                  <JavaScriptResourcesPage fdtData={fdtData} devtoolsSearch={devtoolsSearch} />
                }
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
                    undefinedReferencesOnPage={undefinedReferencesOnPageState}
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
