// Table that scrolls sideways on small screens instead of breaking the layout.
// columns: [{ key, header, className, render(row) }]
export default function DataTable({ columns, rows, getRowKey, caption, minWidth = 'min-w-2xl' }) {
  return (
    <div className="card overflow-hidden border border-line shadow-2xs">
      <div className="overflow-x-auto">
        <table className={`w-full ${minWidth}`}>
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr className="border-b border-line bg-surface/80 text-left">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={getRowKey(row)} className="border-b border-line/80 last:border-0 hover:bg-primary-pale/20 transition-colors">
                {columns.map((column) => (
                  <td key={column.key} className={`px-4 py-3.5 text-sm ${column.className || ''}`}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
