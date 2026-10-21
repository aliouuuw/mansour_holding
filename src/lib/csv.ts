/* French Excel splits columns on ';' (',' is the decimal mark), so a ',' file opens in one column */
const SEP = ';'

export function escapeCsvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return ''
  const s = String(value)
  if (/[";,\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export function downloadCsv(filename: string, headers: string[], rows: (string | number | null | undefined)[][]): void {
  const lines = [
    headers.map(escapeCsvCell).join(SEP),
    ...rows.map((row) => row.map(escapeCsvCell).join(SEP)),
  ]
  const blob = new Blob([`\uFEFF${lines.join('\n')}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
