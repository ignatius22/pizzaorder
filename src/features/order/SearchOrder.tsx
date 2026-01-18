import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";


import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function SearchOrder() {
  const [query, setQuery] = useState<string>("");
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!query) return;
    navigate(`/order/${query}`);
    setQuery("");
  }

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-pizza-500" />
      <input
        type="text"
        placeholder="Search order #"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-2xl bg-white border border-stone-200 py-2.5 pl-11 pr-4 text-sm shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pizza-500/20 focus:border-pizza-500 lg:w-72 xl:w-96"
      />
    </form>
  );
}



export default SearchOrder;
