import { RsvpManager } from "@/app/components/rsvp-manager";
import { Copyright } from "@/app/components/copyright";
import { Logo } from "@/components/icons";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl animate-fade-in-up">
        <header className="mb-8 flex flex-col items-center text-center">
          <Logo className="mb-4 h-16 w-16 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Eventide RSVP
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">
            A simple and elegant way to confirm your attendance. Submit your
            RSVP or look up your existing entry.
          </p>
        </header>

        <RsvpManager />

        <Copyright />
      </div>
    </main>
  );
}
