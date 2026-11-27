import CountdownBanner from '../../../components/Banner/CountdownBanner'

export default function CountdownBannerSection({ banners }) {
  return (
    <section className="container-page section-gap" aria-label="Limited time offers">
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
        {banners.map((banner, index) => (
          <CountdownBanner
            key={banner.id}
            banner={banner}
            timerVariant={index % 2 === 0 ? 'white' : 'primary'}
            buttonVariant={index % 2 === 0 ? 'primary' : 'accent'}
          />
        ))}
      </div>
    </section>
  )
}
