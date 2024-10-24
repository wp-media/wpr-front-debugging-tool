import { motion } from 'framer-motion';
import { AlertOctagon, Frown, Lightbulb, RefreshCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function ErrorGettingInformationPage() {
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
              className="absolute inset-0 bg-red-500 rounded-full opacity-20 blur-xl"
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
              <AlertOctagon className="w-16 h-16 text-red-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-100">Error Fetching Data</h2>
          <p className="text-gray-400 max-w-md">
            The app encountered an issue while trying to retrieve the information from the
            extension.
          </p>
          <Card className="bg-gray-800 border-gray-700 w-full">
            <CardContent className="pt-6 px-4 pb-4">
              <p className="text-sm text-gray-300">
                The extension's background service or content scripts appear to be unavailable at
                the moment.
              </p>
              <p className="text-sm text-gray-300 mt-2">
                To resolve this, please try the following steps:
              </p>
              <ol className="list-decimal list-inside text-sm text-gray-300 mt-2 space-y-1">
                <li>Close the DevTools</li>
                <li>Reload or refresh the page</li>
                <li>Reopen the DevTools</li>
              </ol>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </TooltipProvider>
  );
}
