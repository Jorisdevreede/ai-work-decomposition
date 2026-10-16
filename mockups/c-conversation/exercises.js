export const metricKinds = ['Leading / input','Lagging / outcome','Vanity candidate','Needs definition'];

export const initialMetrics = [
 {name:'Time to first HR reply',kind:'Leading / input',reason:'A process signal. A fast reply alone does not prove the request was resolved.',source:'Illustrative current measure'},
 {name:'Reopened HR requests',kind:'Lagging / outcome',reason:'Shows rework after a reply. Agree the window and denominator.',source:'Illustrative current measure'},
 {name:'Employee changes correct first time',kind:'Leading / input',reason:'A quality input to reliable HR service; an outcome of the record-change flow.',source:'Illustrative current measure'},
 {name:'AI prompts sent',kind:'Vanity candidate',reason:'Counts activity. More prompts need not mean better employee outcomes.',source:'Illustrative current measure'},
 {name:'AI licences issued',kind:'Vanity candidate',reason:'Counts access. It does not show useful adoption or correct answers.',source:'Illustrative current measure'},
 {name:'Accuracy of audited AI answers',kind:'Leading / input',reason:'Proposed quality input. Define an audited sample before setting a target.',source:'Agent proposal · illustrative'}
];

export const exercises = {
 assumptions: {
  id:'ns-assumptions',name:'Strategic assumptions',intro:'Bring beliefs, fears and hype into the open before they turn into a plan.',
  prompts:[
   {label:'Belief',question:'What do you believe AI could help your HR team do better? Start with “We believe…”. This is a belief, not evidence.',sample:'We believe AI could prepare routine HR answers so we have more time for employee support.'},
   {label:'Fear',question:'What worries you about that belief? Where could AI let an employee down, and what must stay human?',sample:'I worry about a confident but wrong answer in a sensitive case. A named HR colleague must approve that advice.'},
   {label:'Hype',question:'Which AI promise sounds like hype? What would you need to observe before believing it?',sample:'That an agent can resolve every request without review. I would need audited correct answers and a clear route back to a person.'}
  ],
  contribution:'Three assumptions to test, a human-review boundary and a new gate on the employee-support pilot.'
 },
 inventory: {
  id:'ns-inventory',name:'Metrics inventory',intro:'Start with today’s measures. Ask what each one tells us about value for employees.',
  prompts:[
   {label:'Today’s measures',question:'The canvas lists a sample of today’s HR measures: first-reply time, reopened requests, correct employee changes, AI prompts and licences. Which do you use or want to add? These are illustrative; no HR system is connected.',sample:'Keep reply time, reopened requests and correct employee changes. Add an audited check of AI-answer accuracy.'},
   {label:'Value check',question:'I flagged prompts sent and licences issued as vanity candidates: they count activity, not employee value. A fast first reply can also hide a poor answer. What would show that a request was actually resolved?',sample:'Check that the answer was correct within one working day and the employee did not need a follow-up ticket.'},
   {label:'Ownership',question:'Who should check the measures, and where should they change the plan? Review the suggested classifications on the canvas; leading or lagging depends on the outcome and time horizon.',sample:'Lotte checks employee changes correct first time in Q1. Femke reviews reopened requests and answer accuracy weekly, starting with the Q4 measurement plan.'}
  ],
  contribution:'A reviewed inventory, a quality measure on the employee-record opportunity, and checks in Q1 and Q4.'
 }
};
