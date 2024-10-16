import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export default function ResourcesSummary(props: {
  runAnimations?: boolean;
  feature?: {
    name: string;
    present: boolean;
  };
  total?: number;
  summaryData: {
    name: string;
    count: number;
  }[];
}) {
  const runAnimations = typeof props?.runAnimations === 'undefined' ? true : props.runAnimations;
  const featureActive = props.feature?.present;
  return (
    <motion.div
      className="mb-4 flex flex-wrap items-center justify-between gap-2 bg-gray-800 p-3 rounded-lg shadow-md text-xs"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: runAnimations ? 0.5 : 0 }}
    >
      <div className="flex flex-wrap items-center gap-2">
        {typeof featureActive !== 'undefined' && (
          <div className="flex items-center gap-1">
            <span className="font-medium text-blue-400">{props?.feature?.name}</span>
            <Badge
              variant="outline"
              className={`transition-colors duration-300 text-xs px-1 py-0 ${
                featureActive
                  ? 'bg-green-500/20 text-green-400 border-green-500/50'
                  : 'bg-red-500/20 text-red-400 border-red-500/50'
              }`}
            >
              {featureActive ? 'Detected' : 'Not detected'}
            </Badge>
          </div>
        )}
        <div className="w-px h-4 bg-gray-700"></div>
        <div className="flex flex-wrap gap-2 text-xs">
          {props.summaryData.map((data, index) => {
            return (
              <div key={index} className="flex items-center gap-1">
                <span className="text-gray-400">{data.name}:</span>
                <span className="font-bold text-blue-400">{data.count}</span>
              </div>
            );
          })}
        </div>
      </div>
      {typeof props.total !== 'undefined' && (
        <div className="flex items-center gap-1">
          <span className="text-gray-400">Total:</span>
          <span className="font-bold text-blue-400">{props.total}</span>
        </div>
      )}
    </motion.div>
  );
}
