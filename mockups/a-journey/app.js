import {
  MODEL, COMPANY, ROLE_SLUG, PEOPLE, ROSTER, SYSTEMS, EXTRACTS, VOICE, LEVELS, BASE_FILL, PARTS, ROUTE,
  JUNCTIONS, STATIONS, NORTH_STAR_PARTS, NORTH_STAR_AFTER, NORTH_STAR, APPROACHES, MEANS, AMBITIONS,
  DRUDGERY_LINES, MORE_OF, PLAN, QUARTERS, CARD_TASKS, PILES,
  GAMES, EXCHANGE, GAME_OPS, VANITY, CHECKS, STATEMENT_CANDIDATES, INPUT_OPS, INIT_BETS,
} from './data.js';

/* ---------- state ---------- */

const KEY = 'aj-journey-v1';
const defaults = () => ({
  sort: {}, sortOrder: [], sortStarted: false, sortDone: false,
  extract: 'orgchart', extractAdded: true, voiceStep: VOICE.length,
  roster: ROSTER.map((r) => ({...r, people: [...r.people], fte: r.people.length})),
  systems: SYSTEMS.map((s) => ({...s})),
  offRoute: [], opRole: 'all', opApproach: 'all', opSort: 'priority', opAll: false, opOpen: 'op2',
  person: {'13-1071.00': 'sanne'},
  game: {pick: null, votes: false, ...EXCHANGE, done: false},
  stmt: {pick: null, text: '', name: NORTH_STAR.name, definition: NORTH_STAR.definition, inputs: Object.fromEntries(NORTH_STAR.inputs.map((i) => [i.id, i.text])), done: false},
});
let state = load();
function load() {
  try { return {...defaults(), ...JSON.parse(localStorage.getItem(KEY) || '{}')}; } catch { return defaults(); }
}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private mode */ } };

/* ---------- helpers ---------- */

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const nf = new Intl.NumberFormat('en-GB', {maximumFractionDigits: 0});
const n0 = (n) => nf.format(Math.round(n));
const about = (n, step = 50) => n0(Math.round(n / step) * step);
const eur = (n) => (n >= 1e6 ? `EUR ${(n / 1e6).toFixed(2)}M` : n >= 1000 ? `EUR ${Math.round(n / 1000)}k` : `EUR ${n0(n)}`);
const one = (n) => (Math.round(n * 10) / 10).toFixed(1);
const pct = (n) => `${Math.round(n)}%`;
const first = (name) => name.split(' ')[0];
const person = (id) => PEOPLE.find((p) => p.id === id);
const initials = (name) => name.split(' ').filter((w) => /^[A-Z]/.test(w)).map((w) => w[0]).slice(0, 2).join('');
const roleByCode = (code) => MODEL.roles.find((r) => r.code === code);
const codeBySlug = (slug) => Object.keys(ROLE_SLUG).find((c) => ROLE_SLUG[c] === slug);
const station = (id) => STATIONS.find((s) => s.id === id);
const approach = (id) => APPROACHES.find((a) => a.id === id);
const opById = (id) => MODEL.opportunities.find((o) => o.id === id);
const T = MODEL.team;

const ICONS = {
  check: '<path d="M5 10.5l3 3 7-7"/>',
  arrow: '<path d="M4 10h11M11 6l4 4-4 4"/>',
  chev: '<path d="M7 8l3 3 3-3"/>',
  upload: '<path d="M10 13V4M6.5 7.5L10 4l3.5 3.5M4 13v2.5h12V13"/>',
  mic: '<rect x="7.5" y="3" width="5" height="9" rx="2.5"/><path d="M5 10a5 5 0 0010 0M10 15v2.5"/>',
  pen: '<path d="M4 16l1-3.5L13 4.5l2.5 2.5-8 8L4 16z"/>',
  file: '<path d="M6 3h5.5L15 6.5V17H6z"/><path d="M11 3v4h4"/>',
  person: '<circle cx="10" cy="7" r="3"/><path d="M4.5 16.5c.8-3 3-4.5 5.5-4.5s4.7 1.5 5.5 4.5"/>',
  team: '<circle cx="7.5" cy="7.5" r="2.5"/><circle cx="13.5" cy="8.5" r="2"/><path d="M3 16c.6-2.6 2.3-4 4.5-4s3.9 1.4 4.5 4M12.5 12.3c2 0 3.6 1.1 4.2 3.2"/>',
  eye: '<path d="M2.5 10s2.8-5 7.5-5 7.5 5 7.5 5-2.8 5-7.5 5-7.5-5-7.5-5z"/><circle cx="10" cy="10" r="2.2"/>',
  x: '<path d="M6 6l8 8M14 6l-8 8"/>',
  plus: '<path d="M10 5v10M5 10h10"/>',
  print: '<path d="M6 8V3.5h8V8M6 14H4V8.5h12V14h-2"/><path d="M6 11.5h8V17H6z"/>',
  download: '<path d="M10 4v9M6.5 9.5L10 13l3.5-3.5M4 16h12"/>',
  share: '<circle cx="14.5" cy="5" r="2"/><circle cx="5.5" cy="10" r="2"/><circle cx="14.5" cy="15" r="2"/><path d="M7.3 9l5.4-3M7.3 11l5.4 3"/>',
  undo: '<path d="M7 5L4 8l3 3"/><path d="M4 8h7.5a4 4 0 010 8H9"/>',
  flag: '<path d="M5 17V3.5M5 4h9l-2 3.5 2 3.5H5"/>',
  clock: '<circle cx="10" cy="10" r="6.5"/><path d="M10 6.5V10l2.5 1.5"/>',
  route: '<circle cx="5" cy="15" r="2"/><circle cx="15" cy="5" r="2"/><path d="M6.5 13.5c2-2 1-5 3.5-6s3-1 3.5-1"/>',
  star: '<path d="M10 3.5l1.9 4 4.3.5-3.2 3 .9 4.3L10 13.2l-3.9 2.1.9-4.3-3.2-3 4.3-.5z"/>',
};
const icon = (name, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 20 20" aria-hidden="true">${ICONS[name]}</svg>`;

const GLYPHS = {
  rule: '<path d="M8 2.5L13.5 8 8 13.5 2.5 8z"/><path d="M6 8h4"/>',
  records: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M2.5 6.5h11M2.5 9.8h11M6.5 6.5V13"/>',
  artefact: '<path d="M4 2.5h5.5L12 5v8.5H4z"/><path d="M6 7.5h4M6 10h3"/><path d="M12.8 1.6v2.2M11.7 2.7h2.2"/>',
  workflow: '<circle cx="3.5" cy="8" r="1.6"/><circle cx="12.5" cy="4" r="1.6"/><circle cx="12.5" cy="12" r="1.6"/><path d="M5 7.3l6-2.7M5 8.7l6 2.7"/>',
  ml: '<path d="M2.5 13.5l11-9"/><circle cx="4" cy="9" r=".9"/><circle cx="7" cy="5.5" r=".9"/><circle cx="9.5" cy="11.5" r=".9"/><circle cx="12" cy="8.5" r=".9"/>',
  dashboard: '<path d="M3 13.5h10"/><path d="M4.5 11.5v-3M8 11.5v-7M11.5 11.5v-5"/>',
  remove: '<circle cx="8" cy="8" r="5.5"/><path d="M4.2 11.8l7.6-7.6"/>',
  amplify: '<circle cx="6.5" cy="5" r="2"/><path d="M2.5 13c.5-2.3 2-3.5 4-3.5s3.5 1.2 4 3.5"/><path d="M12.5 9V3.5M10.5 5.5l2-2 2 2"/>',
  human: '<circle cx="8" cy="5" r="2.2"/><path d="M3.5 13.5c.6-2.6 2.3-4 4.5-4s3.9 1.4 4.5 4"/>',
};
const glyph = (id) => `<svg class="gl" viewBox="0 0 16 16" aria-hidden="true">${GLYPHS[id]}</svg>`;
const chip = (id, label = true) => `<span class="ap ap-${id}" ${label ? '' : `title="${esc(approach(id).name)}"`}>${glyph(id)}${label ? `<span>${esc(approach(id).name)}</span>` : `<span class="vh">${esc(approach(id).name)}</span>`}</span>`;

const MEANS_LABEL = {system_screen: 'System screen', document: 'Document', email_chat: 'Mail or chat', meeting_call: 'Meeting or call', spreadsheet: 'Spreadsheet', paper_phone: 'Paper or phone', in_person: 'In person'};

function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove('show'), 3200);
}

/* ---------- progress model: stations fill parts of the destination ---------- */

const groupOf = (id) => STATIONS.filter((s) => s.group === id);
// Modules the demo can complete; `ov` overrides them to compare before and after.
const FLAGS = {'card-sorting': () => state.sortDone, 'ns-game': () => state.game.done, 'ns-statement': () => state.stmt.done};
const flag = (id, ov) => ((ov && id in ov ? ov[id] : FLAGS[id]?.()) ? 1 : 0);
function stationFrac(id, ov) {
  const s = station(id);
  if (!s) return 0;
  if (s.bundle) { const g = groupOf(id); return g.reduce((a, m) => a + stationFrac(m.id, ov), 0) / g.length; }
  return Math.min(1, (s.done + flag(id, ov)) / s.total);
}
function stationDone(id, ov) {
  const s = station(id);
  if (s.bundle) return groupOf(id).filter((m) => stationFrac(m.id, ov) >= 1).length;
  return s.done + flag(id, ov);
}
const statusOf = (s) => (FLAGS[s.id] && s.id !== 'card-sorting' && flag(s.id) ? 'Done' : s.status);
const stationTotal = (id) => (station(id).bundle ? groupOf(id).length : station(id).total);
// How much of a part one station fills: its own weight, or its share of its bundle's weight.
function weightFor(part, s) {
  if (part.weights[s.id] !== undefined) return part.weights[s.id];
  return s.group ? (part.weights[s.group] || 0) / groupOf(s.group).length : 0;
}
function partFill(part, ov) {
  let sum = 0;
  for (const [id, w] of Object.entries(part.weights)) if (!state.offRoute.includes(id)) sum += w * stationFrac(id, ov);
  return BASE_FILL + (100 - BASE_FILL) * sum;
}
const level = (fill) => [...LEVELS].reverse().find((l) => fill >= l.min);
const overall = (ov) => PARTS.reduce((a, p) => a + partFill(p, ov), 0) / PARTS.length;

function routeItems() {
  return ROUTE.filter((id) => !state.offRoute.includes(id)).map((id, i) => {
    const n = i + 1;
    if (JUNCTIONS[id]) return {id, n, ...JUNCTIONS[id], kind: 'junction'};
    const s = station(id);
    const frac = stationFrac(id);
    const st = id === 'card-sorting' ? 'here' : frac >= 1 || s.closed ? 'done' : frac > 0 ? 'progress' : 'next';
    const href = s.open || `#/stations/${id}`;
    const note = s.bundle ? `${stationDone(id)} of ${stationTotal(id)} modules · workshop 12 Nov` : `${stationDone(id)} of ${s.total} ${s.unit}`;
    const boardNote = s.bundle ? `${stationDone(id)} of ${stationTotal(id)} modules` : note;
    return {id, n, name: s.name, short: s.bundle ? 'North Star' : s.name, href, state: st, note, boardNote, kind: s.kind};
  });
}
const hereItem = () => routeItems().find((r) => r.state === 'here');

function fillBar(fill, {label = true, small = false} = {}) {
  const l = level(fill);
  return `<span class="fill ${small ? 'fill-s' : ''} tone-${l.tone}">
    <span class="fill-track" role="img" aria-label="${Math.round(fill)}% filled, ${l.word}"><span class="fill-bar" style="width:${fill.toFixed(1)}%"></span></span>
    ${label ? `<span class="fill-text"><strong>${Math.round(fill)}%</strong> ${l.word}</span>` : ''}
  </span>`;
}
const jt = (n, st, extra = '') => `<span class="jt jt-${st} ${extra}" aria-hidden="true">${n}</span>`;

/* ---------- rail and mobile strip ---------- */

function railHTML() {
  const items = routeItems();
  const here = hereItem();
  const views = [
    {name: 'Team twin', href: '#/team', part: 'twin'},
    {name: 'Role twins', href: '#/role/hr-specialist', part: 'roles'},
    {name: 'Opportunities', href: '#/opportunities', part: 'opportunities'},
    {name: 'Plan', href: '#/plan', part: 'plan'},
  ];
  const stateWord = {done: 'done', here: 'you are here', progress: 'in progress', next: 'not started'};
  return `
    <div class="rail-in">
      <h2 class="rail-h">Your route <span>${here ? `station ${here.n} of ${items.length}` : ''}</span></h2>
      <a class="rail-lib" href="#/stations">${icon('route')}All stations<span>add or remove</span></a>
      <ol class="rail-route">
        ${items.map((it) => `
          <li class="rr rr-${it.state}" data-j="${it.id}">
            <a href="${it.href}" class="rr-a">
              ${jt(it.n, it.state)}
              <span class="rr-text"><span class="rr-name">${esc(it.name)}</span><span class="rr-note">${it.state === 'here' ? '<strong>You are here</strong> · ' : ''}${esc(it.note)}</span></span>
              <span class="vh">, ${stateWord[it.state] || ''}</span>
            </a>
          </li>`).join('')}
      </ol>
      <h2 class="rail-h">Look ahead</h2>
      <ul class="rail-views">
        ${views.map((v) => {
          const f = partFill(PARTS.find((p) => p.id === v.part));
          return `<li><a href="${v.href}" class="rv-a">${icon(v.part === 'plan' ? 'flag' : 'eye')}<span class="rv-name">${v.name}</span>${fillBar(f, {label: false, small: true})}<span class="rv-pct">${Math.round(f)}%</span></a></li>`;
        }).join('')}
      </ul>
    </div>`;
}

function stripHTML() {
  const items = routeItems();
  const here = hereItem();
  return `
    <button class="strip-btn" type="button" data-action="open-sheet" aria-haspopup="dialog">
      ${here ? jt(here.n, 'here') : ''}
      <span class="strip-text"><strong>${here ? esc(here.name) : 'Your route'}</strong><span>Station ${here ? here.n : 1} of ${items.length}</span></span>
      <span class="strip-more">Route ${icon('chev')}</span>
    </button>
    <ol class="strip-tiles" aria-hidden="true">${items.map((it) => `<li>${jt(it.n, it.state)}</li>`).join('')}</ol>`;
}

function renderChrome() {
  $('#rail').innerHTML = railHTML();
  $('#strip').innerHTML = stripHTML();
  const hash = location.hash || '#/goal';
  for (const a of document.querySelectorAll('.rail a, .sheet a')) {
    const href = a.getAttribute('href');
    const match = href === hash || (href === '#/team' && hash.startsWith('#/team/')) || (href.startsWith('#/role') && hash.startsWith('#/role')) || (href === '#/opportunities' && hash.startsWith('#/opportunities')) || (href === '#/stations' && hash.startsWith('#/stations/'));
    if (match) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  }
}

/* ---------- shared blocks ---------- */

function pageHead({tile, title, lede, aside = ''}) {
  return `<header class="ph">
    <div class="ph-main">
      <div class="ph-title">${tile || ''}<h1 tabindex="-1">${title}</h1></div>
      ${lede ? `<p class="lede">${lede}</p>` : ''}
    </div>
    ${aside ? `<div class="ph-aside">${aside}</div>` : ''}
  </header>`;
}

const gross = '<span class="tag tag-gross">gross estimate</span>';
const nextStep = (lead, href, label) => `<nav class="next-step" aria-label="Next step"><span>${lead}</span><a class="btn btn-primary" href="${href}">${label} ${icon('arrow')}</a></nav>`;
const illustrative = '<span class="tag tag-illus">illustrative</span>';

function northStarBlock({compact = false} = {}) {
  const st = state.stmt.done ? state.stmt : null;
  const game = state.game.done ? GAMES.find((g) => g.id === state.game.pick) : null;
  const when = st ? 'Draft from your Statement exercise. Agreed in the Converge module; not measured yet.'
    : 'Your own metric is set at the North Star workshop, 12 Nov. Not measured yet.';
  return `<section class="ns ${compact ? 'ns-compact' : ''}" aria-labelledby="ns-h">
    <div class="ns-head">
      <span class="ns-mark">${icon('star')}</span>
      <div>
        <h2 id="ns-h">North Star: ${esc(st ? st.name : NORTH_STAR.name)} ${illustrative}</h2>
        <p>${esc(st ? st.definition : NORTH_STAR.definition)}</p>
        ${st && st.text ? `<p class="ns-stmt">Your statement: “${esc(st.text)}”</p>` : ''}
        ${game ? `<p class="ns-game">${icon('check')}Game agreed: ${esc(game.name.toLowerCase())}. Success can mean ${esc(state.game.means)}.</p>` : ''}
      </div>
      <p class="ns-when">${when}${st || game ? '' : ` <a href="#/station/ns-game">Run the game exercise</a>`}</p>
    </div>
    <ul class="ns-inputs">
      ${NORTH_STAR.inputs.map((i) => `<li><strong>${i.name}</strong><span>${esc(st ? st.inputs[i.id] : i.text)}</span>${st ? `<em>${PLAN.filter((x) => INIT_BETS[x.id] === i.id).length} initiatives bet on it</em>` : ''}</li>`).join('')}
    </ul>
  </section>`;
}

/* ---------- screen: the destination (home) ---------- */

function renderGoal() {
  const items = routeItems();
  const here = hereItem();
  const cs = station('card-sorting');
  const left = cs.total - stationDone('card-sorting');
  const fills = Object.fromEntries(PARTS.map((p) => [p.id, partFill(p)]));
  const fillers = (part) => items.filter((it) => part.weights[it.id]).map((it) => jt(it.n, it.state, 'jt-s')).join('');
  const partHead = (p) => `
    <div class="part-head">
      <h3><a href="${p.route}">${esc(p.name)}</a></h3>
      ${fillBar(fills[p.id])}
    </div>`;
  const partFoot = (p) => `
    <div class="part-foot"><span class="part-by">Filled by ${fillers(p)}</span></div>`;
  const cls = (p) => `part part-${p.id} ${level(fills[p.id]).tone === 'estimate' ? 'is-estimate' : ''}`;

  const twin = PARTS[1], roles = PARTS[0], ops = PARTS[2], appr = PARTS[3], plan = PARTS[4];
  const totalSteps = Object.values(MODEL.approach_mix).reduce((a, b) => a + b, 0);
  const qCount = Object.fromEntries(QUARTERS.map((q) => [q.id, PLAN.filter((i) => i.quarter === q.id).length]));

  return `
  ${pageHead({
    title: 'Where your route ends',
    lede: `At the end of the route your HR team has five things. Generic task data gives each one a head start; every station you pass makes it sharper. You are at station ${here.n} of ${items.length}.`,
    aside: `<a class="btn btn-primary" href="#/station/card-sorting">Continue: card sorting ${icon('arrow')}</a><span class="ph-hint">${left} of ${cs.total} people still to sort</span>`,
  })}

  <section class="board" aria-labelledby="board-h">
    <div class="board-head">
      <h2 id="board-h">The route</h2>
      <p class="board-sum">Destination <strong>${Math.round(overall())}%</strong> filled · <a href="#/stations">See all stations</a></p>
      <ul class="key" aria-label="Key">
        <li>${jt('', 'done', 'jt-key')}Done</li><li>${jt('', 'here', 'jt-key')}You are here</li><li>${jt('', 'progress', 'jt-key')}Under way</li><li>${jt('', 'next', 'jt-key')}Ahead</li>
      </ul>
    </div>
    <ol class="line" style="--n:${items.length}">
      ${items.map((it) => `
        <li class="ln ln-${it.state}" data-j="${it.id}">
          <a href="${it.href}">
            ${jt(it.n, it.state)}
            <span class="ln-name">${esc(it.short)}</span>
            <span class="ln-note">${it.state === 'here' ? 'You are here' : esc(it.boardNote || it.note)}</span>
          </a>
        </li>`).join('')}
    </ol>
    <p class="board-tip">Point at a part of the destination to see which stations fill it.</p>
  </section>

  <section class="dest" aria-labelledby="dest-h">
    <h2 id="dest-h" class="sec-h">What you will have</h2>
    <div class="dest-grid">
      <article class="${cls(twin)}" data-part="twin">
        ${partHead(twin)}
        <p class="part-promise">${esc(twin.promise)}</p>
        <p class="twin-line">About <strong>${one(T.fte_returned)} FTE</strong> of the team's time comes back each year: ${about(T.returned)} hours, ${eur(T.value)}. ${gross}</p>
        ${fteBlocks(10, 10 - T.fte_returned)}
        <dl class="part-facts"><div><dt>Ceiling</dt><dd>up to ${T.speedup.toFixed(1)}×</dd></div><div><dt>Work only people do</dt><dd>${pct(T.human_only_share * 100)}</dd></div><div><dt>Three-year value</dt><dd>${eur(T.three_year_value)}</dd></div></dl>
        ${partFoot(twin)}
      </article>

      <article class="${cls(roles)}" data-part="roles">
        ${partHead(roles)}
        <p class="part-promise">${esc(roles.promise)}</p>
        <ul class="mini-roles">
          ${MODEL.roles.map((r) => `<li><a href="#/role/${ROLE_SLUG[r.code]}"><span class="mr-title">${esc(r.title)}</span><span class="mr-people">${r.fte} ${r.fte === 1 ? 'person' : 'people'}</span><span class="mr-bar" aria-hidden="true"><span style="width:${(100 * r.after / r.before).toFixed(1)}%"></span></span><span class="mr-back">${n0(r.returned / r.fte)} h back</span></a></li>`).join('')}
        </ul>
        ${partFoot(roles)}
      </article>

      <article class="${cls(ops)}" data-part="opportunities">
        ${partHead(ops)}
        <p class="part-promise">${esc(ops.promise)}</p>
        <ol class="mini-ops">
          ${MODEL.opportunities.slice(0, 3).map((o) => `<li><a href="#/opportunities/${o.id}"><span class="mo-task">${esc(o.task)}</span><span class="mo-meta">${esc(o.role)} · ${n0(o.hours)} h · ${eur(o.value)}</span></a></li>`).join('')}
        </ol>
        <p class="part-note">${MODEL.counts.tasks} tasks, ${MODEL.counts.steps} steps in total. Hours and money: gross estimates.</p>
        ${partFoot(ops)}
      </article>

      <article class="${cls(appr)}" data-part="approach">
        ${partHead(appr)}
        <p class="part-promise">Nine approaches, from a fixed rule to keeping it human.</p>
        <div class="mixbar mixbar-l" role="img" aria-label="Approach mix over ${totalSteps} steps">
          ${APPROACHES.map((a) => MODEL.approach_mix[a.id] ? `<span class="seg seg-${a.id}" style="flex:${MODEL.approach_mix[a.id]}"></span>` : '').join('')}
        </div>
        <ul class="mix-legend">
          ${[...APPROACHES].sort((a, b) => (MODEL.approach_mix[b.id] || 0) - (MODEL.approach_mix[a.id] || 0)).slice(0, 5).map((a) => `<li>${chip(a.id)}<span>${MODEL.approach_mix[a.id]}</span></li>`).join('')}
        </ul>
        ${partFoot(appr)}
      </article>

      <article class="${cls(plan)}" data-part="plan">
        ${partHead(plan)}
        <p class="part-promise">${esc(plan.promise)}</p>
        <ol class="mini-q">
          ${QUARTERS.map((q) => `<li><span class="mq-label">${q.label}</span><span class="mq-count">${qCount[q.id]}</span><span class="mq-names">${PLAN.filter((i) => i.quarter === q.id).slice(0, 2).map((i) => esc(i.name)).join(' · ')}${qCount[q.id] > 2 ? ` · +${qCount[q.id] - 2}` : ''}</span></li>`).join('')}
        </ol>
        <p class="part-note">Draft: owners proposed, not agreed yet.</p>
        ${partFoot(plan)}
      </article>
    </div>
  </section>

  ${northStarBlock()}

  <section class="next" aria-labelledby="next-h">
    <h2 id="next-h" class="sec-h">Next on the route</h2>
    <ol class="next-list">
      ${items.slice(Math.max(0, items.findIndex((it) => it.state === 'here'))).filter((it) => station(it.id)).slice(0, 3).map((it) => {
        const s = station(it.id);
        if (!s) return '';
        const gains = s.adds.map((pid) => PARTS.find((p) => p.id === pid).short).join(', ');
        return `<li>${jt(it.n, it.state)}<div><a href="${it.href}"><strong>${esc(s.name)}</strong></a><span>${esc(s.time)} · ${esc(it.note)}</span><span class="next-adds">Sharpens: ${esc(gains)}</span></div></li>`;
      }).join('')}
    </ol>
  </section>`;
}

function fteBlocks(total, stays) {
  const blocks = [];
  for (let i = 0; i < total; i++) {
    const keep = Math.max(0, Math.min(1, stays - i));
    blocks.push(`<span class="fb"><span class="fb-keep" style="height:${(keep * 100).toFixed(0)}%"></span></span>`);
  }
  return `<div class="fte" role="img" aria-label="${one(stays)} of ${total} FTE stays with people, ${one(total - stays)} FTE comes back">
    <div class="fte-blocks">${blocks.join('')}</div>
    <div class="fte-key"><span><i class="k-keep"></i>${one(stays)} FTE stays with people</span><span><i class="k-back"></i>${one(total - stays)} FTE comes back</span></div>
  </div>`;
}

/* ---------- screen 1: set up the team ---------- */

function rosterTotals() {
  const people = state.roster.reduce((a, r) => a + r.people.length, 0);
  const fte = state.roster.reduce((a, r) => a + Number(r.fte || 0), 0);
  return {people, fte, roles: state.roster.length};
}

function renderSetup() {
  const ex = EXTRACTS[state.extract];
  const checks = ex.rows.filter((r) => r.conf < 0.8).length;
  const t = rosterTotals();
  const voiceLines = VOICE.slice(0, state.voiceStep);
  const playing = state.voicePlaying;
  const sourceLabel = {upload: 'Org chart', voice: 'Voice', hand: 'By hand'};
  const sourceIcon = {upload: 'upload', voice: 'mic', hand: 'pen'};

  return `
  ${pageHead({tile: jt(1, 'done', 'jt-l'), title: 'Who is in your team?', lede: 'Use whatever you already have. You can mix the three ways; everything lands in one roster that you can edit below.'})}

  <div class="ways">
    <section class="way way-upload" aria-labelledby="w1">
      <div class="way-head">${icon('upload')}<h2 id="w1">Upload what you have</h2></div>
      <p class="way-sub">An org chart screenshot, job descriptions or a meeting transcript. We read it and show what we found.</p>
      <label class="drop">
        <input type="file" class="vh" data-action="file" accept=".png,.jpg,.pdf,.docx,.txt">
        <span class="drop-in">${icon('file')}<span><strong>Drop a file</strong> or choose one</span><span class="drop-fmt">PNG, JPG, PDF, DOCX or TXT</span></span>
      </label>
      <div class="samples" role="group" aria-label="Try a sample">
        <span>Try a sample:</span>
        ${Object.entries(EXTRACTS).map(([k, v]) => `<button type="button" class="pill" data-action="extract" data-k="${k}" aria-pressed="${state.extract === k}">${esc(v.kind)}</button>`).join('')}
      </div>
      <div class="extract">
        <div class="ex-file">${icon('file')}<div><strong>${esc(ex.file)}</strong><span>${esc(ex.summary)}</span></div></div>
        <ul class="ex-rows">
          ${ex.rows.map((r) => `
            <li class="${r.conf < 0.8 ? 'is-check' : ''}">
              <span class="ex-who">${esc(r.name)}<span class="ex-src">${esc(r.source)}</span></span>
              <span class="ex-role">${esc(r.role)}</span>
              <span class="conf" title="Confidence ${Math.round(r.conf * 100)}%"><span class="conf-track"><span style="width:${r.conf * 100}%"></span></span><span class="conf-n">${Math.round(r.conf * 100)}%</span></span>
              ${r.conf < 0.8 ? '<span class="check-mark">Check this</span>' : ''}
            </li>`).join('')}
        </ul>
        <div class="ex-foot"><span>${checks} to check</span><button type="button" class="btn btn-secondary btn-s" data-action="extract-add">${state.extractAdded ? `${icon('check')}In your roster` : 'Add to roster'}</button></div>
      </div>
    </section>

    <section class="way way-voice" aria-labelledby="w2">
      <div class="way-head">${icon('mic')}<h2 id="w2">Tell me about your team</h2></div>
      <p class="way-sub">Talk for two minutes. The roster fills in while you speak.</p>
      <div class="voice-ctl">
        <button type="button" class="mic ${playing ? 'is-on' : ''}" data-action="voice" aria-pressed="${!!playing}">${icon('mic')}<span class="vh">${playing ? 'Stop' : 'Start talking'}</span></button>
        <div class="voice-status">
          <strong>${playing ? 'Listening' : state.voiceStep >= VOICE.length ? 'Conversation from 2 Oct' : 'Ready when you are'}</strong>
          <span>${playing ? `<span class="wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span> ${state.voiceStep} of ${VOICE.length} lines` : state.voiceStep >= VOICE.length ? 'Press the microphone to talk again' : 'Press the microphone and start'}</span>
        </div>
      </div>
      <ol class="transcript" aria-live="polite">
        ${voiceLines.length ? voiceLines.map((l) => `
          <li class="tl tl-${l.who}">
            <span class="tl-who">${l.who === 'agent' ? 'Agent' : 'Ingrid'}</span>
            <p>${esc(l.text)}</p>
            ${l.adds ? `<span class="heard ${l.check ? 'is-check' : ''}">${icon(l.check ? 'flag' : 'check')}Added: ${esc(l.adds)}${l.check ? ' · check' : ''}</span>` : ''}
          </li>`).join('') : '<li class="tl-empty">The transcript appears here as you talk.</li>'}
      </ol>
    </section>

    <section class="way way-hand" aria-labelledby="w3">
      <div class="way-head">${icon('pen')}<h2 id="w3">Add by hand</h2></div>
      <p class="way-sub">For the last few details, or if you prefer forms.</p>
      <form class="hand" data-action="hand">
        <label>Role<select name="code">${MODEL.roles.map((r) => `<option value="${r.code}">${esc(r.title)}</option>`).join('')}<option disabled>Search all 98 roles…</option></select></label>
        <label>Name<input name="name" autocomplete="off" placeholder="For example: Lotte Meijer"></label>
        <label class="hand-fte">FTE<input name="fte" type="number" min="0.1" max="1" step="0.1" value="1"></label>
        <button class="btn btn-secondary" type="submit">${icon('plus')}Add to roster</button>
      </form>
      <p class="hand-note">Each role brings its O*NET tasks and steps, so you never start from an empty page.</p>
    </section>
  </div>

  <section class="roster" aria-labelledby="roster-h">
    <div class="roster-head">
      <h2 id="roster-h" class="sec-h">Your roster</h2>
      <p class="roster-sum"><strong>${t.people}</strong> people · <strong>${one(t.fte)}</strong> FTE · <strong>${t.roles}</strong> roles</p>
    </div>
    <div class="table-wrap">
    <table class="rt">
      <thead><tr><th scope="col">Role</th><th scope="col">People</th><th scope="col" class="num">FTE</th><th scope="col" class="num">Cost per hour</th><th scope="col">Systems</th><th scope="col">From</th></tr></thead>
      <tbody>
        ${state.roster.map((r, i) => {
          const role = roleByCode(r.code);
          return `<tr class="${r.check ? 'is-check' : ''}">
            <th scope="row" data-label="Role"><a href="#/role/${ROLE_SLUG[r.code]}">${esc(role.title)}</a><span class="rt-code" title="O*NET-SOC ${r.code}">Based on ${role.tasks} standard tasks</span>${r.check ? `<span class="check-mark">${icon('flag')}${esc(r.check)}</span>` : ''}</th>
            <td data-label="People"><ul class="people">${r.people.map((pid) => {
              const p = person(pid) || {name: pid};
              return `<li><span class="pchip"><span class="av av-s" aria-hidden="true">${initials(p.name)}</span>${esc(p.name)}<button type="button" class="pchip-x" data-action="rm-person" data-row="${i}" data-p="${esc(pid)}" aria-label="Remove ${esc(p.name)}">${icon('x')}</button></span></li>`;
            }).join('')}</ul></td>
            <td data-label="FTE" class="num"><input class="num-in" type="number" step="0.1" min="0" value="${r.fte}" data-action="fte" data-row="${i}" aria-label="FTE for ${esc(role.title)}"></td>
            <td data-label="Cost per hour" class="num"><span class="eur-in">EUR <input class="num-in" type="number" step="1" min="0" value="${r.cost}" data-action="cost" data-row="${i}" aria-label="Cost per hour for ${esc(role.title)}"></span></td>
            <td data-label="Systems"><span class="sys">${r.systems.map((s) => `<span class="sys-chip">${esc(s)}</span>`).join('')}</span></td>
            <td data-label="From"><span class="src">${icon(sourceIcon[r.source])}${sourceLabel[r.source]}</span></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
    </div>
    <div class="systems">
      <h3>Systems your team works in</h3>
      <ul class="sys-slots">
        ${state.systems.map((s, i) => `<li class="${s.product ? '' : 'is-gap'}"><label><span>${esc(s.slot)}</span><input value="${esc(s.product || '')}" placeholder="Not named yet" data-action="sys" data-i="${i}"></label></li>`).join('')}
      </ul>
      <p class="sys-note">Unnamed systems stay visible as gaps in every design text, so nobody mistakes a guess for a fact.</p>
    </div>
    <div class="roster-foot">
      <p>Saved as you go. You can come back and change the team at any time.</p>
      <a class="btn btn-primary" href="#/goal">Save and see the destination ${icon('arrow')}</a>
    </div>
  </section>`;
}

/* ---------- screen 3: team twin ---------- */

function weekGroups(role) {
  return MEANS.map((m) => {
    const before = m.keys.reduce((a, k) => a + (role.by_means[k]?.before || 0), 0) / role.fte / 40;
    const after = m.keys.reduce((a, k) => a + (role.by_means[k]?.after || 0), 0) / role.fte / 40;
    return {...m, before, after};
  });
}

const TEAM_DRILLS = [
  {id: 'roadmap', name: 'Roadmap by quarter'},
  {id: 'human', name: 'What stays human'},
  {id: 'case', name: 'The business case'},
];

function renderTeam(sub) {
  const fill = partFill(PARTS[1]);
  const stays = 10 - T.fte_returned;
  const fateAfterTotal = T.by_fate.person_does.after + T.by_fate.person_reviews.after;
  const humanShare = T.by_fate.person_does.after / fateAfterTotal * 100;
  const ambFte = AMBITIONS.reduce((a, x) => a + x.fte, 0);
  const tile = `<span class="vp-badge">${icon('eye')}</span>`;
  const isnot = `<aside class="isnot">
    <h2>What this is, and what it is not</h2>
    <p>Generic estimates from O*NET-based task graphs for these six roles, sharpened by each station you pass. All money and hours are gross: before build, licence and upkeep costs. It is not a headcount plan; the time is for the work above. Every number is to be confirmed with the team.</p>
  </aside>`;
  const drillHead = (title, lede) => `<p class="crumb"><a href="#/team">${icon('undo')}Team twin</a></p>${pageHead({tile, title, lede, aside: fillBar(fill)})}`;
  const drillNav = (cur) => `<nav class="drill-nav" aria-label="More of the team twin"><span>More of the team twin</span>${TEAM_DRILLS.filter((d) => d.id !== cur).map((d) => `<a href="#/team/${d.id}">${d.name} ${icon('arrow')}</a>`).join('')}<a href="#/team">The summary ${icon('arrow')}</a></nav>`;

  if (sub === 'roadmap') {
    return `${drillHead('Roadmap by quarter', `Draft. The ${PLAN.length} initiatives from the plan, by quarter. Agreed with the team at the end of the route.`)}
    <section class="road" aria-label="Initiatives by quarter">
      <ol class="road-q">
        ${QUARTERS.map((q) => `<li><h3>${q.label}</h3><p class="rq-note">${esc(q.note)}</p><ul>${PLAN.filter((i) => i.quarter === q.id).map((i) => `<li><a href="#/plan">${esc(i.name)}</a></li>`).join('')}</ul></li>`).join('')}
      </ol>
    </section>
    ${drillNav('roadmap')}`;
  }

  if (sub === 'human') {
    return `${drillHead('What stays human', `${pct(humanShare)} of the time left after the change is work a person does from start to finish. The rest is a person checking what software prepared.`)}
    <section class="human" aria-label="Who does the work, today and after">
      <div class="fate">
        ${fateBar('Today', [
          ['Software can do it', T.by_fate.machine.before, 'machine'],
          ['A person checks it', T.by_fate.person_reviews.before, 'reviews'],
          ['A person does it', T.by_fate.person_does.before, 'does'],
          ['Not needed', T.by_fate.gone.before, 'gone'],
        ], T.before)}
        ${fateBar('After', [
          ['A person checks it', T.by_fate.person_reviews.after, 'reviews'],
          ['A person does it', T.by_fate.person_does.after, 'does'],
        ], T.before)}
        ${fateKey()}
      </div>
      <ul class="edge">
        ${MODEL.roles.map((r) => `<li><span class="edge-role">${esc(r.title)}</span><p>${esc(r.human_edge[0])}</p></li>`).join('')}
      </ul>
    </section>
    ${drillNav('human')}`;
  }

  if (sub === 'case') {
    return `${drillHead('The business case', `Adoption grows over three years: 50, 80 and 100 percent. That is adoption by people, not what the software can do. ${gross}`)}
    <section class="case" aria-label="Value by year">
      <div class="years">
        ${T.business_case.map((y) => `<div class="yr"><span class="yr-bar" style="height:${(y.value / T.value * 100).toFixed(0)}%"><span class="yr-v">${eur(y.value)}</span></span><span class="yr-l">Year ${y.year}<small>${y.adoption}% adoption · ${one(y.fte)} FTE</small></span></div>`).join('')}
        <div class="yr-total"><span>Three years</span><strong>${eur(T.three_year_value)}</strong><small>capacity, not cash</small></div>
      </div>
    </section>
    ${isnot}
    ${drillNav('case')}`;
  }

  return `
  ${pageHead({
    tile,
    title: 'Your team twin',
    lede: 'How the HR team’s work changes when software takes the routine and AI helps people with the rest. Built from generic O*NET task graphs, checked against your roles, with 9 survey answers and 3 card sorts so far.',
    aside: `${fillBar(fill)}<span class="ph-hint">Sharper after: card sorting, North Star workshop</span>`,
  })}

  <section class="cap" aria-labelledby="cap-h">
    <div class="cap-text">
      <h2 id="cap-h" class="cap-line">About <strong>${one(T.fte_returned)} FTE</strong> of the team’s time comes back each year.</h2>
      <p>That is about ${about(T.returned)} hours, worth about ${eur(T.value)} a year at your hourly costs. ${gross} Before build, licence and upkeep costs.</p>
      <dl class="cap-facts">
        <div><dt>Ceiling at full adoption</dt><dd>up to ${T.speedup.toFixed(1)}× faster</dd></div>
        <div><dt>If every routine step went</dt><dd>${T.ceiling.toFixed(1)}×</dd></div>
        <div><dt>Work only people do</dt><dd>${pct(T.human_only_share * 100)} of the time</dd></div>
      </dl>
    </div>
    ${fteBlocks(10, stays)}
  </section>

  <section class="take" aria-labelledby="take-h">
    <div class="sec-head">
      <h2 id="take-h" class="sec-h">What the team could take on with it</h2>
      <p>A suggested split of the time, from your roles’ own tasks. The team decides at the North Star workshop.</p>
    </div>
    <ol class="amb">
      ${AMBITIONS.map((a) => `<li><span class="amb-fte"><strong>${one(a.fte)}</strong> FTE</span><p>${esc(a.text)}</p><span class="amb-roles">${a.roles.map((c) => esc(roleByCode(c).title)).join(', ')}</span></li>`).join('')}
      <li class="amb-slack"><span class="amb-fte"><strong>${one(T.fte_returned - ambFte)}</strong> FTE</span><p>Kept free for the new work this creates: checking AI drafts, keeping rules and mappings current, handling exceptions.</p><span class="amb-roles">Everyone</span></li>
    </ol>
  </section>

  ${northStarBlock({compact: true})}

  <section class="shift" aria-labelledby="shift-h">
    <div class="sec-head">
      <h2 id="shift-h" class="sec-h">How each role shifts</h2>
      <p>A week per person, before and after. Dark is what stays with the person; light is what comes back.</p>
    </div>
    <div class="table-wrap">
    <table class="st">
      <thead><tr><th scope="col">Role</th><th scope="col">People</th><th scope="col">A 40-hour week, before → after</th><th scope="col" class="num">Back per year</th><th scope="col" class="num">Ceiling</th></tr></thead>
      <tbody>
        ${MODEL.roles.map((r) => {
          const after = r.after / r.fte / 40;
          return `<tr>
            <th scope="row" data-label="Role"><a href="#/role/${ROLE_SLUG[r.code]}">${esc(r.title)}</a></th>
            <td data-label="People"><span class="avs">${PEOPLE.filter((p) => p.code === r.code).map((p) => `<span class="av av-s" title="${esc(p.name)}">${initials(p.name)}</span>`).join('')}</span></td>
            <td data-label="Week"><span class="wk" role="img" aria-label="${one(after)} of 40 hours stay with the person"><span class="wk-keep" style="width:${(after / 40 * 100).toFixed(1)}%"></span></span><span class="wk-n">40 h → ${one(after)} h</span></td>
            <td data-label="Back per year" class="num">${n0(r.returned)} h · ${eur(r.value)}</td>
            <td data-label="Ceiling" class="num">up to ${r.speedup.toFixed(1)}×</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
    </div>
  </section>

  <section class="drills" aria-labelledby="drill-h">
    <h2 id="drill-h" class="sec-h">Look deeper</h2>
    <ul class="drill-list">
      <li><a href="#/team/roadmap"><span class="dl-name">Roadmap by quarter</span><span class="dl-fig"><strong>${PLAN.length}</strong> initiatives, Q1 to Q4 2027</span><span class="dl-note">Draft, agreed at the end of the route</span>${icon('arrow')}</a></li>
      <li><a href="#/team/human"><span class="dl-name">What stays human</span><span class="dl-fig"><strong>${pct(humanShare)}</strong> of the time left is work a person does</span><span class="dl-note">The human edge of each role</span>${icon('arrow')}</a></li>
      <li><a href="#/team/case"><span class="dl-name">The business case</span><span class="dl-fig"><strong>${eur(T.three_year_value)}</strong> over three years</span><span class="dl-note">Gross estimate, with an adoption ramp</span>${icon('arrow')}</a></li>
    </ul>
  </section>

  ${nextStep('Look at one role up close', '#/role/hr-specialist', 'Sanne’s role twin')}
  ${isnot}`;
}

function fateBar(label, parts, total) {
  const used = parts.reduce((a, [, h]) => a + h, 0);
  const rest = total - used;
  return `<div class="fate-row"><span class="fate-l">${label}</span><span class="fate-bar" role="img" aria-label="${label}: ${parts.map(([n, h]) => `${n} ${n0(h)} hours`).join(', ')}${rest > 1 ? `, ${n0(rest)} hours come back` : ''}">${parts.map(([n, h, k]) => `<span class="fs fs-${k}" style="width:${(h / total * 100).toFixed(2)}%" title="${esc(n)}: ${n0(h)} h">${h / total > 0.08 ? `<span>${n0(h)} h</span>` : ''}</span>`).join('')}${rest > 1 ? `<span class="fs fs-back" style="width:${(rest / total * 100).toFixed(2)}%"><span>${n0(rest)} h come back</span></span>` : ''}</span></div>`;
}
const fateKey = () => `<ul class="wkey fate-key"><li><i class="fk-machine"></i>Software can do it</li><li><i class="fk-reviews"></i>A person checks it</li><li><i class="fk-does"></i>A person does it</li><li><i class="fk-gone"></i>Not needed</li></ul>`;

/* ---------- screen 4: role twin ---------- */

function renderRole(slug) {
  const code = codeBySlug(slug) || '13-1071.00';
  const role = roleByCode(code);
  const people = PEOPLE.filter((p) => p.code === code);
  const pid = state.person[code] && people.some((p) => p.id === state.person[code]) ? state.person[code] : people[0].id;
  const p = person(pid);
  const fn = first(p.name);
  const groups = weekGroups(role);
  const afterSum = groups.reduce((a, g) => a + g.after, 0);
  const freed = 40 - afterSum;
  const moreOf = MORE_OF[code] || role.ambitions.slice(0, 3).map((t) => ({text: t, hours: null}));
  const moreHours = moreOf.reduce((a, m) => a + (m.hours || 0), 0) || freed * 0.8;
  const newWork = Math.max(0, freed - moreHours);
  const isSanne = pid === 'sanne';
  const personal = isSanne && state.sortDone;
  const sortedMore = personal ? CARD_TASKS.filter((_, i) => state.sort[i] === 'more') : [];
  const doesShare = role.by_fate.person_does.before / role.before * 100;
  const roleInits = PLAN.filter((i) => i.ops.some((o) => opById(o)?.code === code));
  const lines = DRUDGERY_LINES[code];
  const seg = (h, cls, label) => `<span class="ws ws-${cls}" style="flex:${h.toFixed(2)}" title="${esc(label)}: ${one(h)} h">${h >= 2.2 ? `<span>${one(h)}</span>` : ''}</span>`;

  return `
  ${pageHead({
    tile: `<span class="av av-l" aria-hidden="true">${initials(p.name)}</span>`,
    title: `${esc(fn)}’s week, before and after`,
    lede: `${esc(p.name)}, ${esc(role.title)}${people.length > 1 ? ` (one of ${people.length})` : ''}. ${esc(role.altitude)}`,
    aside: `<div class="twin-src ${personal ? 'is-personal' : ''}">${personal ? `${icon('check')}<span><strong>${esc(fn)}’s own view</strong>Sharpened with her card sort today</span>` : `${icon('eye')}<span><strong>Generic for this role</strong>${isSanne ? 'Sharper once Sanne finishes card sorting' : `Sharper once ${esc(fn)} sorts their cards`}</span>`}</div>`,
  })}

  <div class="switch">
    <label class="sel">Role<select data-action="role-switch">${MODEL.roles.map((r) => `<option value="${ROLE_SLUG[r.code]}" ${r.code === code ? 'selected' : ''}>${esc(r.title)}</option>`).join('')}</select></label>
    ${people.length > 1 ? `<div class="tabs" role="tablist" aria-label="Person">${people.map((x) => `<button type="button" role="tab" aria-selected="${x.id === pid}" data-action="person" data-code="${code}" data-p="${x.id}"><span class="av av-s" aria-hidden="true">${initials(x.name)}</span>${esc(first(x.name))}</button>`).join('')}</div>` : ''}
  </div>

  <section class="week" aria-labelledby="week-h">
    <h2 id="week-h" class="sec-h">A 40-hour week</h2>
    <div class="wrow"><span class="wrow-l">Today</span><span class="wbar" role="img" aria-label="Today: ${groups.map((g) => `${g.name} ${one(g.before)} hours`).join(', ')}">${groups.map((g) => seg(g.before, g.id, g.name)).join('')}</span></div>
    <div class="wrow"><span class="wrow-l">With AI</span><span class="wbar" role="img" aria-label="With AI: ${groups.map((g) => `${g.name} ${one(g.after)} hours`).join(', ')}, new work ${one(newWork)} hours, more of what matters ${one(moreHours)} hours">${groups.map((g) => seg(g.after, g.id, g.name)).join('')}${seg(newWork, 'new', 'New work: checking and upkeep')}${seg(moreHours, 'more', 'More of what matters')}</span></div>
    <ul class="wkey">
      ${groups.map((g) => `<li><i class="wk-${g.id}"></i>${esc(g.name)}</li>`).join('')}
      <li><i class="wk-new"></i>New work: checking drafts, keeping rules current</li>
      <li><i class="wk-more"></i>More of what matters</li>
    </ul>
    <p class="week-note">About <strong>${one(freed)} hours a week</strong> freed, ${gross}. Even if every routine step went, ${pct(doesShare)} of this role stays with a person; at full adoption the work gets done up to ${role.speedup.toFixed(1)}× faster.</p>
  </section>

  <div class="twin-grid">
    <section class="tg tg-goes" aria-labelledby="goes-h">
      <h2 id="goes-h">What goes</h2>
      <ol class="goes">
        ${role.drudgery.map((d, i) => `<li>
          <p class="goes-line">${esc(lines ? lines[i] : `Less time on: ${d.task}`)}</p>
          <p class="goes-meta">${esc(d.task)} · about ${n0(d.hours / role.fte)} h a year back for ${esc(fn)}</p>
          <details><summary>How it would work</summary><p>${esc(d.design)}</p></details>
        </li>`).join('')}
      </ol>
    </section>

    <section class="tg tg-more" aria-labelledby="more-h">
      <h2 id="more-h">What ${esc(fn)} gets to do more of</h2>
      <ul class="more">
        ${moreOf.map((m) => `<li><span class="more-t">${esc(m.text)}</span>${m.hours ? `<span class="more-h"><span class="more-bar" style="width:${m.hours / 6 * 100}%"></span>${m.hours} h a week</span>` : ''}</li>`).join('')}
      </ul>
      ${personal && sortedMore.length ? `<div class="from-sort"><h3>From ${esc(fn)}’s card sort: more of this</h3><ul>${sortedMore.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>` : `<p class="tg-note">A suggested use of the freed time. ${esc(fn)} decides, with the card sort and the interview.</p>`}
    </section>

    <section class="tg tg-stays" aria-labelledby="stays-h">
      <h2 id="stays-h">What stays ${esc(fn)}’s</h2>
      <ul class="stays">${role.human_edge.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
    </section>

    <section class="tg tg-skills" aria-labelledby="skills-h">
      <h2 id="skills-h">Skills to grow</h2>
      <ul class="skills">${role.skills.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
    </section>
  </div>

  <section class="role-inits" aria-labelledby="ri-h">
    <h2 id="ri-h" class="sec-h">Initiatives that change this role</h2>
    <ul class="ri">
      ${roleInits.map((i) => `<li><span class="ri-q">${i.quarter}</span><a href="#/plan">${esc(i.name)}</a><span class="ri-ap">${i.approaches.map((a) => chip(a)).join('')}</span></li>`).join('') || '<li>None in the draft plan yet.</li>'}
    </ul>
    <p class="role-case">For this role: ${n0(role.returned)} hours a year back across ${role.fte} ${role.fte === 1 ? 'person' : 'people'}, about ${eur(role.value)}. ${gross}</p>
  </section>
  ${nextStep('Back on the route', '#/station/card-sorting', 'Continue card sorting')}`;
}

/* ---------- screen 5: opportunities ---------- */

const inputOfOp = (id) => NORTH_STAR.inputs.find((i) => INPUT_OPS[i.id].includes(id))?.name.toLowerCase();
function opMix(o) {
  const by = {};
  let total = 0;
  for (const s of o.steps) { by[s.approach] = (by[s.approach] || 0) + s.before; total += s.before; }
  return APPROACHES.filter((a) => by[a.id]).map((a) => ({id: a.id, share: by[a.id] / total}));
}
const fateText = (s) => ({machine: 'Software does it', person_reviews: `A person checks it (${s.remaining}% of the time left)`, person_does: s.remaining < 100 ? `A person does it, with help (${s.remaining}% left)` : 'A person does it', gone: 'Step removed'}[s.fate] || s.fate);

function renderOps(openId) {
  if (openId) state.opOpen = openId;
  let list = MODEL.opportunities.filter((o) => (state.opRole === 'all' || o.code === state.opRole) && (state.opApproach === 'all' || o.steps.some((s) => s.approach === state.opApproach)));
  const sorters = {priority: (a, b) => b.priority - a.priority, hours: (a, b) => b.hours - a.hours, value: (a, b) => b.value - a.value};
  list = [...list].sort(sorters[state.opSort]);
  const openInList = list.findIndex((o) => o.id === state.opOpen);
  const visible = state.opAll || openInList >= 7 ? list : list.slice(0, 7);
  const planOf = (id) => PLAN.find((i) => i.ops.includes(id));

  return `
  ${pageHead({
    title: 'Opportunities, ranked by value for effort',
    lede: `Each opportunity is one task in your team. Open it to see its steps and the approach for each step. Priority is the yearly value divided by the effort in days. Hours and money are gross estimates. Showing the top ${MODEL.opportunities.length} of ${MODEL.opportunities_total} tasks with time to gain.`,
    aside: `${fillBar(partFill(PARTS[2]))}<span class="ph-hint">Sharper after: SIPOC, value stream, interviews</span>`,
  })}
  <div class="ops-layout">
    ${legendHTML()}
    <div class="ops-main">
      <div class="toolbar" role="group" aria-label="Filter and sort">
        <label class="sel">Role<select data-action="op-role"><option value="all">All roles</option>${MODEL.roles.map((r) => `<option value="${r.code}" ${state.opRole === r.code ? 'selected' : ''}>${esc(r.title)}</option>`).join('')}</select></label>
        <label class="sel">Has a step that is<select data-action="op-approach"><option value="all">Any approach</option>${APPROACHES.map((a) => `<option value="${a.id}" ${state.opApproach === a.id ? 'selected' : ''}>${esc(a.name)}</option>`).join('')}</select></label>
        <label class="sel">Sort by<select data-action="op-sort"><option value="priority" ${state.opSort === 'priority' ? 'selected' : ''}>Priority (value ÷ effort)</option><option value="hours" ${state.opSort === 'hours' ? 'selected' : ''}>Hours back</option><option value="value" ${state.opSort === 'value' ? 'selected' : ''}>Value</option></select></label>
        <span class="tb-count">${list.length} shown</span>
      </div>
      <div class="ops-cols" aria-hidden="true"><span>#</span><span>Task and role</span><span>Approach mix</span><span class="num">Back per year, gross</span><span>Effort</span><span class="num">Priority</span></div>
      <ol class="ops">
        ${visible.map((o, i) => {
          const open = o.id === state.opOpen;
          const plan = planOf(o.id);
          return `<li class="op ${open ? 'is-open' : ''} ${i === 0 && state.opSort === 'priority' && state.opRole === 'all' && state.opApproach === 'all' ? 'is-top' : ''}" id="${o.id}">
            <button type="button" class="op-row" data-action="op-toggle" data-id="${o.id}" aria-expanded="${open}" aria-controls="${o.id}-steps">
              <span class="op-rank">${i + 1}</span>
              <span class="op-task"><strong>${esc(o.task)}</strong><span>${esc(o.role)} · ${o.steps.length} steps${state.game.done && GAME_OPS.includes(o.id) ? ' · <b class="op-flag">serves the game</b>' : ''}${state.stmt.done && inputOfOp(o.id) ? ` · <b class="op-flag">moves ${esc(inputOfOp(o.id))}</b>` : ''}</span></span>
              <span class="mixbar" role="img" aria-label="Approach mix: ${opMix(o).map((m) => `${approach(m.id).name} ${pct(m.share * 100)}`).join(', ')}">${opMix(o).map((m) => `<span class="seg seg-${m.id}" style="flex:${m.share.toFixed(3)}"></span>`).join('')}</span>
              <span class="op-back num"><strong>${n0(o.hours)} h</strong><span>${eur(o.value)}</span></span>
              <span class="op-effort"><span class="band band-${o.effort.band}">${o.effort.band}</span><span>${o.effort.low}–${o.effort.high} days</span></span>
              <span class="op-pri num"><strong>${n0(o.priority)}</strong><span>EUR per day</span></span>
              ${icon('chev', 'op-chev')}
            </button>
            ${open ? `<div class="op-body" id="${o.id}-steps">
              <table class="steps">
                <caption class="vh">Steps of: ${esc(o.task)}</caption>
                <thead><tr><th scope="col">Step</th><th scope="col">Approach</th><th scope="col">Today</th><th scope="col">After</th><th scope="col" class="num">Back per year</th></tr></thead>
                <tbody>${o.steps.map((s, k) => `<tr>
                  <th scope="row" data-label="Step"><span class="st-n">${k + 1}</span>${esc(s.what)}${s.note ? `<span class="st-note">${esc(s.note)}</span>` : ''}</th>
                  <td data-label="Approach">${chip(s.approach)}</td>
                  <td data-label="Today"><span class="st-today">${esc(MEANS_LABEL[s.means] || s.means)}${s.systems.length ? ` · ${esc(s.systems.join(', '))}` : ''}</span></td>
                  <td data-label="After">${esc(fateText(s))}</td>
                  <td data-label="Back per year" class="num">${s.returned ? `${one(s.returned)} h` : '–'}</td>
                </tr>`).join('')}</tbody>
              </table>
              <div class="op-side">
                <div><h3>What stays human here</h3><p>${esc(o.human_edge)}</p></div>
                ${o.new_work.length ? `<div><h3>New work it creates</h3><ul>${o.new_work.map((w) => `<li>${esc(w)}</li>`).join('')}</ul></div>` : ''}
                <div><h3>Effort</h3><p>${o.effort.band}: ${o.effort.low} to ${o.effort.high} days to build, connect and roll out, plus ${o.effort.consent[0]} to ${o.effort.consent[1]} days for consent and access, alongside. A planning band, not a quote.</p></div>
                ${plan ? `<div><h3>In the plan</h3><p><a href="#/plan">${plan.quarter} · ${esc(plan.name)}</a></p></div>` : ''}
              </div>
            </div>` : ''}
          </li>`;
        }).join('')}
      </ol>
      ${!state.opAll && list.length > 7 && openInList < 7 ? `<button type="button" class="btn btn-secondary show-all" data-action="op-all">Show all ${list.length}</button>` : ''}
      ${list.length === 0 ? '<p class="empty">No opportunity matches these filters. <button type="button" class="link" data-action="op-clear">Clear filters</button></p>' : ''}
      ${nextStep('See how these become initiatives', '#/plan', 'The plan')}
    </div>
  </div>`;
}

function legendHTML() {
  const fams = [['software', 'Software does it'], ['gone', 'Gone'], ['people', 'People, helped or not']];
  return `<aside class="legend" aria-labelledby="legend-h">
    <details ${state.legendClosed ? '' : 'open'} class="legend-d" data-action="legend">
      <summary><h2 id="legend-h">Nine approaches, one per step</h2>${icon('chev', 'legend-chev')}</summary>
      <div class="legend-fams">
        ${fams.map(([fam, label]) => `<div class="legend-fam legend-${fam}"><h3>${label}</h3><ul>${APPROACHES.filter((a) => a.family === fam).map((a) => `<li>${chip(a.id)}<p>${esc(a.line)}</p></li>`).join('')}</ul></div>`).join('')}
      </div>
      <p class="legend-note">Effort bands: S up to 15 days, M up to 30, L more. Priority = yearly value ÷ midpoint effort days. Hours and money are gross estimates.</p>
    </details>
  </aside>`;
}

/* ---------- screen 6: plan ---------- */

function initTotals(i) {
  const ops = i.ops.map(opById).filter(Boolean);
  const hours = ops.reduce((a, o) => a + o.hours, 0);
  const value = ops.reduce((a, o) => a + o.value, 0);
  const bands = ops.map((o) => o.effort.band);
  const band = bands.includes('L') ? 'L' : bands.includes('M') ? 'M' : 'S';
  return {ops, hours, value, band};
}

function renderPlan() {
  const all = PLAN.map((i) => ({...i, ...initTotals(i)}));
  const hours = all.reduce((a, i) => a + i.hours, 0);
  const value = all.reduce((a, i) => a + i.value, 0);
  const covered = new Set(all.flatMap((i) => i.ops)).size;
  return `
  ${pageHead({
    tile: jt(routeItems().length, 'next', 'jt-l'),
    title: 'Your plan for 2027',
    lede: `Twelve initiatives, ordered by value for effort and by how long consent takes. Each one traces back to the opportunities it serves. Together they cover ${covered} opportunities: about ${about(hours)} hours a year, ${eur(value)}, of the ${about(T.returned)} hours the twin finds. The other tasks join as the route goes on.`,
    aside: `${fillBar(partFill(PARTS[4]))}<span class="ph-hint">Firm after: North Star workshop (12 Nov), Guardrails check</span>`,
  })}
  <div class="plan-bar">
    <p>${gross} Owners are proposed, not agreed. After the North Star workshop each initiative becomes a bet on one input.</p>
    <div class="plan-acts">
      <button type="button" class="btn btn-secondary btn-s" data-action="print">${icon('print')}Print or save as PDF</button>
      <button type="button" class="btn btn-secondary btn-s" data-action="csv">${icon('download')}Download CSV</button>
      <button type="button" class="btn btn-secondary btn-s" data-action="share">${icon('share')}Share with the team</button>
    </div>
  </div>
  <ol class="quarters">
    ${QUARTERS.map((q) => `
      <li class="qcol">
        <div class="q-head"><h2>${q.label}</h2><p>${esc(q.note)}</p></div>
        <ol class="inits">
          ${all.filter((i) => i.quarter === q.id).map((i) => {
            const owner = person(i.owner);
            const heavy = /consent|assessment|High-risk/i.test(i.consent);
            return `<li class="init">
              <h3>${esc(i.name)}</h3>
              <p class="init-owner"><span class="av av-s" aria-hidden="true">${initials(owner.name)}</span>${esc(owner.name)}<span>owner</span></p>
              <p class="init-builds">${esc(i.builds)}</p>
              <p class="init-ap">${i.approaches.map((a) => chip(a)).join('')}</p>
              <p class="init-num"><strong>${n0(i.hours)} h</strong> a year · ${eur(i.value)} · <span class="band band-${i.band}">${i.band}</span></p>
              <p class="init-consent ${heavy ? 'is-heavy' : ''}">${icon(heavy ? 'flag' : 'check')}${esc(i.consent)}</p>
              ${state.stmt.done ? `<p class="init-bet ${INIT_BETS[i.id] ? '' : 'is-none'}">${icon('star')}${INIT_BETS[i.id] ? `Bet on input: <strong>${esc(NORTH_STAR.inputs.find((x) => x.id === INIT_BETS[i.id]).name)}</strong>` : 'No input yet: Bet up decides'}</p>` : ''}
              ${state.game.done && i.id === 'i4' ? `<p class="init-bet">${icon('flag')}Success measure: right the first time, not mails answered</p>` : ''}
              <details class="init-from"><summary>From ${i.ops.length} ${i.ops.length === 1 ? 'opportunity' : 'opportunities'}</summary><ul>${i.ops.map((o) => `<li><a href="#/opportunities/${o.id}">${esc(o.task)}</a><span>${esc(o.role)}</span></li>`).join('')}</ul></details>
            </li>`;
          }).join('')}
        </ol>
      </li>`).join('')}
  </ol>`;
}

function downloadCsv() {
  const rows = [['quarter', 'initiative', 'owner', 'hours_per_year_gross', 'value_eur_gross', 'effort_band', 'consent', 'opportunities']];
  for (const i of PLAN) {
    const t = initTotals(i);
    rows.push([i.quarter, i.name, person(i.owner).name, t.hours, t.value, t.band, i.consent, t.ops.map((o) => o.task).join(' | ')]);
  }
  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], {type: 'text/csv'}));
  a.download = 'noordhaven-hr-plan-2027.csv';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast('Plan downloaded as CSV.');
}

/* ---------- screen 7: module library ---------- */

function renderStations(openId) {
  const items = routeItems();
  const num = (id) => items.find((it) => it.id === id)?.n;
  const statusTone = {Done: 'done', Closed: 'done', 'In progress': 'progress', Booked: 'booked', Planned: 'next', 'Not started': 'next', Suggested: 'suggested'};
  const fmtTags = (s) => (s.format ? `<span class="fmt">${s.format.map((f) => `<span class="tag tag-fmt tag-${f.toLowerCase().replace(/[^a-z]/g, '')}">${esc(f)}</span>`).join('')}</span>` : '');
  const row = (s) => {
    const inGroup = Boolean(s.group);
    const on = !state.offRoute.includes(s.group || s.id);
    const open = openId === s.id;
    const it = items.find((x) => x.id === (s.group || s.id));
    const frac = stationFrac(s.id);
    const tileState = inGroup ? (frac >= 1 ? 'done' : frac > 0 ? 'progress' : 'next') : it?.state;
    const tile = !on ? `<span class="jt jt-off" aria-hidden="true">${icon('plus')}</span>` : inGroup ? jt(`${num(s.group)}.${s.n}`, tileState, 'jt-sub') : jt(num(s.id), tileState);
    return `<li class="mod ${open ? 'is-open' : ''} ${inGroup ? 'mod-sub' : ''} ${s.bundle ? 'mod-bundle' : ''}" id="m-${s.id}">
      <h3 class="mod-h">
        <button type="button" class="mod-row" data-action="mod-toggle" data-id="${s.id}" aria-expanded="${open}" aria-controls="m-${s.id}-body">
          ${tile}
          <span class="mod-name"><span class="mod-title">${esc(s.name)}</span>${s.added ? '<span class="tag tag-added">added by us</span>' : ''}${fmtTags(s)}</span>
          <span class="mod-time">${icon('clock')}${esc(s.time.split(' (')[0].replace(', in the workshop', ''))}</span>
          <span class="mod-prog">${stationDone(s.id)} of ${stationTotal(s.id)} ${esc(s.unit)}</span>
          <span class="status status-${statusTone[statusOf(s)]}">${statusOf(s)}</span>
          ${icon('chev', 'mod-chev')}
        </button>
      </h3>
      ${open ? `<div class="mod-body" id="m-${s.id}-body">
        <dl class="mod-dl">
          <div><dt>What it does</dt><dd>${esc(s.what)}</dd></div>
          <div><dt>How long</dt><dd>${esc(s.time)}</dd></div>
          <div><dt>Who does it</dt><dd>${esc(s.who)} ${fmtTags(s)}</dd></div>
          ${s.output ? `<div><dt>What comes out</dt><dd>${esc(s.output)}${s.exercise ? `<span class="mod-src">Board exercise: ${esc(s.exercise)}</span>` : ''}</dd></div>` : ''}
          <div><dt>What it adds to the goal</dt><dd><ul class="adds">${s.adds.map((pid) => {
            const part = PARTS.find((p) => p.id === pid);
            const gain = (100 - BASE_FILL) * weightFor(part, s) * (1 - frac);
            return `<li><a href="${part.route}">${esc(part.name)}</a><span>${gain >= 0.5 ? `up to +${Math.round(gain)} points when finished` : frac >= 1 ? 'already counted' : 'a small share'}</span></li>`;
          }).join('')}</ul></dd></div>
          <div><dt>Status</dt><dd>${esc(s.detail)}</dd></div>
        </dl>
        ${s.bundle ? northStarParts(num(s.id)) : ''}
        <div class="mod-acts">
          ${s.open ? `<a class="btn btn-primary btn-s" href="${s.open}">${s.id === 'card-sorting' ? 'Open card sorting' : flag(s.id) ? 'See what it added' : 'Run the exercise'} ${icon('arrow')}</a>` : ''}
          ${inGroup ? `<a class="btn btn-ghost btn-s" href="#/stations/${s.group}">Part of the North Star workshop ${icon('arrow')}</a>` : `<button type="button" class="btn btn-secondary btn-s" data-action="route-toggle" data-id="${s.id}">${on ? 'Take off the route' : `${icon('plus')}Add to the route`}</button>`}
        </div>
      </div>` : ''}
    </li>`;
  };
  const team = STATIONS.filter((s) => s.kind === 'team' && !s.group && !s.bundle && s.id !== 'guardrails');
  return `
  ${pageHead({
    tile: `<span class="vp-badge">${icon('route')}</span>`,
    title: 'Stations for your route',
    lede: 'Each station is a short module. Individual stations are done by each person on their own; team stations are done together. Each one fills a part of the destination, and you choose which ones are on your route.',
  })}
  <div class="libs">
    <section class="lib" aria-labelledby="lib-i">
      <div class="lib-head">${icon('person')}<h2 id="lib-i">For each person</h2><p>Done alone, in their own time. Answers belong to the person; the team sees totals.</p></div>
      <ul class="mods">${STATIONS.filter((s) => s.kind === 'individual').map(row).join('')}</ul>
    </section>
    <section class="lib" aria-labelledby="lib-t">
      <div class="lib-head">${icon('team')}<h2 id="lib-t">For the team together</h2><p>Mapping the work with the people who do it, and agreeing what success means.</p></div>
      <ul class="mods">${team.map(row).join('')}</ul>
      <div class="ns-group">
        <div class="nsg-head">${icon('star')}<div><h3>North Star modules</h3><p>Eight modules, after Amplitude’s North Star Playbook and our exercise board. Four run live in one workshop; the others are done alone or on a shared board, before or after it.</p></div></div>
        <ul class="mods">${row(station('north-star'))}${groupOf('north-star').map(row).join('')}</ul>
      </div>
      <ul class="mods">${row(station('guardrails'))}</ul>
    </section>
  </div>
  ${nextStep('You are at station 5', '#/station/card-sorting', 'Continue card sorting')}`;
}

function northStarParts(bundleN) {
  const total = NORTH_STAR_PARTS.reduce((a, p) => a + p.min, 0);
  return `<div class="nsp">
    <h4>The workshop agenda <span>8 parts, ${total} minutes in total</span></h4>
    <ol class="nsp-list">
      ${NORTH_STAR_PARTS.map((p) => `<li>
        <details>
          <summary><span class="nsp-n">${p.n}</span><span class="nsp-name">${esc(p.name)}${p.optional ? ' <em>optional</em>' : ''}</span><span class="nsp-min">${p.min} min</span><span class="nsp-out">${esc(p.output)}</span>${icon('chev', 'nsp-chev')}</summary>
          <dl><div><dt>Purpose</dt><dd>${esc(p.purpose)}</dd></div><div><dt>Output</dt><dd>${esc(p.output)}</dd></div><div><dt>For this team</dt><dd>${esc(p.hr)}</dd></div>${p.module ? `<div><dt>Module</dt><dd><a href="#/stations/${p.module}">${bundleN}.${station(p.module).n} ${esc(station(p.module).name)}</a></dd></div>` : ''}</dl>
        </details>
      </li>`).join('')}
    </ol>
    <p class="nsp-after">${esc(NORTH_STAR_AFTER)}</p>
    <p class="nsp-ex">Example outcome for an HR team: <strong>${esc(NORTH_STAR.name)}</strong> ${illustrative}, with inputs ${NORTH_STAR.inputs.map((i) => i.name.toLowerCase()).join(', ')}.</p>
    <p class="nsp-src">Source: Amplitude\u2019s North Star Playbook, its workshop guide (2024) and our exercise boards. The guide calls it a two-hour agenda; its parts add up to ${total} minutes.</p>
  </div>`;
}

/* ---------- screen 8: card sorting (a module in progress) ---------- */

const cardTask = (i) => MODEL.hs_tasks.find((t) => t.task === CARD_TASKS[i]) || {task: CARD_TASKS[i], hours_per_person: 0, returned_per_person: 0, saved_pct: 0};

function renderCardSort(step) {
  const sortedCount = Object.keys(state.sort).length;
  const total = CARD_TASKS.length;
  const tileN = routeItems().find((it) => it.id === 'card-sorting')?.n || 5;
  const banner = `<p class="demo-bar">${icon('person')}<span>You are seeing <strong>Sanne Visser’s</strong> session as a demo. Her piles are hers: the team sees totals only.</span></p>`;
  const view = step || (state.sortDone ? 'done' : state.sortStarted ? 'sort' : 'intro');

  if (view === 'intro') {
    return `${banner}
    ${pageHead({tile: jt(tileN, 'here', 'jt-l'), title: 'Sort your tasks into four piles', lede: 'Ten cards, one for each of your biggest tasks. Put each one on the pile that fits how you feel about it. There are no wrong answers, and you can undo any card.'})}
    <ol class="pile-intro">
      ${PILES.map((p) => `<li class="pi pi-${p.id}"><span class="pi-key">${p.key}</span><h2>${esc(p.name)}</h2><p>${esc(p.line)}</p></li>`).join('')}
    </ol>
    <div class="cs-start">
      <p>${icon('clock')}About 12 minutes · ${total} cards · saved as you go</p>
      <button type="button" class="btn btn-primary" data-action="sort-start">Start sorting ${icon('arrow')}</button>
    </div>`;
  }

  if (view === 'done') return renderSortDone(tileN, banner);

  const next = CARD_TASKS.findIndex((_, i) => !(i in state.sort));
  const card = next >= 0 ? cardTask(next) : null;
  return `${banner}
  <div class="cs-head">
    <div class="ph-title">${jt(tileN, 'here', 'jt-l')}<h1 tabindex="-1">${card ? 'Where does this card go?' : 'All cards sorted'}</h1></div>
    <div class="cs-prog"><span class="cs-prog-t"><strong>${sortedCount}</strong> of ${total} sorted</span><span class="fill-track"><span class="fill-bar" style="width:${sortedCount / total * 100}%"></span></span></div>
  </div>
  <div class="table-cs">
    <div class="deal">
      ${card ? `
        <div class="deck" aria-hidden="true">${Array.from({length: Math.min(3, total - sortedCount - 1)}, (_, k) => `<span class="deck-edge" style="--k:${k + 1}"></span>`).join('')}</div>
        <article class="card" draggable="true" data-card="${next}" aria-labelledby="card-t">
          <span class="card-n">Card ${sortedCount + 1}</span>
          <h2 id="card-t" class="card-t">${esc(card.task)}</h2>
          <p class="card-h">About <strong>${n0(card.hours_per_person)} hours</strong> a year for you</p>
          <p class="card-hint">Drag it to a pile, press 1 to 4, or pick a pile.</p>
        </article>` : `
        <div class="card card-done"><h2 class="card-t">Every card has a pile.</h2><p>Check the piles, undo if you like, then finish.</p><button type="button" class="btn btn-primary" data-action="sort-finish">Finish and see what it adds ${icon('arrow')}</button></div>`}
      <div class="deal-acts">
        <button type="button" class="btn btn-ghost btn-s" data-action="sort-undo" ${sortedCount ? '' : 'disabled'}>${icon('undo')}Undo last card</button>
      </div>
    </div>
    <ol class="piles" aria-label="Piles">
      ${PILES.map((p) => {
        const cards = CARD_TASKS.map((t, i) => ({t, i})).filter(({i}) => state.sort[i] === p.id);
        return `<li class="pile pile-${p.id}" data-pile="${p.id}">
          <button type="button" class="pile-btn" data-action="sort-put" data-pile="${p.id}" ${card ? '' : 'disabled'}>
            <span class="pile-key" aria-hidden="true">${p.key}</span>
            <span class="pile-text"><strong>${esc(p.name)}</strong><span>${esc(p.line)}</span></span>
            <span class="pile-count">${cards.length}</span>
          </button>
          ${cards.length ? `<ul class="pile-cards">${cards.map(({t}) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
        </li>`;
      }).join('')}
    </ol>
  </div>`;
}

function renderSortDone(tileN, banner) {
  const by = Object.fromEntries(PILES.map((p) => [p.id, CARD_TASKS.map((_, i) => i).filter((i) => state.sort[i] === p.id)]));
  const offHours = by.off.reduce((a, i) => a + cardTask(i).returned_per_person, 0);
  const conflicts = by.more.filter((i) => cardTask(i).saved_pct >= 50);
  const helpCards = by.help.length;
  const parts = PARTS.filter((p) => p.weights['card-sorting']).map((p) => ({p, from: partFill(p, {'card-sorting': false}), to: partFill(p, {'card-sorting': true})}));
  return `${banner}
  ${pageHead({tile: jt(tileN, 'done', 'jt-l'), title: 'Done. This is what your sort added to the goal', lede: 'Sanne’s ten cards are now part of the route. Her role twin uses her own view instead of the generic one, and the team picture moves on.'})}
  <div class="added">
    <section class="added-main" aria-labelledby="ad-h">
      <h2 id="ad-h" class="sec-h">Added to your goal</h2>
      <ul class="gains">
        <li><span class="gain-k">${icon('person')}</span><div><strong>Sanne’s role twin: generic → her own view</strong><span>${by.more.length} ${by.more.length === 1 ? 'task' : 'tasks'} she wants more of now show as <em>amplify</em>, not <em>automate</em>.</span></div></li>
        <li><span class="gain-k">${icon('arrow')}</span><div><strong>${by.off.length} ${by.off.length === 1 ? 'task' : 'tasks'} to take off her plate</strong><span>About ${n0(offHours)} hours a year the model says software can take on those tasks. ${gross}</span></div></li>
        <li><span class="gain-k">${glyph('amplify')}</span><div><strong>${helpCards} ${helpCards === 1 ? 'task' : 'tasks'} where she wants help, not replacement</strong><span>These steps move towards <em>amplify</em> in the opportunities.</span></div></li>
        ${conflicts.length ? `<li class="gain-flag"><span class="gain-k">${icon('flag')}</span><div><strong>${conflicts.length} to talk about</strong><span>She wants more of ${conflicts.map((i) => `“${esc(cardTask(i).task.replace(/\.$/, ''))}” (the model would take ${cardTask(i).saved_pct}%)`).join('; ')}. Picked up in her interview.</span></div></li>` : ''}
        <li><span class="gain-k">${icon('team')}</span><div><strong>Card sorting: ${stationDone('card-sorting')} of 10 people</strong><span>The team sees the piles summed over everyone, never Sanne’s own cards.</span></div></li>
      </ul>
    </section>
    <section class="added-parts" aria-labelledby="ap-h">
      <h2 id="ap-h" class="sec-h">The destination, sharper</h2>
      <ul class="sharpen">
        ${parts.map(({p, from, to}) => `<li><a href="${p.route}">${esc(p.name)}</a><span class="fill tone-${level(to).tone}"><span class="fill-track"><span class="fill-bar fill-was" style="width:${from.toFixed(1)}%"></span><span class="fill-bar fill-grow" style="--from:${from.toFixed(1)}%;--to:${to.toFixed(1)}%"></span></span><span class="fill-text"><strong>${Math.round(from)}% → ${Math.round(to)}%</strong></span></span></li>`).join('')}
      </ul>
      <p class="sharpen-note">One person moves the team picture a little. Ten people move it a lot.</p>
    </section>
  </div>
  <div class="cs-end">
    <a class="btn btn-primary" href="#/role/hr-specialist">See Sanne’s role twin ${icon('arrow')}</a>
    <a class="btn btn-secondary" href="#/goal">Back to the route</a>
    <button type="button" class="btn btn-ghost" data-action="sort-reset">Sort again</button>
  </div>`;
}

function sortPut(pile) {
  const next = CARD_TASKS.findIndex((_, i) => !(i in state.sort));
  if (next < 0) return;
  state.sort[next] = pile;
  state.sortOrder.push(next);
  save();
  render({keepFocus: true});
  const p = PILES.find((x) => x.id === pile);
  toast(`On "${p.name}".`);
  const btn = document.querySelector(`.pile-btn[data-pile="${pile}"]`);
  if (btn && !btn.disabled) btn.focus({preventScroll: true});
  else document.querySelector('[data-action="sort-finish"]')?.focus({preventScroll: true});
}

/* ---------- North Star exercises, clickable: pick the game, and the statement ---------- */

const nsBanner = (extra = '') => `<p class="demo-bar">${icon('team')}<span>A demo of the live workshop on 12 Nov. You facilitate on the shared screen; the team joins on their phones.${extra}</span></p>`;
const gameOf = () => GAMES.find((g) => g.id === state.game.pick);

function nsDoneBlock({title, lede, gains, flagId, next}) {
  const parts = PARTS.filter((p) => p.weights['north-star']).map((p) => ({p, from: partFill(p, {[flagId]: false}), to: partFill(p, {[flagId]: true})}));
  return `
  ${pageHead({tile: jt(`${nsNum()}.${station(flagId).n}`, 'done', 'jt-l jt-sub'), title, lede})}
  <div class="added">
    <section class="added-main" aria-labelledby="ad-h">
      <h2 id="ad-h" class="sec-h">Added to your goal</h2>
      <ul class="gains">${gains.join('')}</ul>
    </section>
    <section class="added-parts" aria-labelledby="ap-h">
      <h2 id="ap-h" class="sec-h">The destination, sharper</h2>
      <ul class="sharpen">
        ${parts.map(({p, from, to}) => `<li><a href="${p.route}">${esc(p.name)}</a><span class="fill tone-${level(to).tone}"><span class="fill-track"><span class="fill-bar fill-was" style="width:${from.toFixed(1)}%"></span><span class="fill-bar fill-grow" style="--from:${from.toFixed(1)}%;--to:${to.toFixed(1)}%"></span></span><span class="fill-text"><strong>${Math.round(from)}% → ${Math.round(to)}%</strong></span></span></li>`).join('')}
      </ul>
      <p class="sharpen-note">North Star modules: ${stationDone('north-star')} of ${stationTotal('north-star')} done.</p>
    </section>
  </div>
  <div class="cs-end">${next}</div>`;
}
const gain = (k, title, body, cls = '') => `<li class="${cls}"><span class="gain-k">${k}</span><div><strong>${title}</strong><span>${body}</span></div></li>`;
const nsNum = () => routeItems().find((it) => it.id === 'north-star')?.n || 10;

function renderGame(step) {
  const g = state.game;
  const view = step || (g.done ? 'done' : 'pick');
  const tile = jt(`${nsNum()}.1`, g.done ? 'done' : 'here', 'jt-l jt-sub');

  if (view === 'exchange') {
    const game = gameOf() || GAMES[2];
    return `${nsBanner()}
    ${pageHead({tile, title: 'Tie it to the value exchange', lede: `You picked the ${esc(game.name.toLowerCase())}. Say in one breath what people bring to HR and what HR gives back. Edit the words until the room agrees.`})}
    <form class="exchange" data-action="game-agree">
      <p class="ex-line"><span>Employees and managers bring HR</span><input name="give" value="${esc(g.give)}" aria-label="What people bring to HR"></p>
      <p class="ex-line"><span>HR gives back</span><input name="get" value="${esc(g.get)}" aria-label="What HR gives back"></p>
      <p class="ex-line"><span>So success can mean</span><input name="means" value="${esc(g.means)}" aria-label="What success can mean"></p>
      <div class="ex-acts">
        <a class="btn btn-ghost" href="#/station/ns-game/pick">${icon('undo')}Back to the games</a>
        <button class="btn btn-primary" type="submit">Agree the game ${icon('arrow')}</button>
      </div>
    </form>
    <p class="ex-src">From the guide: ask "Which game is our business playing?", pick one, tie it to the value exchange (How-to Guide, p. 8 to 10). The HR reading is ours.</p>`;
  }

  if (view === 'done') {
    const game = gameOf() || GAMES[2];
    const ops = GAME_OPS.map(opById).filter(Boolean);
    const productivity = game.id === 'productivity';
    return `${nsBanner()}
    ${nsDoneBlock({
      flagId: 'ns-game',
      title: `Agreed: HR plays the ${esc(game.name.toLowerCase())}`,
      lede: `“Employees and managers bring HR ${esc(g.give)}. HR gives back ${esc(g.get)}. So success can mean ${esc(g.means)}.”`,
      gains: [
        gain(icon('eye'), 'Team twin: success is framed as the ' + esc(game.name.toLowerCase()), `The twin now leads with what employees and managers get back, not with HR activity. <a href="#/team">See the team twin</a>`),
        productivity
          ? gain(icon('arrow'), `${ops.length} opportunities now marked as serving the game`, `Requests from employees and managers: ${ops.slice(0, 3).map((o) => `<a href="#/opportunities/${o.id}">${esc(o.task.replace(/\.$/, ''))}</a>`).join('; ')}, and ${ops.length - 3} more.`)
          : gain(icon('flag'), 'Check this choice against the opportunities', `Most of your top opportunities are employee requests, which fits the productivity game better. Talk about it in part 3 of the workshop.`, 'gain-flag'),
        gain(icon('flag'), 'Initiative: Policy answer desk gets its success measure', `Measured as answers that are right the first time, not as mails answered. <a href="#/plan">See the plan</a>`),
        gain(icon('x'), `${VANITY.length} vanity measures dropped as targets`, `${VANITY.map(esc).join(' and ')}, from Ingrid’s metrics inventory, stay visible but are no longer goals.`),
      ],
      next: `<a class="btn btn-primary" href="#/station/ns-statement">Next exercise: Statement ${icon('arrow')}</a><a class="btn btn-secondary" href="#/team">See the team twin</a><a class="btn btn-ghost" href="#/stations/north-star">Back to the North Star modules</a><button type="button" class="btn btn-ghost" data-action="game-reset">Run it again</button>`,
    })}`;
  }

  // pick
  return `${nsBanner()}
  ${pageHead({tile, title: 'Which game is HR playing?', lede: 'Amplitude’s North Star guide sorts products into three games. Pick the one that describes the value HR gives, so AI work aims at value, not activity. 15 minutes, live, the whole team.'})}
  <div class="games" role="radiogroup" aria-label="The three games">
    ${GAMES.map((x) => `
      <button type="button" class="game ${g.pick === x.id ? 'is-picked' : ''}" role="radio" aria-checked="${g.pick === x.id}" data-action="game-pick" data-id="${x.id}">
        <span class="game-head"><strong>${esc(x.name)}</strong><span class="game-radio" aria-hidden="true"></span></span>
        <span class="game-value">${esc(x.value)}</span>
        <span class="game-row"><span>For HR</span>${esc(x.hr)}</span>
        <span class="game-row"><span>Success looks like</span>${esc(x.success)}</span>
        <span class="game-row game-trap"><span>Watch out</span>${esc(x.trap)}</span>
        <span class="game-votes ${g.votes ? 'is-shown' : ''}" aria-label="${g.votes ? `${x.votes} of 10 votes` : 'Votes hidden'}">${g.votes ? `${Array.from({length: 10}, (_, i) => `<i class="${i < x.votes ? 'on' : ''}"></i>`).join('')}<b>${x.votes} of 10</b>` : '<em>Votes appear when you show the room</em>'}</span>
      </button>`).join('')}
  </div>
  <div class="cs-start">
    <p>${icon('team')}${g.votes ? 'The room voted. You have the last word as facilitator.' : 'Ten people vote on their phones. Show the votes when everyone is in.'}</p>
    <div class="ex-acts">
      <button type="button" class="btn btn-secondary" data-action="game-votes" ${g.votes ? 'disabled' : ''}>${g.votes ? `${icon('check')}Votes shown` : 'Show the room’s votes'}</button>
      <button type="button" class="btn btn-primary" data-action="game-next" ${g.pick ? '' : 'disabled'}>Next: the value exchange ${icon('arrow')}</button>
    </div>
  </div>`;
}

const STMT_STEPS = [['statement', 'Statement'], ['name', 'Name it'], ['inputs', 'Inputs'], ['bets', 'Interventions']];

function renderStatement(step) {
  const s = state.stmt;
  const view = step || (s.done ? 'done' : 'statement');
  const game = gameOf();
  const tile = jt(`${nsNum()}.5`, s.done ? 'done' : 'here', 'jt-l jt-sub');
  const idx = STMT_STEPS.findIndex(([id]) => id === view);
  const stepper = `<ol class="stepper" aria-label="Worksheet">${STMT_STEPS.map(([id, label], i) => `<li class="${i < idx ? 'is-done' : i === idx ? 'is-now' : ''}" ${i === idx ? 'aria-current="step"' : ''}><span>${i + 1}</span>${label}</li>`).join('')}</ol>`;
  const guide = (body) => `<aside class="guide" aria-label="AI guide">${icon('star')}<div><strong>AI guide</strong>${body}</div></aside>`;
  const head = (title, lede) => `${nsBanner(' The metric name and its inputs come from the guide’s HR example and are illustrative.')}${pageHead({tile, title, lede})}${stepper}`;

  if (view === 'statement') {
    return `${head('Words before numbers', 'Write what the AI-native HR team delivers. Then name the metric, its inputs, and the work that moves them. The AI guide proposes wording; the team edits.')}
    <div class="stmt">
      <div class="stmt-main">
        ${guide(`<p>Based on ${game ? `your game (${esc(game.name.toLowerCase())})` : 'the productivity game (the game exercise has not run yet, so this is our default)'} and your team’s ${MODEL.counts.tasks} tasks, three ways to say it. Scored on the seven checks.</p>`)}
        <ol class="cands">
          ${STATEMENT_CANDIDATES.map((c, i) => `<li class="cand ${s.pick === i ? 'is-picked' : ''}">
            <p class="cand-t">“${esc(c.text)}”</p>
            <ul class="checks">${CHECKS.map((k) => `<li class="${c.fails.includes(k) ? 'is-fail' : ''}">${icon(c.fails.includes(k) ? 'x' : 'check')}${esc(k)}</li>`).join('')}</ul>
            <p class="cand-note">${esc(c.note)}</p>
            <button type="button" class="btn ${s.pick === i ? 'btn-secondary' : 'btn-secondary'} btn-s" data-action="stmt-pick" data-i="${i}">${s.pick === i ? `${icon('check')}In the editor` : 'Use this wording'}</button>
          </li>`).join('')}
        </ol>
      </div>
      <form class="stmt-edit" data-action="stmt-next" data-step="name">
        <label for="stmt-text">The team’s statement</label>
        <textarea id="stmt-text" name="text" rows="4" placeholder="Pick a proposal, or write your own">${esc(s.text)}</textarea>
        <p class="hint">Edit together. Short beats complete.</p>
        <button class="btn btn-primary" type="submit">Next: name it ${icon('arrow')}</button>
      </form>
    </div>`;
  }

  if (view === 'name') {
    return `${head('Name it, then define it', 'The playbook’s template: “Our North Star Metric is called X, which we define as Y.”')}
    <form class="stmt-name" data-action="stmt-next" data-step="inputs">
      <p class="tmpl">Our North Star Metric is called
        <input name="name" value="${esc(s.name)}" aria-label="Metric name"> ${illustrative}
      </p>
      <p class="tmpl">which we define as</p>
      <textarea name="definition" rows="3" aria-label="Definition">${esc(s.definition)}</textarea>
      ${guide('<p>A ratio, measured weekly, which is what a North Star should be: a rate, count or ratio. It should move before cost and satisfaction do. Agree who checks "correctly" in a sample.</p>')}
      <div class="ex-acts"><a class="btn btn-ghost" href="#/station/ns-statement/statement">${icon('undo')}Back</a><button class="btn btn-primary" type="submit">Next: the inputs ${icon('arrow')}</button></div>
    </form>`;
  }

  if (view === 'inputs') {
    return `${head('The inputs that move it', 'The guide pre-filled four slots with AI levers, using the breadth, depth, frequency and efficiency pattern. Edit them; underneath each, the opportunities from your route that would move it.')}
    <form class="inputs-ws" data-action="stmt-next" data-step="bets">
      <ul class="slots">
        ${NORTH_STAR.inputs.map((inp) => `<li>
          <label><strong>${inp.name}</strong><input name="${inp.id}" value="${esc(s.inputs[inp.id])}"></label>
          <span class="slot-ops">Moved by: ${INPUT_OPS[inp.id].map((id) => opById(id)).filter(Boolean).map((o) => `<a href="#/opportunities/${o.id}">${esc(o.task.replace(/\.$/, ''))}</a>`).join('<span aria-hidden="true"> · </span>')}</span>
        </li>`).join('')}
      </ul>
      ${guide('<p>Depth counts what an AI agent completes end to end. Amplification first: pair it with Efficiency, so speed never beats accuracy, and keep a person on every answer that changes someone’s pay or contract.</p>')}
      <div class="ex-acts"><a class="btn btn-ghost" href="#/station/ns-statement/name">${icon('undo')}Back</a><button class="btn btn-primary" type="submit">Next: the interventions ${icon('arrow')}</button></div>
    </form>`;
  }

  if (view === 'bets') {
    const unmapped = PLAN.filter((i) => !INIT_BETS[i.id]);
    return `${head('Interventions: what you will do', 'Each initiative in the draft plan becomes a bet on one input. The guide proposes the match; drag your attention to the ones that match nothing.')}
    <ul class="bets">
      ${NORTH_STAR.inputs.map((inp) => `<li><h3>${inp.name}</h3><p>${esc(s.inputs[inp.id])}</p><ul>${PLAN.filter((i) => INIT_BETS[i.id] === inp.id).map((i) => `<li><span class="ri-q">${i.quarter}</span>${esc(i.name)}</li>`).join('')}</ul></li>`).join('')}
      <li class="bets-none"><h3>No input yet</h3><p>These trace to none of the four. The Bet up module (${nsNum()}.7) checks each one; a bet that traces to nothing is stopped.</p><ul>${unmapped.map((i) => `<li><span class="ri-q">${i.quarter}</span>${esc(i.name)}</li>`).join('')}</ul></li>
    </ul>
    <div class="ex-acts"><a class="btn btn-ghost" href="#/station/ns-statement/inputs">${icon('undo')}Back</a><button type="button" class="btn btn-primary" data-action="stmt-save">Save the worksheet ${icon('arrow')}</button></div>`;
  }

  // done
  const bets = Object.keys(INIT_BETS).length;
  const opCount = Object.values(INPUT_OPS).flat().length;
  return `${nsBanner(' The metric name and its inputs come from the guide’s HR example and are illustrative.')}
  ${nsDoneBlock({
    flagId: 'ns-statement',
    title: 'Saved: the team’s statement worksheet',
    lede: `“${esc(s.text || STATEMENT_CANDIDATES[0].text)}”`,
    gains: [
      gain(icon('eye'), 'Team twin: the North Star now shows your own words', `${esc(s.name)} (name illustrative), with your four inputs. <a href="#/team">See the team twin</a>`),
      gain(icon('flag'), `Plan: ${bets} initiatives now bet on an input`, `For example ${PLAN.filter((i) => INIT_BETS[i.id]).slice(0, 2).map((i) => `“${esc(i.name)}” on ${esc(INIT_BETS[i.id])}`).join(', ')}. ${PLAN.length - bets} trace to no input yet. <a href="#/plan">See the plan</a>`),
      gain(icon('arrow'), `Opportunities: ${opCount} linked to an input`, `Each shows which input it moves, so the ranking can follow the North Star. <a href="#/opportunities/op3">See one</a>`),
    ],
    next: `<a class="btn btn-primary" href="#/team">See the team twin ${icon('arrow')}</a><a class="btn btn-secondary" href="#/plan">See the plan</a><a class="btn btn-ghost" href="#/stations/north-star">Back to the North Star modules</a><button type="button" class="btn btn-ghost" data-action="stmt-reset">Run it again</button>`,
  })}`;
}

/* ---------- router ---------- */

const ROUTES = [
  [/^#\/setup$/, renderSetup, 'Your team'],
  [/^#\/goal$/, renderGoal, 'The destination'],
  [/^#\/team(?:\/(roadmap|human|case))?$/, renderTeam, 'Team twin'],
  [/^#\/role\/([\w-]+)$/, renderRole, 'Role twin'],
  [/^#\/opportunities(?:\/(op\d+))?$/, renderOps, 'Opportunities'],
  [/^#\/plan$/, renderPlan, 'Plan'],
  [/^#\/stations(?:\/([\w-]+))?$/, renderStations, 'Stations'],
  [/^#\/station\/card-sorting(?:\/(intro|sort|done))?$/, renderCardSort, 'Card sorting'],
  [/^#\/station\/ns-game(?:\/(pick|exchange|done))?$/, renderGame, 'Pick the game'],
  [/^#\/station\/ns-statement(?:\/(statement|name|inputs|bets|done))?$/, renderStatement, 'Statement'],
];

let lastHash = null;
function render({keepFocus = false} = {}) {
  const hash = location.hash || '#/goal';
  let found = ROUTES.find(([re]) => re.test(hash));
  if (!found) { location.replace('#/goal'); return; }
  const [re, fn, title] = found;
  const arg = hash.match(re)[1];
  const main = $('#main');
  main.innerHTML = fn(arg) + footer();
  document.title = `${title} · Team reimagine · Noordhaven HR`;
  renderChrome();
  const changed = hash !== lastHash;
  if (changed && lastHash !== null && !keepFocus) {
    window.scrollTo(0, 0);
    main.querySelector('h1')?.focus({preventScroll: true});
  }
  if (changed && hash.startsWith('#/stations/')) document.getElementById(`m-${arg}`)?.scrollIntoView({block: 'center'});
  if (changed && hash.startsWith('#/opportunities/')) document.getElementById(arg)?.scrollIntoView({block: 'start'});
  lastHash = hash;
}

const footer = () => `<footer class="foot"><p>Mockup, direction A: the guided journey. Hours and money come from the flow model for the default Noordhaven HR team and are gross estimates. People, conversations and station progress are invented.</p><button type="button" class="link" data-action="reset">Reset the demo</button></footer>`;

/* ---------- events ---------- */

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-action]');
  if (!t || t.tagName === 'FORM' || t.tagName === 'SELECT' || t.tagName === 'INPUT') return;
  const a = t.dataset.action;
  if (a === 'open-sheet') {
    const sheet = $('#sheet');
    sheet.innerHTML = `<div class="sheet-head"><h2>Your route</h2><button type="button" class="icon-btn" data-action="close-sheet" aria-label="Close">${icon('x')}</button></div>${railHTML()}`;
    sheet.showModal();
    renderChrome();
  } else if (a === 'close-sheet') $('#sheet').close();
  else if (a === 'extract') { state.extract = t.dataset.k; state.extractAdded = false; save(); render({keepFocus: true}); document.querySelector(`[data-k="${t.dataset.k}"]`)?.focus(); }
  else if (a === 'extract-add') { state.extractAdded = true; save(); render({keepFocus: true}); toast('Added to your roster. Names that need a check are flagged.'); }
  else if (a === 'voice') voiceToggle();
  else if (a === 'rm-person') {
    const row = state.roster[Number(t.dataset.row)];
    row.people = row.people.filter((p) => p !== t.dataset.p);
    row.fte = Math.max(0, Math.round((row.fte - 1) * 10) / 10);
    save(); render({keepFocus: true}); toast('Removed from the roster.');
  } else if (a === 'person') { state.person[t.dataset.code] = t.dataset.p; save(); render({keepFocus: true}); document.querySelector(`[data-p="${t.dataset.p}"][role="tab"]`)?.focus(); }
  else if (a === 'op-toggle') {
    state.opOpen = state.opOpen === t.dataset.id ? null : t.dataset.id; save();
    history.replaceState(null, '', state.opOpen ? `#/opportunities/${state.opOpen}` : '#/opportunities');
    lastHash = location.hash; render({keepFocus: true});
    document.querySelector(`[data-action="op-toggle"][data-id="${t.dataset.id}"]`)?.focus({preventScroll: true});
  } else if (a === 'op-all') { state.opAll = true; save(); render({keepFocus: true}); }
  else if (a === 'op-clear') { state.opRole = 'all'; state.opApproach = 'all'; save(); render({keepFocus: true}); }
  else if (a === 'mod-toggle') {
    const id = t.dataset.id;
    const open = !location.hash.endsWith(`/${id}`);
    history.replaceState(null, '', open ? `#/stations/${id}` : '#/stations');
    lastHash = location.hash; render({keepFocus: true});
    document.querySelector(`[data-action="mod-toggle"][data-id="${id}"]`)?.focus({preventScroll: true});
  } else if (a === 'route-toggle') {
    const id = t.dataset.id;
    state.offRoute = state.offRoute.includes(id) ? state.offRoute.filter((x) => x !== id) : [...state.offRoute, id];
    save(); render({keepFocus: true});
    toast(state.offRoute.includes(id) ? `${station(id).name} is off your route.` : `${station(id).name} is back on your route.`);
  } else if (a === 'print') window.print();
  else if (a === 'csv') downloadCsv();
  else if (a === 'share') toast('A read-only link to the plan was sent to the 9 people on your team.');
  else if (a === 'sort-start') { state.sortStarted = true; save(); location.hash = '#/station/card-sorting/sort'; }
  else if (a === 'sort-put') sortPut(t.dataset.pile);
  else if (a === 'sort-undo') {
    const last = state.sortOrder.pop();
    if (last !== undefined) delete state.sort[last];
    save(); render({keepFocus: true}); $('.card')?.focus?.();
  } else if (a === 'sort-finish') { state.sortDone = true; save(); location.hash = '#/station/card-sorting/done'; }
  else if (a === 'sort-reset') { state.sort = {}; state.sortOrder = []; state.sortDone = false; state.sortStarted = true; save(); location.hash = '#/station/card-sorting/sort'; }
  else if (a === 'game-pick') { state.game.pick = t.dataset.id; save(); render({keepFocus: true}); document.querySelector(`[data-action="game-pick"][data-id="${t.dataset.id}"]`)?.focus({preventScroll: true}); }
  else if (a === 'game-votes') { state.game.votes = true; save(); render({keepFocus: true}); toast('7 of 10 voted for the productivity game.'); }
  else if (a === 'game-next') location.hash = '#/station/ns-game/exchange';
  else if (a === 'game-reset') { state.game = defaults().game; save(); location.hash = '#/station/ns-game/pick'; }
  else if (a === 'stmt-pick') {
    const i = Number(t.dataset.i);
    state.stmt.pick = i; state.stmt.text = STATEMENT_CANDIDATES[i].text; save(); render({keepFocus: true});
    document.getElementById('stmt-text')?.focus({preventScroll: true});
  } else if (a === 'stmt-save') { state.stmt.done = true; save(); location.hash = '#/station/ns-statement/done'; }
  else if (a === 'stmt-reset') { state.stmt = defaults().stmt; save(); location.hash = '#/station/ns-statement/statement'; }
  else if (a === 'reset') { localStorage.removeItem(KEY); state = defaults(); location.hash = '#/goal'; render(); toast('Demo reset.'); }
});

document.addEventListener('change', (e) => {
  const t = e.target;
  const a = t.dataset.action;
  if (!a) return;
  if (a === 'op-role') state.opRole = t.value;
  else if (a === 'op-approach') state.opApproach = t.value;
  else if (a === 'op-sort') state.opSort = t.value;
  else if (a === 'role-switch') { location.hash = `#/role/${t.value}`; return; }
  else if (a === 'fte') state.roster[Number(t.dataset.row)].fte = Number(t.value);
  else if (a === 'cost') state.roster[Number(t.dataset.row)].cost = Number(t.value);
  else if (a === 'sys') state.systems[Number(t.dataset.i)].product = t.value.trim() || null;
  else if (a === 'file') { state.extract = 'orgchart'; state.extractAdded = false; toast(`Read "${t.files?.[0]?.name || 'your file'}". This mockup shows the org chart sample.`); }
  else return;
  save();
  const id = t.dataset.action;
  render({keepFocus: true});
  document.querySelector(`[data-action="${id}"]${t.dataset.row ? `[data-row="${t.dataset.row}"]` : ''}${t.dataset.i ? `[data-i="${t.dataset.i}"]` : ''}`)?.focus({preventScroll: true});
});

document.addEventListener('submit', (e) => {
  const ns = e.target.closest('form[data-action="game-agree"], form[data-action="stmt-next"]');
  if (ns) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(ns));
    if (ns.dataset.action === 'game-agree') {
      Object.assign(state.game, d, {done: true});
      if (!state.game.pick) state.game.pick = 'productivity';
      save(); location.hash = '#/station/ns-game/done'; return;
    }
    if ('text' in d && !String(d.text).trim()) { toast('Pick a proposal or write a statement first.'); ns.querySelector('textarea')?.focus(); return; }
    for (const [k, v] of Object.entries(d)) {
      if (k in state.stmt.inputs) state.stmt.inputs[k] = v; else state.stmt[k] = v;
    }
    save(); location.hash = `#/station/ns-statement/${ns.dataset.step}`; return;
  }
  const f = e.target.closest('form[data-action="hand"]');
  if (!f) return;
  e.preventDefault();
  const data = new FormData(f);
  const name = String(data.get('name') || '').trim();
  if (!name) { f.querySelector('[name="name"]').focus(); toast('Type a name first.'); return; }
  const code = String(data.get('code'));
  const fte = Number(data.get('fte') || 1);
  const id = `new-${Date.now()}`;
  PEOPLE.push({id, name, code, fte});
  let row = state.roster.find((r) => r.code === code);
  if (!row) { row = {code, people: [], cost: roleByCode(code).cost, systems: [], source: 'hand', fte: 0}; state.roster.push(row); }
  row.people.push(id);
  row.fte = Math.round((Number(row.fte) + fte) * 10) / 10;
  state.extraPeople = [...(state.extraPeople || []), {id, name, code, fte}];
  save(); render({keepFocus: true});
  toast(`${name} added as ${roleByCode(code).title}.`);
});

document.addEventListener('input', (e) => {
  if (e.target.id === 'stmt-text') { state.stmt.text = e.target.value; save(); }
});

document.addEventListener('keydown', (e) => {
  if (!location.hash.startsWith('#/station/card-sorting')) return;
  if (e.target.matches('input, select, textarea')) return;
  const p = PILES.find((x) => x.key === e.key);
  if (p && $('.card[data-card]')) { e.preventDefault(); sortPut(p.id); }
});

// Drag a card onto a pile.
document.addEventListener('dragstart', (e) => {
  const c = e.target.closest?.('.card[data-card]');
  if (!c) return;
  e.dataTransfer.setData('text/plain', c.dataset.card);
  e.dataTransfer.effectAllowed = 'move';
  c.classList.add('is-drag');
});
document.addEventListener('dragend', (e) => e.target.closest?.('.card')?.classList.remove('is-drag'));
document.addEventListener('dragover', (e) => {
  const p = e.target.closest?.('.pile');
  if (!p) return;
  e.preventDefault();
  document.querySelectorAll('.pile.is-over').forEach((x) => x !== p && x.classList.remove('is-over'));
  p.classList.add('is-over');
});
document.addEventListener('dragleave', (e) => {
  const p = e.target.closest?.('.pile');
  if (p && !p.contains(e.relatedTarget)) p.classList.remove('is-over');
});
document.addEventListener('drop', (e) => {
  const p = e.target.closest?.('.pile');
  if (!p) return;
  e.preventDefault();
  p.classList.remove('is-over');
  sortPut(p.dataset.pile);
});

// The signature: point at a part of the destination and its stations light up, and back.
function lightFor(el) {
  document.querySelectorAll('.is-lit').forEach((x) => x.classList.remove('is-lit'));
  if (!el) return;
  const part = el.closest('[data-part]');
  const j = el.closest('.line [data-j]');
  if (part) {
    const p = PARTS.find((x) => x.id === part.dataset.part);
    part.classList.add('is-lit');
    for (const id of Object.keys(p.weights)) document.querySelectorAll(`.line [data-j="${id}"], .rail [data-j="${id}"]`).forEach((x) => x.classList.add('is-lit'));
  } else if (j) {
    j.classList.add('is-lit');
    for (const p of PARTS) if (p.weights[j.dataset.j]) document.querySelector(`[data-part="${p.id}"]`)?.classList.add('is-lit');
  }
}
document.addEventListener('mouseover', (e) => lightFor(e.target.closest?.('[data-part], .line [data-j]')));
document.addEventListener('focusin', (e) => lightFor(e.target.closest?.('[data-part], .line [data-j]')));

function voiceToggle() {
  if (state.voicePlaying) { clearInterval(voiceToggle.t); state.voicePlaying = false; render({keepFocus: true}); $('.mic')?.focus(); return; }
  state.voicePlaying = true;
  state.voiceStep = 0;
  render({keepFocus: true});
  $('.mic')?.focus();
  voiceToggle.t = setInterval(() => {
    state.voiceStep += 1;
    if (state.voiceStep >= VOICE.length) { clearInterval(voiceToggle.t); state.voicePlaying = false; save(); toast('Heard 10 people in 6 roles. One check left for you.'); }
    render({keepFocus: true});
    const log = $('.transcript');
    if (log) log.scrollTop = log.scrollHeight;
    if (!state.voicePlaying) $('.mic')?.focus();
  }, 1100);
}

/* ---------- boot ---------- */

for (const p of state.extraPeople || []) if (!PEOPLE.some((x) => x.id === p.id)) PEOPLE.push(p);
state.voicePlaying = false;
window.addEventListener('hashchange', () => render());
$('#sheet').addEventListener('click', (e) => {
  if (e.target.closest('a')) $('#sheet').close();
  if (e.target === $('#sheet')) $('#sheet').close();
});
if (!location.hash) history.replaceState(null, '', '#/goal');
render();
document.addEventListener('toggle', (e) => {
  if (e.target.matches?.('.legend-d')) { state.legendClosed = !e.target.open; save(); }
}, true);
