export type PostStatus = 'successful' | 'scheduled' | 'draft' | 'failed' | 'to_be_approved';

export interface Post {
  s: PostStatus;
  t: string;
  title: string;
  bg: string;
  emoji: string;
  tags: [string, string][];
  nets: string[];
}

export interface WeekData {
  offset: number;
  label: string;
  dates: number[];
  isToday: boolean[];
  isWknd: boolean[];
  cards: Post[][];
}

export interface Campaign {
  name: string;
  color: string;
  text: string;
  emoji: string;
  s: number;
  e: number;
  description?: string;
  status?: 'active' | 'draft' | 'ended';
  timing?: string;
  type?: string;
  typeColor?: string;
  createdBy?: string;
  createdAt?: string;
}

export interface ViewOpts {
  images: boolean;
  tags: boolean;
  slim: boolean;
  colored: boolean;
}

export interface NetContent {
  postType?: string;
  text?: string;
  hashtags?: string;
  cta?: string;
  title?: string;
  description?: string;
  tags?: string;
  visibility?: string;
  caption?: string;
  privacy?: string;
  allowComments?: boolean;
  allowDuet?: boolean;
  allowStitch?: boolean;
  thread?: boolean;
  sensitive?: boolean;
}

export interface MediaItem {
  id: number;
  label: string;
  bg: string;
}

export interface User {
  i: string;
  n: string;
  c: string;
}

export interface ActiveFilters {
  statuses: PostStatus[];
  networks: string[];
  tags: string[];
}

export type PanelId = 'postDetail' | 'search' | 'drafts' | 'filters' | null;
export type ScreenMode = 'create' | 'view' | null;
export type ViewMode = 'week' | 'month' | 'month-timeline';
export type CalView = 'calendar' | 'list';
