import { useState } from 'react';
import { motion } from 'framer-motion';
import { TooltipProvider } from '@/components/ui/tooltip';
import FilterButtonsBar from '@/entrypoints/fdt/components/FilterButtonsBar';
import ResourcesSummary from '@/entrypoints/fdt/components/ResourcesSummary';
import ResourceItem from '@/entrypoints/fdt/components/ResourceItem';
import NothingToShow from '@/components/app/devtools/NothingToShow';
import { FDTData } from '@/content-scripts/devtoolsContentScript';
import { capitalizeString } from '@/lib/utils';
import type { DevToolsSearch } from '@/Types';

interface PreloadedResource {
  id: number;
  type: string;
  href: string;
}

let runAnimations = true;
export default function PreloadedResourcesPage(props: {
  fdtData: FDTData;
  devtoolsSearch: DevToolsSearch;
}) {
  const { present, resources = [] } = props.fdtData.preloadedResources;
  const { devtoolsSearch } = props;

  const preloadedResources: PreloadedResource[] = useMemo(() => {
    return resources.map((resource, index) => {
      return {
        id: index,
        type: resource.type,
        href: resource.href
      };
    });
  }, [resources]);
  const [preloadedResourcesState, setPreloadedResourcesState] = useState(preloadedResources);
  const [searchState, setSearchState] = useState<null | PreloadedResource[]>(null);

  const preloadedImages = useMemo(
    () => preloadedResources.filter((r) => r.type === 'image'),
    [preloadedResources]
  );
  const preloadedFonts = useMemo(
    () => preloadedResources.filter((r) => r.type === 'font'),
    [preloadedResources]
  );

  // const othersCount = useMemo(
  //   () => resources?.filter((r) => r.type !== 'image' && r.type !== 'font'),
  //   [resources]
  // );
  const summaryData = [
    { name: 'Images', count: preloadedImages.length },
    { name: 'Fonts', count: preloadedFonts.length }
  ];
  const filterButtons = [
    {
      text: 'Show All',
      action: () => {
        setSearchState(null);
        setPreloadedResourcesState(preloadedResources);
      }
    },
    {
      text: 'Images',
      action: () => {
        setSearchState(null);
        setPreloadedResourcesState(preloadedImages);
      }
    },
    {
      text: 'Fonts',
      action: () => {
        setSearchState(null);
        setPreloadedResourcesState(preloadedFonts);
      }
    }
  ];
  useEffect(() => {
    runAnimations = false;
  }, []);
  // Perform the search when user types in the search box (Ctrl + F)
  useEffect(() => {
    if (preloadedResources.length === 0) return;
    if (devtoolsSearch?.action === 'performSearch' && devtoolsSearch?.queryString) {
      const query = devtoolsSearch.queryString.toLowerCase();
      const filtered = preloadedResources.filter((r) => r.href.toLowerCase().includes(query));
      setSearchState(filtered);
      return;
    }
    setSearchState(null);
  }, [devtoolsSearch]);
  return resources.length === 0 ? (
    <NothingToShow
      title="No Preloaded Resources to show here"
      description="The extension couldn't find any Preloaded Resource by WP Rocket in the page.."
    />
  ) : (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-100">
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <FilterButtonsBar buttons={filterButtons} runAnimations={runAnimations} />
            <ResourcesSummary
              runAnimations={runAnimations}
              feature={{ name: 'Lazyload', present: present }}
              summaryData={summaryData}
              total={preloadedResources.length}
            />
          </div>
          <motion.ul
            className="mx-auto grid gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: runAnimations ? 0.5 : 0 }}
          >
            {searchState?.length === 0 || preloadedResourcesState.length === 0 ? (
              <NothingToShow
                title="No Preloaded Resources to show here"
                description="No Preloaded Resouces. Try using a different filter button or searching something different.."
              />
            ) : (
              (searchState || preloadedResourcesState).map((resource, index) => (
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
                      type: capitalizeString(resource.type),
                      content: resource.href
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
