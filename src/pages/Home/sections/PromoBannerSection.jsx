import PromoBanner from '../../../components/Banner/PromoBanner'

export default function PromoBannerSection({ banners }) {
  return (
    <section className="container-page section-gap" aria-label="Featured offers">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
        {banners.map((banner) => (
          <PromoBanner key={banner.id} banner={banner} />
        ))}
      </div>
    </section>
  )
}
