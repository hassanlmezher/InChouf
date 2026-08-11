"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as LucideIcons from "lucide-react";
import { ArrowLeft, MapPin, Search, Star } from "lucide-react";
import { Category, LocationWithCategory, fetchCategoryBySlug, fetchLocationsByCategorySlug } from "@/lib/data";

const DynamicIcon = ({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) => {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>;
  const Icon = icons[name] || icons["HelpCircle"];
  return <Icon className={className} style={style} />;
};

export default function CategoryPageClient() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";
  const [category, setCategory] = useState<Category | null>(null);
  const [locations, setLocations] = useState<LocationWithCategory[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategory() {
      setLoading(true);
      const [categoryData, locationData] = await Promise.all([
        fetchCategoryBySlug(slug),
        fetchLocationsByCategorySlug(slug),
      ]);
      setCategory(categoryData);
      setLocations(locationData);
      setLoading(false);
    }

    loadCategory();
  }, [slug]);

  const filteredLocations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return locations;
    }

    return locations.filter((location) =>
      [location.name, location.description, location.address_or_area]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery))
    );
  }, [locations, query]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 font-sans sm:px-5 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700">
          <ArrowLeft size={17} />
          Back
        </Link>

        {loading ? (
          <div className="h-52 animate-pulse rounded-lg bg-white shadow-sm ring-1 ring-slate-100" />
        ) : category ? (
          <>
            <header className="mb-8 rounded-lg border border-slate-100 bg-white p-6 shadow-sm md:mb-10 md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-teal-50">
                    <DynamicIcon
                      name={category.icon_name || "HelpCircle"}
                      className="h-9 w-9"
                      style={{ color: "#2abf9e" } as React.CSSProperties}
                    />
                  </div>
                  <div className="min-w-0">
                    <h1 className="break-words text-3xl font-extrabold leading-tight text-slate-900 md:text-5xl">{category.name}</h1>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                      {category.place_count} {category.place_count === 1 ? "place" : "places"} in this category
                    </p>
                  </div>
                </div>

                <div className="relative w-full md:max-w-sm">
                  <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search places"
                    className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                  />
                </div>
              </div>
            </header>

            {filteredLocations.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredLocations.map((location) => (
                  <article
                    key={location.location_id}
                    className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative w-full overflow-hidden bg-slate-100" style={{ aspectRatio: "4/3" }}>
                      {location.main_image_url ? (
                        <img
                          src={location.main_image_url}
                          alt={location.name}
                          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center" style={{ background: "linear-gradient(135deg, #0f0f0f, #1a3a2e)" }}>
                          <img src="/logoweb.png" alt="InChouf" className="h-16 w-16 opacity-30" />
                        </div>
                      )}
                      <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white shadow-md" style={{ backgroundColor: "#2abf9e" }}>
                        {category.name}
                      </span>
                    </div>
                    <div className="p-4 md:p-5">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <h2 className="min-w-0 break-words text-base font-bold leading-snug text-slate-900 md:text-lg">{location.name}</h2>
                        <div className="flex flex-shrink-0 items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-500">
                          <Star size={11} className="fill-current" />
                          4.9
                        </div>
                      </div>
                      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-500">{location.description}</p>
                      <div className="flex items-start gap-1.5 border-t border-slate-50 pt-3 text-xs text-slate-400">
                        <MapPin size={13} className="mt-0.5 flex-shrink-0" style={{ color: "#2abf9e" }} />
                        <span className="min-w-0 break-words">{location.address_or_area}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-slate-100 bg-white px-5 py-12 text-center shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">No public places found yet</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
                  This category page is ready. Places will appear here as soon as they are available from the database.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-lg border border-slate-100 bg-white px-5 py-12 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">Category not found</h1>
            <p className="mt-2 text-sm text-slate-500">Try browsing all categories instead.</p>
            <Link href="/categories" className="mt-5 inline-flex rounded-full bg-teal-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-700">
              View Categories
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
