/* Rounded, single-stroke glyphs: the centerline of each real glass tube.
   No font, canvas bitmap, or photograph is used for the lettering. */
const glyphs = {
  A: { w: 55, d: 'M3 80 L25 5 Q28 -2 31 5 L53 80 M13 53 H43' },
  B: { w: 54, d: 'M5 79 V7 Q5 1 11 1 H28 C55 1 56 36 29 39 H7 M29 39 C60 39 61 79 29 79 H11' },
  C: { w: 55, d: 'M51 15 C42 -8 4 -5 4 34 V47 C4 83 40 90 51 67' },
  D: { w: 55, d: 'M5 78 V7 Q5 1 11 1 H24 C46 1 53 17 53 39 C53 63 46 79 24 79 H12' },
  E: { w: 47, d: 'M45 1 H12 Q5 1 5 8 V72 Q5 79 12 79 H45 M7 39 H40' },
  F: { w: 46, d: 'M45 1 H12 Q5 1 5 8 V79 M7 39 H38' },
  G: { w: 58, d: 'M52 15 C39 -8 5 -4 5 35 V46 C5 82 49 94 53 60 V44 H32' },
  H: { w: 54, d: 'M5 1 V79 M50 1 V79 M7 40 H48' },
  I: { w: 13, d: 'M7 1 V79' },
  J: { w: 46, d: 'M41 1 V56 C41 84 6 84 5 58' },
  K: { w: 54, d: 'M5 1 V79 M49 1 L10 42 M20 32 L51 79' },
  L: { w: 45, d: 'M5 1 V72 Q5 79 12 79 H43' },
  M: { w: 68, d: 'M5 79 V6 Q5 -1 10 4 L31 48 Q34 55 37 48 L58 4 Q63 -1 63 6 V79' },
  N: { w: 58, d: 'M5 79 V7 Q5 -1 10 6 L49 75 Q54 84 54 75 V1' },
  O: { w: 59, d: 'M25 79 C8 78 4 64 4 40 C4 14 12 1 30 1 C49 1 55 16 55 40 C55 63 50 78 33 79' },
  P: { w: 52, d: 'M5 79 V8 Q5 1 12 1 H28 C55 1 56 41 28 42 H8' },
  Q: { w: 60, d: 'M25 79 C8 78 4 64 4 40 C4 14 12 1 30 1 C49 1 55 16 55 40 C55 61 50 75 35 78 M36 58 L57 82' },
  R: { w: 53, d: 'M5 79 V8 Q5 1 12 1 H28 C55 1 56 39 28 40 H8 M29 42 L52 79' },
  S: { w: 53, d: 'M48 13 C39 -5 8 -3 6 18 C3 39 24 37 37 45 C62 60 45 83 25 79 C14 78 7 74 3 66' },
  T: { w: 55, d: 'M2 1 H53 M28 4 V79' },
  U: { w: 56, d: 'M5 1 V55 C5 88 51 88 51 55 V1' },
  V: { w: 54, d: 'M3 1 L24 75 Q27 83 30 75 L51 1' },
  W: { w: 78, d: 'M3 1 L16 73 Q19 84 23 73 L37 27 Q39 20 41 27 L55 73 Q59 84 62 73 L75 1' },
  X: { w: 54, d: 'M4 1 L50 79 M50 1 L4 79' },
  Y: { w: 55, d: 'M3 1 L25 38 Q28 42 31 38 L52 1 M28 42 V79' },
  Z: { w: 52, d: 'M4 1 H46 Q51 1 47 7 L7 73 Q3 79 8 79 H50' },
  0: { w: 56, d: 'M24 79 C8 78 4 64 4 40 C4 14 12 1 28 1 C45 1 52 16 52 40 C52 63 47 78 32 79' },
  1: { w: 28, d: 'M6 16 L18 2 V79' },
  2: { w: 50, d: 'M6 18 C10 -2 46 -2 46 21 C46 40 8 56 5 79 H48' },
  3: { w: 50, d: 'M7 12 C14 -3 46 -1 45 20 C44 35 28 38 20 38 C32 39 48 44 47 62 C46 82 14 83 5 68' },
  4: { w: 52, d: 'M38 79 V4 Q38 -1 34 5 L4 54 H48' },
  5: { w: 50, d: 'M45 1 H10 L7 36 C18 28 47 31 47 56 C47 80 15 84 5 68' },
  6: { w: 52, d: 'M44 10 C32 -4 6 6 5 44 C4 76 48 88 48 55 C48 32 12 30 6 47' },
  7: { w: 48, d: 'M4 1 H45 L16 79' },
  8: { w: 52, d: 'M26 38 C6 34 6 2 26 1 C46 2 46 34 26 38 C3 43 3 79 26 79 C49 79 49 43 26 38' },
  9: { w: 52, d: 'M46 33 C40 50 4 48 4 25 C4 -2 46 -2 47 36 C48 74 20 84 8 70' },
  ',': { w: 15, d: 'M7 72 Q15 78 6 91' },
  '.': { w: 13, d: 'M6 77 L7 78' },
  ':': { w: 14, d: 'M7 28 L8 29 M7 74 L8 75' },
  ';': { w: 15, d: 'M7 28 L8 29 M7 72 Q15 78 6 91' },
  "'": { w: 13, d: 'M8 2 Q11 12 5 22' },
  '-': { w: 32, d: 'M5 40 H27' },
  '?': { w: 46, d: 'M6 16 C10 -3 43 -2 42 20 C41 37 23 41 23 57 M23 76 L24 78' },
  '!': { w: 15, d: 'M8 1 V56 M8 76 L9 78' },
};

const mountX = {
  A: 10, B: 5, C: 7, D: 5, E: 5, F: 5, G: 7, H: 5, I: 7, J: 38, K: 5, L: 5,
  M: 5, N: 5, O: 8, P: 5, Q: 8, R: 5, S: 48, T: 28, U: 8, V: 20, W: 16, X: 14,
  Y: 28, Z: 14, 0: 8, 1: 18, 2: 12, 3: 46, 4: 38, 5: 45, 6: 8, 7: 22, 8: 8, 9: 38,
  '?': 23, '-': 16,
};

const colors = {
  amber: { dark: '#6a3815', rim: '#bd7b26', glass: '#ffcd64', gas: '#fff0b3', core: '#fffde1' },
  blue: { dark: '#163c54', rim: '#367692', glass: '#51c5ff', gas: '#b1eeff', core: '#effdff' },
  white: { dark: '#354446', rim: '#82918d', glass: '#c5e1e1', gas: '#f0fcf7', core: '#ffffff' },
  rose: { dark: '#673241', rim: '#bd657b', glass: '#ff759c', gas: '#ffc2d4', core: '#fff4f6' },
};

const COLOR_SEQUENCE = ['amber', 'blue', 'blue', 'white', 'rose', 'rose'];
const DEFAULT_Y_6 = [39, 151, 250, 345, 447, 554];
const DEFAULT_DELAY_6 = [0, 0.18, 0.32, 0.48, 0.7, 0.84];

const STORAGE_KEYS = {
  CATALOG: 'neon_verses_catalog',
  LAST_INDEX: 'neon_last_verse_index',
  LAST_ID: 'neon_last_verse_id',
  LAST_SYNC: 'neon_last_sync_ts',
};

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const DEFAULT_VERSES = [
  {
    id: 'matthew-11-28',
    reference: 'Matthew 11:28',
    text: 'Come to me, all you who are weary and burdened, and I will give you rest.',
    lines: [
      { text: 'COME TO ME,', y: 39, width: 606, color: 'amber', delay: 0 },
      { text: 'ALL YOU WHO', y: 151, width: 557, color: 'blue', delay: 0.18 },
      { text: 'ARE WEARY', y: 250, width: 495, color: 'blue', delay: 0.32 },
      { text: 'AND BURDENED,', y: 345, width: 596, color: 'white', delay: 0.48 },
      { text: 'AND I WILL', y: 447, width: 555, color: 'rose', delay: 0.7 },
      { text: 'GIVE YOU REST.', y: 554, width: 580, color: 'rose', delay: 0.84 },
    ],
  },
  {
    id: 'psalm-23-1-3',
    reference: 'Psalm 23:1-3',
    text: 'The Lord is my shepherd, I lack nothing. He refreshes my soul.',
    lines: [
      { text: 'THE LORD IS', width: 560, color: 'amber' },
      { text: 'MY SHEPHERD,', width: 590, color: 'amber' },
      { text: 'I LACK NOTHING.', width: 575, color: 'white' },
      { text: 'HE QUIETS ME,', width: 540, color: 'blue' },
      { text: 'HE REFRESHES', width: 565, color: 'rose' },
      { text: 'MY SOUL.', width: 460, color: 'rose' },
    ],
  },
  {
    id: 'john-14-27',
    reference: 'John 14:27',
    text: 'Peace I leave with you; my peace I give you. Do not be afraid.',
    lines: [
      { text: 'PEACE I LEAVE', width: 580, color: 'amber' },
      { text: 'WITH YOU;', width: 480, color: 'blue' },
      { text: 'MY PEACE', width: 470, color: 'blue' },
      { text: 'I GIVE YOU.', width: 510, color: 'white' },
      { text: 'DO NOT BE', width: 490, color: 'rose' },
      { text: 'AFRAID.', width: 440, color: 'rose' },
    ],
  },
  {
    id: 'isaiah-40-31',
    reference: 'Isaiah 40:31',
    text: 'Those who hope in the Lord will renew their strength. They will soar like eagles.',
    lines: [
      { text: 'THOSE WHO HOPE', width: 600, color: 'amber' },
      { text: 'IN THE LORD', width: 535, color: 'blue' },
      { text: 'WILL RENEW', width: 525, color: 'blue' },
      { text: 'THEIR STRENGTH.', width: 605, color: 'white' },
      { text: 'THEY WILL SOAR', width: 575, color: 'rose' },
      { text: 'LIKE EAGLES.', width: 545, color: 'rose' },
    ],
  },
  {
    id: 'psalm-46-10',
    reference: 'Psalm 46:10',
    text: 'Be still, and know that I am God; I will be exalted in the earth.',
    lines: [
      { text: 'BE STILL,', width: 490, color: 'amber' },
      { text: 'AND KNOW', width: 495, color: 'amber' },
      { text: 'THAT I AM GOD;', width: 585, color: 'white' },
      { text: 'I WILL BE', width: 485, color: 'blue' },
      { text: 'EXALTED IN', width: 535, color: 'rose' },
      { text: 'THE EARTH.', width: 525, color: 'rose' },
    ],
  },
  {
    id: 'philippians-4-6-7',
    reference: 'Philippians 4:6-7',
    text: 'Be anxious for nothing, and the peace of God will guard your hearts.',
    lines: [
      { text: 'BE ANXIOUS', width: 530, color: 'amber' },
      { text: 'FOR NOTHING,', width: 565, color: 'blue' },
      { text: 'AND THE PEACE', width: 585, color: 'blue' },
      { text: 'OF GOD WILL', width: 545, color: 'white' },
      { text: 'GUARD YOUR', width: 540, color: 'rose' },
      { text: 'HEARTS.', width: 450, color: 'rose' },
    ],
  },
  {
    id: 'lamentations-3-22-23',
    reference: 'Lamentations 3:22-23',
    text: 'His mercies never come to an end; they are new every morning, great is thy faith.',
    lines: [
      { text: 'HIS MERCIES', width: 545, color: 'amber' },
      { text: 'NEVER COME', width: 545, color: 'blue' },
      { text: 'TO AN END;', width: 510, color: 'blue' },
      { text: 'THEY ARE NEW', width: 570, color: 'white' },
      { text: 'EVERY MORNING,', width: 595, color: 'rose' },
      { text: 'GREAT IS THY FAITH.', width: 605, color: 'rose' },
    ],
  },
  {
    id: 'joshua-1-9',
    reference: 'Joshua 1:9',
    text: 'Be strong and courageous. Do not fear; the Lord your God is with you wherever you go.',
    lines: [
      { text: 'BE STRONG AND', width: 580, color: 'amber' },
      { text: 'COURAGEOUS.', width: 555, color: 'amber' },
      { text: 'DO NOT FEAR;', width: 540, color: 'white' },
      { text: 'THE LORD YOUR', width: 585, color: 'blue' },
      { text: 'GOD IS WITH YOU', width: 595, color: 'rose' },
      { text: 'WHEREVER YOU GO.', width: 605, color: 'rose' },
    ],
  },
  {
    id: 'proverbs-3-5-6',
    reference: 'Proverbs 3:5-6',
    text: 'Trust in the Lord with all your heart; lean not on your own ways, he will guide you.',
    lines: [
      { text: 'TRUST IN THE', width: 555, color: 'amber' },
      { text: 'LORD WITH ALL', width: 580, color: 'blue' },
      { text: 'YOUR HEART;', width: 535, color: 'blue' },
      { text: 'LEAN NOT ON', width: 545, color: 'white' },
      { text: 'YOUR OWN WAYS,', width: 590, color: 'rose' },
      { text: 'HE WILL GUIDE YOU.', width: 600, color: 'rose' },
    ],
  },
  {
    id: 'romans-8-38-39',
    reference: 'Romans 8:38-39',
    text: 'Neither death nor life, nor things to come, can separate us from the love of God.',
    lines: [
      { text: 'NEITHER DEATH', width: 585, color: 'amber' },
      { text: 'NOR LIFE,', width: 470, color: 'blue' },
      { text: 'NOR THINGS', width: 520, color: 'blue' },
      { text: 'TO COME, CAN', width: 560, color: 'white' },
      { text: 'SEPARATE US FROM', width: 605, color: 'rose' },
      { text: 'THE LOVE OF GOD.', width: 590, color: 'rose' },
    ],
  },
  {
    id: 'matthew-5-14',
    reference: 'Matthew 5:14-16',
    text: 'You are the light of the world. A city on a hill cannot hide; let it shine.',
    lines: [
      { text: 'YOU ARE THE', width: 545, color: 'amber' },
      { text: 'LIGHT OF', width: 465, color: 'amber' },
      { text: 'THE WORLD.', width: 520, color: 'white' },
      { text: 'A CITY ON A HILL', width: 595, color: 'blue' },
      { text: 'CANNOT HIDE;', width: 555, color: 'rose' },
      { text: 'LET IT SHINE.', width: 545, color: 'rose' },
    ],
  },
  {
    id: 'psalm-121-1-2',
    reference: 'Psalm 121:1-2',
    text: 'I lift up my eyes to the hills. Where does my help come from? From the Lord, Maker of heaven.',
    lines: [
      { text: 'I LIFT UP MY', width: 540, color: 'amber' },
      { text: 'EYES TO THE HILLS.', width: 605, color: 'blue' },
      { text: 'WHERE DOES MY', width: 585, color: 'blue' },
      { text: 'HELP COME FROM?', width: 595, color: 'white' },
      { text: 'FROM THE LORD,', width: 575, color: 'rose' },
      { text: 'MAKER OF HEAVEN.', width: 600, color: 'rose' },
    ],
  },
];

const CLASSIC_CABLES = [
  'M72 126 C70 174 58 207 82 244 C95 265 145 279 157 263',
  'M160 124 V169 C160 207 154 222 193 226 H235 C269 226 285 215 285 204',
  'M353 120 V160 C353 182 361 185 381 190',
  'M641 127 C650 198 648 227 609 234 H568 C540 234 536 242 537 251',
  'M84 271 C53 267 45 293 51 341 L47 393 C40 448 60 462 112 465',
  'M609 245 C606 287 624 303 609 332 C600 346 573 348 577 374',
  'M143 329 C143 354 151 365 183 365 H235',
  'M356 334 V376 C357 404 347 423 349 449',
  'M648 425 C653 455 633 482 592 477 C570 475 559 483 558 502',
  'M73 433 C59 482 56 523 105 540 H167 C197 540 205 552 205 568',
  'M282 535 C282 551 318 552 352 552 C382 552 393 564 393 590',
  'M617 529 C664 535 671 562 649 589 C644 597 636 600 635 611',
  'M203 632 C239 647 269 641 288 628 M421 636 C462 650 505 649 532 633',
];

function sanitizeText(text) {
  return String(text || '')
    .toUpperCase()
    .replace(/[—–]/g, '-')
    .replace(/[‘’]/g, "'")
    .replace(/[^A-Z0-9,.:;'\-?! ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function wrapTextIntoLines(text, maxRows = 6) {
  const clean = sanitizeText(text);
  const words = clean.split(' ').filter(Boolean);
  if (words.length === 0) return [{ text: 'REST.', width: 420, color: 'amber' }];

  const targetCount = Math.min(maxRows, Math.max(3, Math.ceil(clean.length / 13)));
  const targetLen = Math.max(8, Math.ceil(clean.length / targetCount));
  const grouped = [];
  let current = '';

  for (const word of words) {
    if (!current) {
      current = word;
    } else if ((current + ' ' + word).length <= targetLen || grouped.length === targetCount - 1) {
      current += ' ' + word;
    } else {
      grouped.push(current);
      current = word;
    }
  }
  if (current) grouped.push(current);

  return grouped.map((lineText, idx) => {
    const clampedWidth = Math.min(606, Math.max(440, 380 + lineText.length * 14));
    return {
      text: lineText,
      width: clampedWidth,
      color: COLOR_SEQUENCE[idx % COLOR_SEQUENCE.length],
    };
  });
}

function normalizeRows(verse) {
  const rawLines = Array.isArray(verse?.lines) && verse.lines.length > 0
    ? verse.lines
    : wrapTextIntoLines(verse?.text || 'COME TO ME');

  const count = rawLines.length;
  const topY = 39;
  const bottomY = 554;
  const stepY = count > 1 ? Math.round((bottomY - topY) / (count - 1)) : 0;

  return rawLines.map((row, index) => {
    const cleanLine = sanitizeText(row.text);
    const y = typeof row.y === 'number'
      ? row.y
      : (count === 6 ? DEFAULT_Y_6[index] : (count === 1 ? 290 : topY + index * stepY));
    const width = typeof row.width === 'number'
      ? row.width
      : Math.min(606, Math.max(440, 380 + cleanLine.length * 14));
    const color = colors[row.color] ? row.color : COLOR_SEQUENCE[index % COLOR_SEQUENCE.length];
    const delay = typeof row.delay === 'number'
      ? row.delay
      : (count === 6 ? DEFAULT_DELAY_6[index] : Number((index * 0.16).toFixed(2)));
    return { text: cleanLine, y, width, color, delay };
  });
}

function getCatalog(storage = globalThis.localStorage) {
  if (!storage) return DEFAULT_VERSES;
  try {
    const raw = storage.getItem(STORAGE_KEYS.CATALOG);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    storage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(DEFAULT_VERSES));
  } catch {
    // Ignore storage quota or private browsing errors
  }
  return DEFAULT_VERSES;
}

function saveCatalog(verses, syncedAt = Date.now(), storage = globalThis.localStorage) {
  if (!storage || !Array.isArray(verses) || verses.length === 0) return false;
  try {
    storage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(verses));
    storage.setItem(STORAGE_KEYS.LAST_SYNC, String(syncedAt));
    return true;
  } catch {
    return false;
  }
}

function selectNextVerse(storage = globalThis.localStorage, requestedHash = '') {
  const catalog = getCatalog(storage);
  const cleanHash = String(requestedHash || '').replace(/^#/, '').trim().toLowerCase();

  if (cleanHash && cleanHash !== 'shuffle') {
    const matchIndex = catalog.findIndex((v) => String(v.id).toLowerCase() === cleanHash);
    if (matchIndex !== -1) {
      try {
        storage?.setItem(STORAGE_KEYS.LAST_INDEX, String(matchIndex));
        storage?.setItem(STORAGE_KEYS.LAST_ID, catalog[matchIndex].id);
      } catch {}
      return { verse: catalog[matchIndex], index: matchIndex, total: catalog.length };
    }
  }

  let nextIndex = 0;
  try {
    const prevRaw = storage?.getItem(STORAGE_KEYS.LAST_INDEX);
    if (prevRaw !== null && prevRaw !== undefined && prevRaw !== '') {
      const prevIndex = Number.parseInt(prevRaw, 10);
      if (!Number.isNaN(prevIndex)) {
        nextIndex = (prevIndex + 1) % catalog.length;
      }
    }
    storage?.setItem(STORAGE_KEYS.LAST_INDEX, String(nextIndex));
    storage?.setItem(STORAGE_KEYS.LAST_ID, catalog[nextIndex].id);
  } catch {}

  return { verse: catalog[nextIndex], index: nextIndex, total: catalog.length };
}

function renderVerseToDom(verse, doc = globalThis.document) {
  if (!doc) return null;
  const svg = doc.querySelector('#neon');
  if (!svg) return null;
  const defs = svg.querySelector('defs');
  const NS = 'http://www.w3.org/2000/svg';

  const make = (tag, attrs = {}, parent = svg) => {
    const node = doc.createElementNS(NS, tag);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    parent.appendChild(node);
    return node;
  };
  const use = (id, attrs, parent) => make('use', { href: `#${id}`, ...attrs }, parent);
  const path = (d, attrs = {}, parent = svg) =>
    make('path', { d, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...attrs }, parent);

  // Ensure glass gradients exist once in <defs>
  for (const [name, c] of Object.entries(colors)) {
    if (!defs.querySelector(`#glass-${name}`)) {
      const grad = make('linearGradient', { id: `glass-${name}`, x1: '0', y1: '0', x2: '0.45', y2: '1' }, defs);
      [[0, c.gas], [0.18, c.rim], [0.43, c.dark], [0.72, c.glass], [1, c.dark]].forEach(([offset, color]) =>
        make('stop', { offset, 'stop-color': color }, grad)
      );
    }
  }

  // Clear previous dynamic line geometry in <defs> and rendered groups in <svg>
  Array.from(defs.querySelectorAll('g[id^="line-"]')).forEach((el) => el.remove());
  Array.from(svg.querySelectorAll('g.cables, g.neon-row')).forEach((el) => el.remove());

  const rows = normalizeRows(verse);

  const cables = make('g', { class: 'cables', opacity: '.76', 'aria-hidden': 'true' });
  for (const d of CLASSIC_CABLES) {
    path(d, { stroke: '#000', 'stroke-width': 6, opacity: 0.7, transform: 'translate(2 4)', filter: 'url(#contact-shadow)' }, cables);
    path(d, { stroke: '#101417', 'stroke-width': 5.2 }, cables);
    path(d, { stroke: 'url(#wire)', 'stroke-width': 3.5 }, cables);
    path(d, { stroke: '#bdd0d5', 'stroke-width': 0.65, opacity: 0.3, transform: 'translate(-.8 -.8)' }, cables);
  }

  rows.forEach((row, index) => {
    const chars = [...row.text].filter((ch) => ch === ' ' || glyphs[ch]);
    const rawWidth = Math.max(
      40,
      chars.reduce((n, ch) => n + (ch === ' ' ? 25 : glyphs[ch].w + 13), -13)
    );
    const scale = row.width / rawWidth;
    const left = (720 - row.width) / 2;
    const geometry = make('g', { id: `line-${index}`, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, defs);
    const letters = [];
    let x = 0;

    for (const ch of chars) {
      if (ch === ' ') {
        x += 25;
        continue;
      }
      path(glyphs[ch].d, { transform: `translate(${x} 0)` }, geometry);
      letters.push({ x, ch, width: glyphs[ch].w });
      x += glyphs[ch].w + 13;
    }

    const rowGroup = make('g', {
      class: 'neon-row',
      transform: `translate(${left} ${row.y}) scale(${scale})`,
      style: `--delay:${row.delay}s;--phase:${-(index * 2.13)}s;--duration:${13 + index * 1.3}s`,
      'data-verse-line': row.text,
    });
    const c = colors[row.color];
    const id = `line-${index}`;

    // Short lead wires and ceramic electrode sleeves underneath individual tubes.
    const fittings = make('g', { class: 'fittings' }, rowGroup);
    for (let j = 0; j < letters.length - 1; j++) {
      const a = letters[j];
      const b = letters[j + 1];
      if (",.:;'?!".includes(a.ch) || j % 3 === 1) continue;
      const p1 = a.x + a.width * 0.53;
      const p2 = b.x + 5;
      const d = `M${p1} 80 V87 C${p1} ${96 + (j % 3) * 4} ${p2} ${97 + (j % 2) * 5} ${p2} 86 V80`;
      path(d, { stroke: '#000', 'stroke-width': 3.5, opacity: 0.85, transform: 'translate(1 2)' }, fittings);
      path(d, { stroke: 'url(#wire)', 'stroke-width': 2.1 }, fittings);
    }

    const footPositions = letters
      .filter((a, j) => j % 2 === 0 && a.width > 20)
      .map((a) => ({ ...a, mount: a.x + (mountX[a.ch] ?? Math.round(a.width * 0.25)) }));

    for (const a of footPositions) {
      const foot = make('g', { transform: `translate(${a.mount} 63)` }, fittings);
      make('ellipse', { cx: 2, cy: 6, rx: 7, ry: 5, fill: '#000', opacity: 0.65 }, foot);
      make('rect', { x: -3, y: -4, width: 7, height: 15, rx: 3, fill: 'url(#metal)', stroke: '#0a1114', 'stroke-width': 1 }, foot);
      make('circle', { cx: 0.5, cy: 7, r: 1.2, fill: '#8c979a' }, foot);
      path('M-.3 7 H1.3', { stroke: '#162126', 'stroke-width': 0.5 }, foot);
    }

    // Occlusion and slight extrusion give the glass a physical lift off the shirt.
    use(id, { stroke: '#000', 'stroke-width': 12, opacity: 0.78, transform: 'translate(2.5 5)', filter: 'url(#contact-shadow)' }, rowGroup);
    use(id, { stroke: c.dark, 'stroke-width': 10.2, transform: 'translate(1.5 2.2)' }, rowGroup);
    use(id, { stroke: `url(#glass-${row.color})`, 'stroke-width': 9.2 }, rowGroup);

    const emission = make('g', { class: 'emission' }, rowGroup);
    use(id, { stroke: c.glass, 'stroke-width': 23, opacity: 0.21, filter: 'url(#spill)', class: 'spill' }, emission);
    use(id, { stroke: c.glass, 'stroke-width': 9, opacity: 0.4, filter: 'url(#halo)' }, emission);
    use(id, { stroke: c.gas, 'stroke-width': 8.15, opacity: 0.92 }, emission);
    use(id, { stroke: c.dark, 'stroke-width': 6.8, opacity: 0.94 }, emission);
    use(id, { stroke: c.glass, 'stroke-width': 5.3 }, emission);
    use(id, { stroke: c.gas, 'stroke-width': 3.25 }, emission);
    use(id, { stroke: c.core, 'stroke-width': 1.3, opacity: 0.98 }, emission);

    // A displaced specular line catches the upper left side of the glass.
    use(id, { stroke: '#ffffff', 'stroke-width': 0.62, opacity: 0.52, transform: 'translate(-3.1 -1.1)' }, rowGroup);
    for (const a of footPositions) {
      make('rect', { x: a.mount - 5.3, y: 58, width: 10.6, height: 3.5, rx: 1.6, fill: 'url(#clear-clip)', stroke: '#aac1c8', 'stroke-width': 0.35, opacity: 0.72 }, rowGroup);
    }

    // Insulated tube ends, visible in the tiny deliberate gaps of the O and 0 glyphs.
    for (const a of letters.filter((l) => l.ch === 'O' || l.ch === '0')) {
      [25, 33].forEach((dx) =>
        make('rect', { x: a.x + dx - 2.3, y: 78.6, width: 4.6, height: 7, rx: 1.4, fill: 'url(#metal)', opacity: 0.8 }, rowGroup)
      );
    }
  });

  // Update accessible headings, SVG title, and reference caption
  const fullText = verse.text || rows.map((r) => r.text).join(' ');
  const refText = verse.reference || 'Matthew 11:28';
  const h1 = doc.querySelector('h1.sr-only');
  if (h1) h1.textContent = `${fullText} — ${refText}`;
  const svgTitle = doc.querySelector('#neon-title');
  if (svgTitle) svgTitle.textContent = fullText;
  const refEl = doc.querySelector('.reference');
  if (refEl) {
    refEl.textContent = refText;
    refEl.setAttribute('data-verse-id', verse.id || 'custom');
  }
  doc.title = `Come to Me (${refText}): Glass Neon Verse | News Dieppe`;

  return { verse, rows };
}

async function syncFromBackendIfDue(storage = globalThis.localStorage, force = false) {
  if (!globalThis.fetch) return false;
  try {
    const lastSync = Number.parseInt(storage?.getItem(STORAGE_KEYS.LAST_SYNC) || '0', 10);
    const now = Date.now();
    if (!force && lastSync > 0 && now - lastSync < WEEK_MS) {
      return false;
    }
    const response = await fetch('./verses.json');
    if (!response.ok) return false;
    const payload = await response.json();
    if (Array.isArray(payload?.verses) && payload.verses.length > 0) {
      saveCatalog(payload.verses, now, storage);
      return true;
    }
  } catch {
    // Offline or network unreachable; localStorage catalog remains active
  }
  return false;
}

function registerServiceWorker() {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

  navigator.serviceWorker.addEventListener('message', (event) => {
    const msg = event.data;
    if (msg && msg.type === 'VERSES_UPDATED' && Array.isArray(msg.verses)) {
      saveCatalog(msg.verses, msg.syncedAt || Date.now());
    }
  });

  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js', { scope: './' });
      const activeSw = reg.active || reg.waiting || reg.installing;
      if (activeSw) {
        activeSw.postMessage({ type: 'CHECK_WEEKLY_SYNC' });
      }
      if ('periodicSync' in reg) {
        try {
          await reg.periodicSync.register('weekly-verse-sync', { minInterval: WEEK_MS });
        } catch {}
      }
    } catch {}
  });
}

function initNeonScene() {
  if (typeof document === 'undefined' || !document.querySelector('#neon')) return;

  // Ensure localStorage catalog is initialized immediately
  getCatalog(globalThis.localStorage);

  // Pick and render next verse on every load/refresh
  const { verse } = selectNextVerse(globalThis.localStorage, globalThis.location?.hash || '');
  renderVerseToDom(verse, document);

  // Allow clicking the reference or changing hash to cycle through verses
  const refEl = document.querySelector('.reference');
  if (refEl) {
    refEl.style.cursor = 'pointer';
    refEl.title = 'Click for next verse';
    refEl.addEventListener('click', () => {
      const next = selectNextVerse(globalThis.localStorage, '#shuffle');
      renderVerseToDom(next.verse, document);
    });
  }

  window.addEventListener('hashchange', () => {
    const next = selectNextVerse(globalThis.localStorage, globalThis.location?.hash || '');
    renderVerseToDom(next.verse, document);
  });

  // Perform weekly sync check (and initial seed if never synced)
  syncFromBackendIfDue(globalThis.localStorage, false);
  registerServiceWorker();
}

globalThis.NeonEngine = {
  glyphs,
  mountX,
  colors,
  WEEK_MS,
  STORAGE_KEYS,
  DEFAULT_VERSES,
  sanitizeText,
  wrapTextIntoLines,
  normalizeRows,
  getCatalog,
  saveCatalog,
  selectNextVerse,
  renderVerseToDom,
  syncFromBackendIfDue,
};

initNeonScene();
