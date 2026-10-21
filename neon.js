/* Rounded, single-stroke glyphs: the centerline of each real glass tube.
   No font, canvas bitmap, or photograph is used for the lettering. */
const glyphs = {
  A: { w: 55, d: 'M3 80 L25 5 Q28 -2 31 5 L53 80 M13 53 H43' },
  B: { w: 54, d: 'M5 79 V7 Q5 1 11 1 H28 C55 1 56 36 29 39 H7 M29 39 C60 39 61 79 29 79 H11' },
  C: { w: 55, d: 'M51 15 C42 -8 4 -5 4 34 V47 C4 83 40 90 51 67' },
  D: { w: 55, d: 'M5 78 V7 Q5 1 11 1 H24 C46 1 53 17 53 39 C53 63 46 79 24 79 H12' },
  E: { w: 47, d: 'M45 1 H12 Q5 1 5 8 V72 Q5 79 12 79 H45 M7 39 H40' },
  G: { w: 58, d: 'M52 15 C39 -8 5 -4 5 35 V46 C5 82 49 94 53 60 V44 H32' },
  H: { w: 54, d: 'M5 1 V79 M50 1 V79 M7 40 H48' },
  I: { w: 13, d: 'M7 1 V79' },
  L: { w: 45, d: 'M5 1 V72 Q5 79 12 79 H43' },
  M: { w: 68, d: 'M5 79 V6 Q5 -1 10 4 L31 48 Q34 55 37 48 L58 4 Q63 -1 63 6 V79' },
  N: { w: 58, d: 'M5 79 V7 Q5 -1 10 6 L49 75 Q54 84 54 75 V1' },
  O: { w: 59, d: 'M25 79 C8 78 4 64 4 40 C4 14 12 1 30 1 C49 1 55 16 55 40 C55 63 50 78 33 79' },
  R: { w: 53, d: 'M5 79 V8 Q5 1 12 1 H28 C55 1 56 39 28 40 H8 M29 42 L52 79' },
  S: { w: 53, d: 'M48 13 C39 -5 8 -3 6 18 C3 39 24 37 37 45 C62 60 45 83 25 79 C14 78 7 74 3 66' },
  T: { w: 55, d: 'M2 1 H53 M28 4 V79' },
  U: { w: 56, d: 'M5 1 V55 C5 88 51 88 51 55 V1' },
  V: { w: 54, d: 'M3 1 L24 75 Q27 83 30 75 L51 1' },
  W: { w: 78, d: 'M3 1 L16 73 Q19 84 23 73 L37 27 Q39 20 41 27 L55 73 Q59 84 62 73 L75 1' },
  Y: { w: 55, d: 'M3 1 L25 38 Q28 42 31 38 L52 1 M28 42 V79' },
  ',': { w: 15, d: 'M7 72 Q15 78 6 91' },
  '.': { w: 13, d: 'M6 77 L7 78' },
};
const rows = [
  { text: 'COME TO ME,', y: 39, width: 606, color: 'amber', delay: 0 },
  { text: 'ALL YOU WHO', y: 151, width: 557, color: 'blue', delay: .18 },
  { text: 'ARE WEARY', y: 250, width: 495, color: 'blue', delay: .32 },
  { text: 'AND BURDENED,', y: 345, width: 596, color: 'white', delay: .48 },
  { text: 'AND I WILL', y: 447, width: 555, color: 'rose', delay: .7 },
  { text: 'GIVE YOU REST.', y: 554, width: 580, color: 'rose', delay: .84 },
];
const colors = {
  amber: { dark: '#6a3815', rim: '#bd7b26', glass: '#ffcd64', gas: '#fff0b3', core: '#fffde1' },
  blue: { dark: '#163c54', rim: '#367692', glass: '#51c5ff', gas: '#b1eeff', core: '#effdff' },
  white: { dark: '#354446', rim: '#82918d', glass: '#c5e1e1', gas: '#f0fcf7', core: '#ffffff' },
  rose: { dark: '#673241', rim: '#bd657b', glass: '#ff759c', gas: '#ffc2d4', core: '#fff4f6' },
};
const NS = 'http://www.w3.org/2000/svg';
const svg = document.querySelector('#neon');
const defs = svg.querySelector('defs');
const make = (tag, attrs = {}, parent = svg) => {
  const node = document.createElementNS(NS, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  parent.appendChild(node); return node;
};
const use = (id, attrs, parent) => make('use', { href: `#${id}`, ...attrs }, parent);
const path = (d, attrs = {}, parent = svg) => make('path', { d, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...attrs }, parent);

// Glass has a dark lower edge and an upper reflection. Metallic clips have
// their own material; neither layer fades when the gas briefly dims.
for (const [name, c] of Object.entries(colors)) {
  const grad = make('linearGradient', { id: `glass-${name}`, x1: '0', y1: '0', x2: '0.45', y2: '1' }, defs);
  [[0,c.gas],[.18,c.rim],[.43,c.dark],[.72,c.glass],[1,c.dark]].forEach(([offset,color]) => make('stop', { offset, 'stop-color': color }, grad));
}

const cables = make('g', { class: 'cables', opacity: '.76', 'aria-hidden': 'true' });
const cableRoutes = [
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
for (const d of cableRoutes) {
  path(d, { stroke: '#000', 'stroke-width': 6, opacity: .7, transform:'translate(2 4)', filter:'url(#contact-shadow)' }, cables);
  path(d, { stroke: '#101417', 'stroke-width': 5.2 }, cables);
  path(d, { stroke: 'url(#wire)', 'stroke-width': 3.5 }, cables);
  path(d, { stroke: '#bdd0d5', 'stroke-width': .65, opacity: .3, transform: 'translate(-.8 -.8)' }, cables);
}

rows.forEach((row, index) => {
  const rawWidth = [...row.text].reduce((n, ch) => n + (ch === ' ' ? 25 : glyphs[ch].w + 13), -13);
  const scale = row.width / rawWidth;
  const left = (720 - row.width) / 2;
  const geometry = make('g', { id:`line-${index}`, fill:'none', 'stroke-linecap':'round', 'stroke-linejoin':'round' }, defs);
  const letters = [];
  let x = 0;
  for (const ch of row.text) {
    if (ch === ' ') { x += 25; continue; }
    path(glyphs[ch].d, { transform:`translate(${x} 0)` }, geometry);
    letters.push({ x, ch, width:glyphs[ch].w });
    x += glyphs[ch].w + 13;
  }
  const rowGroup = make('g', { class:'neon-row', transform:`translate(${left} ${row.y}) scale(${scale})`, style:`--delay:${row.delay}s;--phase:${-(index * 2.13)}s;--duration:${13 + index * 1.3}s`, 'data-verse-line':row.text });
  const c = colors[row.color];
  const id = `line-${index}`;

  // Short lead wires and ceramic electrode sleeves underneath individual tubes.
  const fittings = make('g', { class:'fittings' }, rowGroup);
  for (let j=0; j<letters.length-1; j++) {
    const a=letters[j], b=letters[j+1];
    if (a.ch === ',' || a.ch === '.' || j%3===1) continue;
    const p1=a.x+a.width*.53, p2=b.x+5;
    const d=`M${p1} 80 V87 C${p1} ${96+(j%3)*4} ${p2} ${97+(j%2)*5} ${p2} 86 V80`;
    path(d,{stroke:'#000','stroke-width':3.5,opacity:.85,transform:'translate(1 2)'},fittings);
    path(d,{stroke:'url(#wire)','stroke-width':2.1},fittings);
  }
  const mountX = { A:10, B:5, C:7, D:5, E:5, G:7, H:5, I:7, L:5, M:5, N:5, O:8, R:5, S:48, T:28, U:8, V:20, W:16, Y:28 };
  const footPositions = letters.filter((a,j) => j%2===0 && a.width>20).map(a => ({...a, mount:a.x + mountX[a.ch]}));
  for (const a of footPositions) {
    const foot=make('g',{transform:`translate(${a.mount} 63)`},fittings);
    make('ellipse',{cx:2,cy:6,rx:7,ry:5,fill:'#000',opacity:.65},foot);
    make('rect',{x:-3,y:-4,width:7,height:15,rx:3,fill:'url(#metal)',stroke:'#0a1114','stroke-width':1},foot);
    make('circle',{cx:.5,cy:7,r:1.2,fill:'#8c979a'},foot);
    path('M-.3 7 H1.3',{stroke:'#162126','stroke-width':.5},foot);
  }

  // Occlusion and slight extrusion give the glass a physical lift off the shirt.
  use(id,{stroke:'#000','stroke-width':12,opacity:.78,transform:'translate(2.5 5)',filter:'url(#contact-shadow)'},rowGroup);
  use(id,{stroke:c.dark,'stroke-width':10.2,transform:'translate(1.5 2.2)'},rowGroup);
  use(id,{stroke:`url(#glass-${row.color})`,'stroke-width':9.2},rowGroup);

  const emission=make('g',{class:'emission'},rowGroup);
  use(id,{stroke:c.glass,'stroke-width':23,opacity:.21,filter:'url(#spill)',class:'spill'},emission);
  use(id,{stroke:c.glass,'stroke-width':9,opacity:.4,filter:'url(#halo)'},emission);
  use(id,{stroke:c.gas,'stroke-width':8.15,opacity:.92},emission);
  use(id,{stroke:c.dark,'stroke-width':6.8,opacity:.94},emission);
  use(id,{stroke:c.glass,'stroke-width':5.3},emission);
  use(id,{stroke:c.gas,'stroke-width':3.25},emission);
  use(id,{stroke:c.core,'stroke-width':1.3,opacity:.98},emission);

  // A displaced specular line catches the upper left side of the glass.
  use(id,{stroke:'#ffffff','stroke-width':.62,opacity:.52,transform:'translate(-3.1 -1.1)'},rowGroup);
  for (const a of footPositions) {
    make('rect',{x:a.mount-5.3,y:58,width:10.6,height:3.5,rx:1.6,fill:'url(#clear-clip)',stroke:'#aac1c8','stroke-width':.35,opacity:.72},rowGroup);
  }
  // Insulated tube ends, visible in the tiny deliberate gaps of the O glyph.
  for (const a of letters.filter(a=>a.ch==='O')) {
    [25,33].forEach(dx=>make('rect',{x:a.x+dx-2.3,y:78.6,width:4.6,height:7,rx:1.4,fill:'url(#metal)',opacity:.8},rowGroup));
  }
});
