"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as LucideIcons from "lucide-react";
import { ArrowLeft, Compass, MapPin, Search, Star } from "lucide-react";
import { Category, LocationWithCategory, fetchCategoryBySlug, fetchLocationsByCategorySlug } from "@/lib/data";
import { getCategoryIconName } from "@/lib/category-icons";
import { getCategoryVideoSrc } from "@/lib/category-videos";

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
    <main className="min-h-screen overflow-x-hidden bg-[#f7fbf9] font-sans text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-5 md:px-8 md:py-10">
        <Link href="/" className="inline-flex min-h-10 items-center gap-2 rounded-full px-1 text-sm font-semibold text-teal-700 transition-colors hover:text-teal-900">
          <ArrowLeft size={17} />
          Back
        </Link>

        {loading ? (
          <div className="mt-6 h-64 animate-pulse rounded-lg bg-white/80 shadow-sm" />
        ) : category ? (
          <>
            <header className="relative -mx-4 mt-3 overflow-hidden bg-slate-950 px-4 py-10 text-white sm:-mx-5 sm:px-5 md:mx-0 md:rounded-lg md:px-8 md:py-12">
              <video
                key={category.slug}
                className="absolute inset-0 h-full w-full object-cover"
                src={getCategoryVideoSrc(category)}
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-950/65 to-slate-950/25" />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/55 via-transparent to-slate-950/20" />

              <div className="relative grid gap-8 md:grid-cols-[minmax(0,1fr)_22rem] md:items-end">
                <div className="min-w-0">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/14 shadow-lg shadow-black/10 backdrop-blur">
                    <DynamicIcon
                      name={getCategoryIconName(category.icon_name)}
                      className="h-9 w-9"
                      style={{ color: "#7ee9d1" } as React.CSSProperties}
                    />
                  </div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-teal-100">Category guide</p>
                  <h1 className="max-w-3xl break-words text-4xl font-extrabold leading-tight text-white md:text-6xl">{category.name}</h1>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200">
                    Browse places around Chouf, compare options, and find the right spot without digging through a crowded directory.
                  </p>
                </div>

                <div className="rounded-lg bg-white/95 p-2 shadow-2xl shadow-slate-950/20">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                    <input
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search places"
                      className="h-12 w-full rounded-md bg-transparent pl-11 pr-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>
            </header>

            <section className="py-8 md:py-10">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">Places to explore</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {filteredLocations.length > 0
                      ? `${filteredLocations.length} ${filteredLocations.length === 1 ? "result" : "results"} in ${category.name}`
                      : `${category.place_count} ${category.place_count === 1 ? "place" : "places"} being organized for this category`}
                  </p>
                </div>
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="self-start rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:text-teal-700 sm:self-auto"
                  >
                    Clear search
                  </button>
                )}
              </div>

              {filteredLocations.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredLocations.map((location) => (
                    <article
                      key={location.location_id}
                      className="overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative w-full overflow-hidden bg-slate-100" style={{ aspectRatio: "4/3" }}>
                        {location.main_image_url ? (
                          <img
                            src={location.main_image_url}
                            alt={location.name}
                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center" style={{ background: "linear-gradient(135deg, #0f172a, #1d4d43)" }}>
                            <img src="/logoweb.png" alt="InChouf" className="h-16 w-16 opacity-35" />
                          </div>
                        )}
                        <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-teal-700 shadow-sm backdrop-blur">
                          {category.name}
                        </span>
                      </div>
                      <div className="p-4 md:p-5">
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <h3 className="min-w-0 break-words text-base font-bold leading-snug text-slate-950 md:text-lg">{location.name}</h3>
                          <div className="flex flex-shrink-0 items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-500">
                            <Star size={11} className="fill-current" />
                            4.9
                          </div>
                        </div>
                        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-500">{location.description}</p>
                        <div className="flex items-start gap-1.5 text-xs text-slate-400">
                          <MapPin size={13} className="mt-0.5 flex-shrink-0" style={{ color: "#2abf9e" }} />
                          <span className="min-w-0 break-words">{location.address_or_area}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-72 flex-col items-center justify-center rounded-lg bg-white/80 px-6 py-12 text-center shadow-sm">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
                    <Compass className="h-8 w-8 text-teal-600" />
                  </div>
                  <h2 className="max-w-md text-2xl font-extrabold tracking-tight text-slate-950">Listings are being curated</h2>
                  <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-500">
                    This guide is ready for {category.name}. Public places will appear here as soon as they are approved.
                  </p>
                  <Link href="/categories" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-slate-950 px-5 text-sm font-bold text-white transition-colors hover:bg-teal-700">
                    Browse all categories
                  </Link>
                </div>
              )}
            </section>
          </>
        ) : (
          <section className="mt-6 flex min-h-80 flex-col items-center justify-center rounded-lg bg-white/80 px-5 py-12 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-950">Category not found</h1>
            <p className="mt-2 text-sm text-slate-500">Try browsing all categories instead.</p>
            <Link href="/categories" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-teal-600 px-5 text-sm font-bold text-white hover:bg-teal-700">
              View Categories
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
