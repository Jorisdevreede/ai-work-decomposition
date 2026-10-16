// The results of the team flow: team twin, role twins, initiatives, opportunities and tasks.
import {portfolioGrid, QUADRANT_LABEL, CALL_LABEL, meanHourlyCost, suggestGoal, runningCalls, COST_LINES, pilotCheck, productionReady, reviseAllowed, enablingWork, timeToFirstValue} from './model.js';
import {esc, fmtInt, fmtHours, fmtWeekHours, fmtEur, fmtFte, fmtPct, fmtTimes, fmtDays, nice, HOURS_PER_FTE, WEEK,
  MEANS, ACTIONS, AMBITION_KIND, actionLabel, humanize, slotRenderer, slotPlain, pairMeter, fillMeter, rungBar, rungLegend} from './ui.js';

const BLOCKER_TEXT = {data: 'systems not named yet', process: 'the work is not defined enough', contained: 'it spans many roles or systems', effort: 'a large build'};
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const TOP = 5;      // initiatives first shown
const CHUNK = 7;    // longest list before "show more"
const TABS = ['team', 'portfolio', 'roles', 'initiatives', 'opportunities', 'tasks'];
const GROSS = '<span class="gross" title="Before build, licence and upkeep costs">gross</span>';
const QUADRANT_KEYS = ['accelerate_now', 'invest_to_unlock', 'quick_wins', 'deprioritize'];
const CALLS = ['start', 'continue', 'edit', 'merge', 'stop'];
const QUADRANT_RULE = {
  accelerate_now: 'First wave. Rank by the chance it works, then by the return. Keep three to five.',
  invest_to_unlock: 'Edit: fix the blocker. Enabling work that unblocks several big prizes belongs in the first wave.',
  quick_wins: 'A lighter check. These hours are not counted toward goal progress. Run them alongside the first wave.',
  deprioritize: 'Stop, or merge when another effort does the same job.',
};
const PRODUCTION_CHECKS = [
  'Value clear',
  'Process understood and measurable',
  'Data accessible',
  'Someone can deploy and support it',
  'Users will take part',
  'The team has capacity to change',
  'A business owner owns the result',
  'Legal controls and guardrails in place',
];
const HR_GOALS = [
  {id: 'ex-hr-questions', text: 'Answer employee HR questions within one working day', pace: 'sooner', limits: ['process'], note: '', example: true},
  {id: 'ex-hr-roles', text: 'Fill open roles faster without adding recruiters', pace: 'sooner', limits: ['people', 'technology'], note: '', example: true},
];
const LIMITS = [['people', 'People'], ['process', 'Process'], ['data', 'Data'], ['technology', 'Technology']];
const PACES = [['bigger', 'Bigger'], ['sooner', 'Sooner'], ['both', 'Both']];
const HOURS_GO = [
  ['more output from the same team', 'More output from the same team'],
  ['faster turnaround', 'Faster turnaround'],
  ['fewer errors', 'Fewer errors'],
  ['growth without new hires', 'Growth without new hires'],
  ['roles not backfilled', 'Roles not backfilled'],
];
const EARLY = [
  'The work got faster, cheaper or better without quality dropping, and the saved time went where you said it would.',
  'People used it in their daily work.',
  'The AI caused the gain.',
  'The cost and benefit assumptions held up.',
];
const PILOT_STATUS = [['idea', 'Idea'], ['pilot', 'Pilot'], ['revise', 'Revise'], ['expand', 'Expand'], ['production', 'In production'], ['stopped', 'Stopped']];
const ACTIVE_STATUS = new Set(['pilot', 'revise', 'expand']);
const STARTED_STATUS = new Set(['pilot', 'revise', 'expand', 'production']);
const GOAL_SCRIPT = `Start with the CEO. Tenex co-founder Arman Hezarkhani opens every diagnostic with the same two questions. First: forget AI for a minute. How do you set goals, and what are they right now? Second: if you had it your way, would you make those goals bigger, or hit them sooner?

For each goal, ask what's slowing progress. If the goal is growing revenue without adding headcount, the limit might be how many accounts each rep can handle. Limits come down to people, process, data or technology.

How to do it:
1. Start with the CEO and the two questions above.
2. Interview the leaders who own each goal. Ask what's slowing it down, and what they're excited and skeptical about with AI.
3. Sort what you hear into people, process, data and technology.`;
const SURVEY_SCRIPT = `1. Send the survey to everyone. People will tell a survey what's broken when they won't tell their boss.
2. Ask which AI tools they use, what for and who pays, plus what's slowing down their week.
3. Follow up with every team running a pilot: who owns it, what it measures and what it has shown so far.`;

export function renderResults({result, slots, mode, fn, tab, role, onState, profile = null, overrides = null, onGrid = null, portfolio = null, onPortfolio = null}) {
  const S = slotRenderer(slots, mode);
  const R = result;
  const iniById = new Map(R.initiatives.map((x, i) => [x.id, {x, rank: i + 1}]));
  const roleById = new Map(R.roles.map(r => [r.id, r]));
  // Hours an initiative returns per task and per role, from its steps.
  const iniTaskHours = new Map();
  const iniRoleHours = new Map();
  for (const x of R.initiatives) {
    const byTask = new Map();
    const byRole = new Map();
    for (const s of x.steps) {
      byTask.set(s.task_id, (byTask.get(s.task_id) ?? 0) + s.hours_returned);
      byRole.set(s.role_id, (byRole.get(s.role_id) ?? 0) + s.hours_returned);
    }
    iniTaskHours.set(x.id, byTask);
    iniRoleHours.set(x.id, byRole);
  }
  let gridOverrides = overrides && typeof overrides === 'object' ? {...overrides} : {};
  const portfolioState = normalizePortfolio(portfolio);
  const view = {tab: TABS.includes(tab) ? tab : 'team', role: roleById.has(role) ? role : R.roles.find(r => r.fte > 0)?.id ?? R.roles[0]?.id,
    iniFilter: 'top', iniOpen: new Set(), iniView: 'list', gridOpen: new Set(), enableOpen: false, runOpen: false,
    pilotOpen: new Set(), readyOpen: new Set(), pilotNotice: null,
    oppScope: 'team', oppAll: false, taskQuery: '', taskRole: '', taskSort: ['baseline_hours', -1], rendered: new Set()};

  function normalizePortfolio(raw) {
    const base = {goals: null, links: {}, running: [], pilots: {}, checks: {}, policy: 'no'};
    if (!raw || typeof raw !== 'object') return base;
    if (Array.isArray(raw.goals)) {
      base.goals = raw.goals.filter(goal => goal && goal.id).slice(0, 3).map(goal => ({
        id: String(goal.id),
        text: String(goal.text || ''),
        pace: PACES.some(([value]) => value === goal.pace) ? goal.pace : 'sooner',
        limits: Array.isArray(goal.limits) ? goal.limits.filter(value => LIMITS.some(([key]) => key === value)) : [],
        note: String(goal.note || ''),
        example: Boolean(goal.example),
      }));
    }
    if (raw.links && typeof raw.links === 'object') {
      for (const [id, goal] of Object.entries(raw.links)) {
        if (typeof goal === 'string' && goal) base.links[id] = goal;
      }
    }
    if (Array.isArray(raw.running)) base.running = raw.running.filter(item => item && item.id).map(item => ({...item}));
    if (raw.pilots && typeof raw.pilots === 'object') base.pilots = {...raw.pilots};
    if (raw.checks && typeof raw.checks === 'object') base.checks = {...raw.checks};
    if (raw.policy === 'yes' || raw.policy === 'partly') base.policy = raw.policy;
    return base;
  }
  const clonePortfolio = () => JSON.parse(JSON.stringify(portfolioState));
  function liveGoals() {
    if (Array.isArray(portfolioState.goals)) return portfolioState.goals.slice(0, 3);
    return fn === 'HR' ? HR_GOALS.map(goal => ({...goal, limits: [...goal.limits]})) : [];
  }
  function ensureGoalList() {
    return liveGoals().map(goal => ({...goal, limits: [...(goal.limits || [])]}));
  }
  function writeGoal(id, mutator) {
    const goals = ensureGoalList();
    const goal = goals.find(item => item.id === id);
    if (!goal) return null;
    goal.example = false;
    mutator(goal);
    portfolioState.goals = goals;
    return goals;
  }
  function mergedOverrides() {
    const ids = new Set(liveGoals().map(goal => goal.id));
    const out = {};
    for (const [id, value] of Object.entries(gridOverrides)) out[id] = {...value};
    for (const [id, goal] of Object.entries(portfolioState.links)) {
      if (goal === 'none' || ids.has(goal)) out[id] = {...(out[id] || {}), goal};
    }
    return out;
  }
  const baseGrid = () => portfolioGrid(R, profile, mergedOverrides(), liveGoals());
  const shownGrid = () => enablingWork(baseGrid(), profile, portfolioState.policy || 'no');
  const hourly = () => meanHourlyCost(R);
  function commitPortfolio(patch, {paint = true} = {}) {
    Object.assign(portfolioState, patch);
    onPortfolio?.(clonePortfolio());
    if (!paint) return;
    if (view.rendered.has('portfolio')) render.portfolio();
    if (view.rendered.has('initiatives')) render.initiatives();
  }
  function tasksFor(x) {
    const ids = new Set((x?.tasks || []).map(task => task.id));
    return R.tasks.filter(task => ids.has(task.id));
  }
  function isoDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  function plusDays(iso, days) {
    const date = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(date.getTime())) return '';
    date.setDate(date.getDate() + days);
    return isoDate(date);
  }
  function daysSince(iso) {
    if (!iso) return null;
    const start = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(start.getTime())) return null;
    const today = new Date();
    const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return Math.floor((midnight - start) / 86400000);
  }
  function inThisQuarter(iso) {
    if (!iso) return false;
    const date = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(date.getTime())) return false;
    const now = new Date();
    return date.getFullYear() === now.getFullYear() && Math.floor(date.getMonth() / 3) === Math.floor(now.getMonth() / 3);
  }
  function savedPilot(id) {
    return portfolioState.pilots[id] || {};
  }
  function displayPilot(id) {
    const saved = savedPilot(id);
    const initiative = iniById.get(id)?.x;
    let costs = saved.costs;
    let costsEstimate = false;
    if (costs == null && initiative) {
      costsEstimate = true;
      const low = Math.round((initiative.effort?.days_low || 0) * 8 * hourly());
      const high = Math.round((initiative.effort?.days_high || 0) * 8 * hourly());
      costs = Object.fromEntries(COST_LINES.map(([key]) => [key, key === 'implementation' ? {low, high} : {low: 0, high: 0}]));
    }
    const measure = saved.measure ?? '';
    const draft = (key, text) => (saved[key] == null ? (measure ? text : '') : saved[key]);
    return {
      owner: saved.owner ?? '',
      measure,
      baseline: saved.baseline ?? '',
      target: saved.target ?? '',
      by: saved.by ?? '',
      learn: saved.learn ?? '',
      costs: costs || {},
      costsEstimate,
      hours_go: saved.hours_go ?? '',
      confirmer: saved.confirmer == null ? 'Finance' : saved.confirmer,
      expand_if: draft('expand_if', `Expand if ${measure} reaches the target.`),
      revise_if: draft('revise_if', `Revise if ${measure} moves but a named fix is still open.`),
      stop_if: draft('stop_if', `Stop if ${measure} does not move.`),
      start: saved.start ?? '',
      review: saved.review ?? '',
      review_touched: Boolean(saved.review_touched),
      status: saved.status || 'idea',
      revise_count: Number(saved.revise_count) || 0,
      stopped_on: saved.stopped_on || '',
      early: Array.isArray(saved.early) ? saved.early.slice(0, 4) : ['unknown', 'unknown', 'unknown', 'unknown'],
    };
  }
  function displayChecks(id) {
    const saved = portfolioState.checks[id];
    if (Array.isArray(saved) && saved.length >= 8) return saved.slice(0, 8);
    const initiative = iniById.get(id)?.x;
    const checks = Array(8).fill('unknown');
    if ((initiative?.value_eur || 0) > 0) checks[0] = 'yes';
    if (profile && typeof profile === 'object') {
      const named = (initiative?.systems || []).every(slot => typeof profile.systems?.[slot] === 'string' && profile.systems[slot].trim());
      checks[2] = named ? 'yes' : 'unknown';
    }
    if (String(savedPilot(id).owner || '').trim()) checks[6] = 'yes';
    return checks;
  }
  function patchPilot(id, patch) {
    portfolioState.pilots = {...portfolioState.pilots, [id]: {...savedPilot(id), ...patch}};
    onPortfolio?.(clonePortfolio());
  }
  function checkRead(card) {
    if (card.checkable) return 'Checkable';
    const missing = card.outcome_missing?.length ? card.outcome_missing.join(', ') : 'measure, baseline, target, date';
    return `Not checkable yet: ${missing}`;
  }
  function earnedRead(check) {
    return check.earned ? 'Start is earned' : `Start is not earned yet: ${check.missing.join(', ')}`;
  }
  function pilotFacts(id, item) {
    const card = displayPilot(id);
    const check = pilotCheck(card, item?.quadrant);
    return {card, check};
  }
  function refreshPilot(id, item) {
    const {check} = pilotFacts(id, item || shownGrid().items.find(row => row.id === id));
    const statusText = checkRead(check);
    const earnedText = earnedRead(check);
    for (const node of document.querySelectorAll(`[data-pilot-status-read="${CSS.escape(id)}"]`)) node.textContent = statusText;
    for (const node of document.querySelectorAll(`[data-earned-for="${CSS.escape(id)}"]`)) node.textContent = earnedText;
    const card = displayPilot(id);
    const warn = document.querySelector(`[data-hours-warn="${CSS.escape(id)}"]`);
    if (warn) warn.hidden = Boolean(String(card.hours_go || '').trim() && String(card.confirmer || '').trim());
    const annual = document.querySelector(`[data-annualise="${CSS.escape(id)}"]`);
    if (annual) {
      const elapsed = daysSince(card.start);
      annual.hidden = !(card.start && elapsed != null && elapsed < 91);
    }
  }
  function runningView() {
    return runningCalls(portfolioState.running, liveGoals(), {values: R.initiatives.map(item => item.value_eur), meanHourly: hourly()});
  }
  function goalChoices(current) {
    const goals = liveGoals();
    const options = [`<option value="">Not set</option>`]
      .concat(goals.map((goal, index) => `<option value="${esc(goal.id)}"${current === goal.id ? ' selected' : ''}>${esc(goal.text || `Goal ${index + 1}`)}</option>`))
      .concat(`<option value="none"${current === 'none' ? ' selected' : ''}>None</option>`);
    return options.join('');
  }
  function timeLabel(item) {
    const time = timeToFirstValue(item);
    return `<span class="grid-time" title="Rough, from the article">${esc(time.label)}. Rough, from the article.</span>`;
  }

  /* ---------------------------------------------------------------- shared bits */
  const perWeek = (hours, fte) => (fte > 0 ? (hours / fte / HOURS_PER_FTE) * WEEK : 0);
  const sysName = id => S(R.systems.find(s => s.id === id)?.product || `${slots.slots[id]?.label ?? id} [not supplied]`);
  const slotLabel = id => slots.slots[id]?.label ?? id;
  const flowsOf = x => (x.flows?.length ? x.flows : x.workflow ? [x.workflow] : []);
  function flowText(x) {
    const f = flowsOf(x).map(humanize);
    if (f.length <= 2) return f.join(' and ');
    return `${f[0]}, ${f[1]} and ${f.length - 2} more ${f.length === 3 ? 'flow' : 'flows'}`;
  }
  // Under a name: the kind of change, the system slot when the name shows a product, and the flows it serves.
  function iniMeta(x) {
    const filled = x.main_system && R.systems.find(s => s.id === x.main_system)?.filled;
    return [actionLabel(x.action_type), filled ? slotLabel(x.main_system) : '', flowText(x)].filter(Boolean).map(esc).join(' · ');
  }
  const iniLink = (x, label) => `<button class="link-ini" type="button" data-ini="${esc(x.id)}">${label ?? S(x.name)}</button>`;
  const moreButton = (n, what, attr) => `<button class="btn-text more-btn" type="button" ${attr}>Show ${n} more ${what}</button>`;
  function textList(items, render, {cls = 'plain-list', what = 'items', limit = CHUNK} = {}) {
    if (!items.length) return '<p class="small muted">None in the task graphs.</p>';
    const id = `l${Math.random().toString(36).slice(2, 8)}`;
    const head = items.slice(0, limit).map(render).join('');
    const rest = items.slice(limit).map(render).join('');
    return `<ul class="${cls}" id="${id}">${head}</ul>${rest ? `<template data-for="${id}">${rest}</template>${moreButton(items.length - limit, what, `data-more="${id}"`)}` : ''}`;
  }
  const uniq = arr => [...new Set(arr.map(s => (typeof s === 'string' ? s.trim() : s)).filter(Boolean))];
  const means = g => Object.entries(g ?? {}).filter(([, v]) => v.baseline_hours > 0.01).sort((a, b) => b[1].baseline_hours - a[1].baseline_hours);

  /* ---------------------------------------------------------------- team twin */
  function teamPanel() {
    const T = R.team;
    const bc = R.business_case;
    const y1 = bc.years[0];
    const ambitions = [];
    const seen = new Set();
    for (const t of R.opportunities) {
      const a = t.ambition;
      if (!a || !a.what || a.kind === 'none' || seen.has(a.what)) continue;
      seen.add(a.what);
      ambitions.push({a, t});
    }
    const effortLow = R.initiatives.reduce((s, x) => s + x.effort.days_low, 0);
    const effortHigh = R.initiatives.reduce((s, x) => s + x.effort.days_high, 0);
    const q1 = R.initiatives.filter(x => x.quarter === 'Q1');
    const maxMeans = Math.max(...means(T.by_means).map(([, v]) => v.baseline_hours), 1);
    const maxRole = Math.max(...R.roles.map(r => r.baseline_hours), 1);

    return `
    <section class="section hero" aria-labelledby="hero-line">
      <div>
        <p class="hero-line" id="hero-line">Your ${esc(fn)} team could get back <span class="hero-num">about ${fmtFte(T.fte_returned)} FTE</span> of its working time.</p>
        <p class="hero-text">That is about ${fmtHours(T.hours_returned)} a year, ${fmtPct(T.time_saved_pct)} of today’s ${fmtInt(T.baseline_hours)} hours, worth about ${fmtEur(T.value_eur)} a year at your hourly costs ${GROSS}. It comes back step by step as the changes are built and used: about ${fmtFte(y1.fte_returned)} FTE in year one.</p>
      </div>
      <div class="hero-viz" aria-label="The team's year in hours">
        <p class="subhead">The team’s year, in hours</p>
        <p class="xs muted wb-cap">Today</p>
        <div class="weekbar"><span class="wb-today" style="flex:1">${fmtInt(nice(T.baseline_hours))} h</span></div>
        <p class="xs muted wb-cap">With the changes in use</p>
        <div class="weekbar"><span class="wb-work" style="flex:${T.remaining_hours.toFixed(1)}" title="Work that stays">${fmtInt(nice(T.remaining_hours))} h</span><span class="wb-back" style="flex:${T.hours_returned.toFixed(1)}" title="Time returned">${fmtInt(nice(T.hours_returned))} h back</span></div>
      </div>
    </section>
    <aside class="isnot" aria-labelledby="isnot-title">
      <h3 id="isnot-title">What this is, and what it is not</h3>
      <p><strong>It is</strong> a first estimate from generic, O*NET-based task graphs for these roles, at 1,600 hours per FTE and the hourly costs you entered.</p>
      <p><strong>It is not</strong> measured in your team, a headcount target or a cash saving. Values are gross: build, licence and upkeep costs are not in them. Confirm with the people who do the work.</p>
    </aside>

    <section class="section" aria-labelledby="t-week">
      <h2 class="section-title" id="t-week">Where the hours go, today and with the changes</h2>
      <p class="section-lede">The team’s hours a year by how the work is done. Screen work, documents and mail shrink most; meetings and time in person mostly stay.</p>
      <ul class="means means-wide">${means(T.by_means).map(([k, v]) => `<li><span class="m-label">${esc(MEANS[k] ?? humanize(k))}</span>${pairMeter(v.baseline_hours, v.remaining_hours, maxMeans, `${MEANS[k] ?? k}: ${fmtInt(v.baseline_hours)} hours today, ${fmtInt(v.remaining_hours)} with the changes`)}<span class="m-val">${fmtInt(nice(v.baseline_hours))} → ${fmtInt(nice(v.remaining_hours))} h</span></li>`).join('')}</ul>
      <ul class="legend"><li><span class="sw sw-today"></span>Today</li><li><span class="sw sw-after"></span>With the changes</li><li>The grey that is left is time back</li></ul>
    </section>

    <section class="section" aria-labelledby="t-amb">
      <h2 class="section-title" id="t-amb">What the team could take on with that time</h2>
      <p class="section-lede">Ideas from the task graphs for work that is out of reach today. Choose one or two; the time does not spend itself.</p>
      ${textList(ambitions, ({a, t}) => `<li><span class="tag tag-secondary">${esc(AMBITION_KIND[a.kind] ?? humanize(a.kind))}</span><p>${S(a.what)}</p><span class="who">From “${S(t.short)}” · ${esc(t.role_title)}</span></li>`, {cls: 'ambitions', what: 'ideas', limit: 6})}
    </section>

    <section class="section" aria-labelledby="t-roles">
      <h2 class="section-title" id="t-roles">How each role shifts</h2>
      <p class="section-lede">Hours a year per role. Open a role to see its own twin.</p>
      <div class="table-scroll"><table class="shift">
        <thead><tr><th scope="col">Role</th><th scope="col" class="num">Today</th><th scope="col" class="num">With the changes</th><th scope="col" class="num">Back</th><th scope="col" class="bar-cell"><span class="sr-only">Before and after</span></th></tr></thead>
        <tbody>${R.roles.map(r => `<tr>
          <th scope="row"><button class="role-link" type="button" data-role="${esc(r.id)}">${esc(r.title)}</button><span class="sub">${fmtFte(r.fte)} FTE · €${fmtInt(r.cost_per_hour)} an hour</span></th>
          <td class="num">${fmtInt(nice(r.baseline_hours))} h</td><td class="num">${fmtInt(nice(r.remaining_hours))} h</td>
          <td class="num">${fmtPct(r.time_saved_pct)}</td>
          <td class="bar-cell">${pairMeter(r.baseline_hours, r.remaining_hours, maxRole, `${r.title}: ${fmtInt(r.baseline_hours)} hours today, ${fmtInt(r.remaining_hours)} with the changes`)}</td></tr>`).join('')}</tbody>
      </table></div>
    </section>

    <section class="section" aria-labelledby="t-road">
      <h2 class="section-title" id="t-road">What to build, quarter by quarter</h2>
      <p class="section-lede">${R.initiatives.length} initiatives, ranked by value per day of effort. The top ${q1.length} go first. A suggested order, not a delivery promise.</p>
      <div class="roadmap">${['Q1', 'Q2', 'Q3', 'Q4'].map(q => {
        const list = R.initiatives.filter(x => x.quarter === q);
        const hours = list.reduce((s, x) => s + x.hours_returned, 0);
        return `<div class="quarter"><h3>${q}<span>${list.length} · ${fmtHours(hours)}</span></h3>
          <ol>${list.slice(0, 5).map(x => `<li><button type="button" data-ini="${esc(x.id)}"><span class="q-name">${S(x.name)}</span><span class="q-hours">${fmtHours(x.hours_returned)} a year · effort ${esc(x.effort.band)}</span></button></li>`).join('')}</ol>
          ${list.length > 5 ? `<p class="q-more">and ${list.length - 5} more</p>` : list.length ? '' : '<p class="q-more">Nothing planned</p>'}</div>`;
      }).join('')}</div>
    </section>

    <section class="section" aria-labelledby="t-case">
      <h2 class="section-title" id="t-case">The business case</h2>
      <p class="section-lede">Capacity returned as people adopt the changes: half in year one, 80% in year two, all of it in year three. The ramp is about adoption; the estimate of what is possible stays the same.</p>
      ${caseBlock(bc, `${R.initiatives.length} initiatives`, effortLow, effortHigh)}
      <p class="ceiling">${ceiling(T, 'today’s team work')}</p>
    </section>`;
  }

  function caseBlock(bc, scope, effortLow, effortHigh) {
    const max = Math.max(...bc.years.map(y => y.value_eur), 1);
    return `<div class="case">
      <div>
        <div class="ramp" role="img" aria-label="${esc(bc.years.map(y => `Year ${y.year} at ${y.adoption_pct}% adoption: ${fmtEur(y.value_eur)}`).join('; '))}">
          ${bc.years.map(y => `<div class="ramp-col"><span class="ramp-val">${fmtEur(y.value_eur)}</span><span class="ramp-bar" style="height:${((y.value_eur / max) * 78).toFixed(1)}%"></span></div>`).join('')}
        </div>
        <div class="ramp-labels">${bc.years.map(y => `<span><strong>Year ${y.year}</strong>${y.adoption_pct}% adoption · ${fmtFte(y.fte_returned)} FTE</span>`).join('')}</div>
      </div>
      <div>
        <dl class="case-facts">
          <div><dt>Hours back a year, fully adopted</dt><dd>${fmtHours(bc.annual_hours)}</dd></div>
          <div><dt>Capacity, fully adopted</dt><dd>${fmtFte(bc.annual_fte)} FTE</dd></div>
          <div><dt>Value a year, fully adopted ${GROSS}</dt><dd>${fmtEur(bc.annual_value_eur)}</dd></div>
          <div><dt>Three years together ${GROSS}</dt><dd>${fmtEur(bc.three_year_value_eur)}</dd></div>
          ${effortLow != null ? `<div><dt>Effort to build ${esc(scope)}</dt><dd>${fmtInt(effortLow)}–${fmtInt(effortHigh)} days</dd></div>` : ''}
        </dl>
        <p class="case-note">${esc(bc.label)} Effort is a planning band per kind of change (S about 5 days, M about 15, L about 30), not a quote.</p>
      </div>
    </div>`;
  }

  function ceiling(x, what) {
    const kept = x.baseline_hours > 0 ? (x.remaining_hours / x.baseline_hours) * 100 : 100;
    const theo = x.theoretical_ceiling;
    const human = (x.human_only_share ?? 0) * 100;
    return `<strong>The ceiling.</strong> With the changes as designed, ${what} takes ${fmtPct(kept)} of the time it takes now, ${fmtTimes(x.speedup)} as fast. ${theo == null
      ? 'No step is marked as work only people can do, so the task graphs set no fixed limit.'
      : `Even if every step a machine can do took no time at all, the limit is ${fmtTimes(theo)}, because ${fmtPct(human)} of the hours are work only people do.`}`;
  }

  /* ---------------------------------------------------------------- role twin */
  function roleTwin(r, {headingLevel = 2} = {}) {
    const h = headingLevel;
    const tw = r.twin ?? {};
    if (!(r.fte > 0)) {
      return `<div class="twin-head"><h${h}>${esc(r.title)}</h${h}><p class="twin-lede">This role has 0 FTE, so there are no hours to change. Set the number of people under Roles to see its twin.</p></div>`;
    }
    const week = perWeek(r.hours_returned, r.fte);
    const keptWeek = WEEK - week;
    const m = means(r.by_means);
    const maxM = Math.max(...m.map(([, v]) => perWeek(v.baseline_hours, r.fte)), 1);
    const myInis = r.initiative_ids.map(id => iniById.get(id)).filter(Boolean).sort((a, b) => a.rank - b.rank);
    const reach = uniq(tw.reach ?? []).map(x => (typeof x === 'string' ? {text: x} : {text: `${x.role ? `${x.role}: ` : ''}${x.task ?? ''}`, learn: x.learn}));
    const altitude = uniq(tw.altitude ?? []);
    return `
    <div class="twin-head">
      <h${h}>${esc(r.title)}</h${h}>
      <p class="meta">${fmtFte(r.fte)} FTE · €${fmtInt(r.cost_per_hour)} an hour · ${fmtInt(r.tasks.length)} tasks · ${esc(r.code)}</p>
      <p class="twin-lede">Each person in this role gets back about <strong>${fmtWeekHours(week)} a week</strong> (${fmtPct(r.time_saved_pct)} of the work), once the changes are in use. For the role that is ${fmtHours(r.hours_returned)} a year, worth about ${fmtEur(r.value_eur)} ${GROSS}.</p>
    </div>
    <div class="twin-compare compare">
      <div class="compare-col">
        <h${h + 1}>Your role today</h${h + 1}>
        <p class="compare-sum">A ${WEEK}-hour week, by how the work is done.</p>
        <div class="weekbar"><span class="wb-today" style="flex:1">${WEEK} h</span></div>
        <ul class="means">${m.map(([k, v]) => { const t = perWeek(v.baseline_hours, r.fte); return `<li><span class="m-label">${esc(MEANS[k] ?? humanize(k))}</span>${pairMeter(t, 0, maxM, `${MEANS[k] ?? k}: ${fmtWeekHours(t)} a week today`)}<span class="m-val">${fmtWeekHours(t)}</span></li>`; }).join('')}</ul>
      </div>
      <div class="compare-col">
        <h${h + 1}>Your role with AI</h${h + 1}>
        <p class="compare-sum">The same work after the changes; the gold part is yours to spend.</p>
        <div class="weekbar"><span class="wb-work" style="flex:${keptWeek.toFixed(2)}" title="Work that stays">${fmtWeekHours(keptWeek)}</span><span class="wb-back" style="flex:${week.toFixed(2)}" title="Time back">${fmtWeekHours(week)} back</span></div>
        <ul class="means">${m.map(([k, v]) => { const t = perWeek(v.baseline_hours, r.fte); const a = perWeek(v.remaining_hours, r.fte); return `<li><span class="m-label">${esc(MEANS[k] ?? humanize(k))}</span>${pairMeter(t, a, maxM, `${MEANS[k] ?? k}: ${fmtWeekHours(t)} today, ${fmtWeekHours(a)} with AI`)}<span class="m-val">${fmtWeekHours(a)}</span></li>`; }).join('')}</ul>
      </div>
    </div>

    <section class="section twin-block">
      <h${h + 1} class="section-title">Where the drudgery goes</h${h + 1}>
      <p class="section-lede">The three tasks that give the most time back, and how.</p>
      <ol class="changes">${(tw.drudgery ?? []).map(d => `<li><h${h + 2}>${S(d.short)}</h${h + 2}><span class="num">${fmtWeekHours(perWeek(d.hours_returned, r.fte))} a week back</span><p>${S(d.design)}</p></li>`).join('')}</ol>
    </section>

    <section class="section twin-block cols-2">
      <div>
        <h${h + 1} class="section-title">What you get to do more of</h${h + 1}>
        ${altitude[0] ? `<p class="twin-altitude">${S(altitude[0])}</p>` : ''}
        ${textList(uniq(tw.ambitions ?? []), t => `<li>${S(t)}</li>`, {what: 'ideas', limit: 3})}
      </div>
      <div>
        <h${h + 1} class="section-title">What stays yours</h${h + 1}>
        <p class="section-lede">The human part of the work. The plan keeps it with people on purpose.</p>
        ${textList(uniq(tw.human_edge ?? []), t => `<li>${S(t)}</li>`, {what: 'more', limit: 4})}
      </div>
    </section>

    <section class="section twin-block cols-2">
      <div>
        <h${h + 1} class="section-title">Skills to grow</h${h + 1}>
        ${textList(uniq(tw.skills_to_grow ?? []), t => `<li>${S(t)}</li>`, {what: 'skills', limit: 5})}
      </div>
      <div>
        <h${h + 1} class="section-title">Work you could reach</h${h + 1}>
        <p class="section-lede">Work from neighbouring roles that comes within reach.</p>
        ${textList(reach, x => `<li>${S(x.text)}${x.learn ? `<span class="who">Learn: ${S(x.learn)}</span>` : ''}</li>`, {what: 'more', limit: 3})}
      </div>
    </section>

    <section class="section twin-block">
      <h${h + 1} class="section-title">The initiatives that change this role</h${h + 1}>
      <p class="section-lede">${myInis.length} initiatives touch this role. Hours are what each returns to this role a year.</p>
      ${textList(myInis, ({x, rank}) => `<li><span class="ini-rank">${rank}</span><span>${iniLink(x)}<span class="who">${iniMeta(x)} · ${x.quarter}</span></span><span class="num">${fmtHours(iniRoleHours.get(x.id)?.get(r.id) ?? 0)}</span></li>`, {cls: 'role-inis', what: 'initiatives', limit: TOP})}
    </section>

    <section class="section twin-block">
      <h${h + 1} class="section-title">The business case for this role</h${h + 1}>
      ${caseBlock(r.business_case, 'these initiatives', null, null)}
      <p class="ceiling">${ceiling(r, 'this role’s work')}</p>
    </section>`;
  }

  function rolesPanel() {
    const r = roleById.get(view.role);
    return `<div class="role-switch" role="group" aria-label="Choose a role">${R.roles.map(x => `<button type="button" data-pick-role="${esc(x.id)}" aria-pressed="${x.id === view.role}">${esc(x.title)}<span class="rs-meta">${fmtFte(x.fte)} FTE · ${fmtPct(x.time_saved_pct)} back</span></button>`).join('')}</div>
      <label class="sr-only" for="role-select">Choose a role</label>
      <select class="select role-select" id="role-select">${R.roles.map(x => `<option value="${esc(x.id)}"${x.id === view.role ? ' selected' : ''}>${esc(x.title)} (${fmtFte(x.fte)} FTE)</option>`).join('')}</select>
      <div class="role-twin">${r ? roleTwin(r) : '<p class="muted">No roles.</p>'}</div>`;
  }

  /* ---------------------------------------------------------------- initiatives */
  function iniCard(x, rank, top, item) {
    const tasks = [...iniTaskHours.get(x.id)].sort((a, b) => b[1] - a[1]);
    const taskInfo = new Map(x.tasks.map(t => [t.id, t]));
    const roleTitles = x.roles.map(r => r.title);
    const steps = [...x.steps].sort((a, b) => b.hours_returned - a.hours_returned);
    return `<li class="ini${top ? ' is-top' : ''}" data-ini-card="${esc(x.id)}">
      <div class="ini-top">
        <span class="ini-rank" aria-label="Rank ${rank}">${rank}</span>
        <div>
          ${top ? '<span class="start-here">Start here: the most value for the least effort</span>' : ''}
          <h3 class="ini-name">${S(x.name)}</h3>
          <span class="ini-flow">${iniMeta(x)}</span>
          <div class="ini-tags"><span class="tag">${x.quarter}</span><span class="tag tag-secondary">effort ${esc(x.effort.band)}: ${fmtDays(x.effort)}</span></div>
          ${item ? `<div class="grid-row-controls">${goalSelect(item, plainIni(x.id))}</div>` : ''}
        </div>
        <dl class="ini-figs">
          <div><dt>Hours back a year</dt><dd>${fmtHours(x.hours_returned)}</dd></div>
          <div><dt>Value a year ${GROSS}</dt><dd>${fmtEur(x.value_eur)}</dd></div>
        </dl>
        <div class="ini-why">
          <strong>Changes ${x.tasks.length} ${x.tasks.length === 1 ? 'task' : 'tasks'} in ${roleTitles.length} ${roleTitles.length === 1 ? 'role' : 'roles'}</strong>
          <ul>${tasks.slice(0, 3).map(([id, hrs]) => { const t = taskInfo.get(id); return `<li><span>${S(t?.short ?? id)} <span class="who">· ${esc(roleById.get(t?.role_id)?.title ?? '')}</span></span><span class="num">${fmtHours(hrs)}</span></li>`; }).join('')}</ul>
          ${tasks.length > 3 ? `<span class="who">and ${tasks.length - 3} more ${tasks.length - 3 === 1 ? 'task' : 'tasks'}</span>` : ''}
        </div>
      </div>
      <details>
        <summary>Steps, roles and business case</summary>
        <div class="ini-detail">
          <div class="table-scroll"><table class="steps-table">
            <thead><tr><th scope="col">Step it changes</th><th scope="col">Role</th><th scope="col">Today by</th><th scope="col" class="num">Hours today → after</th></tr></thead>
            <tbody>${steps.slice(0, 12).map(s => `<tr><td>${S(s.what)}</td><td>${esc(roleById.get(s.role_id)?.title ?? s.role_title)}</td><td>${esc(MEANS[s.today_means] ?? humanize(s.today_means))}</td><td class="num">${fmtInt(Math.round(s.baseline_hours))} → ${fmtInt(Math.round(s.remaining_hours))}</td></tr>`).join('')}</tbody>
          </table></div>
          ${steps.length > 12 ? `<p class="xs muted">and ${steps.length - 12} smaller steps; all ${steps.length} are in the JSON download.</p>` : ''}
          <p class="small"><strong>Roles:</strong> ${roleTitles.map(esc).join(', ')}</p>
          <p class="small"><strong>Systems:</strong> ${x.systems.map(sysName).join(', ')}</p>
          ${flowsOf(x).length ? `<p class="small"><strong>Flows:</strong> ${flowsOf(x).map(f => esc(humanize(f))).join(', ')}</p>` : ''}
          <dl class="mini-ramp">${x.business_case.years.map(y => `<div><dt>Year ${y.year} (${y.adoption_pct}% adoption)</dt><dd>${fmtEur(y.value_eur)}</dd></div>`).join('')}</dl>
        </div>
      </details>
      ${pilotFold(x, item)}
      ${readyFold(x)}
    </li>`;
  }
  function plainIni(id) {
    return slotPlain(iniById.get(id)?.x.name ?? id);
  }
  function goalSelect(item, name) {
    const current = portfolioState.links[item.id] || '';
    const initiative = iniById.get(item.id)?.x;
    const suggestion = initiative && item.goal_link === 'unset'
      ? suggestGoal({name: plainIni(item.id), tasks: initiative.tasks}, tasksFor(initiative), liveGoals())
      : null;
    const suggest = suggestion
      ? `<button class="btn-text" type="button" data-goal-accept="${esc(item.id)}" data-accept-goal="${esc(suggestion.id)}">Suggested: ${esc(suggestion.text)}</button>`
      : '';
    const note = item.goal_note ? `<span class="goal-flag">${esc(item.goal_note)}</span>` : '';
    const {check} = pilotFacts(item.id, item);
    return `<label class="grid-field">Moves which goal?<select class="select" data-goal-link="${esc(item.id)}" aria-label="Moves which goal? ${esc(name)}">${goalChoices(current)}</select></label>${suggest}${note}<span class="earned" data-earned-for="${esc(item.id)}">${esc(earnedRead(check))}</span>${timeLabel(item)}`;
  }
  function pilotFold(x, item) {
    const {card, check} = pilotFacts(x.id, item);
    const notice = view.pilotNotice?.id === x.id ? `<p class="port-warn" role="alert">${esc(view.pilotNotice.text)}</p>` : '';
    const elapsed = daysSince(card.start);
    const hoursSet = String(card.hours_go || '').trim() && String(card.confirmer || '').trim();
    const costs = COST_LINES.map(([key, label]) => {
      const line = card.costs[key] || {};
      return `<label class="field">${esc(label)}, low<input class="input" data-pilot-cost="${esc(x.id)}" data-cost-key="${key}" data-cost-side="low" inputmode="decimal" value="${esc(line.low ?? '')}" aria-label="${esc(label)} low"></label>
        <label class="field">${esc(label)}, high<input class="input" data-pilot-cost="${esc(x.id)}" data-cost-key="${key}" data-cost-side="high" inputmode="decimal" value="${esc(line.high ?? '')}" aria-label="${esc(label)} high"></label>`;
    }).join('');
    const early = card.status === 'idea' ? '' : `<div class="wide"><p class="label">Early evidence</p>${EARLY.map((text, index) => `<label class="check-row"><span>${esc(text)}</span><select class="select" data-early="${esc(x.id)}" data-early-i="${index}">${['yes', 'no', 'unknown'].map(value => `<option value="${value}"${(card.early[index] || 'unknown') === value ? ' selected' : ''}>${value === 'yes' ? 'Yes' : value === 'no' ? 'No' : 'Unknown'}</option>`).join('')}</select></label>`).join('')}</div>`;
    return `<details class="pilot-fold"${view.pilotOpen.has(x.id) ? ' open' : ''}>
      <summary>Pilot card · <span data-pilot-status-read="${esc(x.id)}">${esc(checkRead(check))}</span></summary>
      <div class="pilot-card" data-pilot="${esc(x.id)}">
        <p data-earned-for="${esc(x.id)}">${esc(earnedRead(check))}</p>
        <div class="pilot-grid">
          <label class="field wide">Owner<input class="input" data-pilot-owner="${esc(x.id)}" value="${esc(card.owner)}" autocomplete="name"></label>
          <p class="wide small">Improve the measure from the baseline to the target by the date.</p>
          <label class="field">Measure<input class="input" data-pilot-measure="${esc(x.id)}" value="${esc(card.measure)}"></label>
          <label class="field">From<input class="input" data-pilot-baseline="${esc(x.id)}" inputmode="decimal" value="${esc(card.baseline)}"></label>
          <label class="field">To<input class="input" data-pilot-target="${esc(x.id)}" inputmode="decimal" value="${esc(card.target)}"></label>
          <label class="field">By<input class="input" type="date" data-pilot-by="${esc(x.id)}" value="${esc(card.by)}"></label>
          <label class="field wide">What must the pilot learn?<input class="input" data-pilot-learn="${esc(x.id)}" value="${esc(card.learn)}"><span class="xs muted">Return on learning.</span></label>
          <div class="wide"><p class="label">Cost range, EUR</p>${card.costsEstimate ? '<p class="xs muted">Starting estimate, edit.</p>' : ''}<div class="pilot-grid">${costs}</div></div>
          <label class="field">Where the hours go<select class="select" data-pilot-hours="${esc(x.id)}"><option value="">Not set</option>${HOURS_GO.map(([value, label]) => `<option value="${esc(value)}"${card.hours_go === value ? ' selected' : ''}>${esc(label)}</option>`).join('')}</select></label>
          <label class="field">Who confirms it<input class="input" data-pilot-confirmer="${esc(x.id)}" value="${esc(card.confirmer)}"></label>
          <p class="port-warn wide" data-hours-warn="${esc(x.id)}"${hoursSet ? ' hidden' : ''}>Gross time saved is not realised savings.</p>
          <label class="field wide">Expand if<input class="input" data-pilot-expand="${esc(x.id)}" value="${esc(card.expand_if)}"></label>
          <label class="field wide">Revise if<input class="input" data-pilot-revise="${esc(x.id)}" value="${esc(card.revise_if)}"></label>
          <label class="field wide">Stop if<input class="input" data-pilot-stop="${esc(x.id)}" value="${esc(card.stop_if)}"></label>
          <label class="field">Start date<input class="input" type="date" data-pilot-start="${esc(x.id)}" value="${esc(card.start)}"></label>
          <label class="field">Review date<input class="input" type="date" data-pilot-review="${esc(x.id)}" value="${esc(card.review)}"></label>
          <p class="xs muted wide">Checkpoints at 30, 60 and 90 days. Arman calls the alternative "pilot purgatory," so set the end date up front.</p>
          <p class="port-warn wide" data-annualise="${esc(x.id)}"${card.start && elapsed != null && elapsed < 91 ? '' : ' hidden'}>Do not annualise yet.</p>
          <label class="field">Status<select class="select" data-pilot-status="${esc(x.id)}">${PILOT_STATUS.map(([value, label]) => `<option value="${value}"${card.status === value ? ' selected' : ''}>${label}</option>`).join('')}</select></label>
          ${card.status === 'stopped' && card.stopped_on ? `<p class="small wide">Stopped on ${esc(card.stopped_on)}.</p>` : ''}
          ${notice}
          ${early}
        </div>
      </div>
    </details>`;
  }
  function readyFold(x) {
    const checks = displayChecks(x.id);
    const choice = value => ['yes', 'no', 'unknown'].map(option => `<option value="${option}"${value === option ? ' selected' : ''}>${option === 'yes' ? 'Yes' : option === 'no' ? 'No' : 'Unknown'}</option>`).join('');
    return `<details class="ready-card"${view.readyOpen.has(x.id) ? ' open' : ''}>
      <summary>Readiness before production</summary>
      ${checks.map((value, index) => `<label class="check-row"><span>${esc(PRODUCTION_CHECKS[index])}</span><select class="select" data-check="${esc(x.id)}" data-check-i="${index}">${choice(value)}</select></label>`).join('')}
    </details>`;
  }
  function callSelect(item, name) {
    const options = CALLS.map(call => `<option value="${call}"${item.call === call ? ' selected' : ''}>${CALL_LABEL[call]}</option>`).join('');
    return `<label class="grid-field">Call<select class="select" data-grid-call="${esc(item.id)}" aria-label="Call for ${esc(name)}">${options}</select></label>`;
  }
  function ownerSelect(item, name) {
    const current = item.owner_wants === true ? 'yes' : item.owner_wants === false ? 'no' : 'unknown';
    const options = [['unknown', 'Unknown'], ['yes', 'Yes'], ['no', 'No']]
      .map(([value, label]) => `<option value="${value}"${current === value ? ' selected' : ''}>${label}</option>`).join('');
    return `<label class="grid-field">Owner wants it?<select class="select" data-grid-owner="${esc(item.id)}" aria-label="Owner wants it? ${esc(name)}">${options}</select></label>`;
  }
  function gridRow(item) {
    const name = plainIni(item.id);
    const wave = item.first_wave ? '<span class="wave-tag">First wave</span>' : '';
    const blocker = item.quadrant === 'invest_to_unlock' ? `<span class="grid-blocker">Blocked by: ${esc(BLOCKER_TEXT[item.blocker] || item.blocker)}</span>` : '';
    return `<li class="grid-row">
      <div class="grid-row-name"><button class="link-ini" type="button" data-ini="${esc(item.id)}">${esc(name)}</button>${wave}</div>
      <div class="grid-row-controls">${callSelect(item, name)}${blocker}${ownerSelect(item, name)}${goalSelect(item, name)}<span class="grid-value">${fmtEur(item.value_eur)} a year ${GROSS}</span></div>
    </li>`;
  }
  function quadrantSection(key, rows) {
    const open = view.gridOpen.has(key);
    const shown = open ? rows : rows.slice(0, CHUNK);
    const hours = key === 'quick_wins' && rows.length
      ? `<p class="grid-rule">${fmtHours(rows.reduce((sum, item) => sum + (item.hours_returned || 0), 0))} a year, not counted toward goal progress.</p>` : '';
    const body = rows.length
      ? `<ol class="grid-rows">${shown.map(gridRow).join('')}</ol>${rows.length > shown.length ? `<button class="btn-text more-btn" type="button" data-grid-more="${key}">Show all</button>` : ''}`
      : '<p class="muted">None.</p>';
    return `<section class="grid-quad" aria-labelledby="quad-${key}">
      <h3 id="quad-${key}" tabindex="-1">${esc(QUADRANT_LABEL[key])}<span>${rows.length}</span></h3>
      <p class="grid-rule">${esc(QUADRANT_RULE[key])}</p>
      ${hours}${body}
    </section>`;
  }
  function gridDots(items) {
    const maxValue = Math.max(1, ...items.map(item => item.value_eur || 0));
    return [...items].sort((a, b) => (b.value_eur || 0) - (a.value_eur || 0) || a.id.localeCompare(b.id)).map(item => {
      const name = plainIni(item.id);
      const size = Math.round(12 + Math.sqrt(Math.max(0, item.value_eur || 0) / maxValue) * 30);
      const left = (6 + (item.readiness / 100) * 88).toFixed(2);
      const top = (6 + ((100 - item.prize) / 100) * 88).toFixed(2);
      const label = `${name}. ${QUADRANT_LABEL[item.quadrant]}. Readiness ${Math.round(item.readiness)}. Prize ${Math.round(item.prize)}.`;
      return `<button class="grid-dot q-${item.quadrant}" type="button" data-ini="${esc(item.id)}" aria-label="${esc(label)}" data-flip-x="${item.readiness >= 50 ? 'left' : 'right'}" data-flip-y="${item.prize >= 50 ? 'down' : 'up'}" style="left:${left}%;top:${top}%;width:${size}px;height:${size}px"><span class="grid-tip" aria-hidden="true"><strong>${esc(name)}</strong><span>${esc(QUADRANT_LABEL[item.quadrant])}</span><span>Readiness ${Math.round(item.readiness)} · Prize ${Math.round(item.prize)}</span><span>${fmtEur(item.value_eur)} a year</span></span></button>`;
    }).join('');
  }
  function gridRings(items) {
    const maxValue = Math.max(1, ...items.map(item => item.value_eur || 0));
    const rate = hourly();
    return runningView().map(item => {
      const gross = (Number(item.hours) || 0) * rate;
      const size = Math.max(12, Math.round(12 + Math.sqrt(Math.max(0, gross) / maxValue) * 30));
      const left = (6 + (item.readiness / 100) * 88).toFixed(2);
      const top = (6 + ((100 - item.prize) / 100) * 88).toFixed(2);
      const name = item.name || 'Running';
      const label = `${name}. ${CALL_LABEL[item.call] || item.call}. Readiness ${Math.round(item.readiness)}. Prize ${Math.round(item.prize)}.`;
      return `<button class="grid-ring q-${item.quadrant}" type="button" data-run-focus="${esc(item.id)}" aria-label="${esc(label)}" data-flip-x="${item.readiness >= 50 ? 'left' : 'right'}" data-flip-y="${item.prize >= 50 ? 'down' : 'up'}" style="left:${left}%;top:${top}%;width:${size}px;height:${size}px"><span class="grid-tip" aria-hidden="true"><strong>${esc(name)}</strong><span>${esc(CALL_LABEL[item.call] || '')}</span><span>Readiness ${Math.round(item.readiness)} · Prize ${Math.round(item.prize)}</span></span></button>`;
    }).join('');
  }
  function gridPanel(scored) {
    if (!scored.items.length) return '<p class="muted">No initiatives: no step in these roles changes. Try other roles.</p>';
    return `<figure class="grid-figure">
        <p class="sr-only">Each initiative is a button. Across is readiness, from not ready to ready. Up is the prize, from small to big. Larger dots are more gross value. Hollow rings are work that already runs.</p>
        <p class="grid-axis grid-axis-y">How big is the prize?</p>
        <div class="grid-plot">
          <svg class="grid-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <line x1="50" y1="4" x2="50" y2="96"></line>
            <line x1="4" y1="50" x2="96" y2="50"></line>
          </svg>
          <span class="q-label q-tl">Invest to Unlock</span>
          <span class="q-label q-tr">Accelerate Now</span>
          <span class="q-label q-bl">Deprioritize</span>
          <span class="q-label q-br">Quick Wins</span>
          ${gridDots(scored.items)}
          ${gridRings(scored.items)}
        </div>
        <p class="grid-axis grid-axis-x">Can we do it today?</p>
      </figure>
      <div class="grid-lists">${QUADRANT_KEYS.map(key => quadrantSection(key, scored.by_quadrant[key])).join('')}</div>
      <p class="grid-note">Scores are a first read from generic task data. Readiness before production needs all eight checks.</p>
      <details class="grid-checks"><summary>The eight checks</summary><ol>${PRODUCTION_CHECKS.map(item => `<li>${esc(item)}</li>`).join('')}</ol></details>
      <p class="grid-credit">After the AI Portfolio Grid by Matt Siegel, Arman Hezarkhani and Alex Lieberman (Tenex Labs).</p>`;
  }
  function goalsBlock() {
    const goals = liveGoals();
    const cards = goals.map((goal, index) => `<article class="goal-card">
      ${goal.example ? '<p class="goal-example">Example, edit or remove</p>' : ''}
      <label class="field">Goal ${index + 1}<input class="input" data-goal-text="${esc(goal.id)}" value="${esc(goal.text)}"></label>
      <label class="field">Bigger or sooner?<select class="select" data-goal-pace="${esc(goal.id)}">${PACES.map(([value, label]) => `<option value="${value}"${goal.pace === value ? ' selected' : ''}>${label}</option>`).join('')}</select></label>
      <fieldset><legend class="label">What limits it</legend><div class="goal-limits">${LIMITS.map(([value, label]) => `<label><input type="checkbox" data-goal-limit="${esc(goal.id)}" value="${value}"${goal.limits.includes(value) ? ' checked' : ''}> ${label}</label>`).join('')}</div></fieldset>
      <label class="field">Note<input class="input" data-goal-note="${esc(goal.id)}" value="${esc(goal.note)}"></label>
      <button class="btn-text" type="button" data-goal-remove="${esc(goal.id)}">Remove</button>
    </article>`).join('');
    return `<section class="port-block" aria-labelledby="port-goals">
      <h2 class="section-title" id="port-goals">Goals</h2>
      <p class="section-lede">Up to three. An initiative linked to one scores a higher prize. One marked none stays off the strategy.</p>
      ${cards || '<p class="muted">No goals yet.</p>'}
      ${goals.length < 3 ? '<button class="btn-quiet" type="button" data-goal-add>Add a goal</button>' : ''}
      <details><summary>How to find your goals</summary><pre class="copy-block" id="goal-script">${esc(GOAL_SCRIPT)}</pre><button class="btn-quiet no-print" type="button" data-copy="goal-script">Copy</button></details>
    </section>`;
  }
  function healthBlock(scored) {
    let active = 0;
    let started = false;
    let stopped = false;
    for (const item of scored.items) {
      const card = savedPilot(item.id);
      const status = card.status || 'idea';
      if (item.quadrant !== 'quick_wins' && ACTIVE_STATUS.has(status)) active += 1;
      if (STARTED_STATUS.has(status)) started = true;
      if (status === 'stopped' && inThisQuarter(card.stopped_on)) stopped = true;
    }
    const quickHours = scored.by_quadrant.quick_wins.reduce((sum, item) => sum + (item.hours_returned || 0), 0);
    const policy = portfolioState.policy || 'no';
    return `<section class="port-block" aria-labelledby="port-health">
      <h2 class="section-title" id="port-health">Portfolio health</h2>
      <p${active > 5 ? ' class="port-warn"' : ''}>${active} active, keep 3 to 5.</p>
      ${started && !stopped ? '<p class="port-warn">Nothing stopped this quarter.</p>' : ''}
      <p>${fmtHours(quickHours)} a year in Quick Wins, not counted toward goal progress.</p>
      <label class="field">Does security, compliance or vendor policy block AI in production?
        <select class="select" data-policy>
          <option value="no"${policy === 'no' ? ' selected' : ''}>No</option>
          <option value="partly"${policy === 'partly' ? ' selected' : ''}>Partly</option>
          <option value="yes"${policy === 'yes' ? ' selected' : ''}>Yes</option>
        </select>
      </label>
    </section>`;
  }
  function waveBlock(base, shown) {
    const byId = new Map(shown.items.map(item => [item.id, item]));
    const rows = [
      ...shown.cards.map(card => ({kind: 'card', card})),
      ...base.first_wave.map(id => byId.get(id)).filter(Boolean).map(item => ({kind: 'item', item})),
    ];
    const visible = view.enableOpen ? rows : rows.slice(0, CHUNK);
    const body = rows.length ? `<ol class="grid-rows">${visible.map(row => {
      if (row.kind === 'card') {
        const names = row.card.initiatives.map(id => plainIni(id));
        const head = names.slice(0, CHUNK);
        return `<li class="enable-card"><strong>${esc(row.card.title)}</strong><p>Returns nothing directly. ${row.card.kind === 'policy' ? 'Applies to the whole portfolio.' : `Unblocks ${row.card.initiatives.length} initiatives.`} ${fmtEur(row.card.value_eur)} a year ${GROSS}.</p><p class="small">${head.map(esc).join('; ')}${names.length > head.length ? `; and ${names.length - head.length} more` : ''}</p></li>`;
      }
      return `<li class="grid-row"><div class="grid-row-name"><button class="link-ini" type="button" data-ini="${esc(row.item.id)}">${esc(plainIni(row.item.id))}</button><span class="wave-tag">First wave</span></div><p>${timeLabel(row.item)}</p></li>`;
    }).join('')}</ol>${rows.length > visible.length ? '<button class="btn-text more-btn" type="button" data-enable-more>Show all</button>' : ''}` : '<p class="muted">Nothing in the first wave yet.</p>';
    return `<section class="port-block" aria-labelledby="port-wave"><h2 class="section-title" id="port-wave">Enabling work</h2><p class="section-lede">Enabling work returns nothing directly. It goes into the first wave ahead of Accelerate Now. Time to first value is rough, from the article.</p>${body}</section>`;
  }
  function runningBlock() {
    const items = runningView();
    const goals = liveGoals();
    const visible = view.runOpen ? items : items.slice(0, CHUNK);
    const sameOptions = `<option value="">Not set</option>${portfolioState.running.map(item => `<option value="${esc(item.id)}">${esc(item.name || item.id)}</option>`).join('')}${R.initiatives.map(item => `<option value="${esc(item.id)}">${esc(plainIni(item.id))}</option>`).join('')}`;
    const cards = visible.map(item => `<article class="run-card" data-run-card="${esc(item.id)}">
      <h3>${esc(item.name || 'Untitled')}</h3>
      ${item.purpose ? `<p>${esc(item.purpose)}</p>` : ''}
      <p class="run-line"><span>Call</span><strong>${esc(CALL_LABEL[item.call] || item.call)}</strong></p>
      <label class="grid-field">Override<select class="select" data-run-call="${esc(item.id)}">${CALLS.map(call => `<option value="${call}"${item.call === call ? ' selected' : ''}>${CALL_LABEL[call]}</option>`).join('')}</select></label>
      ${item.call === 'edit' && item.missing?.length ? `<p class="small">Missing: ${esc(item.missing.join(', '))}</p>` : ''}
      <button class="btn-text" type="button" data-run-remove="${esc(item.id)}">Remove</button>
    </article>`).join('');
    return `<section class="port-block" aria-labelledby="port-running">
      <h2 class="section-title" id="port-running">Already running</h2>
      <p class="section-lede">AI work that already runs, including tools people pay for themselves. Hollow rings use the same axes.</p>
      <div class="port-form no-print">
        <label class="field">Name<input class="input" id="run-name" autocomplete="off"></label>
        <label class="field">What it is for<input class="input" id="run-purpose"></label>
        <label class="field">Who pays<select class="select" id="run-payer"><option value="company">Company</option><option value="employee">Employee</option></select></label>
        <label class="field">Owner<input class="input" id="run-owner"></label>
        <label class="field">Evidence<select class="select" id="run-evidence"><option value="none">None</option><option value="anecdotes">Anecdotes</option><option value="measured">Measured</option></select></label>
        <label class="field">Measure<input class="input" id="run-measure"></label>
        <label class="field">Goal<select class="select" id="run-goal"><option value="">Not set</option>${goals.map(goal => `<option value="${esc(goal.id)}">${esc(goal.text || goal.id)}</option>`).join('')}<option value="none">None</option></select></label>
        <label class="field">Hours saved a year<input class="input" id="run-hours" inputmode="decimal"></label>
        <label class="field">Where the hours go<input class="input" id="run-destination"></label>
        <label class="field wide">Same job as<select class="select" id="run-same">${sameOptions}</select></label>
        <div class="wide"><button class="btn" type="button" data-run-add>Add</button></div>
      </div>
      <p class="field-error" id="run-error" role="alert"></p>
      ${cards}
      ${items.length > visible.length ? '<button class="btn-text more-btn" type="button" data-run-more>Show all</button>' : ''}
      <pre class="copy-block" id="survey-script">${esc(SURVEY_SCRIPT)}</pre>
      <button class="btn-quiet no-print" type="button" data-copy="survey-script">Copy the survey</button>
    </section>`;
  }
  function portfolioPanel() {
    const base = baseGrid();
    const shown = shownGrid();
    return `${goalsBlock()}${healthBlock(shown)}${gridPanel(shown)}${waveBlock(base, shown)}${runningBlock()}`;
  }
  function initiativesPanel() {
    const scoreById = new Map(shownGrid().items.map(item => [item.id, item]));
    const all = R.initiatives;
    const groups = Object.keys(ACTIONS).map(type => [type, all.filter(x => x.action_type === type)]).filter(([, l]) => l.length);
    const other = all.filter(x => !ACTIONS[x.action_type]);
    if (other.length) groups.push(['other', other]);
    const hours = all.reduce((s, x) => s + x.hours_returned, 0);
    const top = all.slice(0, TOP);
    const topDaysLow = top.reduce((s, x) => s + x.effort.days_low, 0);
    const topDaysHigh = top.reduce((s, x) => s + x.effort.days_high, 0);
    const topHours = top.reduce((s, x) => s + x.hours_returned, 0);
    const chips = `<div class="ini-tools" role="group" aria-label="Show initiatives">
      <button class="chip" type="button" data-filter="top" aria-pressed="${view.iniFilter === 'top'}">Top ${Math.min(TOP, all.length)}</button>
      <button class="chip" type="button" data-filter="all" aria-pressed="${view.iniFilter === 'all'}">All by kind<span class="chip-n">${all.length}</span></button>
      ${groups.map(([type, l]) => `<button class="chip" type="button" data-filter="${type}" aria-pressed="${view.iniFilter === type}">${esc(ACTIONS[type]?.plural ?? 'Other')}<span class="chip-n">${l.length}</span></button>`).join('')}
    </div>`;
    let body;
    if (!all.length) {
      body = '<p class="muted">No initiatives: no step in these roles changes. Try other roles.</p>';
    } else if (view.iniFilter === 'top') {
      body = `<p class="ini-summary">${all.length} initiatives return about ${fmtHours(hours)} a year together. The top ${top.length} return ${fmtHours(topHours)} for ${topDaysLow === topDaysHigh ? `about ${topDaysLow}` : `${topDaysLow}–${topDaysHigh}`} planning days of effort.</p>
        <ol class="ini-list">${top.map((x, i) => iniCard(x, i + 1, i === 0, scoreById.get(x.id))).join('')}</ol>
        ${all.length > TOP ? `<button class="btn-quiet show-all" type="button" data-filter="all">Show all ${all.length} initiatives, by kind</button>` : ''}`;
    } else {
      const shown = view.iniFilter === 'all' ? groups : groups.filter(([t]) => t === view.iniFilter);
      body = shown.map(([type, l]) => {
        const open = view.iniOpen.has(type) || view.iniFilter === type && l.length <= CHUNK + 3;
        const list = open ? l : l.slice(0, CHUNK);
        const gh = l.reduce((s, x) => s + x.hours_returned, 0);
        return `<section class="ini-group" aria-labelledby="g-${type}"><h3 id="g-${type}">${esc(ACTIONS[type]?.plural ?? 'Other')}<span>${l.length} · ${fmtHours(gh)} a year</span></h3>
          <p class="group-lede">${esc(ACTIONS[type]?.lede ?? '')}</p>
          <ol class="ini-list">${list.map(x => iniCard(x, iniById.get(x.id).rank, false, scoreById.get(x.id))).join('')}</ol>
          ${l.length > list.length ? `<button class="btn-text more-btn" type="button" data-group-more="${type}">Show ${l.length - list.length} more</button>` : ''}</section>`;
      }).join('');
    }
    return chips + body;
  }

  // Print: every initiative as one ranked row, so the plan stays a readable length.
  function printInitiatives() {
    const hours = R.initiatives.reduce((sum, x) => sum + x.hours_returned, 0);
    return `<h2 class="print-title">Initiatives, ranked</h2>
      <p class="ini-summary">${R.initiatives.length} initiatives return about ${fmtHours(hours)} a year together ${GROSS}. Ranked by value per day of effort; quarters are a suggested order. Steps and tasks per initiative are in the JSON download.</p>
      <table class="tasks-table print-ini">
        <thead><tr><th scope="col" class="num">#</th><th scope="col">Initiative</th><th scope="col">When</th><th scope="col">Effort</th><th scope="col" class="num">Hours a year</th><th scope="col" class="num">Value a year</th></tr></thead>
        <tbody>${R.initiatives.map((x, i) => `<tr><td class="num">${i + 1}</td><td>${S(x.name)}<span class="t-role" style="display:block">${iniMeta(x)} · ${x.tasks.length} tasks in ${x.roles.length} roles</span></td><td>${x.quarter}</td><td>${esc(x.effort.band)}, ${fmtDays(x.effort)}</td><td class="num">${fmtHours(x.hours_returned)}</td><td class="num">${fmtEur(x.value_eur)}</td></tr>`).join('')}</tbody>
      </table>`;
  }

  /* ---------------------------------------------------------------- opportunities */
  function oppsPanel() {
    const scopeRole = view.oppScope === 'team' ? null : roleById.get(view.oppScope);
    const list = scopeRole ? scopeRole.opportunities : R.opportunities;
    const shown = view.oppAll ? list : list.slice(0, CHUNK);
    const hours = list.reduce((s, t) => s + t.hours_returned, 0);
    return `<div class="scope">
        <label class="label" for="opp-scope">Show for</label>
        <select class="select" id="opp-scope"><option value="team">The whole team</option>${R.roles.map(r => `<option value="${esc(r.id)}"${r.id === view.oppScope ? ' selected' : ''}>${esc(r.title)}</option>`).join('')}</select>
      </div>
      <p class="ini-summary">Tasks ranked by the value of the time they give back (hours × hourly cost). ${list.length} tasks, ${fmtHours(hours)} a year together. These overlap with the initiatives: two views of the same time, never add them up.</p>
      ${rungLegend()}
      <ol class="opps">${shown.map((t, i) => `<li class="opp">
        <span class="opp-rank">${i + 1}</span>
        <div><span class="opp-task">${S(t.short)}</span><span class="opp-role">${esc(t.role_title)} · ${fmtHours(t.baseline_hours)} a year today</span></div>
        <div class="opp-mix">${rungBar(t.rung_mix)}<span class="xs">${fmtPct(t.time_saved_pct)} of the task’s time back</span></div>
        <div class="opp-val"><strong>${fmtHours(t.hours_returned)}</strong><span>${fmtEur(t.value_eur)} a year ${GROSS}</span></div>
        <details><summary>How it could work</summary>
          <p class="design">${S(t.design)}</p>
          ${t.still_hard ? `<p class="design"><strong>Still hard:</strong> ${S(t.still_hard)}</p>` : ''}
          ${t.human_edge ? `<p class="design"><strong>Stays human:</strong> ${S(t.human_edge)}</p>` : ''}
          ${t.initiative_ids?.length ? `<p class="design"><strong>Initiatives:</strong> ${t.initiative_ids.map(id => iniById.get(id)).filter(Boolean).sort((a, b) => a.rank - b.rank).slice(0, 5).map(({x}) => iniLink(x)).join(' · ')}</p>` : ''}
        </details>
      </li>`).join('')}</ol>
      ${list.length > shown.length ? `<button class="btn-quiet show-all" type="button" id="opp-all">Show all ${list.length} tasks</button>` : ''}`;
  }

  /* ---------------------------------------------------------------- tasks */
  function tasksPanel() {
    return `<div class="tasks-tools">
        <div class="search"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.2-4.2"/></svg>
          <label class="sr-only" for="task-q">Search tasks</label><input class="input" id="task-q" type="search" placeholder="Search tasks" value="${esc(view.taskQuery)}"></div>
        <label class="sr-only" for="task-role">Role</label>
        <select class="select" id="task-role"><option value="">All roles</option>${R.roles.map(r => `<option value="${esc(r.id)}"${r.id === view.taskRole ? ' selected' : ''}>${esc(r.title)}</option>`).join('')}</select>
        <p class="tasks-count" id="task-count" aria-live="polite"></p>
      </div>
      <div class="table-scroll"><table class="tasks-table">
        <thead><tr>
          <th scope="col">Task</th>
          <th scope="col" class="hide-sm">Role</th>
          ${[['task_share', 'Share of role'], ['baseline_hours', 'Hours today'], ['remaining_hours', 'With changes'], ['time_saved_pct', 'Back']].map(([k, l]) => `<th scope="col" class="num${k === 'task_share' || k === 'remaining_hours' ? ' hide-sm' : ''}" data-sort="${k}"><button type="button">${l}</button></th>`).join('')}
        </tr></thead>
        <tbody id="task-rows"></tbody>
      </table></div>`;
  }
  function paintTasks(panel) {
    const q = view.taskQuery.toLowerCase().split(/\s+/).filter(Boolean);
    const [key, dir] = view.taskSort;
    const rows = R.tasks.filter(t => (!view.taskRole || t.role_id === view.taskRole) && q.every(w => `${t.short} ${t.statement} ${t.role_title}`.toLowerCase().includes(w)))
      .sort((a, b) => dir * ((a[key] ?? 0) - (b[key] ?? 0)));
    $('#task-count', panel).textContent = `${rows.length} of ${R.tasks.length} tasks`;
    for (const th of $$('th[data-sort]', panel)) {
      if (th.dataset.sort === key) th.setAttribute('aria-sort', dir < 0 ? 'descending' : 'ascending'); else th.removeAttribute('aria-sort');
    }
    $('#task-rows', panel).innerHTML = rows.map(t => `<tr data-task="${esc(t.id)}">
      <td><button class="t-open" type="button" aria-expanded="false">${S(t.short)}</button></td>
      <td class="t-role hide-sm">${esc(t.role_title)}</td>
      <td class="num hide-sm">${fmtPct(t.task_share * 100)}</td>
      <td class="num">${fmtInt(Math.round(t.baseline_hours))}</td>
      <td class="num hide-sm">${fmtInt(Math.round(t.remaining_hours))}</td>
      <td class="num">${fmtPct(t.time_saved_pct)}</td></tr>`).join('') || '<tr><td colspan="6" class="muted">No task matches.</td></tr>';
  }
  function taskDetail(t) {
    return `<tr class="t-detail"><td colspan="6">
      <p class="small muted">${esc(t.role_title)} · ${fmtPct(t.task_share * 100)} of the role’s time · O*NET: ${esc(t.statement)}</p>
      <table class="steps-table"><thead><tr><th scope="col">Step</th><th scope="col">Today by</th><th scope="col">With the change</th><th scope="col" class="num">Hours today → after</th></tr></thead>
      <tbody>${t.steps.map(s => `<tr><td>${S(s.what)}</td><td>${esc(MEANS[s.today_means] ?? humanize(s.today_means))}</td><td><span class="fate fate-${esc(s.fate)}">${esc(humanize(s.fate))}</span>${s.initiative_id && iniById.get(s.initiative_id) ? ` ${iniLink(iniById.get(s.initiative_id).x)}` : ''}</td><td class="num">${fmtInt(Math.round(s.baseline_hours))} → ${fmtInt(Math.round(s.remaining_hours))}</td></tr>`).join('')}</tbody></table>
    </td></tr>`;
  }

  /* ---------------------------------------------------------------- wiring */
  function snapshot() {
    const base = baseGrid();
    const shown = shownGrid();
    const goals = liveGoals();
    const pilots = {};
    const checks = {};
    const rows = {};
    const byItem = new Map(shown.items.map(item => [item.id, item]));
    for (const initiative of R.initiatives) {
      const card = displayPilot(initiative.id);
      const list = displayChecks(initiative.id);
      pilots[initiative.id] = card;
      checks[initiative.id] = list;
      const item = byItem.get(initiative.id);
      const check = pilotCheck(card, item?.quadrant);
      let low = 0;
      let high = 0;
      for (const [key] of COST_LINES) {
        low += Number(card.costs?.[key]?.low) || 0;
        high += Number(card.costs?.[key]?.high) || 0;
      }
      const link = item?.goal_link;
      const goal = link === 'none' ? 'None' : (goals.find(entry => entry.id === link)?.text || '');
      const outcome = String(card.measure || '').trim()
        ? `Improve ${card.measure} from ${card.baseline} to ${card.target} by ${card.by}`
        : String(card.learn || '');
      const status = PILOT_STATUS.find(([value]) => value === (card.status || 'idea'));
      rows[initiative.id] = {
        goal, owner: card.owner || '', outcome, checkable: check.checkable ? 'yes' : 'no',
        cost_low: low, cost_high: high, hours_destination: card.hours_go || '',
        status: status ? status[1] : (card.status || 'Idea'),
        readiness_yes: list.filter(value => value === 'yes').length,
        time_to_first_value: timeToFirstValue(item || initiative).label,
      };
    }
    return {
      goals, running: runningView(), pilots, checks, policy: portfolioState.policy || 'no',
      enabling: shown.cards, byId: byItem, rows, baseFirstWave: base.first_wave,
    };
  }
  const panels = Object.fromEntries(TABS.map(t => [t, document.getElementById(`panel-${t}`)]));
  const render = {
    team: () => { panels.team.innerHTML = teamPanel(); },
    portfolio: () => { panels.portfolio.innerHTML = portfolioPanel(); },
    roles: () => { panels.roles.innerHTML = rolesPanel(); },
    initiatives: () => { panels.initiatives.innerHTML = initiativesPanel(); },
    opportunities: () => { panels.opportunities.innerHTML = oppsPanel(); },
    tasks: () => { panels.tasks.innerHTML = tasksPanel(); paintTasks(panels.tasks); },
  };
  function paintOpen() {
    if (view.rendered.has('portfolio')) render.portfolio();
    if (view.rendered.has('initiatives')) render.initiatives();
  }
  function visibleControl(sel) {
    return [...document.querySelectorAll(sel)].find(el => el.offsetParent !== null) || null;
  }
  function show(tab, {focus = false} = {}) {
    view.tab = tab;
    for (const t of TABS) {
      const btn = document.getElementById(`tab-${t}`);
      btn.setAttribute('aria-selected', String(t === tab));
      btn.tabIndex = t === tab ? 0 : -1;
      panels[t].hidden = t !== tab;
    }
    if (!view.rendered.has(tab)) { render[tab](); view.rendered.add(tab); }
    onState({tab});
    if (focus) document.getElementById(`tab-${tab}`).focus();
  }
  function openInitiative(id) {
    const hit = iniById.get(id);
    if (!hit) return;
    view.iniView = 'list';
    if (hit.rank > TOP) {
      view.iniFilter = hit.x.action_type;
      view.iniOpen.add(hit.x.action_type);
    } else view.iniFilter = 'top';
    render.initiatives();
    view.rendered.add('initiatives');
    show('initiatives');
    const card = document.querySelector(`[data-ini-card="${CSS.escape(id)}"]`);
    if (card) {
      card.scrollIntoView({block: 'center'});
      card.classList.remove('is-flash');
      void card.offsetWidth;
      card.classList.add('is-flash');
      $('summary', card)?.focus({preventScroll: true});
    }
  }
  function pickRole(id) {
    view.role = id;
    onState({role: id});
    render.roles();
    view.rendered.add('roles');
  }

  // An override can move a row past the seven-row cap. Open that quadrant so the control still exists.
  function focusGridControl(id, attr) {
    const sel = `[${attr}="${CSS.escape(id)}"]`;
    const scored = shownGrid();
    const item = scored.items.find(row => row.id === id);
    if (item) {
      const index = (scored.by_quadrant[item.quadrant] || []).findIndex(row => row.id === id);
      if (index >= CHUNK) view.gridOpen.add(item.quadrant);
    }
    if (!visibleControl(sel)) paintOpen();
    visibleControl(sel)?.focus();
  }
  function copyPlain(button) {
    const text = document.getElementById(button.dataset.copy)?.textContent || '';
    const label = button.textContent;
    const mark = () => {
      button.textContent = 'Copied';
      setTimeout(() => { if (button.isConnected) button.textContent = label; }, 1600);
    };
    const fallback = () => {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.left = '-9999px';
      document.body.append(area);
      area.select();
      try { if (document.execCommand('copy')) mark(); } catch { /* the text stays in the box */ }
      area.remove();
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(mark).catch(fallback);
    else fallback();
  }
  function refusePilot(id, text) {
    view.pilotOpen.add(id);
    view.pilotNotice = {id, text};
    paintOpen();
    visibleControl(`[data-pilot-status="${CSS.escape(id)}"]`)?.focus();
  }
  function applyPilotStatus(id, next) {
    const saved = savedPilot(id);
    const current = saved.status || 'idea';
    view.pilotOpen.add(id);
    if (next === 'production') {
      const ready = productionReady(displayChecks(id));
      if (!ready.ok) {
        const labels = ready.open.map(index => PRODUCTION_CHECKS[index]).filter(Boolean);
        refusePilot(id, `In production needs every check. Still open: ${labels.join(', ')}.`);
        return;
      }
    }
    if (next === 'revise') {
      if (current !== 'pilot') {
        refusePilot(id, 'Revise is only from a pilot.');
        return;
      }
      const gate = reviseAllowed(saved);
      if (!gate.ok) {
        refusePilot(id, gate.reason);
        return;
      }
      view.pilotNotice = null;
      patchPilot(id, {status: 'revise', revise_count: 1, stopped_on: ''});
      paintOpen();
      visibleControl(`[data-pilot-status="${CSS.escape(id)}"]`)?.focus();
      return;
    }
    view.pilotNotice = null;
    patchPilot(id, {status: next, stopped_on: next === 'stopped' ? isoDate(new Date()) : ''});
    paintOpen();
    visibleControl(`[data-pilot-status="${CSS.escape(id)}"]`)?.focus();
  }

  // Bind once per page; later renders replace the controller the handlers call.
  controller.current = {
    click(e) {
      const t = e.target;
      const copyBtn = t.closest('[data-copy]');
      if (copyBtn) { copyPlain(copyBtn); return; }
      const goalRemove = t.closest('[data-goal-remove]');
      if (goalRemove) {
        const id = goalRemove.dataset.goalRemove;
        const goals = ensureGoalList().filter(goal => goal.id !== id);
        const links = {...portfolioState.links};
        for (const [iniId, goal] of Object.entries(links)) if (goal === id) delete links[iniId];
        commitPortfolio({goals, links});
        return;
      }
      const goalAdd = t.closest('[data-goal-add]');
      if (goalAdd) {
        const goals = ensureGoalList();
        if (goals.length >= 3) return;
        goals.push({id: `goal-${Date.now().toString(36)}`, text: '', pace: 'sooner', limits: [], note: '', example: false});
        commitPortfolio({goals});
        const fields = $$('[data-goal-text]');
        fields[fields.length - 1]?.focus();
        return;
      }
      const accept = t.closest('[data-goal-accept]');
      if (accept) {
        const id = accept.dataset.goalAccept;
        commitPortfolio({links: {...portfolioState.links, [id]: accept.dataset.acceptGoal}});
        focusGridControl(id, 'data-goal-link');
        return;
      }
      const runAdd = t.closest('[data-run-add]');
      if (runAdd) {
        const name = document.getElementById('run-name')?.value.trim() || '';
        const err = document.getElementById('run-error');
        if (!name) {
          if (err) err.textContent = 'Add a name first.';
          document.getElementById('run-name')?.focus();
          return;
        }
        const hoursText = document.getElementById('run-hours')?.value.trim() || '';
        const hours = hoursText === '' ? 0 : Number(hoursText);
        const evidence = document.getElementById('run-evidence')?.value;
        const item = {
          id: `run-${Date.now().toString(36)}`,
          name,
          purpose: document.getElementById('run-purpose')?.value.trim() || '',
          payer: document.getElementById('run-payer')?.value === 'employee' ? 'employee' : 'company',
          owner: document.getElementById('run-owner')?.value.trim() || '',
          evidence: evidence === 'measured' || evidence === 'anecdotes' ? evidence : 'none',
          measure: document.getElementById('run-measure')?.value.trim() || '',
          goal: document.getElementById('run-goal')?.value || '',
          hours: Number.isFinite(hours) ? hours : 0,
          destination: document.getElementById('run-destination')?.value.trim() || '',
          same_as: document.getElementById('run-same')?.value || '',
        };
        commitPortfolio({running: [...portfolioState.running, item]});
        return;
      }
      const runRemove = t.closest('[data-run-remove]');
      if (runRemove) {
        commitPortfolio({running: portfolioState.running.filter(item => item.id !== runRemove.dataset.runRemove)});
        return;
      }
      if (t.closest('[data-enable-more]')) { view.enableOpen = true; render.portfolio(); return; }
      if (t.closest('[data-run-more]')) { view.runOpen = true; render.portfolio(); return; }
      const gridMore = t.closest('[data-grid-more]');
      if (gridMore) {
        const key = gridMore.dataset.gridMore;
        view.gridOpen.add(key);
        render.portfolio();
        document.getElementById(`quad-${key}`)?.focus();
        return;
      }
      const more = t.closest('[data-more]');
      if (more) {
        const list = document.getElementById(more.dataset.more);
        const tpl = document.querySelector(`template[data-for="${more.dataset.more}"]`);
        if (list && tpl) { list.append(tpl.content.cloneNode(true)); tpl.remove(); }
        more.remove();
        return;
      }
      const ring = t.closest('[data-run-focus]');
      if (ring) {
        const id = ring.dataset.runFocus;
        let card = document.querySelector(`[data-run-card="${CSS.escape(id)}"]`);
        if (!card) {
          view.runOpen = true;
          render.portfolio();
          card = document.querySelector(`[data-run-card="${CSS.escape(id)}"]`);
        }
        card?.scrollIntoView({block: 'center'});
        card?.querySelector('[data-run-call]')?.focus();
        return;
      }
      const ini = t.closest('[data-ini]');
      if (ini) { openInitiative(ini.dataset.ini); return; }
      const roleLink = t.closest('[data-role]');
      if (roleLink) { pickRole(roleLink.dataset.role); show('roles'); window.scrollTo({top: panels.roles.getBoundingClientRect().top + scrollY - 140}); return; }
      const pick = t.closest('[data-pick-role]');
      if (pick) { pickRole(pick.dataset.pickRole); $(`[data-pick-role="${CSS.escape(pick.dataset.pickRole)}"]`, panels.roles)?.focus(); return; }
      const filter = t.closest('[data-filter]');
      if (filter) { view.iniFilter = filter.dataset.filter; render.initiatives(); $(`.chip[data-filter="${filter.dataset.filter}"]`, panels.initiatives)?.focus(); return; }
      const gm = t.closest('[data-group-more]');
      if (gm) { view.iniOpen.add(gm.dataset.groupMore); render.initiatives(); return; }
      if (t.closest('#opp-all')) { view.oppAll = true; render.opportunities(); return; }
      const th = t.closest('th[data-sort]');
      if (th) {
        const k = th.dataset.sort;
        view.taskSort = [k, view.taskSort[0] === k ? -view.taskSort[1] : -1];
        paintTasks(panels.tasks);
        $(`th[data-sort="${k}"] button`, panels.tasks)?.focus();
        return;
      }
      const open = t.closest('.t-open');
      if (open) {
        const tr = open.closest('tr');
        const expanded = open.getAttribute('aria-expanded') === 'true';
        if (expanded) tr.nextElementSibling?.classList.contains('t-detail') && tr.nextElementSibling.remove();
        else tr.insertAdjacentHTML('afterend', taskDetail(R.tasks.find(x => x.id === tr.dataset.task)));
        open.setAttribute('aria-expanded', String(!expanded));
      }
    },
    change(e) {
      const link = e.target.closest('[data-goal-link]');
      if (link) {
        const id = link.dataset.goalLink;
        const links = {...portfolioState.links};
        if (!link.value) delete links[id];
        else links[id] = link.value;
        commitPortfolio({links});
        focusGridControl(id, 'data-goal-link');
        return;
      }
      const pace = e.target.closest('[data-goal-pace]');
      if (pace) {
        const id = pace.dataset.goalPace;
        const goals = writeGoal(id, goal => { goal.pace = PACES.some(([value]) => value === pace.value) ? pace.value : 'sooner'; });
        if (goals) commitPortfolio({goals});
        visibleControl(`[data-goal-pace="${CSS.escape(id)}"]`)?.focus();
        return;
      }
      const limit = e.target.closest('[data-goal-limit]');
      if (limit) {
        const id = limit.dataset.goalLimit;
        const goals = writeGoal(id, goal => {
          const set = new Set(goal.limits);
          if (limit.checked) set.add(limit.value); else set.delete(limit.value);
          goal.limits = LIMITS.map(([key]) => key).filter(key => set.has(key));
        });
        if (goals) commitPortfolio({goals});
        visibleControl(`[data-goal-limit="${CSS.escape(id)}"][value="${CSS.escape(limit.value)}"]`)?.focus();
        return;
      }
      const policy = e.target.closest('[data-policy]');
      if (policy) {
        const value = policy.value === 'yes' || policy.value === 'partly' ? policy.value : 'no';
        commitPortfolio({policy: value});
        visibleControl('[data-policy]')?.focus();
        return;
      }
      const runCall = e.target.closest('[data-run-call]');
      if (runCall) {
        const id = runCall.dataset.runCall;
        const running = portfolioState.running.map(item => item.id === id ? {...item, call: runCall.value} : item);
        commitPortfolio({running});
        visibleControl(`[data-run-call="${CSS.escape(id)}"]`)?.focus();
        return;
      }
      const hoursGo = e.target.closest('[data-pilot-hours]');
      if (hoursGo) {
        patchPilot(hoursGo.dataset.pilotHours, {hours_go: hoursGo.value});
        refreshPilot(hoursGo.dataset.pilotHours);
        return;
      }
      const statusSel = e.target.closest('[data-pilot-status]');
      if (statusSel) { applyPilotStatus(statusSel.dataset.pilotStatus, statusSel.value); return; }
      const start = e.target.closest('[data-pilot-start]');
      if (start) {
        const id = start.dataset.pilotStart;
        const saved = savedPilot(id);
        const patch = {start: start.value};
        if (!saved.review_touched) {
          patch.review = start.value ? plusDays(start.value, 42) : '';
          const review = document.querySelector(`[data-pilot-review="${CSS.escape(id)}"]`);
          if (review) review.value = patch.review;
        }
        patchPilot(id, patch);
        refreshPilot(id);
        return;
      }
      const review = e.target.closest('[data-pilot-review]');
      if (review) {
        patchPilot(review.dataset.pilotReview, {review: review.value, review_touched: true});
        return;
      }
      const by = e.target.closest('[data-pilot-by]');
      if (by) {
        patchPilot(by.dataset.pilotBy, {by: by.value});
        refreshPilot(by.dataset.pilotBy);
        return;
      }
      const check = e.target.closest('[data-check]');
      if (check) {
        const id = check.dataset.check;
        const index = Number(check.dataset.checkI);
        view.readyOpen.add(id);
        const list = displayChecks(id).slice();
        list[index] = ['yes', 'no', 'unknown'].includes(check.value) ? check.value : 'unknown';
        portfolioState.checks = {...portfolioState.checks, [id]: list};
        onPortfolio?.(clonePortfolio());
        return;
      }
      const early = e.target.closest('[data-early]');
      if (early) {
        const id = early.dataset.early;
        const index = Number(early.dataset.earlyI);
        const list = [...(displayPilot(id).early || [])];
        while (list.length < 4) list.push('unknown');
        list[index] = ['yes', 'no', 'unknown'].includes(early.value) ? early.value : 'unknown';
        patchPilot(id, {early: list.slice(0, 4)});
        return;
      }
      const callSel = e.target.closest('[data-grid-call]');
      if (callSel) {
        const id = callSel.dataset.gridCall;
        onGrid?.(id, {call: callSel.value});
        focusGridControl(id, 'data-grid-call');
        return;
      }
      const ownerSel = e.target.closest('[data-grid-owner]');
      if (ownerSel) {
        const id = ownerSel.dataset.gridOwner;
        const owner_wants = ownerSel.value === 'yes' ? true : ownerSel.value === 'no' ? false : null;
        onGrid?.(id, {owner_wants});
        focusGridControl(id, 'data-grid-owner');
        return;
      }
      if (e.target.id === 'role-select') pickRole(e.target.value);
      if (e.target.id === 'opp-scope') { view.oppScope = e.target.value; view.oppAll = false; render.opportunities(); $('#opp-scope').focus(); }
      if (e.target.id === 'task-role') { view.taskRole = e.target.value; paintTasks(panels.tasks); }
    },
    input(e) {
      const goalText = e.target.closest('[data-goal-text]');
      if (goalText) {
        const goals = writeGoal(goalText.dataset.goalText, goal => { goal.text = goalText.value; });
        if (goals) commitPortfolio({goals}, {paint: false});
        goalText.closest('.goal-card')?.querySelector('.goal-example')?.remove();
        return;
      }
      const goalNote = e.target.closest('[data-goal-note]');
      if (goalNote) {
        const goals = writeGoal(goalNote.dataset.goalNote, goal => { goal.note = goalNote.value; });
        if (goals) commitPortfolio({goals}, {paint: false});
        goalNote.closest('.goal-card')?.querySelector('.goal-example')?.remove();
        return;
      }
      const owner = e.target.closest('[data-pilot-owner]');
      if (owner) { patchPilot(owner.dataset.pilotOwner, {owner: owner.value}); refreshPilot(owner.dataset.pilotOwner); return; }
      const measure = e.target.closest('[data-pilot-measure]');
      if (measure) { patchPilot(measure.dataset.pilotMeasure, {measure: measure.value}); refreshPilot(measure.dataset.pilotMeasure); return; }
      const baseline = e.target.closest('[data-pilot-baseline]');
      if (baseline) { patchPilot(baseline.dataset.pilotBaseline, {baseline: baseline.value}); refreshPilot(baseline.dataset.pilotBaseline); return; }
      const target = e.target.closest('[data-pilot-target]');
      if (target) { patchPilot(target.dataset.pilotTarget, {target: target.value}); refreshPilot(target.dataset.pilotTarget); return; }
      const learn = e.target.closest('[data-pilot-learn]');
      if (learn) { patchPilot(learn.dataset.pilotLearn, {learn: learn.value}); refreshPilot(learn.dataset.pilotLearn); return; }
      const confirmer = e.target.closest('[data-pilot-confirmer]');
      if (confirmer) { patchPilot(confirmer.dataset.pilotConfirmer, {confirmer: confirmer.value}); refreshPilot(confirmer.dataset.pilotConfirmer); return; }
      const expand = e.target.closest('[data-pilot-expand]');
      if (expand) { patchPilot(expand.dataset.pilotExpand, {expand_if: expand.value}); return; }
      const reviseLine = e.target.closest('[data-pilot-revise]');
      if (reviseLine) { patchPilot(reviseLine.dataset.pilotRevise, {revise_if: reviseLine.value}); return; }
      const stopLine = e.target.closest('[data-pilot-stop]');
      if (stopLine) { patchPilot(stopLine.dataset.pilotStop, {stop_if: stopLine.value}); return; }
      const cost = e.target.closest('[data-pilot-cost]');
      if (cost) {
        const id = cost.dataset.pilotCost;
        const saved = savedPilot(id);
        const source = saved.costs == null ? displayPilot(id).costs : saved.costs;
        const costs = {};
        for (const [key] of COST_LINES) {
          const line = source?.[key] || {};
          costs[key] = {low: line.low ?? 0, high: line.high ?? 0};
        }
        const key = cost.dataset.costKey;
        const side = cost.dataset.costSide === 'high' ? 'high' : 'low';
        const text = cost.value.trim();
        const num = Number(text);
        costs[key] = {...costs[key], [side]: text === '' ? '' : (Number.isFinite(num) ? num : text)};
        patchPilot(id, {costs});
        refreshPilot(id);
        return;
      }
      if (e.target.id === 'task-q') { view.taskQuery = e.target.value; paintTasks(panels.tasks); }
    },
    toggle(e) {
      const fold = e.target;
      if (!(fold instanceof HTMLDetailsElement)) return;
      if (fold.classList.contains('pilot-fold')) {
        const id = fold.querySelector('[data-pilot]')?.dataset.pilot;
        if (!id) return;
        if (fold.open) view.pilotOpen.add(id); else view.pilotOpen.delete(id);
      }
      if (fold.classList.contains('ready-card')) {
        const id = fold.querySelector('[data-check]')?.dataset.check;
        if (!id) return;
        if (fold.open) view.readyOpen.add(id); else view.readyOpen.delete(id);
      }
    },
    tab(e) {
      const btn = e.target.closest('[role="tab"]');
      if (btn) show(btn.dataset.tab);
    },
    tabKey(e) {
      const i = TABS.indexOf(view.tab);
      const next = {ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: TABS.length - 1}[e.key];
      if (next == null) return;
      e.preventDefault();
      show(TABS[(next + TABS.length) % TABS.length], {focus: true});
    },
    beforePrint() {
      for (const t of ['team', 'portfolio', 'initiatives', 'opportunities']) if (!view.rendered.has(t)) { render[t](); view.rendered.add(t); }
      view.printState = {
        iniFilter: view.iniFilter, oppAll: view.oppAll, iniView: view.iniView,
        gridOpen: new Set(view.gridOpen), enableOpen: view.enableOpen, runOpen: view.runOpen,
        iniOpen: new Set(view.iniOpen),
      };
      view.iniFilter = 'all';
      view.iniOpen = new Set([...view.iniOpen, ...Object.keys(ACTIONS)]);
      view.oppAll = false;
      view.gridOpen = new Set(QUADRANT_KEYS);
      view.enableOpen = true;
      view.runOpen = true;
      render.portfolio();
      render.opportunities();
      panels.initiatives.innerHTML = printInitiatives();
      document.getElementById('print-roles').innerHTML = `<h2 class="print-title">The roles</h2>` +
        R.roles.filter(r => r.fte > 0).map(r => `<article class="print-role">${roleTwin(r, {headingLevel: 3})}</article>`).join('');
      for (const t of TABS) panels[t].dataset.printTitle = document.getElementById(`tab-${t}`).textContent;
    },
    afterPrint() {
      if (view.printState) Object.assign(view, view.printState);
      render.portfolio();
      render.initiatives();
      render.opportunities();
      document.getElementById('print-roles').innerHTML = '';
    },
    setOverrides(next) {
      gridOverrides = next && typeof next === 'object' ? next : {};
      paintOpen();
    },
    snapshot,
  };
  if (!controller.bound) {
    const root = document.getElementById('step-5');
    root.addEventListener('click', e => controller.current.click(e));
    root.addEventListener('change', e => controller.current.change(e));
    root.addEventListener('input', e => controller.current.input(e));
    root.addEventListener('toggle', e => controller.current.toggle(e), true);
    const tabs = document.getElementById('tabs');
    tabs.addEventListener('click', e => controller.current.tab(e));
    tabs.addEventListener('keydown', e => controller.current.tabKey(e));
    controller.bound = true;
  }
  view.rendered.clear();
  for (const t of TABS) panels[t].innerHTML = '';
  show(view.tab);
  return {
    beforePrint: () => controller.current.beforePrint(),
    afterPrint: () => controller.current.afterPrint(),
    setOverrides: next => controller.current.setOverrides(next),
    snapshot: () => controller.current.snapshot(),
  };
}
const controller = {current: null, bound: false};
