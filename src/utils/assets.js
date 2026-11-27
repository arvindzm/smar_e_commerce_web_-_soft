// Finds image files placed in the src/assets folders (logo, banners, products, images)
// AND maps static files placed in public/products/ cleanly.
const files = import.meta.glob('../assets/**/*.{png,jpg,jpeg,webp,avif,svg,jfif,PNG,JPG,JPEG,WEBP,AVIF,SVG,JFIF}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const PUBLIC_CATEGORY_FILES = new Set([
  'millets-supergrains.jpg',
  'flours-besan.jpg',
  'pulses-dals.jpg',
  'rice-grains.jpg',
])

// Exact filenames stored in frontend/public/products/
const PUBLIC_PRODUCT_FILES = new Set([
  'adrak-powder-back.jpg',
  'adrak-powder-front.jpg',
  'bajra-atta-back.jpg',
  'bajra-atta-front.jpg',
  'basmati-rice.jpg',
  'besan-back.jpg',
  'besan-front.jpg',
  'chana-dal.jpg',
  'chane-ka-atta-back.jpg',
  'chane-ka-atta-front.jpg',
  'channe-ka-sattu.jpg',
  'chawal-atta-back.jpg',
  'chawal-atta-front.jpg',
  'desi-chana.jpg',
  'dhaniya-powder-back.jpg',
  'dhaniya-powder-front.jpg',
  'five-millet-combo.jpg',
  'garam-masala.jpg',
  'gehu-atta-back.jpg',
  'gehu-atta-front.jpg',
  'haldi-powder-back.jpg',
  'haldi-powder-front.jpg',
  'jau-atta-back.jpg',
  'jau-atta-front.jpg',
  'jau-chana-sattu-back.jpg',
  'jau-chana-sattu-front.jpg',
  'jau-daliya-back.jpg',
  'jau-daliya-cracked.jpg',
  'jau-daliya-front.jpg',
  'jau-ka-sattu.jpg',
  'jeera-powder-back.jpg',
  'jeera-powder-front.jpg',
  'jeera-whole-back.jpg',
  'jeera-whole-front.jpg',
  'jowar-atta-back.jpg',
  'jowar-atta-front.jpg',
  'jowar-bajra-ragi.jpg',
  'kangni-millet.jpg',
  'kodo-millet-flour.jpg',
  'kutki-millet.jpg',
  'lal-mirch-back.jpg',
  'lal-mirch-front.jpg',
  'makka-atta-back.jpg',
  'makka-atta-front.jpg',
  'masoor-dal.jpg',
  'moong-dal.jpg',
  'moringa-powder-back.jpg',
  'moringa-powder-front.jpg',
  'multigrain-atta.jpg',
  'onion-flakes-back.jpg',
  'onion-flakes-pack.jpg',
  'ragi-atta-back.jpg',
  'ragi-atta-front.jpg',
  'soya-flour-back.jpg',
  'soya-flour-front.jpg',
  'wheat-bran-flour.jpg',
  'wheat-daliya.jpg',
])

// Build lookup maps for fast, case-insensitive and fuzzy matching
const normalizedFiles = Object.keys(files).reduce((acc, key) => {
  acc[key.toLowerCase()] = files[key]
  return acc
}, {})

// Keyword mappings for common food items to ensure fallback photos never show blank boxes
const foodKeywordMap = [
  { match: ['daliya', 'jau', 'barley'], target: 'jauu ki daliya' },
  { match: ['sattu'], target: 'chana besan' },
  { match: ['millet', 'jowar', 'bajra', 'ragi', 'multigrain'], target: 'whole wheat flour' },
  { match: ['besan', 'gram flour'], target: 'chana besan' },
  { match: ['wheat', 'atta', 'gehun'], target: 'whole wheat flour' },
  { match: ['rice flour'], target: 'rice flour' },
  { match: ['turmeric', 'haldi'], target: 'turmeric powder' },
  { match: ['coriander', 'dhaniya'], target: 'coriander powder' },
  { match: ['chilli', 'mirch', 'chilly'], target: 'red chilli powder' },
  { match: ['cumin powder', 'jeera powder'], target: 'cumin powder' },
  { match: ['cumin', 'jeera'], target: 'jeeera powder' },
  { match: ['ginger', 'adrak', 'sonth'], target: 'adrak powder' },
  { match: ['moringa', 'sahjan'], target: 'moringa powder' },
  { match: ['garam masala', 'kitchen king', 'chaat masala', 'sabzi masala', 'blend'], target: 'blended masalas' },
  { match: ['dal', 'pulse', 'toor', 'moong', 'chana dal', 'masoor'], target: 'pulses' },
  { match: ['rice', 'basmati', 'chawal', 'masoori'], target: 'rice' },
  { match: ['pepper', 'whole spices', 'clove', 'elaichi', 'spices'], target: 'whole spices' },
  { match: ['ground', 'powder'], target: 'ground spices' },
  { match: ['flour', 'flours'], target: 'flours' },
  { match: ['kiwi'], target: 'products/kiwi-candy.jpg' },
  { match: ['amla'], target: 'products/amla-candy.jpg' },
  { match: ['biscuit', 'cookies'], target: 'products/barley-biscuits.jpg' },
  { match: ['sev', 'namkeen'], target: 'products/makka-sev.jpg' },
  { match: ['macaroni', 'pasta'], target: 'products/multigrain-macaroni.jpg' },
  { match: ['sewai', 'vermicelli'], target: 'products/multigrain-sewai.jpg' },
  { match: ['alsi', 'flaxseed'], target: 'products/flaxseed-powder.jpg' },
  { match: ['onion', 'pyaz', 'lachha'], target: 'products/onion-flakes.jpg' },
]

export function resolveImage(path) {
  if (!path) return null
  // Full external URLs and in-memory blobs (data: / blob:) are used as they are.
  if (/^(https?:|data:|blob:)/.test(path)) return path

  // Strip leading slash if present
  const cleanPath = path.replace(/^\/+/, '')
  const target = `../assets/${cleanPath}`

  // 1. Exact match in bundled src/assets
  if (files[target]) return files[target]
  if (normalizedFiles[target.toLowerCase()]) return normalizedFiles[target.toLowerCase()]

  // 2. Direct match in public/products/ or public/categories/
  if (cleanPath.toLowerCase().startsWith('products/')) {
    const fileName = cleanPath.split('/').pop()
    if (PUBLIC_PRODUCT_FILES.has(fileName) || PUBLIC_PRODUCT_FILES.has(fileName.toLowerCase())) {
      return `/products/${fileName}`
    }
  }
  if (cleanPath.toLowerCase().startsWith('categories/')) {
    const fileName = cleanPath.split('/').pop()
    if (PUBLIC_CATEGORY_FILES.has(fileName) || PUBLIC_CATEGORY_FILES.has(fileName.toLowerCase())) {
      return `/categories/${fileName}`
    }
  }

  // 3. Match without extension in src/assets (e.g. requested .png but exists as .jpg)
  const targetNoExt = target.replace(/\.[^/.]+$/, '').toLowerCase()
  const matchByBase = Object.keys(normalizedFiles).find((k) => k.replace(/\.[^/.]+$/, '') === targetNoExt)
  if (matchByBase) return normalizedFiles[matchByBase]

  // 4. Filename normalization (strip numeric suffixes like -1, -2, 1, 2)
  const rawBase = cleanPath.split('/').pop().replace(/\.[^/.]+$/, '').toLowerCase()
  const nameOnly = rawBase.replace(/[-_\s]+[0-9]+$/, '')
  const nameNormalized = nameOnly.replace(/[-_\s]+/g, ' ')

  // Look for exact base match or contains match in src/assets
  const matchByName = Object.keys(normalizedFiles).find((k) => {
    const kName = k.split('/').pop().replace(/\.[^/.]+$/, '').toLowerCase()
    const kNormalized = kName.replace(/[-_\s]+/g, ' ')
    return kName === nameOnly || kNormalized === nameNormalized || kNormalized.includes(nameNormalized)
  })
  if (matchByName) return normalizedFiles[matchByName]

  // 5. Keyword-based fallback for food catalog
  for (const entry of foodKeywordMap) {
    if (entry.match.some((term) => nameNormalized.includes(term))) {
      const match = Object.keys(normalizedFiles).find((k) => {
        const kName = k.split('/').pop().replace(/\.[^/.]+$/, '').toLowerCase()
        return kName.includes(entry.target)
      })
      if (match) return normalizedFiles[match]
    }
  }

  // 6. Any matching category picture
  if (cleanPath.includes('categories/')) {
    const fallbackCategory = Object.keys(normalizedFiles).find((k) => k.includes('categories/'))
    if (fallbackCategory) return normalizedFiles[fallbackCategory]
  }

  return null
}
