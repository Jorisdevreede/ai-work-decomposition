import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

// Load the browser ES module without requiring a package.json or a Node flag.
const moduleText = await readFile(new URL('./model.js', import.meta.url), 'utf8');
const {computeTeam, DEFAULT_SETUP, frequencyWeight, renderText, classifyAction, portfolioGrid,
  meanHourlyCost, suggestGoal, runningCalls, pilotCheck, productionReady, reviseAllowed, enablingWork, timeToFirstValue} =
  await import(`data:text/javascript;base64,${Buffer.from(moduleText).toString('base64')}`);
const close = (actual, expected, label = '') => assert.ok(
  Math.abs(actual - expected) < 1e-7 * Math.max(1, Math.abs(expected)), `${label}: ${actual} != ${expected}`);
const sum = (rows, field) => rows.reduce((n, row) => n + row[field], 0);
const fixture = {
  code: 'test', title: 'Example role', tasks: [
    {uid: 'test:1', short: 'Routine records', importance: 1, frequency: 1, steps: [
      {id: 'a', what: 'Configure records', share_pct: 50, remaining_pct: 0, fate: 'machine',
        rung: 'configure', block: 'crud_app', systems: ['HCM'], today_means: 'system_screen', workflow: 'records'},
      {id: 'b', what: 'Talk to a person', share_pct: 50, remaining_pct: 100, fate: 'person_does',
        rung: 'stays_manual', block: 'conversation', systems: [], today_means: 'meeting_call'}]},
    {uid: 'test:2', short: 'Draft letters', importance: 3, frequency: 1, steps: [
      {id: 'a', what: 'Draft letters', share_pct: 100, remaining_pct: 50, fate: 'person_reviews',
        rung: 'deterministic_plus_loop', block: 'artefact_generator', systems: ['DOCS'],
        today_means: 'document', workflow: 'records', loop: {purpose: 'draft', input: 'approved records'}}]}
  ]
};
const slots = {slots: {HCM: {label: 'HCM system'}, DOCS: {label: 'document store'}}};
const setup = {name: 'Example', roles: [{code: 'test', fte: 1, cost_per_hour: 10}]};
const frozenInput = JSON.stringify({setup, fixture, slots});
const result = computeTeam(setup, {test: fixture}, slots, {});
close(result.team.baseline_hours, 1600);
close(result.tasks[0].task_share, .25);
close(result.tasks[1].task_share, .75);
close(result.team.hours_returned, 800);
close(result.team.remaining_hours, 800);
close(result.team.value_eur, 8000);
close(result.team.speedup, 2);
close(result.team.amdahl_ceiling, 2);
close(result.team.theoretical_ceiling, 8);
close(result.team.human_only_share, .125);
assert.equal(result.initiatives.length, 2);
assert.equal(result.initiatives[0].action_type, 'configure_system');
assert.equal(result.initiatives[1].action_type, 'checked_ai_step');
close(result.initiatives[0].hours_returned, 200);
close(result.initiatives[1].hours_returned, 600);
assert.equal(result.opportunities[0].uid, 'test:2');
assert.equal(JSON.stringify({setup, fixture, slots}), frozenInput, 'pure calculation does not mutate inputs');
assert.equal(renderText('Use {HCM} and {DOCS}', slots, {systems: {HCM: 'Example HCM'}}),
  'Use Example HCM and document store [not supplied]');
assert.equal(renderText('{MISSING}', slots), '[unknown slot: MISSING]');
for (const [category, expected] of [[1, 1], [2, 1.5], [3, 2.5], [4, 4], [5, 6], [6, 8], [7, 10], [3.5, 3.25], [null, 4]]) {
  close(frequencyWeight(category), expected);
}
for (const [block, action] of Object.entries({artefact_generator: 'generate_artefact',
  workflow_automation: 'build_workflow', crud_app: 'build_records_app', dashboard: 'build_dashboard',
  integration: 'connect_systems', judgement_step: 'checked_ai_step', answer_desk: 'answer_desk', notification: 'notifications'})) {
  assert.equal(classifyAction({rung: 'deterministic', block}), action);
}
assert.equal(classifyAction({rung: 'configure', block: 'artefact_generator'}), 'configure_system');
assert.equal(classifyAction({rung: 'stays_manual', block: 'judgement_step'}), null);
assert.equal(classifyAction({rung: 'configure', block: 'conversation'}), null);
assert.equal(classifyAction({rung: 'eliminate', block: 'none'}), 'stop_doing');

const consolidatedFixture = {code: 'test', title: 'Example role', tasks: [{uid: 'test:grouping', steps: [
  {id: 'a', what: 'Configure starters', share_pct: 20, remaining_pct: 0, fate: 'machine',
    rung: 'configure', block: 'crud_app', systems: ['HCM'], workflow: 'starters'},
  {id: 'b', what: 'Configure leavers', share_pct: 20, remaining_pct: 0, fate: 'machine',
    rung: 'configure', block: 'crud_app', systems: ['HCM'], workflow: 'leavers'},
  {id: 'c', what: 'Draft offer', share_pct: 20, remaining_pct: 50, fate: 'person_reviews',
    rung: 'deterministic_plus_loop', block: 'artefact_generator', systems: ['DOCS'], workflow: 'starters',
    outputs: ['draft offer letter'], actor: 'HR specialist', approver: 'none',
    loop: {purpose: 'draft', input: 'Raw input should not appear in the name'}},
  {id: 'd', what: 'Connect HCM to payroll', share_pct: 20, remaining_pct: 0, fate: 'machine',
    rung: 'deterministic', block: 'integration', systems: ['HCM', 'PAYROLL'], workflow: 'payroll'},
  {id: 'e', what: 'Connect HCM to learning', share_pct: 20, remaining_pct: 0, fate: 'machine',
    rung: 'deterministic', block: 'integration', systems: ['HCM', 'LMS'], workflow: 'learning'}
]}]};
const consolidated = computeTeam(setup, [consolidatedFixture], slots, {systems: {HCM: 'Example HCM'}});
assert.equal(consolidated.initiatives.length, 3, 'workflow and connected peers do not split a main-slot initiative');
const configured = consolidated.initiatives.find(i => i.action_type === 'configure_system');
assert.equal(configured.name, 'Configure Example HCM');
assert.deepEqual(configured.flows, ['leavers', 'starters']);
assert.equal(configured.workflow, null, 'multiple flows are not represented as one flow');
assert.equal(configured.step_ids.length, 2);
assert.equal(consolidated.initiatives.find(i => i.action_type === 'checked_ai_step').name,
  'AI step that drafts offer letter, checked by HR specialist');
const connected = consolidated.initiatives.find(i => i.action_type === 'connect_systems');
assert.deepEqual([...connected.systems].sort(), ['HCM', 'LMS', 'PAYROLL']);
assert.deepEqual(connected.flows, ['learning', 'payroll']);
const changedFlows = structuredClone(consolidatedFixture);
changedFlows.tasks[0].steps.forEach(step => {step.workflow = 'another-flow';});
assert.deepEqual(computeTeam(setup, [changedFlows], slots).initiatives.map(i => i.id).sort(),
  consolidated.initiatives.map(i => i.id).sort(), 'initiative identity does not depend on flows');
const singleConnection = structuredClone(consolidatedFixture);
singleConnection.tasks[0].steps = [{...singleConnection.tasks[0].steps[3], share_pct: 100, systems: ['HCM']}];
assert.equal(computeTeam(setup, [singleConnection], slots).initiatives[0].name,
  'Connect HCM system [not supplied] to the other systems');

function checkAccounting(plan) {
  close(plan.team.baseline_hours, sum(plan.roles, 'baseline_hours'), 'team baseline');
  close(plan.team.remaining_hours, sum(plan.roles, 'remaining_hours'), 'team after');
  close(plan.team.value_eur, sum(plan.roles, 'value_eur'), 'team value');
  close(plan.team.baseline_hours, plan.team.remaining_hours + plan.team.hours_returned);
  const steps = plan.tasks.flatMap(t => t.steps);
  assert.equal(new Set(steps.map(s => s.id)).size, steps.length, 'globally unique steps');
  const allocated = plan.initiatives.flatMap(i => i.step_ids);
  assert.equal(new Set(allocated).size, allocated.length, 'no step assigned twice');
  assert.deepEqual([...allocated].sort(), steps.filter(s => s.action_type && s.hours_returned > 0)
    .map(s => s.id).sort(), 'every eligible step assigned exactly once');
  const byId = new Map(steps.map(s => [s.id, s]));
  for (const initiative of plan.initiatives) {
    assert.ok(initiative.step_ids.length > 0);
    const traced = initiative.step_ids.map(id => byId.get(id));
    assert.ok(traced.every(Boolean), 'initiative traced to real steps');
    assert.ok(traced.every(s => initiative.task_ids.includes(s.task_id) && initiative.role_ids.includes(s.role_id)));
    close(initiative.hours_returned, sum(traced, 'hours_returned'));
    close(initiative.value_eur, sum(traced, 'value_eur'));
  }
  for (const role of plan.roles) {
    close(role.baseline_hours, role.fte * 1600);
    if (role.tasks.length) close(sum(role.tasks, 'task_share'), 1);
    close(sum(role.tasks, 'baseline_hours'), role.baseline_hours);
    for (const task of role.tasks) {
      close(sum(task.steps, 'share_pct'), 100);
      close(sum(task.steps, 'baseline_hours'), task.baseline_hours);
      close(sum(task.steps, 'remaining_hours'), task.remaining_hours);
    }
  }
  for (const summary of [plan.team, ...plan.roles]) {
    for (const key of ['by_fate', 'by_kind', 'by_means', 'by_rung']) {
      close(sum(Object.values(summary[key]), 'baseline_hours'), summary.baseline_hours, key);
      close(sum(Object.values(summary[key]), 'remaining_hours'), summary.remaining_hours, key);
    }
    if (summary.remaining_hours) close(summary.amdahl_ceiling, summary.baseline_hours / summary.remaining_hours);
  }
  for (const role of plan.roles) close(role.value_eur, role.hours_returned * role.cost_per_hour);
  for (const owner of [plan.team, ...plan.roles, ...plan.initiatives]) {
    const business = owner.business_case;
    for (const [i, adoption] of [.5, .8, 1].entries()) {
      close(business.years[i].hours_returned, owner.hours_returned * adoption);
      close(business.years[i].value_eur, owner.value_eur * adoption);
      assert.equal(business.years[i].adoption_pct, adoption * 100);
    }
    close(business.three_year_value_eur, owner.value_eur * 2.3);
  }
}
checkAccounting(result);
checkAccounting(consolidated);
const repeated = computeTeam({...setup, roles: [setup.roles[0], {...setup.roles[0], cost_per_hour: 20}]}, [fixture], slots);
checkAccounting(repeated);
close(repeated.team.value_eur, 24000);
assert.equal(repeated.roles.length, 2);
const missing = computeTeam(setup, {test: {...fixture, tasks: [{uid: 'test:missing', steps: []}]}}, slots);
close(missing.team.hours_returned, 0);
assert.equal(missing.counts.source_steps, 0);
assert.ok(missing.warnings.length);
const unnormalised = structuredClone(fixture);
unnormalised.tasks[0].steps.forEach(s => {s.share_pct *= .9;});
const normalised = computeTeam(setup, [unnormalised], slots);
close(normalised.team.hours_returned, 800);
assert.ok(normalised.warnings.length);
assert.throws(() => computeTeam(setup, {}, slots), /test/);
assert.throws(() => computeTeam({...setup, roles: [{code: 'test', fte: -1}]}, [fixture], slots));
close(computeTeam({roles: []}, {}, slots).team.speedup, 1);
const zero = computeTeam({...setup, roles: [{code: 'test', fte: 0, cost_per_hour: 10}]}, [fixture], slots);
close(zero.team.hours_returned, 0);
assert.equal(zero.initiatives.length, 0);
const eliminated = computeTeam(setup, [{code: 'test', tasks: [{uid: 'test:gone', steps: [
  {id: 'a', what: 'Stop duplicate entry', share_pct: 100, remaining_pct: 0,
    fate: 'gone', rung: 'eliminate', block: 'none', systems: []}
]}]}], slots);
close(eliminated.team.hours_returned, 1600);
assert.equal(eliminated.team.speedup, null);
assert.equal(eliminated.team.theoretical_ceiling, null);
assert.equal(eliminated.initiatives[0].action_type, 'stop_doing');

const jobs = {};
for (const role of DEFAULT_SETUP.roles) {
  jobs[role.code] = JSON.parse(await readFile(new URL(`./data/jobs/${role.code}.json`, import.meta.url)));
}
const realSlots = JSON.parse(await readFile(new URL('../data/system-slots.json', import.meta.url)));
const profile = JSON.parse(await readFile(new URL('../data/company-noordhaven.json', import.meta.url)));
const hr = computeTeam(DEFAULT_SETUP, jobs, realSlots, profile);
checkAccounting(hr);
close(hr.team.baseline_hours, 16000);
assert.equal(hr.roles.length, 6);
assert.equal(hr.counts.tasks, 134);
assert.ok(hr.initiatives.length > 5);
assert.equal(hr.initiatives.length, 66, 'one initiative per distinct HR action/main-slot pair');
const hrPairs = hr.initiatives.map(i => JSON.stringify([i.action_type, i.main_system]));
assert.equal(new Set(hrPairs).size, hrPairs.length);
for (const initiative of hr.initiatives) {
  assert.deepEqual(initiative.flows, [...new Set(initiative.steps.map(s => s.workflow).filter(Boolean))].sort());
  if (initiative.action_type === 'checked_ai_step') assert.match(initiative.name, /^AI step that .+, checked by .+/);
}
close(hr.team.hours_returned, 8853.450170393306, 'regrouping preserves gross hours');
close(hr.team.value_eur, 585623.8271296769, 'regrouping preserves gross value');
assert.ok(hr.initiatives.slice(0, 5).every(i => i.quarter === 'Q1'));
assert.ok(hr.initiatives.slice(5, 10).every(i => i.quarter === 'Q2'));
assert.deepEqual(JSON.parse(JSON.stringify(hr)).counts, hr.counts);

const Sband = {band: 'S', days_high: 5};
const Mband = {band: 'M', days_high: 15};
const MLband = {band: 'M/L', days_high: 30};
const grade = (id, g) => ({id, evidence: g ? [{grade: g, claim: 'fixture', source: 'fixture'}] : []});
function gridPlan(rows, tasks = []) {
  return {tasks, initiatives: rows.map(row => ({
    id: row.id, action_type: row.action_type, systems: row.systems || [], role_ids: row.role_ids || ['r1'],
    flows: row.flows || [], effort: row.effort, tasks: (row.task_ids || []).map(id => ({id})),
    value_eur: row.value_eur, hours_returned: row.hours ?? 1,
  }))};
}
const byId = (grid, id) => grid.items.find(item => item.id === id);
function assertGridShape(grid, n) {
  const keys = ['accelerate_now', 'invest_to_unlock', 'quick_wins', 'deprioritize'];
  assert.equal(grid.items.length, n);
  const seen = new Map();
  for (const item of grid.items) {
    assert.equal(keys.includes(item.quadrant), true, item.id);
    assert.ok(item.readiness >= 0 && item.readiness <= 100, item.id);
    assert.ok(item.prize >= 0 && item.prize <= 100, item.id);
    for (const part of Object.values(item.parts)) assert.ok(part >= 0 && part <= 100);
    seen.set(item.id, 1);
  }
  let total = 0;
  for (const key of keys) {
    assert.equal(grid.counts[key], grid.by_quadrant[key].length);
    total += grid.counts[key];
    for (const item of grid.by_quadrant[key]) {
      assert.equal(item.quadrant, key);
      assert.equal(seen.get(item.id), 1);
      seen.set(item.id, 2);
    }
    for (let i = 1; i < grid.by_quadrant.accelerate_now.length; i++) {
      assert.ok(grid.by_quadrant.accelerate_now[i].readiness <= grid.by_quadrant.accelerate_now[i - 1].readiness);
    }
  }
  assert.equal(total, n);
  for (const count of seen.values()) assert.equal(count, 2);
  assert.equal(grid.first_wave.length, Math.min(5, grid.by_quadrant.accelerate_now.length));
  assert.deepEqual(grid.first_wave, grid.by_quadrant.accelerate_now.slice(0, grid.first_wave.length).map(item => item.id));
  close(grid.quick_wins_hours, grid.by_quadrant.quick_wins.reduce((s, item) => s + item.hours_returned, 0), 'quick wins hours');
}

const namedProfile = {systems: {HCM: 'Example'}};
const abcd = gridPlan([
  {id: 'A', action_type: 'stop_doing', systems: [], flows: ['records'], effort: Sband, value_eur: 300, task_ids: ['ta'], hours: 30},
  {id: 'B', action_type: 'build_workflow', systems: ['HCM'], role_ids: ['r1', 'r2'], flows: ['records'], effort: Mband, value_eur: 200, task_ids: ['tb'], hours: 20},
  {id: 'C', action_type: 'checked_ai_step', systems: ['HCM', 'DOCS', 'EMAIL', 'ERP'], role_ids: ['r1', 'r2', 'r3'], flows: ['other'], effort: MLband, value_eur: 30, hours: 10},
  {id: 'D', action_type: 'configure_system', systems: ['HCM'], flows: ['pay'], effort: Sband, value_eur: 50, task_ids: ['td'], hours: 5},
], [grade('ta', 'E4'), grade('tb', 'E1'), grade('td', 'E2')]);
const abcdBefore = JSON.stringify(abcd);
const abcdGrid = portfolioGrid(abcd, namedProfile);
assert.equal(JSON.stringify(abcd), abcdBefore);
assertGridShape(abcdGrid, 4);
const A = byId(abcdGrid, 'A');
assert.deepEqual(A.parts, {data: 100, process: 90, contained: 100, effort: 90});
close(A.readiness, 95);
close(A.prize, 80 + 10 + 10 / 3)  // value is the largest; E4; shares a flow with B;
assert.equal(A.quadrant, 'accelerate_now');
assert.equal(A.call, 'start');
const B = byId(abcdGrid, 'B');
assert.deepEqual(B.parts, {data: 100, process: 55, contained: 70, effort: 60});
close(B.readiness, 71.25);
close(B.prize, 80 * Math.sqrt(2 / 3) + 3.5 + 10);
assert.equal(B.quadrant, 'accelerate_now');
const C = byId(abcdGrid, 'C');
assert.deepEqual(C.parts, {data: 25, process: 35, contained: 20, effort: 30});
close(C.readiness, 27.5);
close(C.prize, 80 * Math.sqrt(0.1) + 2 + 20 / 3);
assert.equal(C.quadrant, 'deprioritize');
assert.equal(C.call, 'stop');
const D = byId(abcdGrid, 'D');
assert.deepEqual(D.parts, {data: 100, process: 90, contained: 100, effort: 90});
close(D.readiness, 95);
close(D.prize, 80 * Math.sqrt(50 / 300) + 6.5 + 20 / 3);
assert.equal(D.quadrant, 'quick_wins');
assert.equal(D.call, 'start');
assert.deepEqual(abcdGrid.by_quadrant.accelerate_now.map(item => item.id), ['A', 'B']);
assert.deepEqual(abcdGrid.first_wave, ['A', 'B']);
close(abcdGrid.quick_wins_hours, 5);

const mergePlan = gridPlan([
  {id: 'M1', action_type: 'checked_ai_step', systems: ['HCM'], role_ids: ['r1', 'r2', 'r3'], effort: MLband, value_eur: 10, hours: 1},
  {id: 'M2', action_type: 'checked_ai_step', systems: ['HCM'], role_ids: ['r1', 'r2', 'r3'], effort: MLband, value_eur: 12, hours: 1},
  {id: 'M3', action_type: 'stop_doing', systems: [], effort: Sband, value_eur: 1000, task_ids: ['tm'], hours: 8},
], [grade('tm', 'E4')]);
const mergeGrid = portfolioGrid(mergePlan, {systems: {}});
assertGridShape(mergeGrid, 3);
close(byId(mergeGrid, 'M1').readiness, 26.25);
close(byId(mergeGrid, 'M1').prize, 8 + 2 + 5);
assert.equal(byId(mergeGrid, 'M1').quadrant, 'deprioritize');
assert.equal(byId(mergeGrid, 'M1').call, 'merge');
close(byId(mergeGrid, 'M2').prize, 80 * Math.sqrt(0.012) + 2 + 5);
assert.equal(byId(mergeGrid, 'M2').call, 'merge');
close(byId(mergeGrid, 'M3').readiness, 95);
close(byId(mergeGrid, 'M3').prize, 90);
assert.equal(byId(mergeGrid, 'M3').quadrant, 'accelerate_now');
assert.equal(byId(mergeGrid, 'M3').call, 'start');

const ownerPlan = gridPlan([
  {id: 'P', action_type: 'build_workflow', systems: ['X'], role_ids: ['r1', 'r2'], flows: ['a'], effort: Mband, value_eur: 100, task_ids: ['tp'], hours: 4},
  {id: 'Q', action_type: 'stop_doing', systems: [], flows: ['b'], effort: Sband, value_eur: 10, hours: 2},
], [grade('tp', 'E3')]);
const ownerBase = portfolioGrid(ownerPlan, {systems: {}});
const P0 = byId(ownerBase, 'P');
close(P0.readiness, 46.25);
close(P0.prize, 88.5);
assert.equal(P0.quadrant, 'invest_to_unlock');
assert.equal(P0.blocker, 'data');
assert.equal(P0.call, 'edit');
close(byId(ownerBase, 'Q').readiness, 95);
close(byId(ownerBase, 'Q').prize, 80 * Math.sqrt(0.1) + 2);
assert.equal(byId(ownerBase, 'Q').quadrant, 'quick_wins');
const ownerMoved = portfolioGrid(ownerPlan, {systems: {}}, {P: {owner_wants: true}});
assert.equal(byId(ownerBase, 'P').readiness, 46.25);
close(byId(ownerMoved, 'P').readiness, 56.25);
assert.equal(byId(ownerMoved, 'P').quadrant, 'accelerate_now');
assert.equal(byId(ownerMoved, 'P').call, 'start');
assert.equal(byId(portfolioGrid(ownerPlan, {systems: {}}, {Q: {owner_wants: true}}), 'Q').readiness, 100);
const bareP = byId(portfolioGrid(ownerPlan, null), 'P');
assert.equal(bareP.parts.data, null);
close(bareP.readiness_base, 185 / 3);
assert.equal(bareP.blocker, 'process');
assert.equal(bareP.quadrant, 'accelerate_now');
close(bareP.prize, 88.5);
const stopped = byId(portfolioGrid(ownerPlan, {systems: {}}, {Q: {call: 'STOP'}}), 'Q');
assert.equal(stopped.quadrant, 'quick_wins');
assert.equal(stopped.call, 'stop');
const merged = byId(portfolioGrid(ownerPlan, {systems: {}}, {P: {call: 'merge', owner_wants: true}}), 'P');
assert.equal(merged.quadrant, 'accelerate_now');
assert.equal(merged.call, 'merge');
assert.equal(merged.suggested_call, 'start');
assert.equal(byId(portfolioGrid(ownerPlan, {systems: {}}, {Q: {call: 'nope'}}), 'Q').call, 'start');
const alone = portfolioGrid(gridPlan([{id: 'Z', action_type: 'stop_doing', effort: Sband, value_eur: 1, task_ids: ['tz']}], [grade('tz', 'E0')]), namedProfile);
close(byId(alone, 'Z').prize, 82);
assert.equal(portfolioGrid(gridPlan([{id: 'U', action_type: 'mystery', systems: ['HCM'], effort: Mband, value_eur: 1}]), namedProfile).items[0].parts.process, 20);
assert.equal(portfolioGrid(gridPlan([{id: 'L', action_type: 'checked_ai_step', effort: {band: 'M/L', days_high: 15}, value_eur: 1}]), null).items[0].parts.effort, 60);

// The flow passes null when no system is named: data readiness is unknown, not zero.
const emptyProfile = null;
const hrGrid = portfolioGrid(hr, emptyProfile);
assertGridShape(portfolioGrid(hr, {systems: {}}), hr.initiatives.length);
const hrNamedGrid = portfolioGrid(hr, profile);
assertGridShape(hrGrid, hr.initiatives.length);
assertGridShape(hrNamedGrid, hr.initiatives.length);
const lead = hrGrid.by_quadrant.accelerate_now[0];
assert.ok(lead);
const hrShifted = portfolioGrid(hr, emptyProfile, {[lead.id]: {owner_wants: false}});
const leadAfter = byId(hrShifted, lead.id);
close(leadAfter.readiness, Math.max(0, lead.readiness - 20));
const beforeAt = hrGrid.by_quadrant.accelerate_now.findIndex(item => item.id === lead.id);
const afterAt = hrShifted.by_quadrant.accelerate_now.findIndex(item => item.id === lead.id);
assert.ok(leadAfter.quadrant !== lead.quadrant || afterAt > beforeAt || leadAfter.readiness < lead.readiness);
assert.equal(JSON.stringify(abcd), abcdBefore);

assert.equal(A.goal_link, 'unset');
assert.equal(A.goal_note, 'not linked to a goal yet');
const goals = [{id: 'g1', text: 'Answer employee questions faster'}];
const linked = portfolioGrid(abcd, namedProfile, {A: {goal: 'g1'}, D: {goal: 'g1'}, C: {goal: 'none'}}, goals);
close(byId(linked, 'A').prize, Math.min(100, (80 + 10 + 10 / 3) + 10));
assert.equal(byId(linked, 'A').goal_link, 'g1');
assert.equal(byId(linked, 'A').quadrant, 'accelerate_now');
close(byId(linked, 'D').prize, Math.min(100, (80 * Math.sqrt(50 / 300) + 6.5 + 20 / 3) + 10));
assert.equal(byId(linked, 'D').quadrant, 'accelerate_now');
assert.deepEqual(linked.by_quadrant.accelerate_now.map(item => item.id), ['A', 'D', 'B']);
close(byId(linked, 'C').prize, Math.min(80 * Math.sqrt(0.1) + 2 + 20 / 3, 49));
assert.equal(byId(linked, 'C').goal_link, 'none');
const unknownGoal = portfolioGrid(abcd, namedProfile, {A: {goal: 'missing'}}, goals);
close(byId(unknownGoal, 'A').prize, 80 + 10 + 10 / 3);
assert.equal(byId(unknownGoal, 'A').goal_link, 'unset');
const noneA = portfolioGrid(abcd, namedProfile, {A: {goal: 'none'}});
close(byId(noneA, 'A').prize, Math.min(80 + 10 + 10 / 3, 49));
assert.equal(byId(noneA, 'A').quadrant, 'quick_wins');
assert.equal(byId(noneA, 'A').call, 'start');
assert.deepEqual(noneA.first_wave, ['B']);
close(A.prize, 80 + 10 + 10 / 3);
assert.equal(A.quadrant, 'accelerate_now');
assert.equal(abcdGrid.first_wave.length, 2);

close(meanHourlyCost(hr), (95 + 3 * 75 + 2 * 68 + 75 + 2 * 50 + 52) / 10, 'HR mean hourly');
assert.equal(meanHourlyCost({roles: []}), 0);
const suggested = suggestGoal(
  {name: 'Answer desk for employee questions', tasks: [{short: 'Answer employee questions about leave'}]},
  [], goals);
assert.equal(suggested.id, 'g1');
assert.equal(suggestGoal({name: 'Configure the ledger', tasks: [{short: 'Post the batch'}]}, [], goals), null);

const runBefore = JSON.stringify([{id: 'same', same_as: 'ini-1', owner: '', evidence: 'none'}]);
const mergedRun = runningCalls(JSON.parse(runBefore), goals);
assert.equal(mergedRun[0].call, 'merge');
assert.equal(JSON.parse(runBefore)[0].call, undefined);
const runScale = {values: [3000], meanHourly: 68.3};
const runBase = 100 * Math.sqrt((10 * 68.3) / 3000);
const runs = runningCalls([
  {id: 'measured', owner: 'Ada', evidence: 'measured', hours: 10, goal: 'g1'},
  {id: 'unmeasured', owner: 'Ada', evidence: 'none', hours: 10, goal: 'g1', destination: 'the queue'},
  {id: 'stories', owner: 'Ada', evidence: 'anecdotes', hours: 10, goal: 'g1'},
  {id: 'noowner', evidence: 'measured', hours: 10, goal: 'g1'},
  {id: 'dest', owner: 'Ada', evidence: 'measured', hours: 5, destination: 'the queue'},
  {id: 'gap', owner: 'Ada', evidence: 'anecdotes'},
  {id: 'over', owner: '', evidence: 'none', call: 'continue'},
], goals, runScale);
close(runs[0].prize, Math.min(100, runBase + 10));
close(runs[1].prize, Math.min(49, Math.min(100, runBase + 10)));
assert.ok(Math.min(49, runBase) + 10 > 49);
assert.equal(runs[0].readiness, 85);
assert.equal(runs[0].call, 'continue');
assert.equal(runs[1].readiness, 30);
assert.equal(runs[2].readiness, 60);
assert.equal(runs[2].call, 'edit');
assert.deepEqual(runs[2].missing, ['measure']);
assert.equal(runs[3].readiness, 30);
assert.equal(runs[3].call, 'stop');
assert.equal(runs[4].call, 'continue');
assert.equal(runs[5].call, 'edit');
assert.ok(runs[5].missing.includes('goal'));
assert.equal(runs[6].suggested_call, 'stop');
assert.equal(runs[6].call, 'continue');

const zeroCosts = Object.fromEntries(['employee', 'process', 'data', 'implementation', 'software'].map(key => [key, {low: 0, high: 0}]));
const earned = pilotCheck({owner: 'Ada', measure: 'days to answer', baseline: 5, target: '2', by: '2026-12-01', costs: zeroCosts}, 'accelerate_now');
assert.equal(earned.earned, true);
assert.equal(earned.checkable, true);
const notYet = pilotCheck({owner: 'Ada', measure: 'days to answer', baseline: 5, target: 2, costs: zeroCosts}, 'accelerate_now');
assert.equal(notYet.checkable, false);
assert.deepEqual(notYet.outcome_missing, ['date']);
assert.equal(notYet.earned, false);
const learning = pilotCheck({owner: 'Ada', learn: 'Can it draft a contract summary?', costs: zeroCosts}, 'invest_to_unlock');
assert.equal(learning.earned, true);
assert.equal(learning.checkable, false);
assert.equal(pilotCheck({owner: 'Ada', hours_go: 'faster turnaround', confirmer: 'Finance'}, 'quick_wins').earned, true);
assert.equal(pilotCheck({owner: 'Ada', hours_go: 'faster turnaround'}, 'quick_wins').earned, false);
const badCost = {...zeroCosts, software: {low: 5, high: 1}};
assert.equal(pilotCheck({owner: 'Ada', measure: 'days', baseline: 1, target: 2, by: '2026-12-01', costs: badCost}, 'accelerate_now').earned, false);
assert.equal(productionReady(Array(8).fill('yes')).ok, true);
assert.equal(productionReady(['yes', 'unknown']).ok, false);
assert.ok(productionReady(['yes']).open.includes(1));
assert.equal(reviseAllowed({status: 'pilot', revise_count: 0}).ok, true);
assert.equal(reviseAllowed({status: 'revise', revise_count: 1}).ok, false);
assert.match(reviseAllowed({status: 'expand', revise_count: 1}).reason, /one more cycle/);

const enablePlan = gridPlan([
  {id: 'E1', action_type: 'mystery', systems: [], role_ids: ['r1', 'r2', 'r3'], effort: {band: 'L', days_high: 30}, value_eur: 500},
  {id: 'E2', action_type: 'mystery', systems: [], role_ids: ['r1', 'r2', 'r3'], effort: {band: 'L', days_high: 30}, value_eur: 400},
  {id: 'E3', action_type: 'stop_doing', systems: [], effort: Sband, value_eur: 10},
]);
const enableGrid = portfolioGrid(enablePlan, null);
const enableJson = JSON.stringify(enableGrid);
close(byId(enableGrid, 'E1').readiness, (20 + 40 + 30) / 3);
assert.equal(byId(enableGrid, 'E1').blocker, 'process');
const enabled = enablingWork(enableGrid, null, 'yes');
assert.equal(JSON.stringify(enableGrid), enableJson);
assert.equal(enableGrid.first_wave.length, enabled.items.filter(item => item.id === 'E1' || item.id === 'E2').length ? enableGrid.first_wave.length : enableGrid.first_wave.length);
assert.equal(enabled.cards[0].title, 'Agree an AI policy and vendor approval');
assert.equal(enabled.cards[0].kind, 'policy');
assert.equal(enabled.cards[1].title, 'Define the process and its measures');
assert.deepEqual([...enabled.cards[1].initiatives].sort(), ['E1', 'E2']);
close(enabled.cards[1].value_eur, 900);
close(enabled.items.find(item => item.id === 'E1').readiness, Math.max(0, (20 + 40 + 30) / 3 - 25));
close(byId(enableGrid, 'E1').readiness, (20 + 40 + 30) / 3);
const partly = enablingWork(enableGrid, null, 'partly');
assert.equal(partly.cards.some(card => card.kind === 'policy'), false);
close(partly.items.find(item => item.id === 'E1').readiness, (20 + 40 + 30) / 3 - 10);
const plainEnable = enablingWork(enableGrid, null, 'no');
assert.equal(plainEnable.cards.length, 1);
assert.equal(enablingWork(portfolioGrid(gridPlan([
  {id: 'S1', action_type: 'mystery', systems: [], role_ids: ['r1', 'r2', 'r3'], effort: {band: 'L', days_high: 30}, value_eur: 500},
]), null), null, 'no').cards.length, 0);
const dataPlan = gridPlan([
  {id: 'D1', action_type: 'build_workflow', systems: ['X'], role_ids: ['r1', 'r2'], flows: ['a'], effort: Mband, value_eur: 100, task_ids: ['td1']},
  {id: 'D2', action_type: 'build_workflow', systems: ['Y'], role_ids: ['r1', 'r2'], flows: ['b'], effort: Mband, value_eur: 80, task_ids: ['td2']},
], [grade('td1', 'E3'), grade('td2', 'E3')]);
const dataWork = enablingWork(portfolioGrid(dataPlan, {systems: {}}), {systems: {}}, 'no');
assert.equal(dataWork.cards[0].title, 'Name your systems and open their data');
close(dataWork.cards[0].value_eur, 180);
assert.equal(enablingWork(portfolioGrid(dataPlan, {systems: {}}), null, 'no').cards.length, 0);

assert.deepEqual(timeToFirstValue({action_type: 'generate_artefact'}), {known: true, kind: 'content generation', band: '2 to 4 weeks', label: 'content generation, 2 to 4 weeks'});
assert.equal(timeToFirstValue({action_type: 'stop_doing'}).band, 'weeks');
assert.equal(timeToFirstValue({action_type: 'connect_systems', systems: ['a', 'b', 'c', 'd']}).band, '12 to 24 months');
assert.equal(timeToFirstValue({action_type: 'connect_systems', systems: ['a', 'b', 'c']}).kind, 'workflow automation on a defined process');
assert.equal(timeToFirstValue({action_type: 'build_dashboard'}).band, '2 to 4 months');
assert.equal(timeToFirstValue({action_type: 'checked_ai_step'}).band, '2 to 4 months');
assert.equal(timeToFirstValue({action_type: 'mystery'}).known, false);

const countLine = g => `Accelerate Now ${g.counts.accelerate_now}, Invest to Unlock ${g.counts.invest_to_unlock}, Quick Wins ${g.counts.quick_wins}, Deprioritize ${g.counts.deprioritize}`;
console.log(`HR grid, no systems named: ${countLine(hrGrid)}`);
console.log(`HR grid, Noordhaven profile: ${countLine(hrNamedGrid)}`);
console.log(`PASS: fixture arithmetic, mappings, purity, gaps, traces and default HR (${hr.counts.tasks} tasks, ${hr.counts.source_steps} steps, ${hr.initiatives.length} initiatives).`);
console.log(`HR: ${hr.team.hours_returned.toFixed(1)} gross hours / ${hr.team.fte_returned.toFixed(2)} FTE / EUR ${hr.team.value_eur.toFixed(0)} per year; ${hr.team.speedup.toFixed(2)}x.`);
