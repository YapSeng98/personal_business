interface Props {
  label: string
  variant?: 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'slate'
}

const variants = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  red: 'bg-red-50 text-red-700 ring-red-200',
  yellow: 'bg-amber-50 text-amber-700 ring-amber-200',
  blue: 'bg-blue-50 text-blue-700 ring-blue-200',
  purple: 'bg-violet-50 text-violet-700 ring-violet-200',
  slate: 'bg-slate-50 text-slate-600 ring-slate-200',
}

export default function Badge({ label, variant = 'slate' }: Props) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${variants[variant]}`}>
      {label}
    </span>
  )
}
