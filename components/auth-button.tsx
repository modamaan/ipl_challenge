import { signIn, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export function SignIn({ callbackUrl = "/dashboard" }: { callbackUrl?: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: callbackUrl });
      }}
    >
      <Button type="submit" size="lg" className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95">
        Join the Challenge
      </Button>
    </form>
  )
}


export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <Button type="submit" variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-full">
        Sign out
      </Button>
    </form>
  )
}
