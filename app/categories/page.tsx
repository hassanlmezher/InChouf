"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { ArrowLeft, Search } from "lucide-react";
import { Category, fetchMainCategories } from "@/lib/data";

const DynamicIcon = ({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) => {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>;
  const Icon = icons[name] || icons["HelpCircle"];
  return <Icon className={className} style={style} />;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function loadCategories() {
      const data = await fetchMainCategories();
      setCategories(data);
      setLoading(false);
    }

    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return categories;
    }

    return categories.filter((category) =>
      category.name.toLowerCase().includes(normalizedQuery)
    );
  }, [categories, query]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 font-sans sm:px-5 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700">
              <ArrowLeft size={17} />
              Back
            </Link>
            <h1 className="text-3xl font-extrabold leading-tight text-slate-900 md:text-5xl">All Categories</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 md:text-base">
              Find the kind of spot you want to explore in the Chouf.
            </p>
          </div>

          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search categories"
              className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
            />
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="h-36 animate-pulse rounded-lg bg-white shadow-sm ring-1 ring-slate-100" />
            ))}
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {filteredCategories.map((category) => (
              <Link
                key={category.category_id}
                href={`/category?slug=${encodeURIComponent(category.slug)}`}
                className="group flex h-36 flex-col items-center justify-center rounded-lg border border-slate-100 bg-white px-3 py-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-100 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 transition-colors duration-300 group-hover:bg-teal-100">
                  <DynamicIcon
                    name={category.icon_name || "HelpCircle"}
                    className="h-7 w-7 transition-transform duration-300 group-hover:scale-110"
                    style={{ color: "#2abf9e" } as React.CSSProperties}
                  />
                </div>
                <h2 className="line-clamp-2 min-h-10 text-sm font-bold leading-tight text-slate-900">{category.name}</h2>
                {category.place_count > 0 && (
                  <p className="mt-2 text-xs font-medium text-slate-400">
                    {category.place_count} {category.place_count === 1 ? "place" : "places"}
                  </p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-100 bg-white px-5 py-10 text-center text-slate-500 shadow-sm">
            No categories match your search.
          </div>
        )}
      </div>
    </main>
  );
}
