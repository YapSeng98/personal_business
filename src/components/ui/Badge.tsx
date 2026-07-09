interface Props {
  label: string
  variant?: 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'slate'
}

const variants = {
  green: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/25',
  red: 'bg-red-500/15 text-red-300 ring-red-400/25',
  yellow: 'bg-amber-500/15 text-amber-300 ring-amber-400/25',
  blue: 'bg-blue-500/15 text-blue-300 ring-blue-400/25',
  purple: 'bg-violet-500/15 text-violet-300 ring-violet-400/25',
  slate: 'bg-white/[0.06] text-slate-300 ring-white/15',
}

export default function Badge({ label, variant = 'slate' }: Props) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${variants[variant]}`}>
      {label}
    </span>
  )
}
