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
    partnerB: 'Oluwatobiloba',
    hashtag: '#AdeOba',
    tagline: 'A journey of love',
  },

  /** ISO string with timezone offset so the countdown is correct everywhere. Start time is a placeholder. */
  date: '2026-12-15T15:00:00+01:00',
  dateLabel: 'Tuesday, December 15th, 2026',

  venue: {
    // Only the city is confirmed so far — add the venue name and street address when announced.
    name: 'Ibadan, Oyo State',
    address: ['Venue details to follow'],
    mapsUrl: 'https://maps.google.com/?q=Ibadan,+Oyo+State,+Nigeria',
    website: '',
    note: 'Seating is thoughtfully curated to preserve the warmth and intimacy of the day. Full venue details and timings will be shared with invited guests.',
  },

  /**
   * 🔒 Guests must enter this PIN before seeing the site (digits only, any length).
   * It's asked again on every page load, whenever the guest leaves the tab, and after
   * `lockAfter` seconds without any tap, scroll or keypress (0 = never lock for inactivity).
   * The photo gallery is exempt, so guests can take/upload photos without being locked out.
   * Leave `pin` empty ('') to turn the PIN screen off.
   */
  pin: '0000',
  lockAfter: 60,

  /** Background music. Leave empty ('') to hide the sound toggle. */
  music: '',

  /** Optional intro video behind the hero. Leave empty for the animated gradient. */
  heroVideo: '',

  /**
   * 🌍 GLOBE STORY — cities are PLACEHOLDERS until you pick the real ones.
   * Each stop: id (unique, no spaces), title (the memory's name, shown on the globe), city, coords [lat, lng],
   * year, caption, photos (paths under /public, e.g. '/images/story/lagos-1.jpg').
   * Order matters: arcs are drawn from each stop to the next.
   * Get coordinates by right-clicking a spot in Google Maps.
   * An empty array hides the globe and keeps just the closing line.
   */
  story: [
    {
      id: 'first-meet',
      city: 'Lagos',
      title: 'First Date',
      coords: [6.5244, 3.3792],
      year: '2019',
      caption: 'A mutual friend’s birthday, one shared plate of suya, and a conversation that never really ended.',
      photos: [],
    },
    {
      id: 'first-trip',
      city: 'Dubai',
      title: 'First Trip Together',
      coords: [25.2048, 55.2708],
      year: '2021',
      caption: 'A long weekend that turned into planning every trip after it.',
      photos: [],
    },
    {
      id: 'distance',
      city: 'New York',
      title: 'The Long-Distance Year',
      coords: [40.7128, -74.006],
      year: '2023',
      caption: 'Different time zones, late-night calls, and a lot of airport goodbyes.',
      photos: [],
    },
    {
      id: 'proposal',
      city: 'Cape Town',
      title: 'The Proposal',
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
    {
      q: 'Can I bring a plus-one?',
      a: 'Attendance is strictly by personal invitation, and seating is curated to keep the day warm and intimate — so we kindly ask that only the guests named on your invitation attend.',
    },
    {
      q: 'Can I share the invitation with others?',
      a: 'We’d be grateful if you didn’t — please allow us to inform others ourselves.',
    },
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
      name: 'Oluwatobiloba',
      bank: 'Placeholder Bank',
      accountName: 'Tobi Placeholder',
      accountNumber: '9876543210',
    },
  ],

  rsvp: {
    allowPlusOne: false, // attendance is strictly by personal invitation
    deadlineLabel: 'Kindly respond by November 1st, 2026',
  },
}
