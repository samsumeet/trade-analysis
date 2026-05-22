import { KeyLevel } from "@/types/stock";

interface KeyLevelsTableProps {
  levels: KeyLevel[];
}

export function KeyLevelsTable({ levels }: KeyLevelsTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/70">
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
  );
}
