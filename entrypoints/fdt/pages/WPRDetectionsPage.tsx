import { frameData, motion } from 'framer-motion';
import { WPRDectectionItem } from '@/entrypoints/fdt/components/WPRDetectionItem';
import { FDTData } from '@/content-scripts/devtoolsContentScript';
import { WPRDetections } from '@/Types';
import { getRealOptionName } from '@/lib/optionNamesMap.util';
import { KnownPlatforms } from '@/Globals';
import { WebRequest } from 'wxt/browser';

export type StatusType = 'active' | 'not-active' | 'undefined';

export interface StatusItem {
  id: number;
  name: string;
  status: StatusType;
  subtitle?: string;
}

let runAnimations = true;
export default function WPRDetectionsPage(props: { fdtData: FDTData }) {
  const { fdtData } = props;
  const statusItems = useMemo(() => {
    return getStatusItems(fdtData);
  }, [fdtData]);
  useEffect(() => {
    runAnimations = false;
  }, []);
  return (
    <main className="container mx-auto px-4 py-6">
      <motion.ul
        className="mx-auto grid gap-x-3 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min-[320px]:max-w-[320px] sm:max-w-[640px] md:max-w-3xl lg:max-w-5xl xl:max-w-7xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: runAnimations ? 0.5 : 0 }}
      >
        {statusItems.map((item, index) => (
          <motion.li
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: runAnimations ? 0.3 : 0,
              delay: runAnimations ? index * 0.05 : 0
            }}
            className="w-full mx-auto"
          >
            <WPRDectectionItem item={item} />
          </motion.li>
        ))}
      </motion.ul>
    </main>
  );
}
function getStatusItems(fdtData: FDTData) {
  const entries = Object.entries(fdtData.wprDetections);
  const items: StatusItem[] = [];
  if (fdtData.pageHeaders) {
    const { server, knownPlatform } = getNeededHeaders(fdtData.pageHeaders);
    items.push({
      id: 1000,
      name: 'Server',
      status: server ? 'active' : 'not-active',
      subtitle: server
    });
    knownPlatform &&
      items.push({
        id: 1001,
        name: 'Known Platform',
        status: 'active',
        subtitle: knownPlatform
      });
  }
  for (const [index, [name, value]] of entries.entries()) {
    if (name === 'async_css') continue;
    const item: StatusItem = {
      id: index,
      name: getRealOptionName(name),
      status: value.present ? 'active' : 'not-active'
    };
    if (name === 'remove_unused_css') {
      item.subtitle = 'Optimize CSS Delivery';
      if (
        !fdtData.wprDetections.remove_unused_css.present &&
        fdtData.wprDetections.async_css.present
      ) {
        item.status = 'active';
        item.name = getRealOptionName('async_css');
      } else if (
        !fdtData.wprDetections.async_css.present &&
        !fdtData.wprDetections.remove_unused_css.present
      ) {
        item.subtitle = undefined;
        item.name = 'Optimize CSS Delivery';
      }
    } else if (name === 'wpr') {
      const casted = value as WPRDetections['wpr'];
      if (casted.cached) {
        items.push(item);
        items.push({
          id: 1002,
          name: 'Cached',
          status: casted.cached ? 'active' : 'not-active',
          subtitle: casted.timeStamp ? `Timestamp: ${casted.timeStamp}` : undefined
        });
        continue;
      }
    } else if (name === 'rocket_above_the_fold_optimization') {
      const casted = value as WPRDetections['rocket_above_the_fold_optimization'];
      if (casted.present) {
        item.subtitle = 'Beacon detected';
      } else if (casted.preloadedImages && casted.preloadedImages?.length !== 0) {
        item.subtitle = `Preloaded images detected: ${casted.preloadedImages.length <= 9 ? casted.preloadedImages.length : '9+'}`;
      }
    } else if (name === 'defer_all_js') {
      const casted = value as WPRDetections['defer_all_js'];
      item.name = 'Scripts deferred';
      item.status = casted.present ? 'undefined' : 'not-active';
      item.name += `: ${casted.scripts.length}`;
    } else if (name === 'lazyload_iframes') {
      const casted = value as WPRDetections['lazyload_iframes'];
      item.subtitle = casted.replaceImage ? 'Replace iframe with preview image' : undefined;
    }
    items.push(item);
  }
  return items;
}
/**
 * Extracts some headers to try to identify the server and the known platform
 */
function getNeededHeaders(headers: WebRequest.HttpHeaders) {
  let server: string | undefined = undefined;
  let knownPlatform: string | undefined = undefined;
  const importantHeaders = [
    'server',
    ...Array.from(KnownPlatforms.entries()).flatMap(([_, platform]) => {
      return platform.map((value) => {
        if (typeof value === 'string') {
          return value.trim().toLowerCase();
        }
        return value.headerName.trim().toLowerCase();
      });
    })
  ];
  const extractedHeaders = headers.reduce((acc, header): Map<string, string> => {
    if (importantHeaders.includes(header.name.trim().toLowerCase())) {
      acc.set(header.name.trim().toLowerCase(), header.value ?? '');
    }
    return acc;
  }, new Map<string, string>());
  server = extractedHeaders.get('server');
  loop1: for (const [name, platform] of KnownPlatforms) {
    for (const header of platform) {
      if (typeof header === 'string') {
        if (extractedHeaders.has(header.trim().toLowerCase())) {
          knownPlatform = name;
          break loop1;
        }
      } else {
        if (extractedHeaders.has(header.headerName.trim().toLowerCase())) {
          const value = extractedHeaders.get(header.headerName.trim().toLowerCase());
          if (!value) break loop1;
          if (value.trim().toLowerCase().includes(header.value.trim().toLowerCase())) {
            knownPlatform = name;
            break loop1;
          }
        }
      }
    }
  }
  return { server, knownPlatform };
}
