import { motion } from 'framer-motion';

import { TooltipProvider } from '@/components/ui/tooltip';
import { DiagnoserData } from '@/content-scripts/devtoolsContentScript';
import NothingToShow from '@/components/app/devtools/NothingToShow';
import { OptimizationsInfoItem } from '../components/diagnoser/components/OptimizationInfoItem';

let runAnimations = true;
export default function DiagnoserOptimizationsInfoPage(props: { diagnoserData?: DiagnoserData }) {
  const options = props?.diagnoserData?.rocketData?.options;
  useEffect(() => {
    runAnimations = false;
  }, []);
  if (!options) {
    return (
      <NothingToShow
        title="WP Rocket seems to be inactive"
        description="Activate WP Rocket if you want to see the information about optimizations."
      />
    );
  }
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-100">
        <main className="container mx-auto px-4 py-4">
          {/* <h1 className="text-3xl font-bold mb-6 text-blue-400">WP Rocket Options</h1> */}
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: runAnimations ? 0.5 : 0 }}
          >
            {/* TODO: Fix [any, any] type when types for diagnoser data are created */}
            {Object.entries(options).map(([key, value]: [any, any], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: runAnimations ? 0.5 : 0,
                  delay: runAnimations ? index * 0.1 : 0
                }}
              >
                <OptimizationsInfoItem optimizationName={key} optimizationInfo={value} />
              </motion.div>
            ))}
          </motion.div>
        </main>
      </div>
    </TooltipProvider>
  );
}
