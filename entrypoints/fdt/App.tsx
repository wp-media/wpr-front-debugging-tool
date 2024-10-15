import { Link, Route, Router, Switch } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import WPRDetectionsPage from './pages/WPRDetectionsPage';
import DevToolsMenu from '@/components/app/devtools/menu';
import JavaScriptResourcesPage from './pages/JavaScriptPage';
import { sendMessage } from 'webext-bridge/devtools';
import ErrorGettingInformationPage from './pages/Error';
import FetchingPage from './pages/Fetching';

const wprData = sendMessage('testing', {}, 'background');
const menuItems = [
  { name: 'WPR Detections', path: '/' },
  { name: 'JavaScript', path: '/JavaScriptPage' },
  { name: 'Lazyload', path: '/LazyLoadPage' },
  { name: 'Preloaded Resources', path: '/PreloadedResourcesPage' },
  { name: 'Undefined Reference Finder', path: '/UndefinedReferenceFinderPage' }
];
export default function App() {
  // States are 0 = Fetching data, 1 = Error, 2 = Ok
  const [useDataState, setDataState] = useState(0);
  useEffect(() => {
    wprData
      .then((data) => {
        setDataState(2);
      })
      .catch(() => {
        setDataState(1);
      });
  });
  return (
    <>
      {/* Depending on the state, a different component is mounted */}
      {useDataState === 0 && <FetchingPage />}
      {useDataState === 1 && <ErrorGettingInformationPage />}
      {useDataState === 2 && (
        <Router hook={useHashLocation}>
          <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-100">
            <DevToolsMenu items={menuItems} />
            <Switch>
              <Route path="/JavaScriptPage" component={JavaScriptResourcesPage} />
              <Route component={WPRDetectionsPage} />
            </Switch>
          </div>
        </Router>
      )}
    </>
  );
}
