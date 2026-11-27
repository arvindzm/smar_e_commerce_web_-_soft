// Section title on the left with optional controls (tabs, arrows, links) on the right.
export default function SectionHeading({ title, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 lg:mb-8">
      <h2 className="!text-2xl lg:!text-[1.75rem]">{title}</h2>
      {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
    </div>
  )
}
