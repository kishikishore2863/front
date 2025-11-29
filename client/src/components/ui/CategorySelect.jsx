import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Label } from '@/components/ui/label';

const AMENITY_CATEGORIES = [
  'amenity=cafe',
  'amenity=restaurant',
  'amenity=bank',
  'amenity=school',
  'amenity=hospital',
  'amenity=bar',
];

const SHOP_CATEGORIES = [
  'shop=bakery',
  'shop=grocery',
  'shop=supermarket',
  'shop=clothes',
  'shop=electronics',
  'shop=convenience',
];

function Chip({ value, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(value)}
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors border ${selected ? 'bg-primary text-white border-primary' : 'bg-white text-muted-foreground border-border'}`}
    >
      {value.split('=')[1]}
    </button>
  );
}

export default function CategorySelect({ onChange } = {}) {
  const { selectedCategories, setSelectedCategories, setNearbyRefreshTick } = useAppContext();

  const toggleCategory = (cat) => {
    setSelectedCategories(prev => {
      const exists = prev.includes(cat);
      const next = exists ? prev.filter(c => c !== cat) : [...prev, cat];
      // trigger callback for immediate fetch
      if (typeof onChange === 'function') onChange(next);
      // also increment the global refresh tick so the map layer refetches
      setNearbyRefreshTick((t) => (t || 0) + 1);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      <Label>Categories</Label>

      <div>
        <div className="text-xs font-semibold mb-2">Amenities</div>
        <div className="flex flex-wrap gap-2">
          {AMENITY_CATEGORIES.map((c) => (
            <Chip key={c} value={c} selected={selectedCategories.includes(c)} onToggle={toggleCategory} />
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs font-semibold mb-2">Shops</div>
        <div className="flex flex-wrap gap-2">
          {SHOP_CATEGORIES.map((c) => (
            <Chip key={c} value={c} selected={selectedCategories.includes(c)} onToggle={toggleCategory} />
          ))}
        </div>
      </div>
    </div>
  );
}
