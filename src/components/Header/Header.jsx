import { useCallback, useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { getCategories } from '../../services/categoryService'
import Navbar from '../Navbar/Navbar'
import MainHeader from './MainHeader'
import MobileMenu from './MobileMenu'
import TopBar from './TopBar'

export default function Header() {
  const { data } = useFetch(getCategories)
  const categories = data || []
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <header>
      <TopBar />
      <MainHeader categories={categories} onMenuOpen={() => setMenuOpen(true)} />
      <Navbar categories={categories} />
      <MobileMenu open={menuOpen} onClose={closeMenu} categories={categories} />
    </header>
  )
}
