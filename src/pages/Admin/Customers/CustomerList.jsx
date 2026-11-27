import { CheckCircle2, Download, IndianRupee, Search, UserCheck, Users } from 'lucide-react'
import { useState } from 'react'
import AdminPageHeader from '../../../components/Admin/AdminPageHeader'
import DataTable from '../../../components/Admin/DataTable'
import StatCard from '../../../components/Admin/StatCard'
import Badge from '../../../components/common/Badge'
import Button from '../../../components/common/Button'
import EmptyState from '../../../components/common/EmptyState'
import Loader from '../../../components/common/Loader'
import Modal from '../../../components/common/Modal'
import { useFetch } from '../../../hooks/useFetch'
import { usePageTitle } from '../../../hooks/usePageTitle'
import { useToast } from '../../../hooks/useToast'
import { getCustomers } from '../../../services/customerService'
import { exportCustomersToExcel } from '../../../utils/exportExcel'
import { formatPrice } from '../../../utils/formatPrice'
import { formatDate } from '../../../utils/orderStatus'

export default function CustomerList() {
  usePageTitle('Customers')
  const showToast = useToast()
  const { data: customersData, loading } = useFetch(getCustomers)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('') // '' | 'registered' | 'guest'
  const [selected, setSelected] = useState(null)

  if (loading) return <Loader label="Loading customers..." />

  const customers = customersData || []
  const search = query.trim().toLowerCase()
  const rows = customers.filter((customer) => {
    if (typeFilter === 'registered' && !customer.registered) return false
    if (typeFilter === 'guest' && customer.registered) return false
    return !search || [customer.name, customer.email, customer.phone].join(' ').toLowerCase().includes(search)
  })

  const registeredCount = customers.filter((c) => c.registered).length
  const totalSpend = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0)
  const repeatBuyers = customers.filter((c) => (c.orderCount || 0) > 1).length

  function handleExportExcel() {
    exportCustomersToExcel(rows)
    showToast(`Exported ${rows.length} customer(s) to Excel!`)
  }

  const columns = [
    {
      key: 'name',
      header: 'Customer',
      render: (customer) => {
        const initials = (customer.name || 'C')
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase()
        return (
          <button type="button" onClick={() => setSelected(customer)} className="flex items-center gap-3 text-left group">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-pale text-primary font-bold text-xs">
              {initials}
            </span>
            <div>
              <span className="block font-semibold text-heading group-hover:text-primary">{customer.name}</span>
              <span className="block text-xs text-muted">{customer.email}</span>
            </div>
          </button>
        )
      },
    },
    { key: 'phone', header: 'Phone', render: (customer) => <span className="font-mono text-xs">{customer.phone || '—'}</span> },
    {
      key: 'city',
      header: 'City',
      render: (customer) => customer.lastAddress?.city || '—',
    },
    {
      key: 'type',
      header: 'Type',
      render: (customer) => (
        <Badge variant={customer.registered ? 'success' : 'neutral'}>{customer.registered ? 'Registered' : 'Guest'}</Badge>
      ),
    },
    { key: 'orders', header: 'Orders', render: (customer) => <span className="font-semibold text-heading">{customer.orderCount}</span> },
    { key: 'spent', header: 'Total Spent', render: (customer) => <span className="font-heading font-bold text-heading">{formatPrice(customer.totalSpent)}</span> },
    { key: 'last', header: 'Last Order', render: (customer) => (customer.lastOrderAt ? formatDate(customer.lastOrderAt) : '—') },
  ]

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Customers Directory"
        description="View registered accounts, guest buyers, and lifetime customer spend."
      >
        <Button type="button" onClick={handleExportExcel} size="sm" className="gap-1.5">
          <Download size={15} /> Export Customers (Excel)
        </Button>
      </AdminPageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total Customers" value={customers.length} subtitle="Registered &amp; guest" tone="primary" />
        <StatCard icon={UserCheck} label="Registered" value={registeredCount} subtitle="Verified accounts" tone="info" />
        <StatCard icon={CheckCircle2} label="Repeat Buyers" value={repeatBuyers} subtitle="2+ orders placed" tone="purple" />
        <StatCard icon={IndianRupee} label="Customer Value" value={formatPrice(totalSpend)} subtitle="Combined order spend" tone="warning" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-56 flex-1 items-center gap-2 rounded-xl border border-line bg-white px-3.5 sm:max-w-sm focus-within:border-primary">
          <Search size={16} className="text-muted" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, email or phone"
            aria-label="Search customers"
            className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-heading placeholder:text-muted focus:outline-none"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-heading focus:border-primary focus:outline-none"
        >
          <option value="">All Customer Types</option>
          <option value="registered">Registered Accounts</option>
          <option value="guest">Guest Checkout</option>
        </select>
      </div>

      {rows.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Users}
            title={customers.length === 0 ? 'No customers yet' : 'No customers match your search'}
            text={customers.length === 0 ? 'Registered accounts and people who order will appear here.' : 'Try a different search term.'}
          />
        </div>
      ) : (
        <DataTable caption="All customers" columns={columns} rows={rows} getRowKey={(customer) => customer.id} />
      )}

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name || 'Customer'}>
        {selected && (
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Contact</dt>
              <dd className="mt-1 text-heading">
                {selected.email}
                <br />
                {selected.phone || 'No phone number'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Orders</dt>
              <dd className="mt-1 text-heading">
                {selected.orderCount} order{selected.orderCount === 1 ? '' : 's'} · {formatPrice(selected.totalSpent)} spent
              </dd>
            </div>
            {selected.lastAddress && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Last delivery address</dt>
                <dd className="mt-1 text-heading">
                  {selected.lastAddress.line1}
                  {selected.lastAddress.line2 && `, ${selected.lastAddress.line2}`}
                  <br />
                  {selected.lastAddress.city}, {selected.lastAddress.state} - {selected.lastAddress.pincode}
                </dd>
              </div>
            )}
          </dl>
        )}
      </Modal>
    </div>
  )
}
