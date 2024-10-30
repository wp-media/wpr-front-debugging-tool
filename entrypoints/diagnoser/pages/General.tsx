import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  Server,
  Activity,
  Clock,
  Code,
  Filter,
  Zap
} from 'lucide-react';
import { DiagnoserData, FDTData } from '@/entrypoints/devtoolsContentScript.content';

import type { GeneralInfo } from '../types';
import { DisabledOptionsSpecificPageCard } from '../components/DisabledOptionsSpecificPageCard';
import { getGeneralInfo } from '../utils';
import { PluginInfoCard } from '../components/PluginInfoCard';
import { ServerInfoCard } from '../components/ServerInfoCard';
import { ConstantCard } from '../components/ConstantsCard';
import { PreloadRUCSSTasksStatusCard } from '../components/PreloadRUCSSTasksStatusCard';
import { PreloadRUCSSParameters } from '../components/PreloadRUCSSParametersCard';
import { SomeFiltersAndOptionsCard } from '../components/SomeFiltersAndOptionsCard';

export default function GeneralInfoPage(props: { diagnoser: DiagnoserData['diagnoser'] }) {
  const generalDiagnoserInfo = getGeneralInfo(props.diagnoser);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-8">
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
    </div>
  );
}
