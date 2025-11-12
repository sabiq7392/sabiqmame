/**
 * Parse Indonesian month names to month number
 */
const monthMap: Record<string, number> = {
  'jan': 0, 'januari': 0, 'january': 0,
  'feb': 1, 'februari': 1, 'february': 1,
  'mar': 2, 'maret': 2, 'march': 2,
  'apr': 3, 'april': 3,
  'mei': 4, 'may': 4,
  'jun': 5, 'juni': 5, 'june': 5,
  'jul': 6, 'juli': 6, 'july': 6,
  'agu': 7, 'agustus': 7, 'aug': 7, 'august': 7,
  'sep': 8, 'september': 8,
  'okt': 9, 'oktober': 9, 'oct': 9, 'october': 9,
  'nov': 10, 'november': 10,
  'des': 11, 'desember': 11, 'dec': 11, 'december': 11,
}

/**
 * Parse date string in format "Okt 2024" or "Jan 2022"
 */
function parseDate(dateStr: string): Date | null {
  const trimmed = dateStr.trim().toLowerCase()

  // Handle "Saat ini" or "Present"
  if (trimmed === 'saat ini' || trimmed === 'present' || trimmed === 'now') {
    return new Date()
  }

  // Parse format like "Okt 2024" or "Jan 2022"
  const parts = trimmed.split(' ')
  if (parts.length >= 2) {
    const monthStr = parts[0]
    const yearStr = parts[1]

    const month = monthMap[monthStr]
    const year = parseInt(yearStr)

    if (month !== undefined && !isNaN(year)) {
      return new Date(year, month, 1)
    }
  }

  return null
}

/**
 * Calculate duration between two dates
 * Returns formatted string: "X thn Y bln" or "Y bln" if years = 0
 */
export function calculateDuration(period: string): string {
  const parts = period.split(' - ')
  if (parts.length !== 2) {
    return ''
  }

  const startDate = parseDate(parts[0])
  const endDate = parseDate(parts[1])

  if (!startDate || !endDate) {
    return ''
  }

  // Calculate difference
  let years = endDate.getFullYear() - startDate.getFullYear()
  let months = endDate.getMonth() - startDate.getMonth()

  // Adjust if months are negative
  if (months < 0) {
    years--
    months += 12
  }

  // Format output
  if (years === 0) {
    return `${months} bln`
  } else {
    return `${years} thn ${months} bln`
  }
}

/**
 * Calculate duration for experience (company level)
 * Takes the earliest start date and latest end date from all roles
 */
export function calculateExperienceDuration(roles: Array<{ period: string }>): string {
  if (roles.length === 0) return ''

  let earliestStart: Date | null = null
  let latestEnd: Date | null = null

  roles.forEach(role => {
    const parts = role.period.split(' - ')
    if (parts.length === 2) {
      const start = parseDate(parts[0])
      const end = parseDate(parts[1])

      if (start && (!earliestStart || start < earliestStart)) {
        earliestStart = start
      }

      if (end && (!latestEnd || end > latestEnd)) {
        latestEnd = end
      }
    }
  })

  if (!earliestStart || !latestEnd) {
    return ''
  }

  // Calculate difference - use non-null assertion since we've checked above
  const start = earliestStart as Date
  const end = latestEnd as Date
  let years = end.getFullYear() - start.getFullYear()
  let months = end.getMonth() - start.getMonth()

  // Adjust if months are negative
  if (months < 0) {
    years--
    months += 12
  }

  // Format output
  if (years === 0) {
    return `${months} bln`
  } else {
    return `${years} thn ${months} bln`
  }
}

