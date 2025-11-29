import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { ArrowRight, Download, MapPin, TrendingUp } from 'lucide-react';

export default function SummaryCard({ data, loading }) {
  const { setMode } = useAppContext();

  if (loading) {
    return (
      <Card className="w-full h-64 animate-pulse">
        <CardContent className="p-6 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-100 rounded w-full"></div>
          <div className="h-4 bg-gray-100 rounded w-2/3"></div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="w-full bg-white/80 backdrop-blur">
        <CardContent className="p-6 text-center text-muted-foreground">
          <MapPin className="mx-auto h-12 w-12 opacity-20 mb-2" />
          <p>Select a location on the map to see analysis</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-none shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
              Location Score
            </CardTitle>
            <div className="text-4xl font-bold mt-1 text-primary">
              {data.score}<span className="text-lg text-muted-foreground font-normal">/100</span>
            </div>
          </div>
          <Button variant="outline" size="icon" title="Export PDF">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Reasons Section */}
        {data.reasons && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Key Drivers</h4>
            <ul className="text-sm space-y-1">
              {data.reasons.map((reason, i) => (
                <li key={i} className="flex items-center gap-2 text-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            Top Opportunities
          </h4>
          <div className="space-y-2">
            {data.topTiles.map((tile, idx) => (
              <div key={idx} className="p-3 bg-secondary/50 rounded-md flex justify-between items-center text-sm border hover:border-primary/50 transition-colors cursor-pointer">
                <span>Zone {tile.properties.id}</span>
                <span className="font-mono font-bold text-primary">
                  {tile.properties.score.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button 
            className="w-full" 
            onClick={() => setMode('compare')}
          >
            Compare Location <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
