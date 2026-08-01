import Image from "next/image";
import * as LucideIcons from "lucide-react";
import { Search, MapPin, Star, ChevronRight, Bell, User } from "lucide-react";
import { fetchMainCategories, fetchFeaturedPicks } from "@/lib/data";

// Dynamic Icon Component
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  // @ts-ignore - Dynamic key access for Lucide icons
  const Icon = LucideIcons[name] || LucideIcons.HelpCircle;
  return <Icon className={className} />;
};

export default async function Home() {
  const categories = await fetchMainCategories();
  const featuredPicks = await fetchFeaturedPicks();

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar (Mock) */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="text-2xl font-bold text-teal-800 tracking-tight">InChouf</div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="text-teal-700 border-b-2 border-teal-700 pb-1">Explore</a>
            <a href="#" className="hover:text-teal-700 transition-colors pb-1">Categories</a>
            <a href="#" className="hover:text-teal-700 transition-colors pb-1">Top Picks</a>
            <a href="#" className="hover:text-teal-700 transition-colors pb-1">Events</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden md:block bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm">
            Add a Place
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <Bell size={20} />
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <User size={20} />
          </button>
        </div>
      </nav>

      <main className="pb-16">
        {/* Hero Section */}
        <section className="relative px-4 md:px-6 pt-16 md:pt-24 pb-20 md:pb-32 flex flex-col items-center text-center bg-gradient-to-b from-teal-50 to-slate-50">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-4 md:mb-6 max-w-3xl">
            Find Your Next Vibe in Chouf
          </h1>
          <p className="text-base md:text-lg text-slate-600 mb-8 md:mb-10 max-w-2xl px-2">
            Discover the best spots for sports, dining, and nature in the heart of the mountains. From hidden valleys to vibrant mountain peaks.
          </p>
          
          <div className="w-full max-w-2xl shadow-xl rounded-full flex items-center bg-white p-1.5 md:p-2">
            <Search className="text-slate-400 ml-3 md:ml-4 flex-shrink-0" size={20} />
            <input 
              type="text" 
              placeholder="Search for restaurants, sports..." 
              className="flex-1 min-w-0 py-3 md:py-4 px-3 md:px-4 bg-transparent outline-none text-slate-700 text-sm md:text-lg"
            />
            <button className="flex-shrink-0 bg-teal-700 hover:bg-teal-800 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-full text-sm md:text-base font-medium transition-colors shadow-md">
              Explore<span className="hidden sm:inline"> Now</span>
            </button>
          </div>
        </section>

        {/* Explore by Interest */}
        <section className="px-6 py-12 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Explore by Interest</h2>
          
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {categories.map((category) => (
                <div 
                  key={category.category_id} 
                  className="group relative h-48 md:h-64 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-800 to-slate-900 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <DynamicIcon name={category.icon_name} className="text-white mb-3 w-8 h-8 opacity-80 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-white font-bold text-xl">{category.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-500 italic py-8 bg-white rounded-xl text-center shadow-sm">
              No categories found. Add some to your database!
            </div>
          )}
        </section>

        {/* Top Picks for Today */}
        <section className="px-6 py-12 max-w-7xl mx-auto bg-slate-100 rounded-3xl my-8">
          <div className="flex justify-between items-end mb-8 px-2">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Top Picks for Today</h2>
              <p className="text-slate-500 mt-1">Hand-curated experiences by our local team.</p>
            </div>
            <a href="#" className="hidden md:flex items-center text-teal-700 font-medium hover:text-teal-800 transition-colors">
              View All Picks <ChevronRight size={18} className="ml-1" />
            </a>
          </div>
          
          {featuredPicks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {featuredPicks.map((location) => (
                <div key={location.location_id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative aspect-[4/3] sm:aspect-video md:aspect-[4/3] w-full group overflow-hidden">
                    {location.main_image_url ? (
                      <img 
                        src={location.main_image_url} 
                        alt={location.name}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                        <MapPin className="text-slate-400 w-12 h-12" />
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    {location.categories?.name && (
                      <div className="absolute top-4 left-4 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        {location.categories.name}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-slate-900 leading-tight">{location.name}</h3>
                      <div className="flex items-center text-amber-500 text-sm font-medium bg-amber-50 px-2 py-0.5 rounded">
                        <Star size={14} className="fill-current mr-1" />
                        4.9
                      </div>
                    </div>
                    
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                      {location.description}
                    </p>
                    
                    <div className="flex items-center text-slate-400 text-sm pt-4 border-t border-slate-50">
                      <MapPin size={16} className="mr-1.5 text-teal-600" />
                      {location.address_or_area}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-500 italic py-12 bg-white rounded-2xl text-center shadow-sm">
              No featured picks found. Feature some locations in your database!
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="px-4 md:px-6 py-12 md:py-16 max-w-5xl mx-auto mt-8 md:mt-12">
          <div className="bg-teal-800 rounded-3xl p-8 md:p-16 text-center shadow-2xl relative overflow-hidden group">
            {/* Background decorative elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-700 rounded-full blur-3xl opacity-50 pointer-events-none group-hover:bg-teal-600 transition-colors duration-700"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-600 rounded-full blur-3xl opacity-50 pointer-events-none group-hover:bg-teal-500 transition-colors duration-700"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">
                Own a spot in the mountains?
              </h2>
              <p className="text-teal-100 text-base md:text-lg mb-8 md:mb-10 max-w-2xl mx-auto">
                Join the InChouf community and get discovered by thousands of locals and tourists looking for their next destination.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
                <button className="bg-white text-teal-800 font-bold px-6 md:px-8 py-3 md:py-3.5 rounded-full hover:bg-teal-50 hover:scale-105 transition-all shadow-lg text-sm md:text-base">
                  Get Listed Today
                </button>
                <button className="bg-teal-600 border border-teal-500 text-white font-bold px-6 md:px-8 py-3 md:py-3.5 rounded-full hover:bg-teal-500 hover:scale-105 transition-all text-sm md:text-base">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer (Mock) */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="text-2xl font-bold text-teal-800 mb-4">InChouf</div>
            <p className="text-slate-500 text-sm max-w-sm">
              The definitive guide to the Chouf region, helping you discover the soul of the mountains.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-teal-700 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-teal-700 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-teal-700 transition-colors">Add a Place</a></li>
              <li><a href="#" className="hover:text-teal-700 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Social</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-teal-700 transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-teal-700 transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-teal-700 transition-colors">Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
          <p>&copy; 2026 InChouf. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="cursor-pointer hover:text-slate-600 transition-colors">🌍 EN</span>
            <span className="cursor-pointer hover:text-slate-600 transition-colors">Share</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
