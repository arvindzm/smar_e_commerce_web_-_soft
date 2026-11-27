import { formatDate, paymentLabels } from './orderStatus'
import { getDefaultPack } from './product'

function escapeCsvCell(value) {
  if (value === null || value === undefined) return ''
  const str = String(value).replace(/\r?\n|\r/g, ' ')
  if (/[",]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

// Downloads a UTF-8 BOM CSV file that opens cleanly in Microsoft Excel without encoding issues.
export function downloadExcelCsv(filename, headers, rows) {
  const safeName = filename.endsWith('.csv') ? filename : `${filename}.csv`
  const lines = [
    headers.map(escapeCsvCell).join(','),
    ...rows.map((row) => row.map(escapeCsvCell).join(',')),
  ]
  const csvContent = `\uFEFF${lines.join('\r\n')}`
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', safeName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const todayTag = () => new Date().toISOString().slice(0, 10)

export function exportOrdersToExcel(orders) {
  const headers = [
    'Order ID',
    'Order Date',
    'Customer Name',
    'Mobile Number',
    'Email',
    'Delivery Address',
    'City',
    'State',
    'Pincode',
    'Items Count',
    'Items Summary',
    'Subtotal (INR)',
    'Delivery Fee (INR)',
    'Discount (INR)',
    'Grand Total (INR)',
    'Payment Method',
    'Payment Status',
    'Transaction ID',
    'Order Status',
    'Delivery Partner',
    'Tracking / AWB No',
  ]

  const rows = (orders || []).map((o) => [
    o.id,
    formatDate(o.createdAt),
    o.customer?.name || '',
    o.customer?.phone || '',
    o.customer?.email || '',
    [o.address?.line1, o.address?.line2].filter(Boolean).join(', '),
    o.address?.city || '',
    o.address?.state || '',
    o.address?.pincode || '',
    o.items?.length || 0,
    (o.items || []).map((i) => `${i.name} (${i.packLabel}) x${i.quantity}`).join(' | '),
    o.totals?.subtotal ?? 0,
    o.totals?.delivery ?? o.totals?.deliveryCharge ?? 0,
    o.totals?.discount ?? 0,
    o.totals?.total ?? 0,
    paymentLabels[o.paymentMethod] || o.paymentMethod || 'COD',
    o.paymentStatus || 'Pending',
    o.paymentId || (o.paymentMethod === 'cod' || o.paymentMethod === 'Cash on Delivery' ? 'COD-DOORSTEP' : ''),
    o.status || 'Processing',
    o.deliveryPartner || 'SMAR In-House Express',
    o.trackingNumber || '',
  ])

  downloadExcelCsv(`SMAR-Orders-Report-${todayTag()}.csv`, headers, rows)
}

export function exportPaymentsToExcel(orders) {
  const headers = [
    'Transaction ID',
    'Order ID',
    'Date',
    'Customer Name',
    'Mobile Number',
    'Payment Mode',
    'Subtotal (INR)',
    'Delivery Fee (INR)',
    'Discount (INR)',
    'Total Paid / Payable (INR)',
    'Payment Status',
    'Order Status',
  ]

  const rows = (orders || []).map((o) => [
    o.paymentId || `COD_${o.id}`,
    o.id,
    formatDate(o.createdAt),
    o.customer?.name || '',
    o.customer?.phone || '',
    paymentLabels[o.paymentMethod] || o.paymentMethod || 'Cash on Delivery',
    o.totals?.subtotal ?? 0,
    o.totals?.delivery ?? o.totals?.deliveryCharge ?? 0,
    o.totals?.discount ?? 0,
    o.totals?.total ?? 0,
    o.paymentStatus || 'Pending',
    o.status || 'Processing',
  ])

  downloadExcelCsv(`SMAR-Payments-Ledger-${todayTag()}.csv`, headers, rows)
}

export function exportProductsToExcel(products, getCategoryName) {
  const headers = [
    'Product ID',
    'SKU',
    'Product Name',
    'Category',
    'Default Pack',
    'MRP (INR)',
    'Sale Price (INR)',
    'Stock Available',
    'Units Sold',
    'Rating',
    'Featured',
    'Visible',
    'Created Date',
  ]

  const rows = (products || []).map((p) => {
    const pack = getDefaultPack(p)
    return [
      p.id,
      p.sku || '',
      p.name,
      getCategoryName ? getCategoryName(p.categoryId) : p.categoryId,
      pack.label || '',
      pack.regularPrice ?? 0,
      pack.salePrice ?? 0,
      p.stock ?? 0,
      p.sold ?? 0,
      p.rating ?? 0,
      p.featured ? 'Yes' : 'No',
      p.visible ? 'Visible' : 'Hidden',
      p.createdAt || '',
    ]
  })

  downloadExcelCsv(`SMAR-Products-Inventory-${todayTag()}.csv`, headers, rows)
}

export function exportCustomersToExcel(customers) {
  const headers = [
    'Customer ID',
    'Full Name',
    'Email',
    'Mobile Number',
    'Account Type',
    'Total Orders',
    'Total Spent (INR)',
    'Last Order Date',
    'City',
    'State',
    'Pincode',
  ]

  const rows = (customers || []).map((c) => [
    c.id,
    c.name || '',
    c.email || '',
    c.phone || '',
    c.registered ? 'Registered' : 'Guest',
    c.orderCount ?? 0,
    c.totalSpent ?? 0,
    c.lastOrderAt ? formatDate(c.lastOrderAt) : '',
    c.lastAddress?.city || '',
    c.lastAddress?.state || '',
    c.lastAddress?.pincode || '',
  ])

  downloadExcelCsv(`SMAR-Customers-List-${todayTag()}.csv`, headers, rows)
}

export function exportCategoriesToExcel(categories, getProductCount) {
  const headers = ['Category ID', 'Category Name', 'URL Slug', 'Products Count', 'Visibility', 'Description']
  const rows = (categories || []).map((c) => [
    c.id,
    c.name,
    `/category/${c.slug}`,
    getProductCount ? getProductCount(c.id) : 0,
    c.visible ? 'Visible' : 'Hidden',
    c.description || '',
  ])

  downloadExcelCsv(`SMAR-Categories-${todayTag()}.csv`, headers, rows)
}

export function exportCouponsToExcel(coupons) {
  const headers = [
    'Coupon Code',
    'Discount Type',
    'Discount Value',
    'Min Order (INR)',
    'Max Discount (INR)',
    'Status',
    'Featured On Banner',
    'Banner Title',
    'Description',
  ]
  const rows = (coupons || []).map((c) => [
    c.code,
    c.discountType,
    c.discountValue,
    c.minOrder ?? 0,
    c.maxDiscount ?? 0,
    c.active ? 'Active' : 'Inactive',
    c.featuredOnBanner ? 'Yes' : 'No',
    c.title || '',
    c.text || '',
  ])

  downloadExcelCsv(`SMAR-Coupons-${todayTag()}.csv`, headers, rows)
}
