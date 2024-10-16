import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ExternalLink, Code, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

type Color = 'green' | 'red' | 'yellow';
const ColorSet = {
  green: 'text-green-400',
  yellow: 'text-yellow-400',
  red: 'text-rose-400'
} as const;

export default function ResourceItem(props: {
  /**
   * The resource which info should be printed in the component
   */
  resource: {
    type: string | [string, Color];
    labels: Map<string, boolean>;
    content: string;
  };
  /**
   * Whether the component should be expanded or not as the initial state. `false` by default (Code must have more than 3 lines to be expandable)
   */
  expanded?: boolean;

  // runAnimations: boolean;
}) {
  const [expanded, useExpanded] = useState(!!props.expanded);
  const { resource } = props;
  const labels = Array.from(resource.labels.entries());
  const toggleExpand = () => {
    useExpanded((s) => !s);
  };
  // const runAnimations = typeof props?.runAnimations === 'undefined' ? true : props.runAnimations;
  return (
    <Card className="bg-gray-800 transition-all duration-300 hover:bg-gray-750 hover:shadow-lg hover:shadow-blue-500/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className={`text-sm font-medium ${
                Array.isArray(resource.type) ? ColorSet[resource.type[1]] : 'text-green-400'
              }`}
            >
              {Array.isArray(resource.type) ? resource.type[0] : resource.type}
            </span>
            {labels.map(([name, value]) => {
              return (
                <div className="flex items-center space-x-1">
                  {value ? (
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-400" />
                  )}
                  <span className="text-xs text-gray-400">{name}</span>
                </div>
              );
            })}
          </div>
          {toggleExpand &&
            resource.type === 'inline' &&
            resource.content.split(/\r\n|\r|\n/).length > 3 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => toggleExpand()}
                    className="text-gray-400 hover:text-gray-100"
                  >
                    {expanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-gray-700 text-gray-100">
                  <p>{expanded ? 'Contract' : 'Expand'}</p>
                </TooltipContent>
              </Tooltip>
            )}
        </div>
        <AnimatePresence>
          {resource.type === 'external' ? (
            <p className="mt-2 text-sm text-blue-400 break-all">
              <a
                href={resource.content}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                {resource.content}
              </a>
            </p>
          ) : (
            <motion.div
              initial={{
                height: resource.content.split(/\r\n|\r|\n/).length > 3 ? 65 : 'auto'
              }}
              animate={{
                height: expanded || resource.content.split(/\r\n|\r|\n/).length <= 3 ? 'auto' : 65
              }}
              exit={{
                height: 0,
                opacity: 0
              }}
              transition={{
                duration: 0.3
              }}
              className="mt-2 overflow-hidden"
            >
              <SyntaxHighlighter
                language="javascript"
                style={atomDark}
                customStyle={{
                  margin: 0,
                  padding: '0.5rem',
                  borderRadius: '0.25rem'
                }}
                wrapLines={true}
                wrapLongLines={true}
              >
                {resource.content}
              </SyntaxHighlighter>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
