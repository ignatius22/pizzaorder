import React, { Suspense, useState } from "react";
import { useLoaderData, defer, Await } from "react-router-dom";
import { getMenu } from "../../services/apiRestaurant";
import MenuItem from "./MenuItem";
import { Pizza } from "../../types";
import MenuSkeleton from "./MenuSkeleton";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function Menu() {
  const { menu } = useLoaderData() as { menu: Promise<Pizza[]> };
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, veggie, meat, spicy

  return (
    <div className="py-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="mb-2 font-display text-4xl font-extrabold tracking-tight text-stone-800 dark:text-stone-100">
            Our <span className="text-pizza-500">Menu</span>
          </h1>
          <p className="text-stone-500 dark:text-stone-400">Choose from our selected range of artisanal pizzas.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative group flex-1 sm:w-64">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 group-focus-within:text-pizza-500 transition-colors" />
            <input
              type="text"
              placeholder="Search pizzas or ingredients..."
              className="w-full rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-800 py-3.5 pl-12 pr-4 text-stone-800 dark:text-stone-100 shadow-inner focus:outline-none focus:ring-4 focus:ring-pizza-500/10 focus:border-pizza-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {["all", "veggie", "meat", "spicy"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all whitespace-nowrap ${
                  filter === cat 
                    ? "bg-pizza-500 text-stone-900 shadow-lg shadow-pizza-500/20" 
                    : "bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-400 border border-stone-100 dark:border-stone-700 hover:border-pizza-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <Suspense fallback={<MenuSkeleton />}>
        <Await resolve={menu}>
          {(resolvedMenu: Pizza[]) => {
            const filteredMenu = resolvedMenu.filter(pizza => {
              const matchesSearch = pizza.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                   pizza.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));
              
              const isVeggie = !pizza.ingredients.some(ing => 
                ["ham", "salami", "prosciutto", "chicken", "pepperoni", "meat", "anchovies"].includes(ing.toLowerCase())
              );
              const isSpicy = pizza.ingredients.some(ing => ing.toLowerCase().includes("spicy") || ing.toLowerCase().includes("chili"));
              
              if (filter === "veggie") return matchesSearch && isVeggie;
              if (filter === "meat") return matchesSearch && !isVeggie;
              if (filter === "spicy") return matchesSearch && isSpicy;
              return matchesSearch;
            });

            if (filteredMenu.length === 0) {
              return (
                <div className="py-20 text-center">
                  <p className="text-xl font-bold text-stone-400">No pizzas found matching your criteria. 🍕</p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredMenu.map((pizza) => (
                  <MenuItem pizza={pizza} key={pizza.id} />
                ))}
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}

export async function loader() {
  const menuPromise = getMenu();
  return defer({ menu: menuPromise });
}

export default Menu;
