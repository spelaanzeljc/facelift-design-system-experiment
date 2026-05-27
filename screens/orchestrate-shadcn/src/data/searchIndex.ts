import { WEEKS } from '@/data/weeks'
import type { Post } from '@/types'

export interface SearchItem {
  name: string
  sub: string
  status: string
  date: string
  nets: string[]
  post: Post
}

function buildSearchIndex(): SearchItem[] {
  return WEEKS.flatMap(week =>
    week.cards.flatMap((dayCards, di) =>
      dayCards.map(card => ({
        name: card.title,
        sub: 'Post Set',
        status: card.s,
        date: `Jun ${week.dates[di]}, 2026`,
        nets: card.nets,
        post: card,
      }))
    )
  )
}

export const SEARCH_INDEX: SearchItem[] = buildSearchIndex()
