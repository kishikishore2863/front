import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useAppContext } from '@/context/AppContext';

export default function PrioritySliders() {
  const { priorities, setPriorities } = useAppContext();

  const handleChange = (key, value) => {
    setPriorities(prev => ({
      ...prev,
      [key]: value[0]
    }));
  };

  return (
    <div className="space-y-6 p-4 bg-card rounded-lg border shadow-sm">
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
        Priorities
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <Label>Competition</Label>
          <span className="text-muted-foreground">{priorities.competition}%</span>
        </div>
        <Slider 
          value={[priorities.competition]} 
          max={100} 
          step={1} 
          onValueChange={(v) => handleChange('competition', v)} 
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <Label>Footfall</Label>
          <span className="text-muted-foreground">{priorities.footfall}%</span>
        </div>
        <Slider 
          value={[priorities.footfall]} 
          max={100} 
          step={1} 
          onValueChange={(v) => handleChange('footfall', v)} 
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <Label>Amenities</Label>
          <span className="text-muted-foreground">{priorities.amenities}%</span>
        </div>
        <Slider 
          value={[priorities.amenities]} 
          max={100} 
          step={1} 
          onValueChange={(v) => handleChange('amenities', v)} 
        />
      </div>
    </div>
  );
}
