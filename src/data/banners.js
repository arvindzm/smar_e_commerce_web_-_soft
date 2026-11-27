// Homepage promotional banners and slider configuration.
const daysFromNow = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000)

export const heroSlides = [
  {
    id: 'h0',
    title: 'SMAR - Pure & Hygienic Grocery Staples',
    link: '/shop',
    image: 'banners/banner-first.jpeg',
  },
  {
    id: 'h1',
    title: 'SMAR Jau Ka Daliya - Healthy Goodness',
    link: '/product/jau-ka-daliya',
    image: 'banners/smar-jau-ka-daliya-banner.png',
  },
  {
    id: 'h2',
    title: 'SMAR Jau Sattu - Natural Energy',
    link: '/product/jau-ka-sattu',
    image: 'banners/SMAR -Jau-Sattu-Natural-Energy-Banner.png',
  },
  {
    id: 'h3',
    title: 'SMAR Chana Sattu - Desi Strength, Everyday Health',
    link: '/product/channe-ka-sattu',
    image: 'banners/SMAR-Chana-Sattu_ Desi-Strength,-Everyday-Health.png',
  },
  {
    id: 'h4',
    title: 'SMAR Sattu - Desi Swad, Desi Taakat',
    link: '/product/jau-channe-sattu',
    image: 'banners/smar-sattu-desi-taakat-banner.png',
  },
  {
    id: 'h5',
    title: 'SMAR Multigrain Atta',
    link: '/product/multigrain-atta',
    image: 'banners/SMAR-Multigrain-Atta-Banner.png',
  },
  {
    id: 'h6',
    title: 'SMAR Jowar, Bajra & Ragi Millets Showcase',
    link: '/product/jowar-bajra-ragi',
    image: 'banners/Jowar-Bajra-Ragi-Millet-Showcase.png',
  },
]

export const promoBanners = [
  { id: 'pb1', title: 'Flours & Besan', subtitle: 'Atta, Besan & Fine Flours', startingAt: 55, link: '/category/flours', image: 'images/Whole Wheat Flour.JPG', tone: 'teal' },
  { id: 'pb2', title: 'Ground Spices', subtitle: 'Pure & Aromatic Masale', startingAt: 32, link: '/category/ground-spices', image: 'images/Turmeric Powder.JPG', tone: 'yellow' },
  { id: 'pb3', title: 'Pulses & Dals', subtitle: 'Unpolished & Nutrient-Rich', startingAt: 95, link: '/category/pulses', image: 'images/Pulses.jpg', tone: 'slate' },
  { id: 'pb4', title: 'Rice & Grains', subtitle: 'Aged Basmati & Pure Grains', startingAt: 149, link: '/category/rice', image: 'images/Rice.jpg', tone: 'green' },
]

export const countdownBanners = [
  { id: 'cb1', title: 'Multigrain & Millets Offer', text: 'Time remaining until the end of the offer.', endsAt: daysFromNow(4), link: '/category/millets-supergrains', image: 'banners/SMAR-Multigrain-Atta-Banner.png', tone: 'gray' },
  { id: 'cb2', title: 'Supergrains Ration Saver', text: 'Time remaining until the end of the offer.', endsAt: daysFromNow(9), link: '/shop', image: 'banners/Jowar-Bajra-Ragi-Millet-Showcase.png', tone: 'yellow' },
]

export const offerBanners = [
  { id: 'ob1', title: '', text: '', link: '/shop', image: 'banners/20-off.png', imageOnly: true, tone: 'peach' },
  { id: 'ob2', title: 'Free delivery on orders above ₹700', text: 'On all orders above ₹700 - fresh groceries at your doorstep', link: '/shop', image: 'banners/Free Devilevery.png', tone: 'darkGreen' },
]

export const hotDeal = { tag: 'Limited time', title: 'Deals of the day', text: 'Save more on kitchen essentials', endsAt: daysFromNow(2), link: '/shop', image: 'banners/Deal of the Day.png' }

export const coupon = { code: 'FRESH20', text: 'Use this code to get 20% off on your first purchase' }

export const dealOfTheWeekEndsAt = daysFromNow(6)

export const sideBanner = { title: 'Stock up for the month', text: 'Bigger packs, better prices', link: '/shop', image: 'banners/smar-jau-ka-daliya-banner.png' }

export const newsletterImage = 'banners/first-order-1.png'
