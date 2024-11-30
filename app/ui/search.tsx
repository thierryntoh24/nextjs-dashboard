'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';


export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // const [searchTerm, setSearchTerm] = useState('');

  // Debounced function to update search
  // const handleSearch = useCallback(
  //   debounce((term: string) => {
  //     const params = new URLSearchParams(searchParams);
  //     const trimmedTerm = term.trim(); // Trim leading/trailing spaces here, not earlier

  //     if (trimmedTerm !== '') {
  //       params.set('query', trimmedTerm);
  //     } else {
  //       params.delete('query');
  //     }
  //     replace(`${pathname}?${params.toString()}`);
  //   }, 500), // 500ms debounce time
  //   [searchParams, pathname, replace]
  // );

  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);
   
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  function handleChange(value: string) {
    // setSearchTerm(value); // Update input value immediately
    handleSearch(value); // Debounced update
  }

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        // value={searchTerm}
        defaultValue={searchParams.get('query')?.toString()}
        onChange={(e) => handleChange(e.target.value)}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}

// Debounce utility
function debounce(func: Function, delay: number) {
  let timer: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
