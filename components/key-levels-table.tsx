import { KeyLevel } from "@/types/stock";

interface KeyLevelsTableProps {
  levels: KeyLevel[];
}

export function KeyLevelsTable({ levels }: KeyLevelsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Level
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Price
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Context
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {levels.map((level) => (
            <tr key={level.label} className="align-top">
              <td className="px-4 py-4 text-sm font-medium text-slate-950">
                {level.label}
              </td>
              <td className="px-4 py-4 text-sm text-slate-700">{level.value}</td>
              <td className="px-4 py-4 text-sm text-slate-500">{level.context}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
