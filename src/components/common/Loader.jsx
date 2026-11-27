import { LoaderCircle } from 'lucide-react'

// `page` fills the viewport, so the footer does not sit high up and then jump
// down once the content arrives.
export default function Loader({ label = 'Loading...', page = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-16 ${page ? 'min-h-screen' : 'min-h-[40vh]'}`}
      role="status"
    >
      <LoaderCircle size={36} className="animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
