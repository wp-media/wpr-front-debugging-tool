import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Clock,
  Zap,
  Image as ImageIcon,
  FileInput,
  Play,
  RefreshCw,
  FileCode2
} from 'lucide-react';
// declare global {
//   interface Window {
//     showOpenFilePicker: () => Promise<FileSystemFileHandle[]>;
//   }
// }
type HTMLFile = {
  file: File;
  fileHandle: FileSystemFileHandle;
  content: string;
};
import { Toaster, toast } from 'react-hot-toast';
let runAnimations = true;
export default function ExclusionsBuilderPage() {
  const [delayJSExclusions, setDelayJSExclusions] = useState('');
  const [deferJSExclusions, setDeferJSExclusions] = useState('');
  const [lazyLoadExclusions, setLazyLoadExclusions] = useState('');
  const [lazyLoadImagesIframes, setLazyLoadImagesIframes] = useState('');
  const [selectedFile, setSelectedFile] = useState<HTMLFile | null>(null);
  const [delayJSEnabled, setDelayJSEnabled] = useState(true);
  const [lazyLoadEnabled, setLazyLoadEnabled] = useState(true);
  const [workingWithFile, setWorkingWithFile] = useState<boolean>(false);
  useEffect(() => {
    runAnimations = false;
  }, []);
  const showErrortoast = (message: string) => {
    if (!message) return;
    toast.error(message, {
      duration: 3000,
      style: {
        background: '#FF4757',
        color: '#fff'
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#FF4757'
      }
    });
  };
  const showSuccessToast = (message: string) => {
    if (!message) return;
    toast.success(message, {
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
  const handleFileChange = async () => {
    try {
      const files = await window.showOpenFilePicker({
        multiple: false,
        types: [
          {
            accept: {
              'text/html': ['.html', '.htm']
            }
          }
        ]
      });
      if (!files[0]) return;
      const fileHandle = files[0];
      const permission = await fileHandle.requestPermission({ mode: 'readwrite' });
      if (permission !== 'granted') {
        showErrortoast('You must grant permissions');
        return;
      }
      const file = await fileHandle.getFile();
      if (file.type !== 'text/html') {
        showErrortoast('File must be HTML');
        return;
      }
      setSelectedFile({
        file,
        fileHandle,
        content: await file.text()
      });
    } catch (e) {
      showErrortoast('Something went wrong. Check the console.');
      console.log('Error: \n', e);
    }
  };

  const handleApplyExclusions = async () => {
    setWorkingWithFile(true);
    if (!selectedFile?.file) {
      showErrortoast('No file selected');
    } else {
      try {
        console.log('Applying exclusions...');
        showSuccessToast('Exclusions applied successfully, you can refresh the page');
      } catch (e) {
        showErrortoast('Something went wrong. Check the console.');
        console.log('Error: \n', e);
      }
    }
    setWorkingWithFile(false);
  };

  const toggleDelayJS = () => {
    setDelayJSEnabled(!delayJSEnabled);
    setWorkingWithFile(false);
  };

  const toggleLazyLoad = () => {
    setLazyLoadEnabled(!lazyLoadEnabled);
    setWorkingWithFile(false);
  };

  return (
    <motion.div
      className="p-8 max-w-[1400px] w-full"
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

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
          <CardHeader className="bg-orange-900/30">
            <CardTitle className="text-xl text-orange-400 flex items-center">
              <FileInput className="mr-2" /> HTML File Selection
            </CardTitle>
          </CardHeader>
          <CardContent
            className="flex flex-col align-middle justify-center pt-6"
            style={{ height: 'calc(100% - 74px)' }}
          >
            <Label htmlFor="html-file" className="text-gray-300 mb-2 block">
              Select HTML file to process:
            </Label>
            <button
              onClick={() => handleFileChange()}
              className="flex bg-gray-700 text-gray-100 border-gray-600 focus:border-orange-500 h-10 w-full rounded-md border px-4 py-2 text-sm select-none"
            >
              {' '}
              <label htmlFor="" className="mr-3 text-gray-900 font-medium">
                Choose File
              </label>{' '}
              <span className="text-base md:text-sm">
                {selectedFile?.file?.name ?? 'No file chosen'}
              </span>
            </button>
            <p className="mt-2 text-sm text-gray-400">
              Make sure you do not edit the file manually while using this tool.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
          <CardHeader className="bg-indigo-900/30">
            <CardTitle className="text-xl text-indigo-400 flex items-center">
              <Zap className="mr-2" /> Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col space-y-4">
            <Button
              onClick={toggleDelayJS}
              className={`${delayJSEnabled ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-600 hover:bg-gray-700'} text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-300`}
              disabled={!selectedFile || workingWithFile}
            >
              <Clock className="mr-2 h-5 w-5" /> {delayJSEnabled ? 'Disable' : 'Enable'} Delay
              JavaScript Execution
            </Button>
            <Button
              onClick={toggleLazyLoad}
              className={`${lazyLoadEnabled ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-600 hover:bg-gray-700'} text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-300`}
              disabled={!selectedFile || workingWithFile}
            >
              <ImageIcon className="mr-2 h-5 w-5" /> {lazyLoadEnabled ? 'Disable' : 'Enable'}{' '}
              Automatic Lazy Rendering
            </Button>
            <Button
              onClick={handleApplyExclusions}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
              disabled={!selectedFile || workingWithFile}
            >
              <Play className="mr-2 h-5 w-5" /> Apply Exclusions
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
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
              <FileCode2 className="mr-2" /> Load JavaScript Deferred
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
