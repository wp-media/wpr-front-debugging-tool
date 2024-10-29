import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export function DisabledOptionsSpecificPageCard(props: { disabledOptions: string[] }) {
  const { disabledOptions } = props;
  return (
    <Card className="bg-gray-800 border-gray-700 mb-8 shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
      <CardHeader className="bg-red-900/30">
        <CardTitle className="text-lg text-red-400 flex items-center">
          <AlertTriangle className="mr-2" /> Disabled options (Specific page)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-2">
          {disabledOptions.map((option, index) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-red-900/50 text-red-300 border-red-700 px-3 py-1 text-sm"
            >
              {option}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
