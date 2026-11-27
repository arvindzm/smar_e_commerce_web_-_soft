import { SearchX } from 'lucide-react'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'
import { usePageTitle } from '../hooks/usePageTitle'

export default function NotFound() {
  usePageTitle('Page Not Found')

  return (
    <div className="container-page py-10">
      <EmptyState
        icon={SearchX}
        title="Page not found"
        text="The page you are looking for does not exist or has been moved."
        action={<Button to="/">Back to Home</Button>}
      />
    </div>
  )
}
