import { formatMonthYear } from "@/utils/common.utils"

export function groupByMonth<T>(items: T[], getDate: (item: T) => string): [string, T[]][] {
  const groups = new Map<string, T[]>()
  for (const item of items) {
    const key = formatMonthYear(getDate(item))
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(item)
  }
  return Array.from(groups.entries())
}