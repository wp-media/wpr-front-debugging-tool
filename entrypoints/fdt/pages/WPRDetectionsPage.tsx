import { motion } from 'framer-motion';
import { WPRDectectionItem } from '@/components/app/devtools/WPRDetectionItem';

export type StatusType = 'active' | 'not-active' | 'undefined';

export interface StatusItem {
  name: string;
  status: StatusType;
  subtitle?: string;
}

const statusItems: StatusItem[] = [
  { name: 'WP Rocket', status: 'active' },
  { name: 'Cached', subtitle: 'Timestamp: 1729152366', status: 'not-active' },
  { name: 'LiteSpeed', subtitle: 'Server', status: 'active' },
  {
    name: 'Remove Unused CSS',
    subtitle: 'Optimize CSS Delivery',
    status: 'not-active'
  },
  { name: 'Optimize Critical Images', status: 'active' },
  { name: 'Delay JavaScript Execution', status: 'not-active' },
  { name: 'Scripts Deferred: 15', status: 'undefined' },
  { name: 'Lazyload (Images)', status: 'active' },
  { name: 'Lazyload for iframes', status: 'not-active' },
  { name: 'Lazyload for CSS BG Images', status: 'active' },
  { name: 'Minify CSS files', status: 'not-active' },
  { name: 'Minify JavaScript files', status: 'active' },
  { name: 'Preload Links', status: 'not-active' },
  { name: 'RocketCDN', status: 'active' }
];

let runAnimations = true;
export default function WPRDetectionsPage() {
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
              duration: runAnimations ? 0.5 : 0,
              delay: runAnimations ? index * 0.1 : 0
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
