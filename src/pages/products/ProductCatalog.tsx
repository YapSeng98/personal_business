import { useState, useMemo, useEffect, useCallback } from 'react'
import {
  Search, X, ChevronLeft, ChevronRight, Filter, Package,
  Leaf, Zap, Sparkles, ShowerHead, Home, Droplets,
  CheckCircle2, Clock, ShoppingBag, Tag, Info,
} from 'lucide-react'
import { products, CATEGORIES, productImageUrl, type Category, type Product } from '../../data/products'

// ── Category config ──────────────────────────────────────────────────────────
const categoryConfig: Record<Category, {
  icon: React.ElementType
  gradient: string
  iconBg: string
  text: string
  pill: string
  border: string
}> = {
  'Health & Nutrition': { icon: Leaf,       gradient: 'from-emerald-50 to-white', iconBg: 'bg-emerald-500', text: 'text-emerald-700', pill: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200' },
  'Energy':             { icon: Zap,        gradient: 'from-amber-50 to-white',   iconBg: 'bg-amber-500',   text: 'text-amber-700',   pill: 'bg-amber-100 text-amber-700',   border: 'border-amber-200' },
  'Beauty':             { icon: Sparkles,   gradient: 'from-pink-50 to-white',    iconBg: 'bg-pink-500',    text: 'text-pink-700',    pill: 'bg-pink-100 text-pink-700',    border: 'border-pink-200' },
  'Personal Care':      { icon: ShowerHead, gradient: 'from-blue-50 to-white',    iconBg: 'bg-blue-500',    text: 'text-blue-700',    pill: 'bg-blue-100 text-blue-700',    border: 'border-blue-200' },
  'Home Living':        { icon: Home,       gradient: 'from-cyan-50 to-white',    iconBg: 'bg-cyan-500',    text: 'text-cyan-700',    pill: 'bg-cyan-100 text-cyan-700',    border: 'border-cyan-200' },
  'Home Care':          { icon: Droplets,   gradient: 'from-teal-50 to-white',    iconBg: 'bg-teal-500',    text: 'text-teal-700',    pill: 'bg-teal-100 text-teal-700',    border: 'border-teal-200' },
}

// ── Detail panel ─────────────────────────────────────────────────────────────
function ProductDetail({
  product,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  index,
  total,
}: {
  product: Product
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
  index: number
  total: number
}) {
  const [imgError, setImgError] = useState(false)
  const cfg = categoryConfig[product.category]
  const Icon = cfg.icon
  const imgSrc = productImageUrl(product.image)

  // Reset imgError when product changes
  useEffect(() => { setImgError(false) }, [product.id])

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && hasPrev) onPrev()
      if (e.key === 'ArrowRight' && hasNext) onNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, onPrev, onNext, hasPrev, hasNext])

  const sgSave = product.sg ? product.sg.price.retail - product.sg.price.abo : 0
  const sgPct = product.sg ? Math.round((sgSave / product.sg.price.retail) * 100) : 0
  const mySave = product.my ? product.my.price.retail - product.my.price.abo : 0
  const myPct = product.my ? Math.round((mySave / product.my.price.retail) * 100) : 0

  return (
    <>
      {/* Backdrop — click to close */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Slide-over panel — right on desktop, bottom sheet on mobile */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[520px] lg:w-[580px] flex flex-col bg-white shadow-2xl">

        {/* ── Header ── */}
        <div className={`shrink-0 bg-gradient-to-br ${cfg.gradient} border-b ${cfg.border}`}>
          {/* Top bar: nav counter + close */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={onPrev}
                disabled={!hasPrev}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/70 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                aria-label="Previous product"
              >
                <ChevronLeft className="w-4 h-4 text-slate-700" />
              </button>
              <span className="text-xs font-medium text-slate-500 tabular-nums">{index + 1} / {total}</span>
              <button
                onClick={onNext}
                disabled={!hasNext}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/70 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                aria-label="Next product"
              >
                <ChevronRight className="w-4 h-4 text-slate-700" />
              </button>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/70 hover:bg-white transition-all shadow-sm"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-slate-700" />
            </button>
          </div>

          {/* Image + badges */}
          <div className="relative flex items-center justify-center h-52 mx-5 mb-5 rounded-2xl overflow-hidden bg-white shadow-sm">
            {imgSrc && !imgError ? (
              <img
                src={imgSrc}
                alt={product.name}
                className="w-full h-full object-contain p-6"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <div className={`w-20 h-20 rounded-3xl ${cfg.iconBg} flex items-center justify-center shadow-xl`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
              </div>
            )}
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.tags.includes('Bestseller') && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400 text-white shadow">
                  ★ Bestseller
                </span>
              )}
              {product.tags.includes('New') && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-600 text-white shadow">
                  New
                </span>
              )}
            </div>
            <span className={`absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.pill}`}>
              {product.category}
            </span>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-6">

            {/* Name */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-snug mb-3">{product.name}</h2>

              {/* Overview — at-a-glance summary */}
              <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-900 leading-relaxed font-medium">{product.overview}</p>
              </div>
            </div>

            {/* Full description */}
            <div>
              <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {product.tags.filter(t => t !== 'Bestseller' && t !== 'New').map(tag => (
                <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                  <Tag className="w-3 h-3" />{tag}
                </span>
              ))}
            </div>

            {/* Benefits */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Key Benefits
              </h3>
              <ul className="space-y-2">
                {product.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </span>
                    <span className="text-sm text-slate-700 leading-snug">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Ingredients */}
            {product.keyIngredients && product.keyIngredients.length > 0 && (
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-3">
                  <Leaf className="w-4 h-4 text-emerald-500" />
                  Key Ingredients
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.keyIngredients.map((ing, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* How to Use */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-2">
                <Package className="w-4 h-4 text-blue-500" />
                How to Use
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed bg-blue-50 rounded-xl px-4 py-3 border border-blue-100">
                {product.howToUse}
              </p>
            </div>

            {/* When to Use */}
            {product.whenToUse && (
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-2">
                  <Clock className="w-4 h-4 text-violet-500" />
                  When to Use
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed bg-violet-50 rounded-xl px-4 py-3 border border-violet-100">
                  {product.whenToUse}
                </p>
              </div>
            )}

            {/* Pricing */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-3">
                <ShoppingBag className="w-4 h-4 text-slate-500" />
                Pricing
              </h3>
              <div className="space-y-3">
                {product.sg && (
                  <div className="rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                      <span className="text-base leading-none">🇸🇬</span>
                      <span className="text-sm font-semibold text-slate-700">Singapore</span>
                      <span className="ml-auto text-xs text-slate-400 font-mono">SKU: {product.sg.sku}</span>
                    </div>
                    <div className="px-4 py-4">
                      <div className="flex items-end justify-between gap-3 mb-3">
                        <div>
                          <p className="text-xs text-slate-400 mb-0.5">ABO / APC Price</p>
                          <p className="text-3xl font-bold text-slate-900 leading-none">
                            S${product.sg.price.abo.toLocaleString('en', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400 line-through mb-0.5">
                            S${product.sg.price.retail.toLocaleString('en', { minimumFractionDigits: 2 })}
                          </p>
                          <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Save {sgPct}%
                          </span>
                        </div>
                      </div>
                      <a
                        href={product.sg.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary w-full text-sm py-2.5 flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Buy Now on Amway SG
                      </a>
                    </div>
                  </div>
                )}

                {product.my && (
                  <div className="rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                      <span className="text-base leading-none">🇲🇾</span>
                      <span className="text-sm font-semibold text-slate-700">Malaysia</span>
                      <span className="ml-auto text-xs text-slate-400 font-mono">SKU: {product.my.sku}</span>
                    </div>
                    <div className="px-4 py-4">
                      <div className="flex items-end justify-between gap-3 mb-3">
                        <div>
                          <p className="text-xs text-slate-400 mb-0.5">ABO / APC Price</p>
                          <p className="text-3xl font-bold text-slate-900 leading-none">
                            RM{product.my.price.abo.toLocaleString('en', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400 line-through mb-0.5">
                            RM{product.my.price.retail.toLocaleString('en', { minimumFractionDigits: 2 })}
                          </p>
                          <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Save {myPct}%
                          </span>
                        </div>
                      </div>
                      <a
                        href={product.my.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary w-full text-sm py-2.5 flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Buy Now on Amway MY
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom spacing */}
            <div className="h-2" />
          </div>
        </div>
      </div>
    </>
  )
}

// ── Price row (card) ─────────────────────────────────────────────────────────
function PriceRow({ flag, currency, abo, retail }: {
  flag: string
  currency: string
  abo: number
  retail: number
}) {
  const savePct = Math.round(((retail - abo) / retail) * 100)
  return (
    <div className="flex items-center gap-2 py-2">
      <span className="text-base leading-none shrink-0">{flag}</span>
      <span className="font-bold text-slate-900 text-sm">{currency}{abo.toLocaleString('en', { minimumFractionDigits: 2 })}</span>
      <span className="text-xs text-slate-400 line-through">{currency}{retail.toLocaleString('en', { minimumFractionDigits: 2 })}</span>
      <span className="ml-auto text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full shrink-0">-{savePct}%</span>
    </div>
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
      className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {/* Image area */}
      <div className="relative h-44 bg-white overflow-hidden rounded-t-2xl border-b border-slate-100">
        {imgSrc && !imgError ? (
          <img
            src={imgSrc}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient} flex items-center justify-center`}>
            <div className={`w-16 h-16 rounded-2xl ${cfg.iconBg} flex items-center justify-center shadow-md`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200 flex items-center justify-center">
          <span className="bg-white/95 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-y-1 group-hover:translate-y-0">
            View Details
          </span>
        </div>
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.tags.includes('Bestseller') && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-400 text-white shadow-sm">
              ★ Bestseller
            </span>
          )}
          {product.tags.includes('New') && !product.tags.includes('Bestseller') && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-600 text-white shadow-sm">
              New
            </span>
          )}
        </div>
        <span className={`absolute top-2.5 right-2.5 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.pill}`}>
          {product.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-1.5">{product.name}</h3>
          <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{product.overview}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {product.tags.filter(t => t !== 'Bestseller' && t !== 'New').slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>

        {/* Price rows */}
        <div className="mt-auto pt-2 border-t border-slate-100 space-y-0">
          {showSG && product.sg && (
            <PriceRow flag="🇸🇬" currency="S$" abo={product.sg.price.abo} retail={product.sg.price.retail} />
          )}
          {showMY && product.my && (
            <PriceRow flag="🇲🇾" currency="RM" abo={product.my.price.abo} retail={product.my.price.retail} />
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
        p.category.toLowerCase().includes(q) ||
        p.benefits.some(b => b.toLowerCase().includes(q))
      return matchCat && matchMarket && matchSearch
    })
  }, [search, category, market])

  const selectedIdx = selectedId ? filtered.findIndex(p => p.id === selectedId) : -1
  const selectedProduct = selectedIdx >= 0 ? filtered[selectedIdx] : null

  const handlePrev = useCallback(() => {
    if (selectedIdx > 0) setSelectedId(filtered[selectedIdx - 1].id)
  }, [selectedIdx, filtered])

  const handleNext = useCallback(() => {
    if (selectedIdx < filtered.length - 1) setSelectedId(filtered[selectedIdx + 1].id)
  }, [selectedIdx, filtered])

  const totalSGProducts = products.filter(p => p.sg).length
  const totalMYProducts = products.filter(p => p.my).length

  // Prevent body scroll when panel open
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [selectedProduct])

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-slate-900">{products.length}</p>
          <p className="text-xs text-slate-400 mt-0.5">Total Products</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-red-500">{totalSGProducts}</p>
          <p className="text-xs text-slate-400 mt-0.5">🇸🇬 Amway SG</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-blue-500">{totalMYProducts}</p>
          <p className="text-xs text-slate-400 mt-0.5">🇲🇾 Amway MY</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="card p-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            className="input-field pl-9 pr-9"
            placeholder="Search products, categories, ingredients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
            >
              <X className="w-3 h-3 text-slate-600" />
            </button>
          )}
        </div>

        {/* Market toggle + category filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Market toggle */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex bg-slate-100 rounded-xl p-1 gap-0.5">
              {(['both', 'sg', 'my'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMarket(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    market === m
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {m === 'both' ? 'All Markets' : m === 'sg' ? '🇸🇬 SG' : '🇲🇾 MY'}
                </button>
              ))}
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setCategory('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                category === 'All'
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              All
            </button>
            {CATEGORIES.map(cat => {
              const cfg = categoryConfig[cat]
              const CatIcon = cfg.icon
              const isActive = category === cat
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    isActive
                      ? `${cfg.pill} ${cfg.border} shadow-sm`
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <CatIcon className="w-3 h-3" />{cat}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Result count + hint */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm text-slate-500">
          Showing <span className="font-semibold text-slate-900">{filtered.length}</span>
          {filtered.length !== products.length && <span className="text-slate-400"> of {products.length}</span>} products
        </p>
        <p className="text-xs text-slate-400 hidden sm:block">ABO/APC = member price · Retail = non-member</p>
      </div>

      {/* Product grid or empty state */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="flex flex-col items-center py-16 gap-3 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Package className="w-8 h-8 text-slate-300" />
            </div>
            <div>
              <p className="font-semibold text-slate-700 mb-1">No products found</p>
              <p className="text-sm text-slate-400">Try adjusting your search or filters.</p>
            </div>
            <button
              className="btn-secondary mt-1"
              onClick={() => { setSearch(''); setCategory('All'); setMarket('both') }}
            >
              Clear filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
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
          To add or update products: edit{' '}
          <code className="bg-brand-100 px-1 rounded">src/data/products.ts</code>{' '}
          and push to <code className="bg-brand-100 px-1 rounded">main</code> — the page updates automatically.
        </p>
      </div>

      {/* Detail panel */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedId(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={selectedIdx > 0}
          hasNext={selectedIdx < filtered.length - 1}
          index={selectedIdx}
          total={filtered.length}
        />
      )}
    </div>
  )
}
