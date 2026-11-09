/*
  data.js: everything the quiz says lives here.
  Change questions, career families, weights or wording in this file only;
  scoring.js and app.js read it and never need editing for content changes.

  Facts (outlook, pay, certifications) were checked on November 8, 2026.
  Re-check them before each semester. See README.md for the sources.
*/

const QUIZ_VERSION = "2.0";
const CONTENT_CHECKED = "November 8, 2026";

/* ------------------------------------------------------------------ *
 * 1. Ten work-activity dimensions.
 *    Answers build a 0-1 score on each; families are matched against them.
 * ------------------------------------------------------------------ */
const DIMENSIONS = [
  { id: "process",      name: "Improve processes",            short: "mapping how work flows and removing wasted steps" },
  { id: "requirements", name: "Define requirements",          short: "turning what people need into clear requirements" },
  { id: "configure",    name: "Configure business systems",   short: "setting up and connecting business software" },
  { id: "automate",     name: "Build and automate",           short: "building automations, scripts and small apps" },
  { id: "data",         name: "Analyze data",                 short: "finding the story in numbers" },
  { id: "protect",      name: "Protect and verify",           short: "managing risk, rules, access and evidence" },
  { id: "coordinate",   name: "Coordinate delivery",          short: "keeping people, plans and deadlines on track" },
  { id: "people",       name: "Help people use tech",         short: "understanding users, training and adoption" },
  { id: "operate",      name: "Keep systems running",         short: "troubleshooting and running infrastructure" },
  { id: "strategy",     name: "Advise on strategy and value", short: "weighing costs, risks and investments" },
];

/* ------------------------------------------------------------------ *
 * 2. Part A: activity ratings. Two per dimension, interleaved.
 * ------------------------------------------------------------------ */
const RATING_SCALE = [
  { value: 0,    label: "Strongly dislike" },
  { value: 0.25, label: "Dislike" },
  { value: null, label: "Unsure" },
  { value: 0.75, label: "Like" },
  { value: 1,    label: "Strongly like" },
];

const RATING_ITEMS = [
  { id: "a1",  dim: "process",      text: "Map out how a team's work moves from step to step, then cut the wasted steps" },
  { id: "a2",  dim: "data",         text: "Use data to explain why a sales number went up or down" },
  { id: "a3",  dim: "protect",      text: "Check whether a company follows its own security and privacy rules" },
  { id: "a4",  dim: "people",       text: "Watch people try a new app and note exactly where they get stuck" },
  { id: "a5",  dim: "configure",    text: "Set up a company's sales or business software (a CRM or ERP system) so it matches how the company actually works" },
  { id: "a6",  dim: "coordinate",   text: "Keep several teams on schedule for a system launch" },
  { id: "a7",  dim: "automate",     text: "Build an automation that moves data between two apps so nobody has to copy it by hand" },
  { id: "a8",  dim: "requirements", text: "Interview users and turn what they need into a clear list of requirements" },
  { id: "a9",  dim: "operate",      text: "Figure out why a system went down and get it back up" },
  { id: "a10", dim: "strategy",     text: "Compare three software vendors and recommend one based on cost and risk" },
  { id: "a11", dim: "process",      text: "Find the root cause of a problem that keeps coming back in a business process" },
  { id: "a12", dim: "data",         text: "Build a dashboard that a manager checks every morning" },
  { id: "a13", dim: "protect",      text: "Decide who should and shouldn't have access to sensitive data" },
  { id: "a14", dim: "people",       text: "Train coworkers on a new system and answer their questions" },
  { id: "a15", dim: "configure",    text: "Work out how two business apps should share data with each other" },
  { id: "a16", dim: "coordinate",   text: "Run a weekly check-in that tracks tasks, risks and deadlines" },
  { id: "a17", dim: "automate",     text: "Write a small script or low-code app that solves an everyday work problem" },
  { id: "a18", dim: "requirements", text: "Write the checklist that decides whether a new feature is truly \"done\"" },
  { id: "a19", dim: "operate",      text: "Set up and monitor cloud servers or a fleet of company laptops" },
  { id: "a20", dim: "strategy",     text: "Build the business case for whether a company should invest in a new technology" },
];

/* ------------------------------------------------------------------ *
 * 3. Part B: scenarios. Pick the MOST and LEAST appealing option.
 *    Every option is equally legitimate; order is shuffled on screen.
 * ------------------------------------------------------------------ */
const SCENARIOS = [
  {
    id: "b1",
    text: "A key business process keeps running late and customers are complaining. What would you most like to do?",
    options: [
      { dim: "process",    text: "Map the process step by step to find the bottleneck" },
      { dim: "data",       text: "Pull the data to see where and when the delays happen" },
      { dim: "configure",  text: "Reconfigure the software the process runs on" },
      { dim: "coordinate", text: "Plan the fix and keep everyone on the timeline" },
    ],
  },
  {
    id: "b2",
    text: "Your company is rolling out an AI assistant to 500 employees. Which part would you want?",
    options: [
      { dim: "process",   text: "Redesign the workflow the assistant will fit into" },
      { dim: "protect",   text: "Set the rules for what company data the assistant may see" },
      { dim: "people",    text: "Train employees and collect their feedback" },
      { dim: "configure", text: "Connect the assistant to the company's existing systems" },
    ],
  },
  {
    id: "b3",
    text: "A new customer portal is being built. Where would you want to be?",
    options: [
      { dim: "requirements", text: "Gathering requirements from customers and staff" },
      { dim: "people",       text: "Testing early designs with real users" },
      { dim: "coordinate",   text: "Coordinating the teams building it" },
      { dim: "automate",     text: "Building part of it yourself" },
    ],
  },
  {
    id: "b4",
    text: "An audit finds that former employees could still log in to company systems. What do you do?",
    options: [
      { dim: "protect",  text: "Review who has access to what and document every gap" },
      { dim: "operate",  text: "Shut off the accounts and lock the systems down right away" },
      { dim: "automate", text: "Automate account removal whenever someone leaves" },
      { dim: "process",  text: "Redesign the offboarding process so it can't happen again" },
    ],
  },
  {
    id: "b5",
    text: "Leadership is deciding whether to replace an old company-wide system. How would you help?",
    options: [
      { dim: "strategy",     text: "Compare the options on cost, risk and value" },
      { dim: "data",         text: "Analyze how the current system is actually used" },
      { dim: "requirements", text: "Document what each department needs from a new system" },
      { dim: "operate",      text: "Check whether the current infrastructure can handle the change" },
    ],
  },
  {
    id: "b6",
    text: "A team spends 10 hours a week copying data between spreadsheets. What's your move?",
    options: [
      { dim: "automate", text: "Build an automation that does the copying for them" },
      { dim: "process",  text: "Ask why the copying is needed at all and simplify the process" },
      { dim: "strategy", text: "Estimate what those hours cost and pitch a fix to leadership" },
      { dim: "people",   text: "Show the team better tools and coach them through the change" },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * 4. Part C: work style. NOT scored. Used for "heads up" notes only.
 * ------------------------------------------------------------------ */
const WORK_STYLE = [
  {
    id: "coding",
    text: "How do you feel about coding or scripting?",
    options: ["I'd rather avoid it", "I'm open to learning some", "I enjoy it or want to get good at it"],
  },
  {
    id: "urgent",
    text: "How do you feel about urgent problems that sometimes happen after hours?",
    options: ["I'd rather avoid them", "Once in a while is fine", "I like that kind of adrenaline"],
  },
  {
    id: "social",
    text: "How would you like to spend most of your work time?",
    options: ["Mostly working on my own", "A mix of solo work and people", "Mostly working with people"],
  },
  {
    id: "structure",
    text: "Which sounds more like you?",
    options: ["I like clear rules and defined steps", "Somewhere in between", "I like figuring out messy, unclear problems"],
  },
  {
    id: "client",
    text: "How do you feel about working with outside clients or traveling for work?",
    options: ["I'd rather stay inside one company", "Some is fine", "That sounds great"],
  },
];

/* ------------------------------------------------------------------ *
 * 5. Part D: experience so far. Optional, NOT scored.
 *    Marks skills you've already tried on your result cards.
 * ------------------------------------------------------------------ */
const EXPERIENCE = [
  { id: "excel",       text: "Excel PivotTables or lookups" },
  { id: "sql",         text: "Writing a SQL query" },
  { id: "powerbi",     text: "Power BI or Tableau" },
  { id: "processmap",  text: "Drawing a process map or flowchart" },
  { id: "lowcode",     text: "Power Automate or another automation tool" },
  { id: "securitylab", text: "A cybersecurity lab or class" },
  { id: "project",     text: "Coordinating a project or event" },
];

/* ------------------------------------------------------------------ *
 * 6. Twelve career families.
 *    weights: the family's top three dimensions (1.0, 0.6, 0.4).
 *    coding: "none" | "some" | "heavy"   urgent/client/peopleHeavy: true/false
 * ------------------------------------------------------------------ */
const BLS = "https://www.bls.gov/ooh/";

const FAMILIES = [
  {
    id: "process",
    name: "Process Improvement & Operational Excellence",
    tagline: "Finding the waste in how work gets done, and fixing it.",
    description:
      "You map how work actually flows, find the delays and errors, fix the root cause, and measure whether it improved. In MIS this usually means processes that run on software, data and automation.",
    weights: { process: 1.0, data: 0.6, requirements: 0.4 },
    intensity: "Low to mixed",
    coding: "none", urgent: false, client: false, peopleHeavy: false,
    weekly: [
      "Interviewing the people who do the work and mapping each step",
      "Measuring delays, errors and rework",
      "Proposing and testing a simpler future-state process",
    ],
    entryTitles: ["Process Analyst Intern", "Continuous Improvement Intern", "Operations Improvement Analyst"],
    leadsTo: ["Process Excellence Manager", "Operations Manager", "Business Architect"],
    skills: [
      { name: "Process maps and BPMN (a standard diagram notation)", key: "processmap" },
      { name: "Lean Six Sigma basics" },
      { name: "Excel for measuring results", key: "excel" },
      { name: "Power Automate", key: "lowcode" },
    ],
    certs: {
      now: ["ASQ Six Sigma Yellow Belt (no prerequisites)", "IASSC Lean Six Sigma Yellow or Green Belt (no prerequisites)"],
      later: ["ASQ Six Sigma Green Belt (requires 3 years of work experience)"],
    },
    outlook: { occupation: "Management analysts", growth: "+10%", pay: "$101,860", url: BLS + "business-and-financial/management-analysts.htm" },
    ai: "BLS projects office and administrative support jobs to shrink 4% (about 752,100 jobs) in 2025–35, partly from AI-powered automation. Someone has to redesign the workflows those tools change.",
    starter: "Map a real campus or club process (event sign-ups, reimbursements) as it works today, then draw a simpler version and estimate the time saved.",
  },
  {
    id: "analysis",
    name: "Business Analysis & Requirements",
    tagline: "Making sure the right thing gets built.",
    description:
      "Business analysts figure out what a business actually needs and turn it into clear requirements, user stories and acceptance criteria a tech team can build and test against.",
    weights: { requirements: 1.0, process: 0.6, people: 0.4 },
    intensity: "Low to mixed",
    coding: "none", urgent: false, client: false, peopleHeavy: true,
    weekly: [
      "Running interviews and workshops with stakeholders",
      "Writing requirements, user stories and acceptance criteria",
      "Testing that what was built matches what was needed",
    ],
    entryTitles: ["Business Analyst Intern", "IT Business Analyst", "QA / User Acceptance Testing Analyst"],
    leadsTo: ["Senior Business Analyst", "Product Owner", "Business Architect"],
    skills: [
      { name: "Interviewing and writing requirements" },
      { name: "Process maps", key: "processmap" },
      { name: "SQL basics", key: "sql" },
      { name: "Jira or a similar work tracker" },
    ],
    certs: {
      now: ["IIBA ECBA, Entry Certificate in Business Analysis (exam updated July 2025)"],
      later: ["IIBA CCBA", "IIBA CBAP"],
    },
    outlook: { occupation: "Computer systems analysts", growth: "+8%", pay: "$105,850", url: BLS + "computer-and-information-technology/computer-systems-analysts.htm" },
    ai: "BLS lists the expansion of IT, including AI, as a reason it expects systems analyst jobs to grow. Requirements work now often includes defining what an AI tool should and shouldn't do.",
    starter: "Interview two classmates about a frustrating app, then write five user stories with acceptance criteria for fixing it.",
  },
  {
    id: "systems",
    name: "Business Systems & Enterprise Applications",
    tagline: "Running the software a whole company depends on.",
    description:
      "You configure, connect and improve business platforms like ERP (company-wide operations), CRM (sales and customers) and HR systems, then help roll out changes so people actually use them.",
    weights: { configure: 1.0, requirements: 0.6, coordinate: 0.4 },
    intensity: "Mixed",
    coding: "some", urgent: false, client: false, peopleHeavy: false,
    weekly: [
      "Configuring workflows, fields and permissions in a business platform",
      "Translating a department's request into system changes",
      "Testing and rolling out updates with training for users",
    ],
    entryTitles: ["Business Systems Analyst Intern", "ERP or CRM Analyst", "Implementation Analyst"],
    leadsTo: ["Senior Business Systems Analyst", "Enterprise Applications Manager", "Solutions Architect"],
    skills: [
      { name: "A major platform (Salesforce, NetSuite, SAP or Dynamics 365)" },
      { name: "SQL basics", key: "sql" },
      { name: "Process maps", key: "processmap" },
      { name: "Excel for data cleanup", key: "excel" },
    ],
    certs: {
      now: ["Microsoft PL-900 (Power Platform Fundamentals)", "Microsoft AB-900 (Copilot and Agent Administration Fundamentals; replaced MS-900, retired March 2026)"],
      later: ["Microsoft AB-series and Power Platform associate exams"],
    },
    outlook: { occupation: "Computer systems analysts", growth: "+8%", pay: "$105,850", url: BLS + "computer-and-information-technology/computer-systems-analysts.htm" },
    ai: "Business platforms are adding built-in AI assistants and agents, and someone has to configure and govern them. Microsoft's newer fundamentals exam, AB-900, is built around exactly that.",
    starter: "Sign up for a free Salesforce Trailhead or Microsoft Power Apps developer account and build a simple club membership tracker.",
  },
  {
    id: "automation",
    name: "Intelligent Automation & Applied AI",
    tagline: "Taking repetitive work off people's plates.",
    description:
      "You find work that can be automated, then build it with low-code tools, scripts or AI workflows, with the right controls and human oversight. This is about deploying AI in a business, not researching AI models.",
    weights: { automate: 1.0, process: 0.6, protect: 0.4 },
    intensity: "Mixed",
    coding: "some", urgent: false, client: false, peopleHeavy: false,
    weekly: [
      "Spotting repetitive tasks worth automating",
      "Building flows, scripts or AI-assisted workflows",
      "Testing them, adding checks, and measuring the time saved",
    ],
    entryTitles: ["Automation Analyst Intern", "Power Platform Intern", "RPA (robotic process automation) Analyst"],
    leadsTo: ["Automation Lead", "AI Solutions Specialist", "Solutions Architect"],
    skills: [
      { name: "Power Automate or a similar tool", key: "lowcode" },
      { name: "Python or JavaScript basics" },
      { name: "APIs: how apps talk to each other" },
      { name: "Process analysis", key: "processmap" },
    ],
    certs: {
      now: ["Microsoft PL-900 (Power Platform Fundamentals)", "Microsoft AB-900 (Copilot and Agent Administration Fundamentals)"],
      later: ["Microsoft AB-series associate exams for building AI agents"],
    },
    outlook: { occupation: "Software developers (closest BLS match)", growth: "+10%", pay: "$135,980", url: BLS + "computer-and-information-technology/software-developers.htm" },
    ai: "BLS names software development for AI as a reason developer demand stays strong. Low-code and AI-agent tools now let analysts automate a lot without being full-time developers.",
    starter: "Automate one boring task you actually do: a Power Automate flow that saves email attachments to a folder, or a script that renames files.",
  },
  {
    id: "analytics",
    name: "Data Analytics & Business Intelligence",
    tagline: "Turning messy numbers into decisions.",
    description:
      "You clean, explore and visualize data so leaders can see what's happening and why. BI (business intelligence) work centers on dashboards and the metrics a business runs on.",
    weights: { data: 1.0, strategy: 0.6, requirements: 0.4 },
    intensity: "Mixed",
    coding: "some", urgent: false, client: false, peopleHeavy: false,
    weekly: [
      "Writing SQL to pull and combine data",
      "Building and maintaining dashboards",
      "Explaining what the numbers mean to non-technical people",
    ],
    entryTitles: ["Data Analyst Intern", "BI Intern", "Reporting Analyst"],
    leadsTo: ["Senior Data Analyst", "Analytics Manager", "Data Scientist"],
    skills: [
      { name: "Excel (PivotTables, lookups)", key: "excel" },
      { name: "SQL", key: "sql" },
      { name: "Power BI or Tableau", key: "powerbi" },
      { name: "Python basics" },
    ],
    certs: {
      now: ["Microsoft PL-300 (Power BI Data Analyst; updated April 2026 to include Copilot in Power BI)"],
      later: ["Microsoft DP-600 (Fabric Analytics Engineer)"],
    },
    outlook: { occupation: "Data scientists (closest BLS match; BLS has no \"data analyst\" category)", growth: "+35%", pay: "$120,230", url: BLS + "math/data-scientists.htm" },
    ai: "BLS expects firms to keep building AI-based systems into their workflows and says data scientists will be needed to help. Analysts increasingly use AI features inside tools like Power BI.",
    starter: "Download a free public dataset (city data, sports stats), clean it in Excel, and build a one-page Power BI dashboard with three insights.",
  },
  {
    id: "datagov",
    name: "Data Governance & Information Management",
    tagline: "Making sure data can be trusted.",
    description:
      "You define what data means, who owns it, who may use it, and how its quality is checked. Data governance sits between the business and the database teams, and AI makes it more important.",
    weights: { protect: 1.0, data: 0.6, configure: 0.4 },
    intensity: "Mixed",
    coding: "some", urgent: false, client: false, peopleHeavy: false,
    weekly: [
      "Writing data definitions and ownership rules",
      "Running data quality checks and chasing down errors",
      "Reviewing who has access to which data",
    ],
    entryTitles: ["Data Quality Analyst", "Data Steward", "Data Governance Intern"],
    leadsTo: ["Data Governance Lead", "Chief Data Officer", "Database Architect"],
    skills: [
      { name: "SQL", key: "sql" },
      { name: "Excel for data checks", key: "excel" },
      { name: "Data catalogs and documentation" },
      { name: "Privacy basics" },
    ],
    certs: {
      now: ["Microsoft PL-300 (covers data modeling and security basics)"],
      later: ["Credentials vary by employer; ask professionals at MIS Society events"],
    },
    outlook: { occupation: "Database administrators and architects", growth: "+4%", pay: "$126,760", url: BLS + "computer-and-information-technology/database-administrators.htm" },
    ai: "AI is only as good as its data. Rules like the EU AI Act and standards like ISO/IEC 42001 expect organizations to document and govern the data their AI systems use.",
    starter: "Take a messy spreadsheet (club roster, budget), write a short data dictionary for it, and list five quality rules it currently breaks.",
  },
  {
    id: "grc",
    name: "Governance, Risk, Compliance & AI Governance",
    tagline: "Proving that systems are safe, fair and following the rules.",
    description:
      "GRC (governance, risk and compliance) professionals assess technology risk, test controls, gather audit evidence, and make sure the organization meets laws and standards. A fast-growing part of this is governing how AI is used.",
    weights: { protect: 1.0, strategy: 0.6, requirements: 0.4 },
    intensity: "Low to mixed",
    coding: "none", urgent: false, client: false, peopleHeavy: false,
    weekly: [
      "Testing whether security and IT controls actually work",
      "Writing and updating policies",
      "Assessing the risk of vendors and new tools, including AI tools",
    ],
    entryTitles: ["IT Audit Intern", "GRC Analyst Intern", "Technology Risk Intern"],
    leadsTo: ["IT Audit Manager", "Risk and Compliance Manager", "Chief Information Security Officer (CISO)"],
    skills: [
      { name: "Frameworks: NIST, ISO 27001, SOC 2" },
      { name: "AI frameworks: NIST AI RMF, ISO/IEC 42001" },
      { name: "Clear policy and audit writing" },
      { name: "Security fundamentals", key: "securitylab" },
    ],
    certs: {
      now: ["CompTIA Security+", "IAPP AIGP, Artificial Intelligence Governance Professional (check current requirements at iapp.org)"],
      later: ["ISACA CISA", "ISACA AAIA (AI audit; requires CISA or a similar audit credential)"],
    },
    outlook: { occupation: "Information security analysts (closest BLS match)", growth: "+21%", pay: "$129,180", url: BLS + "computer-and-information-technology/information-security-analysts.htm" },
    ai: "AI governance is becoming real work: EU AI Act rules for high-risk AI systems apply from December 2, 2027, and organizations are preparing with the NIST AI Risk Management Framework and ISO/IEC 42001.",
    starter: "Pick an AI tool your school or club uses and write a one-page risk review: what data it sees, what could go wrong, and three controls you'd recommend.",
  },
  {
    id: "cyber",
    name: "Cybersecurity Operations & Identity",
    tagline: "Defending systems in real time.",
    description:
      "You monitor for threats, investigate alerts, manage who can log in to what (identity and access management, or IAM), and respond to incidents. It's more hands-on and technical than GRC.",
    weights: { protect: 1.0, operate: 0.6, automate: 0.4 },
    intensity: "Substantial",
    coding: "heavy", urgent: true, client: false, peopleHeavy: false,
    weekly: [
      "Triaging security alerts in a monitoring tool",
      "Granting, reviewing and removing user access",
      "Investigating suspicious activity and documenting incidents",
    ],
    entryTitles: ["Security Operations Center (SOC) Intern", "IAM Intern", "Cybersecurity Intern"],
    leadsTo: ["Security Engineer", "Incident Response Lead", "Security Architect"],
    skills: [
      { name: "Networking basics" },
      { name: "Hands-on security labs", key: "securitylab" },
      { name: "Linux and Windows administration" },
      { name: "Python or PowerShell scripting" },
    ],
    certs: {
      now: ["CompTIA Security+ (new version, SY0-801, launches around November 17, 2026)"],
      later: ["CompTIA SecAI+ (launched February 2026; 3-4 years of IT experience recommended)", "ISACA AAISM (requires CISM or CISSP)"],
    },
    outlook: { occupation: "Information security analysts", growth: "+21%", pay: "$129,180", url: BLS + "computer-and-information-technology/information-security-analysts.htm" },
    ai: "Attackers and defenders both use AI now. CompTIA launched SecAI+ in February 2026, its first certification focused on securing AI and using it in security work.",
    starter: "Complete a free beginner security lab path (for example on TryHackMe) and write up what you learned from one investigation.",
  },
  {
    id: "delivery",
    name: "IT Project, Program & Product Delivery",
    tagline: "Getting the right people to ship the right thing on time.",
    description:
      "You plan the work, coordinate teams, manage risks and keep stakeholders informed. Some roles focus on delivering projects on time; product roles focus on deciding what gets built and why.",
    weights: { coordinate: 1.0, requirements: 0.6, strategy: 0.4 },
    intensity: "Low to mixed",
    coding: "none", urgent: false, client: false, peopleHeavy: true,
    weekly: [
      "Running stand-ups and planning meetings",
      "Tracking tasks, risks and deadlines",
      "Updating stakeholders and negotiating trade-offs",
    ],
    entryTitles: ["IT Project Coordinator", "Project Management Office (PMO) Intern", "Product Operations Intern"],
    leadsTo: ["IT Project Manager", "Program Manager", "Product Manager"],
    skills: [
      { name: "Agile and Scrum basics" },
      { name: "Jira, Asana or Microsoft Project" },
      { name: "Running a real project", key: "project" },
      { name: "Clear status writing" },
    ],
    certs: {
      now: ["PMI CAPM (Certified Associate in Project Management)", "PMI-CPMAI, for managing AI projects (no experience required)"],
      later: ["PMI PMP"],
    },
    outlook: { occupation: "Project management specialists", growth: "+7%", pay: "$102,320", url: BLS + "business-and-financial/project-management-specialists.htm" },
    ai: "AI projects fail without good delivery. PMI reports that the U.S. Office of Personnel Management has identified project management as a critical gap in agencies' ability to scale AI, and PMI now certifies AI project management (PMI-CPMAI).",
    starter: "Run one MIS Society event or class project with a written plan: tasks, owners, deadlines and a risk list. Then write a one-page retrospective.",
  },
  {
    id: "ux",
    name: "UX Research & Service Design",
    tagline: "Making technology work for the people using it.",
    description:
      "You study how people actually use a service, map their journey, test designs, and push for changes that make systems easier and more accessible. In MIS this focuses on research and service redesign more than visual design.",
    weights: { people: 1.0, requirements: 0.6, process: 0.4 },
    intensity: "Low to mixed",
    coding: "none", urgent: false, client: false, peopleHeavy: true,
    weekly: [
      "Interviewing and observing users",
      "Mapping customer or employee journeys",
      "Running usability tests and presenting findings",
    ],
    entryTitles: ["UX Research Intern", "Service Design Intern", "Digital Experience Analyst"],
    leadsTo: ["UX Researcher", "Service Designer", "Product Manager"],
    skills: [
      { name: "User interviews and usability testing" },
      { name: "Journey maps", key: "processmap" },
      { name: "Figma basics" },
      { name: "Accessibility basics (WCAG guidelines)" },
    ],
    certs: {
      now: ["No standard certification; a portfolio of real usability studies matters most"],
      later: ["Specialized UX courses and portfolios"],
    },
    outlook: { occupation: "Web and digital interface designers (closest BLS match)", growth: "+6%", pay: "$104,000", url: BLS + "computer-and-information-technology/web-developers.htm" },
    ai: "As AI features show up in everyday apps, someone has to test whether people can use them, understand them and trust them.",
    starter: "Run a five-person usability test on a campus website task (like finding a form), then write up the top three problems with screenshots.",
  },
  {
    id: "infra",
    name: "IT Operations, Cloud & Infrastructure",
    tagline: "Keeping the systems everyone depends on running.",
    description:
      "You run and support the networks, devices, accounts and cloud services a company runs on. Many careers start in IT support and grow into systems, cloud or platform roles.",
    weights: { operate: 1.0, automate: 0.6, configure: 0.4 },
    intensity: "Substantial",
    coding: "some", urgent: true, client: false, peopleHeavy: false,
    weekly: [
      "Resolving support tickets and outages",
      "Managing user accounts, devices and access",
      "Setting up and monitoring cloud resources",
    ],
    entryTitles: ["IT Operations Intern", "Cloud Operations Intern", "Service Desk Analyst"],
    leadsTo: ["Systems Engineer", "Cloud Engineer", "IT Operations Manager"],
    skills: [
      { name: "Networking basics" },
      { name: "Microsoft 365 and Entra ID administration" },
      { name: "PowerShell or Python scripting" },
      { name: "Cloud fundamentals (Azure or AWS)" },
    ],
    certs: {
      now: ["CompTIA A+ or Network+", "Microsoft AB-900 (Microsoft 365 Copilot and Agent Administration Fundamentals)"],
      later: ["Azure or AWS associate-level cloud certifications"],
    },
    outlook: { occupation: "Network and computer systems administrators", growth: "−4%", pay: "$99,130", url: BLS + "computer-and-information-technology/network-and-computer-systems-administrators.htm" },
    ai: "BLS projects these jobs to shrink, citing automation of routine tasks, outsourcing and chatbots in user support. Cloud, identity, security and automation skills are what keep this path growing.",
    starter: "Build a home lab: a free-tier cloud account with one virtual machine, then document how you secured it and set up a cost alert.",
  },
  {
    id: "strategy",
    name: "Tech Consulting, Strategy & Architecture",
    tagline: "Helping organizations decide what technology to invest in.",
    description:
      "You diagnose business problems, compare options, build the business case, and design how systems should fit together. Many people start in analyst or consulting roles; architect titles usually come later.",
    weights: { strategy: 1.0, requirements: 0.6, configure: 0.4 },
    intensity: "Mixed",
    coding: "none", urgent: false, client: true, peopleHeavy: true,
    weekly: [
      "Researching options and building business cases",
      "Running workshops with client or department leaders",
      "Presenting recommendations and supporting the rollout",
    ],
    entryTitles: ["Technology Consulting Intern", "IT Advisory Intern", "Vendor Management Analyst"],
    leadsTo: ["Technology Consultant", "Enterprise or Solutions Architect", "Chief Information Officer (CIO)"],
    skills: [
      { name: "Business cases and cost analysis", key: "excel" },
      { name: "Presenting to leaders" },
      { name: "Process and capability maps", key: "processmap" },
      { name: "Broad knowledge of business platforms" },
    ],
    certs: {
      now: ["IIBA ECBA", "Microsoft PL-900"],
      later: ["PMI PMP", "Cloud architect certifications (AWS or Azure)"],
    },
    outlook: { occupation: "Management analysts", growth: "+10%", pay: "$101,860", url: BLS + "business-and-financial/management-analysts.htm" },
    ai: "In the World Economic Forum's 2025 survey, 7 in 10 employers called analytical thinking a core skill. Companies need advisors to decide where AI is actually worth the cost and risk.",
    starter: "Pick a real local business, research two software options for one of its problems, and write a one-page recommendation with costs and risks.",
  },
];

/* Scoring settings (see scoring.js). Change carefully and re-run the tests. */
const SETTINGS = {
  weightSum: 2.0,          // 1.0 + 0.6 + 0.4
  scenarioMaxShift: 0.25,  // most a dimension can move from Part B picks
  strongGap: 0.05,         // within this of the top family = Strong / tied
  goodGap: 0.15,           // within this of the top = Good
  someFloor: 0.4,          // below this = not shown as a match
  lowConfidenceUnsure: 6,  // this many "Unsure" ratings = exploratory
  lowConfidenceTop: 0.5,   // top family below this = exploratory
  flatProfileRange: 0.2,   // all dimensions within this range = exploratory
};

/* Lets the automated tests (Node.js) load this file too. Browsers ignore it. */
if (typeof module !== "undefined") {
  module.exports = { QUIZ_VERSION, CONTENT_CHECKED, DIMENSIONS, RATING_SCALE, RATING_ITEMS, SCENARIOS, WORK_STYLE, EXPERIENCE, FAMILIES, SETTINGS };
}
