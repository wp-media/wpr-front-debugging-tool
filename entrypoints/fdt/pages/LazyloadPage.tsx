import { useState } from 'react';
import { motion } from 'framer-motion';
import { TooltipProvider } from '@/components/ui/tooltip';
import FilterButtonsBar from '@/components/app/devtools/FilterButtonsBar';
import ResourcesSummary from '@/components/app/devtools/ResourcesSummary';
import ResourceItem from '@/components/app/devtools/ResourceItem';
import NothingToShow from '@/components/app/devtools/NothingToShow';

interface LazyloadResource {
  id: number;
  lazyloaded: boolean;
  content: string;
  excludedReasons: string[];
}

const lazyloadResources: LazyloadResource[] = [
  {
    id: 2,
    lazyloaded: true,
    content: 'https://cdn.example.com/cat.webp',
    excludedReasons: []
  },
  {
    id: 3,
    lazyloaded: false,
    content: 'https://cdn.example.com/dog.jpg',
    excludedReasons: ['skip-lazy']
  },
  {
    id: 4,
    lazyloaded: true,
    content: 'https://api.example.com/mouse.png',
    excludedReasons: []
  },
  {
    id: 5,
    lazyloaded: true,
    content: `https://api.example.com/ant.webp`,
    excludedReasons: []
  },
  {
    id: 6,
    lazyloaded: false,
    content: 'https://analytics.example.com/wolf.png',
    excludedReasons: ['data-src', 'lazyload']
  },
  {
    id: 7,
    lazyloaded: true,
    content: 'ttttps://api.example.com/bat.png',
    excludedReasons: []
  },
  {
    id: 8,
    lazyloaded: true,
    content: 'https://cdn.example.com/framework-art.webp',
    excludedReasons: []
  }
];

let runAnimations = true;
export default function LazyloadResourcesPage() {
  const [lazyloadPresent, setLazyloadPresent] = useState(true);
  const [lazyloadResourcesState, setLazyloadResourcesState] = useState(lazyloadResources);
  const filtered = useRef<Map<string, LazyloadResource[]>>(new Map());
  const lazyloadedCount = lazyloadResources.filter((r) => r.lazyloaded).length;

  const summaryData = [
    { name: 'Lazyloaded', count: lazyloadedCount },
    { name: 'Non-lazyloaded', count: lazyloadResources.length - lazyloadedCount }
  ];
  const filteredCache = (key: string, compute: () => LazyloadResource[]) => {
    if (filtered.current.has(key)) return filtered.current.get(key)!;
    const computed = compute();
    filtered.current.set(key, computed);
    return computed;
  };
  const filterButtons = [
    {
      text: 'Show All',
      action: () => {
        setLazyloadResourcesState(lazyloadResources);
      }
    },
    {
      text: 'Lazyloaded',
      action: () => {
        setLazyloadResourcesState(
          filteredCache('Lazyloaded', () => lazyloadResources.filter((r) => r.lazyloaded))
        );
      }
    },
    {
      text: 'Non-lazyloaded',
      action: () => {
        setLazyloadResourcesState(
          filteredCache('Non-lazyloaded', () => lazyloadResources.filter((r) => !r.lazyloaded))
        );
      }
    }
  ];
  useEffect(() => {
    runAnimations = false;
  }, []);
  return ResourceItem.length === 0 ? (
    <NothingToShow
      title="No images to show here"
      description="The extension couldn't find any image in the page.."
    />
  ) : (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-100">
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <FilterButtonsBar buttons={filterButtons} runAnimations={runAnimations} />
            <ResourcesSummary
              runAnimations={runAnimations}
              feature={{ name: 'Lazyload', present: lazyloadPresent }}
              summaryData={summaryData}
              total={lazyloadResources.length}
            />
          </div>
          <motion.ul
            className="mx-auto grid gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: runAnimations ? 0.5 : 0 }}
          >
            {lazyloadResourcesState.length === 0 ? (
              <NothingToShow
                title="No images to show here"
                description="No images. Try using a different filter button.."
              />
            ) : (
              lazyloadResourcesState.map((resource, index) => (
                <motion.li
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: runAnimations ? 0.5 : 0,
                    delay: runAnimations ? index * 0.02 : 0
                  }}
                  className="max-w-3xl mx-auto w-full"
                >
                  <ResourceItem
                    resource={{
                      type: ['Image', resource.lazyloaded ? 'green' : 'red'],
                      content: resource.content,
                      labels: resource.lazyloaded
                        ? new Map([['Lazyloaded', resource.lazyloaded]])
                        : new Map([
                            ['Lazyloaded', resource.lazyloaded],
                            [
                              resource.excludedReasons.length === 0
                                ? `No reasons found`
                                : `Excluded reasons found: "${resource.excludedReasons!.join('", "')}"`,
                              false
                            ]
                          ])
                    }}
                  />
                </motion.li>
              ))
            )}
          </motion.ul>
        </main>
      </div>
    </TooltipProvider>
  );
}
