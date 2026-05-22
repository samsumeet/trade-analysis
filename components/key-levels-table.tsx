import { KeyLevel } from "@/types/stock";

interface KeyLevelsTableProps {
  levels: KeyLevel[];
}

export function KeyLevelsTable({ levels }: KeyLevelsTableProps) {
  return (
    <>
      <div className="grid gap-3 sm:hidden">
        {levels.map((level) => (
          <div
            key={level.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/70"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="min-w-0 text-sm font-semibold text-slate-950 dark:text-slate-50">
                {level.label}
              </p>
              <p className="shrink-0 text-sm font-medium text-slate-700 dark:text-slate-200">
                {level.value}
              </p>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {level.context}
            </p>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/70 sm:block">
        <table className="min-w-[560px] divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                Level
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                Price
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                Context
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {levels.map((level) => (
              <tr key={level.label} className="align-top">
                <td className="px-4 py-4 text-sm font-medium text-slate-950 dark:text-slate-50">
                  {level.label}
                </td>
                <td className="px-4 py-4 text-sm text-slate-700 dark:text-slate-200">{level.value}</td>
                <td className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400">{level.context}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
