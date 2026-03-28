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
    <main className="min-h-screen bg-slate-950">
      <LandingHero>
        <SignIn />
        <a href="#" className="text-sm font-semibold leading-6 text-white hover:text-indigo-300 transition-colors">
          View Live Leaderboard <span aria-hidden="true">→</span>
        </a>
      </LandingHero>
    </main>
  );
}
