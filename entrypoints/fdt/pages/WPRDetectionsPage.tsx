import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type StatusType = 'active' | 'not-active' | 'undefined';

interface StatusItem {
  name: string;
  status: StatusType;
}

const statusItems: StatusItem[] = [
  { name: 'WP Rocket', status: 'active' },
  { name: 'Cached', status: 'not-active' },
  { name: 'Server', status: 'active' },
  { name: 'Optimize CSS delivery', status: 'not-active' },
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

const getStatusIcon = (status: StatusType) => {
  switch (status) {
    case 'active':
      return <CheckCircle className="h-5 w-5 text-emerald-400" />;
    case 'not-active':
      return <XCircle className="h-5 w-5 text-rose-400" />;
    case 'undefined':
      return <HelpCircle className="h-5 w-5 text-amber-400" />;
  }
};

let runAnimations = true;
export default function WPRDetectionsPage() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  useEffect(() => {
    runAnimations = false;
  });
  return (
    <TooltipProvider>
      <main className="container mx-auto px-4 py-8">
        <motion.ul
          className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2"
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
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card
                    className="bg-gray-800 transition-all duration-300 hover:bg-gray-750 hover:shadow-lg hover:shadow-blue-500/10"
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <span className="text-sm font-medium text-gray-100">{item.name}</span>
                      <motion.div
                        animate={{
                          scale: hoveredItem === item.name ? 1.2 : 1
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 10
                        }}
                      >
                        {getStatusIcon(item.status)}
                      </motion.div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-700 text-gray-100">
                  <p>{`Status: ${item.status}`}</p>
                </TooltipContent>
              </Tooltip>
            </motion.li>
          ))}
        </motion.ul>
      </main>
    </TooltipProvider>
  );
}
