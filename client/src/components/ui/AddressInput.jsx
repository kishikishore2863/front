import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function AddressInput({ placeholder = "Search location...", onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, geocode here.
    // For mock, we rely on map clicks or manual coord entry if needed.
    // Just passing a dummy trigger for now.
    if (onSearch) onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input 
        placeholder={placeholder} 
        className="pl-9 bg-white" 
      />
      {/* Hidden submit for enter key */}
      <button type="submit" className="hidden" />
    </form>
  );
}
