import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';

export default function ComparePanel({ data, loading }) {
  const { setMode } = useAppContext();
  const { comparison, locationA, locationB } = data || {};

  return (
    <Card className="h-full border-l rounded-none shadow-xl overflow-y-auto bg-white">
      <CardHeader className="pb-4 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="icon" onClick={() => setMode('scoring')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Comparison</CardTitle>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
            <div className="text-xs text-blue-600 font-semibold uppercase">Location A</div>
            <div className="text-2xl font-bold text-blue-700">{locationA?.score || '-'}</div>
          </div>
          <div className="p-3 rounded-lg bg-red-50 border border-red-100">
            <div className="text-xs text-red-600 font-semibold uppercase">Location B</div>
            <div className="text-2xl font-bold text-red-700">{locationB?.score || '-'}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {loading ? (
          <div className="text-center text-muted-foreground py-10">Analyzing locations...</div>
        ) : !comparison ? (
          <div className="text-center text-muted-foreground py-10">Select two locations to compare</div>
        ) : (
          <>
            <div className="text-center py-4 bg-secondary/30 rounded-xl border">
              <span className="text-sm text-muted-foreground block mb-1">Winner</span>
              <div className="flex items-center justify-center gap-2 text-lg font-bold">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Location {comparison.winner}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Key Differentiators</h4>
              
              <MetricRow 
                label="Competition" 
                value={comparison.competitionDelta} 
                inverse={true} 
              />
              <MetricRow 
                label="Amenities" 
                value={comparison.amenityDelta} 
              />
              <MetricRow 
                label="Transit Access" 
                value={comparison.transitDelta} 
              />
            </div>

            <div className="pt-6">
              <h4 className="font-semibold text-sm mb-3">Persona Match</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Young Professionals</Badge>
                <Badge variant="outline">Students</Badge>
                <Badge variant="secondary">Tourists</Badge>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function MetricRow({ label, value, inverse = false }) {
  const isPositive = value > 0;
  // If inverse (like competition), lower is better usually, but let's stick to simple delta for now
  // Let's assume positive delta means "More X in A than B"
  
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`font-mono font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{value}%
        </span>
        <span className="text-xs text-muted-foreground">(A vs B)</span>
      </div>
    </div>
  );
}
