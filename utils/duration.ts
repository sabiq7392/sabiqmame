const monthsMap: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  okt: 9,
}

export function calculateDynamicDuration(periodStr: string, fallbackDuration: string): string {
  const parts = periodStr.split(/[–-]/).map(p => p.trim())
  if (parts.length < 2) return fallbackDuration

  const endPart = parts[1].toLowerCase()
  if (endPart !== 'present' && endPart !== 'saat ini') {
    return fallbackDuration
  }

  const startPart = parts[0]
  const startSplit = startPart.split(/\s+/)
  if (startSplit.length < 2) return fallbackDuration

  const monthKey = startSplit[0].substring(0, 3).toLowerCase()
  const startMonth = monthsMap[monthKey]
  if (startMonth === undefined) return fallbackDuration

  const startYear = parseInt(startSplit[1], 10)
  if (isNaN(startYear)) return fallbackDuration

  const startDate = new Date(startYear, startMonth, 1)
  const endDate = new Date()
  const diffMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth())

  const years = Math.floor(diffMonths / 12)
  const months = diffMonths % 12

  const yearsStr = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : ''
  const monthsStr = months > 0 ? `${months} mo${months > 1 ? 's' : ''}` : ''

  return [yearsStr, monthsStr].filter(Boolean).join(' ') || '1 mo'
}
