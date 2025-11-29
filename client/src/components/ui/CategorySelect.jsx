// import React from 'react';
// import { useAppContext } from '@/context/AppContext';
// import { Label } from '@/components/ui/label';

// const AMENITY_CATEGORIES = [
//   'amenity=cafe',
//   'amenity=restaurant',
//   'amenity=bank',
//   'amenity=school',
//   'amenity=hospital',
//   'amenity=bar',
// ];

// const SHOP_CATEGORIES = [
//   'shop=bakery',
//   'shop=grocery',
//   'shop=supermarket',
//   'shop=clothes',
//   'shop=electronics',
//   'shop=convenience',
// ];

// function Chip({ value, selected, onToggle }) {
//   return (
//     <button
//       type="button"
//       onClick={() => onToggle(value)}
//       className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors border ${selected ? 'bg-primary text-white border-primary' : 'bg-white text-muted-foreground border-border'}`}
//     >
//       {value.split('=')[1]}
//     </button>
//   );
// }

// export default function CategorySelect({ onChange } = {}) {
//   const { selectedCategories, setSelectedCategories, setNearbyRefreshTick } = useAppContext();

//   const toggleCategory = (cat) => {
//     setSelectedCategories(prev => {
//       const exists = prev.includes(cat);
//       const next = exists ? prev.filter(c => c !== cat) : [...prev, cat];
//       // trigger callback for immediate fetch
//       if (typeof onChange === 'function') onChange(next);
//       // also increment the global refresh tick so the map layer refetches
//       setNearbyRefreshTick((t) => (t || 0) + 1);
//       return next;
//     });
//   };

//   return (
//     <div className="space-y-3">
//       <Label>Categories</Label>

//       <div>
//         <div className="text-xs font-semibold mb-2">Amenities</div>
//         <div className="flex flex-wrap gap-2">
//           {AMENITY_CATEGORIES.map((c) => (
//             <Chip key={c} value={c} selected={selectedCategories.includes(c)} onToggle={toggleCategory} />
//           ))}
//         </div>
//       </div>

//       <div>
//         <div className="text-xs font-semibold mb-2">Shops</div>
//         <div className="flex flex-wrap gap-2">
//           {SHOP_CATEGORIES.map((c) => (
//             <Chip key={c} value={c} selected={selectedCategories.includes(c)} onToggle={toggleCategory} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }




// import React from 'react';
// import { useAppContext } from '@/context/AppContext';
// import { Label } from '@/components/ui/label';

// const AMENITY_CATEGORIES = [
//   'amenity=cafe',
//   'amenity=restaurant',
//   'amenity=bank',
//   'amenity=school',
//   'amenity=hospital',
//   'amenity=bar',
// ];

// const SHOP_CATEGORIES = [
//   'shop=bakery',
//   'shop=grocery',
//   'shop=supermarket',
//   'shop=clothes',
//   'shop=electronics',
//   'shop=convenience',
// ];

// // Chip button
// function Chip({ value, selected, onToggle }) {
//   return (
//     <button
//       type="button"
//       onClick={() => onToggle(value)}
//       className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors border 
//       ${selected ? 'bg-primary text-white border-primary' : 'bg-white text-muted-foreground border-border'}`}
//     >
//       {value.split('=')[1]}
//     </button>
//   );
// }

// export default function CategorySelect({ onChange } = {}) {
//   const { selectedCategories, setSelectedCategories, setNearbyRefreshTick } =
//     useAppContext();

//   const toggleCategory = (cat) => {
//     setSelectedCategories((prev) => {
//       const exists = prev.includes(cat);
//       const next = exists ? prev.filter((c) => c !== cat) : [...prev, cat];

//       if (typeof onChange === 'function') onChange(next);

//       setNearbyRefreshTick((t) => (t || 0) + 1);
//       return next;
//     });
//   };

//   return (
//     <div className="space-y-4 border p-4 rounded-lg bg-white shadow-sm">

//       {/* Title */}
//       <h2 className="text-lg font-semibold">Targeted Customer</h2>

//       {/* Sub Heading */}
//       <Label className="text-sm text-muted-foreground">
//         Choose customer types you want to target
//       </Label>

//       {/* Amenities Box */}
//       <div className="space-y-2">
//         <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
//           Amenities
//         </div>
//         <div className="flex flex-wrap gap-2">
//           {AMENITY_CATEGORIES.map((c) => (
//             <Chip
//               key={c}
//               value={c}
//               selected={selectedCategories.includes(c)}
//               onToggle={toggleCategory}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Shops Box */}
//       <div className="space-y-2">
//         <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
//           Shops
//         </div>
//         <div className="flex flex-wrap gap-2">
//           {SHOP_CATEGORIES.map((c) => (
//             <Chip
//               key={c}
//               value={c}
//               selected={selectedCategories.includes(c)}
//               onToggle={toggleCategory}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }









import React from "react";
import { useAppContext } from "@/context/AppContext";
import { Label } from "@/components/ui/label";

// Icons
import {
  Coffee,
  Utensils,
  Building2,
  GraduationCap,
  Hospital,
  Beer,
  ShoppingBag,
  Shirt,
  Store,
  Laptop,
  ShoppingCart
} from "lucide-react";

const CATEGORY_DEFINITIONS = [
  { value: "amenity=cafe", label: "Cafe", icon: Coffee },
  { value: "amenity=restaurant", label: "Restaurant", icon: Utensils },
  { value: "amenity=bank", label: "Bank", icon: Building2 },
  { value: "amenity=school", label: "School", icon: GraduationCap },
  { value: "amenity=hospital", label: "Hospital", icon: Hospital },
  { value: "amenity=bar", label: "Bar", icon: Beer },

  { value: "shop=bakery", label: "Bakery", icon: Store },
  { value: "shop=grocery", label: "Grocery", icon: ShoppingCart },
  { value: "shop=supermarket", label: "Supermarket", icon: ShoppingBag },
  { value: "shop=clothes", label: "Clothes", icon: Shirt },
  { value: "shop=electronics", label: "Electronics", icon: Laptop },
  { value: "shop=convenience", label: "Convenience", icon: Store }
];

export default function CategorySelect({ onChange } = {}) {
  const { selectedCategories, setSelectedCategories, setNearbyRefreshTick } =
    useAppContext();

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) => {
      const exists = prev.includes(cat);
      const next = exists ? prev.filter((c) => c !== cat) : [...prev, cat];

      if (typeof onChange === "function") onChange(next);

      setNearbyRefreshTick((t) => (t || 0) + 1);
      return next;
    });
  };

  return (
    <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">

      {/* Title */}
      <h2 className="text-lg font-semibold">🎯 Targeted Customer</h2>
      <p className="text-sm text-muted-foreground">
        Select customer types to customize targeted reach
      </p>

      {/* Grid UI */}
      <div className="grid grid-cols-2 gap-3">
        {CATEGORY_DEFINITIONS.map(({ value, label, icon: Icon }) => {
          const selected = selectedCategories.includes(value);

          return (
            <button
              key={value}
              onClick={() => toggleCategory(value)}
              className={`
                flex items-center gap-2 p-3 rounded-lg border transition
                ${selected 
                  ? "bg-primary text-white border-primary shadow-md" 
                  : "bg-white hover:bg-accent border-border"
                }
              `}
            >
              <Icon className={`h-5 w-5 ${selected ? "text-white" : "text-primary"}`} />
              <span className="text-sm font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}