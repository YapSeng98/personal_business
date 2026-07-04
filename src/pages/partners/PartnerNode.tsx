import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { Partner } from '../../types'

const statusDot: Record<string, string> = {
  active: 'bg-emerald-500',
  inactive: 'bg-slate-400',
  prospect: 'bg-amber-500',
}

export default function PartnerNode({ data }: NodeProps) {
  const partner = data.partner as Partner
  const unassigned = data.unassigned as boolean

  return (
    <div
      className={`rounded-xl border-2 bg-white shadow-md px-3.5 py-2.5 w-[220px] ${
        unassigned ? 'border-dashed border-amber-300' : 'border-slate-200'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-brand-400 !w-2 !h-2" />
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-xs shrink-0 relative">
          {partner.u_name?.charAt(0)?.toUpperCase() || '?'}
          <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${statusDot[partner.u_status] ?? 'bg-slate-400'}`} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{partner.u_name}</p>
          <p className="text-xs text-slate-400 truncate capitalize">
            {partner.u_rank || partner.u_network_position.replace('_', '-')}
          </p>
        </div>
      </div>
      {unassigned && (
        <span className="mt-1.5 inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
          Unassigned
        </span>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-brand-400 !w-2 !h-2" />
    </div>
  )
}
