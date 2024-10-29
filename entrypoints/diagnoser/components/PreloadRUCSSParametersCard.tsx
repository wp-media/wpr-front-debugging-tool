import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GeneralInfo } from '../types';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function PreloadRUCSSParameters(props: {
  parameters: GeneralInfo['preloadRUCSSParameters'];
}) {
  const { parameters } = props;
  return (
    <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
      <CardHeader className="bg-green-900/30">
        <CardTitle className="text-lg text-green-400 flex items-center">
          <Clock className="mr-2" /> Preload and RUCSS Parameters
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {Object.entries(parameters).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-gray-300">{key}:</span>
              <Badge
                variant="outline"
                className="bg-green-900/50 text-green-300 border-green-700 px-3 py-1"
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
