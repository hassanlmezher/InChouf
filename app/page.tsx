"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { Search, MapPin, Star, ChevronRight, Bell, Menu, X, LogIn, LogOut } from "lucide-react";
import { fetchMainCategories, fetchFeaturedPicks, Category, LocationWithCategory } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { AuthModal } from "@/components/AuthModal";

// Dynamically resolve Lucide icon by name string
const DynamicIcon = ({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) => {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>;
  const Icon = icons[name] || icons["HelpCircle"];
  return <Icon className={className} style={style} />;
};


export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredPicks, setFeaturedPicks] = useState<LocationWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  const handleLogin = () => {
    setAuthModalOpen(true);
  };


  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  useEffect(() => {
    async function loadData() {
      const [cats, picks] = await Promise.all([
        fetchMainCategories(),
        fetchFeaturedPicks(),
      ]);
      setCategories(cats);
      setFeaturedPicks(picks);
      setLoading(false);
    }
    loadData();

    // Track auth state
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 font-sans">
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* ── NAVBAR ── */}
      <nav className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100 md:px-8">

        {/* Logo */}
        <Link href="/" className="min-w-0 flex-shrink-0 flex items-center gap-2">
          <img
            src="/logoweb.png"
            alt="InChouf pin"
            className="h-8 w-auto object-contain md:h-10"
          />
          <span className="font-extrabold text-xl tracking-tight md:text-2xl" style={{ color: "#0f0f0f" }}>
            in<span style={{ color: "#2abf9e" }}>chouf</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-7 text-sm font-medium text-slate-600">
          <a href="#explore" className="text-teal-600 border-b-2 border-teal-500 pb-0.5 transition-colors">Explore</a>
          <a href="#categories" className="hover:text-teal-600 transition-colors">Categories</a>
          <a href="#picks" className="hover:text-teal-600 transition-colors">Top Picks</a>
          <a href="#cta" className="hover:text-teal-600 transition-colors">List Your Place</a>
        </div>

        {/* Right actions */}
        <div className="flex min-w-0 items-center gap-2 md:gap-3">
          <button className="hidden md:block bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm">
            Add a Place
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors hidden md:flex">
            <Bell size={19} />
          </button>

          {/* Desktop Auth Button */}
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: "#2abf9e" }}>
                {(user.email?.[0] ?? "U").toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-red-500 transition-colors px-3 py-1.5 rounded-full hover:bg-red-50"
              >
                <LogOut size={15} />
                Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-2 rounded-full transition-all shadow-sm"
              style={{ backgroundColor: "#2abf9e" }}
            >
              <LogIn size={15} />
              Log In
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed left-0 right-0 top-16 z-40 flex max-h-[calc(100svh-4rem)] flex-col gap-4 overflow-y-auto border-b border-slate-100 bg-white px-5 py-4 shadow-xl md:hidden">
          <a href="#explore" className="text-teal-600 font-semibold text-base" onClick={() => setMobileMenuOpen(false)}>Explore</a>
          <a href="#categories" className="text-slate-700 font-medium text-base" onClick={() => setMobileMenuOpen(false)}>Categories</a>
          <a href="#picks" className="text-slate-700 font-medium text-base" onClick={() => setMobileMenuOpen(false)}>Top Picks</a>
          <a href="#cta" className="text-slate-700 font-medium text-base" onClick={() => setMobileMenuOpen(false)}>List Your Place</a>
          <div className="border-t border-slate-100 pt-3 mt-1">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: "#2abf9e" }}>
                    {(user.email?.[0] ?? "U").toUpperCase()}
                  </div>
                  <span className="truncate max-w-[160px]">{user.email}</span>
                </div>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-1 text-sm font-medium text-red-500"
                >
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { handleLogin(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 text-white py-2.5 rounded-full font-semibold"
                style={{ backgroundColor: "#2abf9e" }}
              >
                <LogIn size={16} /> Log In
              </button>
            )}
          </div>
          <button className="w-full bg-slate-900 text-white py-2.5 rounded-full font-semibold">
            Add a Place
          </button>
        </div>
      )}

      <main id="explore" className="pb-14 md:pb-16">

        {/* ── HERO ── */}
        <section className="relative flex min-h-[calc(92svh-4rem)] flex-col items-center justify-center overflow-hidden px-4 pb-14 pt-12 text-center sm:px-5 md:min-h-[85vh] md:pb-32 md:pt-24">

          {/* Background video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src="/bannervid.mp4"
          />

          {/* Dark overlay so text is readable */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.65) 100%)" }} />

          {/* Subtle teal glow at center */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full opacity-10"
              style={{ background: "radial-gradient(ellipse, #2abf9e 0%, transparent 70%)" }}
            />
          </div>

          <h1 className="relative mb-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg sm:text-4xl md:mb-5 md:text-6xl">
            Find Your Next Vibe{" "}
            <span style={{ color: "#2abf9e" }}>in Chouf</span>
          </h1>
          <p className="relative mb-7 max-w-xl px-1 text-base leading-relaxed text-slate-200 drop-shadow md:mb-10 md:text-lg">
            Discover the best spots for sports, dining, and nature in the heart of the Lebanese mountains.
          </p>

          {/* Search bar */}
          <div className="relative flex w-full max-w-2xl items-center gap-1.5 rounded-full bg-white p-1.5 shadow-2xl sm:gap-2 md:p-2">
            <Search className="ml-2 flex-shrink-0 text-slate-400 sm:ml-3" size={20} />
            <input
              type="text"
              placeholder="Search for restaurants, trails, sunsets…"
              className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:px-2 md:py-3.5 md:text-base"
            />
            <button
              className="flex-shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all sm:px-5 md:px-7 md:py-3 md:text-base"
              style={{ background: "linear-gradient(135deg, #2abf9e, #1a9e83)" }}
            >
              Explore<span className="hidden sm:inline"> Now</span>
            </button>
          </div>


        </section>


        {/* ── EXPLORE BY INTEREST ── */}
        <section id="categories" className="mx-auto max-w-7xl px-4 py-12 sm:px-5 md:px-8 md:py-16">
          <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Explore by Category</h2>
              <p className="text-slate-500 text-sm mt-1">Browse what the Chouf has to offer</p>
            </div>
            {categories.length > 8 && (
              <a href="#" className="hidden md:flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
                View All <ChevronRight size={16} />
              </a>
            )}
          </div>

          {loading ? (
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:-mx-5 sm:px-5 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-36 min-w-36 animate-pulse rounded-lg bg-white shadow-sm ring-1 ring-slate-100 md:min-w-0" />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3 sm:-mx-5 sm:px-5 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-8">
              {categories.map((cat) => (
                <a
                  key={cat.category_id}
                  href={`#category-${cat.slug}`}
                  className="group flex h-36 min-w-36 snap-start flex-col items-center justify-center rounded-lg border border-slate-100 bg-white px-3 py-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-100 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 md:min-w-0"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 transition-colors duration-300 group-hover:bg-teal-100">
                    <DynamicIcon
                      name={cat.icon_name || "HelpCircle"}
                      className="h-7 w-7 transition-transform duration-300 group-hover:scale-110"
                      style={{ color: "#2abf9e" } as React.CSSProperties}
                    />
                  </div>
                  <h3 className="line-clamp-2 min-h-10 text-sm font-bold leading-tight text-slate-900">{cat.name}</h3>
                  <p className="mt-2 text-xs font-medium text-slate-400">
                    {cat.place_count} {cat.place_count === 1 ? "place" : "places"}
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-slate-100 bg-white py-10 text-center italic text-slate-400 shadow-sm">
              No categories found — add some to your database to see them here.
            </div>
          )}
        </section>

        {/* ── TOP PICKS ── */}
        <section id="picks" className="mx-auto max-w-7xl px-4 py-12 sm:px-5 md:px-8 md:py-16">
          <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Top Picks for Today</h2>
              <p className="text-slate-500 text-sm mt-1">Hand-curated experiences by our local team.</p>
            </div>
            <a href="#" className="hidden md:flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
              View All <ChevronRight size={16} />
            </a>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-72 animate-pulse rounded-lg bg-slate-200" />
              ))}
            </div>
          ) : featuredPicks.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
              {featuredPicks.map((loc) => (
                <div
                  key={loc.location_id}
                  className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative w-full overflow-hidden bg-slate-100" style={{ aspectRatio: "4/3" }}>
                    {loc.main_image_url ? (
                      <img
                        src={loc.main_image_url}
                        alt={loc.name}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0f0f0f, #1a3a2e)" }}>
                        <img src="/logoweb.png" alt="InChouf" className="w-16 h-16 opacity-30" />
                      </div>
                    )}
                    {loc.categories?.name && (
                      <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full px-3 py-1 text-xs font-bold text-white shadow-md" style={{ backgroundColor: "#2abf9e" }}>
                        {loc.categories.name}
                      </span>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-4 md:p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="min-w-0 break-words text-base font-bold leading-snug text-slate-900 md:text-lg">{loc.name}</h3>
                      <div className="flex items-center gap-0.5 text-amber-500 text-xs font-semibold bg-amber-50 px-2 py-0.5 rounded-full flex-shrink-0">
                        <Star size={11} className="fill-current" />
                        4.9
                      </div>
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-slate-500 line-clamp-2">{loc.description}</p>
                    <div className="flex items-start gap-1.5 border-t border-slate-50 pt-3 text-xs text-slate-400">
                      <MapPin size={13} className="mt-0.5 flex-shrink-0" style={{ color: "#2abf9e" }} />
                      <span className="min-w-0 break-words">{loc.address_or_area}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-slate-100 bg-white py-10 text-center italic text-slate-400 shadow-sm">
              No featured picks yet — mark some locations as featured in your database.
            </div>
          )}
        </section>

        {/* ── CTA ── */}
        <section id="cta" className="mx-auto max-w-5xl px-4 py-6 sm:px-5 md:px-8 md:py-10">
          <div
            className="relative overflow-hidden rounded-lg p-6 text-center shadow-2xl sm:p-8 md:p-14"
            style={{ background: "linear-gradient(135deg, #1aab8a 0%, #2abf9e 50%, #22d4ad 100%)" }}
          >
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-5 drop-shadow">
                Own a spot in the mountains?
              </h2>
              <p className="text-white/85 text-base md:text-lg mb-7 md:mb-9 max-w-xl mx-auto leading-relaxed">
                Join InChouf and get discovered by thousands of locals and tourists looking for their next adventure in the Chouf.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row md:gap-4">
                <button
                  className="rounded-full bg-white px-7 py-3 text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95 md:px-9 md:py-3.5 md:text-base"
                  style={{ color: "#1aab8a" }}
                >
                  Get Listed Today
                </button>
                <button className="rounded-full border-2 border-white px-7 py-3 text-sm font-bold text-white transition-all hover:scale-105 hover:bg-white/10 md:px-9 md:py-3.5 md:text-base">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-100 bg-white px-4 py-10 sm:px-5 md:px-8 md:py-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logoweb.png" alt="InChouf pin" className="h-9 w-auto object-contain" />
              <span className="font-extrabold text-xl tracking-tight" style={{ color: "#0f0f0f" }}>
                in<span style={{ color: "#2abf9e" }}>chouf</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
              The definitive guide to the Chouf region — helping you discover the soul of the Lebanese mountains.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              {["About Us", "Contact", "Add a Place", "Privacy Policy"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-teal-600 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">Social</h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              {["Instagram", "Facebook", "Twitter"].map((s) => (
                <li key={s}>
                  <a href="#" className="hover:text-teal-600 transition-colors">{s}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-3">
          <p>© 2026 InChouf. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="cursor-pointer transition-colors hover:text-slate-600">EN</span>
            <span className="cursor-pointer hover:text-slate-600 transition-colors">Share</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
