import { useState, useMemo } from 'react'
import {
  Search, ExternalLink, Tag, Leaf, Zap, Sparkles,
  ShowerHead, Baby, Home, Droplets, Package, Filter,
  X, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { products, CATEGORIES, productImageUrl, type Category, type Product } from '../../data/products'

// ── Category config ─────────────────────────────────────────────────────────
const categoryConfig: Record<Category, {
  icon: React.ElementType
  gradient: string
  iconBg: string
  text: string
  pill: string
}> = {
  'Health & Nutrition': { icon: Leaf,       gradient: 'from-emerald-100 to-emerald-50', iconBg: 'bg-emerald-500', text: 'text-emerald-700', pill: 'bg-emerald-100 text-emerald-700' },
  'Energy':             { icon: Zap,        gradient: 'from-amber-100 to-amber-50',     iconBg: 'bg-amber-500',   text: 'text-amber-700',   pill: 'bg-amber-100 text-amber-700' },
  'Beauty':             { icon: Sparkles,   gradient: 'from-pink-100 to-pink-50',       iconBg: 'bg-pink-500',    text: 'text-pink-700',    pill: 'bg-pink-100 text-pink-700' },
  'Personal Care':      { icon: ShowerHead, gradient: 'from-blue-100 to-blue-50',       iconBg: 'bg-blue-500',    text: 'text-blue-700',    pill: 'bg-blue-100 text-blue-700' },
  'Children':           { icon: Baby,       gradient: 'from-violet-100 to-violet-50',   iconBg: 'bg-violet-500',  text: 'text-violet-700',  pill: 'bg-violet-100 text-violet-700' },
  'Home Living':        { icon: Home,       gradient: 'from-cyan-100 to-cyan-50',       iconBg: 'bg-cyan-500',    text: 'text-cyan-700',    pill: 'bg-cyan-100 text-cyan-700' },
  'Home Care':          { icon: Droplets,   gradient: 'from-teal-100 to-teal-50',       iconBg: 'bg-teal-500',    text: 'text-teal-700',    pill: 'bg-teal-100 text-teal-700' },
}

// ── Detail modal ─────────────────────────────────────────────────────────────
function ProductDetail({
  product,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  product: Product
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}) {
  const [imgError, setImgError] = useState(false)
  const cfg = categoryConfig[product.category]
  const Icon = cfg.icon
  const imgSrc = productImageUrl(product.image)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Image hero */}
        <div className={`relative h-56 bg-gradient-to-b ${cfg.gradient} shrink-0 overflow-hidden`}>
          {imgSrc && !imgError ? (
            <img
              src={imgSrc}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-contain p-6 bg-white"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-20 h-20 rounded-3xl ${cfg.iconBg} flex items-center justify-center shadow-xl`}>
                <Icon className="w-10 h-10 text-white" />
              </div>
            </div>
          )}

          {/* Badges */}
          {product.tags.includes('Bestseller') && (
            <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400 text-white shadow">
              ★ Bestseller
            </span>
          )}
          {product.tags.includes('New') && (
            <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-600 text-white shadow">
              New
            </span>
          )}
          <span className={`absolute top-3 right-12 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.pill}`}>
            {product.category}
          </span>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow transition-colors"
          >
            <X className="w-4 h-4 text-slate-700" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Name */}
          <h2 className="text-xl font-bold text-slate-900 leading-snug">{product.name}</h2>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {product.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                <Tag className="w-3 h-3" />{tag}
              </span>
            ))}
          </div>

          {/* Prices */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pricing</p>
            <div className="space-y-3">
              {product.sg && (
                <div className="rounded-2xl border border-slate-100 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <span className="text-base">🇸🇬</span>
                    <span className="text-sm font-semibold text-slate-700">Singapore</span>
                    <span className="text-xs text-slate-400 ml-auto">SKU: {product.sg.sku}</span>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">ABO / APC Price</p>
                      <p className="text-2xl font-bold text-slate-900">S${product.sg.price.abo.toLocaleString('en', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 mb-0.5">Retail Price</p>
                      <p className="text-base text-slate-400 line-through">S${product.sg.price.retail.toLocaleString('en', { minimumFractionDigits: 2 })}</p>
                      <p className="text-xs font-semibold text-emerald-600">
                        Save S${(product.sg.price.retail - product.sg.price.abo).toLocaleString('en', { minimumFractionDigits: 2 })}
                        {' '}({Math.round(((product.sg.price.retail - product.sg.price.abo) / product.sg.price.retail) * 100)}% off)
                      </p>
                    </div>
                    <a
                      href={product.sg.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-xs px-4 py-2 whitespace-nowrap flex items-center gap-1.5 shrink-0"
                    >
                      Buy <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {product.my && (
                <div className="rounded-2xl border border-slate-100 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <span className="text-base">🇲🇾</span>
                    <span className="text-sm font-semibold text-slate-700">Malaysia</span>
                    <span className="text-xs text-slate-400 ml-auto">SKU: {product.my.sku}</span>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">ABO / APC Price</p>
                      <p className="text-2xl font-bold text-slate-900">RM{product.my.price.abo.toLocaleString('en', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 mb-0.5">Retail Price</p>
                      <p className="text-base text-slate-400 line-through">RM{product.my.price.retail.toLocaleString('en', { minimumFractionDigits: 2 })}</p>
                      <p className="text-xs font-semibold text-emerald-600">
                        Save RM{(product.my.price.retail - product.my.price.abo).toLocaleString('en', { minimumFractionDigits: 2 })}
                        {' '}({Math.round(((product.my.price.retail - product.my.price.abo) / product.my.price.retail) * 100)}% off)
                      </p>
                    </div>
                    <a
                      href={product.my.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-xs px-4 py-2 whitespace-nowrap flex items-center gap-1.5 shrink-0"
                    >
                      Buy <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Prev / Next footer */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <button
            onClick={onNext}
            disabled={!hasNext}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Price row ─────────────────────────────────────────────────────────────────
function PriceRow({ flag, country, currency, abo, retail, url }: {
  flag: string; country: string; currency: string; abo: number; retail: number; url: string
}) {
  const save = retail - abo
  const savePct = Math.round((save / retail) * 100)
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={e => e.stopPropagation()}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group/row border border-transparent hover:border-slate-200"
    >
      <span className="text-lg leading-none">{flag}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="font-bold text-slate-900 text-base">{currency}{abo.toLocaleString('en', { minimumFractionDigits: 2 })}</span>
          <span className="text-xs text-slate-400 line-through">{currency}{retail.toLocaleString('en', { minimumFractionDigits: 2 })}</span>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">-{savePct}%</span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">ABO/APC · {country}</p>
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover/row:text-slate-500 transition-colors shrink-0" />
    </a>
  )
}

// ── Product card ──────────────────────────────────────────────────────────────
function ProductCard({
  product,
  market,
  onClick,
}: {
  product: Product
  market: 'both' | 'sg' | 'my'
  onClick: () => void
}) {
  const [imgError, setImgError] = useState(false)
  const cfg = categoryConfig[product.category]
  const Icon = cfg.icon
  const showSG = (market === 'both' || market === 'sg') && !!product.sg
  const showMY = (market === 'both' || market === 'my') && !!product.my
  const imgSrc = productImageUrl(product.image)

  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {/* Image / banner */}
      <div className={`relative h-40 bg-gradient-to-b ${cfg.gradient} overflow-hidden`}>
        {imgSrc && !imgError ? (
          <img
            src={imgSrc}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain p-4 bg-white"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-14 h-14 rounded-2xl ${cfg.iconBg} flex items-center justify-center shadow-md`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
          </div>
        )}
        <span className={`absolute top-2.5 right-2.5 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.pill}`}>
          {product.category}
        </span>
        {product.tags.includes('Bestseller') && (
          <span className="absolute top-2.5 left-2.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-400 text-white shadow-sm">
            ★ Bestseller
          </span>
        )}
        {product.tags.includes('New') && !product.tags.includes('Bestseller') && (
          <span className="absolute top-2.5 left-2.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-600 text-white shadow-sm">
            New
          </span>
        )}
        {/* "View details" hint on hover */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
          <span className="bg-white/90 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow">
            View details
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-1.5">{product.name}</h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{product.description}</p>
        </div>

        <div className="flex flex-wrap gap-1">
          {product.tags.filter(t => t !== 'Bestseller' && t !== 'New').slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-1 border-t border-slate-100 -mx-4 px-2 space-y-0.5">
          {showSG && product.sg && (
            <PriceRow
              flag="🇸🇬" country="Singapore" currency="S$"
              abo={product.sg.price.abo} retail={product.sg.price.retail}
              url={product.sg.url}
            />
          )}
          {showMY && product.my && (
            <PriceRow
              flag="🇲🇾" country="Malaysia" currency="RM"
              abo={product.my.price.abo} retail={product.my.price.retail}
              url={product.my.url}
            />
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
  const [selectedId, setSelectedId] = useState<string | null>(null)

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

  const selectedIdx = selectedId ? filtered.findIndex(p => p.id === selectedId) : -1
  const selectedProduct = selectedIdx >= 0 ? filtered[selectedIdx] : null

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
                      ? `${cfg.pill} border-transparent`
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
            <ProductCard
              key={p.id}
              product={p}
              market={market}
              onClick={() => setSelectedId(p.id)}
            />
          ))}
        </div>
      )}

      {/* Update note */}
      <div className="card bg-brand-50 border-brand-100 py-3">
        <p className="text-xs text-brand-700 text-center">
          To add or update products: edit <code className="bg-brand-100 px-1 rounded">src/data/products.ts</code> and push to <code className="bg-brand-100 px-1 rounded">main</code> — the page updates automatically.
        </p>
      </div>

      {/* Detail modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedId(null)}
          onPrev={() => setSelectedId(filtered[selectedIdx - 1].id)}
          onNext={() => setSelectedId(filtered[selectedIdx + 1].id)}
          hasPrev={selectedIdx > 0}
          hasNext={selectedIdx < filtered.length - 1}
        />
      )}
    </div>
  )
}
