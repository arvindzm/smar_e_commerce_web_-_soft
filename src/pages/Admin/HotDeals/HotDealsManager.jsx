import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  Flame,
  Image as ImageIcon,
  Layers,
  Percent,
  Play,
  Plus,
  Receipt,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Truck,
  Upload,
  X,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import AdminPageHeader from '../../../components/Admin/AdminPageHeader'
import ImageUploader from '../../../components/Admin/ImageUploader'
import OfferBanner from '../../../components/Banner/OfferBanner'
import { tones } from '../../../components/Banner/tones'
import AssetImage from '../../../components/common/AssetImage'
import Badge from '../../../components/common/Badge'
import Button from '../../../components/common/Button'
import Countdown from '../../../components/common/Countdown'
import EmptyState from '../../../components/common/EmptyState'
import { Input, Textarea } from '../../../components/common/FormField'
import Loader from '../../../components/common/Loader'
import Price from '../../../components/common/Price'
import ProgressBar from '../../../components/common/ProgressBar'
import Rating from '../../../components/common/Rating'
import { useFetch } from '../../../hooks/useFetch'
import { usePageTitle } from '../../../hooks/usePageTitle'
import { useToast } from '../../../hooks/useToast'
import {
  defaultDeliverySettings,
  getDeliverySettings,
  getOfferBanners,
  initialOfferBanners,
  replaceOfferBanners,
  resetOfferBanners,
  updateDeliverySettings,
} from '../../../services/bannerService'
import {
  defaultTaxSettings,
  getTaxSettings,
  updateTaxSettings,
} from '../../../services/taxService'
import { getCategories } from '../../../services/categoryService'
import {
  getFeaturedSettings,
  getHotDealSettings,
  getWeeklyDealSettings,
  resetFeaturedSettings,
  resetHotDealSettings,
  resetWeeklyDealSettings,
  updateFeaturedSettings,
  updateHotDealSettings,
  updateWeeklyDealSettings,
} from '../../../services/dealService'
import { getProducts } from '../../../services/productService'
import { cn } from '../../../utils/cn'
import { discountPercent, formatPrice } from '../../../utils/formatPrice'
import { getDefaultPack } from '../../../utils/product'

function toDatetimeLocal(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return ''
    const offset = d.getTimezoneOffset() * 60000
    const local = new Date(d.getTime() - offset)
    return local.toISOString().slice(0, 16)
  } catch {
    return ''
  }
}

function fromDatetimeLocal(localStr) {
  if (!localStr) return new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
  try {
    return new Date(localStr).toISOString()
  } catch {
    return new Date().toISOString()
  }
}

function getDurationFromEndsAt(isoString) {
  if (!isoString) return { days: 2, hours: 0, minutes: 0, isExpired: false }
  const diffMs = new Date(isoString).getTime() - Date.now()
  if (diffMs <= 0) return { days: 0, hours: 0, minutes: 0, isExpired: true }
  const totalMinutes = Math.floor(diffMs / (60 * 1000))
  const days = Math.floor(totalMinutes / (24 * 60))
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60)
  const minutes = totalMinutes % 60
  return { days, hours, minutes, isExpired: false }
}

function getEndsAtFromDuration(days = 0, hours = 0, minutes = 0) {
  const d = new Date()
  const totalMs =
    (Number(days) * 24 * 60 * 60 + Number(hours) * 60 * 60 + Number(minutes) * 60) * 1000
  d.setTime(d.getTime() + totalMs)
  return d.toISOString()
}

function formatEndsAtFriendly(isoString) {
  if (!isoString) return ''
  try {
    const d = new Date(isoString)
    if (isNaN(d.getTime())) return ''
    return d.toLocaleString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

export default function HotDealsManager() {
  usePageTitle('Promotions & Banners')
  const showToast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  const defaultTab = location.pathname.includes('/banners') ? 'delivery-banners' : 'hot-deals'
  const activeTab = searchParams.get('tab') || defaultTab
  const setActiveTab = (tab) => setSearchParams({ tab })

  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const dealRequest = useFetch(getHotDealSettings)
  const weeklyRequest = useFetch(getWeeklyDealSettings)
  const featuredRequest = useFetch(getFeaturedSettings)
  const deliveryRequest = useFetch(getDeliverySettings)
  const taxRequest = useFetch(getTaxSettings)
  const bannersRequest = useFetch(getOfferBanners)
  const productsRequest = useFetch(() => getProducts({ includeHidden: true }))
  const categoriesRequest = useFetch(() => getCategories({ includeHidden: true }))

  // TAB 1: Hot Deals state
  const [form, setForm] = useState({
    enabled: true,
    tag: '',
    title: '',
    text: '',
    endsAt: '',
    durationDays: 2,
    durationHours: 0,
    durationMinutes: 0,
    autoRenew: false,
    link: '/shop',
    image: 'banners/Deal of the Day.png',
    productMode: 'auto',
    productIds: [],
    dealPrices: {},
  })

  // TAB 2: Weekly Deal state
  const [weeklyForm, setWeeklyForm] = useState({
    enabled: true,
    title: 'Deal of the week',
    subtitle: "Don't miss this opportunity at a special price.",
    productId: '',
    endsAt: '',
    durationDays: 6,
    durationHours: 0,
    durationMinutes: 0,
    autoRenew: true,
    offerPrice: '',
    regularPrice: '',
  })

  // TAB 3: Featured Products state
  const [featuredForm, setFeaturedForm] = useState({
    enabled: true,
    title: 'Featured Products',
    productMode: 'auto',
    productIds: [],
  })

  // TAB 4: Delivery Settings & Offer Banners state
  const [deliveryForm, setDeliveryForm] = useState(defaultDeliverySettings)
  const [taxForm, setTaxForm] = useState(defaultTaxSettings)
  const [bannersList, setBannersList] = useState(initialOfferBanners)
  const [editingBanner, setEditingBanner] = useState(null)
  const [isNewBanner, setIsNewBanner] = useState(false)
  const [previewViewport, setPreviewViewport] = useState('desktop')

  // Synchronize Tab 1 data
  useEffect(() => {
    if (dealRequest.data) {
      const endsAtIso =
        dealRequest.data.endsAt || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      const dur = getDurationFromEndsAt(endsAtIso)

      setForm({
        enabled: dealRequest.data.enabled !== false,
        tag: dealRequest.data.tag || 'Limited time',
        title: dealRequest.data.title || 'Deals of the day',
        text: dealRequest.data.text || 'Save more on kitchen essentials',
        endsAt: toDatetimeLocal(endsAtIso),
        durationDays:
          dealRequest.data.durationDays !== undefined ? dealRequest.data.durationDays : dur.days || 2,
        durationHours:
          dealRequest.data.durationHours !== undefined
            ? dealRequest.data.durationHours
            : dur.hours || 0,
        durationMinutes:
          dealRequest.data.durationMinutes !== undefined
            ? dealRequest.data.durationMinutes
            : dur.minutes || 0,
        autoRenew: Boolean(dealRequest.data.autoRenew),
        link: dealRequest.data.link || '/shop',
        image: dealRequest.data.image || 'banners/Deal of the Day.png',
        productMode: dealRequest.data.productMode || 'auto',
        productIds: Array.isArray(dealRequest.data.productIds) ? dealRequest.data.productIds : [],
        dealPrices:
          dealRequest.data.dealPrices && typeof dealRequest.data.dealPrices === 'object'
            ? dealRequest.data.dealPrices
            : {},
      })
    }
  }, [dealRequest.data])

  // Synchronize Tab 2 (Weekly Deal) data
  useEffect(() => {
    if (weeklyRequest.data) {
      const endsAtIso =
        weeklyRequest.data.endsAt || new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString()
      const dur = getDurationFromEndsAt(endsAtIso)

      setWeeklyForm({
        enabled: weeklyRequest.data.enabled !== false,
        title: weeklyRequest.data.title || 'Deal of the week',
        subtitle:
          weeklyRequest.data.subtitle || "Don't miss this opportunity at a special price.",
        productId: weeklyRequest.data.productId || '',
        endsAt: toDatetimeLocal(endsAtIso),
        durationDays:
          weeklyRequest.data.durationDays !== undefined
            ? weeklyRequest.data.durationDays
            : dur.days || 6,
        durationHours:
          weeklyRequest.data.durationHours !== undefined
            ? weeklyRequest.data.durationHours
            : dur.hours || 0,
        durationMinutes:
          weeklyRequest.data.durationMinutes !== undefined
            ? weeklyRequest.data.durationMinutes
            : dur.minutes || 0,
        autoRenew: weeklyRequest.data.autoRenew !== false,
        offerPrice: weeklyRequest.data.offerPrice || '',
        regularPrice: weeklyRequest.data.regularPrice || '',
      })
    }
  }, [weeklyRequest.data])

  // Synchronize Tab 3 (Featured) data
  useEffect(() => {
    if (featuredRequest.data) {
      setFeaturedForm({
        enabled: featuredRequest.data.enabled !== false,
        title: featuredRequest.data.title || 'Featured Products',
        productMode: featuredRequest.data.productMode || 'auto',
        productIds: Array.isArray(featuredRequest.data.productIds)
          ? featuredRequest.data.productIds
          : [],
      })
    }
  }, [featuredRequest.data])

  // Synchronize Tab 4 (Delivery, GST & Banners) data
  useEffect(() => {
    if (deliveryRequest.data) {
      setDeliveryForm({
        enabled: deliveryRequest.data.enabled !== false,
        freeDeliveryAbove:
          deliveryRequest.data.freeDeliveryAbove !== undefined
            ? deliveryRequest.data.freeDeliveryAbove
            : (defaultDeliverySettings.freeDeliveryAbove || 700),
        deliveryCharge:
          deliveryRequest.data.deliveryCharge !== undefined
            ? deliveryRequest.data.deliveryCharge
            : defaultDeliverySettings.deliveryCharge,
        title: deliveryRequest.data.title || defaultDeliverySettings.title,
        text: deliveryRequest.data.text || defaultDeliverySettings.text,
      })
    }
  }, [deliveryRequest.data])

  useEffect(() => {
    if (taxRequest.data) {
      setTaxForm({
        enabled: taxRequest.data.enabled !== false,
        gstRate: taxRequest.data.gstRate !== undefined ? Number(taxRequest.data.gstRate) : 5,
        taxName: taxRequest.data.taxName || 'GST',
        gstNumber: taxRequest.data.gstNumber || '09AAACH7409R1ZZ',
        showOnInvoice: taxRequest.data.showOnInvoice !== false,
      })
    }
  }, [taxRequest.data])

  useEffect(() => {
    if (Array.isArray(bannersRequest.data) && bannersRequest.data.length > 0) {
      setBannersList(bannersRequest.data)
    }
  }, [bannersRequest.data])

  const products = productsRequest.data || []
  const categories = categoriesRequest.data || []
  const productMap = useMemo(() => new Map(products.map((p) => [p.id, p])), [products])

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !search.trim() ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory
      return matchesSearch && matchesCat
    })
  }, [products, search, selectedCategory])

  // Hot deals selected & preview
  const hotDealSelectedProducts = useMemo(() => {
    return form.productIds.map((id) => productMap.get(id)).filter(Boolean)
  }, [form.productIds, productMap])

  const topSellingProducts = useMemo(() => {
    return [...products].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 8)
  }, [products])

  const hotDealPreviewProducts = useMemo(() => {
    const list =
      form.productMode === 'manual' && hotDealSelectedProducts.length > 0
        ? hotDealSelectedProducts
        : topSellingProducts

    return list.map((p) => {
      const defaultPack = getDefaultPack(p)
      const cfg = form.dealPrices[p.id]
      const offer = typeof cfg === 'object' ? Number(cfg.offerPrice) : Number(cfg)
      const regular =
        typeof cfg === 'object' && cfg.regularPrice
          ? Number(cfg.regularPrice)
          : defaultPack.regularPrice

      if (offer && offer > 0) {
        return {
          ...p,
          previewSalePrice: offer,
          previewRegularPrice: regular > offer ? regular : defaultPack.regularPrice,
        }
      }
      return {
        ...p,
        previewSalePrice: defaultPack.salePrice,
        previewRegularPrice: defaultPack.regularPrice,
      }
    })
  }, [form.productMode, hotDealSelectedProducts, topSellingProducts, form.dealPrices])

  // Weekly deal active product calculation
  const weeklySelectedProduct = useMemo(() => {
    if (weeklyForm.productId) {
      return productMap.get(weeklyForm.productId)
    }
    return products.find((p) => (p.packSizes?.[0]?.salePrice || 0) < (p.packSizes?.[0]?.regularPrice || 0)) || products[0]
  }, [weeklyForm.productId, productMap, products])

  // Featured products selected list
  const featuredSelectedProducts = useMemo(() => {
    if (featuredForm.productMode === 'manual' && featuredForm.productIds.length > 0) {
      return featuredForm.productIds.map((id) => productMap.get(id)).filter(Boolean)
    }
    return products.filter((p) => p.featured)
  }, [featuredForm.productMode, featuredForm.productIds, productMap, products])

  // Weekly Timer Helpers
  const weeklyTargetIso = fromDatetimeLocal(weeklyForm.endsAt)
  const isWeeklyExpired = new Date(weeklyTargetIso).getTime() <= Date.now()

  function handleWeeklyDurationChange(field, value) {
    const num = Math.max(0, parseInt(value, 10) || 0)
    setWeeklyForm((prev) => {
      const nextDays = field === 'durationDays' ? num : prev.durationDays
      const nextHours = field === 'durationHours' ? num : prev.durationHours
      const nextMinutes = field === 'durationMinutes' ? num : prev.durationMinutes

      const newEndsAt = getEndsAtFromDuration(nextDays, nextHours, nextMinutes)
      return {
        ...prev,
        [field]: num,
        endsAt: toDatetimeLocal(newEndsAt),
      }
    })
  }

  function handleWeeklyEndsAtChange(value) {
    const iso = fromDatetimeLocal(value)
    const dur = getDurationFromEndsAt(iso)
    setWeeklyForm((prev) => ({
      ...prev,
      endsAt: value,
      durationDays: dur.days,
      durationHours: dur.hours,
      durationMinutes: dur.minutes,
    }))
  }

  function applyWeeklyDurationPreset(days, hours = 0) {
    const newEndsAt = getEndsAtFromDuration(days, hours, 0)
    setWeeklyForm((prev) => ({
      ...prev,
      durationDays: days,
      durationHours: hours,
      durationMinutes: 0,
      endsAt: toDatetimeLocal(newEndsAt),
    }))
    showToast(`Weekly deal set for ${days} Day(s)!`, 'info')
  }

  function restartWeeklyTimerNow() {
    const days = weeklyForm.durationDays || 6
    const hours = weeklyForm.durationHours || 0
    const newEndsAt = getEndsAtFromDuration(days, hours, 0)
    setWeeklyForm((prev) => ({
      ...prev,
      endsAt: toDatetimeLocal(newEndsAt),
    }))
    showToast(`Weekly timer restarted for ${days} Days from now!`, 'success')
  }

  function handleWeeklyProductSelect(id) {
    const p = productMap.get(id)
    if (!p) return
    const defaultPack = getDefaultPack(p)
    const reg = defaultPack.regularPrice || 100
    const sale = defaultPack.salePrice < reg ? defaultPack.salePrice : Math.round(reg * 0.8)

    setWeeklyForm((prev) => ({
      ...prev,
      productId: id,
      regularPrice: reg,
      offerPrice: sale,
    }))
    showToast(`"${p.name}" selected for Deal of the Week!`, 'info')
  }

  function applyWeeklyPresetDiscount(pct) {
    if (!weeklySelectedProduct) return
    const defaultPack = getDefaultPack(weeklySelectedProduct)
    const reg = Number(weeklyForm.regularPrice) || defaultPack.regularPrice || 100
    const calculatedOffer = Math.max(1, Math.round(reg * (1 - pct / 100)))

    setWeeklyForm((prev) => ({
      ...prev,
      regularPrice: reg,
      offerPrice: calculatedOffer,
    }))
    showToast(`Applied ${pct}% discount to Deal of the Week!`, 'info')
  }

  // Featured Products Helpers
  function handleFeaturedToggle(id) {
    setFeaturedForm((prev) => {
      const exists = prev.productIds.includes(id)
      const next = exists ? prev.productIds.filter((pId) => pId !== id) : [...prev.productIds, id]
      return {
        ...prev,
        productMode: 'manual',
        productIds: next,
      }
    })
  }

  function moveFeaturedItem(index, direction) {
    setFeaturedForm((prev) => {
      const copy = [...prev.productIds]
      const targetIndex = index + direction
      if (targetIndex < 0 || targetIndex >= copy.length) return prev
      const temp = copy[index]
      copy[index] = copy[targetIndex]
      copy[targetIndex] = temp
      return { ...prev, productIds: copy }
    })
  }

  function handleLoadAllFeaturedFromCatalog() {
    const catalogIds = products.filter((p) => p.featured).map((p) => p.id)
    setFeaturedForm((prev) => ({
      ...prev,
      productMode: 'manual',
      productIds: catalogIds,
    }))
    showToast(`Loaded ${catalogIds.length} catalog featured products into manual editor!`, 'info')
  }

  // Save Handlers
  async function handleSaveAll(e) {
    if (e) e.preventDefault()
    setSaving(true)
    try {
      if (activeTab === 'hot-deals') {
        const payload = {
          enabled: form.enabled,
          tag: form.tag,
          title: form.title,
          text: form.text,
          endsAt: fromDatetimeLocal(form.endsAt),
          durationDays: form.durationDays,
          durationHours: form.durationHours,
          durationMinutes: form.durationMinutes,
          autoRenew: form.autoRenew,
          link: form.link,
          image: form.image,
          productMode: form.productMode,
          productIds: form.productIds,
          dealPrices: form.dealPrices,
        }
        await updateHotDealSettings(payload)
        showToast('Hot Deals settings saved successfully!', 'success')
      } else if (activeTab === 'weekly-deal') {
        const payload = {
          enabled: weeklyForm.enabled,
          title: weeklyForm.title,
          subtitle: weeklyForm.subtitle,
          productId: weeklyForm.productId,
          endsAt: fromDatetimeLocal(weeklyForm.endsAt),
          durationDays: weeklyForm.durationDays,
          durationHours: weeklyForm.durationHours,
          durationMinutes: weeklyForm.durationMinutes,
          autoRenew: weeklyForm.autoRenew,
          offerPrice: weeklyForm.offerPrice,
          regularPrice: weeklyForm.regularPrice,
        }
        await updateWeeklyDealSettings(payload)
        showToast('Deal of the Week saved successfully!', 'success')
      } else if (activeTab === 'featured') {
        const payload = {
          enabled: featuredForm.enabled,
          title: featuredForm.title,
          productMode: featuredForm.productMode,
          productIds: featuredForm.productIds,
        }
        await updateFeaturedSettings(payload)
        showToast('Featured Products settings saved successfully!', 'success')
      } else if (activeTab === 'delivery-banners') {
        const payload = {
          enabled: deliveryForm.enabled !== false,
          freeDeliveryAbove: Number(deliveryForm.freeDeliveryAbove) || 700,
          deliveryCharge: Number(deliveryForm.deliveryCharge) || 40,
          title: deliveryForm.title || 'Free Delivery',
          text: deliveryForm.text || '',
        }
        await updateDeliverySettings(payload)
        await updateTaxSettings({
          enabled: taxForm.enabled !== false,
          gstRate: Number(taxForm.gstRate) >= 0 ? Number(taxForm.gstRate) : 5,
          taxName: taxForm.taxName || 'GST',
          gstNumber: taxForm.gstNumber || '',
          showOnInvoice: taxForm.showOnInvoice !== false,
        })
        persistBanners(bannersList)
        showToast('Delivery and GST Tax settings saved successfully!', 'success')
      }
    } catch {
      showToast('Failed to save settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleResetCurrentTab() {
    if (!window.confirm(`Reset ${activeTab} to original default values?`)) return
    try {
      if (activeTab === 'hot-deals') {
        const reset = await resetHotDealSettings()
        setForm({
          ...reset,
          endsAt: toDatetimeLocal(reset.endsAt),
        })
      } else if (activeTab === 'weekly-deal') {
        const reset = await resetWeeklyDealSettings()
        setWeeklyForm({
          ...reset,
          endsAt: toDatetimeLocal(reset.endsAt),
        })
      } else if (activeTab === 'featured') {
        const reset = await resetFeaturedSettings()
        setFeaturedForm(reset)
      } else if (activeTab === 'delivery-banners') {
        const reset = await resetOfferBanners()
        setDeliveryForm(reset.delivery)
        setBannersList(reset.banners)
      }
      showToast('Settings reset to defaults', 'info')
    } catch {
      showToast('Failed to reset settings', 'error')
    }
  }

  // Tab 4: Delivery & Offer Banners Helpers
  async function persistBanners(nextList) {
    setBannersList(nextList)
    try {
      await replaceOfferBanners(nextList)
      window.dispatchEvent(new Event('storage'))
      window.dispatchEvent(new CustomEvent('grocery_banners_updated', { detail: nextList }))
    } catch {}
  }

  function handleDeliveryFieldChange(field, val) {
    setDeliveryForm((prev) => ({
      ...prev,
      [field]: val,
    }))
  }

  function syncThresholdToDeliveryBanner() {
    const threshold = Number(deliveryForm.freeDeliveryAbove) || 499
    const newTitle = `Free delivery on orders above ₹${threshold}`
    const newText = `On all orders above ₹${threshold} - fresh groceries at your doorstep`

    const updatedDelivery = {
      ...deliveryForm,
      title: newTitle,
      text: newText,
    }
    setDeliveryForm(updatedDelivery)
    updateDeliverySettings(updatedDelivery)

    const nextList = bannersList.map((b) => {
      if (b.id === 'ob2' || (b.title && b.title.toLowerCase().includes('free delivery'))) {
        return {
          ...b,
          title: newTitle,
          text: newText,
        }
      }
      return b
    })
    persistBanners(nextList)

    showToast(`Synced ₹${threshold} to Delivery Banner & Policy text!`, 'success')
  }

  function handleOpenAddBanner() {
    const threshold = Number(deliveryForm.freeDeliveryAbove) || 499
    setEditingBanner({
      id: `ob_${Date.now()}`,
      title: `Free delivery on orders above ₹${threshold}`,
      text: `On all orders above ₹${threshold} - fresh groceries at your doorstep`,
      link: '/shop',
      image: 'banners/Free Devilevery.png',
      tone: 'darkGreen',
      imageOnly: false,
      active: true,
    })
    setIsNewBanner(true)
  }

  function handleOpenEditBanner(banner) {
    setEditingBanner({ ...banner })
    setIsNewBanner(false)
  }

  function handleSaveBannerModal(e) {
    if (e) e.preventDefault()
    if (!editingBanner) return

    let nextList
    if (isNewBanner) {
      nextList = [...bannersList, editingBanner]
      showToast('New Offer Banner added & saved!', 'success')
    } else {
      nextList = bannersList.map((b) => (b.id === editingBanner.id ? editingBanner : b))
      showToast('Banner updated & saved to homepage!', 'success')
    }
    persistBanners(nextList)
    setEditingBanner(null)
  }

  function handleDeleteBanner(id) {
    if (window.confirm('Are you sure you want to delete this offer banner?')) {
      const nextList = bannersList.filter((b) => b.id !== id)
      persistBanners(nextList)
      showToast('Banner deleted successfully', 'info')
    }
  }

  function handleToggleBannerActive(id) {
    const nextList = bannersList.map((b) =>
      b.id === id ? { ...b, active: b.active === false ? true : false } : b,
    )
    persistBanners(nextList)
    showToast('Banner visibility toggled & saved', 'info')
  }

  // Hot deals timer & price change handlers
  const targetIso = fromDatetimeLocal(form.endsAt)
  const isExpired = new Date(targetIso).getTime() <= Date.now()

  function handleHotDealDurationChange(field, value) {
    const num = Math.max(0, parseInt(value, 10) || 0)
    setForm((prev) => {
      const nextDays = field === 'durationDays' ? num : prev.durationDays
      const nextHours = field === 'durationHours' ? num : prev.durationHours
      const nextMinutes = field === 'durationMinutes' ? num : prev.durationMinutes

      const newEndsAt = getEndsAtFromDuration(nextDays, nextHours, nextMinutes)
      return {
        ...prev,
        [field]: num,
        endsAt: toDatetimeLocal(newEndsAt),
      }
    })
  }

  function handleHotDealEndsAtChange(value) {
    const iso = fromDatetimeLocal(value)
    const dur = getDurationFromEndsAt(iso)
    setForm((prev) => ({
      ...prev,
      endsAt: value,
      durationDays: dur.days,
      durationHours: dur.hours,
      durationMinutes: dur.minutes,
    }))
  }

  function applyHotDealDurationPreset(days, hours = 0) {
    const newEndsAt = getEndsAtFromDuration(days, hours, 0)
    setForm((prev) => ({
      ...prev,
      durationDays: days,
      durationHours: hours,
      durationMinutes: 0,
      endsAt: toDatetimeLocal(newEndsAt),
    }))
    showToast(
      `Deal timer set for ${days > 0 ? `${days} Day(s) ` : ''}${hours > 0 ? `${hours} Hour(s)` : ''}!`,
      'info',
    )
  }

  function applyHotDealMidnightTonight() {
    const d = new Date()
    d.setHours(23, 59, 59, 999)
    const iso = d.toISOString()
    const dur = getDurationFromEndsAt(iso)
    setForm((prev) => ({
      ...prev,
      durationDays: 0,
      durationHours: dur.hours,
      durationMinutes: dur.minutes,
      endsAt: toDatetimeLocal(iso),
    }))
    showToast('Timer set to end tonight at 11:59 PM (Today Only)!', 'info')
  }

  function restartHotDealTimerNow() {
    const days = form.durationDays || 1
    const hours = form.durationHours || 0
    const minutes = form.durationMinutes || 0
    const newEndsAt = getEndsAtFromDuration(days, hours, minutes)
    setForm((prev) => ({
      ...prev,
      endsAt: toDatetimeLocal(newEndsAt),
    }))
    showToast(`Timer restarted for ${days} Day(s) and ${hours} Hour(s) from right now!`, 'success')
  }

  function handleHotDealProductToggle(id) {
    const p = productMap.get(id)
    if (!p) return

    setForm((prev) => {
      const exists = prev.productIds.includes(id)
      if (exists) {
        return {
          ...prev,
          productIds: prev.productIds.filter((pId) => pId !== id),
        }
      }

      const defaultPack = getDefaultPack(p)
      const reg = defaultPack.regularPrice || defaultPack.salePrice || 100
      const currentSale = defaultPack.salePrice || reg
      const suggestedOffer = currentSale < reg ? currentSale : Math.max(1, Math.round(reg * 0.8))

      const currentDealPrice = prev.dealPrices[id]
      const updatedDealPrices = {
        ...prev.dealPrices,
        [id]: currentDealPrice || {
          regularPrice: reg,
          offerPrice: suggestedOffer,
        },
      }

      return {
        ...prev,
        productIds: [...prev.productIds, id],
        dealPrices: updatedDealPrices,
      }
    })
  }

  function handleHotDealRemoveProduct(id) {
    setForm((prev) => ({
      ...prev,
      productIds: prev.productIds.filter((pId) => pId !== id),
    }))
  }

  function handleHotDealPriceChange(id, field, value) {
    const num = Math.max(0, Number(value) || 0)
    setForm((prev) => {
      const current = prev.dealPrices[id] || {}
      const p = productMap.get(id)
      const defaultPack = p ? getDefaultPack(p) : { regularPrice: 100, salePrice: 100 }

      const reg = field === 'regularPrice' ? num : current.regularPrice || defaultPack.regularPrice
      const off = field === 'offerPrice' ? num : current.offerPrice || defaultPack.salePrice

      return {
        ...prev,
        dealPrices: {
          ...prev.dealPrices,
          [id]: {
            regularPrice: reg,
            offerPrice: off,
          },
        },
      }
    })
  }

  function applyHotDealPresetDiscount(id, percent) {
    const p = productMap.get(id)
    if (!p) return

    setForm((prev) => {
      const current = prev.dealPrices[id] || {}
      const defaultPack = getDefaultPack(p)
      const reg = current.regularPrice || defaultPack.regularPrice || 100
      const calculatedOffer = Math.max(1, Math.round(reg * (1 - percent / 100)))

      return {
        ...prev,
        dealPrices: {
          ...prev.dealPrices,
          [id]: {
            regularPrice: reg,
            offerPrice: calculatedOffer,
          },
        },
      }
    })
    showToast(`Applied ${percent}% discount`, 'info')
  }

  function applyHotDealBulkDiscount(percent) {
    if (hotDealSelectedProducts.length === 0) return

    setForm((prev) => {
      const updated = { ...prev.dealPrices }
      prev.productIds.forEach((id) => {
        const p = productMap.get(id)
        if (p) {
          const defaultPack = getDefaultPack(p)
          const current = updated[id] || {}
          const reg = current.regularPrice || defaultPack.regularPrice || 100
          updated[id] = {
            regularPrice: reg,
            offerPrice: Math.max(1, Math.round(reg * (1 - percent / 100))),
          }
        }
      })
      return { ...prev, dealPrices: updated }
    })
    showToast(`Applied ${percent}% discount to all ${hotDealSelectedProducts.length} products!`, 'success')
  }

  if (dealRequest.loading || productsRequest.loading || weeklyRequest.loading || featuredRequest.loading) {
    return <Loader page label="Loading deals & featured configuration..." />
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Promotions & Homepage Highlights"
        description="Manage your store's promotional campaigns: Hot Deals of the Day, Deal of the Week, Featured Products, and Delivery & Offer Banners."
      >
        <Link
          to="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3.5 py-2 text-sm font-medium text-heading hover:bg-surface"
        >
          <ExternalLink size={16} /> View Store
        </Link>
        <Button variant="outline" onClick={handleResetCurrentTab} type="button">
          <RotateCcw size={16} /> Reset Tab
        </Button>
        <Button onClick={handleSaveAll} disabled={saving} type="button">
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </AdminPageHeader>

      {/* TABS NAVIGATION */}
      <div className="flex border-b border-line bg-white rounded-t-xl px-4 pt-2 gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('hot-deals')}
          className={cn(
            'flex items-center gap-2 py-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap',
            activeTab === 'hot-deals'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text-heading',
          )}
        >
          <Flame size={17} className={activeTab === 'hot-deals' ? 'text-warning' : ''} />
          Hot Deals of the Day
          {form.enabled ? (
            <span className="size-2 rounded-full bg-primary"></span>
          ) : (
            <span className="size-2 rounded-full bg-muted"></span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('weekly-deal')}
          className={cn(
            'flex items-center gap-2 py-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap',
            activeTab === 'weekly-deal'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text-heading',
          )}
        >
          <Clock size={17} className={activeTab === 'weekly-deal' ? 'text-primary' : ''} />
          Deal of the Week
          {weeklyForm.enabled ? (
            <span className="size-2 rounded-full bg-primary"></span>
          ) : (
            <span className="size-2 rounded-full bg-muted"></span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('featured')}
          className={cn(
            'flex items-center gap-2 py-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap',
            activeTab === 'featured'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text-heading',
          )}
        >
          <Star size={17} className={activeTab === 'featured' ? 'text-warning' : ''} />
          Featured Products
          {featuredForm.enabled ? (
            <span className="size-2 rounded-full bg-primary"></span>
          ) : (
            <span className="size-2 rounded-full bg-muted"></span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('delivery-banners')}
          className={cn(
            'flex items-center gap-2 py-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap',
            activeTab === 'delivery-banners'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text-heading',
          )}
        >
          <Truck size={17} className={activeTab === 'delivery-banners' ? 'text-primary' : ''} />
          Delivery, GST &amp; Banners
          {deliveryForm.enabled ? (
            <span className="size-2 rounded-full bg-primary"></span>
          ) : (
            <span className="size-2 rounded-full bg-muted"></span>
          )}
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: HOT DEALS OF THE DAY */}
      {/* ========================================================= */}
      {activeTab === 'hot-deals' && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-7 xl:col-span-8">
            {/* Visibility Card */}
            <div className="rounded-xl border border-line bg-white p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-heading flex items-center gap-2">
                  <Flame size={18} className="text-warning" /> Section Visibility
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Control whether the Hot Deals section is active on the homepage.
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={form.enabled}
                  onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-line peer-checked:bg-primary peer-focus:outline-none after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
                <span className="ml-3 text-sm font-medium text-heading">
                  {form.enabled ? <Badge variant="success">Visible</Badge> : <Badge variant="neutral">Hidden</Badge>}
                </span>
              </label>
            </div>

            {/* Duration & Timer */}
            <div className="rounded-xl border border-line bg-white p-5 shadow-sm space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-heading flex items-center gap-2">
                    <Clock size={19} className="text-primary" /> Deal Duration & Countdown Timer
                  </h2>
                  <p className="text-xs text-muted mt-0.5">Set how long the daily deal runs.</p>
                </div>
                <div>
                  {isExpired ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-3 py-1 text-xs font-semibold text-danger">
                      <span className="size-2 rounded-full bg-danger animate-pulse"></span> Expired
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      <span className="size-2 rounded-full bg-primary animate-ping"></span> Active
                    </span>
                  )}
                </div>
              </div>

              {/* Live countdown preview banner */}
              <div className="rounded-xl bg-surface border border-line p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted">Current Live Countdown:</p>
                  <Countdown targetDate={targetIso} className="scale-95 origin-left" />
                  <p className="text-[11px] text-muted pt-1">
                    Ends on: <span className="font-semibold text-heading">{formatEndsAtFriendly(targetIso)}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={restartHotDealTimerNow}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-white px-3.5 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors shadow-xs"
                >
                  <RotateCcw size={14} /> Restart Timer From Now
                </button>
              </div>

              {/* Duration Inputs: Days, Hours, Minutes */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">
                  1. Set Duration (Days & Hours):
                </label>
                <div className="grid grid-cols-3 gap-3 sm:max-w-md">
                  <div className="rounded-lg border border-line bg-surface/50 p-2.5 text-center">
                    <label className="text-[11px] font-semibold text-muted block mb-1">Days</label>
                    <input
                      type="number"
                      min="0"
                      value={form.durationDays}
                      onChange={(e) => handleHotDealDurationChange('durationDays', e.target.value)}
                      className="w-full rounded border border-line bg-white py-1.5 text-center text-base font-bold text-heading focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="rounded-lg border border-line bg-surface/50 p-2.5 text-center">
                    <label className="text-[11px] font-semibold text-muted block mb-1">Hours</label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={form.durationHours}
                      onChange={(e) => handleHotDealDurationChange('durationHours', e.target.value)}
                      className="w-full rounded border border-line bg-white py-1.5 text-center text-base font-bold text-heading focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="rounded-lg border border-line bg-surface/50 p-2.5 text-center">
                    <label className="text-[11px] font-semibold text-muted block mb-1">Minutes</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={form.durationMinutes}
                      onChange={(e) => handleHotDealDurationChange('durationMinutes', e.target.value)}
                      className="w-full rounded border border-line bg-white py-1.5 text-center text-base font-bold text-heading focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">
                  2. Quick 1-Click Presets:
                </label>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={applyHotDealMidnightTonight}
                    className="rounded-lg border border-line bg-surface px-3 py-1.5 font-medium text-heading hover:bg-primary hover:text-white transition-colors"
                  >
                    ⚡ Today Only (Ends Midnight)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyHotDealDurationPreset(0, 12)}
                    className="rounded-lg border border-line bg-surface px-3 py-1.5 font-medium text-heading hover:bg-primary hover:text-white transition-colors"
                  >
                    12 Hours
                  </button>
                  <button
                    type="button"
                    onClick={() => applyHotDealDurationPreset(1, 0)}
                    className="rounded-lg border border-line bg-surface px-3 py-1.5 font-medium text-heading hover:bg-primary hover:text-white transition-colors"
                  >
                    24 Hours (1 Day)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyHotDealDurationPreset(2, 0)}
                    className="rounded-lg border border-line bg-surface px-3 py-1.5 font-medium text-heading hover:bg-primary hover:text-white transition-colors"
                  >
                    48 Hours (2 Days)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyHotDealDurationPreset(3, 0)}
                    className="rounded-lg border border-line bg-surface px-3 py-1.5 font-medium text-heading hover:bg-primary hover:text-white transition-colors"
                  >
                    3 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => applyHotDealDurationPreset(7, 0)}
                    className="rounded-lg border border-line bg-surface px-3 py-1.5 font-medium text-heading hover:bg-primary hover:text-white transition-colors"
                  >
                    7 Days (1 Week)
                  </button>
                </div>
              </div>

              {/* Exact Calendar Picker */}
              <div className="pt-2 border-t border-line">
                <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-1.5">
                  <Calendar size={14} className="text-primary" /> 3. Or Pick Exact End Date & Time:
                </label>
                <input
                  type="datetime-local"
                  value={form.endsAt}
                  onChange={(e) => handleHotDealEndsAtChange(e.target.value)}
                  className="w-full sm:max-w-md rounded-lg border border-line bg-white px-4 py-2.5 text-sm text-heading transition-colors focus:border-primary focus:outline-none"
                />
              </div>

              {/* Daily Auto-Renew Toggle */}
              <div className="pt-2 border-t border-line">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.autoRenew}
                    onChange={(e) => setForm({ ...form, autoRenew: e.target.checked })}
                    className="mt-0.5 size-4 rounded accent-primary"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-heading flex items-center gap-1.5">
                      <Zap size={14} className="text-warning" /> Auto-Renew Daily (Always Active Deal of the Day)
                    </span>
                    <p className="text-muted mt-0.5">
                      Automatically resets the countdown every 24 hours when expired so deals stay perpetually running.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Banner texts & image */}
            <div className="rounded-xl border border-line bg-white p-5 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-heading flex items-center gap-2">
                <Sparkles size={18} className="text-primary" /> Banner Texts & Image
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Badge Tag Text"
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  placeholder="e.g. Limited time"
                />
                <Input
                  label="Button Link"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="e.g. /shop"
                />
              </div>
              <Input
                label="Banner Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Deals of the day"
                required
              />
              <Textarea
                label="Description"
                rows={2}
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                placeholder="e.g. Save more on kitchen essentials"
              />

              <ImageUploader
                label="Upload Banner Graphic"
                multiple={false}
                images={form.image ? [form.image] : []}
                onChange={(images) => {
                  const nextImg = typeof images === 'function' ? images(form.image ? [form.image] : []) : images
                  setForm({ ...form, image: nextImg[0] || '' })
                }}
              />
            </div>

            {/* Products & Offer Prices */}
            <div className="rounded-xl border border-line bg-white p-5 shadow-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-heading flex items-center gap-2">
                    <Tag size={18} className="text-primary" /> Deal Carousel Products & Offer Prices
                  </h2>
                  <p className="text-xs text-muted mt-0.5">
                    Select products and set custom offer prices for the deal carousel.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => applyHotDealBulkDiscount(20)}
                    className="rounded-md border border-line bg-surface px-2.5 py-1 text-xs font-medium hover:bg-primary hover:text-white transition-colors"
                  >
                    20% Off All
                  </button>
                  <button
                    type="button"
                    onClick={() => applyHotDealBulkDiscount(30)}
                    className="rounded-md border border-line bg-surface px-2.5 py-1 text-xs font-medium hover:bg-primary hover:text-white transition-colors"
                  >
                    30% Off All
                  </button>
                </div>
              </div>

              {/* Selected products table with offer prices */}
              <div className="space-y-2.5">
                {hotDealSelectedProducts.map((p) => {
                  const defaultPack = getDefaultPack(p)
                  const cfg = form.dealPrices[p.id] || {}
                  const reg = cfg.regularPrice !== undefined ? cfg.regularPrice : defaultPack.regularPrice
                  const off = cfg.offerPrice !== undefined ? cfg.offerPrice : defaultPack.salePrice
                  const discount = discountPercent(reg, off)

                  return (
                    <div
                      key={p.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-line bg-surface/40 p-3"
                    >
                      <div className="flex items-center gap-3 min-w-0 sm:w-1/3">
                        <AssetImage
                          src={p.images?.[0]}
                          alt={p.name}
                          compact
                          className="size-12 shrink-0 rounded-lg border border-line"
                          imgClassName="size-12 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-heading">{p.name}</p>
                          <p className="text-[11px] text-muted truncate">
                            {p.category} · {defaultPack.label}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 sm:w-2/3 sm:justify-end">
                        <div className="flex flex-col">
                          <label className="text-[10px] uppercase font-semibold text-muted">MRP (₹)</label>
                          <input
                            type="number"
                            min="1"
                            value={reg}
                            onChange={(e) => handleHotDealPriceChange(p.id, 'regularPrice', e.target.value)}
                            className="w-20 rounded-md border border-line bg-white px-2 py-1 text-xs text-heading focus:border-primary focus:outline-none"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="text-[10px] uppercase font-bold text-primary flex items-center gap-1">
                            <Sparkles size={11} /> Offer (₹)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={off}
                            onChange={(e) => handleHotDealPriceChange(p.id, 'offerPrice', e.target.value)}
                            className="w-24 rounded-md border-2 border-primary/50 bg-white px-2 py-1 text-xs font-bold text-primary focus:border-primary focus:outline-none"
                          />
                        </div>

                        <div className="flex flex-col items-center justify-center min-w-[70px]">
                          <span className="text-[10px] uppercase font-semibold text-muted mb-0.5">Discount</span>
                          {discount > 0 ? (
                            <Badge variant="sale" className="font-bold text-[11px]">
                              {discount}% OFF
                            </Badge>
                          ) : (
                            <span className="text-[10px] text-muted font-medium">No disc.</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 pt-3">
                          {[10, 20, 30, 40].map((pct) => (
                            <button
                              key={pct}
                              type="button"
                              onClick={() => applyHotDealPresetDiscount(p.id, pct)}
                              className="rounded border border-line bg-white px-1.5 py-1 text-[10px] font-medium text-heading hover:bg-primary hover:text-white transition-colors"
                            >
                              {pct}%
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleHotDealRemoveProduct(p.id)}
                          className="mt-3 flex size-7 items-center justify-center rounded text-muted hover:bg-danger/10 hover:text-danger"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Add more products */}
              <div className="pt-3 border-t border-line space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">Add Products to Hot Deals:</p>
                <div className="max-h-56 overflow-y-auto rounded-lg border border-line divide-y divide-line">
                  {filteredProducts.map((p) => {
                    const isSelected = form.productIds.includes(p.id)
                    const pack = getDefaultPack(p)
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleHotDealProductToggle(p.id)}
                        className={cn(
                          'flex cursor-pointer items-center gap-3 p-2 text-xs transition-colors',
                          isSelected ? 'bg-primary/5 font-semibold' : 'hover:bg-surface',
                        )}
                      >
                        <div
                          className={cn(
                            'size-4 rounded border flex items-center justify-center',
                            isSelected ? 'bg-primary border-primary text-white' : 'border-line bg-white',
                          )}
                        >
                          {isSelected && <Check size={12} />}
                        </div>
                        <AssetImage src={p.images?.[0]} alt="" compact className="size-8 rounded" />
                        <span className="truncate flex-1">{p.name}</span>
                        <span className="text-muted">{p.category}</span>
                        <span className="font-bold text-heading">{formatPrice(pack.salePrice)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Preview */}
          <div className="space-y-4 lg:col-span-5 xl:col-span-4">
            <div className="sticky top-20 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Homepage Live Preview</h2>

              {/* Banner Teal Card Preview */}
              <div className="overflow-hidden rounded-2xl bg-primary text-left text-white shadow-md flex flex-col justify-between">
                <div className="p-5 pb-3">
                  <span className="inline-block rounded-md bg-warning px-2.5 py-0.5 text-xs font-semibold text-white">
                    {form.tag || 'Limited time'}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-white">{form.title || 'Deals of the day'}</h3>
                  <p className="mt-1 text-xs text-white/90">{form.text || 'Save more on kitchen essentials'}</p>
                  <div className="mt-3">
                    <Countdown targetDate={targetIso} onDark className="justify-start scale-90 origin-left" />
                  </div>
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-heading shadow-sm">
                      Explore Shop
                    </span>
                  </div>
                </div>
                <div className="relative w-full min-h-[160px] max-h-[200px] overflow-hidden flex items-center justify-center bg-black/10">
                  {form.image && (
                    <AssetImage src={form.image} alt="" className="h-full w-full object-cover" imgClassName="h-full w-full object-cover" />
                  )}
                </div>
              </div>

              {/* Products strip preview */}
              <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-heading mb-3">
                  <span>Carousel Items ({hotDealPreviewProducts.length})</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 max-h-80 overflow-y-auto">
                  {hotDealPreviewProducts.slice(0, 6).map((p) => {
                    const discount = discountPercent(p.previewRegularPrice, p.previewSalePrice)
                    return (
                      <div key={p.id} className="relative rounded-lg border border-line p-2 text-center bg-surface/50">
                        {discount > 0 && (
                          <span className="absolute left-1.5 top-1.5 rounded bg-warning px-1.5 py-0.5 text-[9px] font-bold text-white">
                            {discount}% OFF
                          </span>
                        )}
                        <AssetImage src={p.images?.[0]} alt="" compact className="size-14 mx-auto rounded object-cover" />
                        <p className="mt-1 truncate text-[11px] font-semibold text-heading">{p.name}</p>
                        <div className="mt-1 flex items-baseline justify-center gap-1.5">
                          <span className="text-xs font-bold text-primary">{formatPrice(p.previewSalePrice)}</span>
                          {p.previewRegularPrice > p.previewSalePrice && (
                            <span className="text-[10px] text-muted line-through">{formatPrice(p.previewRegularPrice)}</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: DEAL OF THE WEEK */}
      {/* ========================================================= */}
      {activeTab === 'weekly-deal' && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column: Form */}
          <div className="space-y-6 lg:col-span-7 xl:col-span-8">
            {/* Visibility Toggle */}
            <div className="rounded-xl border border-line bg-white p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-heading flex items-center gap-2">
                  <Clock size={18} className="text-primary" /> Deal of the Week Visibility
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Show or hide the dedicated "Deal of the week" card in the homepage highlights section.
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={weeklyForm.enabled}
                  onChange={(e) => setWeeklyForm({ ...weeklyForm, enabled: e.target.checked })}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-line peer-checked:bg-primary peer-focus:outline-none after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
                <span className="ml-3 text-sm font-medium text-heading">
                  {weeklyForm.enabled ? <Badge variant="success">Visible</Badge> : <Badge variant="neutral">Hidden</Badge>}
                </span>
              </label>
            </div>

            {/* Title & Subtitle */}
            <div className="rounded-xl border border-line bg-white p-5 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-heading flex items-center gap-2">
                <Sparkles size={18} className="text-primary" /> Card Header & Description
              </h2>
              <Input
                label="Card Title"
                value={weeklyForm.title}
                onChange={(e) => setWeeklyForm({ ...weeklyForm, title: e.target.value })}
                placeholder="Deal of the week"
                required
              />
              <Input
                label="Subtitle / Notice"
                value={weeklyForm.subtitle}
                onChange={(e) => setWeeklyForm({ ...weeklyForm, subtitle: e.target.value })}
                placeholder="Don't miss this opportunity at a special price."
              />
            </div>

            {/* Product Selector */}
            <div className="rounded-xl border border-line bg-white p-5 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-heading flex items-center gap-2">
                <Tag size={18} className="text-primary" /> Select Deal of the Week Product
              </h2>

              {/* Currently Selected Product Details */}
              {weeklySelectedProduct && (
                <div className="rounded-xl border-2 border-primary/40 bg-primary/5 p-4 flex flex-col sm:flex-row items-center gap-4">
                  <AssetImage
                    src={weeklySelectedProduct.images?.[0]}
                    alt={weeklySelectedProduct.name}
                    compact
                    className="size-20 shrink-0 rounded-xl border border-line bg-white shadow-xs"
                    imgClassName="size-20 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <span className="inline-block rounded bg-primary px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider mb-1">
                      Featured Weekly Item
                    </span>
                    <h3 className="text-sm font-bold text-heading truncate">{weeklySelectedProduct.name}</h3>
                    <p className="text-xs text-muted">
                      Category: {weeklySelectedProduct.category} · Pack: {getDefaultPack(weeklySelectedProduct).label} · Stock: {weeklySelectedProduct.stock} units
                    </p>
                  </div>
                </div>
              )}

              {/* Special Deal Offer Price & Regular Price */}
              <div className="rounded-xl border border-line bg-surface/50 p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-heading flex items-center gap-1.5">
                  <Sparkles size={14} className="text-primary" /> Weekly Deal Offer Price:
                </h3>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="text-[11px] font-semibold text-muted block mb-1">Original MRP (₹)</label>
                    <input
                      type="number"
                      min="1"
                      value={weeklyForm.regularPrice}
                      placeholder={weeklySelectedProduct ? String(getDefaultPack(weeklySelectedProduct).regularPrice) : '100'}
                      onChange={(e) => setWeeklyForm({ ...weeklyForm, regularPrice: e.target.value })}
                      className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-heading font-medium focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-primary block mb-1">Special Deal Price (₹)</label>
                    <input
                      type="number"
                      min="1"
                      value={weeklyForm.offerPrice}
                      placeholder={weeklySelectedProduct ? String(getDefaultPack(weeklySelectedProduct).salePrice) : '80'}
                      onChange={(e) => setWeeklyForm({ ...weeklyForm, offerPrice: e.target.value })}
                      className="w-full rounded-lg border-2 border-primary/50 bg-white px-3 py-2 text-sm text-primary font-bold focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col justify-end">
                    <div className="rounded-lg bg-white border border-line px-3 py-2 text-center">
                      <span className="text-[10px] uppercase font-bold text-muted block">Calculated Discount</span>
                      <span className="text-xs font-bold text-primary">
                        {discountPercent(
                          Number(weeklyForm.regularPrice) || (weeklySelectedProduct ? getDefaultPack(weeklySelectedProduct).regularPrice : 100),
                          Number(weeklyForm.offerPrice) || (weeklySelectedProduct ? getDefaultPack(weeklySelectedProduct).salePrice : 80),
                        )}
                        % OFF
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <span className="text-muted font-medium">Quick discount:</span>
                  {[10, 20, 30, 40, 50].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => applyWeeklyPresetDiscount(pct)}
                      className="rounded border border-line bg-white px-2 py-1 text-[11px] font-medium text-heading hover:bg-primary hover:text-white transition-colors"
                    >
                      {pct}% Off
                    </button>
                  ))}
                </div>
              </div>

              {/* Product catalog search to change product */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted block">
                  Change Product for Deal of the Week:
                </label>
                <div className="max-h-52 overflow-y-auto rounded-lg border border-line divide-y divide-line">
                  {filteredProducts.map((p) => {
                    const isSelected = weeklyForm.productId === p.id || (!weeklyForm.productId && weeklySelectedProduct?.id === p.id)
                    const pack = getDefaultPack(p)
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleWeeklyProductSelect(p.id)}
                        className={cn(
                          'flex cursor-pointer items-center gap-3 p-2 text-xs transition-colors',
                          isSelected ? 'bg-primary/10 font-bold' : 'hover:bg-surface',
                        )}
                      >
                        <AssetImage src={p.images?.[0]} alt="" compact className="size-8 rounded" />
                        <span className="truncate flex-1">{p.name}</span>
                        <span className="text-muted">{p.category}</span>
                        <span className="font-bold text-heading">{formatPrice(pack.salePrice)}</span>
                        {isSelected && <Badge variant="primary">Selected</Badge>}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Weekly Deal Duration & Timer */}
            <div className="rounded-xl border border-line bg-white p-5 shadow-sm space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-heading flex items-center gap-2">
                    <Clock size={19} className="text-primary" /> Weekly Deal Duration & Countdown Timer
                  </h2>
                  <p className="text-xs text-muted mt-0.5">Control how long this weekly special offer runs.</p>
                </div>
                <div>
                  {isWeeklyExpired ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-3 py-1 text-xs font-semibold text-danger">
                      <span className="size-2 rounded-full bg-danger animate-pulse"></span> Expired
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      <span className="size-2 rounded-full bg-primary animate-ping"></span> Active
                    </span>
                  )}
                </div>
              </div>

              {/* Countdown Preview */}
              <div className="rounded-xl bg-surface border border-line p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted">Time Remaining on Weekly Deal:</p>
                  <Countdown targetDate={weeklyTargetIso} variant="primary" className="scale-95 origin-left" />
                  <p className="text-[11px] text-muted pt-1">
                    Expires on: <span className="font-semibold text-heading">{formatEndsAtFriendly(weeklyTargetIso)}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={restartWeeklyTimerNow}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-white px-3.5 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors shadow-xs"
                >
                  <RotateCcw size={14} /> Restart Timer From Now
                </button>
              </div>

              {/* Duration Inputs: Days, Hours, Minutes */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">
                  1. Set Duration (Days & Hours):
                </label>
                <div className="grid grid-cols-3 gap-3 sm:max-w-md">
                  <div className="rounded-lg border border-line bg-surface/50 p-2.5 text-center">
                    <label className="text-[11px] font-semibold text-muted block mb-1">Days</label>
                    <input
                      type="number"
                      min="0"
                      value={weeklyForm.durationDays}
                      onChange={(e) => handleWeeklyDurationChange('durationDays', e.target.value)}
                      className="w-full rounded border border-line bg-white py-1.5 text-center text-base font-bold text-heading focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="rounded-lg border border-line bg-surface/50 p-2.5 text-center">
                    <label className="text-[11px] font-semibold text-muted block mb-1">Hours</label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={weeklyForm.durationHours}
                      onChange={(e) => handleWeeklyDurationChange('durationHours', e.target.value)}
                      className="w-full rounded border border-line bg-white py-1.5 text-center text-base font-bold text-heading focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="rounded-lg border border-line bg-surface/50 p-2.5 text-center">
                    <label className="text-[11px] font-semibold text-muted block mb-1">Minutes</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={weeklyForm.durationMinutes}
                      onChange={(e) => handleWeeklyDurationChange('durationMinutes', e.target.value)}
                      className="w-full rounded border border-line bg-white py-1.5 text-center text-base font-bold text-heading focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => applyWeeklyDurationPreset(3)}
                  className="rounded-lg border border-line bg-surface px-3 py-1.5 font-medium text-heading hover:bg-primary hover:text-white transition-colors"
                >
                  3 Days
                </button>
                <button
                  type="button"
                  onClick={() => applyWeeklyDurationPreset(7)}
                  className="rounded-lg border border-line bg-surface px-3 py-1.5 font-medium text-heading hover:bg-primary hover:text-white transition-colors"
                >
                  7 Days (1 Week)
                </button>
                <button
                  type="button"
                  onClick={() => applyWeeklyDurationPreset(14)}
                  className="rounded-lg border border-line bg-surface px-3 py-1.5 font-medium text-heading hover:bg-primary hover:text-white transition-colors"
                >
                  14 Days (2 Weeks)
                </button>
                <button
                  type="button"
                  onClick={() => applyWeeklyDurationPreset(30)}
                  className="rounded-lg border border-line bg-surface px-3 py-1.5 font-medium text-heading hover:bg-primary hover:text-white transition-colors"
                >
                  30 Days (1 Month)
                </button>
              </div>

              {/* Calendar Picker */}
              <div className="pt-2 border-t border-line">
                <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-1.5">
                  <Calendar size={14} className="text-primary" /> Exact Expiry Date & Time:
                </label>
                <input
                  type="datetime-local"
                  value={weeklyForm.endsAt}
                  onChange={(e) => handleWeeklyEndsAtChange(e.target.value)}
                  className="w-full sm:max-w-md rounded-lg border border-line bg-white px-4 py-2.5 text-sm text-heading transition-colors focus:border-primary focus:outline-none"
                />
              </div>

              {/* Auto Renew Weekly Toggle */}
              <div className="pt-2 border-t border-line">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={weeklyForm.autoRenew}
                    onChange={(e) => setWeeklyForm({ ...weeklyForm, autoRenew: e.target.checked })}
                    className="mt-0.5 size-4 rounded accent-primary"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-heading flex items-center gap-1.5">
                      <Zap size={14} className="text-warning" /> Auto-Renew Weekly (Perpetual Deal of the Week)
                    </span>
                    <p className="text-muted mt-0.5">
                      Automatically renews every 7 days so customers always see an active Deal of the Week countdown.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Weekly Deal Live Card Preview */}
          <div className="space-y-4 lg:col-span-5 xl:col-span-4">
            <div className="sticky top-20 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Deal of the Week Live Preview</h2>

              {weeklySelectedProduct && (
                <div className="card flex flex-col p-5 bg-white shadow-md rounded-2xl border border-line">
                  <span className="rounded bg-primary-light text-primary px-3 py-1 text-xs font-bold w-fit mb-2">
                    {weeklyForm.title || 'Deal of the week'}
                  </span>
                  <Countdown targetDate={weeklyTargetIso} variant="primary" className="mt-2 scale-95 origin-left" />
                  <p className="mt-2 text-xs text-muted">{weeklyForm.subtitle}</p>

                  <div className="mx-auto mt-4 block w-full max-w-44">
                    <AssetImage
                      src={weeklySelectedProduct.images?.[0]}
                      alt={weeklySelectedProduct.name}
                      className="aspect-square w-full rounded-xl object-cover"
                    />
                  </div>

                  <div className="mt-3">
                    <Rating value={weeklySelectedProduct.rating} count={weeklySelectedProduct.reviewCount} showStars />
                  </div>

                  <Price
                    regularPrice={
                      Number(weeklyForm.regularPrice) || getDefaultPack(weeklySelectedProduct).regularPrice
                    }
                    salePrice={
                      Number(weeklyForm.offerPrice) || getDefaultPack(weeklySelectedProduct).salePrice
                    }
                    className="mt-1.5"
                  />

                  <p className="mt-1 font-heading text-sm font-bold text-heading">
                    {weeklySelectedProduct.name} · {getDefaultPack(weeklySelectedProduct).label}
                  </p>

                  <ProgressBar
                    value={weeklySelectedProduct.stock}
                    max={weeklySelectedProduct.stock + (weeklySelectedProduct.sold || 10)}
                    label={`Available only: ${weeklySelectedProduct.stock}`}
                    className="mt-3"
                  />

                  <div className="mt-4">
                    <Button variant="primary" size="sm" fullWidth type="button">
                      Add To Cart
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: FEATURED PRODUCTS */}
      {/* ========================================================= */}
      {activeTab === 'featured' && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column: Form */}
          <div className="space-y-6 lg:col-span-7 xl:col-span-8">
            {/* Visibility Toggle */}
            <div className="rounded-xl border border-line bg-white p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-heading flex items-center gap-2">
                  <Star size={18} className="text-warning" /> Featured Products Visibility
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Show or hide the "Featured Products" column on the homepage.
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={featuredForm.enabled}
                  onChange={(e) => setFeaturedForm({ ...featuredForm, enabled: e.target.checked })}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-line peer-checked:bg-primary peer-focus:outline-none after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
                <span className="ml-3 text-sm font-medium text-heading">
                  {featuredForm.enabled ? <Badge variant="success">Visible</Badge> : <Badge variant="neutral">Hidden</Badge>}
                </span>
              </label>
            </div>

            {/* List Title */}
            <div className="rounded-xl border border-line bg-white p-5 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-heading flex items-center gap-2">
                <Sparkles size={18} className="text-primary" /> Section Header
              </h2>
              <Input
                label="Column Title"
                value={featuredForm.title}
                onChange={(e) => setFeaturedForm({ ...featuredForm, title: e.target.value })}
                placeholder="Featured Products"
                required
              />
            </div>

            {/* Selection Mode */}
            <div className="rounded-xl border border-line bg-white p-5 shadow-sm space-y-5">
              <div>
                <h2 className="text-base font-bold text-heading flex items-center gap-2">
                  <Tag size={18} className="text-primary" /> Product Selection Mode
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Choose how featured products are selected for the homepage column.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label
                  className={cn(
                    'flex cursor-pointer flex-col rounded-xl border p-4 transition-colors',
                    featuredForm.productMode === 'auto'
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-line hover:border-heading/30',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-heading">Automatic (Catalog Flag)</span>
                    <input
                      type="radio"
                      name="featuredMode"
                      value="auto"
                      checked={featuredForm.productMode === 'auto'}
                      onChange={() => setFeaturedForm({ ...featuredForm, productMode: 'auto' })}
                      className="size-4 accent-primary"
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    Shows products that have the "Featured" checkbox turned ON in your catalog.
                  </p>
                </label>

                <label
                  className={cn(
                    'flex cursor-pointer flex-col rounded-xl border p-4 transition-colors',
                    featuredForm.productMode === 'manual'
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-line hover:border-heading/30',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-heading">Manual Custom Pick</span>
                    <input
                      type="radio"
                      name="featuredMode"
                      value="manual"
                      checked={featuredForm.productMode === 'manual'}
                      onChange={() => setFeaturedForm({ ...featuredForm, productMode: 'manual' })}
                      className="size-4 accent-primary"
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    Handpick exact products in your chosen display order.
                  </p>
                </label>
              </div>

              {/* In Auto mode: show notice */}
              {featuredForm.productMode === 'auto' && (
                <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-heading">
                    <span className="font-bold">Currently {products.filter((p) => p.featured).length} products</span> have the "Featured" flag active in your store catalog.
                  </div>
                  <Button size="sm" onClick={handleLoadAllFeaturedFromCatalog} type="button">
                    <Star size={14} /> Customize in Manual Mode
                  </Button>
                </div>
              )}

              {/* Manual Selection Manager */}
              {featuredForm.productMode === 'manual' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-heading">
                      Selected Featured Products ({featuredSelectedProducts.length})
                    </span>
                    <span className="text-[11px] text-muted">4 products show on homepage list</span>
                  </div>

                  {/* List of Selected Products with Reorder & Remove */}
                  <div className="space-y-2">
                    {featuredSelectedProducts.map((p, idx) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 rounded-lg border border-line bg-surface/50 p-2.5"
                      >
                        <span className="text-xs font-bold text-muted size-5 text-center">{idx + 1}.</span>
                        <AssetImage src={p.images?.[0]} alt="" compact className="size-10 rounded object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-heading">{p.name}</p>
                          <p className="text-[11px] text-muted">{p.category} · {formatPrice(getDefaultPack(p).salePrice)}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveFeaturedItem(idx, -1)}
                            className="size-7 rounded border border-line bg-white flex items-center justify-center text-muted hover:text-heading disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            disabled={idx === featuredSelectedProducts.length - 1}
                            onClick={() => moveFeaturedItem(idx, 1)}
                            className="size-7 rounded border border-line bg-white flex items-center justify-center text-muted hover:text-heading disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFeaturedToggle(p.id)}
                            className="size-7 rounded border border-line bg-white flex items-center justify-center text-muted hover:text-danger hover:bg-danger/10"
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add more products */}
                  <div className="pt-3 border-t border-line space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted block">
                      Add Products to Featured:
                    </label>
                    <div className="max-h-56 overflow-y-auto rounded-lg border border-line divide-y divide-line">
                      {filteredProducts.map((p) => {
                        const isSelected = featuredForm.productIds.includes(p.id)
                        return (
                          <div
                            key={p.id}
                            onClick={() => handleFeaturedToggle(p.id)}
                            className={cn(
                              'flex cursor-pointer items-center gap-3 p-2 text-xs transition-colors',
                              isSelected ? 'bg-primary/5 font-semibold' : 'hover:bg-surface',
                            )}
                          >
                            <div
                              className={cn(
                                'size-4 rounded border flex items-center justify-center',
                                isSelected ? 'bg-primary border-primary text-white' : 'border-line bg-white',
                              )}
                            >
                              {isSelected ? <Check size={12} /> : <Plus size={12} className="text-muted" />}
                            </div>
                            <AssetImage src={p.images?.[0]} alt="" compact className="size-8 rounded" />
                            <span className="truncate flex-1">{p.name}</span>
                            <span className="text-muted">{p.category}</span>
                            <span className="font-bold text-heading">{formatPrice(getDefaultPack(p).salePrice)}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Featured Products Live Preview */}
          <div className="space-y-4 lg:col-span-5 xl:col-span-4">
            <div className="sticky top-20 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Homepage Mini-List Preview</h2>

              <div className="card p-5 bg-white shadow-md rounded-2xl border border-line">
                <h3 className="rounded-xl bg-primary-light px-4 py-3 !text-lg text-heading font-bold after:mt-2 after:block after:h-0.5 after:w-16 after:bg-primary">
                  {featuredForm.title || 'Featured Products'}
                </h3>
                <ul className="mt-5 space-y-4">
                  {featuredSelectedProducts.slice(0, 4).map((product) => {
                    const pack = getDefaultPack(product)
                    return (
                      <li key={product.id} className="flex items-center gap-3 border-b border-line/60 pb-3 last:border-b-0 last:pb-0">
                        <AssetImage src={product.images?.[0]} alt="" compact className="size-14 shrink-0 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <Rating value={product.rating} count={product.reviewCount} />
                          <p className="mt-0.5 truncate font-heading text-sm font-bold text-heading">
                            {product.name} <span className="font-body text-xs font-normal text-muted">{pack.label}</span>
                          </p>
                          <Price regularPrice={pack.regularPrice} salePrice={pack.salePrice} />
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: DELIVERY RULES & OFFER BANNERS */}
      {/* ========================================================= */}
      {activeTab === 'delivery-banners' && (
        <div className="space-y-6">
          {/* Quick Jump to Payment & UPI Settings */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-2xs">
                <CreditCard size={20} />
              </span>
              <div>
                <p className="text-sm font-bold text-emerald-950">UPI ID, Standee QR &amp; Gateway Settings</p>
                <p className="text-xs text-emerald-800">Add or edit your shop QR Standee, custom UPI ID (VPA), and payment methods.</p>
              </div>
            </div>
            <Link
              to="/admin/payment-settings"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition shrink-0"
            >
              Open Payment &amp; UPI Panel →
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left Column (Settings & Banner CRUD) */}
            <div className="space-y-6 lg:col-span-7 xl:col-span-8">
              {/* Delivery Settings Card */}
              <div className="rounded-xl border border-line bg-white p-5 shadow-sm space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
                  <div>
                    <h2 className="text-base font-bold text-heading flex items-center gap-2">
                      <Truck size={19} className="text-primary" /> Free Delivery Rules & Threshold
                    </h2>
                    <p className="text-xs text-muted mt-0.5">
                      Configure threshold for free shipping, standard shipping fee, and policy texts.
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={deliveryForm.enabled}
                      onChange={(e) => handleDeliveryFieldChange('enabled', e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-line peer-checked:bg-primary peer-focus:outline-none after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
                    <span className="ml-3 text-sm font-medium text-heading">
                      {deliveryForm.enabled ? (
                        <Badge variant="success">Policy Active</Badge>
                      ) : (
                        <Badge variant="neutral">Disabled</Badge>
                      )}
                    </span>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
                      Free Delivery Above (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={deliveryForm.freeDeliveryAbove}
                        onChange={(e) => handleDeliveryFieldChange('freeDeliveryAbove', e.target.value)}
                        placeholder="700"
                        className="w-full rounded-lg border border-line bg-white py-2.5 pl-8 pr-4 text-base font-bold text-heading focus:border-primary focus:outline-none"
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-muted">
                      Cart orders at or above this amount receive 100% free delivery.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
                      Delivery Fee Below Threshold (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={deliveryForm.deliveryCharge}
                        onChange={(e) => handleDeliveryFieldChange('deliveryCharge', e.target.value)}
                        placeholder="40"
                        className="w-full rounded-lg border border-line bg-white py-2.5 pl-8 pr-4 text-base font-bold text-heading focus:border-primary focus:outline-none"
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-muted">
                      Standard fee applied when cart subtotal is less than threshold.
                    </p>
                  </div>
                </div>

                {/* Policy Notice & Sync Button */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="text-xs text-heading space-y-0.5">
                    <p className="font-bold text-primary flex items-center gap-1.5">
                      <CheckCircle2 size={15} /> Dynamic Site Integration
                    </p>
                    <p className="text-muted">
                      Updating this threshold automatically reflects in TopBar, Features bar, Cart calculations, and Checkout totals.
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    onClick={syncThresholdToDeliveryBanner}
                    className="shrink-0"
                  >
                    <RotateCcw size={14} /> Sync to Banner & Text
                  </Button>
                </div>
              </div>

              {/* GST & TAX CONFIGURATION CARD */}
              <div className="rounded-xl border border-line bg-white p-5 shadow-sm space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
                  <div>
                    <h2 className="text-base font-bold text-heading flex items-center gap-2">
                      <Receipt size={19} className="text-primary" /> GST &amp; Tax Configuration
                    </h2>
                    <p className="text-xs text-muted mt-0.5">
                      Configure GST tax rate (%), display name, and GSTIN number for cart, checkout, and invoices.
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={taxForm.enabled}
                      onChange={(e) => setTaxForm((curr) => ({ ...curr, enabled: e.target.checked }))}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-line peer-checked:bg-primary peer-focus:outline-none after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
                    <span className="ml-3 text-sm font-medium text-heading">
                      {taxForm.enabled ? (
                        <Badge variant="success">GST Active</Badge>
                      ) : (
                        <Badge variant="neutral">Disabled</Badge>
                      )}
                    </span>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
                      GST Rate (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="28"
                        step="0.5"
                        value={taxForm.gstRate}
                        onChange={(e) => setTaxForm((curr) => ({ ...curr, gstRate: e.target.value }))}
                        placeholder="5"
                        className="w-full rounded-lg border border-line bg-white py-2.5 pl-4 pr-8 text-base font-bold text-heading focus:border-primary focus:outline-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted">%</span>
                    </div>
                    {/* Rate presets */}
                    <div className="mt-2 flex items-center gap-1.5">
                      {[0, 5, 12, 18].map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => setTaxForm((curr) => ({ ...curr, gstRate: rate }))}
                          className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold transition ${
                            Number(taxForm.gstRate) === rate
                              ? 'border-primary bg-primary text-white'
                              : 'border-line text-muted hover:border-heading'
                          }`}
                        >
                          {rate}%
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
                      Tax Label Name
                    </label>
                    <input
                      type="text"
                      value={taxForm.taxName}
                      onChange={(e) => setTaxForm((curr) => ({ ...curr, taxName: e.target.value }))}
                      placeholder="GST"
                      className="w-full rounded-lg border border-line bg-white py-2.5 px-3 text-sm font-semibold text-heading focus:border-primary focus:outline-none"
                    />
                    <p className="mt-1 text-[11px] text-muted">
                      Displayed on Cart and Checkout summary (e.g. GST).
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
                      Store GSTIN / Tax ID
                    </label>
                    <input
                      type="text"
                      value={taxForm.gstNumber}
                      onChange={(e) => setTaxForm((curr) => ({ ...curr, gstNumber: e.target.value }))}
                      placeholder="09AAACH7409R1ZZ"
                      className="w-full rounded-lg border border-line bg-white py-2.5 px-3 text-sm font-semibold text-heading uppercase focus:border-primary focus:outline-none"
                    />
                    <p className="mt-1 text-[11px] text-muted">
                      Official 15-digit GST identification number.
                    </p>
                  </div>
                </div>

                {/* Live Preview Box */}
                <div className="rounded-xl bg-surface p-4 border border-line">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-heading mb-2.5">
                    <span className="font-bold text-muted uppercase tracking-wider">Live Calculation Preview (Sample ₹800 Cart)</span>
                    <span className="text-primary font-bold">
                      {taxForm.enabled ? `${taxForm.gstRate}% ${taxForm.taxName} Active` : 'GST Disabled'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="rounded-lg bg-white p-2.5 border border-line">
                      <span className="text-muted block text-[11px]">Subtotal</span>
                      <span className="font-bold text-heading">₹800</span>
                    </div>
                    <div className="rounded-lg bg-white p-2.5 border border-line">
                      <span className="text-muted block text-[11px]">Delivery (&gt; ₹{deliveryForm.freeDeliveryAbove})</span>
                      <span className="font-bold text-accent">Free (₹0)</span>
                    </div>
                    <div className="rounded-lg bg-white p-2.5 border border-line">
                      <span className="text-muted block text-[11px]">{taxForm.taxName} ({taxForm.enabled ? taxForm.gstRate : 0}%)</span>
                      <span className="font-bold text-heading">
                        {taxForm.enabled ? `₹${Math.round((800 * (Number(taxForm.gstRate) || 0)) / 100)}` : '₹0'}
                      </span>
                    </div>
                    <div className="rounded-lg bg-primary-pale p-2.5 border border-primary/20">
                      <span className="text-primary font-semibold block text-[11px]">Final Total</span>
                      <span className="font-black text-primary text-sm">
                        ₹{800 + (taxForm.enabled ? Math.round((800 * (Number(taxForm.gstRate) || 0)) / 100) : 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Offer Banners Manager Card */}
              <div className="rounded-xl border border-line bg-white p-5 shadow-sm space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
                  <div>
                    <h2 className="text-base font-bold text-heading flex items-center gap-2">
                      <Layers size={19} className="text-primary" /> Homepage Offer Banners
                    </h2>
                    <p className="text-xs text-muted mt-0.5">
                      Add, edit, or delete promotional offer banners shown beneath the flash sale on homepage.
                    </p>
                  </div>
                  <Button type="button" size="sm" onClick={handleOpenAddBanner}>
                    <Plus size={15} /> Add Offer Banner
                  </Button>
                </div>

                {/* Banner list */}
                {bannersList.length === 0 ? (
                  <EmptyState
                    title="No offer banners"
                    text="Click the Add button above to create a promotional banner."
                  />
                ) : (
                  <div className="space-y-3">
                    {bannersList.map((banner) => {
                      const isFreeDeliveryBanner =
                        banner.id === 'ob2' ||
                        (banner.title && banner.title.toLowerCase().includes('free delivery'))
                      return (
                        <div
                          key={banner.id}
                          className={cn(
                            'flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border p-4 transition-all',
                            banner.active !== false ? 'border-line bg-white shadow-xs' : 'border-line/60 bg-surface/50 opacity-60',
                          )}
                        >
                          {/* Banner thumbnail preview */}
                          <div className="size-16 sm:size-20 shrink-0 overflow-hidden rounded-lg border border-line bg-surface flex items-center justify-center p-1">
                            <AssetImage
                              src={banner.image}
                              alt={banner.title || 'Banner'}
                              compact
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-sm text-heading truncate">
                                {banner.title || (banner.imageOnly ? 'Full Graphic Banner' : 'Untitled Banner')}
                              </span>
                              {isFreeDeliveryBanner && (
                                <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                                  <Truck size={12} /> Delivery Offer
                                </span>
                              )}
                              {banner.active !== false ? (
                                <Badge variant="success">Active</Badge>
                              ) : (
                                <Badge variant="neutral">Hidden</Badge>
                              )}
                              <span className="text-[11px] font-medium text-muted rounded bg-surface px-2 py-0.5 border border-line">
                                Tone: {banner.tone || 'default'}
                              </span>
                              {banner.imageOnly && (
                                <span className="text-[11px] font-medium text-muted rounded bg-surface px-2 py-0.5 border border-line">
                                  Full Graphic
                                </span>
                              )}
                            </div>
                            {banner.text && (
                              <p className="text-xs text-muted line-clamp-1">{banner.text}</p>
                            )}
                            <p className="text-[11px] text-muted">
                              Target link: <code className="text-primary font-mono">{banner.link || '/shop'}</code>
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-line">
                            <button
                              type="button"
                              onClick={() => handleToggleBannerActive(banner.id)}
                              className={cn(
                                'flex size-8 items-center justify-center rounded-lg border transition-colors',
                                banner.active !== false
                                  ? 'border-line bg-white text-muted hover:text-heading hover:bg-surface'
                                  : 'border-primary/30 bg-primary/10 text-primary',
                              )}
                              title={banner.active !== false ? 'Hide from homepage' : 'Show on homepage'}
                            >
                              {banner.active !== false ? <Eye size={15} /> : <EyeOff size={15} />}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditBanner(banner)}
                              className="flex size-8 items-center justify-center rounded-lg border border-line bg-white text-muted hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors"
                              title="Edit Banner"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBanner(banner.id)}
                              className="flex size-8 items-center justify-center rounded-lg border border-line bg-white text-muted hover:text-danger hover:border-danger/40 hover:bg-danger/5 transition-colors"
                              title="Delete Banner"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Live Offer Banners Preview */}
            <div className="space-y-4 lg:col-span-5 xl:col-span-4">
              <div className="sticky top-20 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-muted">
                    Homepage Live Preview
                  </h2>
                  <div className="flex items-center rounded-lg border border-line bg-white p-0.5 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setPreviewViewport('desktop')}
                      className={cn(
                        'px-2.5 py-1 rounded-md transition-colors',
                        previewViewport === 'desktop' ? 'bg-primary text-white shadow-xs' : 'text-muted hover:text-heading',
                      )}
                    >
                      Desktop
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewViewport('mobile')}
                      className={cn(
                        'px-2.5 py-1 rounded-md transition-colors',
                        previewViewport === 'mobile' ? 'bg-primary text-white shadow-xs' : 'text-muted hover:text-heading',
                      )}
                    >
                      Mobile
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-line bg-surface/50 p-4 shadow-sm">
                  <p className="text-xs text-muted mb-3 font-medium">
                    This is exactly how active offer banners appear on the homepage:
                  </p>
                  <div
                    className={cn(
                      'space-y-4 transition-all duration-300',
                      previewViewport === 'mobile' ? 'max-w-[340px] mx-auto' : 'w-full',
                    )}
                  >
                    {bannersList
                      .filter((b) => b.active !== false)
                      .map((banner, idx) => (
                        <div key={banner.id} className="overflow-hidden rounded-2xl shadow-xs">
                          <OfferBanner banner={banner} buttonVariant={idx % 2 === 0 ? 'accent' : 'white'} />
                        </div>
                      ))}
                    {bannersList.filter((b) => b.active !== false).length === 0 && (
                      <div className="rounded-xl border border-dashed border-line bg-white p-6 text-center text-xs text-muted">
                        No active banners to preview. Toggle a banner active or add a new one.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Edit / Add Modal */}
          {editingBanner && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-heading/50 backdrop-blur-xs animate-in fade-in duration-200">
              <div
                className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-line bg-white p-6 shadow-2xl space-y-5"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      {isNewBanner ? <Plus size={18} /> : <Edit2 size={18} />}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-heading">
                        {isNewBanner ? 'Add New Offer Banner' : 'Edit Offer Banner'}
                      </h3>
                      <p className="text-xs text-muted">
                        Customize graphic, tone, titles, and link for this banner.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingBanner(null)}
                    className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-heading"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveBannerModal} className="space-y-4">
                  {/* Style Mode Switch */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">
                      Banner Display Style
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label
                        className={cn(
                          'flex cursor-pointer items-center justify-between rounded-xl border p-3 text-xs font-bold transition-all',
                          !editingBanner.imageOnly
                            ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                            : 'border-line text-heading hover:bg-surface',
                        )}
                      >
                        <span>Text + Graphic Card</span>
                        <input
                          type="radio"
                          name="bannerStyle"
                          checked={!editingBanner.imageOnly}
                          onChange={() => setEditingBanner({ ...editingBanner, imageOnly: false })}
                          className="size-4 accent-primary"
                        />
                      </label>
                      <label
                        className={cn(
                          'flex cursor-pointer items-center justify-between rounded-xl border p-3 text-xs font-bold transition-all',
                          editingBanner.imageOnly
                            ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                            : 'border-line text-heading hover:bg-surface',
                        )}
                      >
                        <span>Full Graphic Image</span>
                        <input
                          type="radio"
                          name="bannerStyle"
                          checked={editingBanner.imageOnly}
                          onChange={() => setEditingBanner({ ...editingBanner, imageOnly: true })}
                          className="size-4 accent-primary"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Title & Description if not imageOnly */}
                  {!editingBanner.imageOnly && (
                    <>
                      <Input
                        label="Banner Title"
                        value={editingBanner.title}
                        onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                        placeholder="e.g. Free delivery on orders above ₹499"
                        required
                      />
                      <Textarea
                        label="Description / Subtitle"
                        rows={2}
                        value={editingBanner.text}
                        onChange={(e) => setEditingBanner({ ...editingBanner, text: e.target.value })}
                        placeholder="e.g. On all orders above ₹499 - fresh groceries at your doorstep"
                      />

                      {/* Tone selector */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted">
                            Background Color / Tone
                          </label>
                          <span className="text-[11px] font-mono text-muted">
                            Selected: {editingBanner.tone || 'default'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { id: 'darkGreen', label: 'Dark Green', hex: '#074709' },
                            { id: 'peach', label: 'Peach', hex: '#fdebe4' },
                            { id: 'green', label: 'Fresh Green', hex: '#1b8a5a' },
                            { id: 'teal', label: 'Teal Ocean', hex: '#008f9c' },
                            { id: 'yellow', label: 'Amber Gold', hex: '#f7be2d' },
                            { id: 'blue', label: 'Sky Blue', hex: '#dceefc' },
                            { id: 'slate', label: 'Slate Blue', hex: '#b8ccde' },
                            { id: 'gray', label: 'Soft Gray', hex: '#f4f5f7' },
                          ].map((t) => {
                            const isSelected =
                              editingBanner.tone === t.id ||
                              editingBanner.tone === t.hex ||
                              (t.id === 'darkGreen' && editingBanner.tone === '#074709')
                            return (
                              <button
                                key={t.id}
                                type="button"
                                onClick={() => setEditingBanner({ ...editingBanner, tone: t.id })}
                                className={cn(
                                  'flex items-center gap-2 rounded-lg border p-2 text-xs font-medium transition-all text-left',
                                  isSelected
                                    ? 'border-primary ring-2 ring-primary/40 shadow-xs bg-primary/5 font-bold'
                                    : 'border-line hover:border-heading/30 bg-white',
                                )}
                              >
                                <span
                                  className="size-4 rounded-full border border-black/10 shrink-0 shadow-xs"
                                  style={{ backgroundColor: t.hex }}
                                />
                                <span className="truncate">{t.label}</span>
                              </button>
                            )
                          })}
                        </div>

                        {/* Custom Color Picker input */}
                        <div className="flex items-center gap-3 rounded-xl border border-line bg-surface/50 p-2.5">
                          <span className="text-xs font-semibold text-heading whitespace-nowrap">
                            Custom Color:
                          </span>
                          <input
                            type="color"
                            value={
                              editingBanner.tone?.startsWith('#')
                                ? editingBanner.tone
                                : editingBanner.tone === 'darkGreen'
                                  ? '#074709'
                                  : editingBanner.tone === 'peach'
                                    ? '#fdebe4'
                                    : editingBanner.tone === 'green'
                                      ? '#1b8a5a'
                                      : editingBanner.tone === 'teal'
                                        ? '#008f9c'
                                        : '#074709'
                            }
                            onChange={(e) => setEditingBanner({ ...editingBanner, tone: e.target.value })}
                            className="size-8 cursor-pointer rounded border border-line bg-transparent p-0"
                            title="Pick any custom background color"
                          />
                          <input
                            type="text"
                            value={editingBanner.tone || ''}
                            onChange={(e) => setEditingBanner({ ...editingBanner, tone: e.target.value })}
                            placeholder="#074709 or darkGreen"
                            className="flex-1 rounded border border-line bg-white px-3 py-1.5 text-xs font-mono text-heading focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Graphic / Image Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted block">
                      Banner Image / Graphic
                    </label>

                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] text-muted">Presets:</span>
                      {[
                        { label: '🚚 Free Delivery', path: 'banners/Free Devilevery.png' },
                        { label: '🏷️ 20% Off', path: 'banners/20-off.png' },
                        { label: '🍳 Kitchen Offers', path: 'banners/offer-kitchen.png' },
                        { label: '⚡ Deal of Day', path: 'banners/Deal of the Day.png' },
                      ].map((preset) => (
                        <button
                          key={preset.path}
                          type="button"
                          onClick={() => setEditingBanner({ ...editingBanner, image: preset.path })}
                          className={cn(
                            'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                            editingBanner.image === preset.path
                              ? 'border-primary bg-primary text-white'
                              : 'border-line bg-surface text-heading hover:bg-line/60',
                          )}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    <ImageUploader
                      label="Or Upload Custom Banner Image"
                      multiple={false}
                      images={editingBanner.image ? [editingBanner.image] : []}
                      onChange={(images) => {
                        const nextImg =
                          typeof images === 'function'
                            ? images(editingBanner.image ? [editingBanner.image] : [])
                            : images
                        setEditingBanner({ ...editingBanner, image: nextImg[0] || '' })
                      }}
                    />
                  </div>

                  <Input
                    label="Button / Click Link"
                    value={editingBanner.link}
                    onChange={(e) => setEditingBanner({ ...editingBanner, link: e.target.value })}
                    placeholder="e.g. /shop or /category/spices"
                  />

                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-heading">
                      <input
                        type="checkbox"
                        checked={editingBanner.active !== false}
                        onChange={(e) => setEditingBanner({ ...editingBanner, active: e.target.checked })}
                        className="size-4 rounded accent-primary"
                      />
                      <span>Active (Show this banner on store homepage)</span>
                    </label>
                  </div>

                  {/* Live Mini Preview inside Modal */}
                  <div className="pt-3 border-t border-line space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted">
                      Card Preview:
                    </label>
                    <div className="overflow-hidden rounded-xl border border-line shadow-xs">
                      <OfferBanner banner={editingBanner} />
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingBanner(null)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Check size={16} /> Save Banner
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
