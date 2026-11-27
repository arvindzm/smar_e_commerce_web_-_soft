// Title, optional description, and room for an action button on the right.
export default function AdminPageHeader({ title, description, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="!text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-3">{children}</div>}
    </div>
  )
}
