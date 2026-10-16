// The team flow: five steps from a team to a plan. State lives in localStorage; the model runs here.
import {computeTeam, DEFAULT_SETUP, portfolioGrid, QUADRANT_LABEL, CALL_LABEL} from './model.js';
import {esc, fmtInt, fmtEur, fmtFte, fmtPct, HOURS_PER_FTE, download, slotPlain, fillMeter, actionLabel, humanize} from './ui.js';
import {renderResults} from './results.js';

const KEY = 'team-reimagine.flow.v1';
const GRID_KEY = 'team-reimagine.flow.grid.v1';
const PORTFOLIO_KEY = 'team-reimagine.flow.portfolio.v1';
const GRID_CALLS = new Set(['start', 'continue', 'edit', 'merge', 'stop']);
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const STEP_NAMES = ['Your team', 'Roles', 'Systems', 'Working it out', 'Your plan'];
const SYSTEMS_VISIBLE = 8;
const TASKS_VISIBLE = 7;

// Default hourly cost by role: the spec's HR rates, otherwise by SOC group (an assumption the lead edits).
const RATES = {'11-3121.00': 95, '13-1071.00': 75, '13-1151.00': 68, '13-1141.00': 75, '43-4161.00': 50, '43-3051.00': 52};
const GROUP_RATES = [['23-1', 95], ['23-2', 60], ['11', 95], ['15', 80], ['13', 75], ['27', 65], ['41', 60], ['43', 50]];
const defaultRate = code => RATES[code] ?? GROUP_RATES.find(([p]) => code.startsWith(p))?.[1] ?? 70;
const TEAMS = {
  HR: DEFAULT_SETUP.roles.map(r => [r.code, r.fte, r.cost_per_hour]),
  // The simulated Noordhaven finance team (config/teams.json), one O*NET job per role.
  Finance: [['11-3031.00', 1, 120], ['11-3031.01', 1, 95], ['13-2011.00', 2, 70], ['43-3031.00', 3, 45], ['43-3011.00', 1, 45], ['13-2031.00', 2, 80]],
};

let index = null;       // data/jobs/index.json
let jobsByCode = null;  // code -> index entry
let slots = null;       // ../data/system-slots.json
let sample = null;      // ../data/company-noordhaven.json
const jobCache = new Map();
let result = null;
let results = null;     // results view controller
let working = false;
let state = null;

/* ------------------------------------------------------------------ state */
let keySeq = 0;
const newKey = () => `r${Date.now().toString(36)}${(keySeq++).toString(36)}`;
function teamRoles(fn) {
  const preset = TEAMS[fn];
  if (preset) return preset.map(([code, fte, rate]) => ({key: newKey(), code, fte, cost_per_hour: rate, rateTouched: false}));
  const jobs = index.jobs.filter(j => j.function === fn);
  const lead = jobs.find(j => j.code.startsWith('11'));
  const pick = [...(lead ? [lead] : []), ...jobs.filter(j => j !== lead)].slice(0, 5);
  return pick.map(j => ({key: newKey(), code: j.code, fte: j.code.startsWith('11') ? 1 : 2, cost_per_hour: defaultRate(j.code), rateTouched: false}));
}
function fresh() {
  return {v: 1, step: 1, maxStep: 1, team: {name: '', function: 'HR'}, roles: teamRoles('HR'), rolesEdited: false,
    systems: {}, systemsSkipped: false, tab: 'team', role: null, computed: false};
}
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (!s || s.v !== 1 || !Array.isArray(s.roles)) return null;
    s.roles = s.roles.filter(r => r && (r.code == null || jobsByCode.has(r.code))).map(r => ({...r, key: r.key || newKey()}));
    return {...fresh(), ...s};
  } catch { return null; }
}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private mode: the flow still works */ } };
function loadOverrides() {
  try {
    const raw = JSON.parse(localStorage.getItem(GRID_KEY));
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
    const out = {};
    for (const [id, value] of Object.entries(raw)) {
      if (!value || typeof value !== 'object') continue;
      const entry = {};
      const call = String(value.call || '').toLowerCase();
      if (GRID_CALLS.has(call)) entry.call = call;
      if (value.owner_wants === true || value.owner_wants === false) entry.owner_wants = value.owner_wants;
      if (entry.call || entry.owner_wants === true || entry.owner_wants === false) out[id] = entry;
    }
    return out;
  } catch { return {}; }
}
function saveOverride(id, patch) {
  const all = loadOverrides();
  const next = {...(all[id] || {})};
  if (Object.prototype.hasOwnProperty.call(patch, 'call')) {
    const call = String(patch.call || '').toLowerCase();
    if (GRID_CALLS.has(call)) next.call = call;
    else delete next.call;
  }
  if (Object.prototype.hasOwnProperty.call(patch, 'owner_wants')) {
    if (patch.owner_wants === true || patch.owner_wants === false) next.owner_wants = patch.owner_wants;
    else delete next.owner_wants;
  }
  if (!next.call && next.owner_wants == null) delete all[id];
  else all[id] = next;
  try { localStorage.setItem(GRID_KEY, JSON.stringify(all)); } catch { /* private mode: the choice lasts for this view */ }
  return all;
}
function loadPortfolio() {
  try {
    const raw = JSON.parse(localStorage.getItem(PORTFOLIO_KEY));
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    return raw;
  } catch { return null; }
}
function savePortfolio(data) {
  try { localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(data)); } catch { /* private mode: the choice lasts for this view */ }
}
function planSnapshot() {
  return results?.snapshot?.() || null;
}
function gridById() {
  const snap = planSnapshot();
  if (snap?.byId) return snap.byId;
  return new Map(portfolioGrid(result, gridProfile(), loadOverrides()).items.map(item => [item.id, item]));
}
const setup = () => ({
  name: state.team.name || `${state.team.function} team`,
  function: state.team.function,
  roles: state.roles.filter(r => r.code).map(r => ({code: r.code, fte: Number(r.fte), cost_per_hour: Number(r.cost_per_hour)})),
});
const profile = () => ({systems: state.systemsSkipped ? {} : {...state.systems}});
// For the grid, no named system at all (skipped or left empty) means data readiness is unknown, not zero.
const gridProfile = () => state.systemsSkipped || !Object.values(state.systems || {}).some(v => String(v || '').trim())
  ? null : profile();
const signature = () => JSON.stringify([setup(), profile()]);

// Share link: the setup (not the results) in the URL hash, recomputed when opened.
function encodePlan() {
  const plan = {t: state.team, r: state.roles.filter(r => r.code).map(r => [r.code, Number(r.fte), Number(r.cost_per_hour)]), s: state.systems, k: state.systemsSkipped};
  const bytes = new TextEncoder().encode(JSON.stringify(plan));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function decodePlan(text) {
  try {
    const bin = atob(text.replace(/-/g, '+').replace(/_/g, '/'));
    const plan = JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0))));
    const roles = (plan.r || []).filter(([code]) => jobsByCode.has(code)).map(([code, fte, rate]) => ({key: newKey(), code, fte: +fte || 0, cost_per_hour: +rate || 0, rateTouched: true}));
    if (!roles.length) return null;
    return {...fresh(), team: {name: String(plan.t?.name ?? ''), function: String(plan.t?.function ?? 'HR')}, roles, rolesEdited: true,
      systems: plan.s && typeof plan.s === 'object' ? plan.s : {}, systemsSkipped: !!plan.k, step: 4, maxStep: 5};
  } catch { return null; }
}

/* ------------------------------------------------------------------ data */
async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.json();
}
function loadJob(code) {
  if (!jobCache.has(code)) {
    const p = getJSON(`data/jobs/${code}.json`);
    p.catch(() => jobCache.delete(code));
    jobCache.set(code, p);
  }
  return jobCache.get(code);
}
async function loadJobs(codes, onProgress) {
  const unique = [...new Set(codes)];
  let done = 0;
  const entries = await Promise.all(unique.map(async code => {
    const job = await loadJob(code);
    onProgress?.(++done, unique.length);
    return [code, job];
  }));
  return Object.fromEntries(entries);
}

/* ------------------------------------------------------------------ navigation */
function go(step, {focus = true} = {}) {
  if (working && step !== 4) return;
  state.step = step;
  if (step !== 4) state.maxStep = Math.max(state.maxStep, step);
  for (const el of $$('.step')) el.hidden = Number(el.dataset.step) !== step;
  if (step !== 4) save();
  paintStepper();
  if (step === 1) enterTeam();
  if (step === 2) renderRoles();
  if (step === 3) enterSystems();
  if (step === 4) runWork();
  if (focus) {
    window.scrollTo({top: 0});
    $(`#step-${step} .step-title`)?.focus({preventScroll: true});
  }
}
function paintStepper() {
  const step = state.step;
  const typed = step === 1 && state.team.name.trim().length > 0;
  for (const li of $$('#stepper li')) {
    const n = Number(li.dataset.step);
    const done = n < step || (typed && n === 1);
    li.dataset.state = n === step && !done ? 'current' : done ? 'done' : 'todo';
    if (typed && n === 2) li.dataset.state = 'todo';
    const btn = $('button', li);
    const dot = $('.stepper-dot', li);
    dot.dataset.n = n;
    const reachable = !working && n !== 4 && n !== step && (n <= Math.min(state.maxStep, 3) || (n === 5 && state.computed));
    btn.disabled = !reachable;
    if (n === step) btn.setAttribute('aria-current', 'step'); else btn.removeAttribute('aria-current');
    btn.setAttribute('aria-label', `Step ${n}: ${STEP_NAMES[n - 1]}${done ? ', done' : n === step ? ', current' : ''}`);
  }
  const frac = typed ? 0.125 : (step - 1) / 4;
  $('#stepper-fill').style.width = `${frac * 100}%`;
  const compact = $('#stepper-compact');
  compact.innerHTML = `<span class="sc-label"><span>Step ${step} of 5</span><strong>${esc(STEP_NAMES[step - 1])}</strong></span><span class="sc-bar"><span style="width:${Math.max(frac, 0.04) * 100}%"></span></span>`;
}

/* ------------------------------------------------------------------ step 1 */
function enterTeam() {
  $('#team-name').value = state.team.name;
  $('#team-function').value = state.team.function;
}
function bindTeam() {
  const fns = [...new Set(index.jobs.map(j => j.function))].sort((a, b) => (a === 'HR' ? -1 : b === 'HR' ? 1 : a.localeCompare(b)));
  $('#team-function').innerHTML = fns.map(f => `<option value="${esc(f)}">${esc(f)}</option>`).join('');
  $('#team-name').addEventListener('input', e => { state.team.name = e.target.value; save(); paintStepper(); });
  $('#team-function').addEventListener('change', e => {
    state.team.function = e.target.value;
    if (!state.rolesEdited) state.roles = teamRoles(state.team.function);
    $('#function-note').textContent = state.rolesEdited
      ? 'Your roles stay as you set them. You can reset them to a typical team in the next step.'
      : 'We prefill a typical team for this function. You can change every role in the next step.';
    save();
  });
  $('#team-form').addEventListener('submit', e => {
    e.preventDefault();
    state.team.name = $('#team-name').value.trim() || `${state.team.function} team`;
    go(2);
  });
}

/* ------------------------------------------------------------------ step 2 */
const ICON_SEARCH = '<svg class="icon combo-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.2-4.2"/></svg>';
const ICON_TRASH = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3"/></svg>';

function roleRow(r, i) {
  const job = r.code ? jobsByCode.get(r.code) : null;
  const title = job ? job.title : '';
  const hint = job ? `<span class="tag tag-secondary">${esc(job.code)}</span>${fmtInt(job.task_count)} tasks · ${esc(job.function)}` : 'Type to search 98 jobs by title or code';
  return `<div class="role-row-wrap${r.code ? '' : ' is-invalid'}" data-key="${r.key}" role="group" aria-label="Role ${i + 1}">
    <div class="roles-row">
      <div class="role-cell-name">
        <span class="mobile-label" id="lbl-${r.key}">Role ${i + 1}</span>
        <div class="combo">
          <input class="input" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="cl-${r.key}"
            aria-label="Role ${i + 1}" autocomplete="off" spellcheck="false" value="${esc(title)}" placeholder="Search a role" data-field="code">
          ${ICON_SEARCH}
          <ul class="combo-list" id="cl-${r.key}" role="listbox" aria-label="Matching jobs" hidden></ul>
        </div>
        <span class="role-hint">${hint}</span>
      </div>
      <div><span class="mobile-label">People (FTE)</span><div class="num-input"><input class="input" type="number" inputmode="decimal" min="0" max="999" step="0.1" value="${esc(r.fte)}" data-field="fte" aria-label="People (FTE), role ${i + 1}"></div></div>
      <div><span class="mobile-label">Cost per hour</span><div class="num-input has-prefix"><span class="prefix" aria-hidden="true">€</span><input class="input" type="number" inputmode="decimal" min="0" max="9999" step="1" value="${esc(r.cost_per_hour)}" data-field="rate" aria-label="Cost per hour in euros, role ${i + 1}"></div></div>
      <div class="role-cell-actions">
        <button class="btn-text" type="button" data-act="tasks" aria-expanded="false" aria-controls="rt-${r.key}"${r.code ? '' : ' disabled'}>See tasks</button>
        <button class="icon-btn" type="button" data-act="remove" aria-label="Remove role ${i + 1}${title ? `: ${esc(title)}` : ''}">${ICON_TRASH}</button>
      </div>
    </div>
    <div class="role-tasks" id="rt-${r.key}" hidden></div>
  </div>`;
}
function renderRoles() {
  $('#role-rows').innerHTML = state.roles.map(roleRow).join('');
  $('#roles-lede').textContent = state.rolesEdited
    ? 'Your team as you set it. Change the roles, the people in each (FTE) and the hourly cost at any time.'
    : `We filled in a typical ${state.team.function} team. Change the roles, the people in each (FTE) and the hourly cost to match yours.`;
  paintTotals();
}
function paintTotals() {
  const roles = state.roles.filter(r => r.code);
  const fte = roles.reduce((s, r) => s + (Number(r.fte) || 0), 0);
  const cost = roles.reduce((s, r) => s + (Number(r.fte) || 0) * HOURS_PER_FTE * (Number(r.cost_per_hour) || 0), 0);
  $('#roles-total').innerHTML = `<strong>${roles.length}</strong> roles · <strong>${fmtFte(fte)}</strong> FTE · <strong>${fmtInt(fte * HOURS_PER_FTE)}</strong> hours a year · about <strong>${fmtEur(cost)}</strong> a year at these rates`;
}
const rowOf = el => state.roles.find(r => r.key === el.closest('[data-key]')?.dataset.key);

function matches(query) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const own = state.team.function;
  const list = index.jobs.filter(j => words.every(w => j.title.toLowerCase().includes(w) || j.code.includes(w) || j.function.toLowerCase().includes(w)));
  return list.sort((a, b) => (a.function === own ? 0 : 1) - (b.function === own ? 0 : 1) || a.title.localeCompare(b.title)).slice(0, 60);
}
function openCombo(input, query) {
  const list = document.getElementById(input.getAttribute('aria-controls'));
  const items = matches(query);
  list.innerHTML = items.length
    ? items.map((j, i) => `<li role="option" id="${list.id}-o${i}" data-code="${j.code}" aria-selected="false"><span>${esc(j.title)}</span><span class="combo-meta">${esc(j.function)}</span></li>`).join('')
    : '<li class="combo-empty" role="option" aria-disabled="true" aria-selected="false">No job matches. Try a shorter word.</li>';
  list.hidden = false;
  input.setAttribute('aria-expanded', 'true');
  input.removeAttribute('aria-activedescendant');
}
function closeCombo(input, restore = true) {
  const list = document.getElementById(input.getAttribute('aria-controls'));
  if (list) list.hidden = true;
  input.setAttribute('aria-expanded', 'false');
  input.removeAttribute('aria-activedescendant');
  const r = rowOf(input);
  if (restore && r) input.value = r.code ? jobsByCode.get(r.code).title : '';
}
function moveActive(input, delta) {
  const list = document.getElementById(input.getAttribute('aria-controls'));
  const opts = $$('[data-code]', list);
  if (!opts.length) return;
  let i = opts.findIndex(o => o.getAttribute('aria-selected') === 'true');
  i = i < 0 ? (delta > 0 ? 0 : opts.length - 1) : (i + delta + opts.length) % opts.length;
  opts.forEach((o, k) => o.setAttribute('aria-selected', String(k === i)));
  input.setAttribute('aria-activedescendant', opts[i].id);
  opts[i].scrollIntoView({block: 'nearest'});
}
function pickRole(input, code) {
  const r = rowOf(input);
  if (!r) return;
  r.code = code;
  if (!r.rateTouched) r.cost_per_hour = defaultRate(code);
  state.rolesEdited = true;
  closeCombo(input, false);
  save();
  const i = state.roles.indexOf(r);
  const wrap = input.closest('.role-row-wrap');
  wrap.outerHTML = roleRow(r, i);
  $('#roles-error').textContent = '';
  paintTotals();
  $(`[data-key="${r.key}"] [data-field="fte"]`)?.focus();
}
function bindRoles() {
  const rows = $('#role-rows');
  rows.addEventListener('focusin', e => {
    const input = e.target.closest('[role="combobox"]');
    if (input) { input.select(); openCombo(input, ''); }
  });
  rows.addEventListener('focusout', e => {
    const input = e.target.closest('[role="combobox"]');
    if (input) setTimeout(() => { if (document.activeElement !== input) closeCombo(input); }, 120);
  });
  rows.addEventListener('input', e => {
    const t = e.target;
    const r = rowOf(t);
    if (!r) return;
    if (t.dataset.field === 'code') { openCombo(t, t.value); return; }
    const v = t.value === '' ? NaN : Number(t.value);
    if (t.dataset.field === 'fte') r.fte = Number.isFinite(v) && v >= 0 ? v : t.value;
    if (t.dataset.field === 'rate') { r.cost_per_hour = Number.isFinite(v) && v >= 0 ? v : t.value; r.rateTouched = true; }
    t.setAttribute('aria-invalid', String(!(Number.isFinite(v) && v >= 0)));
    state.rolesEdited = true;
    save();
    paintTotals();
  });
  rows.addEventListener('keydown', e => {
    const input = e.target.closest('[role="combobox"]');
    if (!input) return;
    const list = document.getElementById(input.getAttribute('aria-controls'));
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (list.hidden) openCombo(input, '');
      moveActive(input, e.key === 'ArrowDown' ? 1 : -1);
    } else if (e.key === 'Enter') {
      const active = input.getAttribute('aria-activedescendant');
      const opt = active ? document.getElementById(active) : $('[data-code]', list);
      if (!list.hidden && opt) { e.preventDefault(); pickRole(input, opt.dataset.code); }
    } else if (e.key === 'Escape' && !list.hidden) {
      e.preventDefault();
      closeCombo(input);
    }
  });
  rows.addEventListener('mousedown', e => {
    const opt = e.target.closest('[data-code]');
    if (opt) { e.preventDefault(); pickRole($('[role="combobox"]', opt.closest('.combo')), opt.dataset.code); }
  });
  rows.addEventListener('click', e => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const r = rowOf(btn);
    if (btn.dataset.act === 'remove') {
      const i = state.roles.indexOf(r);
      state.roles.splice(i, 1);
      state.rolesEdited = true;
      save();
      renderRoles();
      const next = $$('#role-rows [data-act="remove"]')[Math.min(i, state.roles.length - 1)];
      (next || $('#add-role')).focus();
    }
    if (btn.dataset.act === 'tasks') toggleTasks(btn, r);
  });
  $('#add-role').addEventListener('click', () => {
    const r = {key: newKey(), code: null, fte: 1, cost_per_hour: 70, rateTouched: false};
    state.roles.push(r);
    state.rolesEdited = true;
    save();
    renderRoles();
    $(`[data-key="${r.key}"] [role="combobox"]`).focus();
  });
  $('#reset-roles').addEventListener('click', () => {
    state.roles = teamRoles(state.team.function);
    state.rolesEdited = false;
    $('#roles-error').textContent = '';
    save();
    renderRoles();
  });
  $('#roles-continue').addEventListener('click', () => {
    const err = validateRoles();
    $('#roles-error').textContent = err;
    if (!err) go(3);
    else $$('.role-row-wrap.is-invalid [role="combobox"], #role-rows [aria-invalid="true"]')[0]?.focus();
  });
}
function validateRoles() {
  if (!state.roles.length) return 'Add at least one role to continue.';
  const empty = state.roles.findIndex(r => !r.code);
  if (empty >= 0) return `Pick a job for role ${empty + 1}, or remove that row.`;
  const badFte = state.roles.findIndex(r => !(Number.isFinite(Number(r.fte)) && r.fte !== '' && Number(r.fte) >= 0));
  if (badFte >= 0) return `Role ${badFte + 1} needs a number of people (FTE), 0 or more.`;
  const badRate = state.roles.findIndex(r => !(Number.isFinite(Number(r.cost_per_hour)) && r.cost_per_hour !== '' && Number(r.cost_per_hour) >= 0));
  if (badRate >= 0) return `Role ${badRate + 1} needs a cost per hour, 0 or more.`;
  if (!state.roles.some(r => Number(r.fte) > 0)) return 'Give at least one role more than 0 FTE.';
  return '';
}
async function toggleTasks(btn, r) {
  const panel = document.getElementById(btn.getAttribute('aria-controls'));
  const open = btn.getAttribute('aria-expanded') !== 'true';
  btn.setAttribute('aria-expanded', String(open));
  btn.textContent = open ? 'Hide tasks' : 'See tasks';
  panel.hidden = !open;
  if (!open) return;
  panel.innerHTML = '<p class="small muted">Loading tasks…</p>';
  try {
    const job = await loadJob(r.code);
    const tasks = [...job.tasks].sort((a, b) => b.task_share - a.task_share);
    const hours = (Number(r.fte) || 0) * HOURS_PER_FTE;
    const max = tasks[0]?.task_share || 1;
    const li = t => `<li><span>${esc(t.short || t.statement)}</span>${fillMeter(t.task_share, max, `${fmtPct(t.task_share * 100)} of the role's time`)}<span class="num">${fmtPct(t.task_share * 100)}</span></li>`;
    panel.innerHTML = `<h3>${esc(job.title)}: ${tasks.length} tasks, by share of time</h3>
      <p class="xs muted">Share of the role's time from O*NET importance and frequency${hours ? `; for ${fmtFte(Number(r.fte))} FTE that is ${fmtInt(hours)} hours a year in total` : ''}.</p>
      <ol class="task-shares">${tasks.slice(0, TASKS_VISIBLE).map(li).join('')}</ol>
      ${tasks.length > TASKS_VISIBLE ? `<button class="btn-text more-btn" type="button">Show all ${tasks.length} tasks</button>` : ''}`;
    $('.more-btn', panel)?.addEventListener('click', e => {
      $('.task-shares', panel).innerHTML = tasks.map(li).join('');
      e.target.remove();
    });
  } catch (err) {
    panel.innerHTML = `<p class="field-error">Could not load the tasks (${esc(err.message)}).</p>`;
  }
}

/* ------------------------------------------------------------------ step 3 */
let systemsList = [];
async function enterSystems() {
  const box = $('#systems');
  box.innerHTML = '<p class="small muted">Finding the systems your roles use…</p>';
  try {
    const s = setup();
    const jobs = await loadJobs(s.roles.map(r => r.code));
    if (state.step !== 3) return;
    const out = computeTeam(s, jobs, slots, {systems: {}});
    systemsList = out.systems.filter(x => x.id !== 'OTHER' && x.step_count > 0);
    renderSystems(false);
  } catch (err) {
    box.innerHTML = `<p class="field-error">Could not read the task graphs (${esc(err.message)}). <button class="btn-text" type="button" id="sys-retry">Try again</button></p>`;
    $('#sys-retry').addEventListener('click', enterSystems);
  }
}
function sysRow(x) {
  const slot = slots.slots[x.id];
  const value = state.systems[x.id] ?? '';
  const ex = (slot.examples || '').split(',')[0].trim();
  return `<div class="sys-row${value ? ' is-filled' : ''}" data-slot="${x.id}">
    <label for="sys-${x.id}">Which ${esc(slot.label)} do you use?<span class="xs">Used in ${fmtInt(x.step_count)} steps · holds ${esc(slot.holds)}</span></label>
    <input class="input" id="sys-${x.id}" type="text" autocomplete="off" maxlength="60" value="${esc(value)}" placeholder="${ex ? `For example ${esc(ex)}` : 'Product name'}">
  </div>`;
}
function renderSystems(all) {
  const box = $('#systems');
  const filledHidden = systemsList.slice(SYSTEMS_VISIBLE).some(x => state.systems[x.id]);
  const showAll = all || filledHidden || systemsList.length <= SYSTEMS_VISIBLE + 2;
  const shown = showAll ? systemsList : systemsList.slice(0, SYSTEMS_VISIBLE);
  box.innerHTML = shown.map(sysRow).join('') + (showAll ? '' : `<div class="sys-more"><button class="btn-text" type="button" id="sys-more">Show ${systemsList.length - SYSTEMS_VISIBLE} more systems</button></div>`);
  $('#sys-more')?.addEventListener('click', () => { renderSystems(true); $(`#sys-${systemsList[SYSTEMS_VISIBLE].id}`)?.focus(); });
  paintSystemsNote();
}
function paintSystemsNote() {
  const filled = systemsList.filter(x => state.systems[x.id]).length;
  $('#systems-note').textContent = `${systemsList.length} systems, most used first. ${filled ? `${filled} named.` : 'None named yet.'}`;
  $('#clear-systems').hidden = !filled;
}
function bindSystems() {
  $('#systems').addEventListener('input', e => {
    const row = e.target.closest('[data-slot]');
    if (!row) return;
    const v = e.target.value.trim();
    if (v) state.systems[row.dataset.slot] = v; else delete state.systems[row.dataset.slot];
    row.classList.toggle('is-filled', !!v);
    save();
    paintSystemsNote();
  });
  $('#fill-example').addEventListener('click', () => {
    let n = 0;
    for (const x of systemsList) if (sample.systems[x.id]) { state.systems[x.id] = sample.systems[x.id]; n++; }
    save();
    renderSystems(false);
    $('#systems-note').textContent = `Filled ${n} of ${systemsList.length} from the Noordhaven example. The rest keep their generic names; change any of them.`;
  });
  $('#clear-systems').addEventListener('click', () => {
    for (const x of systemsList) delete state.systems[x.id];
    save();
    renderSystems(false);
  });
  $('#systems-continue').addEventListener('click', () => { state.systemsSkipped = false; go(4); });
  $('#systems-skip').addEventListener('click', () => { state.systemsSkipped = true; go(4); });
}

/* ------------------------------------------------------------------ step 4 */
const frame = () => new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
async function runWork() {
  if (working) return;
  working = true;
  paintStepper();
  const list = $('#work-list');
  const bar = $('#work-bar');
  const s = setup();
  const nRoles = s.roles.length;
  const phases = [
    ['load', `Loading the task graphs of ${nRoles} ${nRoles === 1 ? 'role' : 'roles'}`],
    ['weigh', 'Weighing tasks by importance and how often they happen'],
    ['trace', 'Following every step through your systems'],
    ['group', 'Grouping the changes into initiatives'],
    ['twin', 'Writing the team twin and one twin per role'],
  ];
  list.innerHTML = phases.map(([id, text]) => `<li data-phase="${id}" data-state="todo"><span class="work-mark" aria-hidden="true"></span><span class="work-text">${esc(text)}</span><span class="work-count"></span></li>`).join('');
  $('#work-error').textContent = '';
  const set = (id, st, count) => {
    const li = $(`[data-phase="${id}"]`, list);
    li.dataset.state = st;
    if (count != null) $('.work-count', li).textContent = count;
  };
  const progress = pct => { bar.setAttribute('aria-valuenow', String(Math.round(pct))); $('#work-fill').style.width = `${pct}%`; };
  try {
    progress(2);
    set('load', 'running', `0 of ${new Set(s.roles.map(r => r.code)).size}`);
    const jobs = await loadJobs(s.roles.map(r => r.code), (done, total) => { set('load', 'running', `${done} of ${total}`); progress(2 + (done / total) * 58); });
    set('load', 'done');
    await frame();
    set('weigh', 'running');
    await frame();
    result = computeTeam(s, jobs, slots, profile());
    state.computed = true;
    state.computedSig = signature();
    set('weigh', 'done', `${fmtInt(result.counts.tasks)} tasks`);
    progress(70);
    await frame();
    set('trace', 'done', `${fmtInt(result.counts.steps)} steps`);
    progress(78);
    await frame();
    set('group', 'done', `${fmtInt(result.initiatives.length)} initiatives`);
    progress(86);
    await frame();
    set('twin', 'running');
    await frame();
    paintResults();
    set('twin', 'done', `${nRoles + 1} twins`);
    progress(100);
    $('#working-lede').textContent = `Done: ${fmtInt(result.counts.tasks)} tasks and ${fmtInt(result.counts.steps)} steps across ${nRoles} roles.`;
    await new Promise(r => setTimeout(r, 450)); // long enough to read the counts, shorter than the work
    working = false;
    go(5);
  } catch (err) {
    working = false;
    paintStepper();
    $$('[data-state="running"]', list).forEach(li => { li.dataset.state = 'todo'; });
    $('#work-error').innerHTML = `Something went wrong: ${esc(err.message)}. <button class="btn-text" type="button" id="work-retry">Try again</button> <button class="btn-text" type="button" id="work-back">Back to roles</button>`;
    $('#work-retry').addEventListener('click', () => runWork());
    $('#work-back').addEventListener('click', () => go(2));
  }
}

/* ------------------------------------------------------------------ step 5 */
function paintResults() {
  const s = setup();
  const fte = s.roles.reduce((a, r) => a + r.fte, 0);
  const named = Object.keys(profile().systems).filter(id => result.systems.some(x => x.id === id)).length;
  const sysText = state.systemsSkipped || !named ? 'generic system names' : `${named} of ${result.systems.filter(x => x.id !== 'OTHER').length} systems named`;
  $('#results-meta').innerHTML = `${esc(s.name)} · ${s.roles.length} roles · ${fmtFte(fte)} FTE · ${esc(sysText)}`;
  $('#tabs [data-tab="initiatives"]').innerHTML = `Initiatives<span class="tab-count">${result.initiatives.length}</span>`;
  $('#tabs [data-tab="tasks"]').innerHTML = `Tasks<span class="tab-count">${result.tasks.length}</span>`;
  results = renderResults({
    result, slots, mode: state.systemsSkipped ? 'plain' : 'gap', teamName: s.name, fn: s.function,
    tab: state.tab, role: state.role,
    onState: patch => { Object.assign(state, patch); save(); },
    profile: gridProfile(),
    overrides: loadOverrides(),
    onGrid: (id, patch) => { results?.setOverrides(saveOverride(id, patch)); },
    portfolio: loadPortfolio(),
    onPortfolio: data => { savePortfolio(data); },
  });
}
function bindResults() {
  $('#print-plan').addEventListener('click', () => window.print());
  window.addEventListener('beforeprint', () => results?.beforePrint());
  window.addEventListener('afterprint', () => results?.afterPrint());
  $('#dl-csv').addEventListener('click', () => download(`${fileBase()}-initiatives.csv`, 'text/csv;charset=utf-8', toCSV()));
  $('#dl-json').addEventListener('click', () => download(`${fileBase()}-plan.json`, 'application/json', toJSON()));
  $('#copy-link').addEventListener('click', async () => {
    const url = `${location.origin}${location.pathname}#plan=${encodePlan()}`;
    const note = $('#share-note');
    try {
      await navigator.clipboard.writeText(url);
      note.textContent = 'Link copied. It carries your setup, not your data; the plan is worked out again when someone opens it.';
    } catch {
      note.innerHTML = `Copy this link: <a href="${esc(url)}">${esc(url.slice(0, 64))}…</a>`;
    }
  });
}
const fileBase = () => (setup().name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'team');
const r0 = n => Math.round(n);
function toCSV() {
  const head = ['rank', 'initiative', 'action_type', 'flows', 'quarter', 'effort_band', 'effort_days_low', 'effort_days_high',
    'gross_hours_returned_per_year', 'gross_fte_returned', 'gross_value_eur_per_year', 'year1_value_eur_50pct_adoption',
    'year2_value_eur_80pct_adoption', 'year3_value_eur_100pct_adoption', 'roles', 'task_count', 'tasks', 'systems',
    'quadrant', 'readiness', 'prize', 'call',
    'goal', 'owner', 'outcome', 'checkable', 'cost_low_eur', 'cost_high_eur', 'hours_destination', 'status', 'readiness_checks_yes', 'time_to_first_value'];
  const cell = v => { const t = String(v ?? ''); return /[",\n;]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; };
  const sysName = id => (state.systemsSkipped ? null : state.systems[id]) || slots.slots[id]?.label || id;
  const snap = planSnapshot();
  const scored = snap?.byId || gridById();
  const rows = result.initiatives.map((x, i) => {
    const item = scored.get(x.id);
    const extra = snap?.rows?.[x.id] || {};
    return [i + 1, slotPlain(x.name), actionLabel(x.action_type), (x.flows?.length ? x.flows : [x.workflow]).filter(Boolean).map(humanize).join('; '), x.quarter, x.effort.band,
      x.effort.days_low, x.effort.days_high, r0(x.hours_returned), x.fte_returned.toFixed(2), r0(x.value_eur),
      ...x.business_case.years.map(y => r0(y.value_eur)), x.roles.map(r => r.title).join('; '), x.tasks.length,
      x.tasks.map(t => slotPlain(t.short)).join('; '), x.systems.map(sysName).join('; '),
      QUADRANT_LABEL[item.quadrant], Number(item.readiness.toFixed(2)), Number(item.prize.toFixed(2)), CALL_LABEL[item.call],
      extra.goal || '', extra.owner || '', extra.outcome || '', extra.checkable || '', extra.cost_low ?? '', extra.cost_high ?? '',
      extra.hours_destination || '', extra.status || '', extra.readiness_yes ?? '', extra.time_to_first_value || ''];
  });
  return '﻿' + [head, ...rows].map(r => r.map(cell).join(',')).join('\r\n');
}
function toJSON() {
  const s = setup();
  const strip = ({by_fate, by_kind, by_means, by_rung, ...rest}) => ({...rest, by_fate, by_means});
  const snap = planSnapshot();
  const scored = snap?.byId || gridById();
  return JSON.stringify({
    generated_at: new Date().toISOString(),
    note: 'Generic estimates from O*NET-based task graphs. Values are gross capacity, not cash savings; build, licence and upkeep costs are not included.',
    setup: {...s, systems: profile().systems},
    assumptions: result.assumptions,
    warnings: result.warnings,
    counts: result.counts,
    team: strip(result.team),
    roles: result.roles.map(r => ({id: r.id, code: r.code, title: r.title, fte: r.fte, cost_per_hour: r.cost_per_hour,
      hours_returned: r.hours_returned, fte_returned: r.fte_returned, value_eur: r.value_eur, time_saved_pct: r.time_saved_pct, initiative_ids: r.initiative_ids})),
    portfolio: {
      goals: snap?.goals || [],
      running: snap?.running || [],
      pilots: snap?.pilots || {},
      checks: snap?.checks || {},
      policy: snap?.policy || 'no',
      enabling: snap?.enabling || [],
    },
    initiatives: result.initiatives.map((x, i) => {
      const item = scored.get(x.id);
      const extra = snap?.rows?.[x.id] || {};
      return {rank: i + 1, id: x.id, name: slotPlain(x.name), action_type: x.action_type, flows: x.flows ?? (x.workflow ? [x.workflow] : []),
        main_system: x.main_system, systems: x.systems, quarter: x.quarter, effort: x.effort, priority: x.priority,
        hours_returned: x.hours_returned, fte_returned: x.fte_returned, value_eur: x.value_eur, business_case: x.business_case,
        roles: x.roles, tasks: x.tasks.map(t => ({...t, short: slotPlain(t.short)})), step_ids: x.step_ids,
        quadrant: QUADRANT_LABEL[item.quadrant], readiness: Number(item.readiness.toFixed(2)),
        prize: Number(item.prize.toFixed(2)), call: CALL_LABEL[item.call],
        goal: extra.goal || '', owner: extra.owner || '', outcome: extra.outcome || '', checkable: extra.checkable || '',
        cost_low_eur: extra.cost_low ?? '', cost_high_eur: extra.cost_high ?? '', hours_destination: extra.hours_destination || '',
        status: extra.status || '', readiness_checks_yes: extra.readiness_yes ?? '', time_to_first_value: extra.time_to_first_value || ''};
    }),
  }, null, 2);
}

/* ------------------------------------------------------------------ start */
async function start() {
  try {
    [index, slots, sample] = await Promise.all([getJSON('data/jobs/index.json'), getJSON('../data/system-slots.json'), getJSON('../data/company-noordhaven.json')]);
  } catch (err) {
    $('#load-status').innerHTML = `<span class="error">Could not load the job library (${esc(err.message)}). Serve the folder with <code>python3 -m http.server 8790</code> and reload.</span>`;
    return;
  }
  jobsByCode = new Map(index.jobs.map(j => [j.code, j]));
  $('#load-status').hidden = true;
  const shared = location.hash.startsWith('#plan=') ? decodePlan(location.hash.slice(6)) : null;
  if (shared) history.replaceState(null, '', location.pathname + location.search);
  state = shared || load() || fresh();
  bindTeam();
  bindRoles();
  bindSystems();
  bindResults();
  $('#stepper').addEventListener('click', e => {
    const li = e.target.closest('li[data-step]');
    if (!li || $('button', li).disabled) return;
    const n = Number(li.dataset.step);
    if (n === 5) {
      const err = validateRoles();
      if (err) { go(2); $('#roles-error').textContent = err; return; }
      go(state.computedSig === signature() && result ? 5 : 4);
    }
    else go(n);
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-go]');
    if (b) go(Number(b.dataset.go));
  });
  // A lead who comes back lands where they left; results are recomputed, never stored.
  if (state.step >= 4) go(4, {focus: false});
  else go(state.step, {focus: false});
}
start();
