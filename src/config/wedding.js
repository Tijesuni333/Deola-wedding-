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
    address: [],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=SMA+House+of+Formation%2C+Bodija%2C+Ibadan',
    /** 🔒 Directions are for selected guests only: the Directions button asks for this PIN first. '' = no PIN. */
    directionsPin: '7953',
    website: '',
    note: '', // optional line under the buttons; '' = hidden
  },

  /**
   * 🔒 Guests must enter this PIN before seeing the site (digits only, any length).
   * It’s asked again on every page load and whenever the guest leaves the tab. Optionally also after
   * `lockAfter` seconds without any tap, scroll or keypress (0 = never lock for inactivity).
   * The photo gallery is exempt, so guests can take/upload photos without being locked out.
   * Leave `pin` empty ('') to turn the PIN screen off.
   */
  pin: '5820',
  lockAfter: 0,

  /** Background music. Leave empty ('') to hide the sound toggle. */
  music: '/audio/nothing-can-keep-us-apart-2.m4a', // Moon Taxi – Nothing Can Keep Us Apart

  /** Optional intro video behind the hero. Leave empty for the animated gradient. */
  heroVideo: '',

  /**
   * 🌍 GLOBE STORY — cities are PLACEHOLDERS until you pick the real ones.
   * Each stop: id (unique, no spaces), title (the memory's name, shown on the globe), city, coords [lat, lng],
   * year, photos (paths under /public, e.g. '/images/story/lagos-1.jpg'; the first one is shown), and optional story (an array of paragraphs).
   * Or a video instead of a photo: video ('/video/….mp4') plus poster (an image shown while it loads).
   * Every story opens in a pop-up with “Read our story”. Optional caption: a line under the title.
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
      caption: 'We met in the most unexpected place and the most unimaginable thing happened.',
      coords: [6.5244, 3.3792],
      year: '2019',
      photos: ['/images/story/where-we-met.jpg'],
      story: [
        'Our story began at church during the crossover service on the last night of 2023. Adeola attended with her mum and brothers, and after service, Tobi offered to drop them off at the junction of Adeola’s house.',
        'In a memorable twist, Adeola’s brother hit a compartment in the front seat of Tobi’s car and broke it, which meant Adeola had the obligation to get it fixed. Because it was dark and hectic that night, Adeola didn’t even see his face and couldn’t tell who exactly carried them or what his name was.',
      ],
    },
    {
      id: 'how-we-met',
      city: 'Rio de Janeiro',
      title: 'How We Met',
      caption: 'Business brought us together and we are still standing on the business… of love.',
      coords: [-22.9068, -43.1729],
      year: '2019',
      photos: ['/images/story/how-we-met.jpg'],
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
      city: 'Mexico City',
      title: 'Our First Date',
      caption: 'We were on a roll and went on the highest number of dates ever in the shortest time!',
      coords: [19.4326, -99.1332],
      year: '2020',
      photos: ['/images/story/first-date.jpg'],
      story: [
        'Our first date wasn’t the conventional one… We went to shoot arrows! You heard that right.',
        'A week after colliding again on Instagram, Tobi gave Adeola two options for a first date: Salsa on a Sunday evening or Archery on a Friday evening. She chose Archery, and Salsa too, and we ended up going on three dates in five days. Yes, we were on a roll!',
        'On that very first date, after shooting arrows for about 30 minutes, we were supposed to go get food but we got so lost in conversations for almost 3 hours that we completely forgot to eat.',
        'Oh, what hearty conversations we had!',
      ],
    },
    {
      id: 'said-yes',
      city: 'Honolulu',
      title: 'The Day I Said Yes',
      caption: 'Adeola said yes to Tobi because she couldn’t say no!',
      coords: [21.3069, -157.8583],
      year: '2020',
      photos: ['/images/story/said-yes.jpg'],
      story: [
        'Tobi had already asked, and after taking a moment to think about it, Adeola said yes to a relationship leading to marriage on the 12th of July, 2025.',
        'Adeola loves surprises, and by this point, Tobi should be used to them, because Adeola delivered the response inside a cake box. Now, we cannot wait to say yes again at the altar.',
      ],
    },
    {
      id: 'first-kiss',
      city: 'Tokyo',
      title: 'Our First Kiss',
      caption: 'Sensational!',
      coords: [35.6762, 139.6503],
      year: '2021',
      photos: ['/images/story/first-kiss.jpg'],
      story: [
        'Now here is a reason why you might want front-row seats at our wedding…',
        'For the first time, you will see us kiss. 😌😉',
      ],
    },
    {
      id: 'introduction',
      city: 'Bangkok',
      title: 'Family Introduction',
      caption: 'The day the Adegbites and clan met the Sorunkes and their clan.',
      coords: [13.7563, 100.5018],
      year: '2025',
      photos: [],
      video: '/video/introduction.mp4',
      poster: '/images/story/introduction-poster.jpg',
      story: [
        'In September, our families officially met in an intimate and beautiful gathering that set the tone for everything to follow. If the traditional introduction was the beta test, it would be an indicator that the wedding will be amazing!',
        'There was plenty of food, plenty of joy and a show of love, confirming that our families fit together seamlessly.',
      ],
    },
    {
      id: 'best-memories',
      city: 'Dubai',
      title: 'Our Best Memories Together',
      caption: 'We have had crazy fun being each other’s best friends in the past twenty-something months.',
      coords: [25.2048, 55.2708],
      year: '2026',
      photos: [],
      video: '/video/best-memories.mp4',
      poster: '/images/story/best-memories-poster.jpg',
      story: [
        'For the past twenty-something months, we have had crazy fun being each other’s best friends. We have travelled to a couple of states together, explored tourist sites and dined in several places.',
        'We have bonded over food, over fun, over salsa, over arcade games, over silly AI short dramas, over Chelsea, over Africanism, over good music, over pop quiz events and a lot more. We have truly been each other’s muse.',
        'Watch the video to see what we are talking about.',
      ],
    },
  ],

  timeline: [
    { time: '12:00 PM', title: 'Traditional Wedding', icon: 'heart' },
    { time: '1:00 PM', title: 'Reception', icon: 'dinner' },
    { time: '4:00 PM', title: 'Send Off', icon: 'wave' },
  ],

  faq: [
    { q: 'Is there parking available?', a: 'Yes, there is.' },
    { q: 'What should I wear?', a: 'Wear anything comfortable. Please refer to the invite for the colours of the day.' },
    {
      q: 'Can I bring a plus-one?',
      a: 'Attendance is strictly by personal invitation, and seating is curated to keep the day warm and intimate — so we kindly ask that only the guests named on your invitation attend.',
    },
    {
      q: 'Can I share the invitation with others?',
      a: 'We’d be grateful if you didn’t — please allow us to inform others ourselves.',
    },
    { q: 'Can I take photos?', a: 'Yes! Please share them in our gallery — tap the photo icon at the top of the page. However, kindly allow us share online first before you do.' },
    {
      q: 'Do you have a gift registry?',
      a: 'Your presence is the best gift! If you’d like to give something, tap “Gift the Couple” to see our wishlist and account details.',
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

  /**
   * 🎶💸 Extra buttons, shown after Gift in the details section and as icons in the top bar.
   * Each opens a pop-up whose button goes to `url` (an outside site). Remove an entry to hide it.
   */
  linkOuts: [
    {
      id: 'song',
      icon: 'music',
      label: 'Request a Song',
      title: 'Request a Song at the wedding',
      text: 'Want to hear your favourite love songs on the dancefloor? Drop your song requests straight into the DJ queue so we can dance to the beats you love the most.',
      button: 'Add Your Song',
      url: '', // link to the DJ playlist
    },
    {
      id: 'spray',
      icon: 'money',
      label: 'Spray Money',
      title: 'Spray Money Virtually',
      text: 'Can’t spray us with physical cash? No problem! Create a digital wallet on the spot in seconds and spray us with love right from your phone as the party gets moving.',
      button: 'Start Spraying',
      url: '', // link to the Nawo app
    },
  ],

  rsvp: {
    allowPlusOne: false, // attendance is strictly by personal invitation
    deadlineLabel: 'Kindly respond by November 1st, 2026',
  },

  /**
   * 📺 Live stream for guests joining online. From `from` onwards (a day before the wedding), every RSVP button
   * becomes “Watch Live” and opens `url`, and the RSVP form closes. It only switches once `url` is filled in.
   * Preview it any time by adding ?live to the site address (e.g. adeoba.world/?live).
   */
  liveStream: {
    url: '', // the YouTube live link
    from: '2026-12-14T00:00:00+01:00', // Monday Dec 14, midnight Nigeria time
  },
}
