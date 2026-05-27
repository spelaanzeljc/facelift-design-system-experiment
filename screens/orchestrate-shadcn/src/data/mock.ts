export const DAY_ABBR = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const STATUS_CFG = {
  successful:     { label: 'Successful',     border: '#2e881b', chipBg: '#e9ffcf', chipText: '#2e881b' },
  scheduled:      { label: 'Scheduled',      border: '#1339ec', chipBg: '#eef3fd', chipText: '#1339ec' },
  draft:          { label: 'Draft',          border: '#a7aebe', chipBg: '#e7eaee', chipText: '#515a6e' },
  failed:         { label: 'Failed',         border: '#cc0000', chipBg: '#ffebeb', chipText: '#cc0000' },
  to_be_approved: { label: 'To Be Approved', border: '#e05a00', chipBg: '#ffede2', chipText: '#e05a00' },
} as const;

export const TAG_CFG: Record<string, { bg: string; color: string }> = {
  teal:   { bg: '#daf5e5', color: '#06664c' },
  blue:   { bg: '#eef3fd', color: '#0c228d' },
  green:  { bg: '#e9ffcf', color: '#2e881b' },
  grey:   { bg: '#e7eaee', color: '#515a6e' },
  orange: { bg: '#ffede2', color: '#ad4500' },
  red:    { bg: '#ffebeb', color: '#cc0000' },
  purple: { bg: '#eddcf3', color: '#8d6599' },
  amber:  { bg: '#fde9b0', color: '#8c631c' },
  pink:   { bg: '#fcd6e8', color: '#a0325a' },
};

// Month-view post dots (June 2025)
export const POSTS: Record<number, { s: string }[]> = {
  1:  [{ s: 'successful' }, { s: 'draft' }],
  2:  [{ s: 'successful' }, { s: 'scheduled' }],
  3:  [{ s: 'successful' }, { s: 'draft' }, { s: 'successful' }],
  4:  [{ s: 'successful' }, { s: 'draft' }],
  5:  [{ s: 'successful' }, { s: 'scheduled' }],
  6:  [{ s: 'draft' }],
  9:  [{ s: 'scheduled' }, { s: 'failed' }],
  10: [{ s: 'successful' }, { s: 'draft' }],
  11: [{ s: 'successful' }, { s: 'scheduled' }],
  12: [{ s: 'successful' }],
  13: [{ s: 'failed' }, { s: 'successful' }],
  16: [{ s: 'successful' }, { s: 'failed' }, { s: 'draft' }],
  17: [{ s: 'scheduled' }, { s: 'successful' }],
  18: [{ s: 'successful' }, { s: 'scheduled' }, { s: 'draft' }],
  19: [{ s: 'draft' }],
  20: [{ s: 'successful' }, { s: 'failed' }],
  21: [{ s: 'scheduled' }, { s: 'draft' }, { s: 'failed' }],
  22: [{ s: 'draft' }],
  23: [{ s: 'successful' }, { s: 'draft' }],
  24: [{ s: 'scheduled' }],
  25: [{ s: 'successful' }],
  26: [{ s: 'scheduled' }],
  27: [{ s: 'failed' }],
  30: [{ s: 'draft' }],
};

export const SEARCH_DATA = [
  { name: 'Collaboration Guidelines', sub: 'Post', status: 'draft',      date: 'Jun 18, 2025' },
  { name: 'Orchestrate Reinvented',   sub: 'Post', status: 'scheduled',  date: 'Jun 17, 2025' },
  { name: 'Figma Process Review',     sub: 'Post', status: 'failed',     date: 'Jun 18, 2025' },
  { name: 'BB Agency Campaigns',      sub: 'Post', status: 'draft',      date: 'Jun 16, 2025' },
  { name: 'Nice Random Post',         sub: 'Post', status: 'successful', date: 'Jun 17, 2025' },
];

export const DRAFTS_DATA = [
  { name: 'Draft: Q3 Strategy Overview', sub: 'Post', date: 'Jun 18, 2025', nets: ['li'] },
  { name: 'Weekend Content Plan',        sub: 'Post', date: 'Jun 18, 2025', nets: ['ig'] },
  { name: 'Campaign Wrap-Up Report',     sub: 'Post', date: 'Jun 23, 2025', nets: ['li'] },
  { name: 'Q3 Planning Draft',           sub: 'Post', date: 'Jun 10, 2025', nets: ['fb'] },
];

export const FAKE_MEDIA = [
  { label: 'image_01.jpeg', bg: 'linear-gradient(135deg,#d9c8b8,#c4a882)' },
  { label: 'image_02.jpeg', bg: 'linear-gradient(135deg,#cce5ff,#99caff)' },
  { label: 'image_03.jpeg', bg: 'linear-gradient(135deg,#d4f0c0,#a8df8b)' },
];

export const BG_MAP: Record<string, string> = {
  successful:     'linear-gradient(135deg,#d9c8b8,#c4a882)',
  scheduled:      'linear-gradient(135deg,#2a1a8e,#4060c8)',
  draft:          'linear-gradient(135deg,#e8e4f0,#d4cfe8)',
  failed:         'linear-gradient(135deg,#2a1a3e,#4a1a6a)',
  to_be_approved: 'linear-gradient(135deg,#fde9b0,#f9b55a)',
};

export const SCREEN_NETWORK_TABS = ['Instagram', 'Facebook', 'YouTube', 'TikTok', 'LinkedIn', 'X', 'XING', 'Quickfill'] as const;
export type NetworkTab = typeof SCREEN_NETWORK_TABS[number];

export const NET_TAB_DOTS: Record<string, string> = {
  Instagram: '#1339ec',
  Facebook:  '#1339ec',
  LinkedIn:  '#1339ec',
};

export const ALL_USERS = [
  { i: 'ET', n: 'Elly Tan',    c: '#0c228d' },
  { i: 'MK', n: 'Max Krauss',  c: '#2e881b' },
  { i: 'SR', n: 'Sara Reeves', c: '#8d1a1a' },
  { i: 'JP', n: 'Jonas Petra', c: '#5f6a82' },
  { i: 'AL', n: 'Anna Lim',    c: '#6b3fa0' },
  { i: 'TW', n: 'Tom Weber',   c: '#0c5566' },
];

export const SUBNAV_ITEMS = [
  { label: 'Welcome',            icon: 'explore' },
  { label: 'Storyboard',         icon: 'auto_stories' },
  { label: 'Calendar',           icon: 'calendar_month', active: true },
  { label: 'Frames',             icon: 'crop_free' },
  { label: 'Contents',           icon: 'layers' },
  { label: 'Unscheduled Drafts', icon: 'inbox' },
  { label: 'Templates',          icon: 'article' },
  { label: 'Post Performance',   icon: 'bar_chart',  chevron: true },
  { label: 'Tasks',              icon: 'task_alt',   chevron: true },
  { label: 'Approvals',          icon: 'check_circle_outline' },
];

export const MAIN_NAV = [
  { section: null, items: [{ label: 'Home', icon: 'home' }] },
  { section: 'Marketing', items: [
    { label: 'Orchestrate',   icon: 'calendar_month',   active: true },
    { label: 'Ideate',        icon: 'lightbulb_outline' },
    { label: 'Media Library', icon: 'perm_media' },
    { label: 'Amplify',       icon: 'campaign' },
  ]},
  { section: 'Care', items: [
    { label: 'Engage', icon: 'forum' },
  ]},
  { section: 'Analytics', items: [
    { label: 'Dashboard',   icon: 'bar_chart' },
    { label: 'Analyze',     icon: 'analytics' },
    { label: 'Data Studio', icon: 'table_chart' },
    { label: 'Reports',     icon: 'assessment' },
  ]},
  { section: 'Additional', items: [
    { label: 'Custom Inbox', icon: 'inbox' },
    { label: 'FDS',          icon: 'diamond' },
    { label: 'Storyboard',   icon: 'auto_stories' },
  ]},
] as const;

// Keep for any legacy references
export const FILTER_CHIPS = ['Instagram', 'Facebook', 'LinkedIn', 'Scheduled', 'Draft', 'Successful', 'Failed'];

// Structured filter options for the real FiltersPanel
import type { PostStatus } from '@/types'
export const FILTER_STATUS_OPTIONS: PostStatus[] = ['draft', 'to_be_approved', 'scheduled', 'successful', 'failed']
export const FILTER_NETWORK_OPTIONS = [
  { id: 'fb', label: 'Facebook' },
  { id: 'ig', label: 'Instagram' },
  { id: 'li', label: 'LinkedIn' },
]
// All unique tag labels from the WEEKS mock data
export const FILTER_TAG_OPTIONS = [
  'Community', 'Support', 'Product', 'Strategy', 'Guidelines',
  'Webinar', 'Content', 'Culture', 'Design', 'Agency', 'Analytics',
  'Engagement', 'Partner', 'Trends', 'Launch', 'Weekly', 'Updates',
  'Migration', 'Orchestrate', 'Planning',
]

export const DETAIL_MENU_ITEMS = ['Promote Post', 'Details', 'Open Taskboard', 'Save as Template', 'Save as Amplify Template', 'Team Assignment'];
