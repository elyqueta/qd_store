export function formatPrice(value) {
  return new Intl.NumberFormat('pt-AO', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(value) + ' Kz'
}

export function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}
