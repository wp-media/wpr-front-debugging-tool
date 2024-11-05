import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import type { StatusItem, StatusType } from '@/entrypoints/fdt/pages/WPRDetectionsPage';

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

const getStatusColor = (status: StatusType) => {
  switch (status) {
    case 'active':
      return 'bg-emerald-400/10 border-emerald-400/20';
    case 'not-active':
      return 'bg-rose-400/10 border-rose-400/20';
    case 'undefined':
      return 'bg-amber-400/10 border-amber-400/20';
  }
};

export function WPRDectectionItem(props: { item: StatusItem }) {
  const [hovered, setHovered] = useState(false);
  const { item } = props;

  return (
    <Card
      className={`bg-gray-800 border transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 ${getStatusColor(
        item.status
      )}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardContent className="flex items-center justify-between p-4 h-full">
        <div className="flex flex-col justify-center min-h-[2.25rem]">
          <span className="text-sm font-semibold text-gray-100">{item.name}</span>
          {item.subtitle && <span className="text-xs text-gray-400 mt-0.5">{item.subtitle}</span>}
        </div>
        <motion.div
          animate={{
            scale: hovered ? 1.2 : 1
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 10
          }}
          className="relative"
        >
          {getStatusIcon(item.status)}
          <motion.div
            className="absolute inset-0 bg-current rounded-full"
            initial={{
              opacity: 0,
              scale: 0.5
            }}
            animate={{
              opacity: hovered ? 0.2 : 0,
              scale: hovered ? 1.5 : 0.5
            }}
            transition={{
              duration: 0.3
            }}
          />
        </motion.div>
      </CardContent>
    </Card>
  );
}
