import { AnimatedCarousel } from "@/components/auth/animated-carousel";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full bg-white dark:bg-slate-950">
      {/* Left Column: Gamified Animated Carousel (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-100 dark:bg-slate-900 border-r-2 border-stone-100 dark:border-slate-800 overflow-hidden">
        <AnimatedCarousel />
      </div>

      {/* Right Column: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 relative">
        {children}
      </div>
    </main>
  );
}
