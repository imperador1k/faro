"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export const UserSearch = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    
    const initialQuery = searchParams.get("q")?.toString() || "";
    const [searchTerm, setSearchTerm] = useState(initialQuery);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (debouncedSearchTerm) {
            params.set("q", debouncedSearchTerm);
        } else {
            params.delete("q");
        }
        
        // Prevent unnecessary pushes if nothing changed
        const currentQuery = searchParams.get("q") || "";
        if (currentQuery !== debouncedSearchTerm) {
             replace(`${pathname}?${params.toString()}`);
        }
    }, [debouncedSearchTerm, pathname, replace, searchParams]);

    return (
        <div className="bg-stone-100 border-2 border-stone-200 border-b-4 rounded-2xl flex items-center px-4 py-3">
            <Search className="h-6 w-6 text-stone-400 shrink-0 mr-3" />
            <input
                className="flex-1 bg-transparent border-none outline-none text-stone-700 placeholder:text-stone-400 font-bold text-lg"
                placeholder="Procurar por nome..."
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
            />
        </div>
    );
};
