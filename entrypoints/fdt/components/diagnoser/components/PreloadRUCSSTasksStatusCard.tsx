import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GeneralInfo } from '../types';
import { Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function PreloadRUCSSTasksStatusCard(props: {
  tasksStatus: GeneralInfo['preloadRUCSSTaskStatus'];
}) {
  const { tasksStatus } = props;
  return (
    <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
      <CardHeader className="bg-cyan-900/30">
        <CardTitle className="text-lg text-cyan-400 flex items-center">
          <Activity className="mr-2" /> Preload and RUCSS Tasks status
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {Object.entries(tasksStatus).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-gray-300">{key}:</span>
              <Badge
                variant="outline"
                className="bg-cyan-900/50 text-cyan-300 border-cyan-700 px-3 py-1"
              >
                {String(value)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
