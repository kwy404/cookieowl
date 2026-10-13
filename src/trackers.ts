// Well known trackers the auto blocker recognizes by URL, with the first party
// cookies they set so a withdrawal can erase them.
import type { TrackerPattern } from './types';

export const TRACKERS: TrackerPattern[] = [
  {
    id: 'gtag',
    name: 'Google Analytics',
    category: 'analytics',
    match: /^https?:\/\/(?:[\w-]+\.)*(?:googletagmanager\.com\/gtag\/js|google-analytics\.com\/(?:analytics|ga|urchin)\.js)/,
    cookies: ['_ga', '_ga_*', '_gid', '_gat*', '__utm*'],
    google: true,
  },
  {
    id: 'gtm',
    name: 'Google Tag Manager',
    category: 'analytics',
    match: /^https?:\/\/(?:[\w-]+\.)*googletagmanager\.com\/gtm\.js/,
    google: true,
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    category: 'marketing',
    match: /^https?:\/\/(?:[\w-]+\.)*(?:googleadservices\.com\/pagead\/conversion|googlesyndication\.com\/pagead\/|doubleclick\.net\/)/,
    cookies: ['_gcl_*'],
    google: true,
  },
  {
    id: 'meta-pixel',
    name: 'Meta Pixel',
    category: 'marketing',
    match: /^https?:\/\/connect\.facebook\.net\/[\w-]+\/(?:fbevents|sdk)\.js/,
    cookies: ['_fbp', '_fbc'],
  },
  {
    id: 'clarity',
    name: 'Microsoft Clarity',
    category: 'analytics',
    match: /^https?:\/\/(?:[\w-]+\.)*clarity\.ms\/(?:tag|s)\//,
    cookies: ['_clck', '_clsk'],
  },
  {
    id: 'hotjar',
    name: 'Hotjar',
    category: 'analytics',
    match: /^https?:\/\/(?:static|script)\.hotjar\.com\//,
    cookies: ['_hj*'],
  },
  {
    id: 'linkedin-insight',
    name: 'LinkedIn Insight Tag',
    category: 'marketing',
    match: /^https?:\/\/snap\.licdn\.com\/li\.lms-analytics\//,
    cookies: ['li_fat_id', 'li_giant'],
  },
  {
    id: 'tiktok-pixel',
    name: 'TikTok Pixel',
    category: 'marketing',
    match: /^https?:\/\/analytics\.tiktok\.com\/i18n\/pixel\//,
    cookies: ['_ttp', '_tt_enable_cookie'],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'marketing',
    kind: 'embed',
    match: /^https?:\/\/(?:www\.)?(?:youtube\.com|youtube-nocookie\.com)\/embed\//,
  },
  {
    id: 'youtube-api',
    name: 'YouTube',
    category: 'marketing',
    match: /^https?:\/\/(?:www\.)?youtube\.com\/(?:iframe_api|player_api)/,
  },
  {
    id: 'vimeo',
    name: 'Vimeo',
    category: 'marketing',
    kind: 'embed',
    match: /^https?:\/\/player\.vimeo\.com\/video\//,
  },
];
