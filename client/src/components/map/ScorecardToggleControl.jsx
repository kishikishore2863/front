import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import clsx from 'clsx';

export default function ScorecardToggleControl({ className }) {
  const { scorecardVisible, setScorecardVisible } = useAppContext();

  const handleToggle = () => {
    setScorecardVisible((prev) => !prev);
  };

  return (
    <div className={clsx('pointer-events-auto', className)}>
      <Button
        type="button"
        size="sm"
        variant={scorecardVisible ? 'default' : 'outline'}
        className="shadow-md flex items-center gap-2"
        aria-pressed={scorecardVisible}
        onClick={handleToggle}
      >
        {scorecardVisible ? (
          <PanelRightClose className="h-4 w-4" aria-hidden="true" />
        ) : (
          <PanelRightOpen className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="text-xs font-medium uppercase tracking-wide">
          {scorecardVisible ? 'Hide Score' : 'Show Score'}
        </span>
      </Button>
    </div>
  );
}
