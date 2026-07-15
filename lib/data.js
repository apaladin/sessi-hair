/* Editorial imagery.
   Demo uses Unsplash (free license, hotlink-friendly). To use the brand's own
   AI campaign imagery later, just replace these URLs — everything else adapts.
   `u(id, w, h)` builds a cropped Unsplash URL. */
const u = (id, w = 900, h = 1300) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=80`;

const face = (id) =>
  `https://images.unsplash.com/photo-${id}?w=560&h=700&fit=crop&crop=faces&q=80`;

export const WALL_ART = [
  u('1526510747491-58f928ec870f'),   // flowing red-gold hair in warm light
  u('1531746020798-e6953c6e8e04'),   // dark editorial waves
  u('1524250502761-1ac6f2e30d43'),   // golden backlit hair
  u('1509967419530-da38b4704bc6'),   // sleek dark centre-part
  u('1524504388940-b1c1722653e1'),   // studio editorial portrait
  u('1485875437342-9b39470b3d95'),   // balayage waves
];

/* front-facing portraits for the Try It On mirror */
export const TRYON_SAMPLES = [
  face('1494790108377-be9c29b29330'),
  face('1544005313-94ddf0286df2'),
];

const av = (id) =>
  `https://images.unsplash.com/photo-${id}?w=96&h=96&fit=crop&crop=faces&q=80`;

export const COLLECTIONS = [
  {
    key: 'pure-donor', name: 'Pure Donor', label: 'THE PURE DONOR COLLECTION',
    tagline: 'Single-donor purity, fully traceable.',
    price: 'From £245',
    desc: 'Our founding collection. Hair from a single donor, cuticle intact and aligned, so it moves and ages exactly as your own. The quiet flagship of the house.',
    top: [24, 15, 9], bottom: [67, 44, 26],
    shades: ['#191009', '#2a1b10', '#432c1a', '#6e4a26'],
    models: [u('1509967419530-da38b4704bc6'), u('1544005313-94ddf0286df2'), u('1531746020798-e6953c6e8e04'), u('1524504388940-b1c1722653e1')],
    products: [
      { n: 'Clip-In Set · 22"', p: '£245' },
      { n: 'Tape-In Wefts · 20"', p: '£265' },
      { n: 'Luxe Ponytail · 24"', p: '£225' },
      { n: 'Halo Crown Weft', p: '£285' },
      { n: 'The Full Head Set', p: '£395' },
    ],
    rating: '4.9', count: 214,
    reviews: [
      { name: 'Amara O.', where: 'London', stars: 5, img: av('1519699047748-de8e457a634e'),
        text: 'Matched my own hair so perfectly my stylist asked where I sourced it. The weight feels completely natural.' },
      { name: 'Sophie H.', where: 'Manchester', stars: 5, img: av('1494790108377-be9c29b29330'),
        text: 'Third set from Sessi. The traceability is why I stay — you can genuinely feel the difference in the cuticle.' },
    ],
  },
  {
    key: 'vogue', name: 'Vogue', label: 'THE VOGUE COLLECTION',
    tagline: 'Editorial drama for the front row.',
    price: 'From £195',
    desc: 'Length and movement designed for the camera — runway volume that photographs like a cover story and wears as light as silk.',
    top: [15, 10, 6], bottom: [42, 27, 16],
    shades: ['#14100b', '#191009', '#2a1b10', '#432c1a'],
    models: [u('1531746020798-e6953c6e8e04'), u('1494790108377-be9c29b29330'), u('1502823403499-6ccfcf4fb453'), u('1526510747491-58f928ec870f')],
    products: [
      { n: 'Clip-In Set · 24"', p: '£195' },
      { n: 'Runway Volume Weft', p: '£235' },
      { n: 'Editorial Ponytail', p: '£185' },
      { n: 'Backstage Halo', p: '£215' },
      { n: 'The Cover Set', p: '£345' },
    ],
    rating: '4.8', count: 167,
    reviews: [
      { name: 'Elena R.', where: 'London', stars: 5, img: av('1531746020798-e6953c6e8e04'),
        text: 'Wore these for a shoot and the photographer assumed it was all mine. The movement is unreal on camera.' },
      { name: 'Priya K.', where: 'Birmingham', stars: 4, img: av('1487412720507-e7ab37603c6f'),
        text: 'Dramatic length without the weight. Wish I had sized up on volume — going back for the Cover Set.' },
    ],
  },
  {
    key: 'ime', name: "I'ME", label: "THE I'ME COLLECTION",
    tagline: 'Identity, made effortless.',
    price: 'From £175',
    desc: 'Everyday luxury — seamless clip-ins engineered to disappear into your own hair in minutes, for the woman who is already herself.',
    top: [67, 44, 26], bottom: [143, 101, 53],
    shades: ['#432c1a', '#5f4023', '#8f6535', '#b98a4c'],
    models: [u('1529626455594-4ff0802cfb7e'), u('1485875437342-9b39470b3d95'), u('1544005313-94ddf0286df2'), u('1494790108377-be9c29b29330')],
    products: [
      { n: 'Seamless Clip-In · 20"', p: '£175' },
      { n: 'Invisible Halo', p: '£195' },
      { n: 'Everyday Ponytail', p: '£155' },
      { n: 'Weekend Waves Set', p: '£205' },
      { n: 'The Signature Set', p: '£315' },
    ],
    rating: '4.9', count: 342,
    reviews: [
      { name: 'Chloe W.', where: 'Leeds', stars: 5, img: av('1529626455594-4ff0802cfb7e'),
        text: 'Clips in over a lunch break, invisible by the time I am back at my desk. Effortless is the right word.' },
      { name: 'Yasmin A.', where: 'London', stars: 5, img: av('1485875437342-9b39470b3d95'),
        text: 'First extensions that do not feel like a costume. It is just… more me. Exactly what the name promises.' },
    ],
  },
  {
    key: 'mystique', name: 'Mystique & Secrets', label: 'MYSTIQUE & SECRETS',
    tagline: 'Volume that keeps its counsel.',
    price: 'From £215',
    desc: 'Invisible-weft construction beneath, undetectable fullness above. The collection no one will ever see — only notice.',
    top: [30, 19, 11], bottom: [95, 64, 35],
    shades: ['#2a1b10', '#432c1a', '#5f4023', '#6e4a26'],
    models: [u('1519699047748-de8e457a634e'), u('1526510747491-58f928ec870f'), u('1509967419530-da38b4704bc6'), u('1531746020798-e6953c6e8e04')],
    products: [
      { n: 'Invisible Weft · 22"', p: '£215' },
      { n: 'Secret Volume Set', p: '£255' },
      { n: 'Crown Filler', p: '£165' },
      { n: 'Whisper Halo', p: '£235' },
      { n: 'The Unseen Set', p: '£365' },
    ],
    rating: '5.0', count: 128,
    reviews: [
      { name: 'Naomi B.', where: 'Bristol', stars: 5, img: av('1544005313-94ddf0286df2'),
        text: 'Nobody can tell. Not even my hairdresser, until she touched the weft. That is the whole point, and it delivers.' },
      { name: 'Grace T.', where: 'Edinburgh', stars: 5, img: av('1524504388940-b1c1722653e1'),
        text: 'The volume reads as genetics, not product. Exactly as promised on the box — which is also beautiful, by the way.' },
    ],
  },
  {
    key: 'lustre', name: 'Lustre', label: 'THE LUSTRE COLLECTION',
    tagline: 'Glass-light shine, silk-soft touch.',
    price: 'From £185',
    desc: 'Finished with our signature silk-protein ritual for a reflective, glass-like sheen that catches light the way lacquer catches a room.',
    top: [143, 101, 53], bottom: [217, 188, 140],
    shades: ['#8f6535', '#b98a4c', '#d9bc8c', '#e9ddc7'],
    models: [u('1524250502761-1ac6f2e30d43'), u('1524504388940-b1c1722653e1'), u('1485875437342-9b39470b3d95'), u('1526510747491-58f928ec870f')],
    products: [
      { n: 'Silk Clip-In · 22"', p: '£185' },
      { n: 'Glass Weft · 20"', p: '£205' },
      { n: 'Lustre Ponytail', p: '£170' },
      { n: 'Silk Halo', p: '£225' },
      { n: 'The Radiance Set', p: '£335' },
    ],
    rating: '4.8', count: 193,
    reviews: [
      { name: 'Isabelle M.', where: 'London', stars: 5, img: av('1524250502761-1ac6f2e30d43'),
        text: 'The shine is absurd. Caught the restaurant light at dinner and was asked about it twice before dessert.' },
      { name: 'Hannah D.', where: 'Brighton', stars: 4, img: av('1526510747491-58f928ec870f'),
        text: 'Beautiful gloss, and it arrived gift-wrapped like jewellery. One star held back only because I want more shades.' },
    ],
  },
];

export const ROOM = { hw: 13, hd: 9.5, h: 6.2 };

/* where the camera idles before the visitor enters */
export const ENTRY = { pos: [0, 1.7, 8.4], look: [0, 2.0, -2] };

export const STOPS = [
  { pos: [0, 1.6, -6.2], look: [0, 2.1, -ROOM.hd], collection: 0 },
  { pos: [-7.4, 1.6, -6.2], look: [-7.4, 2.1, -ROOM.hd], collection: 1 },
  { pos: [7.4, 1.6, -6.2], look: [7.4, 2.1, -ROOM.hd], collection: 2 },
  { pos: [-9.7, 1.6, -1.2], look: [-ROOM.hw, 2.1, -1.2], collection: 3 },
  { pos: [9.7, 1.6, -1.2], look: [ROOM.hw, 2.1, -1.2], collection: 4 },
];

for (const s of STOPS) {
  if (s.collection !== undefined) {
    const c = COLLECTIONS[s.collection];
    s.title = c.name;
    s.sub = c.tagline;
  }
}

