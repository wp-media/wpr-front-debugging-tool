import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function FetchingPage() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-100 flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center justify-center space-y-6 text-center px-4 max-w-2xl"
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
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            />
            <div className="relative bg-gray-800 rounded-full p-6">
              <Loader2 className="w-16 h-16 text-blue-400 animate-spin" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-100">Fetching data from the extension</h2>
          <p className="text-gray-400 max-w-md">
            The app is trying to obtain data from the extension. This process may take a moment.
          </p>

          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <motion.div
              className="h-1 w-1 bg-blue-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span>Fetching data...</span>
          </div>
        </motion.div>
      </div>
    </TooltipProvider>
  );
}
