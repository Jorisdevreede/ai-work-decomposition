// Builds data-model.js: the numbers and texts this mockup shows, taken from the real flow model
// (prototypes/flow/model.js) for the default Noordhaven HR team. Run from the project root:
//   node mockups/a-journey/build-data-model.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {computeTeam, DEFAULT_SETUP} from '../../prototypes/flow/model.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const proto = path.join(here, '../../prototypes');
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

const jobs = {};
for (const r of DEFAULT_SETUP.roles) jobs[r.code] = readJson(path.join(proto, 'flow/data/jobs', `${r.code}.json`));
const slots = readJson(path.join(proto, 'data/system-slots.json'));
const profile = readJson(path.join(proto, 'data/company-noordhaven.json'));
const out = computeTeam(DEFAULT_SETUP, jobs, slots, profile);

const SHORT = {
  '11-3121.00': 'HR Manager',
  '13-1071.00': 'HR Specialist',
  '13-1151.00': 'Training and Development Specialist',
  '13-1141.00': 'Compensation and Benefits Specialist',
  '43-4161.00': 'HR Assistant',
  '43-3051.00': 'Payroll Clerk',
};
const r0 = (n) => Math.round(n);
const r1 = (n) => Math.round(n * 10) / 10;
const r2 = (n) => Math.round(n * 100) / 100;

const product = Object.fromEntries(out.systems.map((s) => [s.id, s.product || null]));
const slotLabel = Object.fromEntries(Object.entries(slots.slots || {}).map(([id, s]) => [id, s.label]));
const sysName = (id) => product[id] || profile.systems?.[id] || slotLabel[id] || id;

const tidy = (text) => String(text || '')
  .replace(/\bthe (AFAS Profit|SharePoint|Recruitee|Outlook|Studytube|Excel|Power BI)\b/g, '$1')
  .replace(/\ba (AFAS Profit|SharePoint|Recruitee|Outlook|Studytube|Excel|Power BI)\b/g, '$1')
  .replace(/([a-z][a-z /-]*?) \[not supplied\]/g, '$1 (not named yet)')
  .replace(/AFAS Profit, and AFAS Profit/g, 'AFAS Profit')
  .replace(/AFAS Profit and AFAS Profit/g, 'AFAS Profit');

const groups = (g) => Object.fromEntries(Object.entries(g).map(([k, v]) => [k, {before: r1(v.baseline_hours), after: r1(v.remaining_hours)}]));

// Approach per step, in the brief's vocabulary, from the model's rung and building block.
function approachOf(s) {
  if (s.rung === 'eliminate') return 'remove';
  if (s.block === 'conversation') return 'human';
  if (s.rung === 'stays_manual') return s.remaining_pct < 100 && s.block !== 'none' ? 'amplify' : 'human';
  switch (s.block) {
    case 'crud_app': return 'records';
    case 'artefact_generator': return 'artefact';
    case 'dashboard': return 'dashboard';
    case 'workflow_automation': case 'notification': case 'integration': return 'workflow';
    case 'judgement_step': return s.rung === 'deterministic_plus_loop' ? 'amplify' : 'rule';
    case 'answer_desk': return s.rung === 'deterministic_plus_loop' ? 'artefact' : 'rule';
    default: return 'rule';
  }
}
// Two steps set to traditional ML by hand, so the mockup shows that approach on real steps.
const ML_OVERRIDE = {
  'Inspect personnel documents and identify the case type.': 'A classifier trained on past filed cases proposes the case type; low-confidence documents go to a person.',
  'Compare hours with rosters and approved leave': 'An anomaly model trained on past pay runs flags unusual hours; the clerk reviews only what it flags.',
};

const range = (s) => {
  const m = String(s || '').match(/(\d+)\s*-\s*(\d+)/);
  return m ? [Number(m[1]), Number(m[2])] : [0, 0];
};
function effortOf(bd = {}) {
  const parts = ['coding', 'integration', 'testing_rollout'].map((k) => range(bd[k]));
  const low = parts.reduce((a, p) => a + p[0], 0);
  const high = parts.reduce((a, p) => a + p[1], 0);
  const mid = (low + high) / 2;
  const band = mid <= 15 ? 'S' : mid <= 30 ? 'M' : 'L';
  return {band, low, high, mid, consent: range(bd.consent_and_access)};
}

function stepOut(s) {
  let approach = approachOf(s);
  let note = null;
  for (const [needle, why] of Object.entries(ML_OVERRIDE)) {
    if (s.what.startsWith(needle)) { approach = 'ml'; note = why; }
  }
  return {
    what: tidy(s.what),
    actor: s.actor,
    means: s.today_means,
    systems: (s.systems || []).map(sysName).filter((v, i, a) => a.indexOf(v) === i),
    fate: s.fate,
    remaining: s.remaining_pct,
    approach,
    note,
    gate: Boolean(s.human_gate),
    before: r1(s.baseline_hours),
    returned: r1(s.hours_returned),
  };
}

const allOps = out.tasks.map((t) => {
  const effort = effortOf(t.build_days);
  return {t, effort, priority: t.value_eur / Math.max(effort.mid, 1)};
}).filter((o) => o.t.hours_returned > 0).sort((a, b) => b.priority - a.priority);

const picked = allOps.slice(0, 24);
for (const code of Object.keys(SHORT)) {
  if (!picked.some((o) => o.t.code === code)) picked.push(allOps.find((o) => o.t.code === code));
}
// Make sure the payroll check that carries the ML example is in the list.
const payrollCheck = allOps.find((o) => o.t.steps.some((s) => s.what.startsWith('Compare hours with rosters and approved leave')));
if (payrollCheck && !picked.includes(payrollCheck)) picked.push(payrollCheck);
picked.sort((a, b) => b.priority - a.priority);

const opportunities = picked.map(({t, effort, priority}, i) => ({
  id: `op${i + 1}`,
  rank: i + 1,
  code: t.code,
  role: SHORT[t.code],
  task: tidy(t.short),
  hours: r0(t.hours_returned),
  before: r0(t.baseline_hours),
  value: r0(t.value_eur),
  saved_pct: r0(t.time_saved_pct),
  effort,
  priority: r0(priority),
  design: tidy(t.design),
  human_edge: tidy(t.human_edge),
  ambition: t.ambition ? tidy(t.ambition.what) : null,
  new_work: (t.new_work || []).slice(0, 3).map(tidy),
  steps: t.steps.map(stepOut),
}));

const roles = out.roles.map((r) => ({
  code: r.code,
  title: SHORT[r.code],
  onet_title: r.title,
  fte: r.fte,
  cost: r.cost_per_hour,
  tasks: r.tasks.length,
  steps: r.tasks.reduce((a, t) => a + t.steps.length, 0),
  before: r0(r.baseline_hours),
  after: r0(r.remaining_hours),
  returned: r0(r.hours_returned),
  fte_returned: r2(r.fte_returned),
  value: r0(r.value_eur),
  speedup: r2(r.speedup),
  by_means: groups(r.by_means),
  by_fate: groups(r.by_fate),
  drudgery: r.twin.drudgery.map((d) => ({task: tidy(d.short), design: tidy(d.design), hours: r0(d.hours_returned)})),
  altitude: tidy(r.twin.altitude[0]),
  ambitions: r.twin.ambitions.slice(0, 3).map(tidy),
  human_edge: r.twin.human_edge.slice(0, 4).map(tidy),
  skills: r.twin.skills_to_grow.slice(0, 6).map(tidy),
  reach: r.twin.reach.filter((x) => typeof x === 'string').slice(0, 2).map(tidy),
}));

const hs = out.roles.find((r) => r.code === '13-1071.00');
const hsTasks = hs.tasks.map((t) => ({
  task: tidy(t.short),
  hours_per_person: r0(t.baseline_hours / hs.fte),
  returned_per_person: r0(t.hours_returned / hs.fte),
  saved_pct: r0(t.time_saved_pct),
})).sort((a, b) => b.hours_per_person - a.hours_per_person);

const approachMix = {};
for (const t of out.tasks) for (const s of t.steps) {
  const a = stepOut(s).approach;
  approachMix[a] = (approachMix[a] || 0) + 1;
}

const team = out.team;
const model = {
  source: 'prototypes/flow/model.js, default Noordhaven HR team, computed ' + new Date().toISOString().slice(0, 10),
  counts: out.counts,
  team: {
    before: r0(team.baseline_hours),
    after: r0(team.remaining_hours),
    returned: r0(team.hours_returned),
    fte_returned: r2(team.fte_returned),
    value: r0(team.value_eur),
    cost_before: r0(team.baseline_cost_eur),
    speedup: r2(team.speedup),
    ceiling: r2(team.theoretical_ceiling),
    human_only_share: r2(team.human_only_share),
    by_means: groups(team.by_means),
    by_fate: groups(team.by_fate),
    business_case: out.business_case.years.map((y) => ({year: y.year, adoption: y.adoption_pct, hours: r0(y.hours_returned), fte: r2(y.fte_returned), value: r0(y.value_eur)})),
    three_year_value: r0(out.business_case.three_year_value_eur),
  },
  approach_mix: approachMix,
  systems: out.systems.filter((s) => s.step_count >= 9).map((s) => ({id: s.id, label: s.label, product: s.product || null, steps: s.step_count})),
  roles,
  hs_tasks: hsTasks,
  opportunities,
  opportunities_total: allOps.length,
};

const body = `// Generated by build-data-model.mjs from the real flow model. Do not edit by hand.\nexport const MODEL = ${JSON.stringify(model)};\n`;
fs.writeFileSync(path.join(here, 'data-model.js'), body);
console.log(`data-model.js: ${opportunities.length} opportunities, ${roles.length} roles, ${(body.length / 1024).toFixed(0)} KB`);
console.log('approach mix', JSON.stringify(approachMix));
console.log(opportunities.map((o) => `${o.rank} ${o.role} | ${o.task.slice(0, 60)} | ${o.hours}h EUR${o.value} ${o.effort.band}(${o.effort.low}-${o.effort.high}) p${o.priority}`).join('\n'));
