import { roster as initialRoster, approaches, opportunities, modules, quarters, northStar } from './data.js';
import { sourceTasks } from './source-tasks.js';
import { exercises, initialMetrics, metricKinds } from './exercises.js';

const paths = {
  arrow:'M5 12h14m-5-5 5 5-5 5', chevron:'m6 9 6 6 6-6', check:'m5 12 4 4L19 6',
  upload:'M12 16V3m-4 4 4-4 4 4M4 15v5h16v-5', mic:'M9 5a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0V5ZM5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8',
  edit:'m14 5 5 5M4 20l5-1L21 7l-4-4L5 15l-1 5Z', plus:'M12 5v14M5 12h14',
  people:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M15 3.13a4 4 0 0 1 0 7.75M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  target:'M21 12a9 9 0 1 1-9-9m9 0-9 9m9-9v6m0-6h-6M16 12a4 4 0 1 1-4-4',
  spark:'m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z',
  document:'M14 2H5v20h14V7l-5-5Zm0 0v6h5M8 12h8m-8 4h6',
  shield:'m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Zm-4 9 3 3 5-6',
  layers:'m12 3 10 5-10 5L2 8l10-5ZM2 12l10 5 10-5M2 16l10 5 10-5',
  clock:'M12 7v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
  calendar:'M4 5h16v16H4V5ZM8 2v6m8-6v6M4 11h16',
  cards:'m8 3 13 4-5 15-13-4L8 3ZM7 9l8 3m-9 1 7 2',
  chat:'M21 11a9 9 0 0 1-9 9H3l2-5a9 9 0 1 1 16-4ZM8 9h8m-8 4h5',
  map:'m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Zm6-2v16m6-14v16',
  chart:'M4 3v17h17M8 16v-5m5 5V6m5 10V9',
  minus:'M5 12h14', refresh:'M20 7v5h-5M4 17v-5h5M6 6a8 8 0 0 1 13 3M5 15a8 8 0 0 0 13 3'
};
const icon = (name, cls='') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name] || paths.spark}"/></svg>`;
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $ = (selector) => document.querySelector(selector);
const state = {
  roster: structuredClone(initialRoster), setupConfirmed:false, panel:null, editIndex:null,
  extracted:false, extractionChecked:false, voiceStep:0, voiceRunning:false,
  selectedOpportunity:'reporting', sort:'priority', moduleStage:'intro', cardIndex:0,
  sorts:[], moduleDone:false, messages:[], previewModule:null, rosterChanged:false, teamName:'HR', fileName:'', mobileView:'canvas',
  exercises:Object.fromEntries(Object.keys(exercises).map(key=>[key,{stage:'questions',answers:[],scopes:['To discuss','To discuss','To discuss'],metrics:structuredClone(initialMetrics),saved:null}]))
};
let route = 'setup';
let voiceTimer;
let toastTimer;
const navItems = [['setup','Team setup'],['goal','The goal'],['team','Team twin'],['role','Role twin'],['opportunities','Opportunities'],['plan','Plan'],['modules','Modules']];
const approachLabel = key => approaches.find(a=>a[0]===key)?.[1] || key;
const action = (label, name, cls='primary', extra='') => `<button class="${cls}" data-action="${name}" ${extra}>${label}</button>`;
const link = (label, target, cls='primary') => `<a class="${cls}" href="#/${target}">${label}</a>`;
const tag = (label, cls='') => `<span class="tag ${cls}">${label}</span>`;
const heading = (title, description, extra='') => `<div class="page-heading"><div><h1>${title}</h1><p>${description}</p></div>${extra}</div>`;
const sourceNote = '<p class="source-note">Fictional Noordhaven sample. Team estimates come from the HR flow model: 134 tasks, 945 steps. Allocations, initiative estimates and conversations are illustrative. Gross estimates exclude build, licence and upkeep costs.</p>';
const fteTotal = () => state.roster.reduce((sum,r)=>sum+Number(r.fte),0);

function northStarBlock(compact=false) {
  return `<section class="north-star-block ${compact?'compact':''}" aria-label="Illustrative HR North Star"><div class="north-star-title">${icon('target')}<h2>${northStar.name}</h2>${tag('Illustrative')}</div><p>${northStar.definition}</p><div class="north-star-inputs">${northStar.inputs.map(([name,definition])=>`<div><h3>${name}</h3><p>${definition}</p></div>`).join('')}</div><div class="north-star-foot"><span>Not validated. Agree the definition and baseline with the team.</span><a href="#/modules?open=ns-game">Explore the 8 North Star modules ${icon('arrow')}</a></div></section>`;
}

function northStarWorkshop() {
  return `<div class="north-star-workshop"><h3>Eight parts, from discussion to a shared metric</h3><p>120 min without the optional exercise; 135 min with it. The guide labels this a two-hour agenda, although all listed parts sum to 135 minutes.</p>${northStar.parts.map(([title,time,description,output],i)=>`<details class="workshop-part"><summary><span>${i+1}. ${title}</span><span>${time}</span>${icon('chevron','chevron')}</summary><div><p>${description}</p><p><strong>Output:</strong> ${output}</p></div></details>`).join('')}<p class="source-note">Afterwards: document the name and definition, mind-map inputs, test the metric and roadmap, share decisions and link each pilot to an input. Source: supplied research/north-star.md digest of the Amplitude Playbook, 2024 workshop guide and lead’s Miro board. HR adaptations and the draft metric are illustrative.</p></div>`;
}

const exerciseKey = () => new URLSearchParams(location.hash.split('?')[1]||'').get('type')==='inventory'?'inventory':'assumptions';
const exerciseSaved = key => state.exercises[key].saved;
const exerciseForModule = id => Object.keys(exercises).find(key=>exercises[key].id===id);
const exerciseEffects = key => key==='assumptions'?[
  ['Team twin · human boundary','Keep sensitive advice with a named HR colleague. Add the reviewed belief, fear and hype as assumptions to test.','team?focus=human-boundaries'],
  ['Opportunity · employee support','Add an explicit source-and-accuracy check before a sensitive reply can leave HR.','opportunities?id=support'],
  ['Q2 · employee-support pilot','Nour checks a sample; sensitive or unresolved requests return to a person before expanding the pilot.','plan?focus=initiative-Q2']
]:[
  ['Opportunity · employee record','Attach the reviewed inventory as candidate quality checks for correct employee changes.','opportunities?id=records'],
  ['Q1 · trusted records','Lotte agrees the definitions and records a baseline before the payroll-change pilot grows.','plan?focus=initiative-Q1'],
  ['Q4 · outcome dashboard','Include the kept measures. Separate vanity candidates from measures of success.','plan?focus=initiative-Q4']
];

function effectsList(key,applied=true) {
  return `<div class="exercise-effects">${exerciseEffects(key).map(([title,description,target])=>`<div><h3>${title}</h3><p>${description}</p><a href="#/${target}">${applied?'See the changed part':'Inspect the current part'} ${icon('arrow')}</a></div>`).join('')}</div>`;
}

function moduleEvidence() {
  const keys=Object.keys(exercises).filter(exerciseSaved);
  if(!keys.length)return '';
  return `<section class="module-evidence section-block" id="module-evidence"><h2>What your modules changed</h2>${keys.map(key=>`<div class="evidence-entry"><div class="section-heading"><h3>${exercises[key].name}</h3>${tag('Added to goal')}</div><p>${exercises[key].contribution}</p>${effectsList(key)}${link('Review your answers',`exercise?type=${key}`,'text-button')}</div>`).join('')}</section>`;
}

function savedAssumptions() {
  const saved=exerciseSaved('assumptions');
  return saved?`<div class="exercise-impact"><h3>Added by Strategic assumptions</h3><p>These are your team’s draft assumptions, not validated findings.</p>${saved.answers.map((text,i)=>`<p><strong>${exercises.assumptions.prompts[i].label} · ${esc(saved.scopes[i])}:</strong> ${esc(text)}</p>`).join('')}<p><strong>Test before expanding:</strong> review answer accuracy against approved policy and confirm a route back to a person.</p>${link('Review the assumption map','exercise?type=assumptions','text-button')}</div>`:'';
}

function savedMetricList() {
  const saved=exerciseSaved('inventory');
  return saved?`<div class="exercise-impact"><h3>Added by Metrics inventory</h3><p>Reviewed candidate measures. Baselines and definitions still need confirmation.</p><ul class="plain-list">${saved.metrics.map(m=>`<li><strong>${esc(m.name)}</strong> · ${esc(m.kind)}</li>`).join('')}</ul><p><strong>Ownership note:</strong> ${esc(saved.answers[2])}</p>${link('Review the inventory','exercise?type=inventory','text-button')}</div>`:'';
}

function renderExercise() {
  const key=exerciseKey(), config=exercises[key], draft=state.exercises[key], review=draft.stage==='review', done=draft.stage==='done';
  const intro=heading(config.name,config.intro,tag('Solo · AI-guided'));
  const notice=`<p class="source-note">AI-guided mock conversation; replies are scripted and answers stay in this tab. Based on the supplied North Star digest, sections b, d and e. The exercise formats are adapted for this mockup; board timings are not specified.</p>`;
  const star=`<div class="plan-note">${icon('target')}<span><strong>Illustrative North Star:</strong> ${northStar.name}. This is a draft to test with the team, not a validated measure.</span></div>`;
  if(done)return `${intro}<section class="inline-module exercise-complete"><div class="completion-icon">${icon('check')}</div><h2>This added to your goal.</h2><p>${config.contribution}</p>${effectsList(key)}<p class="source-note">These draft changes are now visible on the linked screens. The supplied capacity estimates are unchanged.</p><div class="panel-actions">${link('See the goal update '+icon('arrow'),'goal?focus=module-evidence')}${action('Edit your answers','review-exercise','secondary')}</div></section>${star}${notice}`;
  const notes=config.prompts.map((prompt,i)=>`<div class="exercise-note"><h3>${prompt.label}</h3>${review?`<label class="sr-only" for="exercise-answer-${i}">${prompt.label}</label><textarea id="exercise-answer-${i}" data-exercise-answer="${i}" rows="3" required>${esc(draft.answers[i]||'')}</textarea>`:`<p>${draft.answers[i]?esc(draft.answers[i]):'Not answered yet. The agent will ask about this in the conversation.'}</p>`}${key==='assumptions'&&draft.answers[i]?`<label class="scope-label">How widely is this held?<select data-exercise-scope="${i}">${['To discuss','Widely held','Specific to our team'].map(scope=>`<option ${scope===draft.scopes[i]?'selected':''}>${scope}</option>`).join('')}</select></label>`:''}</div>`).join('');
  const metrics=key==='inventory'?`<section class="inventory-list"><h2>Measures to review</h2><p>Initial rows are illustrative, not connected HR data. Classifications are suggestions relative to the draft North Star. You can change every one.</p>${draft.metrics.map((m,i)=>`<div class="inventory-row"><label>Measure<input aria-label="Measure ${i+1}" data-metric-name="${i}" value="${esc(m.name)}" required></label><label>Classification<select aria-label="Classification for measure ${i+1}" data-metric-kind="${i}">${metricKinds.map(kind=>`<option ${kind===m.kind?'selected':''}>${kind}</option>`).join('')}</select></label><p>${esc(m.reason)} <span>${esc(m.source)}</span></p></div>`).join('')}<button class="secondary" data-action="add-metric">${icon('plus')} Add a measure</button></section>`:'';
  return `${intro}<div class="exercise-progress"><span>${review?'Review before applying':`${draft.answers.length} of 3 answers captured`}</span>${action(review?'Continue in conversation':'Answer in conversation','exercise-conversation','text-button')}</div>${star}<section class="inline-module exercise-work" aria-label="Exercise draft"><h2>${review?'Check what the agent heard':'Your draft fills as you talk'}</h2><p>${review?'Edit the notes, review the proposed changes, then apply them to the goal. Nothing below is applied yet.':'Send an answer in the conversation or use the labelled sample. You can pause and return; the draft stays in this tab.'}</p><div class="exercise-notes">${notes}</div>${metrics}${review?`<h2>Proposed changes to the goal</h2>${effectsList(key,false)}<p class="source-note">The links show the current screens. The additions appear after you apply this review. No capacity estimate or North Star has been validated by this exercise.</p><p id="exercise-error" role="alert" hidden></p><div class="panel-actions">${action('Apply to the goal '+icon('check'),'save-exercise')}${link('Pause and return to modules','modules','text-button')}</div>`:`<div class="panel-actions">${action('Continue with the agent '+icon('chat'),'exercise-conversation')}${link('Pause exercise','modules','text-button')}</div>`}</section>${notice}`;
}

function renderExerciseConversation() {
  const key=exerciseKey(),config=exercises[key],draft=state.exercises[key], step=draft.answers.length;
  const answered=config.prompts.slice(0,step).map((prompt,i)=>`<div class="agent-mark">${icon('spark')} agentlabs · ${prompt.label}</div><div class="message agent"><p>${prompt.question}</p></div><div class="message user">${esc(draft.answers[i])}</div>`).join('');
  const prompt=config.prompts[step];
  const ending=draft.stage==='done'?`<h2>Your goal now carries this.</h2><p>${config.contribution}</p><p><a href="#/goal?focus=module-evidence">See the goal update ${icon('arrow')}</a></p>`:draft.stage==='review'?'<h2>Let’s check it together.</h2><p>Your draft is ready on the canvas. Edit anything I heard incorrectly and review the proposed changes. They are not applied until you choose “Apply to the goal”.</p>':`<h2>${step===0?'Let’s make the work visible.':'Let’s go one level deeper.'}</h2><p>${prompt.question}</p><div class="agent-note"><strong>Sample answer · you can write your own</strong>${prompt.sample}</div>`;
  $('#conversation-thread').innerHTML=`<div class="thread-marker">${config.name} · ${draft.stage==='questions'?`Question ${step+1} of 3`:'Review and contribution'}</div>${answered}<div class="agent-mark">${icon('spark')} agentlabs</div><div class="message agent">${ending}</div>`;
  $('#agent-suggestions').innerHTML=draft.stage==='questions'?action('Use sample answer '+icon('arrow'),'sample-exercise','exercise-sample'):action(draft.stage==='done'?'See what changed on the canvas':'Review on the canvas','exercise-canvas','exercise-sample');
  $('#message').disabled=draft.stage!=='questions';
  $('.send-button').disabled=draft.stage!=='questions';
  $('#message').placeholder=draft.stage==='questions'?'Your answer, in your own words…':'Review and edit your answers on the canvas';
  $('#restart-chat').setAttribute('aria-label','Review exercise draft');
  $('#restart-chat').innerHTML=icon('edit');
  requestAnimationFrame(()=>{$('#conversation-thread').scrollTop=$('#conversation-thread').scrollHeight;});
}

function answerExercise(text) {
  const draft=state.exercises[exerciseKey()];
  if(draft.stage!=='questions')return;
  draft.answers.push(text);
  if(draft.answers.length===3)draft.stage='review';
  $('#message').value='';render();setView('conversation');
}

function toast(text) {
  $('#toast').textContent = text;
  $('#toast').classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>$('#toast').classList.remove('visible'),3500);
}

function go(target) {
  if (location.hash === `#/${target}`) render();
  else location.hash = `#/${target}`;
  setView('canvas');
}

function setView(view) {
  state.mobileView = view;
  $('.app-layout').dataset.mobileView = view;
  document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('selected',b.dataset.view===view));
}

function setupPanel() {
  if (state.panel==='upload') return `<section class="inline-panel" aria-label="Source extraction"><h2>Start with something you already have</h2><p>An org chart screenshot, job description or transcript is enough to start. Review the extraction before using it.</p><div class="panel-actions"><label class="secondary" for="source-file">${icon('upload')} Choose a source</label><input class="sr-only" type="file" id="source-file" accept="image/*,.pdf,.doc,.docx,.txt"><button class="primary" data-action="extract-sample">Use sample org chart ${icon('arrow')}</button></div>${state.fileName?`<p class="source-note">Selected: ${esc(state.fileName)}. This frontend demo uses the sample org chart to show how review works; it does not process your file.</p>`:''}${state.extracted?`<div style="margin-top:18px"><h3>Extracted from Noordhaven org chart</h3>${state.roster.map((r,i)=>`<div class="extract-row"><div>${i===5?`<input id="check-payroll" type="checkbox" ${state.extractionChecked?'checked':''} aria-label="Confirm Payroll Clerk is one full-time person">`:icon('check')}<span>${esc(r.role)} · ${r.fte} FTE</span></div>${i===5?tag(state.extractionChecked?'Checked':'Check this','warn'):`<span class="confidence">${[98,96,95,97,93][i] || 94}% confidence</span>`}</div>`).join('')}<p class="source-note">Payroll label was partly cropped. Sample confidence: 72%. Check the person and FTE.</p><div class="panel-actions">${action('Use this roster '+icon('arrow'),'use-extraction','primary',state.extractionChecked?'':'disabled')}</div></div>`:''}</section>`;
  if (state.panel==='voice') return `<section class="inline-panel ${state.voiceRunning?'recording':''}" aria-label="Voice conversation"><h2>Tell me about your team</h2><p>Try a scripted voice session. No microphone is accessed.</p><div class="voice-transcript"><p id="live-transcript">${['“We’re the HR team at Noordhaven…”','“Ten of us. I’m the HR Manager. Yara, Daan and Nour are HR Specialists…”','“Sanne and Milan handle learning, Ruben handles compensation, Lotte and Amir support HR, and Eva does payroll.”'][Math.min(state.voiceStep,2)]}</p></div><div class="voice-roster" aria-label="Roster filling from voice">${initialRoster.slice(0,[1,2,6][state.voiceStep]).map(r=>`<span>${esc(r.people)}<small>${esc(r.role)}</small></span>`).join('')}</div><div class="voice-status"><span class="voice-bars">${'<i></i>'.repeat(7)}</span><span>${state.voiceRunning?'Sample transcript updating…':state.voiceStep===2?'6 roles and 10 people added to the roster':'Ready for sample voice session'}</span></div><div class="panel-actions">${action(state.voiceRunning?'Stop sample':state.voiceStep===2?'Replay sample':'Play sample voice',state.voiceRunning?'stop-voice':'play-voice','secondary')}${state.voiceStep===2?action('Use this roster '+icon('arrow'),'use-voice'):''}</div></section>`;
  if (state.panel==='edit' || state.panel==='manual') {
    const editing = state.editIndex!==null;
    const r = editing?state.roster[state.editIndex]:{role:'',people:'',fte:1,systems:'AFAS Profit, Outlook'};
    return `<section class="inline-panel" aria-label="${editing?'Edit role':'Add a role'}"><h2>${editing?'Edit '+esc(r.role):'Add a role by hand'}</h2><form id="roster-form"><div class="form-grid"><label class="field">Team name<input name="team" value="${esc(state.teamName)}" required></label><label class="field">Role<input name="role" value="${esc(r.role)}" placeholder="e.g. HR Specialist" required></label><label class="field">People<input name="people" value="${esc(r.people)}" placeholder="First names, separated by commas" required></label><label class="field">FTE<input name="fte" type="number" min="0.1" max="100" step="0.1" value="${r.fte}" required></label><label class="field field-wide">Systems<input name="systems" value="${esc(r.systems)}" required></label></div><p class="form-error" id="roster-error" role="alert" hidden></p><div class="panel-actions"><button class="primary" type="submit">${editing?'Save role':'Add to roster'} ${icon('check')}</button>${action('Cancel','close-panel','secondary')}</div></form></section>`;
  }
  return '';
}

function renderSetup() {
  return `${heading('Start with the team you know.','A rough picture is enough. We’ll make it clear together.',tag('Draft roster'))}
  <div class="input-methods"><div class="input-method">${icon('upload')}<h3>Bring a source</h3><p>Org chart, job descriptions<br>or a meeting transcript.</p>${action('Upload or try a sample '+icon('arrow'),'show-upload','text-button')}</div><div class="input-method">${icon('mic')}<h3>Talk it through</h3><p>Tell the agent who’s on your team.<br>Watch the roster take shape.</p>${action('Try a voice session '+icon('arrow'),'show-voice','text-button')}</div><div class="input-method">${icon('edit')}<h3>Add it yourself</h3><p>Team, roles, people and systems.<br>You can edit every detail.</p>${action('Add a role '+icon('arrow'),'show-manual','text-button')}</div></div>
  ${setupPanel()}
  <section class="roster-section" aria-label="Editable team roster"><div class="section-top"><div><h2>${esc(state.teamName)} at Noordhaven</h2><p>${state.roster.reduce((n,r)=>n+r.people.split(',').filter(s=>s.trim()).length,0)} people · ${state.roster.length} roles · ${fteTotal()} FTE · editable sample</p></div>${action(icon('plus')+' Add role','show-manual','text-button')}</div><div class="roster-head"><span>Role</span><span>People</span><span>FTE</span><span>Systems</span><span></span></div>${state.roster.map((r,i)=>`<div class="roster-row"><span class="roster-role">${esc(r.role)}</span><span class="roster-people">${esc(r.people)}</span><span class="fte">${r.fte}</span><span class="roster-system">${esc(r.systems)}</span><button class="icon-button" data-action="edit-role" data-index="${i}" aria-label="Edit ${esc(r.role)}">${icon('edit')}</button></div>`).join('')}</section>
  <div class="bottom-action"><p>${state.setupConfirmed?'Roster checked. You can still change it at any time.':'Pre-filled from the sample. Check the people and systems with your team.'}</p>${action('Looks right. Show me the goal '+icon('arrow'),'confirm-setup')}</div><p class="source-note">Systems in this sample: recruitment system (ATS), HR system (HCM), payroll, Outlook and SharePoint. AFAS Profit is the supplied Noordhaven HR system.</p>`;
}

function renderGoal() {
  const assumptions=exerciseSaved('assumptions'), inventory=exerciseSaved('inventory');
  const informed=assumptions&&inventory?5:state.moduleDone||assumptions||inventory?4:3;
  const rows = [
    ['people','Re-imagined roles',state.moduleDone?'Yara’s priorities added. Five other roles still need their input.':'Six role drafts. Check what each person wants more time for.',['Role analysis','Card sorting'],'role',state.moduleDone?'Evidence added':'Draft ready'],
    ['layers','A team twin',assumptions?'Your belief, fear and hype now inform the human boundary and the pilot test.':'See how the same team can take on more valuable work.',['SIPOC',assumptions?'Strategic assumptions':'Connect your agenda'],'team',assumptions?'Boundary added':'Draft ready'],
    ['spark','Prioritised opportunities',inventory?'The employee-record opportunity now carries your reviewed quality measures.':'A clear list of things worth changing, sorted by value / effort.',['Survey',inventory?'Metrics inventory':'Value stream analysis'],'opportunities',inventory?'Measures added':'Draft ready'],
    ['map','A plan you can act on',assumptions||inventory?'Your module reviews added named pilot checks. Definitions and baselines still need testing.':'Quarterly initiatives, named owners and checks before scaling.',['North Star workshop',inventory?'Metrics inventory':'Value stream analysis'],'plan',assumptions||inventory?'Checks added':'Needs team input'],
    ['shield','An approach for every step',assumptions?'The employee-support opportunity now requires a source-and-accuracy check before sensitive advice.':'Know what to build, what to remove and what stays human.',['Role analysis',assumptions?'Strategic assumptions':'Human boundaries'],'opportunities',assumptions?'Review gate added':'Needs review']
  ];
  return `${heading('A clearer future for your team.','This is what we’re building towards. Every conversation and module makes the draft more yours.',tag('Your destination'))}
  <div class="goal-summary"><div><strong>${assumptions||inventory?'Your reviewed modules now shape the goal.':state.moduleDone?'Yara’s voice is now part of the picture.':'Your team’s first picture is ready.'}</strong><p>${assumptions||inventory?'See exactly which draft sections changed below. The North Star remains illustrative.':state.moduleDone?'Card sorting added personal priorities and human boundaries.':'The model gives us a starting point. Your people give it meaning.'}</p></div><div><span class="tag">${informed} of 5 parts informed</span><div class="progress-track"><span style="width:${informed*20}%"></span></div></div></div>
  ${northStarBlock(true)}${moduleEvidence()}<section class="goal-map" aria-label="Goal deliverables">${rows.map(([ic,title,desc,mods,target,status])=>`<div class="goal-row"><span class="goal-icon">${icon(ic)}</span><div><h3>${title}</h3><p>${desc}</p></div><div class="module-links">${mods.map(m=>`<a href="#/modules${m==='North Star workshop'?'?open=north':m==='Strategic assumptions'?'?open=ns-assumptions':m==='Metrics inventory'?'?open=ns-inventory':''}" title="See ${m} in the module library">${m}</a>`).join('')}</div><a href="#/${target}">${status} ${icon('arrow')}</a></div>`).join('')}</section>
  <div class="goal-exercises"><h2>Give the North Star a stronger foundation</h2><p>Two guided conversations turn private beliefs and today’s measures into reviewable changes.</p><div class="panel-actions">${link('Explore strategic assumptions','exercise?type=assumptions','secondary')}${link('Review today’s HR measures','exercise?type=inventory','secondary')}</div></div>
  <div class="bottom-action"><p>${state.moduleDone?'Next, ask the team about handoffs and exception handling.':'Suggested next: let Yara sort five real tasks. About 6 minutes.'}</p>${link(state.moduleDone?'Explore the team twin '+icon('arrow'):'Try card sorting '+icon('arrow'),state.moduleDone?'team':'module')}</div>${sourceNote}`;
}

function renderTeam() {
  return `${heading('More room for the work that matters.','A draft of what your HR team could become. Keep the people. Change the shape of the work.',tag('Team twin · draft'))}${state.rosterChanged?'<div class="plan-note">Roster edited. Capacity estimates still use the supplied 10-person HR sample; they have not been recalculated.</div>':''}
  <section class="amplification"><div><h2>From keeping up with requests<br>to getting ahead of people’s needs.</h2><p>Use returned capacity for earlier support, better workforce decisions and development that gets followed through.</p>${link('Meet Yara’s re-imagined role '+icon('arrow'),'role','text-button')}</div><div class="capacity-allocation"><div><div class="allocation-label"><span>Employee support</span><strong>2.5 FTE</strong></div><div class="allocation-track"><span style="width:100%"></span></div></div><div><div class="allocation-label"><span>Workforce planning</span><strong>2.0 FTE</strong></div><div class="allocation-track coral"><span style="width:80%"></span></div></div><div><div class="allocation-label"><span>Manager coaching</span><strong>1.0 FTE</strong></div><div class="allocation-track blue"><span style="width:40%"></span></div></div><span class="source-note">Illustrative use of 5.5 FTE gross capacity</span></div></section>
  <section class="capacity-summary" aria-label="Gross capacity estimate"><p>The model suggests <strong>8,850 hours a year returned, equivalent to 5.5 FTE and EUR 586k in annual capacity value</strong> — gross estimates for this 10 FTE team, with an approximate 2.2× model ceiling.</p><div class="capacity-bar" role="img" aria-label="Of 10 FTE, 5.5 FTE could be returned and 4.5 FTE remains in current work. Gross model estimate."><span></span></div><div class="capacity-bar-labels"><span>5.5 FTE potentially returned · gross estimate</span><span>4.5 FTE in current work</span></div></section>
  ${northStarBlock()}<section class="section-block"><div class="section-heading"><h2>Every role moves towards people.</h2><div class="legend-inline"><span><i class="swatch admin"></i>Administration</span><span><i class="swatch people"></i>People + judgement</span></div></div><div class="role-shifts">${state.roster.map((r,i)=>`<a class="shift-row" href="#/role?person=${encodeURIComponent(r.people.split(',')[0].trim())}&role=${i}" aria-label="Explore ${esc(r.role)} role twin"><span class="shift-name">${esc(r.role)}</span><small>${r.fte} FTE</small><div class="paired-bars"><div class="bar-line"><span>Before</span><div class="stacked-bar"><span style="width:${r.shift?.[0]||65}%"></span></div></div><div class="bar-line"><span>After</span><div class="stacked-bar"><span style="width:${r.shift?.[1]||25}%"></span></div></div></div>${icon('arrow')}</a>`).join('')}</div><p class="source-note">Illustrative mix of a working week, with returned time reinvested. Validate with role analysis and a read-only calendar review.</p></section>
  <section class="section-block"><div class="section-heading"><h2>A year to get there, one useful change at a time.</h2>${link('See the plan '+icon('arrow'),'plan','text-button')}</div><div class="roadmap-mini">${quarters.map(q=>`<div class="quarter-mini"><strong>${q.label}</strong><p>${q.name}</p></div>`).join('')}</div></section>
  <section class="human-band" id="human-boundaries">${icon('shield')}<div><h3>The human part stays human.</h3><p>Trust, sensitive conversations, employment decisions, policy judgement and final approval remain with the team. New checking and upkeep work also needs time.</p>${savedAssumptions()}</div></section>${sourceNote}`;
}

function renderRole() {
  const params=new URLSearchParams(location.hash.split('?')[1]||'');
  const i = Number(params.get('role')??1);
  const selected=state.roster[i] || state.roster[1];
  const person=params.get('person') || 'Yara';
  const generic=i!==1;
  const categories=generic?['Routine administration','Preparing decisions','People and judgement','Improvement and coaching']:['Records + report assembly','Recruitment administration','Employee support + advice','Workforce insight + coaching'];
  const before=[18,10,8,4], after=[6,8,16,10];
  const colors=['var(--admin-tone)','var(--blue)','var(--green)','var(--coral)'];
  const week=(title,hours,cls='')=>`<div class="week-panel ${cls}"><h2>${title}<span>40 h / week</span></h2><div class="week-stack">${hours.map(h=>`<i style="width:${h/40*100}%"></i>`).join('')}</div>${categories.map((c,j)=>`<div class="week-row"><span><i class="swatch" style="background:${colors[j]}"></i>${c}</span><b>${hours[j]} h</b></div>`).join('')}</div>`;
  return `<div class="page-heading"><div class="person-heading"><span class="avatar">${esc(person.slice(0,1))}</span><div><h1>${esc(person)}’s next working week.</h1><p>${esc(selected.role)} · Noordhaven Logistics</p></div></div>${tag(state.moduleDone?'Priorities added':'Role twin · draft')}</div><p style="color:var(--muted);font-size:13px;margin-bottom:24px">${generic?'Less routine administration. More time for people, judgement and improving the work.':'Less assembling the answer. More helping people decide what to do with it.'}</p>
  <section class="week-comparison" aria-label="Working week before and after">${week('Today',before)}${week('A possible next week',after)}</section><p class="source-note">Illustrative 40-hour allocations. The work week stays the same length; returned capacity is reinvested. Validate this mix with ${esc(person)}.</p>
  <div class="split-content section-block"><section><h2>Take the repetition off your plate.</h2><ul class="plain-list"><li>Scheduled data extracts replace repeated copy-and-paste.</li><li>Approved changes update a single employee record.</li><li>Templates prepare the first draft, with source links.</li></ul></section><section><h2>Make more of your judgement.</h2><ul class="plain-list"><li>Investigate workforce changes before they become a staffing issue.</li><li>Prepare options and rehearse a difficult conversation.</li><li>Coach managers on the pattern behind recurring requests.</li></ul></section></div>
  <section class="role-ambition"><h2>${state.moduleDone?'Your priorities now shape this role.':'One move up: own the insight, not the spreadsheet.'}</h2><p>${state.moduleDone?`You marked ${state.sorts.filter(s=>s==='amplify').length} ${state.sorts.filter(s=>s==='amplify').length===1?'task':'tasks'} to amplify, ${state.sorts.filter(s=>s==='human').length} to keep with you, and ${state.sorts.filter(s=>s==='remove').length} to take off your plate. These are preferences to discuss, not automatic changes.`:'Bring staffing risks to a weekly review. Explore adjacent work in aggregate pay-equity analysis, with the right context and disclosure controls.'}</p></section>
  <div class="split-content section-block"><section><h2>What stays yours</h2><ul class="plain-list"><li>Build trust and hear the employee’s account.</li><li>Weigh conflicting evidence and explain difficult outcomes.</li><li>Approve sensitive communications and own the advice.</li></ul></section><section><h2>Skills to grow</h2><ul class="plain-list"><li>Check source attribution and challenge AI drafts.</li><li>Frame staffing questions and interpret workforce measures.</li><li>Maintain definitions, access boundaries and useful templates.</li></ul></section></div><div class="bottom-action"><p>${generic?'This role uses an illustrative shared week pattern. Personal role analysis is still needed.':'Based on employee-support and workforce-reporting tasks. The week is an illustrative redesign.'}</p>${link('Add your priorities '+icon('arrow'),'module')}</div>`;
}

function renderOpportunities() {
  const sorted=[...opportunities].sort((a,b)=>state.sort==='value'?b.value-a.value:state.sort==='effort'?a.days-b.days:b.value/b.days-a.value/a.days);
  const op=opportunities.find(o=>o.id===state.selectedOpportunity)||sorted[0];
  return `${heading('A better way, one step at a time.','Ten selected changes across all six roles, from the model’s 134 tasks and 945 steps. Start with the outcome; choose the simplest approach for each step.',tag(`${opportunities.length} draft opportunities`))}
  <div class="filter-bar"><label for="opportunity-sort">Sort by <select id="opportunity-sort"><option value="priority" ${state.sort==='priority'?'selected':''}>Priority: value / effort</option><option value="value" ${state.sort==='value'?'selected':''}>Annual gross value</option><option value="effort" ${state.sort==='effort'?'selected':''}>Smallest effort first</option></select></label><span class="source-note" style="margin:0">Effort bands: S 5 · M 15 · L 30 days</span></div>
  <section class="opportunity-list" tabindex="0" aria-label="Ten prioritised opportunities; scroll to explore">${sorted.map((o,i)=>`<button class="opportunity-button ${o.id===op.id?'selected':''}" data-action="open-opportunity" data-id="${o.id}" aria-expanded="${o.id===op.id}" aria-controls="opportunity-detail"><span class="rank">${i+1}</span><div><h3>${o.name}</h3><p>${o.outcome}</p></div><span class="opportunity-value">EUR ${(o.value/1000).toLocaleString('en',{maximumFractionDigits:1})}k<small>/ year · gross estimate</small></span><span class="tag">${o.effort}</span></button>`).join('')}</section>
  <section class="detail-sheet" id="opportunity-detail" tabindex="-1"><h2>${op.name}</h2><p>${op.outcome}</p><div class="detail-meta"><span>Owner: ${op.owner}</span><span>${op.system}</span><span>${op.hours.toLocaleString('en')} h / year · gross estimate</span><span>Priority: ${Math.round(op.value/op.days).toLocaleString('en')} EUR / effort-day · gross estimate</span></div><ol class="steps">${op.steps.map(([text,approach,detail],i)=>`<li class="step"><div><h3>${text}</h3><p>${detail}${op.id==='support'&&i===2&&exerciseSaved('assumptions')?' Added by Strategic assumptions: verify source and answer accuracy; route sensitive or unresolved questions to Nour before any reply is sent.':''}</p></div><span class="approach ${approach}">${approachLabel(approach)}</span></li>`).join('')}</ol>${op.id==='support'?savedAssumptions():op.id==='records'?savedMetricList():''}<p class="source-note">Outcome input: ${op.metric}. ${op.sourceKind?'Rounded task-level gross estimates from the HR flow model.':'Grouped opportunity values are illustrative scenario estimates.'} Step designs adapt the supplied HR tasks. Confirm the baseline and effort with ${op.owner}.</p><div class="panel-actions">${link('See this in the plan '+icon('arrow'),`plan?focus=initiative-${quarters.find(q=>q.ids.includes(op.id))?.label||'Q1'}`,'secondary')}</div></section>
  <details class="approach-legend" open><summary>How to read the approaches ${icon('chevron','chevron')}</summary><div class="legend-list">${approaches.map(([id,label,desc])=>`<div><h3><span class="approach ${id}">${label}</span></h3><p>${desc}</p></div>`).join('')}</div></details><p class="source-note">Priority = annual gross value / effort midpoint. Effort bands are planning assumptions. These ten opportunities are a selected sample, not the full model. The first four use grouped scenario values; the other six use rounded task-level model estimates. Do not add them to the team estimate.</p>`;
}

function renderPlan() {
  return `${heading('Make the next step buildable.','Four quarters. Named owners. A useful result to prove before each change grows.',tag('Suggested roadmap'))}
  <div class="plan-note">${icon('target')}<span><strong>Illustrative North Star:</strong> ${northStar.name}. First prove the definition and baseline; use breadth, depth, frequency and efficiency as inputs to test.</span></div>
  ${quarters.map(q=>`<section class="plan-quarter" id="initiative-${q.label}"><div class="quarter-label">${q.label}</div><div><h2>${q.name}</h2><p>${q.build}</p><div class="owner"><span class="avatar">${q.owner.slice(0,1)}</span>Owner: ${q.owner}</div><div class="trace-links">${q.ids.map(id=>{const o=opportunities.find(o=>o.id===id);return `<a href="#/opportunities?id=${id}">${o.name} ${icon('arrow')}</a>`;}).join('')}</div><div class="pilot-check"><strong>Before expanding:</strong> ${q.check}${q.label==='Q2'&&exerciseSaved('assumptions')?'<p><strong>Added by Strategic assumptions:</strong> Nour checks source and answer accuracy in a sample. Sensitive or unresolved requests return to a person before expanding.</p>':''}${['Q1','Q4'].includes(q.label)&&exerciseSaved('inventory')?`<p><strong>Added by Metrics inventory:</strong> ${q.label==='Q1'?'Lotte agrees measure definitions and records the baseline for employee changes correct first time.':'Femke includes the reviewed inventory in the outcome dashboard. Vanity candidates stay separate from success measures.'}</p><p>Ownership note: ${esc(exerciseSaved('inventory').answers[2])}</p>${q.label==='Q4'?savedMetricList():''}`:''}</div></div></section>`).join('')}
  <section class="human-band">${icon('shield')}<div><h3>Owners approve the change.</h3><p>This roadmap is a discussion draft. Confirm access, actual effort, human review time and dependencies with the people doing the work.</p></div></section><div class="bottom-action"><p>Missing the input metric? The team can fill that in together.</p>${link('Open the module library '+icon('arrow'),'modules','secondary')}</div>`;
}

const moduleIcon = id=>({survey:'document',analysis:'chart',cards:'cards',interview:'chat',agenda:'calendar',sipoc:'map',stream:'layers',north:'target',boundaries:'shield'}[id] || 'target');
function moduleAccordion(m) {
  const exercise=exerciseForModule(m.id);
  const exerciseState=exercise?state.exercises[exercise]:null;
  const preview = m.id==='agenda'?'Review calendar categories first. The future connection would be read-only. No account is connected in this sample.':m.id==='sipoc'?'Start with employee change to payroll. Name the supplier, approved input, processing steps, payroll-ready output and customer.':m.does;
  return `<details class="module-item ${m.id==='cards'?'recommended':''}" id="module-${m.id}" ${m.id==='cards'?'open':''}>
    <summary><span class="module-icon">${icon(moduleIcon(m.id))}</span><div class="module-name"><h3>${m.name}</h3>${m.format?tag(m.format,'format'):''}</div><span class="module-time">${m.time}</span><span class="module-status">${exerciseState?.saved?'Added to goal':exerciseState?.answers.length?'In progress':m.id==='cards'&&state.moduleDone?'Complete':m.status}</span>${icon('chevron','chevron')}</summary>
    <div class="module-body"><p>${m.does}</p><dl><dt>Who takes part</dt><dd>${m.who}</dd><dt>Adds to your goal</dt><dd>${m.adds}</dd><dt>Fills</dt><dd>${m.goal}</dd>${m.output?`<dt>Output</dt><dd>${m.output}</dd>`:''}</dl>
    ${m.estimated?'<p class="source-note">Suggested duration is a mockup planning estimate. The source board does not specify a timebox.</p>':''}
    ${m.id==='north'?northStarWorkshop():''}
    ${exercise?link((exerciseState.saved?'Review ':exerciseState.answers.length?'Continue ':'Start ')+m.name+icon('arrow'),`exercise?type=${exercise}`):m.id==='cards'?link(state.moduleDone?'Review your sort '+icon('arrow'):'Start card sorting '+icon('arrow'),'module'):action('Preview '+m.name,'preview-module','secondary',`data-id="${m.id}"`)}
    ${state.previewModule===m.id?`<div class="module-preview"><h3>${m.name}: session preview</h3><p>${preview}</p><p>This preview shows the session brief. Card sorting, Strategic assumptions and Metrics inventory can be completed in this mockup.</p>${link('Explore the guided exercises','goal','text-button')}</div>`:''}</div></details>`;
}
function renderModules() {
  return `${heading('Build the picture together.','Small modules, each with a clear contribution. Start where your team needs more clarity.',tag('Individual + team'))}
  ${['Individual','Team'].map(group=>`<section class="module-section"><h2>${group==='Individual'?'From each person’s point of view':'Around the same table'}</h2><div class="module-list">${modules.filter(m=>m.group===group).map(moduleAccordion).join('')}</div></section>`).join('')}
  <p class="source-note">Eight North Star modules follow the supplied second-board digest, in order. Strategic assumptions and Metrics inventory adapt the board’s solo async exercises into AI-guided conversations. The live workshop bundles a separate eight-part Guide agenda. Times marked est. are planning estimates where the source has no timebox. Human boundaries is the added team module.</p>`;
}

const cardTasks=[sourceTasks[0],sourceTasks[1],sourceTasks[2],sourceTasks[4],sourceTasks[3]];
const piles=[['human','Keep with me','Trust, care or my judgement.','shield'],['amplify','Help me do it better','Give me a stronger starting point.','spark'],['remove','Take it off my plate','Rules or a system can carry it.','layers']];
function renderModule() {
  let body='';
  if(state.moduleStage==='intro') body=`<div class="sort-intro"><h2>What would you make room for?</h2><p>Five real HR tasks. Three piles. Sort by what the work needs from you, not by what a tool promises.</p><div class="sort-piles" style="margin:24px 0">${piles.map(([id,label,desc,ic])=>`<div class="sort-pile">${icon(ic)}<strong>${label}</strong><span>${desc}</span></div>`).join('')}</div><p>You can change every choice before saving. Your answers sharpen your role twin; they do not change your job.</p><div class="panel-actions">${action('Sort my first task '+icon('arrow'),'start-sort')}${link('Back to modules','modules','text-button')}</div></div>`;
  else if(state.moduleStage==='sort') {
    const t=cardTasks[state.cardIndex];
    body=`<div class="sort-progress"><span>Task ${state.cardIndex+1} of ${cardTasks.length}</span><div class="sort-dots">${cardTasks.map((_,i)=>`<i class="${i<state.cardIndex?'done':''}"></i>`).join('')}</div></div><article class="task-card"><h2>${t.short}</h2><small>From the supplied HR task library ${t.role.includes('Assistant')?'· shared with HR Assistant':''}</small></article><h3 style="margin-bottom:14px">Where does this work belong?</h3><div class="sort-piles">${piles.map(([id,label,desc,ic])=>`<button class="sort-pile" data-action="sort-card" data-pile="${id}">${icon(ic)}<strong>${label}</strong><span>${desc}</span><span class="pile-count">${state.sorts.filter(s=>s===id).length} sorted</span></button>`).join('')}</div><div class="bottom-action">${state.cardIndex>0?action('Back one task','previous-card','text-button'):'<p class="sort-hint">There is no right answer. The point is to make your priorities visible.</p>'}${action('Pause and return to modules','pause-sort','text-button')}</div>`;
  } else if(state.moduleStage==='review') body=`<h2>A first picture of your priorities.</h2><p style="font-size:12px;color:var(--muted)">Change any pile before adding your answers to the goal.</p>${cardTasks.map((t,i)=>`<div class="review-row"><span>${t.short}</span><label class="sr-only" for="review-${i}">Pile for ${t.short}</label><select id="review-${i}" data-review="${i}">${piles.map(([id,label])=>`<option value="${id}" ${state.sorts[i]===id?'selected':''}>${label}</option>`).join('')}</select></div>`).join('')}<div class="panel-actions">${action('Add my priorities to the goal '+icon('check'),'complete-sort')}${action('Sort again','restart-sort','text-button')}</div>`;
  else body=`<div class="completion"><div class="completion-icon">${icon('check')}</div><h2>Your voice is in the picture.</h2><p>This added five task priorities and your human boundaries to the goal. Yara’s role twin now carries these preferences.</p><ul><li>${state.sorts.filter(s=>s==='human').length} tasks to keep with you.</li><li>${state.sorts.filter(s=>s==='amplify').length} tasks where AI could help you do better work.</li><li>${state.sorts.filter(s=>s==='remove').length} tasks to take off your plate, subject to checks.</li></ul><p>Next, use the team’s SIPOC session to check the handoffs these choices affect.</p><div class="panel-actions">${link('See what changed in the goal '+icon('arrow'),'goal')}${link('Open Yara’s role twin','role','secondary')}${action('Review my answers','review-sort','text-button')}</div></div>`;
  return `${heading('A few choices. A more personal role twin.','Card sorting happens here, alongside your conversation.',tag('Individual · 6 min'))}<section class="inline-module" aria-label="Card sorting module"><div class="module-person"><span class="avatar avatar-lead">Y</span><span>Yara · HR Specialist</span><span style="margin-left:auto">${icon('cards')}</span></div>${body}</section><p class="source-note">Task texts are copied from the supplied HR Specialist and HR Assistant job data. Shared tasks are included to explore boundaries across roles. This is a working local demo; nothing is shared or sent.</p>`;
}

const chatContext = {
  setup:{title:'Let’s make room for better work.',body:'Start with your team as it is today. Then we’ll explore what people could do more of, with less routine work in the way.',user:'We’re the HR team at Noordhaven. I want us to spend more time helping people, and less time moving information around.',reply:'A good place to start. I’ve put our sample team on the canvas: <strong>10 people, across 6 roles.</strong> Check the roster, or bring your own source.',note:['Start with what you have','A rough org chart or a short conversation is enough. You can correct everything.'],suggestions:[['What will we leave with?','goal'],['Try a voice conversation','voice']]},
  goal:{title:'Here’s where we’re going.',body:'Re-imagined roles. A team twin. A list of useful changes, broken into steps. And a plan that names who does what.',user:'Show me the destination before we go any further.',reply:'The model has given us a draft. Now we need the part only your team can add: <strong>what the work really feels like, and what they want more time for.</strong>',note:['Suggested next · Card sorting','Let Yara sort five tasks. Her choices add priorities and human boundaries to the role twin.'],suggestions:[['Sort five tasks with me','module?chat=1'],['Show our team twin','team']]},
  team:{title:'Same team. A different kind of week.',body:'What if less time went into assembling information, and more went into the conversations it should support?',user:'What could our HR team take on with the capacity returned?',reply:'I’d start with <strong>earlier employee support, workforce planning and manager coaching.</strong> The allocation on the canvas is a discussion draft, not a staffing decision.',note:['A ceiling, not a promise','The model estimates 8,850 hours a year returned, gross. Actual review time, costs and adoption still need testing.'],suggestions:[['Show me Yara’s week','role'],['Which changes should we start with?','opportunities']]},
  role:{title:'The person stays at the centre.',body:'The useful question is what Yara gets to do more of, and where her judgement matters most.',user:'How does this change a real person’s week?',reply:'Less compiling reports. More investigating what changed, advising managers and following through on employee support. <strong>The same week, with a different balance.</strong>',note:['Keep the human edge','Trust, consequential decisions and sensitive conversations remain with the person.'],suggestions:[['Sort Yara’s tasks with me','module?chat=1'],['See the work behind this','opportunities']]},
  opportunities:{title:'The approach follows the step.',body:'We don’t need an agent for everything. Some steps need a rule. Some need a useful draft. Some should simply disappear.',user:'What should we actually build first?',reply:'Start with <strong>workforce reporting</strong>: structured data, clear checks, and a useful weekly conversation at the end. Open an opportunity to see each step and its approach.',note:['Priority = value / effort','Effort uses an estimated band. The values are gross scenario estimates, ready to challenge.'],suggestions:[['Show the quarterly plan','plan'],['What should stay human?','human']]},
  plan:{title:'A plan the team can own.',body:'Each quarter should leave you with something useful, and evidence about whether it works.',user:'How do we turn these ideas into action?',reply:'Named owners, small pilots and a check before expanding. <strong>Yara and Lotte start with trusted reporting and employee changes.</strong> The links on the canvas trace every initiative back to its opportunity.',note:['One missing piece','Agree a North Star metric and the inputs the work should move. The workshop gives the plan that focus.'],suggestions:[['Find the North Star workshop','modules'],['Check the opportunity steps','opportunities']]},
  modules:{title:'Ask the people who know the work.',body:'The model is a starting point. These sessions bring in real priorities, time, handoffs and exceptions.',user:'How do we make this our team’s picture?',reply:'Individual modules capture what each person sees. Team modules make the shared flow visible. <strong>Each one tells you what it adds to the goal.</strong>',note:['Two conversations to try','Explore beliefs, fears and hype, or check today’s HR measures. Review each draft before it changes the goal.'],suggestions:[['Explore strategic assumptions','exercise?type=assumptions'],['Inventory today’s HR measures','exercise?type=inventory']]},
  module:{title:'Let’s hear Yara’s point of view.',body:'Choose the pile that feels right for the work. We can revisit any answer before it becomes part of the draft.',user:'I can try a few tasks now.',reply:'Think about the part <strong>you</strong> bring. Is it trust and judgement? Could AI give you a better starting point? Or is it work a reliable system could carry?',note:['Your choices stay yours','The sort records preferences. It does not automate a task or change anyone’s role.'],suggestions:[['Remind me what we’re working towards','goal']]}
};

function sortChoice(pile) {
  if(!piles.some(p=>p[0]===pile)||state.moduleStage!=='sort')return;
  state.sorts[state.cardIndex]=pile;
  if(state.cardIndex<cardTasks.length-1)state.cardIndex++;else state.moduleStage='review';
  render();
}

function renderCardConversation() {
  const stage=state.moduleStage;
  $('#message').disabled=stage!=='sort';$('.send-button').disabled=stage!=='sort';
  $('#message').placeholder=stage==='sort'?'Type Keep, Help, or Take it off my plate…':'Use a choice below to continue…';
  $('#restart-chat').setAttribute('aria-label','Review card sorting on canvas');$('#restart-chat').innerHTML=icon('edit');
  let body='<h2>Let’s make room for your judgement.</h2><p>I’ll bring five real HR tasks into this conversation. Choose what to keep, where you want help, and what a system could carry. Your canvas will update after every choice.</p><div class="agent-note"><strong>You decide what changes</strong>These are personal priorities, not automatic job changes. Review all five before adding them to your goal.</div>';
  if(stage==='sort')body=`${state.sorts.map((choice,i)=>`<div class="chat-sort-choice"><strong>${i+1}. ${esc(cardTasks[i].short)}</strong><span>You chose: ${piles.find(p=>p[0]===choice)[1]}</span></div>`).join('')}<h2>Task ${state.cardIndex+1} of 5</h2><p>${esc(cardTasks[state.cardIndex].short)}</p><p>Where would you put this work?</p><p id="card-chat-error" role="status"></p>`;
  if(stage==='review')body=`<h2>Here’s what I heard.</h2>${state.sorts.map((choice,i)=>`<div class="chat-sort-choice"><strong>${esc(cardTasks[i].short)}</strong><span>${piles.find(p=>p[0]===choice)[1]}</span></div>`).join('')}<p>These choices are still a draft. Edit any pile on the canvas, or add the reviewed priorities to your goal.</p>`;
  if(stage==='done')body='<h2>Your priorities now shape the goal.</h2><p>I added five task priorities and your human boundaries. Yara’s role twin now carries the choices you reviewed.</p><div class="agent-note"><strong>What changed</strong>The goal’s re-imagined roles part now shows evidence added; Yara’s role twin names your priorities.</div>';
  $('#conversation-thread').innerHTML=`<div class="thread-marker">Card sorting · ${stage==='intro'?'Ready':stage==='sort'?`${state.sorts.length} of 5 captured`:stage==='review'?'Review before applying':'Added to goal'}</div><div class="agent-mark">${icon('spark')} agentlabs</div><div class="message agent">${body}</div><p class="privacy-note">Scripted guide · your choices fill the canvas.</p>`;
  $('#agent-suggestions').innerHTML=stage==='intro'?action('Sort my first task','start-sort'):stage==='sort'?piles.map(([id,label])=>action(label,'sort-card','',`data-pile="${id}"`)).join('')+(state.cardIndex>0?action('Change my previous choice','previous-card',''): ''):stage==='review'?action('Add my priorities to the goal','complete-sort')+action('Edit choices on the canvas','card-review-canvas',''):link('See what changed in the goal','goal')+link('Open Yara’s role twin','role','secondary');
  requestAnimationFrame(()=>{$('#conversation-thread').scrollTop=$('#conversation-thread').scrollHeight;});
}

function renderConversation() {
  if(route==='exercise'){renderExerciseConversation();return;}
  if(route==='module'){renderCardConversation();return;}
  $('#message').disabled=false;$('.send-button').disabled=false;
  $('#message').placeholder='Ask, add context, or think out loud…';
  $('#restart-chat').setAttribute('aria-label','Reset conversation');$('#restart-chat').innerHTML=icon('refresh');
  const c=chatContext[route];
  $('#conversation-thread').innerHTML=`<div class="thread-marker">Today · HR reimagine</div><div class="agent-mark">${icon('spark')} agentlabs</div><div class="message agent"><h2>${c.title}</h2><p>${c.body}</p></div><div class="message user">${c.user}</div><div class="agent-mark">${icon('spark')} agentlabs</div><div class="message agent"><p>${c.reply}</p>${route==='setup'?`<div class="chat-attachment">${icon('document')}<div>Noordhaven HR team<small>Sample roster · ready to check</small></div>${icon('check')}</div>`:''}<div class="agent-note"><strong>${state.moduleDone&&route==='goal'?'Card sorting added to the goal':c.note[0]}</strong>${state.moduleDone&&route==='goal'?'Five task priorities and Yara’s human boundaries are now included.':c.note[1]}</div></div>${state.messages.filter(m=>m.route===route).map(m=>`<div class="message ${m.role}">${m.role==='user'?esc(m.text):m.text}</div>`).join('')}`;
  $('#agent-suggestions').innerHTML=c.suggestions.map(([label,target])=>`<button data-chat-target="${target}">${label}${icon('arrow')}</button>`).join('');
}

function render() {
  const raw=location.hash.replace(/^#\//,'').split('?')[0];
  route=raw==='exercise'||chatContext[raw]?raw:'setup';
  const params=new URLSearchParams(location.hash.split('?')[1]||'');
  if(route==='opportunities'&&params.has('id')&&opportunities.some(o=>o.id===params.get('id')))state.selectedOpportunity=params.get('id');
  document.title=`${route==='exercise'?exercises[exerciseKey()].name:route==='module'?'Card sorting':navItems.find(([id])=>id===route)?.[1]} · agentlabs`;
  $('#canvas-nav').innerHTML=navItems.map(([id,label])=>`<a href="#/${id}" class="${route===id||['module','exercise'].includes(route)&&id==='modules'?'active':''}" ${route===id?'aria-current="page"':''}>${label}</a>`).join('');
  const renders={setup:renderSetup,goal:renderGoal,team:renderTeam,role:renderRole,opportunities:renderOpportunities,plan:renderPlan,modules:renderModules,module:renderModule,exercise:renderExercise};
  $('#canvas-content').innerHTML=renders[route]();
  if(route==='modules' && params.has('open')) {
    const module=modules.find(m=>m.id===params.get('open'));
    if(module) {const item=document.getElementById(`module-${module.id}`);item.open=true;requestAnimationFrame(()=>item.scrollIntoView({block:'start'}));}
  }
  if(params.has('focus')) {const target=document.getElementById(params.get('focus'));if(target)requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));}
  renderConversation();
}

function startVoice() {
  clearTimeout(voiceTimer); state.panel='voice'; state.voiceStep=0; state.voiceRunning=true; render();
  const advance=()=>{state.voiceStep++;if(state.voiceStep===2)state.voiceRunning=false;render();if(state.voiceStep<2)voiceTimer=setTimeout(advance,1700);};
  voiceTimer=setTimeout(advance,1700);
}

function showPanel(panel) {state.panel=panel;state.editIndex=null;if(route!=='setup')go('setup');else render();setView('canvas');}

document.addEventListener('click',event=>{
  const view=event.target.closest('[data-view]'); if(view){setView(view.dataset.view);return;}
  const suggestion=event.target.closest('[data-chat-target]');
  if(suggestion){const target=suggestion.dataset.chatTarget;if(target==='voice')showPanel('voice');else if(target==='human'){state.messages.push({route,role:'agent',text:'<strong>Trust, care and consequential decisions stay human.</strong> In each opportunity, look for the blue “Stays human” steps. The Human boundaries module lets the team name the decision owners.'});renderConversation();}else go(target);return;}
  const button=event.target.closest('[data-action]');if(!button)return;
  const {action:name}=button.dataset;
  if(name==='show-upload'||name==='upload-chat')showPanel('upload');
  else if(name==='show-voice'||name==='voice-chat')showPanel('voice');
  else if(name==='show-manual')showPanel('manual');
  else if(name==='close-panel'){state.panel=null;state.editIndex=null;render();}
  else if(name==='edit-role'){state.editIndex=Number(button.dataset.index);state.panel='edit';render();$('#roster-form input[name=role]').focus();}
  else if(name==='extract-sample'){state.extracted=true;render();toast('Sample org chart extracted. Check the cropped payroll label.');}
  else if(name==='use-extraction'){if(!state.extractionChecked)return;state.panel=null;render();toast('Checked sample roster added to the canvas.');}
  else if(name==='play-voice')startVoice();
  else if(name==='stop-voice'){clearTimeout(voiceTimer);state.voiceRunning=false;render();}
  else if(name==='use-voice'){state.panel=null;render();toast('Voice sample added six roles and ten people. Review the roster.');}
  else if(name==='confirm-setup'){state.setupConfirmed=true;state.panel=null;go('goal');}
  else if(name==='open-opportunity'){state.selectedOpportunity=button.dataset.id;history.replaceState(null,'',`#/opportunities?id=${state.selectedOpportunity}`);render();$('#opportunity-detail').scrollIntoView({block:'start'});$('#opportunity-detail').focus({preventScroll:true});}
  else if(name==='preview-module'){state.previewModule=state.previewModule===button.dataset.id?null:button.dataset.id;const openIds=[...document.querySelectorAll('.module-item[open]')].map(d=>d.id);render();openIds.forEach(id=>{if(document.getElementById(id))document.getElementById(id).open=true;});}
  else if(name==='start-sort'||name==='restart-sort'){state.moduleStage='sort';state.cardIndex=0;state.sorts=[];render();}
  else if(name==='sort-card')sortChoice(button.dataset.pile);
  else if(name==='previous-card'){state.cardIndex--;state.sorts=state.sorts.slice(0,state.cardIndex);render();}
  else if(name==='pause-sort')go('modules');
  else if(name==='complete-sort'){state.moduleDone=true;state.moduleStage='done';render();toast('Five task priorities and human boundaries added to your goal.');}
  else if(name==='review-sort'){state.moduleStage='review';render();}
  else if(name==='card-review-canvas'){setView('canvas');window.scrollTo({top:0,behavior:'instant'});$('#canvas-content').focus();}
  else if(name==='sample-exercise')answerExercise(exercises[exerciseKey()].prompts[state.exercises[exerciseKey()].answers.length].sample);
  else if(name==='exercise-conversation'){setView('conversation');$('#message').focus();}
  else if(name==='exercise-canvas'){setView('canvas');window.scrollTo(0,0);$('#canvas-content').focus();}
  else if(name==='review-exercise'){state.exercises[exerciseKey()].stage='review';render();setView('canvas');}
  else if(name==='add-metric'){state.exercises.inventory.metrics.push({name:'',kind:'Needs definition',reason:'Define the value, denominator and time window before using this measure.',source:'Added by you'});render();setView('canvas');const fields=document.querySelectorAll('[data-metric-name]');fields[fields.length-1].focus();}
  else if(name==='save-exercise'){
    const key=exerciseKey(),draft=state.exercises[key];
    if(draft.answers.some(a=>!a.trim())||draft.answers.length!==3||key==='inventory'&&draft.metrics.some(m=>!m.name.trim())){$('#exercise-error').hidden=false;$('#exercise-error').textContent=key==='inventory'?'Complete all three notes and give each measure a name, then apply again.':'Complete the belief, fear and hype notes, then apply again.';return;}
    draft.saved=structuredClone({answers:draft.answers,scopes:draft.scopes,metrics:draft.metrics});draft.stage='done';render();setView('canvas');window.scrollTo(0,0);$('#canvas-content').focus();
  }
});

document.addEventListener('input',event=>{
  if(route!=='exercise')return;
  const draft=state.exercises[exerciseKey()];
  if($('#exercise-error'))$('#exercise-error').hidden=true;
  if(event.target.matches('[data-exercise-answer]'))draft.answers[Number(event.target.dataset.exerciseAnswer)]=event.target.value;
  if(event.target.matches('[data-metric-name]'))draft.metrics[Number(event.target.dataset.metricName)].name=event.target.value;
});

document.addEventListener('change',event=>{
  if(event.target.id==='check-payroll'){state.extractionChecked=event.target.checked;render();}
  if(event.target.id==='opportunity-sort'){state.sort=event.target.value;render();}
  if(event.target.matches('[data-review]')){state.sorts[Number(event.target.dataset.review)]=event.target.value;renderConversation();}
  if(event.target.id==='source-file'){state.fileName=event.target.files[0]?.name||'';render();}
  if(event.target.matches('[data-exercise-scope]'))state.exercises.assumptions.scopes[Number(event.target.dataset.exerciseScope)]=event.target.value;
  if(event.target.matches('[data-metric-kind]'))state.exercises.inventory.metrics[Number(event.target.dataset.metricKind)].kind=event.target.value;
});

document.addEventListener('submit',event=>{
  if(event.target.id==='roster-form') {
    event.preventDefault();const values=new FormData(event.target);const fte=Number(values.get('fte'));const people=String(values.get('people')).split(',').map(s=>s.trim()).filter(Boolean);
    if(!people.length||!Number.isFinite(fte)||fte<=0){$('#roster-error').textContent='Add at least one person and a positive FTE, then save again.';$('#roster-error').hidden=false;return;}
    const r={role:String(values.get('role')).trim(),people:people.join(', '),fte,systems:String(values.get('systems')).trim(),shift:[65,25]};
    if(!r.role){$('#roster-error').textContent='Add a role name before saving.';$('#roster-error').hidden=false;return;}
    state.teamName=String(values.get('team')).trim()||'HR';state.rosterChanged=true;
    if(state.editIndex!==null)state.roster[state.editIndex]={...state.roster[state.editIndex],...r};else state.roster.push(r);
    state.panel=null;state.editIndex=null;render();toast('Roster saved. Twins still show the supplied 10-person sample estimates.');
  }
  if(event.target.id==='chat-form') {
    event.preventDefault();const text=$('#message').value.trim();if(!text)return;
    if(route==='exercise'){answerExercise(text);return;}
    if(route==='module'&&state.moduleStage==='sort'){
      const pile=/take|remove|off my plate|system|rule/i.test(text)?'remove':/help|amplify|better/i.test(text)?'amplify':/keep|human|with me/i.test(text)?'human':null;
      if(pile){$('#message').value='';sortChoice(pile);}else{$('#card-chat-error').textContent='Choose Keep, Help or Take it off my plate, or use a button below.';}
      return;
    }
    state.messages.push({route,role:'user',text});
    let reply='I’ve kept that context in this conversation. Use a suggestion below to explore the canvas, or edit the roster directly. This sample responds with scripted guidance.';
    if(/human|trust|sensitive|approve/i.test(text))reply='Keep trust, care and consequential decisions with the team. The <a href="#/modules">Human boundaries module</a> makes the owners and approval gates explicit.';
    else if(/hour|saving|cost|money|fte/i.test(text))reply='The HR model returns about <strong>8,850 hours a year, 5.5 FTE and EUR 586k annually, all gross estimates</strong>. These are capacity estimates, before build, licence and upkeep costs. <a href="#/team">See the team twin.</a>';
    else if(/belief|fear|hype|assum/i.test(text))reply='Let’s make the beliefs behind AI work visible. <a href="#/exercise?type=assumptions">Start Strategic assumptions</a>: three guided prompts, then review the draft changes to the goal.';
    else if(/metric|vanity|measur/i.test(text))reply='Start with the measures you use today. <a href="#/exercise?type=inventory">Open Metrics inventory</a>: I’ll flag activity measures, then you review the classifications and pilot checks. The HR North Star is illustrative.';
    else if(/start|next|module|sort/i.test(text))reply='I suggest <a href="#/module">card sorting with Yara</a>. Five tasks, about six minutes. It adds her priorities and human boundaries to the goal.';
    else if(/plan|build|quarter/i.test(text))reply='The <a href="#/plan">quarterly plan</a> starts with trusted reporting and employee records. Every initiative links to its opportunity and includes a check before expanding.';
    else if(/goal|end|result/i.test(text))reply='You’ll leave with re-imagined roles, a team twin, prioritised opportunities, step approaches and a plan. <a href="#/goal">Open the goal canvas.</a>';
    state.messages.push({route,role:'agent',text:reply});$('#message').value='';renderConversation();$('#conversation-thread').scrollTop=$('#conversation-thread').scrollHeight;
  }
});

$('#restart-chat').innerHTML=icon('refresh');
$('#restart-chat').addEventListener('click',()=>{if(route==='exercise'||route==='module'){setView('canvas');$('#canvas-content').focus();return;}state.messages=state.messages.filter(m=>m.route!==route);renderConversation();toast('This screen’s conversation reset. Your canvas is still here.');});
$('#message').addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();$('#chat-form').requestSubmit();}});
$('.skip-link').addEventListener('click',event=>{event.preventDefault();$('#canvas-content').focus();});
window.addEventListener('hashchange',()=>{if(!location.hash.startsWith('#/'))return;render();window.scrollTo({top:0,behavior:'instant'});if(innerWidth<=760)setView(route==='exercise'||route==='module'&&new URLSearchParams(location.hash.split('?')[1]).has('chat')?'conversation':'canvas');});
render();
if(route==='exercise'||route==='module'&&new URLSearchParams(location.hash.split('?')[1]).has('chat'))setView('conversation');
