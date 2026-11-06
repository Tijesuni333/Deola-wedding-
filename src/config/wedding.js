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
   * year, caption (a one-line teaser shown on the card), photos (paths under /public, e.g. '/images/story/lagos-1.jpg'),
   * and optional story (an array of paragraphs, opened with “Read our story”).
   * Order matters: arcs are drawn from each stop to the next.
   * Get coordinates by right-clicking a spot in Google Maps.
   * An empty array hides the globe and keeps just the closing line.
   * Cities here are only for spacing (they aren't shown). The globe spins sideways, so keep every stop at least
   * ~30° of LONGITUDE from the others: two stops stacked north–south face the front together and can't both be
   * spotlit on phones. The globe turns westward, so stops are laid out east→west to be spotlit in story order.
   */
  story: [
    {
      id: 'where-we-met',
      city: 'Lagos',
      title: 'Where We Met',
      coords: [6.5244, 3.3792],
      year: '2019',
      caption: 'Crossover night, the last service of 2023 — a ride home, a broken car compartment, and a driver whose face she never saw.',
      photos: [],
      story: [
        'Our story began at church during the crossover service on the last night of 2023. Adeola attended with her mum and brothers, and after service, Tobi offered to drop them off at the junction of Adeola’s house.',
        'In a memorable twist, Adeola’s brother hit a compartment in the front seat of Tobi’s car and broke it, which meant Adeola had the obligation to get it fixed. Because it was dark and hectic that night, Adeola didn’t even see his face and couldn’t tell who exactly carried them or what his name was.',
      ],
    },
    {
      id: 'how-we-met',
      city: 'Rio de Janeiro',
      title: 'How We Met',
      coords: [-22.9068, -43.1729],
      year: '2019',
      caption: 'A mysterious “Bro Tobi”, a DM about a client, and a grant-writing seminar that finally connected the dots.',
      photos: [],
      story: [
        'The next Sunday, Adeola asked the person organising transportation for church members who the driver was and was told it was a “Bro Tobi.” Adeola went to look for him to apologise again and tried to get the compartment fixed but Tobi told her not to worry about it, and that was all. No more contacts were exchanged.',
        'Then came May 30, 2024, when Tobi slid into Adeola’s DMs to tell her he had tried reaching one of her clients online to patronise them. He has since confessed that he was already attracted to her and was just looking for a way to talk to her. Not realising he was the same “Bro Tobi” from the crossover service, Adeola kept things friendly purely for church’s sake.',
        'Fast forward to February 9, 2025, at a grant-writing business seminar where Tobi was the facilitator. That was the day Adeola truly noticed him and admired his brilliance.',
        'A few days later, on February 12, an Instagram user who had been quietly engaging with her posts for some months replied to her story post directly. It had been random and she didn’t know who he was until he texted again that day. The puzzle pieces finally connected when Adeola realised, “Wait, this is the Tobi Adegbite from church who also happens to be our grant writing mentor. Yay! Perfect opportunity to ask for help directly.”',
        'They talked the longest ever up till that day, decided to move the conversation to WhatsApp, and it was only then that Adeola realised the other “Bro Tobi” from church was actually the exact same person. In fact, that was how the journey of friendship truly started.',
      ],
    },
    {
      id: 'first-date',
      city: 'New York',
      title: 'Our First Date',
      coords: [40.7128, -74.006],
      year: '2020',
      caption: 'Placeholder — where we went, what we ate, and how nervous we were.',
      photos: [],
    },
    {
      id: 'said-yes',
      city: 'Los Angeles',
      title: 'The Day I Said Yes',
      coords: [34.0522, -118.2437],
      year: '2020',
      caption: 'Placeholder — the day we made it official.',
      photos: [],
    },
    {
      id: 'first-kiss',
      city: 'Honolulu',
      title: 'Our First Kiss',
      coords: [21.3069, -157.8583],
      year: '2021',
      caption: 'Placeholder — the moment we’ll never forget.',
      photos: [],
    },
    {
      id: 'proposal',
      city: 'Tokyo',
      title: 'The Proposal',
      coords: [35.6762, 139.6503],
      year: '2025',
      caption: 'Placeholder — the question, the ring, and the yes.',
      photos: [],
    },
    {
      id: 'introduction',
      city: 'Bangkok',
      title: 'Introduction',
      coords: [13.7563, 100.5018],
      year: '2025',
      caption: 'Placeholder — our families came together to celebrate us.',
      photos: [],
    },
    {
      id: 'best-memories',
      city: 'Dubai',
      title: 'Our Best Memories Together',
      coords: [25.2048, 55.2708],
      year: '2026',
      caption: 'Placeholder — the trips, the laughs, and everything in between.',
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
      bank: 'Opay',
      accountName: 'Adeola Sorunke',
      accountNumber: '7089562787',
    },
    {
      role: 'The Groom',
      name: 'Oluwatobiloba',
      bank: 'GTBank',
      accountName: 'Adegbite Tobi Gabriel',
      accountNumber: '0177350044',
    },
  ],

  rsvp: {
    allowPlusOne: false, // attendance is strictly by personal invitation
    deadlineLabel: 'Kindly respond by November 1st, 2026',
  },
}
