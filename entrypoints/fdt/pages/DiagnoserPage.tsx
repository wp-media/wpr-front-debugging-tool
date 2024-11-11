import NothingToShow from '@/components/app/devtools/NothingToShow';
import { DiagnoserData } from '@/content-scripts/devtoolsContentScript';
import DiagnoserGeneralInfoPage from './DiagnoserGeneralInfoPage';
import DiagnoserOptimizationsInfoPage from './DiagnoserOptimizationsInfoPage';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Settings, Zap } from 'lucide-react';

type DiagnoserPages = 'General' | 'Optimizations';
const generalPage: DiagnoserPages = 'General';
const optimizationsPage: DiagnoserPages = 'Optimizations';
let currentPageCache: DiagnoserPages = generalPage;
export function DiagnoserPage(props: { diagnoserData?: DiagnoserData }) {
  if (!props.diagnoserData?.noRocketData) {
    return (
      <NothingToShow
        title="WP Rocket - Support Diagnoser plugin was not detected"
        description="To use this tool, the WP Rocket - Support Diagnoser plugin must be installed and active on the site."
      />
    );
  }
  const [currentPage, setCurrentPage] = useState<DiagnoserPages>(currentPageCache);

  return (
    <>
      <div className="flex w-full mt-4 justify-center">
        <Tabs defaultValue={currentPage}>
          <TabsList className="grid w-full h-auto grid-cols-2 rounded-t-lg bg-gray-800 p-1 mb-px">
            <TabsTrigger
              value={generalPage}
              className="rounded-md py-2.5 text-sm font-medium transition-all data-[state=active]:bg-gray-700 data-[state=active]:text-white"
              onClick={() => {
                currentPageCache = generalPage;
                setCurrentPage(generalPage);
              }}
            >
              <Settings className="w-4 h-4 mr-2" />
              General Info
            </TabsTrigger>
            <TabsTrigger
              value={optimizationsPage}
              className="rounded-md py-2.5 text-sm font-medium transition-all data-[state=active]:bg-gray-700 data-[state=active]:text-white"
              onClick={() => {
                currentPageCache = optimizationsPage;
                setCurrentPage(optimizationsPage);
              }}
            >
              <Zap className="w-4 h-4 mr-2" />
              Optimizations Info
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {currentPage === generalPage ? (
        <DiagnoserGeneralInfoPage diagnoserData={props.diagnoserData!} />
      ) : (
        <DiagnoserOptimizationsInfoPage diagnoserData={props.diagnoserData} />
      )}
    </>
  );
}
