import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SignIn } from "@/components/auth-button";
import { LandingHero } from "@/components/landing-hero";

export default async function Home() {
  const session = await auth();

  // Redirect users who are already logged in to the dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#0b1326]">
      <LandingHero>
        <SignIn />
        <a href="#" className="text-xs sm:text-sm font-['Space_Grotesk',_sans-serif] font-black uppercase tracking-widest text-[#dae2fd] hover:text-white transition-colors bg-[#131b2e] border border-[#2d3449] hover:border-[#c0c1ff] px-6 py-4 rounded-xl shadow-lg flex items-center justify-center">
          View Live Leaderboard <span aria-hidden="true" className="ml-2 text-[#c0c1ff]">&rarr;</span>
        </a>
      </LandingHero>
    </main>
  );
}
