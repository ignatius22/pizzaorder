import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function SearchOrder() {
  const [query, setQuery] = useState();
  const navigate = useNavigate();
  function handleSubmit(e) {
    e.preventDefault();
    if (!query) return;
    navigate(`/order/${query}`);
    setQuery("");
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="search order #"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-full bg-yellow-100 px-4 py-2 text-sm placeholder:text-stone-400 focus:w-72 sm:w-64 focus:outline-none focus:ring-yellow-500 focus:ring-opacity-50 sm:focus:w-72"
        />
      </form>
    </div>
  );
}



export default SearchOrder;
