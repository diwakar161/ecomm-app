'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize search term from URL on component mount
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();
    
    if (trimmedTerm) {
      // Create new URLSearchParams to preserve existing params
      const params = new URLSearchParams(searchParams.toString());
      params.set('search', trimmedTerm);
      params.set('page', '1'); // Reset to first page when searching
      
      router.push(`/products?${params.toString()}`);
    } else {
      // If search is empty, remove search param
      const params = new URLSearchParams(searchParams.toString());
      params.delete('search');
      router.push(`/products?${params.toString()}`);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    
    // Also clear search from URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    router.push(`/products?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchTerm('');
      setIsFocused(false);
      // Also blur the input
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative w-full max-w-md transition-all duration-200 ${
        isFocused ? 'ring-2 ring-blue-500 ring-opacity-50 rounded-lg' : ''
      }`}
    >
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Search products by name..."
          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
          aria-label="Search products"
        />
        
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            aria-label="Clear search"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <button
        type="submit"
        className="absolute -left-[9999px]"
        aria-label="Submit search"
      >
        Search
      </button>
    </form>
  );
}