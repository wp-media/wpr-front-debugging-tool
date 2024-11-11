import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GeneralInfo, SomeFilters, SomeOptions } from '../types';
import { Filter, Zap } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export function SomeFiltersAndOptionsCard(props: {
  someData: SomeFilters | SomeOptions;
  type: 'options' | 'filters';
}) {
  const { someData, type } = props;
  return (
    <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
      {type === 'options' ? (
        <CardHeader className="bg-orange-900/30">
          <CardTitle className="text-lg text-orange-400 flex items-center">
            <Zap className="mr-2" /> Get Rocket Option
          </CardTitle>
        </CardHeader>
      ) : (
        <CardHeader className="bg-indigo-900/30">
          <CardTitle className="text-lg text-indigo-400 flex items-center">
            <Filter className="mr-2" /> Filters
          </CardTitle>
        </CardHeader>
      )}

      <CardContent className="pt-6">
        <div className="space-y-3">
          {Object.entries(someData).map(([key, value]) => (
            <div
              key={key}
              className={`flex ${typeof value !== 'object' || (Array.isArray(value) && value.length === 0) ? 'justify-between items-center' : 'flex-col items-start'}`}
            >
              <span className="text-gray-300">{key}:</span>
              {typeof value !== 'object' || (Array.isArray(value) && value.length === 0) ? (
                <Badge variant="outline" className={`px-3 py-1 ${getColor(value)}`}>
                  {(Array.isArray(value) || typeof value === 'string') && value.length === 0
                    ? 'empty'
                    : String(value)}
                </Badge>
              ) : (
                <ScrollArea className="h-40 w-full rounded-md border border-gray-700 p-4 mt-3">
                  <pre className="text-sm text-gray-300">{JSON.stringify(value, null, 2)}</pre>
                </ScrollArea>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function getColor(value: any) {
  if ((Array.isArray(value) || typeof value === 'string') && value.length === 0)
    return 'bg-gray-900/50 text-gray-300 border-gray-700';
  return value
    ? 'bg-emerald-900/50 text-emerald-300 border-emerald-700'
    : 'bg-rose-900/50 text-rose-300 border-rose-700';
}
