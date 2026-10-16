export const roster = [
  { role: 'HR Manager', people: 'Femke', fte: 1, systems: 'AFAS Profit, Outlook', initials: 'FV', shift: [68, 24] },
  { role: 'HR Specialist', people: 'Yara, Daan, Nour', fte: 3, systems: 'ATS, AFAS Profit, Outlook', initials: 'YD', shift: [62, 22] },
  { role: 'Training and Development Specialist', people: 'Sanne, Milan', fte: 2, systems: 'AFAS Profit, SharePoint', initials: 'SM', shift: [58, 26] },
  { role: 'Compensation and Benefits Specialist', people: 'Ruben', fte: 1, systems: 'AFAS Profit, payroll', initials: 'RB', shift: [71, 28] },
  { role: 'HR Assistant', people: 'Lotte, Amir', fte: 2, systems: 'AFAS Profit, SharePoint, Outlook', initials: 'LA', shift: [82, 30] },
  { role: 'Payroll Clerk', people: 'Eva', fte: 1, systems: 'AFAS Profit, payroll', initials: 'EV', shift: [78, 25] }
];

export const approaches = [
  ['amplify', 'Amplify', 'AI helps a person explore, prepare or decide better; the person leads.'],
  ['rule', 'Deterministic rule', 'Known rules calculate or validate the same way every time.'],
  ['records', 'Records (CRUD) app', 'Create, read, update and delete structured records with clear permissions.'],
  ['artefact', 'Artefact generation', 'Produce a document or other output from inputs and an approved template.'],
  ['workflow', 'Workflow automation', 'Move work between systems and people when a known event occurs.'],
  ['ml', 'Traditional ML', 'Use a trained statistical model to find patterns or make predictions.'],
  ['dashboard', 'Dashboard', 'Show trusted measures so people can see changes and act.'],
  ['remove', 'Remove the step', 'Stop duplicate or unnecessary work instead of building it.'],
  ['human', 'Stays human', 'Keep trust, care, judgement and consequential decisions with a person.']
];

export const opportunities = [
  { id:'reporting', name:'Turn reporting into workforce advice', outcome:'A weekly staffing-risk conversation, with the numbers ready.', hours:1280, value:84000, effort:'S', days:5, owner:'Yara', role:'HR Specialist', system:'AFAS Profit · SharePoint', task:'13-1071.00:18853', metric:'Staffing risks acted on before they affect service', steps:[
    ['Export employee, position and absence records for the reporting period.','workflow','Read a scheduled AFAS Profit export. Log the source and reporting period.'],
    ['Reconcile identifiers, dates and organisational categories in the reporting workbook.','rule','Use agreed mappings. Send unmatched records to Yara for correction.'],
    ['Calculate required totals, rates and comparisons using agreed definitions.','rule','Keep definitions versioned. Reconcile totals with the source export.'],
    ['Interpret changes and assemble the report with explanatory notes.','amplify','Offer alternative explanations and questions. Yara checks them against the evidence.'],
    ['Prepare the workforce report from the approved template.','artefact','Populate only verified figures; keep a link to each source.'],
    ['Show absence and vacancy trends for the weekly review.','dashboard','Show aggregate trends with restricted access and clear definitions.'],
    ['Check explanations, disclosure scope and required report content.','human','Femke reviews the context and approves what can be shared.'],
    ['Distribute the corrected report to authorised internal recipients.','workflow','Send only after approval. Keep a distribution record.']
  ]},
  { id:'records', name:'One trusted employee record', outcome:'Less rekeying. More time helping employees get a clear answer.',hours:1640,value:91000,effort:'M',days:15,owner:'Lotte',role:'HR Assistant',system:'AFAS Profit · payroll',task:'43-4161.00:2689',metric:'Employee changes correct the first time',steps:[
    ['Collect approved employee changes.','records','Use a restricted change register with an owner and audit history.'],
    ['Check required fields and effective dates.','rule','Flag missing approvals and invalid dates before saving.'],
    ['Update the HR record and hand off payroll changes.','workflow','Apply the approved change once and track the handoff.'],
    ['Rekey the same change into a second spreadsheet.','remove','Remove the duplicate spreadsheet after the source is trusted.'],
    ['Resolve changes with conflicting evidence.','human','Lotte checks the source with the person responsible.']
  ]},
  {id:'support',name:'Prepare for better employee conversations',outcome:'A source-linked briefing before a sensitive conversation.',hours:720,value:52000,effort:'M',days:15,owner:'Nour',role:'HR Specialist',system:'SharePoint · Outlook',task:'13-1071.00:18852',metric:'Agreed support actions followed through',steps:[
    ['Hear the employee’s account and explain confidentiality limits and next steps.','human','Nour leads the conversation and establishes trust.'],
    ['Read authorised records and organise accounts, dates and conflicting evidence.','amplify','Create a source-linked timeline; Nour verifies attribution and omissions.'],
    ['Prepare outcome letters and follow-up instructions for each authorised recipient.','artefact','Draft only from approved findings. Nour approves every recipient version.'],
    ['File the case record and schedule restricted follow-up reminders.','workflow','Use restricted folders and reminders with named owners.']
  ]},
  {id:'learning',name:'Make development plans more personal',outcome:'Coaching options that managers can use in a real conversation.',hours:960,value:58000,effort:'L',days:30,owner:'Sanne',role:'Training and Development Specialist',system:'AFAS Profit · SharePoint',task:'Illustrative learning scenario',metric:'Agreed learning applied on the job',steps:[
    ['Review approved skills and development goals.','records','Bring agreed goals together in a restricted record.'],
    ['Suggest learning options for the stated goal.','amplify','Prepare alternatives; Sanne and the employee choose.'],
    ['Look for patterns in completed learning and skills gaps.','ml','Only explore after data quality and a useful baseline have been established.'],
    ['Agree a development plan with the employee.','human','The employee and manager own the commitment.']
  ]},
  {id:'payroll',name:'Catch payroll discrepancies before payday',outcome:'One checked queue of pay warnings, with the evidence ready.',hours:68,value:3523,effort:'M',days:15,owner:'Eva',role:'Payroll Clerk',system:'AFAS Profit · payroll',task:'43-3051.00:2518',sourceKind:'Task-level model estimate',metric:'Approved pay corrections completed before cutoff',steps:[
    ['Retrieve approved time, absence and draft payroll records.','workflow','Bring the approved inputs together without rekeying.'],
    ['Compare hours, rates and deductions with approved rules.','rule','Use payroll checks to flag differences before the run.'],
    ['Prepare a source-linked explanation for each warning.','amplify','Eva checks the figures and supporting notes; missing evidence stays unresolved.'],
    ['Clarify disputed facts and approve the correction.','human','The employee can challenge the record. The authorised payroll owner decides.'],
    ['Post approved corrections and rerun the checks.','workflow','Record the approval and verify the corrected run.']
  ]},
  {id:'training-schedule',name:'Plan learning without the calendar chase',outcome:'Feasible class dates that respect people, rooms and equipment.',hours:121,value:8257,effort:'S',days:5,owner:'Milan',role:'Training and Development Specialist',system:'Outlook · AFAS Profit',task:'13-1151.00:95',sourceKind:'Task-level model estimate',metric:'Training sessions confirmed without booking conflicts',steps:[
    ['Collect course requirements and required dates.','records','Keep cohort, instructor and resource needs in one planning record.'],
    ['Check availability and propose feasible slots.','rule','Match calendars, room capacity and equipment constraints.'],
    ['Resolve clashes with instructors and team leads.','human','Milan negotiates alternatives when priorities compete.'],
    ['Confirm bookings and send changes to participants.','workflow','Send invitations only after the schedule is agreed.']
  ]},
  {id:'candidate-updates',name:'Keep candidates informed',outcome:'Timely, accurate updates with a person available for difficult news.',hours:142,value:10655,effort:'S',days:5,owner:'Daan',role:'HR Specialist',system:'ATS · Outlook',task:'13-1071.00:18857',sourceKind:'Task-level model estimate',metric:'Candidates receive an accurate update when promised',steps:[
    ['Check the recorded application stage and decision.','records','Show missing decisions rather than inventing a status.'],
    ['Resolve stale or incomplete status with the hiring manager.','human','Daan confirms what can be communicated.'],
    ['Prepare an update from the approved application record.','artefact','Use the approved template and recipient details.'],
    ['Review feedback and explain sensitive decisions personally.','human','A person owns the decision and the conversation.'],
    ['Send the approved update and log follow-up.','workflow','Keep the communication record in the ATS.']
  ]},
  {id:'job-evidence',name:'Bring better evidence to pay decisions',outcome:'A clear job-evaluation pack, with grading decisions kept human.',hours:39,value:2962,effort:'M',days:15,owner:'Ruben',role:'Compensation and Benefits Specialist',system:'AFAS Profit · SharePoint',task:'13-1141.00:3351',sourceKind:'Task-level model estimate',metric:'Job evaluations supported by complete, checked evidence',steps:[
    ['Gather the role description and organisation context.','workflow','Create a restricted evidence pack from approved records.'],
    ['Interview the manager and job holder about actual duties.','human','Ruben explores gaps between the description and the work.'],
    ['Organise source evidence by evaluation factor.','amplify','Offer a cited evidence table; Ruben checks omissions and conflicting accounts.'],
    ['Evaluate the job and approve the grade and salary recommendation.','human','Existing decision owners apply the approved framework.'],
    ['Record the approved decision and notify the manager.','records','Keep effective dates, access and approval history together.']
  ]},
  {id:'departures',name:'Make departures careful and complete',outcome:'Approved departure actions move once; the exit conversation stays personal.',hours:54,value:4060,effort:'M',days:15,owner:'Yara',role:'HR Specialist',system:'AFAS Profit · Outlook · payroll',task:'13-1071.00:18854',sourceKind:'Task-level model estimate',metric:'Departure actions completed correctly by the agreed date',steps:[
    ['Check the approved departure notice and checklist.','rule','Validate dates and required actions against the employee record.'],
    ['Arrange and lead the exit conversation.','human','Yara listens, checks facts and explains confidential follow-up.'],
    ['Prepare a restricted summary and departure documents.','artefact','Use approved terms and templates; keep sensitive concerns separate.'],
    ['Review the paperwork and approve instructions.','human','The authorised owner checks terms and recipients.'],
    ['Update status and send approved payroll and departure actions.','workflow','Track the handoffs to each responsible team.']
  ]},
  {id:'capacity',name:'Match team capacity to the work',outcome:'A shared view of feasible assignments before conflicts become urgent.',hours:42,value:3966,effort:'L',days:30,owner:'Femke',role:'HR Manager',system:'AFAS Profit · SharePoint',task:'11-3121.00:984',sourceKind:'Task-level model estimate',metric:'Staffing conflicts resolved before an assignment starts',steps:[
    ['Collect staffing needs, capabilities and dates.','records','Make requirements explicit without scoring people.'],
    ['Check availability, current assignments and verified qualifications.','rule','Flag capacity conflicts and missing evidence.'],
    ['Show feasible options for the capacity review.','dashboard','Expose the constraints and keep the source records available.'],
    ['Discuss preferences, development and fairness.','human','Femke works with employees and managers to agree a suitable allocation.'],
    ['Record approved assignments and notify affected people.','workflow','Apply only the agreed changes with effective dates.']
  ]}
];

export const northStarModules = [
 {id:'ns-game',name:'Games of Product',format:'Team · live',time:'15 min',who:'HR team + facilitator',does:'Pick the game: agree the value HR delivers. Test productivity so AI work aims at value rather than activity.',adds:'An agreed value exchange for the team goal.',output:'The chosen game.',goal:'Goal + team twin',status:'Not started'},
 {id:'ns-inventory',name:'Metrics inventory',format:'Solo · AI-guided',time:'15 min · est.',estimated:true,who:'Each team member with an AI guide, then shared',does:'List today’s HR measures with the agent. Separate leading work and bets from lagging results. Flag vanity measures, then review what belongs in the pilot checks.',adds:'A reviewed metrics inventory, an employee-record quality check and measurement work in the plan.',output:'A metrics inventory with classifications and owners to confirm.',goal:'Goal + opportunities + plan',status:'Not started'},
 {id:'ns-assumptions',name:'Strategic assumptions',format:'Solo · AI-guided',time:'10 min · est.',estimated:true,who:'Each team member with an AI guide',does:'Let the agent draw out private beliefs, fears and hype about AI. Map widely held and distinctive assumptions, then choose what the team should test.',adds:'A reviewed assumption map, human boundaries in the team twin and a pilot gate for employee support.',output:'Beliefs, fears and hype, with a proposed test.',goal:'Team twin + opportunities + plan',status:'Not started'},
 {id:'ns-confidence',name:'Confidence Ladder',format:'Team · live',time:'15 min',who:'HR team + service partners',does:'Rate employee-journey steps from hunch to confidence. Use Value Moments and Signals Brainstorm to identify where AI could act and what would earn trust.',adds:'Prioritised value moments and explicit trust gaps.',output:'A rated journey map.',goal:'Team twin + opportunities',status:'Not started'},
 {id:'ns-statement',name:'Statement',format:'Team · AI-guided',time:'15 min',who:'HR team with an AI guide',does:'Write the promise in words before numbers. Connect the statement to inputs, opportunities and interventions; the guide proposes wording for the team to check.',adds:'A shared statement for the AI native team.',output:'A statement worksheet.',goal:'Goal + opportunities',status:'Not started'},
 {id:'ns-template',name:'NSF Basic Template',format:'Team · live',time:'30 min',who:'HR team + facilitator',does:'Converge on one North Star, definition, inputs and business impacts. Cluster candidates and test them against the seven checks; AI is an input, not the goal.',adds:'One draft North Star framework with agreed inputs.',output:'A draft framework.',goal:'Goal + team twin',status:'Illustrative draft'},
 {id:'ns-bet',name:'Bet Up',format:'Solo · AI-guided',time:'15 min · est.',estimated:true,who:'Each initiative owner with an AI guide',does:'Start with a current AI pilot, then trace it through two levels of increase or decrease to an input. Challenge work that traces to nothing.',adds:'An explicit input link for every proposed initiative.',output:'A bet-to-input chain.',goal:'Opportunities + plan',status:'Not started'},
 {id:'ns-context',name:'Context to Intervention',format:'Team · async',time:'20 min · est.',estimated:true,who:'Team lead + initiative owners',does:'Turn context and input levers into an OKR and time-bound AI interventions.',adds:'A prioritised set of interventions tied to the North Star inputs.',output:'A lever tree.',goal:'Prioritised plan',status:'Not started'}
];

export const modules = [
 {id:'survey',name:'Survey',group:'Individual',time:'8 min',who:'Each team member',does:'Capture the work people do, the friction they feel and what they want more time for.',adds:'Role priorities and a first view of the team’s ambitions.',goal:'Re-imagined roles',status:'Complete'},
 {id:'analysis',name:'Role analysis',group:'Individual',time:'15 min',who:'Each role holder',does:'Check a personalised task analysis against a real working week.',adds:'Validated task shares, role shifts and candidate opportunities.',goal:'Roles + opportunities',status:'Draft ready'},
 {id:'cards',name:'Card sorting',group:'Individual',time:'6 min',who:'Yara · HR Specialist',does:'Sort real tasks into work to keep, work to amplify and work to take off your plate.',adds:'Personal priorities and human boundaries for the role twin.',goal:'Re-imagined roles',status:'Suggested'},
 {id:'interview',name:'Interview',group:'Individual',time:'20 min',who:'Each team member, with an AI interviewer',does:'Explore exceptions, judgement and the work that generic task descriptions miss.',adds:'Exception notes and skills to grow in the role twin.',goal:'Roles + step approaches',status:'Not started'},
 {id:'agenda',name:'Connect your agenda',group:'Individual',time:'5 min setup',who:'Each person, by choice',does:'Use calendar time to compare the task estimate with a real week. Read-only; review categories before sharing.',adds:'A better time baseline. No meeting contents are needed.',goal:'Team twin baseline',status:'Not connected'},
 {id:'sipoc',name:'SIPOC',group:'Team',time:'30 min',who:'Team lead + people in the flow',does:'Map suppliers, inputs, process, outputs and customers for one value stream.',adds:'Shared handoffs and boundaries for the team twin.',goal:'Team twin + opportunities',status:'Not started'},
 {id:'stream',name:'Value stream analysis',group:'Team',time:'45 min',who:'HR team + a hiring manager',does:'Follow a case from request to result and identify queues, rework and unnecessary steps.',adds:'Waiting time, effort bands and a stronger priority order.',goal:'Prioritised plan',status:'Not started'},
 ...northStarModules.map(m=>({...m,group:'Team'})),
 {id:'north',name:'North Star live workshop',group:'Team',format:'Team · live bundle',time:'120–135 min',who:'Facilitator + HR team + service, IT and data partners (HR adaptation)',does:'A facilitated bundle using the Guide’s eight-part agenda. Use the exercise modules above to prepare or continue asynchronously; the live agenda is a separate facilitation sequence.',adds:'An agreed North Star, its input metrics and the work each initiative should move.',goal:'Goal + team twin + plan',status:'Not started'},
 {id:'boundaries',name:'Human boundaries',group:'Team',time:'25 min',who:'Team + accountable owners',does:'Agree where judgement, care and approval must stay human. Review exceptions together.',adds:'Named decision owners and approval gates on the steps.',goal:'Step approaches + plan',status:'Not started'}
];

export const northStar = {
 name:'Requests Resolved Right First Time',
 definition:'The share of HR requests from employees and managers resolved correctly within one working day, with no follow-up ticket. Measured weekly.',
 inputs:[
  ['Breadth','Share of request types with an AI-assisted path.'],
  ['Depth','Share of requests an AI agent completes end to end.'],
  ['Frequency','Number of HR staff using AI in their workflow each week.'],
  ['Efficiency','Accuracy of AI answers in a weekly audited sample.']
 ],
 parts:[
  ['Opening discussion','15 min','Discuss impact, strategy and how the work links to value. For HR: where does time go, and what would we do with it back?','No prescribed output in the source; capture shared opening notes.'],
  ['Identify the game','15 min','Choose attention, transaction or productivity. For this HR draft, test productivity: less time spent with HR can be success.','The chosen game.'],
  ['Good and bad North Star','15 min','Apply the seven checks and brainstorm a terrible metric. Prompts sent and licences issued are HR anti-examples.','Anti-examples as guardrails.'],
  ['Abstract exercise (optional)','15 min','Try Magic Chart, Confidence Ladder or Value Moments. For HR: map where employees would trust AI.','The exercise board.'],
  ['Statement exercise','15 min','Work top-down through the statement, inputs, opportunities and interventions, with measurement options.','A statement worksheet.'],
  ['Structure of NSM and inputs','15 min','Describe the North Star as a function of a handful of factors. Test breadth, depth, frequency and efficiency.','NSM = f(inputs).'],
  ['North Star for another product','15 min','Warm up in small groups with another product. The guide uses OpenTable; the HR adaptation uses an IT helpdesk.','A worksheet for that product.'],
  ['Draft your own and converge','30 min','Draft silently for 5–10 minutes, pair and share, then test against the checklist. Agree the game, strongest candidates, eliminations and missing information.','Documented decisions.']
 ]
};

export const quarters = [
 {label:'Q1',name:'Make the basics trustworthy',owner:'Yara + Lotte',build:'Scheduled workforce extracts, validation rules and a single employee change register. Eva tests the payroll warning queue.',ids:['reporting','records','payroll'],check:'Reconcile one reporting cycle and one payroll change cycle before expanding.'},
 {label:'Q2',name:'Give people a better starting point',owner:'Nour',build:'Restricted case timelines, briefing drafts and approved follow-up reminders. Daan and Yara check candidate updates and departure handoffs.',ids:['support','candidate-updates','departures'],check:'Check attribution, access and recipient disclosure on a small case set.'},
 {label:'Q3',name:'Build room for development',owner:'Sanne + Milan',build:'A development-plan workspace, reviewed learning suggestions and coordinated class bookings.',ids:['learning','training-schedule'],check:'Test whether managers and employees use the plans in real conversations.'},
 {label:'Q4',name:'Learn, measure, expand',owner:'Femke',build:'An outcome dashboard and a review of the first four pilots against the North Star inputs. Test the job-evidence pack and shared capacity review next.',ids:['reporting','records','support','learning','job-evidence','capacity'],check:'Replace gross estimates with observed time and quality before making staffing decisions.'}
];
