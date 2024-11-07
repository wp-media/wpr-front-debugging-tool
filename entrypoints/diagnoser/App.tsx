import { Route, Router, Switch } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import DevToolsMenu from '@/components/app/devtools/menu';
import { sendMessage } from 'webext-bridge/devtools';
import { Channels, ChannelTargets } from '@/Globals';
import type { DiagnoserData } from '../../content-scripts/devtoolsContentScript';
import FetchingPage from '../fdt/pages/Fetching';
import ErrorGettingInformationPage from '../fdt/pages/Error';
import GeneralInfoPage from './pages/General';
import NothingToShow from '@/components/app/devtools/NothingToShow';
import OptimizationsInfoPage from './pages/OptimizationsInfo';

const wprData = sendMessage(Channels.getDiagnoserData, {}, ChannelTargets.contentScript);
const menuItems = [
  { name: 'General Info', path: '/' },
  { name: 'Optimizations Info', path: '/OptimizationsInfoPage' }
];
const isLoading = Symbol('isLoading');
const isError = Symbol('isError');
const isDiagnoserInactive = Symbol('isDiagnoserActive');
const isOk = Symbol('isOk');

export default function App() {
  const [fetchState, setFetchState] = useState<Symbol>(isLoading);
  const [diagnoserData, setDiagnoserData] = useState<DiagnoserData | undefined>(undefined);
  useEffect(() => {
    (wprData as unknown as Promise<DiagnoserData>)
      .then((data) => {
        if (!data) {
          setFetchState(isError);
        } else if (!data?.diagnoser?.noRocketData) {
          setFetchState(isDiagnoserInactive);
        } else {
          console.log(data);
          const diagnoserData = data as unknown as DiagnoserData;
          setDiagnoserData(diagnoserData);
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
      {(fetchState === isError ||
        (fetchState !== isLoading && fetchState !== isDiagnoserInactive && !diagnoserData)) && (
        <ErrorGettingInformationPage />
      )}
      {fetchState === isDiagnoserInactive && (
        <NothingToShow
          title="WP Rocket - Support Diagnoser plugin was not detected"
          description="To use this tool, the WP Rocket - Support Diagnoser plugin must be installed and active on the site."
        />
      )}
      {fetchState === isOk && diagnoserData && (
        <Router hook={useHashLocation}>
          <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-100">
            <DevToolsMenu items={menuItems} />
            <Switch>
              <Route
                path="/OptimizationsInfoPage"
                children={<OptimizationsInfoPage diagnoser={diagnoserData.diagnoser} />}
              />
              <Route children={<GeneralInfoPage diagnoser={diagnoserData.diagnoser} />} />
            </Switch>
          </div>
        </Router>
      )}
    </>
  );
}
