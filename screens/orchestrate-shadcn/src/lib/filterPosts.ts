import type { Post, ActiveFilters } from '@/types'

export function filterPosts(posts: Post[], filters: ActiveFilters): Post[] {
  return posts.filter(post => {
    if (filters.statuses.length > 0 && !filters.statuses.includes(post.s)) return false
    if (filters.networks.length > 0 && !post.nets.some(n => filters.networks.includes(n))) return false
    if (filters.tags.length > 0 && !post.tags.some(([, label]) => filters.tags.includes(label))) return false
    return true
  })
}

export function hasActiveFilters(filters: ActiveFilters): boolean {
  return filters.statuses.length > 0 || filters.networks.length > 0 || filters.tags.length > 0
}
