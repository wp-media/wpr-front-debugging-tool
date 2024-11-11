import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code } from 'lucide-react';
import { GeneralInfo } from '../types';

export function ConstantCard(props: { constants: GeneralInfo['constants'] }) {
  const { constants } = props;
  return (
    <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
      <CardHeader className="bg-yellow-900/30">
        <CardTitle className="text-lg text-yellow-400 flex items-center">
          <Code className="mr-2" /> Constants
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {Object.entries(constants).map(([key, constant]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-gray-300">{key}:</span>
              <div className="flex items-center space-x-2">
                <span>
                  <Badge
                    variant="outline"
                    className={`px-3 py-1 bg-gray-900/50 text-gray-300 border-gray-700`}
                  >
                    {constant.defined ? 'defined' : 'undefined'}
                  </Badge>
                  {constant.defined && (
                    <Badge
                      variant="outline"
                      className={`px-3 py-1 ${getColors(key, constant.value!)}`}
                    >
                      {String(constant.value!)}
                    </Badge>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
function getColors(constantName: string, value: boolean) {
  if (constantName === 'WP_CACHE') {
    return value
      ? 'bg-emerald-900/50 text-emerald-300 border-emerald-700'
      : 'bg-rose-900/50 text-rose-300 border-rose-700';
  }
  if (constantName.startsWith('DONOT')) {
    return !value
      ? 'bg-emerald-900/50 text-emerald-300 border-emerald-700'
      : 'bg-rose-900/50 text-rose-300 border-rose-700';
  }
  return 'bg-gray-900/50 text-gray-300 border-gray-700';
}
