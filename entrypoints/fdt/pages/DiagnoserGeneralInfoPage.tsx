import { DiagnoserData } from '@/content-scripts/devtoolsContentScript';

import { motion } from 'framer-motion';
import { DisabledOptionsSpecificPageCard } from '../components/diagnoser/components/DisabledOptionsSpecificPageCard';
import { getGeneralInfo } from '../components/diagnoser/utils';
import { PluginInfoCard } from '../components/diagnoser/components/PluginInfoCard';
import { ServerInfoCard } from '../components/diagnoser/components/ServerInfoCard';
import { ConstantCard } from '../components/diagnoser/components/ConstantsCard';
import { PreloadRUCSSTasksStatusCard } from '../components/diagnoser/components/PreloadRUCSSTasksStatusCard';
import { PreloadRUCSSParameters } from '../components/diagnoser/components/PreloadRUCSSParametersCard';
import { SomeFiltersAndOptionsCard } from '../components/diagnoser/components/SomeFiltersAndOptionsCard';

let runAnimations = true;
export default function DiagnoserGeneralInfoPage(props: { diagnoserData: DiagnoserData }) {
  const generalDiagnoserInfo = getGeneralInfo(props.diagnoserData);
  useEffect(() => {
    runAnimations = false;
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: runAnimations ? 0.5 : 0 }}
      className="min-h-screen text-gray-100 px-8 py-4"
    >
      {/* <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">WP Rocket Diagnostics</h1> */}

      {generalDiagnoserInfo.postMetaDisabledOptions.length > 0 && (
        <DisabledOptionsSpecificPageCard
          disabledOptions={generalDiagnoserInfo.postMetaDisabledOptions}
        />
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <PluginInfoCard pluginInfo={generalDiagnoserInfo.pluginInfo} />

        <ServerInfoCard serverInfo={generalDiagnoserInfo.serverInfo} />
        <ConstantCard constants={generalDiagnoserInfo.constants} />
        <PreloadRUCSSTasksStatusCard tasksStatus={generalDiagnoserInfo.preloadRUCSSTaskStatus} />
        <PreloadRUCSSParameters parameters={generalDiagnoserInfo.preloadRUCSSParameters} />
        {/* <SomeOptionsCard someOptions={generalDiagnoserInfo.someOptions}/> */}
        {generalDiagnoserInfo.someOptions && (
          <SomeFiltersAndOptionsCard someData={generalDiagnoserInfo.someOptions} type="options" />
        )}

        {generalDiagnoserInfo.someFilters && (
          <SomeFiltersAndOptionsCard someData={generalDiagnoserInfo.someFilters} type="filters" />
        )}
      </div>
    </motion.div>
  );
}
