const LEFT = 'M22 28 V172 H50 V28'
const CHEV = 'M50 28 L100 98 L150 28'
const RIGHT = 'M150 28 V172 H178 V28'

/* Traced from public/mansour-motors/mark-m.jpg: two vertical pillars + a central chevron. */
export function HouseMark() {
  return (
    <svg viewBox="0 0 200 190" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="13" strokeLinecap="square" strokeMiterlimit={2.4}>
        <g className="draw">
          <path pathLength={1} strokeLinejoin="round" d={LEFT} />
          <path pathLength={1} strokeLinejoin="miter" d={CHEV} />
          <path pathLength={1} strokeLinejoin="round" d={RIGHT} />
        </g>
        <g className="run" strokeLinecap="butt">
          <path pathLength={1} d={LEFT} />
          <path pathLength={1} d={CHEV} />
          <path pathLength={1} d={RIGHT} />
        </g>
      </g>
    </svg>
  )
}
