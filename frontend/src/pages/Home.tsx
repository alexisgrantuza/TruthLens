import NavbarDemo from "@/components/NavbarDemo";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-white to-neutral-100 dark:from-black dark:to-neutral-900 text-neutral-900 dark:text-neutral-100">
      <NavbarDemo />

      <main className="px-6 pt-40 pb-24 max-w-5xl mx-auto text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          See the truth with TruthLens
        </h1>
        <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
          Simple, fast, and reliable insights. Explore data, verify claims, and
          make informed decisions with clarity.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            to="/get-started"
            className="px-5 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-medium shadow"
          >
            Get started
          </Link>
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition font-medium"
          >
            Signin
          </Link>
        </div>

        <section className="mt-16 grid sm:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-black/40 backdrop-blur">
            <h3 className="font-semibold mb-2">Accurate</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Built to surface trustworthy information and reduce noise.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-black/40 backdrop-blur">
            <h3 className="font-semibold mb-2">Fast</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Get answers in seconds with an intuitive experience.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-black/40 backdrop-blur">
            <h3 className="font-semibold mb-2">Private</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Your data stays yours. We prioritize privacy and control.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
