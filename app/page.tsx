import { FlightSearchForm } from "@/components/search/FlightSearchForm";
import { Plane, Globe2, ShieldCheck, Clock } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col relative w-full h-full min-h-screen">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">

        {/* Abstract Background Decoration */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 opacity-95"></div>
          {/* Subtle patterns/glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-400/30 via-transparent to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center rounded-full border border-brand-300/30 bg-brand-400/10 px-3 py-1 text-sm text-brand-100 backdrop-blur-sm mb-4">
            <Plane className="mr-2 h-4 w-4" />
            <span>Discover the world with SkyBound</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight">
            Where to next?
          </h1>
          <p className="text-lg sm:text-xl text-brand-100 max-w-2xl mx-auto font-light">
            Book your next adventure seamlessly. We search hundreds of airlines to find you the perfect flight.
          </p>
        </div>

        {/* Search Form container */}
        <div className="relative w-full z-20 mt-8">
          <FlightSearchForm />
        </div>
      </div>

      {/* Features Section underneath */}
      <section className="bg-white dark:bg-slate-950 py-24 px-4 sm:px-6 lg:px-8 z-10 relative flex-1">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-2xl bg-brand-50 text-brand-600 dark:bg-slate-900 border border-brand-100 dark:border-slate-800 flex items-center justify-center shadow-sm mb-6">
              <Globe2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Global Coverage</h3>
            <p className="text-slate-500 dark:text-slate-400">Access thousands of flights across the world at unbeatable prices.</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-2xl bg-brand-50 text-brand-600 dark:bg-slate-900 border border-brand-100 dark:border-slate-800 flex items-center justify-center shadow-sm mb-6">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Secure Booking</h3>
            <p className="text-slate-500 dark:text-slate-400">Your payments and personal data are protected by industry-leading security.</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-2xl bg-brand-50 text-brand-600 dark:bg-slate-900 border border-brand-100 dark:border-slate-800 flex items-center justify-center shadow-sm mb-6">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
            <p className="text-slate-500 dark:text-slate-400">Our dedicated travel experts are always here to help you, anytime.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
