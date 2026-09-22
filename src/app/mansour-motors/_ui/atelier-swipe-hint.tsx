/** Mobile-only affordance on the atelier hero; visibility is driven by turntable.js */
export function AtelierSwipeHint() {
  return (
    <span className="atelier-swipe-hint" data-atelier-swipe-hint hidden aria-hidden="true">
      <svg className="atelier-swipe-hint-glyph" width="52" height="14" viewBox="0 0 52 14" fill="none" aria-hidden="true">
        <path className="atelier-swipe-hint-wing" d="M1 7h8M6 4l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 7h28" stroke="currentColor" strokeWidth="1" opacity=".22" />
        <circle className="atelier-swipe-hint-dot" cx="26" cy="7" r="1.6" fill="currentColor" />
        <path className="atelier-swipe-hint-wing" d="M51 7H43M46 4l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="atelier-swipe-hint-label">Glisser</span>
    </span>
  )
}
