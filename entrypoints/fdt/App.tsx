import { Route, Router, Switch } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import WPRDetectionsPage from './pages/WPRDetectionsPage';
import DevToolsMenu from '@/components/app/devtools/menu';
import JavaScriptResourcesPage from './pages/JavaScriptPage';
import { sendMessage } from 'webext-bridge/devtools';
import ErrorGettingInformationPage from './pages/Error';
import FetchingPage from './pages/Fetching';
import LazyloadResourcesPage from './pages/LazyloadPage';

const wprData = sendMessage('testing', {}, 'background');
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
  const [useDataState, setDataState] = useState<Symbol>(isLoading);
  useEffect(() => {
    wprData
      .then((data) => {
        if (!data) {
          setDataState(isError);
        } else {
          setDataState(isOk);
        }
      })
      .catch(() => {
        setDataState(isError);
      });
  }, []);
  return (
    <>
      {/* Depending on the state, a different component is mounted */}
      {useDataState === isLoading && <FetchingPage />}
      {useDataState === isError && <ErrorGettingInformationPage />}
      {useDataState === isOk && (
        <Router hook={useHashLocation}>
          <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-100">
            <DevToolsMenu items={menuItems} />
            <Switch>
              <Route path="/JavaScriptPage" component={JavaScriptResourcesPage} />
              <Route path="/LazyloadPage" component={LazyloadResourcesPage} />
              <Route component={WPRDetectionsPage} />
            </Switch>
          </div>
        </Router>
      )}
    </>
  );
}
