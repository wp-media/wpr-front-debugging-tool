import { Card, CardContent } from '@/components/ui/card';
import { AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Filter,
  Settings,
  XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { getRealOptionName } from '@/lib/optionNamesMap.util';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { getFilters } from '../utils';

const formatValue = (value: any, isOption: boolean) => {
  if (Array.isArray(value)) {
    return value.length > 0 ? value : 'Empty Array';
  } else if (isOption && (typeof value === 'boolean' || value === 0 || value === 1)) {
    return value === true || value === 1 ? 'Active' : 'Inactive';
  } else if (value === '' || value === null || value === undefined) {
    return 'Empty';
  } else {
    return value.toString();
  }
};

const getStatusIcon = (value: number | boolean) => {
  if (value === 1 || value === true) {
    return <CheckCircle className="h-5 w-5 text-emerald-400" />;
  } else if (value === 0 || value === false) {
    return <XCircle className="h-5 w-5 text-rose-400" />;
  } else {
    return <AlertTriangle className="h-5 w-5 text-amber-400" />;
  }
};

// TODO: Fix "any" type when types for diagnoser data are created
export function OptimizationsInfoItem(props: { optimizationInfo: any; optimizationName: string }) {
  const optimizationName: string = props.optimizationName;
  const [optimizationInfo, _] = useState({
    ...props.optimizationInfo,
    filters: getFilters(props.optimizationInfo.filters || {})
  });
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedArrays, setExpandedArrays] = useState<string[]>([]);
  const toggleArray = (key: string) => {
    setExpandedArrays((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };
  return (
    <Card className="bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
      <CardContent className="p-0">
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => setIsExpanded((s) => !s)}
        >
          <div className="flex items-center space-x-3">
            {getStatusIcon(
              optimizationInfo.get_rocket_option[optimizationName] as number | boolean
            )}
            <span className="text-lg font-medium text-gray-200">
              {getRealOptionName(optimizationName)}
            </span>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
              isExpanded ? 'transform rotate-180' : ''
            }`}
          />
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{
                height: 0,
                opacity: 0
              }}
              animate={{
                height: 'auto',
                opacity: 1
              }}
              exit={{
                height: 0,
                opacity: 0
              }}
              transition={{
                duration: 0.3
              }}
              className="border-t border-gray-700"
            >
              <div className="p-4 space-y-4">
                {Object.keys(optimizationInfo.get_rocket_option).length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Options
                    </h3>
                    <ul className="space-y-2">
                      {Object.entries(optimizationInfo.get_rocket_option).map(
                        ([optionKey, optionValue]) => (
                          <li key={optionKey} className="text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400" title={getRealOptionName(optionKey)}>
                                {optionKey === optimizationName
                                  ? 'Status'
                                  : (getRealOptionName(optionKey) as string).length > 37
                                    ? `${getRealOptionName(optionKey).slice(0, 34)}...`
                                    : getRealOptionName(optionKey)}
                              </span>
                              {Array.isArray(formatValue(optionValue, true)) ? (
                                <div
                                  className="flex items-center space-x-2 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleArray(`${optimizationName}-${optionKey}`);
                                  }}
                                >
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-500/20 text-blue-400 border-blue-500/50"
                                  >
                                    {formatValue(optionValue, true).length}
                                  </Badge>
                                  <ChevronRight
                                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                                      expandedArrays.includes(`${optimizationName}-${optionKey}`)
                                        ? 'transform rotate-90'
                                        : ''
                                    }`}
                                  />
                                </div>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className={
                                    formatValue(optionValue, true) === 'Active'
                                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                                      : formatValue(optionValue, true) === 'Inactive'
                                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                                        : 'bg-gray-700 text-gray-300'
                                  }
                                >
                                  {formatValue(optionValue, true)}
                                </Badge>
                              )}
                            </div>
                            {Array.isArray(formatValue(optionValue, true)) &&
                              expandedArrays.includes(`${optimizationName}-${optionKey}`) && (
                                <motion.div
                                  initial={{
                                    height: 0,
                                    opacity: 0
                                  }}
                                  animate={{
                                    height: 'auto',
                                    opacity: 1
                                  }}
                                  exit={{
                                    height: 0,
                                    opacity: 0
                                  }}
                                  transition={{
                                    duration: 0.2
                                  }}
                                  className="mt-2"
                                >
                                  <SyntaxHighlighter
                                    language="json"
                                    style={atomOneDark}
                                    customStyle={{
                                      background: 'transparent',
                                      padding: '0.5rem',
                                      borderRadius: '0.25rem',
                                      fontSize: '0.75rem'
                                    }}
                                  >
                                    {JSON.stringify(formatValue(optionValue, true), null, 2)}
                                  </SyntaxHighlighter>
                                </motion.div>
                              )}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
                {Object.keys(optimizationInfo.filters).length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </h3>
                    <ul className="space-y-2">
                      {Object.entries(optimizationInfo.filters).map(([filterKey, filterValue]) => (
                        <li key={filterKey} className="text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400" title={filterKey}>
                              {(filterKey as string).length > 37
                                ? `${(filterKey as string).slice(0, 34)}...`
                                : filterKey}
                            </span>
                            {Array.isArray(formatValue(filterValue, false)) ? (
                              <div
                                className="flex items-center space-x-2 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleArray(`${optimizationName}-${filterKey}`);
                                }}
                              >
                                <Badge
                                  variant="outline"
                                  className="bg-blue-500/20 text-blue-400 border-blue-500/50"
                                >
                                  {formatValue(filterValue, false).length}
                                </Badge>
                                <ChevronRight
                                  className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                                    expandedArrays.includes(`${optimizationName}-${filterKey}`)
                                      ? 'transform rotate-90'
                                      : ''
                                  }`}
                                />
                              </div>
                            ) : (
                              <Badge variant="outline" className="bg-gray-700 text-gray-300">
                                {formatValue(filterValue, false)}
                              </Badge>
                            )}
                          </div>
                          {Array.isArray(formatValue(filterValue, false)) &&
                            expandedArrays.includes(`${optimizationName}-${filterKey}`) && (
                              <motion.div
                                initial={{
                                  height: 0,
                                  opacity: 0
                                }}
                                animate={{
                                  height: 'auto',
                                  opacity: 1
                                }}
                                exit={{
                                  height: 0,
                                  opacity: 0
                                }}
                                transition={{
                                  duration: 0.2
                                }}
                                className="mt-2"
                              >
                                <SyntaxHighlighter
                                  language="json"
                                  style={atomOneDark}
                                  customStyle={{
                                    background: 'transparent',
                                    padding: '0.5rem',
                                    borderRadius: '0.25rem',
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  {JSON.stringify(formatValue(filterValue, false), null, 2)}
                                </SyntaxHighlighter>
                              </motion.div>
                            )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
