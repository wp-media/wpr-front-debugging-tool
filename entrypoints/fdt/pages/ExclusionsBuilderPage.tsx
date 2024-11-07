import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  Zap,
  Image as ImageIcon,
  FileInput,
  Play,
  ToggleLeft,
  RefreshCw
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import type { FDTData } from '@/content-scripts/devtoolsContentScript';
let runAnimations = true;
export default function ExclusionsBuilderPage(props: { fdtData: FDTData }) {
  const [delayJSExclusions, setDelayJSExclusions] = useState('');
  const [deferJSExclusions, setDeferJSExclusions] = useState('');
  const [lazyLoadExclusions, setLazyLoadExclusions] = useState('');
  const [lazyLoadImagesIframes, setLazyLoadImagesIframes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [delayJSEnabled, setDelayJSEnabled] = useState(true);
  const [lazyLoadEnabled, setLazyLoadEnabled] = useState(true);
  useEffect(() => {
    runAnimations = false;
  }, []);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleApplyExclusions = () => {
    console.log('Applying exclusions...');
    toast.success('Exclusions applied successfully', {
      duration: 3000,
      style: {
        background: '#10B981',
        color: '#fff'
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10B981'
      }
    });
  };

  const handleApplyExclusionsAndRefresh = () => {
    console.log('Applying exclusions and refreshing...');
    toast.success(
      (t) => (
        <span className="flex items-center">
          Exclusions applied successfully: Reloading
          <RefreshCw className="animate-spin ml-2" size={18} />
        </span>
      ),
      {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff'
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#10B981'
        }
      }
    );
    setTimeout(() => {
      // window.location.reload();
    }, 3000);
  };

  const toggleDelayJS = () => {
    setDelayJSEnabled(!delayJSEnabled);
  };

  const toggleLazyLoad = () => {
    setLazyLoadEnabled(!lazyLoadEnabled);
  };

  return (
    <motion.div
      className="p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: runAnimations ? 0.5 : 0 }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          className: '',
          style: {
            background: '#333',
            color: '#fff'
          }
        }}
      />

      <div className="mb-8 flex flex-wrap justify-center gap-4">
        <Button
          onClick={toggleDelayJS}
          className={`${delayJSEnabled ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-600 hover:bg-gray-700'} text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-300`}
        >
          <Clock className="mr-2 h-5 w-5" /> {delayJSEnabled ? 'Disable' : 'Enable'} Delay
          JavaScript Execution
        </Button>
        <Button
          onClick={toggleLazyLoad}
          className={`${lazyLoadEnabled ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-600 hover:bg-gray-700'} text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-300`}
        >
          <ImageIcon className="mr-2 h-5 w-5" /> {lazyLoadEnabled ? 'Disable' : 'Enable'} Automatic
          Lazy Rendering
        </Button>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
          <CardHeader className="bg-orange-900/30">
            <CardTitle className="text-xl text-orange-400 flex items-center">
              <FileInput className="mr-2" /> HTML File Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Label htmlFor="html-file" className="text-gray-300 mb-2 block">
              Select HTML file to process:
            </Label>
            <Input
              id="html-file"
              type="file"
              accept=".html,.htm"
              onChange={handleFileChange}
              className="bg-gray-700 text-gray-100 border-gray-600 focus:border-orange-500"
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-400">Selected file: {selectedFile.name}</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
          <CardHeader className="bg-indigo-900/30">
            <CardTitle className="text-xl text-indigo-400 flex items-center">
              <ToggleLeft className="mr-2" /> Feature Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Delay JavaScript Execution:</span>
              <Badge
                variant="outline"
                className={
                  delayJSEnabled
                    ? 'bg-indigo-900/50 text-indigo-300 border-indigo-700'
                    : 'bg-gray-700/50 text-gray-300 border-gray-600'
                }
              >
                {delayJSEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Automatic Lazy Rendering:</span>
              <Badge
                variant="outline"
                className={
                  lazyLoadEnabled
                    ? 'bg-indigo-900/50 text-indigo-300 border-indigo-700'
                    : 'bg-gray-700/50 text-gray-300 border-gray-600'
                }
              >
                {lazyLoadEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <Button
          onClick={handleApplyExclusions}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
        >
          <Play className="mr-2 h-5 w-5" /> Apply Exclusions
        </Button>
        <Button
          onClick={handleApplyExclusionsAndRefresh}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
        >
          <RefreshCw className="mr-2 h-5 w-5" /> Apply Exclusions and Refresh Page
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
          <CardHeader className="bg-purple-900/30">
            <CardTitle className="text-xl text-purple-400 flex items-center">
              <Clock className="mr-2" /> Delay JavaScript Execution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Textarea
              placeholder="Enter exclusions (one per line)"
              className="min-h-[200px] bg-gray-700 text-gray-100 border-gray-600 focus:border-purple-500"
              value={delayJSExclusions}
              onChange={(e) => setDelayJSExclusions(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
          <CardHeader className="bg-blue-900/30">
            <CardTitle className="text-xl text-blue-400 flex items-center">
              <Zap className="mr-2" /> Load JavaScript Deferred
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Textarea
              placeholder="Enter exclusions (one per line)"
              className="min-h-[200px] bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500"
              value={deferJSExclusions}
              onChange={(e) => setDeferJSExclusions(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
          <CardHeader className="bg-green-900/30">
            <CardTitle className="text-xl text-green-400 flex items-center">
              <ImageIcon className="mr-2" /> Automatic Lazy Rendering
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Textarea
              placeholder="Enter exclusions (one per line)"
              className="min-h-[200px] bg-gray-700 text-gray-100 border-gray-600 focus:border-green-500"
              value={lazyLoadExclusions}
              onChange={(e) => setLazyLoadExclusions(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
          <CardHeader className="bg-yellow-900/30">
            <CardTitle className="text-xl text-yellow-400 flex items-center">
              <ImageIcon className="mr-2" /> Lazyload (Only IMG)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Textarea
              placeholder="Enter exclusions (one per line)"
              className="min-h-[200px] bg-gray-700 text-gray-100 border-gray-600 focus:border-yellow-500"
              value={lazyLoadImagesIframes}
              onChange={(e) => setLazyLoadImagesIframes(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
