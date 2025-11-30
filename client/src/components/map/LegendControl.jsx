import React from 'react';
import clsx from 'clsx';

export default function LegendControl({ className }) {
  return (
    <div
      className={clsx(
        'pointer-events-auto rounded-xl border border-border bg-white/95 backdrop-blur p-3 shadow-md text-xs font-medium text-foreground space-y-2',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex h-3 w-3 rounded-full bg-emerald-500" aria-hidden="true" />
        <span>Target customers</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex h-3 w-3 rounded-full bg-rose-500" aria-hidden="true" />
        <span>Competitors</span>
      </div>
    </div>
  );
}
