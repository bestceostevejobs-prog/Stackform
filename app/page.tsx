import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-200 font-mono">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <p className="text-xs uppercase tracking-widest text-zinc-500">
          // stackform
        </p>
        <h1 className="mt-3 text-3xl font-medium text-zinc-50">
          AI agent workflows your team can audit.
        </h1>
        <p className="mt-4 max-w-xl text-sm text-zinc-400">
          Describe a task. Stackform picks the right agents, runs them, and
          writes everything to durable logs you can come back to.
        </p>

        <div className="mt-10 flex flex-wrap gap-3 text-sm">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-zinc-900 px-4 py-2.5 text-zinc-200 shadow-[0_0_0_1px_rgba(63,63,70,1)] hover:bg-zinc-800"
          >
            Open dashboard
            <ArrowRight size={14} weight="bold" />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-emerald-400 hover:text-emerald-300"
          >
            See pricing
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
      </div>
    </main>
  );
}
