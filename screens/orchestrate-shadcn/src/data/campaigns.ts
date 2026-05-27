import type { Campaign } from '@/types';

export const CAMPS: Campaign[] = [
  {
    name: 'Getting Things Done',
    color: '#e9eaec', text: '#414858', emoji: '🔗', s: 1, e: 30,
    status: 'active',
    description: 'An always-on campaign for evergreen productivity and task-management content. Content is reviewed weekly and refreshed quarterly.',
    type: 'Always-on', typeColor: '#a7aebe',
    timing: 'Not all-day Campaign',
    createdBy: 'Sarah A.', createdAt: 'May 12, 2026',
  },
  {
    name: 'Engage Product Webinar Campaign',
    color: '#fde9b0', text: '#8c631c', emoji: '📣', s: 1, e: 22,
    status: 'active',
    description: 'Multi-channel promotion for the June product webinar series. Covers pre-event awareness, live reminders, and post-event follow-up.',
    type: 'Event', typeColor: '#f97316',
    timing: 'Not all-day Campaign',
    createdBy: 'Sarah A.', createdAt: 'May 14, 2026',
  },
  {
    name: 'GTM Phase 2: Launch Communication Orchestration',
    color: '#fcd6e8', text: '#a0325a', emoji: '📢', s: 1, e: 19,
    status: 'active',
    description: 'Phase 2 of the go-to-market launch sequence. Focuses on feature announcements, partner co-marketing, and sales enablement content.',
    type: 'Launch', typeColor: '#ec4899',
    timing: 'Not all-day Campaign',
    createdBy: 'Sarah A.', createdAt: 'May 15, 2026',
  },
  {
    name: 'P1 Product Release: Orchestrate',
    color: '#d4f0c0', text: '#2e881b', emoji: '🚀', s: 1, e: 30,
    status: 'active',
    description: 'Priority 1 product release campaign for the Orchestrate module. Includes launch blog, social posts, and customer announcement emails.',
    type: 'Product Release', typeColor: '#2e881b',
    timing: 'Not all-day Campaign',
    createdBy: 'Sarah A.', createdAt: 'May 16, 2026',
  },
  {
    name: 'P2 Product Release: Analyze',
    color: '#c7e9f7', text: '#005461', emoji: '📊', s: 1, e: 19,
    status: 'active',
    description: 'Priority 2 product release campaign for the Analyze module. Supporting materials include how-to videos, case studies, and analyst briefings.',
    type: 'Product Release', typeColor: '#0891b2',
    timing: 'Not all-day Campaign',
    createdBy: 'Sarah A.', createdAt: 'May 16, 2026',
  },
];
