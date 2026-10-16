/** Pure calculation for the static team flow. See MODEL.md for the contract. */
export const DEFAULT_SETUP = {
  name: 'HR team', function: 'HR', roles: [
    {code: '11-3121.00', fte: 1, cost_per_hour: 95},
    {code: '13-1071.00', fte: 3, cost_per_hour: 75},
    {code: '13-1151.00', fte: 2, cost_per_hour: 68},
    {code: '13-1141.00', fte: 1, cost_per_hour: 75},
    {code: '43-4161.00', fte: 2, cost_per_hour: 50},
    {code: '43-3051.00', fte: 1, cost_per_hour: 52}
  ]
};
const ANNUAL_HOURS = 1600;
const WEIGHTS = [1, 1.5, 2.5, 4, 6, 8, 10];
const BLOCK_ACTION = {
  artefact_generator: 'generate_artefact', workflow_automation: 'build_workflow',
  crud_app: 'build_records_app', dashboard: 'build_dashboard', integration: 'connect_systems',
  judgement_step: 'checked_ai_step', answer_desk: 'answer_desk', notification: 'notifications'
};
const EFFORT_BANDS = {
  stop_doing: 'S', configure_system: 'S', generate_artefact: 'S', notifications: 'S',
  answer_desk: 'M', build_dashboard: 'M', build_workflow: 'M', build_records_app: 'M',
  connect_systems: 'M', checked_ai_step: 'M/L'
};
const total = (rows, field) => rows.reduce((sum, row) => sum + row[field], 0);
const unique = rows => [...new Set(rows.filter(Boolean))];
const readable = text => String(text || 'work').replaceAll('-', ' ');
const ranked = (a, b) => b.value_eur - a.value_eur || b.hours_returned - a.hours_returned || a.id.localeCompare(b.id);
const emptyMetric = () => ({baseline_hours: 0, remaining_hours: 0, hours_returned: 0, value_eur: 0});

function nonnegative(value, label, fallback = 0) {
  const number = value === undefined || value === null || value === '' ? fallback : Number(value);
  if (!Number.isFinite(number) || number < 0) throw new Error(`${label} must be a finite nonnegative number.`);
  return number;
}

export function frequencyWeight(category) {
  if (category === undefined || category === null || category === '') return 4;
  const n = Number(category);
  if (!Number.isFinite(n)) return 4;
  const value = Math.min(7, Math.max(1, n));
  const index = Math.floor(value) - 1;
  return WEIGHTS[index] + (value - index - 1) * ((WEIGHTS[index + 1] ?? WEIGHTS[index]) - WEIGHTS[index]);
}

export function renderText(text, slots = {}, profile = {}) {
  const definitions = slots.slots || slots;
  const products = profile?.systems || {};
  return String(text ?? '').replace(/\{([A-Z][A-Z_]+)\}/g, (_, slot) => {
    const product = typeof products[slot] === 'string' ? products[slot].trim() : '';
    if (product) return product;
    return definitions[slot]?.label ? `${definitions[slot].label} [not supplied]` : `[unknown slot: ${slot}]`;
  });
}

function renderValue(value, slots, profile) {
  if (typeof value === 'string') return renderText(value, slots, profile);
  if (Array.isArray(value)) return value.map(item => renderValue(item, slots, profile));
  if (value && typeof value === 'object') return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, renderValue(item, slots, profile)]));
  return value;
}

export function classifyAction(step) {
  if (step.rung === 'stays_manual' || step.block === 'conversation') return null;
  if (step.rung === 'eliminate') return 'stop_doing';
  if (step.rung === 'configure') return 'configure_system';
  if (step.rung === 'deterministic_plus_loop') return 'checked_ai_step';
  return BLOCK_ACTION[step.block] || null;
}

function businessCase(hours, value) {
  return {
    gross: true, label: 'Gross capacity returned; adoption ramp, before build, licence and upkeep costs.',
    annual_hours: hours, annual_fte: hours / ANNUAL_HOURS, annual_value_eur: value,
    years: [.5, .8, 1].map((adoption, index) => ({year: index + 1, adoption_pct: adoption * 100,
      hours_returned: hours * adoption, fte_returned: hours * adoption / ANNUAL_HOURS, value_eur: value * adoption})),
    three_year_value_eur: value * 2.3
  };
}

function addMetric(target, step) {
  for (const field of ['baseline_hours', 'remaining_hours', 'hours_returned', 'value_eur']) target[field] += step[field];
}

function groupMetrics(steps, field) {
  const groups = {};
  for (const step of steps) {
    const key = step[field] || 'unspecified';
    if (!Object.hasOwn(groups, key)) groups[key] = emptyMetric();
    addMetric(groups[key], step);
  }
  return groups;
}

function summarise(steps) {
  const metric = emptyMetric();
  for (const step of steps) addMetric(metric, step);
  const speedup = metric.baseline_hours === 0 ? 1 : metric.remaining_hours === 0 ? null : metric.baseline_hours / metric.remaining_hours;
  const manualHours = total(steps.filter(s => s.rung === 'stays_manual' || s.block === 'conversation'), 'baseline_hours');
  return {...metric, fte_returned: metric.hours_returned / ANNUAL_HOURS,
    baseline_cost_eur: total(steps, 'baseline_cost_eur'), remaining_cost_eur: total(steps, 'remaining_cost_eur'),
    time_saved_pct: metric.baseline_hours ? 100 * metric.hours_returned / metric.baseline_hours : 0,
    speedup, amdahl_ceiling: speedup,
    human_only_share: metric.baseline_hours ? manualHours / metric.baseline_hours : 0,
    theoretical_ceiling: metric.baseline_hours === 0 ? 1 : manualHours ? metric.baseline_hours / manualHours : null,
    by_fate: groupMetrics(steps, 'fate'), by_kind: groupMetrics(steps, 'kind'),
    by_means: groupMetrics(steps, 'today_means'), by_rung: groupMetrics(steps, 'rung'),
    business_case: businessCase(metric.hours_returned, metric.value_eur)};
}

function effortFor(action) {
  const band = EFFORT_BANDS[action];
  const [low, high] = {S: [5, 5], M: [15, 15], L: [30, 30], 'M/L': [15, 30]}[band];
  return {band, days: (low + high) / 2, days_low: low, days_high: high,
    label: `${band} · ${low === high ? `about ${low}` : `${low}–${high}`} planning days; not a quote`};
}

function initiativeName(action, step, slots, profile) {
  const system = id => renderText(`{${id}}`, slots, profile);
  const output = step.outputs?.[0] || step.what;
  const workflow = readable(step.workflow);
  switch (action) {
    case 'stop_doing': return `Stop: ${step.what}`;
    case 'configure_system': {
      const slot = step.systems?.[0];
      const hasProduct = typeof profile?.systems?.[slot] === 'string' && profile.systems[slot].trim();
      return `Configure ${hasProduct ? '' : 'the '}${slot ? system(slot) : 'system [not supplied]'}`;
    }
    case 'generate_artefact': return `Generate ${output}`;
    case 'build_workflow': return `Automate the ${workflow} flow`;
    case 'build_records_app': return `Records app for ${output}`;
    case 'build_dashboard': return `Dashboard for ${workflow}`;
    case 'connect_systems': return step.systems.length >= 2
      ? `Connect ${step.systems.map(system).join(' and ')}`
      : `Connect ${step.systems[0] ? system(step.systems[0]) : 'the available system'} to the other systems`;
    case 'checked_ai_step': {
      const verb = {draft: 'drafts', extract: 'extracts', classify: 'classifies', judge: 'reviews',
        reconcile: 'reconciles', read: 'reads'}[step.loop?.purpose] || 'prepares';
      const artefact = (step.outputs?.[0] || 'a result for review').replace(/^draft\s+/i, '').replace(/[.!?]+$/, '');
      const checker = step.approver && step.approver !== 'none' ? step.approver : step.actor || step.role_title;
      return `AI step that ${verb} ${artefact}, checked by ${checker || 'the responsible person'}`;
    }
    case 'answer_desk': return `Answer desk for ${workflow}`;
    case 'notifications': return `Notify ${step.handoff_to && step.handoff_to !== 'none' ? step.handoff_to : step.actor || 'the owner'} when ${step.inputs?.[0] || step.what}`;
    default: return step.what;
  }
}

function buildInitiatives(steps, tasks, roles, slots, profile, warnings) {
  const groups = new Map();
  for (const step of steps) {
    if (step.hours_returned <= 0) continue;
    if (!step.action_type) {
      if (step.rung !== 'stays_manual' && step.block !== 'conversation') warnings.push(`${step.id}: savings have no recognised build action.`);
      continue;
    }
    const main = step.systems[0] || null;
    const key = JSON.stringify([step.action_type, main]);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(step);
  }
  const byTask = new Map(tasks.map(task => [task.id, task]));
  const byRole = new Map(roles.map(role => [role.id, role]));
  const initiatives = [...groups.entries()].map(([key, members]) => {
    const representative = [...members].sort(ranked)[0];
    const id = `initiative:${encodeURIComponent(key)}`;
    const action = representative.action_type;
    const effort = effortFor(action);
    const roleIds = unique(members.map(s => s.role_id));
    const taskIds = unique(members.map(s => s.task_id));
    const systems = unique(members.flatMap(s => s.systems));
    const flows = unique(members.map(s => s.workflow)).sort();
    const hours = total(members, 'hours_returned');
    const value = total(members, 'value_eur');
    for (const step of members) step.initiative_id = id;
    return {id, name: initiativeName(action, action === 'connect_systems' ? {...representative, systems} : representative, slots, profile), action_type: action,
      main_system: representative.systems[0] || null, systems, flows,
      workflow: flows.length === 1 ? flows[0] : null, effort, priority: value / effort.days,
      hours_returned: hours, fte_returned: hours / ANNUAL_HOURS, value_eur: value,
      role_ids: roleIds, roles: roleIds.map(roleId => {
        const role = byRole.get(roleId); return {id: role.id, code: role.code, title: role.title};
      }), task_ids: taskIds, tasks: taskIds.map(taskId => {
        const task = byTask.get(taskId); return {id: task.id, uid: task.uid, role_id: task.role_id, short: task.short};
      }), step_ids: members.map(s => s.id), steps: members, business_case: businessCase(hours, value)};
  }).sort((a, b) => b.priority - a.priority || ranked(a, b));
  initiatives.forEach((initiative, index) => {initiative.quarter = `Q${Math.min(4, Math.floor(index / 5) + 1)}`;});
  return initiatives;
}

function roleTwin(role, job, slots, profile) {
  const texts = renderValue(job.role_batches || [], slots, profile);
  const opportunities = role.opportunities;
  const strings = (field, taskField = field) => unique([
    ...texts.flatMap(text => Array.isArray(text[field]) ? text[field] : text[field] ? [text[field]] : []),
    ...opportunities.flatMap(task => Array.isArray(task[taskField]) ? task[taskField] : task[taskField] ? [task[taskField]] : [])
  ].filter(value => typeof value === 'string'));
  return {
    drudgery: opportunities.filter(t => t.hours_returned > 0).slice(0, 3)
      .map(task => ({task_id: task.id, short: task.short, design: task.design || '', hours_returned: task.hours_returned})),
    altitude: strings('altitude'),
    ambitions: unique([...strings('ambitious_version', 'unused'), ...opportunities.map(t => t.ambition?.what)]),
    reach: [...strings('reach', 'unused'), ...opportunities.flatMap(t => t.reach || []).filter(t => typeof t === 'object')],
    human_edge: unique(opportunities.map(t => t.human_edge)), skills_to_grow: strings('skills_to_grow', 'unused')
  };
}

export function computeTeam(setup, jobs, slots = {}, profile = {}) {
  const lookup = jobs instanceof Map ? jobs : new Map((Array.isArray(jobs) ? jobs : Object.values(jobs || {})).map(job => [job.code, job]));
  const warnings = [];
  const roleIds = new Set();
  const roles = [];
  const tasks = [];
  const steps = [];
  const systemCounts = new Map();
  for (const [index, input] of (setup.roles || []).entries()) {
    const job = lookup.get(input.code);
    if (!job) throw new Error(`Job data missing for ${input.code}.`);
    let roleId = String(input.id || input.code);
    if (roleIds.has(roleId)) roleId = `${roleId}:${index + 1}`;
    while (roleIds.has(roleId)) roleId += ':copy';
    roleIds.add(roleId);
    const fte = nonnegative(input.fte, `${roleId} FTE`);
    const cost = nonnegative(input.cost_per_hour, `${roleId} cost per hour`);
    const roleHours = fte * ANNUAL_HOURS;
    const sourceTasks = job.tasks || [];
    if (!sourceTasks.length && roleHours) throw new Error(`No tasks available for ${input.code}.`);
    const weights = sourceTasks.map(task => nonnegative(task.importance, `${task.uid} importance`, 3) * frequencyWeight(task.frequency));
    const weightTotal = weights.reduce((a, b) => a + b, 0);
    if (sourceTasks.length && weightTotal <= 0) throw new Error(`Task weights must sum above zero for ${input.code}.`);
    const role = {id: roleId, code: input.code, title: input.title || job.title || input.code, fte, cost_per_hour: cost, tasks: []};
    for (const note of job.check_notes || []) warnings.push(`${input.code}: ${typeof note === 'string' ? note : note.note}`);
    for (const [taskIndex, original] of sourceTasks.entries()) {
      const task = {...renderValue(original, slots, profile), id: `${roleId}/${original.uid}`, role_id: roleId,
        role_title: role.title, code: input.code, task_share: weights[taskIndex] / weightTotal, initiative_ids: []};
      const taskHours = roleHours * task.task_share;
      let sourceSteps = original.steps || [];
      if (!sourceSteps.length) {
        warnings.push(`${original.uid}: graph unavailable; allocated hours stay human.`);
        sourceSteps = [{id: 'missing-graph', what: 'Task graph unavailable; time kept human.', share_pct: 100,
          remaining_pct: 100, fate: 'person_does', rung: 'stays_manual', block: 'none', systems: [],
          today_means: 'unspecified', estimated_placeholder: true}];
      }
      const shareTotal = sourceSteps.reduce((sum, step) => sum + nonnegative(step.share_pct, `${task.id} step share`), 0);
      if (shareTotal <= 0) throw new Error(`Step shares must sum above zero for ${task.id}.`);
      const normalise = Math.abs(shareTotal - 100) > 1e-8;
      if (normalise) warnings.push(`${task.id}: step shares total ${shareTotal}%; normalised to 100%.`);
      const stepIds = new Set();
      task.steps = sourceSteps.map((originalStep, stepIndex) => {
        const sourceId = String(originalStep.id || `step-${stepIndex + 1}`);
        if (stepIds.has(sourceId)) throw new Error(`Duplicate step ${sourceId} in ${task.id}.`);
        stepIds.add(sourceId);
        const share = originalStep.share_pct / shareTotal * 100;
        const remaining = nonnegative(originalStep.remaining_pct, `${task.id}/${sourceId} remaining percentage`, 100);
        if (remaining > 100) throw new Error(`Remaining percentage exceeds 100 for ${task.id}/${sourceId}.`);
        const baseline = taskHours * share / 100;
        const after = baseline * remaining / 100;
        const step = {...renderValue(originalStep, slots, profile), systems: [...(originalStep.systems || [])],
          id: `${task.id}/${sourceId}`, source_step_id: sourceId, task_id: task.id, task_uid: original.uid,
          role_id: roleId, role_title: role.title, share_pct: share, remaining_pct: remaining,
          baseline_hours: baseline, remaining_hours: after, hours_returned: baseline - after,
          value_eur: (baseline - after) * cost, baseline_cost_eur: baseline * cost, remaining_cost_eur: after * cost,
          action_type: classifyAction(originalStep), initiative_id: null};
        if (normalise) step.source_share_pct = originalStep.share_pct;
        for (const slot of unique(step.systems)) systemCounts.set(slot, (systemCounts.get(slot) || 0) + 1);
        return step;
      });
      const summary = summarise(task.steps);
      Object.assign(task, summary, {rung_mix: summary.by_rung});
      role.tasks.push(task);
      tasks.push(task);
      steps.push(...task.steps);
    }
    Object.assign(role, summarise(role.tasks.flatMap(t => t.steps)));
    role.opportunities = [...role.tasks].sort(ranked);
    role.twin = roleTwin(role, job, slots, profile);
    roles.push(role);
  }
  const initiatives = buildInitiatives(steps, tasks, roles, slots, profile, warnings);
  for (const task of tasks) task.initiative_ids = unique(task.steps.map(s => s.initiative_id));
  for (const role of roles) role.initiative_ids = initiatives.filter(i => i.role_ids.includes(role.id)).map(i => i.id);
  const definitions = slots.slots || slots;
  const systems = [...systemCounts.entries()].map(([id, count]) => ({id, label: definitions[id]?.label || id,
    product: typeof profile?.systems?.[id] === 'string' ? profile.systems[id].trim() : '',
    filled: Boolean(typeof profile?.systems?.[id] === 'string' && profile.systems[id].trim()), step_count: count}))
    .sort((a, b) => b.step_count - a.step_count || a.id.localeCompare(b.id));
  const team = summarise(steps);
  return {version: 1, name: setup.name || 'Your team', function: setup.function || '',
    assumptions: [
      'Generic estimates from O*NET-based task graphs; confirm with the team.',
      '1,600 annual hours per FTE. Task time is estimated from importance and frequency, not measured.',
      'Gross capacity returned is not a promise of cash savings; build, licence and upkeep costs are excluded.',
      'Year 1/2/3 adoption is 50/80/100 percent; capability estimates stay constant.',
      'Q1–Q4 is a ranking suggestion, not a delivery-capacity commitment.',
      'Source graphs can include other actors and unquantified new work; no cross-task labour deduplication is claimed.'
    ], warnings: unique(warnings),
    counts: {roles: roles.length, tasks: tasks.length, steps: steps.length,
      source_steps: steps.filter(s => !s.estimated_placeholder).length, initiatives: initiatives.length},
    team, roles, tasks, opportunities: [...tasks].sort(ranked), initiatives, systems,
    gaps: systems.filter(system => !system.filled).map(({id, label}) => ({id, label})), business_case: team.business_case};
}

/** Portfolio grid. Scores come only from the computed plan. See MODEL.md. */
export const QUADRANT_LABEL = {
  accelerate_now: 'Accelerate Now',
  invest_to_unlock: 'Invest to Unlock',
  quick_wins: 'Quick Wins',
  deprioritize: 'Deprioritize'
};
export const CALL_LABEL = {start: 'Start', continue: 'Continue', edit: 'Edit', merge: 'Merge', stop: 'Stop'};
const QUADRANT_ORDER = ['accelerate_now', 'invest_to_unlock', 'quick_wins', 'deprioritize'];
const PROCESS_SCORE = {
  stop_doing: 90, configure_system: 90, generate_artefact: 75, notifications: 75,
  build_records_app: 60, build_dashboard: 60, answer_desk: 60, build_workflow: 55,
  connect_systems: 40, checked_ai_step: 35
};
const GRADE_SCORE = {E4: 100, E3: 85, E2: 65, E1: 35, E0: 20};
const GRADE_RANK = {E4: 4, E3: 3, E2: 2, E1: 1, E0: 0};
const BLOCKER_ORDER = ['data', 'process', 'contained', 'effort'];
const clampScore = n => Math.min(100, Math.max(0, n));

function namedSlot(profile, id) {
  const value = profile?.systems?.[id];
  return typeof value === 'string' && value.trim().length > 0;
}

function dataScore(initiative, profile) {
  if (profile == null || typeof profile !== 'object') return null;
  const systems = initiative.systems || [];
  if (!systems.length) return 100;
  return 100 * systems.filter(id => namedSlot(profile, id)).length / systems.length;
}

function containedScore(initiative) {
  const roles = initiative.role_ids?.length || 0;
  const base = roles <= 1 ? 100 : roles === 2 ? 70 : 40;
  return Math.max(0, base - 10 * Math.max(0, (initiative.systems?.length || 0) - 2));
}

function effortScore(initiative) {
  const band = initiative.effort?.band;
  if (band === 'S') return 90;
  if (band === 'L') return 30;
  if (band === 'M/L') return initiative.effort?.days_high === 30 ? 30 : 60;
  return 60;
}

function evidenceScore(initiative, tasksById) {
  let best = null;
  for (const ref of initiative.tasks || []) {
    const task = tasksById.get(ref.id) || ref;
    for (const item of task.evidence || []) {
      const grade = String(item?.grade || '').trim();
      if (!(grade in GRADE_RANK)) continue;
      if (best == null || GRADE_RANK[grade] > GRADE_RANK[best]) best = grade;
    }
  }
  return best == null ? 20 : GRADE_SCORE[best];
}

function flowIds(initiative) {
  if (initiative.flows?.length) return initiative.flows;
  return initiative.workflow ? [initiative.workflow] : [];
}

function sharesAny(left, right) {
  if (!left.size || !right?.length) return false;
  return right.some(id => id && left.has(id));
}

function valueScore(value, values) {
  const max = Math.max(0, ...values);
  return max > 0 ? 100 * Math.sqrt(Math.max(0, value) / max) : 0;
}

function unlockScore(initiative, initiatives) {
  const others = initiatives.length - 1;
  if (others <= 0) return 0;
  const systems = new Set((initiative.systems || []).filter(Boolean));
  const flows = new Set(flowIds(initiative).filter(Boolean));
  let shared = 0;
  for (const other of initiatives) {
    if (other === initiative || other.id === initiative.id) continue;
    if (sharesAny(systems, other.systems) || sharesAny(flows, flowIds(other))) shared += 1;
  }
  return 100 * shared / others;
}

function quadrantFor(readiness, prize) {
  const ready = readiness >= 50;
  const big = prize >= 50;
  if (ready && big) return 'accelerate_now';
  if (!ready && big) return 'invest_to_unlock';
  if (ready) return 'quick_wins';
  return 'deprioritize';
}

function weakestPart(parts) {
  const keys = BLOCKER_ORDER.filter(key => parts[key] != null);
  return keys.reduce((best, key) => parts[key] < parts[best] ? key : best);
}

function ownerDelta(flag) {
  if (flag === true) return 10;
  if (flag === false) return -20;
  return 0;
}

function explicitCall(value) {
  const call = String(value || '').toLowerCase();
  return Object.hasOwn(CALL_LABEL, call) ? call : null;
}

function suggestedCall(item, items) {
  if (item.quadrant === 'accelerate_now' || item.quadrant === 'quick_wins') return 'start';
  if (item.quadrant === 'invest_to_unlock') return 'edit';
  const merge = items.some(other => other !== item && other.action_type === item.action_type && sharesAny(new Set((item.systems || []).filter(Boolean)), other.systems));
  return merge ? 'merge' : 'stop';
}

function goalPrize(prize, goal, goals) {
  if (goal === 'none') return {prize: Math.min(prize, 49), goal_link: 'none', goal_note: ''};
  const ids = new Set(Array.isArray(goals) ? goals.map(item => item && item.id).filter(Boolean) : []);
  if (typeof goal === 'string' && ids.has(goal)) return {prize: clampScore(prize + 10), goal_link: goal, goal_note: ''};
  return {prize, goal_link: 'unset', goal_note: 'not linked to a goal yet'};
}

export function portfolioGrid(result, profile, overrides = {}, goals) {
  const initiatives = result?.initiatives || [];
  const tasksById = new Map((result?.tasks || []).map(task => [task.id, task]));
  const values = initiatives.map(initiative => initiative.value_eur);
  const scored = initiatives.map(initiative => {
    const parts = {
      data: dataScore(initiative, profile),
      process: PROCESS_SCORE[initiative.action_type] ?? 20,
      contained: containedScore(initiative),
      effort: effortScore(initiative)
    };
    const known = Object.values(parts).filter(v => v != null);
    const base = known.reduce((sum, v) => sum + v, 0) / known.length;
    const wish = overrides?.[initiative.id]?.owner_wants;
    const owner = wish === true ? true : wish === false ? false : null;
    const readiness = clampScore(base + ownerDelta(owner));
    const weighted = clampScore(0.80 * valueScore(initiative.value_eur, values)
      + 0.10 * evidenceScore(initiative, tasksById)
      + 0.10 * unlockScore(initiative, initiatives));
    const linked = goalPrize(weighted, overrides?.[initiative.id]?.goal, goals);
    const prize = linked.prize;
    return {id: initiative.id, action_type: initiative.action_type, systems: initiative.systems || [],
      readiness, readiness_base: base, prize, prize_base: weighted, parts, blocker: weakestPart(parts), owner_wants: owner,
      goal_link: linked.goal_link, goal_note: linked.goal_note,
      value_eur: initiative.value_eur, hours_returned: initiative.hours_returned,
      quadrant: quadrantFor(readiness, prize), suggested_call: null, call: null, first_wave: false};
  });
  for (const item of scored) {
    item.suggested_call = suggestedCall(item, scored);
    item.call = explicitCall(overrides?.[item.id]?.call) || item.suggested_call;
  }
  const byReadiness = (a, b) => b.readiness - a.readiness || b.value_eur - a.value_eur || a.id.localeCompare(b.id);
  const byQuadrant = {
    accelerate_now: scored.filter(item => item.quadrant === 'accelerate_now').sort(byReadiness),
    invest_to_unlock: scored.filter(item => item.quadrant === 'invest_to_unlock')
      .sort((a, b) => b.prize - a.prize || b.value_eur - a.value_eur || a.id.localeCompare(b.id)),
    quick_wins: scored.filter(item => item.quadrant === 'quick_wins').sort(byReadiness),
    deprioritize: scored.filter(item => item.quadrant === 'deprioritize')
      .sort((a, b) => b.value_eur - a.value_eur || a.id.localeCompare(b.id))
  };
  byQuadrant.accelerate_now.slice(0, Math.min(5, byQuadrant.accelerate_now.length)).forEach(item => {item.first_wave = true;});
  const counts = Object.fromEntries(QUADRANT_ORDER.map(key => [key, byQuadrant[key].length]));
  return {items: scored, by_quadrant: byQuadrant,
    first_wave: byQuadrant.accelerate_now.filter(item => item.first_wave).map(item => item.id),
    quick_wins_hours: byQuadrant.quick_wins.reduce((sum, item) => sum + item.hours_returned, 0), counts};
}

/** FTE-weighted mean of role hourly cost. Used for running-item prize and the implementation estimate. */
export function meanHourlyCost(result) {
  const roles = result?.roles || [];
  let fte = 0;
  let cost = 0;
  for (const role of roles) {
    const weight = Number(role.fte) || 0;
    fte += weight;
    cost += weight * (Number(role.cost_per_hour) || 0);
  }
  return fte > 0 ? cost / fte : 0;
}

const STOP_WORDS = new Set('a an the of to and or for in on with without from by at as is are be it this that their your you we our not into per than then its if do does so than'.split(' ')
  // Words that occur in almost every HR or office task, so they say nothing about which goal fits.
  .concat('employee employees staff hr team teams work working day days week time one new records record data process processes within'.split(' ')));

function contentWords(text) {
  const words = new Set();
  for (const word of String(text || '').toLowerCase().split(/[^a-z0-9]+/)) {
    if (word.length > 2 && !STOP_WORDS.has(word)) words.add(word);
  }
  return words;
}

/** Suggest a goal when two or more of its content words appear in the initiative name or its three biggest tasks. Not applied until the lead accepts. */
export function suggestGoal(initiative, tasks, goals) {
  const texts = [initiative?.name || ''];
  // Only the name and the three biggest tasks: a broad initiative touches so many tasks that any goal would match.
  const full = [...(tasks || [])].sort((x, y) => (y?.hours_returned || 0) - (x?.hours_returned || 0));
  const top = (full.length ? full : initiative?.tasks || []).slice(0, 3);
  for (const task of top) texts.push(task?.statement || '', task?.short || '');
  const words = contentWords(texts.join(' '));
  let best = null;
  let overlap = 0;
  for (const goal of goals || []) {
    let hit = 0;
    for (const word of contentWords(goal?.text || '')) if (words.has(word)) hit += 1;
    if (hit > overlap) { overlap = hit; best = goal; }
  }
  if (!best || overlap < 2) return null;
  return {id: best.id, text: best.text, overlap};
}

function runningReadiness(owner, evidence) {
  if (owner && evidence === 'measured') return 85;
  if (owner && evidence === 'anecdotes') return 60;
  // No owner, or an owner with no evidence: the order names 30 for the first and does not name a fourth score.
  return 30;
}

/**
 * Calls for AI work that already runs.
 * `scale.values` is the initiative value list (the √ prize uses its maximum).
 * `scale.meanHourly` is meanHourlyCost(result).
 * Prize is clamped, then +10 when a goal is linked, then capped at 49 unless evidence is measured.
 */
export function runningCalls(items, goals = [], scale = {}) {
  const goalIds = new Set((goals || []).map(goal => goal && goal.id).filter(Boolean));
  const values = Array.isArray(scale.values) ? scale.values : [];
  const rate = Number(scale.meanHourly) || 0;
  return (items || []).map(item => {
    const owner = String(item?.owner || '').trim();
    const evidence = item?.evidence === 'measured' || item?.evidence === 'anecdotes' ? item.evidence : 'none';
    const hours = Number(item?.hours);
    const hoursOk = Number.isFinite(hours) && hours > 0;
    const destination = String(item?.destination || item?.hours_go || '').trim();
    const goal = goalIds.has(item?.goal) ? item.goal : null;
    const same = String(item?.same_as || '').trim();
    const gaps = [];
    if (!owner) gaps.push('owner');
    if (evidence !== 'measured') gaps.push('measure');
    if (!goal) gaps.push('goal');
    let suggested = 'edit';
    if (same) suggested = 'merge';
    else if (!owner || (evidence === 'none' && !hoursOk)) suggested = 'stop';
    else if (owner && evidence === 'measured' && (goal || (hoursOk && destination))) suggested = 'continue';
    const gross = (hoursOk ? hours : 0) * rate;
    let prize = clampScore(valueScore(gross, values));
    if (goal) prize = clampScore(prize + 10);
    if (evidence !== 'measured') prize = Math.min(prize, 49);
    const readiness = runningReadiness(owner, evidence);
    return {...item, owner, evidence, hours: hoursOk ? hours : 0, destination, goal: goal || (item?.goal === 'none' ? 'none' : ''),
      suggested_call: suggested, call: explicitCall(item?.call) || suggested,
      missing: gaps, readiness, prize, quadrant: quadrantFor(readiness, prize)};
  });
}

export const COST_LINES = [
  ['employee', 'Employee time'],
  ['process', 'Process change'],
  ['data', 'Data work'],
  ['implementation', 'Implementation'],
  ['software', 'Software'],
];

function isNumeric(value) {
  if (typeof value === 'number') return Number.isFinite(value);
  if (typeof value === 'string' && value.trim() !== '') return Number.isFinite(Number(value));
  return false;
}

/** Start is earned, or the list of what is still missing. Quick Wins use the lighter check. */
export function pilotCheck(card = {}, quadrant) {
  const owner = String(card.owner || '').trim();
  const learn = String(card.learn || '').trim();
  const outcomeMissing = [];
  if (!String(card.measure || '').trim()) outcomeMissing.push('measure');
  if (!isNumeric(card.baseline)) outcomeMissing.push('baseline');
  if (!isNumeric(card.target)) outcomeMissing.push('target');
  if (!String(card.by || card.date || '').trim()) outcomeMissing.push('date');
  const checkable = outcomeMissing.length === 0;
  const costs = card.costs || {};
  let costOk = true;
  for (const [key] of COST_LINES) {
    const line = costs[key] || {};
    if (!isNumeric(line.low) || !isNumeric(line.high) || Number(line.high) < Number(line.low)) costOk = false;
  }
  const hoursGo = String(card.hours_go || '').trim();
  const confirmer = String(card.confirmer || '').trim();
  const missing = [];
  let earned = false;
  if (quadrant === 'quick_wins') {
    if (!owner) missing.push('owner');
    if (!hoursGo) missing.push('where the hours go');
    if (!confirmer) missing.push('who confirms');
    earned = missing.length === 0;
  } else {
    if (!owner) missing.push('owner');
    if (!checkable && !learn) missing.push('checkable outcome or a learning question');
    if (!costOk) missing.push('cost range');
    earned = Boolean(owner) && (checkable || Boolean(learn)) && costOk;
  }
  return {earned, checkable, missing, outcome_missing: outcomeMissing, cost_ok: costOk};
}

export function productionReady(checks) {
  const list = Array.isArray(checks) ? checks.slice(0, 8) : [];
  while (list.length < 8) list.push('unknown');
  const open = list.map((value, index) => value === 'yes' ? null : index).filter(index => index != null);
  return {ok: open.length === 0, open};
}

export function reviseAllowed(card) {
  const used = card?.status === 'revise' || Number(card?.revise_count) >= 1;
  if (!used) return {ok: true, reason: ''};
  return {ok: false, reason: 'A revision gets one more cycle with a named fix and new criteria, then expands or stops.'};
}

const ENABLING_TITLE = {
  data: 'Name your systems and open their data',
  process: 'Define the process and its measures',
  contained: 'Split it into contained pieces',
  effort: 'Fund the larger build',
};

function bucketGrid(items) {
  const byReadiness = (a, b) => b.readiness - a.readiness || b.value_eur - a.value_eur || a.id.localeCompare(b.id);
  return {
    accelerate_now: items.filter(item => item.quadrant === 'accelerate_now').sort(byReadiness),
    invest_to_unlock: items.filter(item => item.quadrant === 'invest_to_unlock')
      .sort((a, b) => b.prize - a.prize || b.value_eur - a.value_eur || a.id.localeCompare(b.id)),
    quick_wins: items.filter(item => item.quadrant === 'quick_wins').sort(byReadiness),
    deprioritize: items.filter(item => item.quadrant === 'deprioritize')
      .sort((a, b) => b.value_eur - a.value_eur || a.id.localeCompare(b.id))
  };
}

/**
 * Policy shifts readiness, then enabling cards group initiatives that share a blocker.
 * Does not mutate `grid`. `profile` null means unknown data is not a data card.
 */
export function enablingWork(grid, profile, policy = 'no') {
  const delta = policy === 'yes' ? -25 : policy === 'partly' ? -10 : 0;
  const dataKnown = profile != null && typeof profile === 'object';
  const items = (grid?.items || []).map(item => {
    const readiness = clampScore((Number(item.readiness) || 0) + delta);
    const quadrant = quadrantFor(readiness, item.prize);
    const overridden = item.call !== item.suggested_call;
    return {...item, readiness, quadrant, policy_delta: delta, _override: overridden ? item.call : null};
  });
  for (const item of items) {
    item.suggested_call = suggestedCall(item, items);
    item.call = item._override || item.suggested_call;
    delete item._override;
  }
  const groups = new Map();
  for (const item of items) {
    if (item.prize < 50 || item.readiness >= 50) continue;
    const key = item.blocker;
    if (!ENABLING_TITLE[key]) continue;
    if (key === 'data' && !dataKnown) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  const cards = [];
  if (policy === 'yes') {
    cards.push({
      id: 'policy', kind: 'policy', title: 'Agree an AI policy and vendor approval',
      initiatives: items.map(item => item.id),
      value_eur: items.reduce((sum, item) => sum + (Number(item.value_eur) || 0), 0),
    });
  }
  const blockers = [...groups.entries()].filter(([, group]) => group.length >= 2)
    .sort((a, b) => {
      const av = a[1].reduce((sum, item) => sum + item.value_eur, 0);
      const bv = b[1].reduce((sum, item) => sum + item.value_eur, 0);
      return bv - av || a[0].localeCompare(b[0]);
    });
  for (const [key, group] of blockers) {
    cards.push({
      id: key, kind: 'blocker', blocker: key, title: ENABLING_TITLE[key],
      initiatives: group.map(item => item.id),
      value_eur: group.reduce((sum, item) => sum + (Number(item.value_eur) || 0), 0),
    });
  }
  return {items, by_quadrant: bucketGrid(items), cards, delta, policy: policy === 'yes' || policy === 'partly' ? policy : 'no'};
}

const WORKFLOW_BAND = new Set(['configure_system', 'build_workflow', 'build_records_app', 'notifications', 'answer_desk', 'checked_ai_step', 'build_dashboard']);

/** Authors' rough time to first value. Unknown action types are not given a band. */
export function timeToFirstValue(initiative) {
  const type = initiative?.action_type;
  const systems = initiative?.systems || [];
  const pack = (kind, band) => ({known: true, kind, band, label: `${kind}, ${band}`});
  if (type === 'generate_artefact') return pack('content generation', '2 to 4 weeks');
  if (type === 'stop_doing') return pack('stop doing', 'weeks');
  if (type === 'connect_systems' && systems.length >= 4) return pack('platform-level change', '12 to 24 months');
  if (type === 'connect_systems' || WORKFLOW_BAND.has(type)) return pack('workflow automation on a defined process', '2 to 4 months');
  return {known: false, kind: '', band: '', label: "not in the article's table"};
}
