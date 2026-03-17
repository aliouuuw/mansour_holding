/**
 * Reliable cross-browser scroll-to-top utility
 * Works on mobile where window.scrollTo is unreliable
 */
export function scrollToTop(behavior: ScrollBehavior = 'instant'): void {
  // Reset scroll position on all potential scrolling elements
  const docEl = document.documentElement
  const body = document.body

  // Direct property assignment for elements
  if (docEl) {
    docEl.scrollTop = 0
    docEl.scrollLeft = 0
  }
  if (body) {
    body.scrollTop = 0
    body.scrollLeft = 0
  }

  // Use scrollTo API for window
  window.scrollTo({ top: 0, left: 0, behavior })
}

/**
 * Hook-ready scroll to top with RAF timing for mobile
 */
export function scrollToTopOnMount(delay = 0): void {
  const performScroll = () => {
    // Use requestAnimationFrame for smoother mobile rendering
    requestAnimationFrame(() => {
      scrollToTop('instant')
    })
  }

  if (delay > 0) {
    setTimeout(performScroll, delay)
  } else {
    performScroll()
  }
}
