export function useScrollReveal() {
  const observer = ref<IntersectionObserver | null>(null)

  const initScrollReveal = () => {
    if (typeof window === 'undefined') return

    observer.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.value?.unobserve(entry.target) // Only animate once
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px',
      }
    )

    // Observe all elements with scroll-reveal class
    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.value?.observe(el)
    })
  }

  onMounted(() => {
    nextTick(() => {
      initScrollReveal()
    })
  })

  onUnmounted(() => {
    observer.value?.disconnect()
  })

  return { initScrollReveal }
}
