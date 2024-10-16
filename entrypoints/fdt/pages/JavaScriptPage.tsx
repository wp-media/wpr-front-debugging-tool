import { useState } from 'react';
import { motion } from 'framer-motion';
import { TooltipProvider } from '@/components/ui/tooltip';
import FilterButtonsBar from '@/components/app/devtools/FilterButtonsBar';
import ResourcesSummary from '@/components/app/devtools/ResourcesSummary';
import ResourceItem from '@/components/app/devtools/ResourceItem';
import { capitalizeString } from '@/lib/utils';

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
export default function JavaScriptResourcesPage() {
  const [delayJSPresent, setDelayJSPresent] = useState(true);
  const [scriptResourcesState, setscriptResourcesState] = useState(scriptResources);
  const filtered = useRef<Map<string, ScriptResource[]>>(new Map());
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
  const filteredCache = (key: string, compute: () => ScriptResource[]) => {
    if (filtered.current.has(key)) return filtered.current.get(key)!;
    const computed = compute();
    filtered.current.set(key, computed);
    return computed;
  };
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
        setscriptResourcesState(
          filteredCache('Delayed', () => scriptResources.filter((r) => r.delayed))
        );
      }
    },
    {
      text: 'Non-delayed',
      action: () => {
        setscriptResourcesState(
          filteredCache('Non-delated', () => scriptResources.filter((r) => !r.delayed))
        );
      }
    },
    {
      text: 'Deferred',
      action: () => {
        setscriptResourcesState(
          filteredCache('Deferred', () => scriptResources.filter((r) => !!r.deferred))
        );
      }
    },
    {
      text: 'Non-Deferred',
      action: () => {
        setscriptResourcesState(
          filteredCache('Non-Deferred', () => scriptResources.filter((r) => !r.deferred))
        );
      }
    },
    {
      text: 'Inline',
      action: () => {
        setscriptResourcesState(
          filteredCache('Inline', () => scriptResources.filter((r) => r.type === 'inline'))
        );
      }
    },
    {
      text: 'External',
      action: () => {
        setscriptResourcesState(
          filteredCache('External', () => scriptResources.filter((r) => r.type === 'external'))
        );
      }
    }
  ];
  useEffect(() => {
    runAnimations = false;
  }, []);
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
                <ResourceItem
                  resource={{
                    type: [
                      capitalizeString(resource.type),
                      resource.type === 'external' ? 'green' : 'yellow'
                    ],
                    content: resource.content,
                    labels:
                      resource.type === 'external'
                        ? new Map([
                            ['Delayed', resource.delayed],
                            ['Deferred', resource.deferred]
                          ])
                        : new Map([['Delayed', resource.delayed]])
                  }}
                />
              </motion.li>
            ))}
          </motion.ul>
        </main>
      </div>
    </TooltipProvider>
  );
}
