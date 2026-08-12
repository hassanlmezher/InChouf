import Link from "next/link";
import { ArrowLeft, BadgeCheck, BarChart3, MapPin, Megaphone, Search, Star } from "lucide-react";

const benefits = [
  {
    title: "A dedicated place profile",
    description: "Show your photos, location, category, description, and the details visitors need before they decide to come.",
    icon: MapPin,
  },
  {
    title: "Discovery across InChouf",
    description: "Appear in category browsing, search, and featured sections built for locals and tourists exploring the Chouf.",
    icon: Search,
  },
  {
    title: "More trust before the visit",
    description: "Give people a polished listing they can share, save, and use to understand what makes your place worth visiting.",
    icon: BadgeCheck,
  },
  {
    title: "Promotion opportunities",
    description: "Get access to seasonal highlights, top-pick placements, and campaign slots when you want extra visibility.",
    icon: Megaphone,
  },
];

const included = [
  "Business listing setup",
  "Category placement",
  "Photo and description showcase",
  "Featured-pick eligibility",
  "Visitor-friendly mobile profile",
  "Subscription support and updates",
];

export default function BusinessSubscriptionPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 font-sans sm:px-5 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/#cta" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-600 transition-colors hover:text-teal-700">
          <ArrowLeft size={17} />
          Back
        </Link>

        <section className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-stretch">
          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8 md:p-10">
            <p className="text-sm font-bold uppercase tracking-wide text-teal-600">For Chouf businesses</p>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl md:text-5xl">
              Get discovered by people looking for their next stop in the mountains.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-500 md:text-lg">
              A paid InChouf subscription helps your restaurant, guesthouse, sports venue, trail experience, or local spot show up where visitors are already browsing.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/list-your-place" className="inline-flex items-center justify-center rounded-full bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-teal-700 active:scale-95">
                Get Listed Today
              </Link>
              <Link href="/" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-all hover:border-teal-100 hover:text-teal-700">
                Explore InChouf
              </Link>
            </div>
          </div>

          <aside className="rounded-lg bg-slate-900 p-6 text-white shadow-lg sm:p-8">
            <div className="flex items-center gap-2 text-teal-200">
              <Star className="fill-current" size={19} />
              <span className="text-sm font-bold uppercase tracking-wide">Subscription value</span>
            </div>
            <p className="mt-5 text-4xl font-extrabold">Be easier to find.</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              Your listing gives visitors one clear place to understand what you offer, where you are, and why they should choose you today.
            </p>
            <div className="mt-7 rounded-lg bg-white/10 p-4">
              <div className="flex items-center gap-2 text-teal-100">
                <BarChart3 size={18} />
                <span className="text-sm font-bold">Built for visibility</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                InChouf organizes places by intent, category, and local discovery instead of leaving your business hidden in scattered posts.
              </p>
            </div>
          </aside>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <article key={benefit.title} className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                  <Icon size={21} />
                </div>
                <h2 className="mt-4 text-base font-bold leading-snug text-slate-900">{benefit.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{benefit.description}</p>
              </article>
            );
          })}
        </section>

        <section className="mt-8 rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">What your subscription includes</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
                Start with the essentials visitors expect, then grow into more promotional options as InChouf expands.
              </p>
            </div>
            <Link href="/list-your-place" className="inline-flex shrink-0 items-center justify-center rounded-full bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-teal-700 active:scale-95">
              Get Listed Today
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {included.map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                <BadgeCheck className="shrink-0 text-teal-600" size={18} />
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
