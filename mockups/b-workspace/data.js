export const roles = [
  {id:'manager',name:'HR Manager',code:'11-3121.00',people:['Marieke'],fte:1,returned:0.35,shift:'Lead workforce planning',color:'pine'},
  {id:'specialist',name:'HR Specialist',code:'13-1071.00',people:['Noor','Daan','Youssef'],fte:3,returned:1.65,shift:'Advise managers, investigate concerns',color:'lilac'},
  {id:'learning',name:'Training and Development Specialist',code:'13-1151.00',people:['Sanne','Ruben'],fte:2,returned:1.10,shift:'Coach teams and design learning',color:'clay'},
  {id:'benefits',name:'Compensation and Benefits Specialist',code:'13-1141.00',people:['Fatima'],fte:1,returned:0.60,shift:'Test fairer reward options',color:'blue'},
  {id:'assistant',name:'HR Assistant',code:'43-4161.00',people:['Bram','Lotte'],fte:2,returned:1.25,shift:'Guide employees through key moments',color:'ochre'},
  {id:'payroll',name:'Payroll Clerk',code:'43-3051.00',people:['Joris'],fte:1,returned:0.55,shift:'Resolve payroll exceptions',color:'pine'}
];
export const approaches = {
  'deterministic rule':{label:'Deterministic rule',short:'Rules',color:'blue',description:'Apply explicit rules to structured inputs; the same inputs give the same result.'},
  'records (CRUD) app':{label:'Records app',short:'Records',color:'blue',description:'Create, read, update and delete structured records with access controls.'},
  'artefact generation':{label:'Artefact generation',short:'Artefacts',color:'ochre',description:'Produce a document or other output from approved data and templates.'},
  'workflow automation':{label:'Workflow automation',short:'Workflow',color:'pine',description:'Move work between systems and people when an event or condition triggers it.'},
  'traditional ML':{label:'Prediction model',short:'Prediction',color:'lilac',description:'Predict or classify from historical examples; validate before using it.'},
  'dashboard':{label:'Dashboard',short:'Dashboard',color:'blue',description:'Show reliable measures and exceptions so a person can investigate.'},
  'remove the step':{label:'Remove the step',short:'Remove',color:'clay',description:'Stop work that adds no value once its dependency has been checked.'},
  'stays human':{label:'Stays human',short:'Human',color:'ochre',description:'Protect judgement, care, trust and accountable decisions.'},
  'amplify':{label:'Amplify',short:'Amplify',color:'lilac',description:'AI helps the person prepare, explore options and do the work better.'}
};
export const opportunities = [
  {id:'records',name:'Employee changes, entered once',approach:'records (CRUD) app',role:'assistant',owner:'Bram',hours:1460,value:73000,band:'S',days:5,quarter:'Q1',system:'AFAS Profit · HCM',source:'43-4161.00:2689',outcome:'Let Bram help employees instead of copying approved changes between records.',steps:[
    ['Read employee and manager requests for personnel data changes.','amplify','Extract proposed fields; Bram checks the request and approval.'],
    ['Match employee identifiers, reporting periods and effective dates in the update workbook.','deterministic rule','Validate the employee ID, effective date and approved field set.'],
    ['Enter approved address, absence and other routine employee field changes.','records (CRUD) app','Write approved changes to AFAS Profit with an audit record.'],
    ['Check saved fields against the approved change set.','deterministic rule','Compare the saved record; route mismatches to Bram.'],
    ['Confirm completion to the authorised requester.','workflow automation','Send an Outlook confirmation after the record check passes.']
  ]},
  {id:'reporting',name:'Workforce reporting without the workbook',approach:'deterministic rule',role:'specialist',owner:'Daan',hours:940,value:65800,band:'S',days:5,quarter:'Q1',system:'AFAS Profit · SharePoint',source:'13-1071.00:18853',outcome:'Give Daan time to investigate staffing risks and explain what changed.',steps:[
    ['Export employee, position and absence records for the reporting period.','workflow automation','Schedule a read-only AFAS Profit export.'],
    ['Reconcile identifiers, dates and organisational categories in the reporting workbook.','deterministic rule','Use agreed mappings and put unmatched rows in an exception queue.'],
    ['Calculate required totals, rates and comparisons using agreed definitions.','deterministic rule','Run versioned formulas; keep the calculation trace.'],
    ['Interpret changes and assemble the report with explanatory notes.','amplify','Draft explanations from the figures; Daan checks causes and comparisons.'],
    ['Check explanations, disclosure scope and required report content.','stays human','Marieke approves explanations and disclosure.'],
    ['Distribute the corrected report to authorised internal recipients.','workflow automation','Publish only after approval, using the authorised recipient list.']
  ]},
  {id:'policy',name:'Better answers to everyday HR questions',approach:'amplify',role:'assistant',owner:'Lotte',hours:780,value:39000,band:'M',days:15,quarter:'Q2',system:'SharePoint · Outlook',source:'43-4161.00:2687',outcome:'Help Lotte give clearer answers and spend more time on sensitive questions.',steps:[
    ['Read the question and establish its topic and audience.','amplify','Suggest a topic and audience; Lotte checks both.'],
    ['Find the current policy, benefit terms and applicable procedure.','amplify','Retrieve source passages from approved SharePoint policies.'],
    ['Check relevant employment facts for an authenticated employee.','records (CRUD) app','Show only facts the authenticated employee may access.'],
    ['Write and send a routine policy explanation.','artefact generation','Prepare a source-linked draft; Lotte approves before sending.'],
    ['Discuss sensitive circumstances and check that the person understands their options.','stays human','Keep the conversation and judgement with Lotte.'],
    ['Refer unresolved interpretations or exception requests to the HR specialist.','workflow automation','Route the exception to Noor with its context.'],
    ['Record the answer, referral and follow-up status.','records (CRUD) app','Log the approved answer and follow-up owner.']
  ]},
  {id:'offboarding',name:'A considered goodbye, less paperwork',approach:'workflow automation',role:'specialist',owner:'Noor',hours:580,value:40600,band:'M',days:15,quarter:'Q1',system:'AFAS Profit · Outlook · SharePoint',source:'13-1071.00:18854',outcome:'Free Noor to listen well, follow up concerns and test retention interventions.',steps:[
    ['Check the approved departure notice against the employee record and required departure checklist.','deterministic rule','Check approved dates and generate the required checklist.'],
    ['Arrange an exit interview with the departing employee.','workflow automation','Offer suitable times through Outlook.'],
    ['Discuss departure reasons, listen to concerns, and take factual notes.','stays human','Noor conducts the confidential conversation.'],
    ['Write a restricted interview summary and separate concerns needing confidential follow-up.','amplify','Draft from factual notes; Noor checks sensitivity and recipients.'],
    ['Prepare termination documents using approved dates, terms, and current templates.','artefact generation','Fill approved templates; Marieke reviews the resulting documents.'],
    ['File approved documents and update the departure status.','workflow automation','Save after approval and confirm the payroll handoff.']
  ]},
  {id:'cases',name:'Stronger preparation for employee concerns',approach:'amplify',role:'specialist',owner:'Youssef',hours:420,value:29400,band:'M',days:15,quarter:'Q2',system:'SharePoint · HCM',source:'13-1071.00:18852',outcome:'Spend more of the case on listening, fair investigation and meaningful follow-up.',steps:[
    ['Receive the concern and assess immediate safety, confidentiality and escalation needs.','stays human','Youssef assesses urgency and agrees safe next steps.'],
    ["Hear the employee’s account and explain confidentiality limits and next steps.",'stays human','Keep the relationship and the conversation with the specialist.'],
    ['Read authorised records and organise accounts, dates and conflicting evidence.','amplify','Produce a source-linked chronology; verify every material claim.'],
    ['Assess credibility, policy implications and options using the verified evidence.','stays human','The specialist assesses evidence and the authorised manager decides.'],
    ['Prepare outcome letters and follow-up instructions for each authorised recipient.','artefact generation','Draft documents with separate disclosure scopes for review.'],
    ['File the case record and schedule restricted follow-up reminders.','workflow automation','Save in the restricted case record and notify the named owner.']
  ]},
  {id:'dashboard',name:'A shared view of staffing risks',approach:'dashboard',role:'manager',owner:'Marieke',hours:280,value:26600,band:'M',days:15,quarter:'Q2',system:'AFAS Profit · HCM',source:'13-1071.00:18853',outcome:'Review staffing risks weekly rather than wait for the monthly report.',steps:[
    ['Calculate required totals, rates and comparisons using agreed definitions.','deterministic rule','Use the same versioned reporting definitions.'],
    ['Interpret changes and assemble the report with explanatory notes.','dashboard','Show vacancy and absence trends; suppress small-group disclosure.'],
    ['Check explanations, disclosure scope and required report content.','stays human','Marieke investigates causes and decides which action to take.']
  ]},
  {id:'templates',name:'Approved HR documents, ready to review',approach:'artefact generation',role:'specialist',owner:'Noor',hours:350,value:24500,band:'M',days:15,quarter:'Q3',system:'SharePoint · AFAS Profit',source:'13-1071.00:18854',outcome:'Use reliable documents and put more care into the conversation around them.',steps:[
    ['Prepare termination documents using approved dates, terms, and current templates.','artefact generation','Fill current templates from approved employee facts.'],
    ['Check termination paperwork and approve the departure instructions.','stays human','Marieke checks dates, terms and instructions before release.']
  ]},
  {id:'duplicate',name:'Retire the duplicate change workbook',approach:'remove the step',role:'assistant',owner:'Bram',hours:190,value:9500,band:'S',days:5,quarter:'Q1',system:'AFAS Profit · HCM',source:'43-4161.00:2689',outcome:'Give the team one reliable record rather than two competing versions.',steps:[
    ['Match employee identifiers, reporting periods and effective dates in the update workbook.','remove the step','Retire the parallel workbook only after the new record validation is proven.'],
    ['Check saved fields against the approved change set.','stays human','Bram confirms no reporting or audit dependency remains.']
  ]},
  {id:'forecast',name:'Explore a staffing-demand forecast',approach:'traditional ML',role:'manager',owner:'Marieke',hours:120,value:11400,band:'L',days:30,quarter:'Q4',system:'HCM · ATS',source:'13-1071.00:18853',outcome:'Test whether a forecast improves capacity planning over a simple baseline.',steps:[
    ['Export employee, position and absence records for the reporting period.','workflow automation','Prepare approved, historical aggregate data.'],
    ['Illustrative extension: forecast aggregate staffing demand.','traditional ML','Compare out-of-time accuracy with a simple seasonal baseline.'],
    ['Interpret changes and assemble the report with explanatory notes.','stays human','Marieke evaluates usefulness; stop if the model adds no value.']
  ]}
].sort((a,b)=>b.value/b.days-a.value/a.days);

export const northStarModules = [
  {id:'ns-game',name:'Pick the game',time:'15 min',format:'Team · live',who:'HR team and facilitator',does:'Agree whether HR plays an attention, transaction or productivity game. Tie AI work to employee and manager value rather than activity.',adds:'The chosen game and value exchange',destination:'Team twin'},
  {id:'ns-metrics',name:'Sort the team’s measures',time:'15 min · proposed',format:'Solo · async',who:'Each participant, before the team discussion',does:'List today’s measures and distinguish work and bets from longer-term results. Use Magic Chart to flag vanity measures and find the baseline for AI change.',adds:'A metrics inventory and sorted measures',destination:'Team twin'},
  {id:'ns-assumptions',name:'Surface assumptions',time:'10 min · proposed',format:'Solo · async',who:'Each participant, privately first',does:'Make beliefs, fears and hype about AI explicit. Map assumptions from ubiquitous to unique so the team can test them.',adds:'A map of assumptions to validate',destination:'Team twin'},
  {id:'ns-ladder',name:'Confidence ladder',time:'15 min',format:'Team · live',who:'HR team and facilitator',does:'Rate employee-journey steps from a hunch to very confident. Use Value Moments and Signals Brainstorm to mark where AI could help and what would earn trust.',adds:'A rated journey map with signals and employee value moments',destination:'Opportunities'},
  {id:'ns-statement',name:'Write the statement',time:'15 min',format:'Team · AI-guided',who:'HR team, with an AI guide',does:'Work from statement to inputs, opportunities and interventions, each with measurement options. Try an alternative statement; the AI guide proposes, the team decides.',adds:'A statement worksheet for the AI-native team',destination:'Plan'},
  {id:'ns-converge',name:'Agree the metric and inputs',time:'30 min',format:'Team · live',who:'HR team and facilitator',does:'Converge on one North Star, its definition, inputs and business impacts. Use Discussion Prompts and Clustering Example to apply the seven checks. AI is an input, not the goal.',adds:'A draft framework: one metric, its definition and inputs',destination:'Plan'},
  {id:'ns-bet',name:'Bet up',time:'20 min · proposed',format:'Solo · AI-guided',who:'Each pilot owner, with an AI guide',does:'Start from the work already under way and move up two increase/decrease levels. Trace every AI pilot to an input; stop pilots that trace to nothing.',adds:'A bet-to-input chain for each pilot',destination:'Plan'},
  {id:'ns-context',name:'Turn inputs into actions',time:'20 min · proposed',format:'Team · async',who:'Team lead and initiative owners',does:'Turn context into levers, an OKR and time-bound interventions. Connect the agreed inputs to owned AI initiatives.',adds:'A lever tree with time-bound interventions and an OKR',destination:'Plan'}
].map(m=>({...m,type:'team',status:'Not started'}));

export const modules = [
  {id:'survey',name:'Survey',type:'individual',time:'5 min',who:'Everyone, individually',status:'Complete · 10/10',does:'Capture confidence, friction and where each person wants more room to contribute.',adds:'Starting context for all six role twins',destination:'Role twins'},
  {id:'role-analysis',name:'Role analysis',type:'individual',time:'15 min',who:'Each person, with their own role',status:'Draft · 6/10',does:'Review a personalised task analysis. Correct the time split, systems and work that the model missed.',adds:'Verified tasks and time shares for role twins',destination:'Role twins'},
  {id:'cards',name:'Card sorting',type:'individual',time:'8 min',who:'Each person, individually',status:'Ready · 0/10',does:'Sort your tasks into work to amplify, hand over and protect. The model starts the conversation; you decide what fits.',adds:'Personal priorities and human boundaries for role twins',destination:'Role twins'},
  {id:'interview',name:'Interview',type:'individual',time:'20 min',who:'Each person with an AI interviewer',status:'Not started',does:'An AI interviewer asks about exceptions, judgement, handoffs and the work that is hard to see in a job description.',adds:'Context and exceptions for opportunities and role twins',destination:'Opportunities'},
  {id:'agenda',name:'Connect your agenda',type:'individual',time:'3 min setup',who:'Each person, opt-in',status:'Not connected',does:'Use a read-only calendar connection to compare scheduled time with the task analysis. Review categories before sharing aggregates.',adds:'A grounded time baseline for the role and team twins',destination:'Team twin'},
  {id:'sipoc',name:'SIPOC',type:'team',time:'30 min',who:'HR team and a process owner',status:'Not started',does:'Map suppliers, inputs, process, outputs and customers for hire-to-productive. Agree where the process starts and ends.',adds:'Process boundaries and handoffs for the team twin',destination:'Team twin'},
  {id:'value-stream',name:'Value stream analysis',type:'team',time:'45 min',who:'HR team and key handoff partners',status:'Not started',does:'Follow one real case. Separate touch time, queue time, rework and handoffs, then check the largest delays.',adds:'Bottlenecks and effort assumptions for the opportunity order',destination:'Opportunities'},
  ...northStarModules,
  {id:'north-star',name:'North Star live workshop · Bundle',type:'team',time:'120–135 min',format:'Team · live workshop',who:'HR team, an unbiased facilitator and handoff partners',status:'Not started',does:'A live workshop bundle using the Guide’s eight-part agenda. Use the separate North Star exercise modules above for preparation and follow-through. Illustrative HR North Star: Requests Resolved Right First Time.',adds:'Documented workshop decisions for the goal and plan',destination:'Plan'},
  {id:'guardrails',name:'Human boundaries & guardrails',type:'team',time:'30 min',who:'HR lead, HR team and a data owner',status:'Not started',does:'Agree which decisions stay human, who approves drafts, what information is restricted and when a workflow must stop.',adds:'Decision rights and review gates for every opportunity',destination:'Steps & approach'}
];

export const sortCards = [
  {task:'Handle employee complaints, investigate concerns, agree action and follow up.',source:'13-1071.00:18852',hint:'Think about the listening, evidence preparation and decision as separate parts.'},
  {task:'Analyse employment data and prepare required workforce reports.',source:'13-1071.00:18853',hint:'Which part needs your interpretation, and which part is repeated calculation?'},
  {task:'Conduct exit interviews, complete termination paperwork, and coordinate approved departure records.',source:'13-1071.00:18854',hint:'Protect the conversation. Consider what could prepare and follow up around it.'},
  {task:'Prepare policy options, discuss them with management and implement approved personnel procedures.',source:'13-1071.00:18856',hint:'Consider how more options or better preparation could improve your advice.'}
];

export const northStarParts = [
  {name:'Opening discussion',time:'15 min',does:'Discuss where HR time goes, the impact it creates and what the team would do with returned capacity.',output:'Not specified in the guide; capture shared context as a local facilitation note.'},
  {name:'Identify the game',time:'15 min',does:'Choose attention, transaction or productivity. For HR, discuss the productivity game: good service can mean less time spent with HR.',output:'The chosen game and its value exchange.'},
  {name:'Good and bad North Star',time:'15 min',does:'Use the seven checks: customer value, strategy, leading indicator, actionability, clarity, measurability and no vanity metrics. Try a terrible metric such as prompts sent.',output:'Anti-examples as guardrails.'},
  {name:'Abstract exercise',time:'15 min · optional',does:'Choose Magic Chart, Confidence Ladder or Value Moments. HR example: a Confidence Ladder across the employee journey and trust in AI.',output:'The exercise board.'},
  {name:'Statement exercise',time:'15 min',does:'Work top-down through a statement, inputs, opportunities and interventions, with measurement options. Try self-service, agent handling and data quality as HR levers.',output:'A statement worksheet.'},
  {name:'Structure of NSM and inputs',time:'15 min',does:'Express the North Star as a function of a handful of inputs. Consider breadth, depth, frequency and efficiency.',output:'NSM = f(inputs).'},
  {name:'North Star for another product',time:'15 min',does:'Warm up in small groups: identify another product’s game, North Star and inputs, then share. The guide uses OpenTable; the HR adaptation uses an IT helpdesk.',output:'A worksheet for that product.'},
  {name:'Draft your own and converge',time:'30 min',does:'Draft silently for 5–10 minutes, pair and share, test candidates against the checklist, then document the game, strongest candidates, eliminations and missing information.',output:'Documented decisions.'}
];
export const northStarInputs = [
  ['Breadth','Share of request types with an AI-assisted path'],
  ['Depth','Share of requests an AI agent completes end to end'],
  ['Frequency','HR staff using AI in their workflow each week'],
  ['Efficiency','Accuracy of AI answers in a weekly audited sample']
];
