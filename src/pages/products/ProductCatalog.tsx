import { useState, useMemo } from 'react'
import {
  Search, ExternalLink, Tag, Leaf, Zap, Sparkles,
  ShowerHead, Baby, Home, Droplets, Package, Filter,
} from 'lucide-react'
import { products, CATEGORIES, type Category, type Product } from '../../data/products'

// ── Category config ─────────────────────────────────────────────────────────
const categoryConfig: Record<Category, { icon: React.ElementType; bg: string; text: string; border: string }> = {
  'Health & Nutrition': { icon: Leaf,      bg: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-200' },
  'Energy':             { icon: Zap,       bg: 'bg-amber-50',    text: 'text-amber-700',   border: 'border-amber-200' },
  'Beauty':             { icon: Sparkles,  bg: 'bg-pink-50',     text: 'text-pink-700',    border: 'border-pink-200' },
  'Personal Care':      { icon: ShowerHead,bg: 'bg-blue-50',     text: 'text-blue-700',    border: 'border-blue-200' },
  'Children':           { icon: Baby,      bg: 'bg-violet-50',   text: 'text-violet-700',  border: 'border-violet-200' },
  'Home Living':        { icon: Home,      bg: 'bg-cyan-50',     text: 'text-cyan-700',    border: 'border-cyan-200' },
  'Home Care':          { icon: Droplets,  bg: 'bg-teal-50',     text: 'text-teal-700',    border: 'border-teal-200' },
}

// ── Price badge ──────────────────────────────────────────────────────────────
function PriceBadge({ label, currency, abo, retail }: {
  label: string; currency: string; abo: number; retail: number
}) {
  return (
    <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50 p-3">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{label}</p>
      <div className="space-y-1">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-slate-500">ABO/APC</span>
          <span className="font-bold text-slate-900 text-sm">
            {currency} {abo.toLocaleString('en', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-slate-400">Retail</span>
          <span className="text-xs text-slate-500 line-through">
            {currency} {retail.toLocaleString('en', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex items-baseline justify-end">
          <span className="text-xs font-medium text-emerald-600">
            Save {currency} {(retail - abo).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Product card ─────────────────────────────────────────────────────────────
function ProductCard({ product, market }: { product: Product; market: 'both' | 'sg' | 'my' }) {
  const [imgError, setImgError] = useState(false)
  const cfg = categoryConfig[product.category]
  const Icon = cfg.icon
  const showSG = (market === 'both' || market === 'sg') && !!product.sg
  const showMY = (market === 'both' || market === 'my') && !!product.my

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden group">
      {/* Image / Icon area */}
      <div className={`relative h-44 flex items-center justify-center ${cfg.bg} overflow-hidden`}>
        {product.image && !imgError ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className={`w-16 h-16 rounded-2xl bg-white/60 flex items-center justify-center shadow-sm`}>
              <Icon className={`w-8 h-8 ${cfg.text}`} />
            </div>
          </div>
        )}
        {/* Category pill */}
        <div className={`absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white/80 backdrop-blur-sm text-xs font-medium ${cfg.text} border ${cfg.border}`}>
          <Icon className="w-3 h-3" />
          {product.category}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2">{product.name}</h3>
          <p className="text-xs text-slate-500 mt-1.5 line-clamp-3 leading-relaxed">{product.description}</p>
        </div>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs">
                <Tag className="w-2.5 h-2.5" />{tag}
              </span>
            ))}
          </div>
        )}

        {/* Prices */}
        <div className="flex gap-2 mt-auto">
          {showSG && (
            <PriceBadge label="🇸🇬 SG" currency="S$" abo={product.sg!.price.abo} retail={product.sg!.price.retail} />
          )}
          {showMY && (
            <PriceBadge label="🇲🇾 MY" currency="RM" abo={product.my!.price.abo} retail={product.my!.price.retail} />
          )}
        </div>

        {/* Links */}
        <div className="flex gap-2 pt-1">
          {showSG && product.sg?.url && (
            <a
              href={product.sg.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-3 h-3" /> Amway SG
            </a>
          )}
          {showMY && product.my?.url && (
            <a
              href={product.my.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-3 h-3" /> Amway MY
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ProductCatalog() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Category | 'All'>('All')
  const [market, setMarket] = useState<'both' | 'sg' | 'my'>('both')

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchCat = category === 'All' || p.category === category
      const matchMarket =
        market === 'both' ||
        (market === 'sg' && !!p.sg) ||
        (market === 'my' && !!p.my)
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      return matchCat && matchMarket && matchSearch
    })
  }, [search, category, market])

  const totalSGProducts = products.filter(p => p.sg).length
  const totalMYProducts = products.filter(p => p.my).length

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-slate-900">{products.length}</p>
          <p className="text-xs text-slate-400 mt-0.5">Total Products</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-red-600">{totalSGProducts}</p>
          <p className="text-xs text-slate-400 mt-0.5">🇸🇬 Amway SG</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-blue-600">{totalMYProducts}</p>
          <p className="text-xs text-slate-400 mt-0.5">🇲🇾 Amway MY</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="input-field pl-9"
            placeholder="Search products, categories, tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Market filter */}
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
              {(['both', 'sg', 'my'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMarket(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                    market === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {m === 'both' ? 'All Markets' : m === 'sg' ? '🇸🇬 SG' : '🇲🇾 MY'}
                </button>
              ))}
            </div>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setCategory('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                category === 'All'
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              All
            </button>
            {CATEGORIES.map(cat => {
              const cfg = categoryConfig[cat]
              const CatIcon = cfg.icon
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                    category === cat
                      ? `${cfg.bg} ${cfg.text} ${cfg.border}`
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <CatIcon className="w-3 h-3" />{cat}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing <span className="font-semibold text-slate-900">{filtered.length}</span> of {products.length} products
        </p>
        <p className="text-xs text-slate-400">Prices: ABO/APC member price · Retail for non-members</p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="flex flex-col items-center py-16 gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Package className="w-7 h-7 text-slate-300" />
            </div>
            <p className="font-semibold text-slate-600">No products found</p>
            <p className="text-sm text-slate-400">Try adjusting your search or filters.</p>
            <button className="btn-secondary mt-1" onClick={() => { setSearch(''); setCategory('All'); setMarket('both') }}>
              Clear filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} market={market} />
          ))}
        </div>
      )}

      {/* Update note */}
      <div className="card bg-brand-50 border-brand-100 py-3">
        <p className="text-xs text-brand-700 text-center">
          To add or update products: edit <code className="bg-brand-100 px-1 rounded">src/data/products.ts</code> and push to <code className="bg-brand-100 px-1 rounded">main</code> — the page updates automatically.
        </p>
      </div>
    </div>
  )
}
