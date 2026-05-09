import Link from "next/link";
import { ArrowUpRight, Lightning, Robot } from "@phosphor-icons/react/dist/ssr";

type WorkflowSummary = {
  id: string;
  name: string;
  description: string;
  runsThisMonth: number;
  lastRunAt: string;
  status: "healthy" | "degraded" | "idle";
};

const workflows: WorkflowSummary[] = [
  {
    id: "wf_01HQ8N",
    name: "PR review bot",
    description: "Reviews open PRs in stackform/web. Manual trigger.",
    runsThisMonth: 41,
    lastRunAt: "2026-05-09 11:42",
    status: "healthy",
  },
  {
    id: "wf_01HQ8P",
    name: "Nightly migration audit",
    description: "Schema diff against prod every night at 03:00 UTC.",
    runsThisMonth: 28,
    lastRunAt: "2026-05-09 03:01",
    status: "healthy",
  },
  {
    id: "wf_01HQ8R",
    name: "Slack triage agent",
    description: "Triages new #bugs threads. Webhook trigger.",
    runsThisMonth: 17,
    lastRunAt: "2026-05-08 22:15",
    status: "degraded",
  },
];

const RUNS_USED = workflows.reduce((sum, wf) => sum + wf.runsThisMonth, 0);
const RUNS_CAP = 100;
const USAGE_PERCENT = Math.round((RUNS_USED / RUNS_CAP) * 100);

export default function DashboardPage() {
  const showUpgradePrompt = USAGE_PERCENT >= 80;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-200 font-mono">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="flex items-baseline justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              // dashboard
            </p>
            <h1 className="mt-2 text-2xl font-medium text-zinc-50">
              Workflows
            </h1>
          </div>
          <Link
            href="/workflows/new"
            className="text-xs text-emerald-400 hover:text-emerald-300"
          >
            + new workflow
          </Link>
        </header>

        <section className="mt-10 bg-zinc-900/40 p-6 shadow-[0_0_0_1px_rgba(39,39,42,1)]">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-500">
                runs this month
              </p>
              <p className="mt-2 text-2xl text-zinc-50">
                {RUNS_USED}
                <span className="ml-2 text-sm text-zinc-500">
                  / {RUNS_CAP}
                </span>
              </p>
            </div>
            <span
              className={
                showUpgradePrompt
                  ? "text-xs uppercase tracking-widest text-amber-400"
                  : "text-xs uppercase tracking-widest text-zinc-500"
              }
            >
              {USAGE_PERCENT}%
            </span>
          </div>

          <div className="mt-4 h-1 w-full bg-zinc-800">
            <div
              className={
                showUpgradePrompt ? "h-1 bg-amber-400" : "h-1 bg-emerald-400"
              }
              style={{ width: `${Math.min(USAGE_PERCENT, 100)}%` }}
            />
          </div>

          {showUpgradePrompt ? (
            <div className="mt-5 flex items-center justify-between text-xs text-zinc-400">
              <span>
                You're close to the free tier cap. Pro gives you more headroom.
              </span>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
              >
                see Pro
                <ArrowUpRight size={12} weight="bold" />
              </Link>
            </div>
          ) : null}
        </section>

        <ul className="mt-10 divide-y divide-zinc-900">
          {workflows.map((wf) => (
            <li key={wf.id} className="py-5">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <Robot size={14} className="text-zinc-500" />
                    <span className="text-sm text-zinc-50">{wf.name}</span>
                    <StatusPill status={wf.status} />
                  </div>
                  <p className="mt-1 truncate text-xs text-zinc-500">
                    {wf.description}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm text-zinc-300">
                    <Lightning
                      size={12}
                      weight="bold"
                      className="mr-1 inline text-emerald-400"
                    />
                    {wf.runsThisMonth} runs
                  </p>
                  <p className="text-[11px] text-zinc-600">
                    last: {wf.lastRunAt}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

function StatusPill({ status }: { status: WorkflowSummary["status"] }) {
  const map = {
    healthy: "text-emerald-400",
    degraded: "text-amber-400",
    idle: "text-zinc-500",
  } as const;
  return (
    <span className={`text-[10px] uppercase tracking-widest ${map[status]}`}>
      {status}
    </span>
  );
}
