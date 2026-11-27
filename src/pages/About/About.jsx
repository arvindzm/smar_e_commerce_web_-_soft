import { BadgeCheck, HandCoins, Package, Wheat } from 'lucide-react'
import AssetImage from '../../components/common/AssetImage'
import Breadcrumb from '../../components/common/Breadcrumb'
import Button from '../../components/common/Button'
import { about } from '../../data/content'
import { site } from '../../data/site'
import { usePageTitle } from '../../hooks/usePageTitle'

const valueIcons = [Wheat, BadgeCheck, HandCoins, Package]

export default function About() {
  usePageTitle('About Us')

  return (
    <>
      <Breadcrumb title="About Us" items={[{ label: 'About' }]} />

      <div className="container-page pt-8 lg:pt-12">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h1 className="!text-3xl">About {site.name}</h1>
            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-primary">
              A Brand by {site.legalName} · FSSAI Central Lic: {site.fssaiNumber} · DGFT IEC: {site.ieCode}
            </p>
            <p className="mt-4">{about.intro}</p>
            <p className="mt-3">{about.story}</p>
            <Button to="/shop" size="lg" className="mt-6">
              Browse our products
            </Button>
          </div>
          <AssetImage src="banners/Deal of the Day.png" alt="SMAR Store and Kitchen" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-sm" />
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {about.stats.map((stat) => (
            <li key={stat.label} className="rounded-2xl bg-primary-pale p-5 text-center">
              <p className="font-heading text-3xl font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-sm">{stat.label}</p>
            </li>
          ))}
        </ul>
      </div>

      <section className="container-page section-gap">
        <h2 className="text-center">What we stand for</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {about.values.map((value, index) => {
            const Icon = valueIcons[index % valueIcons.length]
            return (
              <li key={value.title} className="card p-6 text-center">
                <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent-light text-accent-dark">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3 className="mt-4 !text-lg">{value.title}</h3>
                <p className="mt-2 text-sm">{value.text}</p>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}
