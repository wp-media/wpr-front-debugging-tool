import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function NothingToShow(props: { title?: string; description?: string }) {
  const { title, description } = props;
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-100">
        <main className="container mx-auto px-4 py-8">
          {
            <motion.div
              className="flex flex-col items-center justify-center space-y-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-blue-500 rounded-full opacity-20 blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.3, 0.2]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                />
                <div className="relative bg-gray-800 rounded-full p-6">
                  <Search className="w-16 h-16 text-blue-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-100">
                {title || 'Nothing to show here'}
              </h2>
              <p className="text-gray-400 max-w-md">
                {description || `Oops! It's looking a little empty in here.`}
              </p>
            </motion.div>
          }
        </main>
      </div>
    </TooltipProvider>
  );
}
