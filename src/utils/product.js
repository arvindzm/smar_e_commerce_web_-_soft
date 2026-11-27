// Small helpers for reading product data.
export function getDefaultPack(product) {
  return product?.packSizes?.[0] || { label: '1 unit', regularPrice: 0, salePrice: 0 }
}

export function getPack(product, label) {
  return product?.packSizes?.find((pack) => pack.label === label) || getDefaultPack(product)
}

export function isInStock(product) {
  return Boolean(product && product.stock > 0)
}

export function isOnSale(product) {
  const pack = getDefaultPack(product)
  return pack.salePrice < pack.regularPrice
}
