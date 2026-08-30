"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function SearchBar({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    // We use a debounce to avoid pushing to the router on every keystroke
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (query.trim()) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      
      // using replace to not fill up the browser history
      router.replace(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(handler);
  }, [query, pathname, router, searchParams]);

  // Sync state if initialQuery changes from outside (e.g. going back in history)
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  return (
    <div className="relative group w-full">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <svg
          className="w-4 h-4 text-white/40 group-focus-within:text-solaire transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher..."
        className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-solaire focus:border-solaire backdrop-blur-md transition-all font-body text-sm"
      />
    </div>
  );
}
