import type { Activity, Partner } from '../types'

export function parseTags(raw: string): string[] {
  if (!raw) return []
  return Array.from(
    new Set(
      raw
        .split(/[,;]/)
        .map(t => t.trim().toLowerCase())
        .filter(Boolean)
    )
  )
}

export interface PartnerMatch {
  partner: Partner
  score: number
  matchedTags: string[]
  wildcard?: boolean   // interest tag "all"/"any"/"*" → matches every activity
}

// A partner with any of these interest tags is open to ALL activities.
const WILDCARD_TAGS = new Set(['all', 'any', '*', 'all activities'])

export function matchPartnersToActivity(
  activity: Activity,
  partners: Partner[],
  excludeIds: Set<string> = new Set()
): PartnerMatch[] {
  const activityTags = new Set([...parseTags(activity.u_tags), activity.u_category.toLowerCase()])

  const matches: PartnerMatch[] = partners
    .filter(p => p.u_status !== 'inactive' && !excludeIds.has(p.sys_id))
    .map(partner => {
      const partnerTags = parseTags(partner.u_interest_tags)
      // "All" is a wildcard — suggest this partner for every activity.
      if (partnerTags.some(t => WILDCARD_TAGS.has(t))) {
        return { partner, score: 1, matchedTags: [], wildcard: true }
      }
      const matchedTags = partnerTags.filter(t => activityTags.has(t))
      const categoryBonus = partnerTags.includes(activity.u_category.toLowerCase()) ? 0.1 : 0
      const score = matchedTags.length / Math.max(1, activityTags.size) + categoryBonus
      return { partner, score, matchedTags }
    })
    .filter(m => m.score > 0)

  matches.sort((a, b) => b.score - a.score)
  return matches.slice(0, 10)
}
