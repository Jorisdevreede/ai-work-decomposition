// Authored mock data for direction A. Numbers, tasks and steps come from data-model.js (the real
// flow model); people, conversations, station progress and plan owners are invented for the mockup.
export {MODEL} from './data-model.js';

export const COMPANY = {
  name: 'Noordhaven Logistics',
  team: 'HR team',
  lead: {id: 'ingrid', name: 'Ingrid Bakker', initials: 'IB', role: 'HR Manager'},
  savedAt: '10:52',
};

export const ROLE_SLUG = {
  '11-3121.00': 'hr-manager',
  '13-1071.00': 'hr-specialist',
  '13-1151.00': 'training-specialist',
  '13-1141.00': 'compensation-specialist',
  '43-4161.00': 'hr-assistant',
  '43-3051.00': 'payroll-clerk',
};

export const PEOPLE = [
  {id: 'ingrid', name: 'Ingrid Bakker', code: '11-3121.00', fte: 1},
  {id: 'sanne', name: 'Sanne Visser', code: '13-1071.00', fte: 1},
  {id: 'daan', name: 'Daan Mulder', code: '13-1071.00', fte: 1},
  {id: 'yasmina', name: 'Yasmina El Amrani', code: '13-1071.00', fte: 1},
  {id: 'joost', name: 'Joost van Dijk', code: '13-1151.00', fte: 1},
  {id: 'priya', name: 'Priya Ramdin', code: '13-1151.00', fte: 1},
  {id: 'femke', name: 'Femke de Boer', code: '13-1141.00', fte: 1},
  {id: 'tim', name: 'Tim Jansen', code: '43-4161.00', fte: 1},
  {id: 'noor', name: 'Noor Hendriks', code: '43-4161.00', fte: 1},
  {id: 'mehmet', name: 'Mehmet Yilmaz', code: '43-3051.00', fte: 1},
];

export const ROSTER = [
  {code: '11-3121.00', people: ['ingrid'], cost: 95, systems: ['AFAS Profit', 'Outlook', 'SharePoint', 'Excel'], source: 'upload'},
  {code: '13-1071.00', people: ['sanne', 'daan', 'yasmina'], cost: 75, systems: ['AFAS Profit', 'Recruitee', 'Outlook', 'SharePoint'], source: 'upload', check: 'Yasmina is listed as "Recruiter". Mapped to HR Specialist: confirm.'},
  {code: '13-1151.00', people: ['joost', 'priya'], cost: 68, systems: ['Studytube', 'Outlook', 'SharePoint', 'Excel'], source: 'voice'},
  {code: '13-1141.00', people: ['femke'], cost: 75, systems: ['AFAS Profit', 'Excel', 'SharePoint'], source: 'upload'},
  {code: '43-4161.00', people: ['tim', 'noor'], cost: 50, systems: ['AFAS Profit', 'Outlook', 'SharePoint', 'Excel'], source: 'upload'},
  {code: '43-3051.00', people: ['mehmet'], cost: 52, systems: ['AFAS Profit', 'Excel', 'Outlook'], source: 'hand'},
];

export const SYSTEMS = [
  {slot: 'HR system (HCM)', product: 'AFAS Profit'},
  {slot: 'Payroll', product: 'AFAS Profit'},
  {slot: 'Recruitment system (ATS)', product: 'Recruitee'},
  {slot: 'Learning system', product: 'Studytube'},
  {slot: 'E-mail and calendar', product: 'Outlook'},
  {slot: 'Documents', product: 'SharePoint'},
  {slot: 'Spreadsheets', product: 'Excel'},
  {slot: 'Workflow tool', product: null},
  {slot: 'Timekeeping', product: null},
];

// What the reader pulled from each sample source. Confidence below 0.8 gets a "check this" mark.
export const EXTRACTS = {
  orgchart: {
    file: 'HR-organogram-sept-2026.png',
    kind: 'Org chart screenshot',
    summary: 'Read 10 names and job titles. No FTE on the chart: assumed 1.0 each.',
    rows: [
      {name: 'Ingrid Bakker', source: 'Manager HR', role: 'HR Manager', conf: 0.97},
      {name: 'Sanne Visser', source: 'HR Adviseur', role: 'HR Specialist', conf: 0.86},
      {name: 'Daan Mulder', source: 'HR Adviseur', role: 'HR Specialist', conf: 0.86},
      {name: 'Yasmina El Amrani', source: 'Recruiter', role: 'HR Specialist', conf: 0.62},
      {name: 'Femke de Boer', source: 'Specialist Beloning', role: 'Compensation and Benefits Specialist', conf: 0.84},
      {name: 'Tim Jansen', source: 'HR Administratief Medewerker', role: 'HR Assistant', conf: 0.93},
      {name: 'Noor Hendriks', source: 'HR Administratief Medewerker', role: 'HR Assistant', conf: 0.93},
      {name: 'Joost van Dijk', source: 'L&D Adviseur', role: 'Training and Development Specialist', conf: 0.78},
      {name: 'Priya Ramdin', source: 'L&D Coördinator', role: 'Training and Development Specialist', conf: 0.71},
      {name: '(name cut off)', source: 'Salarisadministratie', role: 'Payroll Clerk', conf: 0.54},
    ],
  },
  jobdocs: {
    file: 'Functieprofielen-HR-2025.docx',
    kind: 'Job descriptions',
    summary: 'Read 6 job profiles and 58 task lines. No names in this document.',
    rows: [
      {name: '1 profile', source: 'Manager HR', role: 'HR Manager', conf: 0.95},
      {name: '1 profile', source: 'HR Adviseur', role: 'HR Specialist', conf: 0.9},
      {name: '1 profile', source: 'Adviseur Leren & Ontwikkelen', role: 'Training and Development Specialist', conf: 0.88},
      {name: '1 profile', source: 'Specialist Beloning & Pensioen', role: 'Compensation and Benefits Specialist', conf: 0.85},
      {name: '1 profile', source: 'HR Administratief Medewerker', role: 'HR Assistant', conf: 0.92},
      {name: '1 profile', source: 'Medewerker Salarisadministratie', role: 'Payroll Clerk', conf: 0.9},
    ],
  },
  transcript: {
    file: 'MT-overleg-HR-2-okt.txt',
    kind: 'Meeting transcript',
    summary: 'Heard 8 names and 5 systems. Roles are guessed from what people said they do.',
    rows: [
      {name: 'Ingrid', source: '"I sign off the HR plan"', role: 'HR Manager', conf: 0.82},
      {name: 'Sanne', source: '"policy questions all day"', role: 'HR Specialist', conf: 0.74},
      {name: 'Yasmina', source: '"three vacancies in Recruitee"', role: 'HR Specialist', conf: 0.58},
      {name: 'Priya', source: '"the forklift refresher course"', role: 'Training and Development Specialist', conf: 0.76},
      {name: 'Femke', source: '"the pension provider again"', role: 'Compensation and Benefits Specialist', conf: 0.8},
      {name: 'Mehmet', source: '"payroll cutoff is Thursday"', role: 'Payroll Clerk', conf: 0.88},
      {name: 'Tim', source: '"scanning the contracts"', role: 'HR Assistant', conf: 0.7},
      {name: 'Noor', source: '"onboarding packs"', role: 'HR Assistant', conf: 0.66},
    ],
  },
};

// The voice agent demo: lines play one by one; "adds" lands in the roster as it is heard.
export const VOICE = [
  {who: 'agent', text: 'Tell me about your team. Who does what?'},
  {who: 'lead', text: 'We are ten people in HR at Noordhaven. I am the HR manager.', adds: 'HR Manager · Ingrid · 1.0 FTE'},
  {who: 'agent', text: 'Who handles hiring and employee questions?'},
  {who: 'lead', text: 'Three HR advisers: Sanne, Daan and Yasmina. Yasmina mostly does recruitment.', adds: 'HR Specialist · 3 people', check: true},
  {who: 'agent', text: 'And training?'},
  {who: 'lead', text: 'Joost and Priya. A lot of it is for the warehouse shifts.', adds: 'Training and Development Specialist · 2'},
  {who: 'agent', text: 'Pay, benefits and administration?'},
  {who: 'lead', text: 'Femke does reward and pensions, Mehmet does payroll, Tim and Noor are our HR assistants.', adds: 'Compensation and Benefits · Payroll · HR Assistant ×2'},
  {who: 'agent', text: 'Which systems do you work in every day?'},
  {who: 'lead', text: 'AFAS for HR and payroll, Recruitee, Studytube, Outlook, SharePoint and far too much Excel.', adds: '6 systems'},
  {who: 'agent', text: 'I heard 10 people in 6 roles. One check: is Yasmina a recruiter, or an HR specialist who focuses on recruitment?'},
];

export const LEVELS = [
  {min: 0, word: 'Estimate', tone: 'estimate'},
  {min: 40, word: 'Taking shape', tone: 'shape'},
  {min: 70, word: 'Sharp', tone: 'sharp'},
  {min: 90, word: 'Ready', tone: 'ready'},
];

// Generic O*NET task graphs give every part a head start; stations fill the rest.
export const BASE_FILL = 20;

export const PARTS = [
  {id: 'roles', name: 'Re-imagined roles', short: 'Roles', route: '#/role/hr-specialist',
    promise: 'For each of the 6 roles: the week before and after, what goes, what you get to do more of, what stays yours.',
    weights: {'role-analysis': 0.35, survey: 0.15, 'card-sorting': 0.25, interview: 0.15, agenda: 0.1}},
  {id: 'twin', name: 'Team twin', short: 'Team twin', route: '#/team',
    promise: 'Capacity the team gets back, what it can take on with it, and what stays human.',
    weights: {'role-analysis': 0.3, survey: 0.2, agenda: 0.2, 'card-sorting': 0.1, 'north-star': 0.2}},
  {id: 'opportunities', name: 'Opportunities, broken into steps', short: 'Opportunities', route: '#/opportunities',
    promise: 'Every task ranked by value for effort, each opened up into its steps.',
    weights: {'role-analysis': 0.3, sipoc: 0.25, 'value-stream': 0.2, interview: 0.15, 'card-sorting': 0.1}},
  {id: 'approach', name: 'An approach for every step', short: 'Approach per step', route: '#/opportunities',
    promise: 'Rule, records app, generated document, workflow, ML, dashboard, remove it, keep it human, or amplify the person.',
    weights: {'role-analysis': 0.25, sipoc: 0.3, interview: 0.2, guardrails: 0.25}},
  {id: 'plan', name: 'A step-by-step plan', short: 'Plan', route: '#/plan',
    promise: 'Initiatives by quarter, each with an owner, what it builds and the opportunities behind it.',
    weights: {'north-star': 0.35, guardrails: 0.25, 'value-stream': 0.2, sipoc: 0.2}},
];

// The route: two set-up junctions, nine stations, one arrival. Order is the suggested order.
export const ROUTE = ['setup', 'goal', 'role-analysis', 'survey', 'card-sorting', 'agenda', 'interview', 'sipoc', 'value-stream', 'north-star', 'guardrails', 'arrival'];

export const JUNCTIONS = {
  setup: {name: 'Your team', short: 'Team', href: '#/setup', state: 'done', note: '10 people, 6 roles'},
  goal: {name: 'The destination', short: 'Destination', href: '#/goal', state: 'done', note: 'Seen 2 Oct'},
  arrival: {name: 'Your plan', short: 'Plan', href: '#/plan', state: 'next', note: 'Agreed with the team'},
};

export const STATIONS = [
  {id: 'role-analysis', name: 'Role analysis', kind: 'individual',
    what: 'Each person checks the tasks of their role, drawn from O*NET task graphs: keep, change, add, and give a rough share of their week. A personal version of the team task analysis.',
    time: '25 minutes per person', who: 'Every team member, on their own', done: 10, total: 10, unit: 'people',
    status: 'Done', detail: '10 of 10 done. 7 tasks added, 12 removed as "not in my job".',
    adds: ['roles', 'opportunities', 'approach']},
  {id: 'survey', name: 'Survey', kind: 'individual',
    what: 'Twelve short questions on workload, the work that drains people and how ready they feel for change. Answers are shown at team level only.',
    time: '10 minutes per person', who: 'Every team member', done: 9, total: 10, unit: 'people',
    status: 'Closed', closed: true, detail: '9 of 10 answered. Closed on 9 Oct.',
    adds: ['roles', 'twin']},
  {id: 'card-sorting', name: 'Card sorting', kind: 'individual', open: '#/station/card-sorting',
    what: 'Each person sorts their own tasks into four piles: more of this, help me do it better, take it off my plate, not really mine. It shows where people want amplification and where they want automation.',
    time: '12 to 15 minutes per person', who: 'Every team member, on their own', done: 3, total: 10, unit: 'people',
    status: 'In progress', detail: '3 of 10 sorted: Ingrid, Tim and Femke. Reminder goes out on Friday.',
    adds: ['roles', 'twin', 'opportunities']},
  {id: 'agenda', name: 'Connect your agenda', kind: 'individual',
    what: 'Read-only access to four weeks of Outlook calendar: how much time goes to meetings, with whom, and how broken up the week is. Meeting titles stay private; only categories are kept.',
    time: '2 minutes to connect, then 4 weeks of data', who: 'Each person who opts in', done: 4, total: 10, unit: 'people',
    status: 'In progress', detail: '4 of 10 connected. Measured so far: 11.5 hours of meetings a week on average.',
    adds: ['twin', 'roles']},
  {id: 'interview', name: 'Interview', kind: 'individual',
    what: 'A 20-minute conversation with an AI interviewer about exceptions, workarounds and what you would do with more time. You read and approve your summary before anyone else sees it.',
    time: '20 minutes per person', who: 'Each team member, optional', done: 0, total: 10, unit: 'people',
    status: 'Planned', detail: 'Opens on 4 Nov, after card sorting.',
    adds: ['roles', 'opportunities', 'approach']},
  {id: 'sipoc', name: 'SIPOC', kind: 'team',
    what: 'Map one process on one page: suppliers, inputs, process steps, outputs, customers. Three processes to start: employee change to payroll, hiring to first day, policy question to answer.',
    time: '45 minutes per process', who: 'Team lead and the 2 or 3 people who do the work', done: 1, total: 3, unit: 'processes',
    status: 'In progress', detail: '"Employee change to payroll" mapped on 10 Oct with Daan, Tim and Mehmet.',
    adds: ['opportunities', 'approach', 'plan']},
  {id: 'value-stream', name: 'Value stream analysis', kind: 'team',
    what: 'Follow one process end to end and time it: working time against waiting time, rework loops, handoffs. Shows where removing a step beats automating it.',
    time: '90 minutes', who: 'Team lead and everyone in the process', done: 0, total: 1, unit: 'process',
    status: 'Not started', detail: 'Best done after SIPOC, on the process with the most waiting.',
    adds: ['opportunities', 'plan']},
  // The North Star: eight team modules (research/north-star.md, section e, "Our proposal"), bundled
  // into one live workshop that follows the Guide's agenda (section b). Times marked "our estimate"
  // are not stated in the sources.
  {id: 'north-star', name: 'North Star workshop', kind: 'team', bundle: true,
    what: 'The live session that bundles the North Star modules, on the agenda of Amplitude’s workshop guide. Two modules are done alone before it, two after it. Together they agree one North Star metric for the team, the inputs that move it, and the work that moves the inputs. The plan is then ranked against it.',
    time: '2 hours on the agenda (its eight parts add up to 135 minutes)', who: 'The whole team, with one facilitator who is not the decision maker; 15 to 20 people at most',
    unit: 'modules', status: 'Booked', detail: 'Workshop booked for 12 Nov, 13:00 to 15:15, room Kade 2. Before it: metrics inventory and strategic assumptions. After it: bet up and context to intervention.',
    adds: ['twin', 'plan']},
  {id: 'ns-game', group: 'north-star', n: 1, name: 'Pick the game', kind: 'team', format: ['Team', 'live'], exercise: 'Games of Product', open: '#/station/ns-game',
    what: 'Agree which game HR is playing (attention, transaction or productivity) and what value it delivers, so AI work aims at value, not activity.',
    time: '15 minutes, in the workshop', who: 'The whole team', output: 'The chosen game', done: 0, total: 1, unit: 'session',
    status: 'Booked', detail: 'Part 2 of the workshop on 12 Nov.', adds: ['twin']},
  {id: 'ns-metrics', group: 'north-star', n: 2, name: 'Metrics inventory', kind: 'team', format: ['Solo', 'async'], exercise: 'Leading / Lagging, with the Magic Chart',
    what: 'List the measures HR uses today, split them into work that moves in days and results that take years, and flag the vanity ones. The baseline for any AI change.',
    time: 'About 20 minutes (our estimate; the board states no time)', who: 'The team lead, before the workshop', output: 'A metrics inventory, vanity metrics flagged', done: 1, total: 1, unit: 'inventory',
    status: 'Done', detail: 'Ingrid listed 14 measures on 11 Oct; 4 flagged as vanity, such as "number of HR mails answered".', adds: ['twin', 'plan']},
  {id: 'ns-assumptions', group: 'north-star', n: 3, name: 'Strategic assumptions', kind: 'team', format: ['Solo', 'async'], exercise: 'Strategic Assumptions',
    what: 'Each person places their beliefs, fears and hype about AI on a line from "everyone believes this" to "only we believe this". Makes private beliefs visible before the room meets.',
    time: 'About 15 minutes (our estimate; the board states no time)', who: 'Each person, alone; shown without names', output: 'A map of assumptions', done: 5, total: 10, unit: 'people',
    status: 'In progress', detail: '5 of 10 in. Closes on 11 Nov, the day before the workshop.', adds: ['plan', 'approach']},
  {id: 'ns-ladder', group: 'north-star', n: 4, name: 'Confidence ladder', kind: 'team', format: ['Team', 'live'], exercise: 'Confidence Ladder, with Value Moments and Signals',
    what: 'Rate each step of the employee journey from "just a hunch" to "very confident" that it predicts a good outcome; mark where AI could act and which signals would show trust.',
    time: '15 minutes, in the workshop', who: 'The whole team', output: 'A rated journey map', done: 0, total: 1, unit: 'session',
    status: 'Booked', detail: 'Part 4 of the workshop on 12 Nov.', adds: ['approach', 'twin']},
  {id: 'ns-statement', group: 'north-star', n: 5, name: 'Statement', kind: 'team', format: ['Team', 'AI-guided'], exercise: 'NSF Statement Exercise, with Promise NSF', open: '#/station/ns-statement',
    what: 'Words before numbers: a statement of what the AI-native HR team delivers, then its inputs, opportunities and interventions. An AI guide proposes wording; the team edits.',
    time: '15 minutes, in the workshop', who: 'The whole team, with an AI guide', output: 'A statement worksheet', done: 0, total: 1, unit: 'session',
    status: 'Booked', detail: 'Part 5 of the workshop on 12 Nov.', adds: ['twin']},
  {id: 'ns-converge', group: 'north-star', n: 6, name: 'Converge', kind: 'team', format: ['Team', 'live'], exercise: 'NSF Basic Template, with Discussion Prompts and Clustering',
    what: 'One North Star metric, its definition, inputs and business impact, scored on the seven checks. AI is an input, not the goal.',
    time: '30 minutes, in the workshop', who: 'The whole team', output: 'A draft North Star framework', done: 0, total: 1, unit: 'session',
    status: 'Booked', detail: 'Parts 6 and 8 of the workshop on 12 Nov.', adds: ['twin', 'plan']},
  {id: 'ns-betup', group: 'north-star', n: 7, name: 'Bet up', kind: 'team', format: ['Solo', 'AI-guided'], exercise: 'Bet Up',
    what: 'Start from what you are working on and trace it up two levels to an input. Each AI pilot that traces to nothing is stopped.',
    time: 'About 20 minutes per owner (our estimate; the board states no time)', who: 'Each initiative owner, with an AI guide', output: 'A chain from each bet to an input', done: 0, total: 9, unit: 'owners',
    status: 'Planned', detail: 'Opens after the workshop, for the 9 proposed initiative owners.', adds: ['plan']},
  {id: 'ns-context', group: 'north-star', n: 8, name: 'Context to intervention', kind: 'team', format: ['Team', 'async'], exercise: 'Context to Intervention',
    what: 'Turn each input into levers, an OKR and time-bound interventions. This is where the plan gets its dates.',
    time: 'About 30 minutes over a week (our estimate; the board states no time)', who: 'The team, on a shared board', output: 'A lever tree with OKRs and interventions', done: 0, total: 1, unit: 'board',
    status: 'Planned', detail: 'Two weeks after the workshop.', adds: ['plan']},
  {id: 'guardrails', name: 'Guardrails check', kind: 'team', added: true,
    what: 'Before anything is built: which steps touch personal data, which need a say from the works council, and which count as high-risk AI under the EU AI Act (recruitment and HR decisions often do). Marks the steps that must stay with a person or need a check.',
    time: '60 minutes', who: 'HR manager, privacy officer and a works council member', done: 0, total: 1, unit: 'session',
    status: 'Suggested', detail: 'We added this one. In a Dutch HR team, the time to get consent often decides the order of the plan. (Model knowledge, to be confirmed with your privacy officer.)',
    adds: ['approach', 'plan']},
];

// The live workshop's agenda: parts, durations and outputs from Amplitude's How-to Guide
// (research/north-star.md, section b); "For this team" is our HR reading (section d).
export const NORTH_STAR_PARTS = [
  {n: 1, name: 'Opening discussion', min: 15, purpose: 'A shared understanding of why the team is here.',
    output: 'Not specified in the guide', hr: 'Where does HR time go, and what would we do with it back?'},
  {n: 2, module: 'ns-game', name: 'Identify the game', min: 15, purpose: 'Pick the attention, transaction or productivity game.',
    output: 'The chosen game', hr: 'Mostly productivity: success can mean employees spend less time with HR.'},
  {n: 3, module: 'ns-metrics', name: 'Good and bad North Star', min: 15, purpose: 'Review the checklist and brainstorm a terrible North Star.',
    output: 'Anti-examples as guardrails', hr: 'Vanity anti-examples: prompts sent, licences issued.'},
  {n: 4, module: 'ns-ladder', name: 'Abstract exercise', min: 15, optional: true, purpose: 'Free, lateral thinking with one or two toolkit exercises.',
    output: 'The exercise board', hr: 'A confidence ladder over the employee journey: where would people trust AI?'},
  {n: 5, module: 'ns-statement', name: 'Statement exercise', min: 15, purpose: 'Words before numbers: statement, inputs, opportunities, interventions.',
    output: 'A statement worksheet', hr: 'Input slots pre-filled with AI levers: self-service, agent handling, data quality.'},
  {n: 6, module: 'ns-converge', name: 'Structure of the metric and its inputs', min: 15, purpose: 'See the North Star as a formula of a handful of factors.',
    output: 'North Star = f(inputs)', hr: 'Label the inputs breadth, depth, frequency and efficiency.'},
  {n: 7, name: 'North Star for another product', min: 15, purpose: 'Warm up without the pressure, in small groups.',
    output: 'A worksheet for that product', hr: 'Use the IT helpdesk instead of the guide’s restaurant-booking example.'},
  {n: 8, module: 'ns-converge', name: 'Draft your own and converge', min: 30, purpose: 'Silent drafting, pair and share, test against the checklist, four convergence questions.',
    output: 'Documented decisions', hr: 'Dot votes against the seven checks, then: the game, the strongest candidates, what to drop, what is missing.'},
];
export const NORTH_STAR_AFTER = 'After the workshop: name and define the metric, mind-map the inputs, run the two-minute greenfield test and the roadmap check, then tie each initiative to one input as a bet.';

// Illustrative only, not validated (research/north-star.md, section d). No baseline is measured yet.
export const NORTH_STAR = {
  name: 'Requests Resolved Right First Time',
  definition: 'The share of HR requests from employees and managers that are resolved correctly within one working day, with no follow-up ticket. Measured weekly.',
  inputs: [
    {id: 'breadth', name: 'Breadth', text: 'Share of request types that have an AI-assisted path.'},
    {id: 'depth', name: 'Depth', text: 'Share of requests an AI agent completes end to end.'},
    {id: 'frequency', name: 'Frequency', text: 'HR staff who use AI in their workflow each week.'},
    {id: 'efficiency', name: 'Efficiency', text: 'Accuracy of AI answers in a weekly audited sample.'},
  ],
};

export const APPROACHES = [
  {id: 'rule', name: 'Deterministic rule', family: 'software', line: 'A fixed rule decides. Same input, same answer, every time.'},
  {id: 'records', name: 'Records app', family: 'software', line: 'A simple app to create, read, update and delete records, instead of mail and spreadsheets.'},
  {id: 'artefact', name: 'Artefact generation', family: 'software', line: 'Software drafts the letter, report or pack from approved sources; a person checks it where it matters.'},
  {id: 'workflow', name: 'Workflow automation', family: 'software', line: 'Hand-offs, reminders and system-to-system transfers run on their own.'},
  {id: 'ml', name: 'Traditional ML', family: 'software', line: 'A model trained on your own history classifies or flags, such as unusual hours.'},
  {id: 'dashboard', name: 'Dashboard', family: 'software', line: 'Numbers people now collect by hand, kept current in one view.'},
  {id: 'remove', name: 'Remove the step', family: 'gone', line: 'The step exists only because of how work is done today. Stop doing it.'},
  {id: 'amplify', name: 'Amplify', family: 'people', line: 'The person keeps the work; AI prepares, suggests or checks so they do it better.'},
  {id: 'human', name: 'Stays human', family: 'people', line: 'Judgement, trust or a conversation. A person does it, as today.'},
];

export const MEANS = [
  {id: 'screens', name: 'System screens and spreadsheets', keys: ['system_screen', 'spreadsheet']},
  {id: 'documents', name: 'Documents', keys: ['document']},
  {id: 'mail', name: 'Mail and chat', keys: ['email_chat']},
  {id: 'people', name: 'Meetings, calls and in person', keys: ['meeting_call', 'in_person', 'paper_phone']},
];

// Team ambitions, shortened from the model's role twins (prototypes/flow, twin.ambitions).
export const AMBITIONS = [
  {text: 'An early HR readiness check: upcoming starters, open employment changes and policy updates reviewed together, before the deadline.', roles: ['13-1071.00'], fte: 1.2},
  {text: 'Learning pathways that fit rotating warehouse shifts, tested against what people can do afterwards.', roles: ['13-1151.00'], fte: 0.9},
  {text: 'A payroll readiness service: missing starter data and pay changes caught before cutoff, not after payday.', roles: ['43-3051.00', '43-4161.00'], fte: 1.1},
  {text: 'Preventive conflict consultations, and weekly capacity decisions from reliable service data.', roles: ['11-3121.00'], fte: 0.4},
  {text: 'Benefits assurance: coverage risks spotted early, and life-change options explained in person.', roles: ['13-1141.00'], fte: 0.5},
  {text: 'Facts on request: permission-checked employee facts, and recurring gaps fixed at the source.', roles: ['43-4161.00'], fte: 0.9},
];

// Plain-English "no more ..." lines for the HR Specialist role twin (from the model's top drudgery).
export const DRUDGERY_LINES = {
  '13-1071.00': [
    'No more re-keying approved changes into AFAS Profit and chasing payroll to confirm.',
    'No more searching SharePoint for the current policy before every answer.',
    'No more reading certificates line by line to check dates and issuers.',
  ],
};

export const MORE_OF = {
  '13-1071.00': [
    {text: 'Sensitive advice and conversations with employees and managers', hours: 6},
    {text: 'Hiring conversations and better evidence behind selection decisions', hours: 5},
    {text: 'A first-month check-in with every new starter', hours: 3},
    {text: 'Looking into workforce issues before they become cases', hours: 3},
  ],
};

export const PLAN = [
  {id: 'i1', quarter: 'Q1', name: 'Applicant updates straight from Recruitee', owner: 'yasmina', ops: ['op1', 'op4', 'op7'],
    builds: 'Status messages and information packs drafted from the application record; sending and logging run on their own.', approaches: ['workflow', 'artefact'], consent: 'Light: privacy notice update'},
  {id: 'i2', quarter: 'Q1', name: 'One change form for employee records', owner: 'daan', ops: ['op2', 'op12', 'op16', 'op17'],
    builds: 'Effective-dated change forms and checks in AFAS Profit, a payroll hand-off that confirms itself, and a case-type classifier for incoming documents.', approaches: ['records', 'rule', 'workflow', 'ml'], consent: 'Works council informed'},
  {id: 'i3', quarter: 'Q1', name: 'Training planner for classes and instructors', owner: 'priya', ops: ['op5', 'op18', 'op23'],
    builds: 'Slots matched against Outlook calendars, rooms and shifts; invitations and changes sent from Studytube.', approaches: ['workflow', 'rule'], consent: 'None expected'},
  {id: 'i4', quarter: 'Q2', name: 'Policy answer desk with cited drafts', owner: 'sanne', ops: ['op3', 'op9', 'op11', 'op20'],
    builds: 'Questions come in one place; drafts cite the current SharePoint policy; an HR person approves every answer.', approaches: ['artefact', 'amplify', 'rule'], consent: 'Works council and privacy check first'},
  {id: 'i5', quarter: 'Q2', name: 'Starter journey without the chasing', owner: 'noor', ops: ['op6', 'op24'],
    builds: 'Orientation schedules, packs and invitations generated per starter; reminders run on their own.', approaches: ['workflow', 'artefact'], consent: 'None expected'},
  {id: 'i6', quarter: 'Q2', name: 'Payroll inputs checked before cutoff', owner: 'mehmet', ops: ['op25', 'op28'],
    builds: 'Timesheets chased automatically, the separate tracker removed, unusual hours flagged by a model trained on past pay runs.', approaches: ['workflow', 'ml', 'remove'], consent: 'Works council consent needed'},
  {id: 'i7', quarter: 'Q2', name: 'Handbooks and org charts that keep themselves current', owner: 'daan', ops: ['op10'],
    builds: 'Org charts and directories regenerated from AFAS Profit; handbook changes drafted for approval.', approaches: ['artefact', 'workflow'], consent: 'None expected'},
  {id: 'i8', quarter: 'Q3', name: 'Course packs from approved sources', owner: 'joost', ops: ['op15', 'op21', 'op22'],
    builds: 'Course drafts built from approved SharePoint procedures; the subject expert approves before release in Studytube.', approaches: ['artefact', 'amplify'], consent: 'None expected'},
  {id: 'i9', quarter: 'Q3', name: 'Workforce and learning reports in one view', owner: 'ingrid', ops: ['op13', 'op19'],
    builds: 'A Power BI view fed from AFAS Profit and Studytube, replacing the monthly Excel work.', approaches: ['dashboard', 'workflow'], consent: 'Privacy check on group sizes'},
  {id: 'i10', quarter: 'Q3', name: 'Credential and screening checks, a person decides', owner: 'yasmina', ops: ['op8', 'op14'],
    builds: 'Register checks and certificate reading prepared for the specialist; every screening decision stays with a person.', approaches: ['amplify', 'rule', 'workflow'], consent: 'High-risk under the EU AI Act: assessment first'},
  {id: 'i11', quarter: 'Q4', name: 'Benefits and pension reconciliation', owner: 'femke', ops: ['op27'],
    builds: 'Provider confirmations matched against AFAS Profit deductions; only mismatches reach Femke.', approaches: ['workflow', 'rule'], consent: 'Provider data agreement'},
  {id: 'i12', quarter: 'Q4', name: 'HR workload view for the manager', owner: 'ingrid', ops: ['op26'],
    builds: 'Queue totals and deadlines in one place, so priorities are set from data instead of status mails.', approaches: ['dashboard'], consent: 'Not a staff ranking: agree with works council'},
];

export const QUARTERS = [
  {id: 'Q1', label: 'Q1 2027', note: 'Quick, low-risk, mostly configuration'},
  {id: 'Q2', label: 'Q2 2027', note: 'Needs consent or a privacy check first'},
  {id: 'Q3', label: 'Q3 2027', note: 'Bigger builds and AI steps with checks'},
  {id: 'Q4', label: 'Q4 2027', note: 'Longer integrations'},
];

// Card sorting: Sanne's ten biggest tasks (hours from data-model.js hs_tasks, matched by text).
export const CARD_TASKS = [
  'Explain HR policies and employment rules to employees and managers.',
  'Verify applicants\' professional credentials against role-specific eligibility requirements.',
  'Review applications against agreed job requirements and prepare a screening shortlist.',
  'Maintain accurate employment records for approved employee changes.',
  'Confirm hiring terms, issue employment documents and complete starter administration.',
  'Explain role duties, pay, benefits, working conditions and progression to applicants.',
  'Administer employee benefit eligibility, enrolments, changes and reconciliations.',
  'Tell applicants their application status, explain decisions and record the communication.',
  'Handle employee complaints, investigate concerns, agree action and follow up.',
  'Keep organisation charts, directories, handbooks and evaluation forms accurate and publish approved revisions.',
];

export const PILES = [
  {id: 'more', name: 'More of this', line: 'Why I do this job. I want more time for it.', key: '1'},
  {id: 'help', name: 'Help me do it better', line: 'I keep it, but AI could prepare or check.', key: '2'},
  {id: 'off', name: 'Take it off my plate', line: 'Routine. Software could do most of it.', key: '3'},
  {id: 'notmine', name: 'Not really mine', line: 'Rare for me, or someone else should do it.', key: '4'},
];

// ---------- Two North Star exercises, clickable (research/north-star.md, sections b, d, e) ----------

// The three games are the guide's (G p.8-10); the HR readings are ours (section d).
export const GAMES = [
  {id: 'attention', name: 'Attention game', value: 'Value is the time people spend with the product.',
    hr: 'People read the intranet, open HR newsletters, spend time in the HR portal.',
    success: 'More visits and more time on HR pages.',
    trap: 'For HR this rewards being busy, not useful. A vanity trap.', votes: 1},
  {id: 'transaction', name: 'Transaction game', value: 'Value is the number of exchanges completed.',
    hr: 'Requests closed, contracts issued, payroll runs done.',
    success: 'More requests handled each week.',
    trap: 'Counts output: a wrong answer that needs a second ticket counts twice.', votes: 2},
  {id: 'productivity', name: 'Productivity game', value: 'Value is how quickly and well someone gets their work done.',
    hr: 'Employees and managers get what they need from HR: right, fast, without chasing.',
    success: 'Requests resolved right the first time. Success can mean less time with HR, not more.',
    trap: 'Needs a clear definition of "right" and someone who checks a sample.', votes: 7},
];
export const EXCHANGE = {
  give: 'their questions, changes and life events',
  get: 'the right answer or change, the first time, without chasing',
  means: 'employees and managers spend less time with HR, not more',
};
// Opportunities that are requests from employees and managers: the productivity game ranks them up.
export const GAME_OPS = ['op2', 'op3', 'op9', 'op11', 'op12', 'op20'];
export const VANITY = ['Number of HR mails answered', 'HR portal page views'];

// The seven checks (PB p.14; G p.11).
export const CHECKS = ['Customer value', 'Vision and strategy', 'Leading indicator', 'Actionable', 'Understandable', 'Measurable', 'Not vanity'];
export const STATEMENT_CANDIDATES = [
  {text: 'Employees and managers get the right HR answer or change the first time, within one working day.',
    fails: [], note: 'Says what employees get, can be measured weekly, and moves before cost and satisfaction do.'},
  {text: 'Every HR request is resolved correctly without anyone having to chase it.',
    fails: ['Measurable'], note: 'Strong on value. "Without chasing" needs a definition before it can be counted.'},
  {text: 'HR time goes to people, not paperwork.',
    fails: ['Customer value', 'Measurable'], note: 'Describes what HR gains, not what employees get. Keep it as a team promise, not as the North Star.'},
];
// Which opportunities move each input, and which initiatives become bets on it (Statement worksheet).
export const INPUT_OPS = {
  breadth: ['op3', 'op9', 'op11'],
  depth: ['op1', 'op4', 'op12'],
  frequency: ['op15', 'op22'],
  efficiency: ['op10', 'op20'],
};
export const INIT_BETS = {i1: 'depth', i2: 'depth', i4: 'breadth', i5: 'breadth', i7: 'efficiency', i8: 'frequency'};
