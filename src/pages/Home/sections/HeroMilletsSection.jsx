import { Link } from 'react-router-dom'
import SectionHeading from '../../../components/common/SectionHeading'
import ProductCard from '../../../components/ProductCard/ProductCard'

export default function HeroMilletsSection({ products }) {
  // 6 Hero Products specified by user:
  // Jau ka daliya, Jau ka Sattu, Channe ka Sattu, Jau & channe ka sattu, Multigrain atta, Jowar bajra ragi
  const heroProducts = products.filter(
    (p) => p.categoryId === 'c_millets' || p.id.startsWith('p_hero_'),
  )

  if (!heroProducts.length) return null

  return (
    <section className="container-page section-gap" aria-label="Millets and Sattu">
      <SectionHeading title="Millets & Shuddh Sattu">
        <Link to="/category/millets-supergrains" className="text-sm font-semibold text-primary hover:underline">
          View All Millets →
        </Link>
      </SectionHeading>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 md:grid-cols-3 lg:grid-cols-6">
        {heroProducts.slice(0, 6).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
