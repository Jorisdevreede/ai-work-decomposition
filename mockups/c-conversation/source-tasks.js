export const sourceTasks = [
  {
    "id": "13-1071.00:18852",
    "role": "Human Resources Specialists",
    "short": "Handle employee complaints, investigate concerns, agree action and follow up.",
    "steps": [
      {
        "text": "Receive the concern and assess immediate safety, confidentiality and escalation needs.",
        "rung": "stays_manual",
        "block": "judgement_step",
        "human": false
      },
      {
        "text": "Hear the employee's account and explain confidentiality limits and next steps.",
        "rung": "stays_manual",
        "block": "conversation",
        "human": false
      },
      {
        "text": "Read authorised records and organise accounts, dates and conflicting evidence.",
        "rung": "deterministic_plus_loop",
        "block": "artefact_generator",
        "human": true
      },
      {
        "text": "Assess credibility, policy implications and options using the verified evidence.",
        "rung": "stays_manual",
        "block": "judgement_step",
        "human": false
      },
      {
        "text": "Review findings and authorise action within the relevant management mandate.",
        "rung": "stays_manual",
        "block": "judgement_step",
        "human": true
      },
      {
        "text": "Prepare outcome letters and follow-up instructions for each authorised recipient.",
        "rung": "deterministic_plus_loop",
        "block": "artefact_generator",
        "human": true
      },
      {
        "text": "Explain the outcome privately and agree support and follow-up.",
        "rung": "stays_manual",
        "block": "conversation",
        "human": false
      },
      {
        "text": "File the case record and schedule restricted follow-up reminders.",
        "rung": "configure",
        "block": "workflow_automation",
        "human": true
      }
    ]
  },
  {
    "id": "13-1071.00:18853",
    "role": "Human Resources Specialists",
    "short": "Analyse employment data and prepare required workforce reports.",
    "steps": [
      {
        "text": "Export employee, position and absence records for the reporting period.",
        "rung": "configure",
        "block": "none",
        "human": false
      },
      {
        "text": "Reconcile identifiers, dates and organisational categories in the reporting workbook.",
        "rung": "deterministic",
        "block": "integration",
        "human": false
      },
      {
        "text": "Calculate required totals, rates and comparisons using agreed definitions.",
        "rung": "deterministic",
        "block": "artefact_generator",
        "human": false
      },
      {
        "text": "Interpret changes and assemble the report with explanatory notes.",
        "rung": "deterministic",
        "block": "artefact_generator",
        "human": false
      },
      {
        "text": "Check explanations, disclosure scope and required report content.",
        "rung": "stays_manual",
        "block": "judgement_step",
        "human": false
      },
      {
        "text": "Distribute the corrected report to authorised internal recipients.",
        "rung": "configure",
        "block": "workflow_automation",
        "human": true
      },
      {
        "text": "Submit required external returns and retain the submission receipt.",
        "rung": "deterministic",
        "block": "integration",
        "human": true
      }
    ]
  },
  {
    "id": "13-1071.00:18854",
    "role": "Human Resources Specialists",
    "short": "Conduct exit interviews, complete termination paperwork, and coordinate approved departure records.",
    "steps": [
      {
        "text": "Check the approved departure notice against the employee record and required departure checklist.",
        "rung": "configure",
        "block": "workflow_automation",
        "human": false
      },
      {
        "text": "Arrange an exit interview with the departing employee.",
        "rung": "configure",
        "block": "workflow_automation",
        "human": false
      },
      {
        "text": "Discuss departure reasons, listen to concerns, and take factual notes.",
        "rung": "stays_manual",
        "block": "conversation",
        "human": false
      },
      {
        "text": "Write a restricted interview summary and separate concerns needing confidential follow-up.",
        "rung": "deterministic_plus_loop",
        "block": "artefact_generator",
        "human": true
      },
      {
        "text": "Prepare termination documents using approved dates, terms, and current templates.",
        "rung": "configure",
        "block": "artefact_generator",
        "human": false
      },
      {
        "text": "Check termination paperwork and approve the departure instructions.",
        "rung": "stays_manual",
        "block": "judgement_step",
        "human": true
      },
      {
        "text": "File approved documents and update the departure status.",
        "rung": "configure",
        "block": "workflow_automation",
        "human": false
      },
      {
        "text": "Send approved payroll instructions and departure actions to responsible teams.",
        "rung": "configure",
        "block": "notification",
        "human": false
      }
    ]
  },
  {
    "id": "43-4161.00:2687",
    "role": "Human Resources Assistants, Except Payroll and Timekeeping",
    "short": "Explain personnel policies, benefits and procedures to employees and applicants.",
    "steps": [
      {
        "text": "Read the question and establish its topic and audience.",
        "rung": "configure",
        "block": "workflow_automation",
        "human": false
      },
      {
        "text": "Find the current policy, benefit terms and applicable procedure.",
        "rung": "deterministic",
        "block": "answer_desk",
        "human": false
      },
      {
        "text": "Check relevant employment facts for an authenticated employee.",
        "rung": "deterministic",
        "block": "integration",
        "human": false
      },
      {
        "text": "Write and send a routine policy explanation.",
        "rung": "deterministic_plus_loop",
        "block": "answer_desk",
        "human": true
      },
      {
        "text": "Discuss sensitive circumstances and check that the person understands their options.",
        "rung": "stays_manual",
        "block": "conversation",
        "human": false
      },
      {
        "text": "Refer unresolved interpretations or exception requests to the HR specialist.",
        "rung": "configure",
        "block": "workflow_automation",
        "human": false
      },
      {
        "text": "Record the answer, referral and follow-up status.",
        "rung": "configure",
        "block": "crud_app",
        "human": false
      }
    ]
  },
  {
    "id": "43-4161.00:2689",
    "role": "Human Resources Assistants, Except Payroll and Timekeeping",
    "short": "Update employee data from approved changes, payroll outputs, operational records and supervisory reports.",
    "steps": [
      {
        "text": "Read employee and manager requests for personnel data changes.",
        "rung": "configure",
        "block": "crud_app",
        "human": false
      },
      {
        "text": "Retrieve approved earnings data for personnel record updates.",
        "rung": "deterministic",
        "block": "integration",
        "human": false
      },
      {
        "text": "Retrieve attributable production or sales totals where personnel records require them.",
        "rung": "deterministic",
        "block": "integration",
        "human": false
      },
      {
        "text": "Match employee identifiers, reporting periods and effective dates in the update workbook.",
        "rung": "deterministic",
        "block": "integration",
        "human": false
      },
      {
        "text": "Enter approved address, absence and other routine employee field changes.",
        "rung": "configure",
        "block": "crud_app",
        "human": false
      },
      {
        "text": "Attach the approved supervisory report to the employee performance record.",
        "rung": "configure",
        "block": "workflow_automation",
        "human": false
      },
      {
        "text": "Record the authorised termination date and reason.",
        "rung": "configure",
        "block": "workflow_automation",
        "human": true
      },
      {
        "text": "Check saved fields against the approved change set.",
        "rung": "deterministic",
        "block": "workflow_automation",
        "human": false
      },
      {
        "text": "Confirm completion to the authorised requester.",
        "rung": "configure",
        "block": "notification",
        "human": false
      }
    ]
  },
  {
    "id": "43-4161.00:2690",
    "role": "Human Resources Assistants, Except Payroll and Timekeeping",
    "short": "Check applications, assemble qualification evidence and support human screening decisions.",
    "steps": [
      {
        "text": "Check incoming applications for required fields, attachments and duplicate submissions.",
        "rung": "configure",
        "block": "workflow_automation",
        "human": false
      },
      {
        "text": "Read application documents and identify stated qualifications and supporting evidence.",
        "rung": "deterministic_plus_loop",
        "block": "artefact_generator",
        "human": false
      },
      {
        "text": "Compare evidence with approved job criteria and note gaps or unclear equivalences.",
        "rung": "deterministic",
        "block": "artefact_generator",
        "human": false
      },
      {
        "text": "Ask the applicant for specific missing facts or supporting documents.",
        "rung": "configure",
        "block": "workflow_automation",
        "human": true
      },
      {
        "text": "Evaluate relevant evidence and decide whether the applicant should progress.",
        "rung": "stays_manual",
        "block": "judgement_step",
        "human": true
      },
      {
        "text": "Record the approved outcome and its evidence-based reason in the applicant record.",
        "rung": "configure",
        "block": "crud_app",
        "human": false
      },
      {
        "text": "Send the approved outcome or next-step invitation to the applicant.",
        "rung": "configure",
        "block": "notification",
        "human": true
      }
    ]
  }
];
