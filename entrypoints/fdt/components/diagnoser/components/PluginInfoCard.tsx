import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { GeneralInfo } from '../types';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export function PluginInfoCard(props: { pluginInfo: GeneralInfo['pluginInfo'] }) {
  const { pluginInfo } = props;
  return (
    <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
      <CardHeader className="bg-blue-900/30">
        <CardTitle className="text-lg text-blue-400 flex items-center">
          <Settings className="mr-2" /> General Info
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">WP Rocket Plugin:</span>
            <Badge
              variant="outline"
              className={`
                px-3 py-1 ${
                  pluginInfo.wprStatus === 'active'
                    ? 'bg-emerald-900/50 text-emerald-300 border-emerald-700'
                    : 'bg-rose-900/50 text-rose-300 border-rose-700'
                }`}
            >
              {pluginInfo.wprStatus}
            </Badge>
          </div>
          {pluginInfo.wprInstalledVersion && (
            <div className="flex justify-between items-center">
              <span className="text-gray-300">WP Rocket Version:</span>
              <Badge
                variant="outline"
                className="bg-blue-900/50 text-blue-300 border-blue-700 px-3 py-1"
              >
                {pluginInfo.wprInstalledVersion}
              </Badge>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Diagnoser Version:</span>
            <Badge
              variant="outline"
              className="bg-blue-900/50 text-blue-300 border-blue-700 px-3 py-1"
            >
              {pluginInfo.diagnoserInstalledVersion}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300 mr-4">QueryStrings:</span>
            <SyntaxHighlighter
              language="json"
              style={atomOneDark}
              customStyle={{
                background: 'transparent',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.75rem'
              }}
              wrapLongLines={true}
              className="max-h-40 w-full rounded-md border border-gray-700"
            >
              {JSON.stringify(pluginInfo.queryStringsInUrl, null, 2)}
            </SyntaxHighlighter>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300 mr-4">User Agent:</span>
            <code className="text-gray-400" style={{ overflowWrap: 'anywhere' }}>
              {pluginInfo.userAgent}
            </code>
          </div>
          {pluginInfo.imagify && (
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Imagify Version:</span>
              <Badge
                variant="outline"
                className="bg-blue-900/50 text-blue-300 border-blue-700 px-3 py-1"
              >
                {pluginInfo.imagify}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
