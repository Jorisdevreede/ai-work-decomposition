// Small helpers shared by the flow and the results: escaping, honest rounding, slot gaps, bars.

const HTML = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'};
export const esc = value => String(value ?? '').replace(/[&<>"']/g, c => HTML[c]);

export const HOURS_PER_FTE = 1600;
export const WEEK = 40; // display unit for one person's week

// Two significant figures above 100, whole numbers below: these are estimates, not measurements.
export function nice(n) {
  if (!Number.isFinite(n)) return 0;
  const a = Math.abs(n);
  if (a < 100) return Math.round(n);
  const p = 10 ** (Math.floor(Math.log10(a)) - 1);
  return Math.round(n / p) * p;
}
const int = new Intl.NumberFormat('en-GB', {maximumFractionDigits: 0});
const one = new Intl.NumberFormat('en-GB', {minimumFractionDigits: 1, maximumFractionDigits: 1});

export const fmtInt = n => int.format(n);
export const fmtHours = n => `${int.format(nice(n))} h`;
export const fmtWeekHours = n => (n > 0 && n < 1 ? '<1 h' : `${int.format(Math.round(n))} h`);
export const fmtFte = n => (n < 10 ? one.format(Math.round(n * 10) / 10) : int.format(Math.round(n)));
export const fmtPct = n => `${Math.round(n)}%`;
export const fmtTimes = n => (n == null || !Number.isFinite(n) ? 'no fixed limit' : `${one.format(n)}×`);
export function fmtEur(n) {
  const a = Math.abs(n);
  if (a >= 1e6) return `€${one.format(n / 1e6)}M`;
  if (a >= 1e4) return `€${int.format(nice(n) / 1e3)}k`;
  if (a >= 1e3) return `€${one.format(n / 1e3)}k`;
  return `€${int.format(nice(n))}`;
}
export const fmtDays = e => (e.days_low === e.days_high ? `about ${e.days_low} days` : `${e.days_low}–${e.days_high} days`);

export const MEANS = {
  system_screen: 'System screens',
  document: 'Documents',
  email_chat: 'Mail and chat',
  spreadsheet: 'Spreadsheets',
  meeting_call: 'Meetings and calls',
  in_person: 'In person',
  paper_phone: 'Paper and phone',
};
export const RUNGS = [
  ['eliminate', 'Stopped'],
  ['configure', 'Configured system'],
  ['deterministic', 'Fixed rules'],
  ['deterministic_plus_loop', 'AI step, checked'],
  ['stays_manual', 'Kept human'],
];
export const ACTIONS = {
  stop_doing: {label: 'Stop doing', plural: 'Stop doing', lede: 'Steps that no longer need doing at all.'},
  configure_system: {label: 'Configure a system', plural: 'Configure a system', lede: 'Settings, forms and rules in systems you already have.'},
  generate_artefact: {label: 'Generate an artefact', plural: 'Generate artefacts', lede: 'Drafts, packs and reports produced from your own records.'},
  build_workflow: {label: 'Build a workflow', plural: 'Build workflows', lede: 'Hand-offs, reminders and approvals that run by themselves.'},
  build_records_app: {label: 'Build a records app', plural: 'Build records apps', lede: 'One place for records that now live in mail and spreadsheets.'},
  build_dashboard: {label: 'Build a dashboard', plural: 'Build dashboards', lede: 'Status and numbers without assembling them by hand.'},
  connect_systems: {label: 'Connect systems', plural: 'Connect systems', lede: 'Data that moves between systems instead of being re-typed.'},
  checked_ai_step: {label: 'Checked AI step', plural: 'Add checked AI steps', lede: 'AI reads or drafts; a person or a rule checks before anything is used.'},
  answer_desk: {label: 'Answer desk', plural: 'Answer desks', lede: 'Answers to recurring questions from approved sources.'},
  notifications: {label: 'Notifications', plural: 'Notifications', lede: 'The right person hears about an event without being chased.'},
};
export const actionLabel = type => ACTIONS[type]?.label ?? type.replace(/_/g, ' ');
export const AMBITION_KIND = {
  new_service: 'New service',
  decide_more_often: 'Decide more often',
  serve_new_group: 'Serve a new group',
};
export const humanize = id => String(id ?? '').replace(/[-_]+/g, ' ').trim();

const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// The model writes an unfilled slot as "label [not supplied]" (or "[label not supplied]").
// mode 'gap' marks it as a visible gap; mode 'plain' keeps the generic label (systems step skipped).
export function slotRenderer(slots, mode) {
  const labels = Object.values(slots?.slots ?? {}).map(s => s.label).sort((a, b) => b.length - a.length).map(reEsc);
  const after = labels.length ? new RegExp(`(${labels.join('|')}) \\[not supplied\\]`, 'g') : null;
  const inside = /\[([^[\]]+?) not supplied\]/g;
  const unknown = /\[unknown slot: ([^\]]+)\]/g;
  const gap = '<span class="slot-gap" title="Not filled in yet: add it under Systems">$1</span>';
  return text => {
    let h = esc(text);
    if (mode === 'plain') {
      if (after) h = h.replace(after, '$1');
      return h.replace(inside, '$1').replace(unknown, '$1');
    }
    if (after) h = h.replace(after, gap);
    return h.replace(inside, gap).replace(unknown, gap);
  };
}
// Plain-text version for CSV/JSON exports.
export function slotPlain(text) {
  return String(text ?? '').replace(/ \[not supplied\]/g, '').replace(/\[([^[\]]+?) not supplied\]/g, '$1').replace(/\[unknown slot: ([^\]]+)\]/g, '$1');
}

// A before/after pair on one track: today in neutral, with AI in teal; the gap is time returned.
export function pairMeter(before, after, max, label) {
  const b = max > 0 ? (before / max) * 100 : 0;
  const a = max > 0 ? (after / max) * 100 : 0;
  return `<span class="meter" role="img" aria-label="${esc(label)}"><span class="m-today" style="width:${b.toFixed(2)}%"></span><span class="m-after" style="width:${a.toFixed(2)}%"></span></span>`;
}
export function fillMeter(value, max, label) {
  const w = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return `<span class="meter" role="img" aria-label="${esc(label)}"><span class="m-fill" style="width:${w.toFixed(2)}%"></span></span>`;
}

// Rung mix: an ordinal teal ramp from "stopped" to "kept human", with text for screen readers.
export function rungBar(mix) {
  const total = RUNGS.reduce((s, [k]) => s + (mix?.[k]?.baseline_hours ?? 0), 0);
  if (!total) return '';
  const parts = RUNGS.map(([k, label]) => [k, label, (mix?.[k]?.baseline_hours ?? 0) / total]).filter(p => p[2] > 0.004);
  const text = parts.map(([, label, s]) => `${label} ${fmtPct(s * 100)}`).join(', ');
  return `<span class="rung" role="img" aria-label="${esc(text)}">${parts.map(([k, label, s]) => `<span class="r-${k}" style="flex:${s.toFixed(4)}" title="${esc(label)} ${fmtPct(s * 100)}"></span>`).join('')}</span>`;
}
export function rungLegend() {
  return `<ul class="legend">${RUNGS.map(([k, label]) => `<li><span class="sw r-${k}"></span>${label}</li>`).join('')}</ul>`;
}

export function download(name, type, text) {
  const blob = new Blob([text], {type});
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), {href: url, download: name});
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
