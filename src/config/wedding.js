/**
 * ─────────────────────────────────────────────────────────────
 *  ALL of the couple's content lives here.
 *  Everything below is PLACEHOLDER — swap in your friends' real
 *  names, dates, story, photos and details.
 * ─────────────────────────────────────────────────────────────
 */

export const wedding = {
  couple: {
    partnerA: 'Adeola',
    partnerB: 'Tobi',
    tagline: 'A journey of love',
  },

  /** ISO string with timezone offset so the countdown is correct everywhere. */
  date: '2026-12-12T15:00:00+01:00',
  dateLabel: 'December 12th, 2026',

  venue: {
    name: 'The Garden Pavilion',
    address: ['12 Placeholder Road', 'Lagos, Nigeria'],
    mapsUrl: 'https://maps.google.com/?q=Lagos',
    website: '',
    note: 'Doors open at 2:30 PM. Ceremony begins at 3:00 PM sharp. Reception to follow.',
  },

  /** Background music. Leave empty ('') to hide the sound toggle. */
  music: '',

  /** Optional intro video behind the hero. Leave empty for the animated gradient. */
  heroVideo: '',

  /**
   * 🌍 GLOBE STORY — cities are PLACEHOLDERS until you pick the real ones.
   * Each stop: id (unique, no spaces), city, place (short title), coords [lat, lng],
   * year, caption, photos (paths under /public, e.g. '/images/story/lagos-1.jpg').
   * Order matters: arcs are drawn from each stop to the next.
   * Get coordinates by right-clicking a spot in Google Maps.
   * An empty array hides the globe and keeps just the closing line.
   */
  story: [
    {
      id: 'first-meet',
      city: 'Lagos',
      place: 'Where it all started',
      coords: [6.5244, 3.3792],
      year: '2019',
      caption: 'A mutual friend’s birthday, one shared plate of suya, and a conversation that never really ended.',
      photos: [],
    },
    {
      id: 'first-trip',
      city: 'Accra',
      place: 'Our first trip together',
      coords: [5.6037, -0.187],
      year: '2021',
      caption: 'A long weekend that turned into planning every trip after it.',
      photos: [],
    },
    {
      id: 'distance',
      city: 'London',
      place: 'The long-distance year',
      coords: [51.5072, -0.1276],
      year: '2023',
      caption: 'Different time zones, late-night calls, and a lot of airport goodbyes.',
      photos: [],
    },
    {
      id: 'proposal',
      city: 'Cape Town',
      place: 'The proposal',
      coords: [-33.9249, 18.4241],
      year: '2025',
      caption: 'Table Mountain at sunset. She said yes before he finished the question.',
      photos: [],
    },
  ],

  timeline: [
    { time: '2:30 PM', title: 'Doors Open', icon: 'door' },
    { time: '3:00 PM', title: 'Ceremony', icon: 'heart' },
    { time: '4:00 PM', title: 'Cocktail Hour', icon: 'glass' },
    { time: '5:00 PM', title: 'Reception Dinner', icon: 'dinner' },
    { time: '9:00 PM', title: 'Send Off', icon: 'wave' },
  ],

  menu: [
    { course: 'The Starter', description: 'Placeholder — describe the starter here.' },
    { course: 'The Mains', description: 'Placeholder — describe the main courses here.' },
    { course: 'The Sides', description: 'Placeholder — describe the sides here.' },
    { course: 'The Sweets', description: 'Placeholder — describe the desserts and cake here.' },
  ],

  faq: [
    { q: 'Where are the ceremony and reception?', a: 'Placeholder — both will be held at the venue above.' },
    { q: 'Is there parking available?', a: 'Placeholder — add parking and transport details.' },
    { q: 'What should I wear?', a: 'Placeholder — add the dress code or colours of the day.' },
    { q: 'Can I bring a plus-one?', a: 'Placeholder — explain the plus-one policy.' },
    { q: 'Can I take photos?', a: 'Yes! Please share them in our gallery — tap the photo icon at the top of the page.' },
    {
      q: 'Do you have a registry?',
      a: 'Your presence is the best gift! If you’d like to give something, tap “Gift the Couple” for our account details.',
    },
  ],

  /**
   * 🎁 GIFTS — shown in the "Gift the Couple" panel (/gift).
   * Replace the PLACEHOLDER bank details below. Remove an entry to show only one account;
   * an empty array hides the gift buttons entirely.
   */
  gifts: [
    {
      role: 'The Bride',
      name: 'Adeola',
      bank: 'Placeholder Bank',
      accountName: 'Adeola Placeholder',
      accountNumber: '0123456789',
    },
    {
      role: 'The Groom',
      name: 'Tobi',
      bank: 'Placeholder Bank',
      accountName: 'Tobi Placeholder',
      accountNumber: '9876543210',
    },
  ],

  rsvp: {
    allowPlusOne: true,
    deadlineLabel: 'Kindly respond by November 1st, 2026',
  },
}
