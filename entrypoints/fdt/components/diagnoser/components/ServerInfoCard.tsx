import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Settings } from 'lucide-react';
import { GeneralInfo } from '../types';

export function ServerInfoCard(props: { serverInfo: GeneralInfo['serverInfo'] }) {
  const { serverInfo } = props;
  return (
    <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
      <CardHeader className="bg-purple-900/30">
        <CardTitle className="text-lg text-purple-400 flex items-center">
          <Server className="mr-2" /> Server Info
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Server Load:</span>
            <Badge
              variant="outline"
              className={`px-3 py-1 ${serverInfo !== null ? 'bg-purple-900/50 text-purple-300 border-purple-700' : 'bg-gray-900/50 text-gray-300 border-gray-700'}`}
            >
              {serverInfo.serverLoad !== null
                ? `${Math.floor(serverInfo.serverLoad)}%`
                : "couldn't get"}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Server Type:</span>
            <Badge
              variant="outline"
              className="px-3 py-1 bg-purple-900/50 text-purple-300 border-purple-700"
            >
              {serverInfo.webServer}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">PHP Memory Limit:</span>
            <Badge
              variant="outline"
              className="px-3 py-1 bg-purple-900/50 text-purple-300 border-purple-700"
            >
              {serverInfo.phpMemoryLimit}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">wp_memory_limit:</span>
            <Badge
              variant="outline"
              className="px-3 py-1 bg-purple-900/50 text-purple-300 border-purple-700"
            >
              {serverInfo.wpMemoryLimit}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">wp_max_memory_limit:</span>
            <Badge
              variant="outline"
              className="px-3 py-1 bg-purple-900/50 text-purple-300 border-purple-700"
            >
              {serverInfo.wpMaxMemoryLimit}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
