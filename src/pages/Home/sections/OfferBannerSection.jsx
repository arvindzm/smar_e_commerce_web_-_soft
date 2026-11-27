import OfferBanner from '../../../components/Banner/OfferBanner'

export default function OfferBannerSection({ banners }) {
  return (
    <section className="container-page section-gap" aria-label="Special offers">
      <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-5">
        {banners.map((banner, index) => (
          <OfferBanner key={banner.id} banner={banner} buttonVariant={index % 2 === 0 ? 'accent' : 'white'} />
        ))}
      </div>
    </section>
  )
}
