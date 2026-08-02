"use client";

import { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import { Search, MapPin, Star, ChevronRight, Bell, User, Menu, X } from "lucide-react";
import { fetchMainCategories, fetchFeaturedPicks, Category, LocationWithCategory } from "@/lib/data";

// Dynamically resolve Lucide icon by name string
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const Icon = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[name] || LucideIcons.HelpCircle;
  return <Icon className={className} />;
};

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredPicks, setFeaturedPicks] = useState<LocationWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── NAVBAR ── */}
      <nav className="flex items-center justify-between px-5 md:px-8 py-3 bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100">

        {/* Logo */}
        <a href="/" className="flex-shrink-0 flex items-center gap-2.5">
          <img
            src="/logoweb.png"
            alt="InChouf pin"
            className="h-9 md:h-10 w-auto object-contain"
          />
          <span className="font-extrabold text-xl md:text-2xl tracking-tight" style={{ color: "#0f0f0f" }}>
            in<span style={{ color: "#2abf9e" }}>chouf</span>
          </span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-7 text-sm font-medium text-slate-600">
          <a href="#explore" className="text-teal-600 border-b-2 border-teal-500 pb-0.5 transition-colors">Explore</a>
          <a href="#categories" className="hover:text-teal-600 transition-colors">Categories</a>
          <a href="#picks" className="hover:text-teal-600 transition-colors">Top Picks</a>
          <a href="#cta" className="hover:text-teal-600 transition-colors">List Your Place</a>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <button className="hidden md:block bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm">
            Add a Place
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors hidden md:flex">
            <Bell size={19} />
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors hidden md:flex">
            <User size={19} />
          </button>
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
        <div className="md:hidden bg-white border-b border-slate-100 shadow-lg z-40 px-5 py-4 flex flex-col gap-4">
          <a href="#explore" className="text-teal-600 font-semibold text-base" onClick={() => setMobileMenuOpen(false)}>Explore</a>
          <a href="#categories" className="text-slate-700 font-medium text-base" onClick={() => setMobileMenuOpen(false)}>Categories</a>
          <a href="#picks" className="text-slate-700 font-medium text-base" onClick={() => setMobileMenuOpen(false)}>Top Picks</a>
          <a href="#cta" className="text-slate-700 font-medium text-base" onClick={() => setMobileMenuOpen(false)}>List Your Place</a>
          <button className="w-full bg-teal-600 text-white py-2.5 rounded-full font-semibold mt-1">
            Add a Place
          </button>
        </div>
      )}

      <main id="explore" className="pb-16">

        {/* ── HERO ── */}
        <section className="relative flex flex-col items-center text-center px-5 pt-14 pb-20 md:pt-24 md:pb-32 overflow-hidden min-h-[85vh] justify-center">

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

          <h1 className="relative text-3xl sm:text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 md:mb-5 max-w-3xl leading-tight drop-shadow-lg">
            Find Your Next Vibe{" "}
            <span style={{ color: "#2abf9e" }}>in Chouf</span>
          </h1>
          <p className="relative text-base md:text-lg text-slate-200 mb-8 md:mb-10 max-w-xl px-2 leading-relaxed drop-shadow">
            Discover the best spots for sports, dining, and nature in the heart of the Lebanese mountains.
          </p>

          {/* Search bar */}
          <div className="relative w-full max-w-2xl flex items-center bg-white rounded-full shadow-2xl p-1.5 md:p-2 gap-2">
            <Search className="text-slate-400 ml-3 flex-shrink-0" size={20} />
            <input
              type="text"
              placeholder="Search for restaurants, trails, sunsets…"
              className="flex-1 min-w-0 py-2.5 md:py-3.5 px-2 bg-transparent outline-none text-slate-700 text-sm md:text-base placeholder:text-slate-400"
            />
            <button
              className="flex-shrink-0 text-white px-5 md:px-7 py-2.5 md:py-3 rounded-full text-sm md:text-base font-semibold transition-all shadow-md"
              style={{ background: "linear-gradient(135deg, #2abf9e, #1a9e83)" }}
            >
              Explore<span className="hidden sm:inline"> Now</span>
            </button>
          </div>


        </section>


        {/* ── EXPLORE BY INTEREST ── */}
        <section id="categories" className="px-5 md:px-8 py-12 md:py-16 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Explore by Interest</h2>
              <p className="text-slate-500 text-sm mt-1">Browse what the Chouf has to offer</p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-44 md:h-60 rounded-2xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {categories.map((cat) => (
                <div
                  key={cat.category_id}
                  className="group relative h-44 md:h-60 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
                  style={{ background: "linear-gradient(145deg, #0f0f0f, #1a3a2e)" }}
                >
                  {/* Teal glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                    style={{ background: "radial-gradient(ellipse at bottom, #2abf9e, transparent)" }}
                  />
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <DynamicIcon
                      name={cat.icon_name}
                      className="w-7 h-7 mb-2.5 opacity-80 group-hover:scale-110 transition-transform duration-300"
                      style={{ color: "#2abf9e" } as React.CSSProperties}
                    />
                    <h3 className="text-white font-bold text-lg md:text-xl leading-tight">{cat.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-400 italic py-10 bg-white rounded-2xl text-center shadow-sm border border-slate-100">
              No categories found — add some to your database to see them here.
            </div>
          )}
        </section>

        {/* ── TOP PICKS ── */}
        <section id="picks" className="px-5 md:px-8 py-12 md:py-16 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Top Picks for Today</h2>
              <p className="text-slate-500 text-sm mt-1">Hand-curated experiences by our local team.</p>
            </div>
            <a href="#" className="hidden md:flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
              View All <ChevronRight size={16} />
            </a>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl bg-slate-200 animate-pulse h-72" />
              ))}
            </div>
          ) : featuredPicks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
              {featuredPicks.map((loc) => (
                <div
                  key={loc.location_id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100"
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
                      <span className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md" style={{ backgroundColor: "#2abf9e" }}>
                        {loc.categories.name}
                      </span>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-4 md:p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-base md:text-lg text-slate-900 leading-snug">{loc.name}</h3>
                      <div className="flex items-center gap-0.5 text-amber-500 text-xs font-semibold bg-amber-50 px-2 py-0.5 rounded-full flex-shrink-0">
                        <Star size={11} className="fill-current" />
                        4.9
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">{loc.description}</p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-3 border-t border-slate-50">
                      <MapPin size={13} style={{ color: "#2abf9e" }} />
                      {loc.address_or_area}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-400 italic py-10 bg-white rounded-2xl text-center shadow-sm border border-slate-100">
              No featured picks yet — mark some locations as featured in your database.
            </div>
          )}
        </section>

        {/* ── CTA ── */}
        <section id="cta" className="px-5 md:px-8 py-6 md:py-10 max-w-5xl mx-auto">
          <div
            className="rounded-3xl p-8 md:p-14 text-center shadow-2xl relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0f0f0f 0%, #0d3d30 60%, #1a1a1a 100%)" }}
          >
            {/* Glow blobs */}
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-25 pointer-events-none"
              style={{ backgroundColor: "#2abf9e" }} />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full blur-3xl opacity-15 pointer-events-none"
              style={{ backgroundColor: "#2abf9e" }} />

            {/* Logo watermark */}
            <div className="relative z-10 mb-5 flex justify-center">
              <img src="/logoweb.png" alt="InChouf" className="w-14 md:w-16 opacity-50" style={{ filter: "brightness(0) invert(1)" }} />
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-5">
                Own a spot in the mountains?
              </h2>
              <p className="text-slate-300 text-base md:text-lg mb-7 md:mb-9 max-w-xl mx-auto leading-relaxed">
                Join InChouf and get discovered by thousands of locals and tourists looking for their next adventure in the Chouf.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
                <button
                  className="font-bold px-7 md:px-9 py-3 md:py-3.5 rounded-full text-sm md:text-base transition-all shadow-lg hover:scale-105 active:scale-95"
                  style={{ background: "#2abf9e", color: "#fff" }}
                >
                  Get Listed Today
                </button>
                <button className="border border-slate-600 text-white font-bold px-7 md:px-9 py-3 md:py-3.5 rounded-full text-sm md:text-base hover:border-teal-500 hover:scale-105 transition-all">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-slate-100 py-10 md:py-14 px-5 md:px-8">
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
            <span className="cursor-pointer hover:text-slate-600 transition-colors">🌍 EN</span>
            <span className="cursor-pointer hover:text-slate-600 transition-colors">Share</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
