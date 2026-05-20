import { useEffect, useRef } from 'react'

export function useReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const targets = el.querySelectorAll('.reveal')
    const nodes = targets.length > 0 ? Array.from(targets) : [el]

    if (targets.length === 0) el.classList.add('reveal')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            entry.target.classList.remove('hidden-up')
          } else {
            // Check scroll direction — if element is above viewport, add hidden-up
            const rect = entry.target.getBoundingClientRect()
            if (rect.bottom < 0) {
              entry.target.classList.add('hidden-up')
            } else {
              entry.target.classList.remove('visible')
              entry.target.classList.remove('hidden-up')
            }
          }
        })
      },
      { threshold: options.threshold || 0.12 }
    )

    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [])

  return ref
}
