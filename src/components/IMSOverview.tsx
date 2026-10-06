import { Plus, Clock } from 'lucide-react';
import type { IngredientDeliveryRecord } from '../types/Ingredients';

interface IMSOverviewProps {
  records: IngredientDeliveryRecord[];
  onAddNew: () => void;
  onSelectRecord: (record: IngredientDeliveryRecord) => void;
}

export default function IMSOverview({ records, onAddNew, onSelectRecord }: IMSOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Logistics Intake Overview</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage and track incoming raw material deliveries.</p>
        </div>
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition cursor-pointer shadow-lg shadow-rose-950/50"
        >
          <Plus className="w-4 h-4" />
          <span>New Delivery Entry</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/50 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <th className="p-4">Batch Number</th>
              <th className="p-4">Supplier</th>
              <th className="p-4">Material</th>
              <th className="p-4">Sign-off Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No delivery records found. Click <span className="text-slate-300 font-medium">New Delivery Entry</span> to begin.
                </td>
              </tr>
            ) : (
              records.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-mono text-rose-400">{rec.supplierBatchNumber}</td>
                  <td className="p-4 text-slate-200">{rec.supplierName}</td>
                  <td className="p-4 text-slate-300">{rec.productName}</td>
                  <td className="p-4 font-mono text-slate-400 text-[11px]">{rec.approvedBy}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Clock className="w-3 h-3" /> {rec.approvalStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onSelectRecord(rec)}
                      className="text-xs text-rose-400 hover:text-rose-300 font-medium bg-rose-950/30 hover:bg-rose-950/50 border border-rose-900/40 px-3 py-1 rounded transition cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}