import type { Post, WeekData } from '@/types';

export const WEEK0_CARDS: Post[][] = [
  // Mon 16
  [
    { s: 'successful', t: '09:30 AM', title: 'Facelift Support for Small Businesses', bg: 'linear-gradient(135deg,#d9c8b8,#c4a882)', emoji: '🤝', tags: [['teal', 'Community'], ['blue', 'Support']], nets: ['fb'] },
    { s: 'scheduled',  t: '12:00 PM', title: 'Product Update: New Features',          bg: 'linear-gradient(135deg,#cce5ff,#99caff)', emoji: '🚀', tags: [['blue', 'Product']],                    nets: ['li'] },
    { s: 'draft',      t: '3:00 PM',  title: 'Draft: Q3 Strategy Overview',           bg: 'linear-gradient(135deg,#e8eaec,#cdd1d8)', emoji: '📋', tags: [['grey', 'Strategy']],                   nets: ['fb', 'li'] },
  ],
  // Tue 17
  [
    { s: 'successful', t: '10:00 AM', title: 'Orchestrate Reinvented',          bg: 'linear-gradient(135deg,#d4f0c0,#a8df8b)', emoji: '✨', tags: [['green', 'Product']],   nets: ['ig', 'li'] },
    { s: 'scheduled',  t: '2:00 PM',  title: 'Team Spotlight: Engineering',     bg: 'linear-gradient(135deg,#fde9b0,#fbc652)', emoji: '👥', tags: [['orange', 'Culture']],  nets: ['fb', 'ig'] },
    { s: 'failed',     t: '11:00 AM', title: 'Figma Process Review Post',       bg: 'linear-gradient(135deg,#ffe0b2,#ffb74d)', emoji: '⚠️', tags: [['red', 'Design']],      nets: ['li'] },
  ],
  // Wed 18 — today
  [
    { s: 'successful', t: '09:30 AM', title: 'Collaboration Guidelines v1',     bg: 'linear-gradient(135deg,#d9c8b8,#c4a882)', emoji: '🤝', tags: [['teal', 'Guidelines']], nets: ['li'] },
    { s: 'scheduled',  t: '1:00 PM',  title: 'Webinar Reminder: Orchestrate',   bg: 'linear-gradient(135deg,#2a1a8e,#4060c8)', emoji: '🎯', tags: [['blue', 'Webinar']],   nets: ['fb', 'li'] },
    { s: 'draft',      t: '4:00 PM',  title: 'Weekend Content Plan',            bg: 'linear-gradient(135deg,#e8e4f0,#d4cfe8)', emoji: '💜', tags: [['purple', 'Content']], nets: ['ig'] },
  ],
  // Thu 19
  [
    { s: 'scheduled',  t: '10:00 AM', title: 'BB Agency Campaign Kick-off',     bg: 'linear-gradient(135deg,#cce5ff,#99caff)', emoji: '📣', tags: [['blue', 'Agency']],     nets: ['fb', 'ig', 'li'] },
    { s: 'successful', t: '3:00 PM',  title: 'Social Stats Weekly Digest',      bg: 'linear-gradient(135deg,#d4f0c0,#a8df8b)', emoji: '📊', tags: [['green', 'Analytics']], nets: ['li'] },
  ],
  // Fri 20
  [
    { s: 'successful', t: '09:00 AM', title: 'Nice Random Post for Friday',     bg: 'linear-gradient(135deg,#c8e6c9,#a5d6a7)', emoji: '🌟', tags: [['green', 'Engagement']], nets: ['ig'] },
    { s: 'scheduled',  t: '11:00 AM', title: 'LinkedIn Article Drop',           bg: 'linear-gradient(135deg,#c7e9f7,#89d4f0)', emoji: '✍️',  tags: [['teal', 'Content']],    nets: ['li'] },
    { s: 'draft',      t: '2:00 PM',  title: 'Design System Update Notes',      bg: 'linear-gradient(135deg,#e8e4f0,#d4cfe8)', emoji: '🎨', tags: [['purple', 'Design']],   nets: ['li'] },
  ],
  // Sat 21
  [],
  // Sun 22
  [],
];

export const WEEKS: WeekData[] = [
  {
    offset: -1,
    label: '9 — 15 June, 2025',
    dates: [9, 10, 11, 12, 13, 14, 15],
    isToday: [false, false, false, false, false, false, false],
    isWknd:  [false, false, false, false, false, true,  true],
    cards: [
      [{ s: 'scheduled',  t: '10:00 AM', title: 'Weekly Round-Up',                bg: 'linear-gradient(135deg,#d4edda,#a8d5b5)', emoji: '📰', tags: [['green', 'Orchestrate']], nets: ['li'] }],
      [{ s: 'draft',      t: '2:00 PM',  title: 'Q3 Planning Draft',              bg: 'linear-gradient(135deg,#e8eaec,#cdd1d8)', emoji: '📋', tags: [['grey', '#planning']],    nets: ['fb'] }],
      [
        { s: 'successful', t: '9:30 AM', title: 'Mid-Week Insights',              bg: 'linear-gradient(135deg,#fff3cd,#ffd77a)', emoji: '💡', tags: [['orange', 'Updates']], nets: ['ig', 'li'] },
        { s: 'scheduled',  t: '3:00 PM', title: 'Orchestrate Webinar Teaser',     bg: 'linear-gradient(135deg,#cce5ff,#99caff)', emoji: '🎙', tags: [['blue', 'Webinar']],   nets: ['li'] },
      ],
      [],
      [{ s: 'successful', t: '8:00 AM',  title: 'Friday Feature Drop',            bg: 'linear-gradient(135deg,#f5c6cb,#f1aeb5)', emoji: '🎉', tags: [['teal', 'Community']], nets: ['fb', 'ig', 'li'] }],
      [], [],
    ],
  },
  {
    offset: 0,
    label: '16 — 22 June, 2025',
    dates: [16, 17, 18, 19, 20, 21, 22],
    isToday: [false, false, true, false, false, false, false],
    isWknd:  [false, false, false, false, false, true,  true],
    cards: WEEK0_CARDS,
  },
  {
    offset: 1,
    label: '23 — 29 June, 2025',
    dates: [23, 24, 25, 26, 27, 28, 29],
    isToday: [false, false, false, false, false, false, false],
    isWknd:  [false, false, false, false, false, true,  true],
    cards: [
      [
        { s: 'successful', t: '9:00 AM',  title: 'Orchestrate 2.0 Launch',         bg: 'linear-gradient(135deg,#d4f0c0,#a8df8b)', emoji: '🚀', tags: [['green', 'Launch']],     nets: ['fb', 'ig', 'li'] },
        { s: 'draft',      t: '11:00 AM', title: 'Campaign Wrap-Up Report',        bg: 'linear-gradient(135deg,#e2ddf5,#b8b0e8)', emoji: '📊', tags: [['blue', 'Analytics']],   nets: ['li'] },
      ],
      [{ s: 'scheduled', t: '10:00 AM', title: 'Partner Spotlight: BB Agency',     bg: 'linear-gradient(135deg,#fde9b0,#fbc652)', emoji: '🤝', tags: [['amber', 'Partner']],   nets: ['fb', 'ig'] }],
      [{ s: 'successful', t: '9:30 AM', title: 'Collaboration Guidelines v2',      bg: 'linear-gradient(135deg,#c7e9f7,#89d4f0)', emoji: '✅', tags: [['teal', 'Updates']],    nets: ['li'] }],
      [{ s: 'scheduled',  t: '2:00 PM', title: 'Social Media Trends 2025',         bg: 'linear-gradient(135deg,#fcd6e8,#f8a8c8)', emoji: '📈', tags: [['pink', 'Trends']],     nets: ['ig'] }],
      [
        { s: 'failed',     t: '10:00 AM', title: 'Legacy Post Migration',          bg: 'linear-gradient(135deg,#ffe0b2,#ffb74d)', emoji: '⚠️', tags: [['orange', 'Migration']], nets: ['fb'] },
        { s: 'successful', t: '4:00 PM',  title: 'End-of-Week Summary',            bg: 'linear-gradient(135deg,#c8e6c9,#a5d6a7)', emoji: '🏁', tags: [['green', 'Weekly']],    nets: ['fb', 'ig', 'li'] },
      ],
      [], [],
    ],
  },
];
