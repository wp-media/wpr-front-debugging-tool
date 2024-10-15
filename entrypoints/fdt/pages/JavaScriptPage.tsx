import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ExternalLink, Code, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import FilterButtonsBar from '@/components/app/devtools/FilterButtonsBar';
import ResourcesSummary from '@/components/app/devtools/ResourcesSummary';

interface ScriptResource {
  id: number;
  type: 'inline' | 'external';
  delayed: boolean;
  deferred: boolean;
  content: string;
}

const scriptResources: ScriptResource[] = [
  {
    id: 1,
    type: 'inline',
    delayed: true,
    deferred: false,
    content: `function greet(name) {
  console.log("Hello, " + name + "!");
}
greet("World");`
  },
  {
    id: 2,
    type: 'external',
    delayed: false,
    deferred: true,
    content: 'https://cdn.example.com/script1.js'
  },
  {
    id: 3,
    type: 'inline',
    delayed: false,
    deferred: false,
    content: "document.querySelector('button').addEventListener('click', () => alert('Clicked!'));"
  },
  {
    id: 4,
    type: 'external',
    delayed: true,
    deferred: false,
    content: 'https://api.example.com/data-loader.js'
  },
  {
    id: 5,
    type: 'inline',
    delayed: true,
    deferred: false,
    content: `const fruits = ['apple', 'banana', 'orange'];
fruits.forEach(fruit => console.log(fruit));`
  },
  {
    id: 6,
    type: 'external',
    delayed: false,
    deferred: true,
    content: 'https://analytics.example.com/tracker.js'
  },
  {
    id: 7,
    type: 'inline',
    delayed: false,
    deferred: false,
    content: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
console.log(fibonacci(10));`
  },
  {
    id: 8,
    type: 'external',
    delayed: true,
    deferred: true,
    content: 'https://cdn.example.com/framework.min.js'
  }
];

let runAnimations = true;
export default function JavaScriptResources() {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [delayJSPresent, setDelayJSPresent] = useState(true);
  const [scriptResourcesState, setscriptResourcesState] = useState(scriptResources);

  const toggleExpand = (id: number) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const delayedCount = scriptResources.filter((r) => r.delayed).length;
  const deferredCount = scriptResources.filter((r) => r.deferred).length;
  const inlineCount = scriptResources.filter((r) => r.type === 'inline').length;
  const externalCount = scriptResources.filter((r) => r.type === 'external').length;
  const summaryData = [
    { name: 'Delayed', count: delayedCount },
    { name: 'Non-delayed', count: scriptResources.length - delayedCount },
    { name: 'Deferred', count: deferredCount },
    { name: 'Non-deferred', count: scriptResources.length - deferredCount },
    { name: 'Inline', count: inlineCount },
    { name: 'External', count: externalCount }
  ];
  const filterButtons = [
    {
      text: 'Show All',
      action: () => {
        setscriptResourcesState(scriptResources);
      }
    },
    {
      text: 'Delayed',
      action: () => {
        setscriptResourcesState(scriptResources.filter((r) => r.delayed));
      }
    },
    {
      text: 'Non-delayed',
      action: () => {
        setscriptResourcesState(scriptResources.filter((r) => !r.delayed));
      }
    },
    {
      text: 'Deferred',
      action: () => {
        setscriptResourcesState(scriptResources.filter((r) => !!r.deferred));
      }
    },
    {
      text: 'Non-Deferred',
      action: () => {
        setscriptResourcesState(scriptResources.filter((r) => !r.deferred));
      }
    },
    {
      text: 'Inline',
      action: () => {
        setscriptResourcesState(scriptResources.filter((r) => r.type === 'inline'));
      }
    },
    {
      text: 'External',
      action: () => {
        setscriptResourcesState(scriptResources.filter((r) => r.type === 'external'));
      }
    }
  ];
  useEffect(() => {
    runAnimations = false;
  });
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-100">
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <FilterButtonsBar buttons={filterButtons} runAnimations={runAnimations} />
            <ResourcesSummary
              runAnimations={runAnimations}
              feature={{ name: 'Delay JS', present: delayJSPresent }}
              summaryData={summaryData}
              total={scriptResources.length}
            />
          </div>
          <motion.ul
            className="mx-auto grid gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: runAnimations ? 0.5 : 0 }}
          >
            {scriptResourcesState.map((resource, index) => (
              <motion.li
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: runAnimations ? 0.5 : 0,
                  delay: runAnimations ? index * 0.1 : 0
                }}
                className="max-w-3xl mx-auto w-full"
              >
                <Card className="bg-gray-800 transition-all duration-300 hover:bg-gray-750 hover:shadow-lg hover:shadow-blue-500/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-sm font-medium ${
                            resource.type === 'inline' ? 'text-yellow-400' : 'text-green-400'
                          }`}
                        >
                          {resource.type === 'inline' ? 'Inline' : 'External'}
                        </span>
                        <div className="flex items-center space-x-1">
                          {resource.delayed ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-rose-400" />
                          )}
                          <span className="text-xs text-gray-400">Delayed</span>
                        </div>
                        {resource.type === 'external' && (
                          <div className="flex items-center space-x-1">
                            {resource.deferred ? (
                              <CheckCircle className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-rose-400" />
                            )}
                            <span className="text-xs text-gray-400">Deferred</span>
                          </div>
                        )}
                      </div>
                      {resource.type === 'inline' &&
                        resource.content.split(/\r\n|\r|\n/).length > 3 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => toggleExpand(resource.id)}
                                className="text-gray-400 hover:text-gray-100"
                              >
                                {expandedItems.includes(resource.id) ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="bg-gray-700 text-gray-100">
                              <p>{expandedItems.includes(resource.id) ? 'Contract' : 'Expand'}</p>
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
                            height:
                              expandedItems.includes(resource.id) ||
                              resource.content.split(/\r\n|\r|\n/).length <= 3
                                ? 'auto'
                                : 65
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
              </motion.li>
            ))}
          </motion.ul>
        </main>
      </div>
    </TooltipProvider>
  );
}
