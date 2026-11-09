/*
  Automated checks for the scoring engine, using made-up test respondents.
  Run from the project folder with:   node tests/test-scoring.js
  Every check should print PASS. Re-run after changing weights in data.js.
*/

const data = require("../js/data.js");
const { scoreQuiz } = require("../js/scoring.js");

/* Build a respondent from how much they like each dimension (0-1).
   Unlisted dimensions get `rest`. Scenario picks follow the same preferences. */
function respondent(prefs, rest = 0.25, extra = {}) {
  const like = (dim) => (dim in prefs ? prefs[dim] : rest);
  const ratings = {};
  data.RATING_ITEMS.forEach((item) => (ratings[item.id] = like(item.dim)));
  const scenarios = {};
  data.SCENARIOS.forEach((sc) => {
    const sorted = sc.options.slice().sort((a, b) => like(b.dim) - like(a.dim));
    scenarios[sc.id] = { most: sorted[0].dim, least: sorted[sorted.length - 1].dim };
  });
  return Object.assign({ ratings, scenarios, workStyle: {}, experience: {} }, extra);
}

const rankOf = (result, id) => result.ranked.findIndex((r) => r.family.id === id) + 1;
const topIds = (result, n) => result.ranked.slice(0, n).map((r) => r.family.id);

let failures = 0;
function check(name, condition, detail) {
  console.log(`${condition ? "PASS" : "FAIL"}  ${name}${condition ? "" : "  -> " + detail}`);
  if (!condition) failures += 1;
}

// 1. Lean / process fan should see Process Improvement first, not dashboard-only BI.
let r = scoreQuiz(respondent({ process: 1, requirements: 0.75, data: 0.75 }), data);
check("Process fan: Process Improvement is #1", rankOf(r, "process") === 1, topIds(r, 3));
check("Process fan: Business Analysis in top 3", rankOf(r, "analysis") <= 3, topIds(r, 3));
check("Process fan: Analytics ranks below Process", rankOf(r, "analytics") > rankOf(r, "process"), topIds(r, 5));

// 2. Likes compliance and policy, not incident response -> GRC above Cyber Ops.
r = scoreQuiz(respondent({ protect: 1, strategy: 0.75, requirements: 0.75, operate: 0 }), data);
check("Compliance fan: GRC ranks above Cyber Ops", rankOf(r, "grc") < rankOf(r, "cyber"), topIds(r, 4));

// 3. Likes configuring CRM/ERP and gathering requirements -> Systems and Analysis above Infrastructure.
r = scoreQuiz(respondent({ configure: 1, requirements: 0.75, coordinate: 0.75 }), data);
check("CRM/ERP fan: Business Systems is #1", rankOf(r, "systems") === 1, topIds(r, 3));
check("CRM/ERP fan: Analysis above Infrastructure", rankOf(r, "analysis") < rankOf(r, "infra"), topIds(r, 6));

// 4. User interviews and service journeys -> UX in top 3.
r = scoreQuiz(respondent({ people: 1, requirements: 0.75 }), data);
check("User-research fan: UX is #1", rankOf(r, "ux") === 1, topIds(r, 3));

// 5. Cloud deployment and scripting -> Infrastructure or Automation in top 2.
r = scoreQuiz(respondent({ operate: 1, automate: 1, configure: 0.75 }), data);
check("Cloud + scripting fan: Infra in top 2", rankOf(r, "infra") <= 2, topIds(r, 3));

// 6. Non-coder drawn to IT strategy -> Strategy top, Infrastructure not in top 3.
r = scoreQuiz(respondent({ strategy: 1, requirements: 0.75, operate: 0, automate: 0 }, 0.25, { workStyle: { coding: 0 } }), data);
check("Non-coder strategist: Strategy is #1", rankOf(r, "strategy") === 1, topIds(r, 3));
check("Non-coder strategist: Infra not in top 3", rankOf(r, "infra") > 3, topIds(r, 3));

// 7. Answers "Unsure" to everything -> exploratory (low confidence).
const allUnsure = respondent({});
Object.keys(allUnsure.ratings).forEach((k) => (allUnsure.ratings[k] = null));
allUnsure.scenarios = {};
r = scoreQuiz(allUnsure, data);
check("All unsure: low confidence", r.confidence.low === true, r.confidence);

// 8. Likes everything equally -> exploratory (flat profile).
r = scoreQuiz(respondent({}, 0.75, { scenarios: {} }), data);
check("Likes everything: low confidence", r.confidence.low === true, r.confidence);

// 9. BI-heavy -> Analytics is #1.
r = scoreQuiz(respondent({ data: 1, strategy: 0.75 }), data);
check("BI fan: Analytics is #1", rankOf(r, "analytics") === 1, topIds(r, 3));

// 10. Coordinator -> Delivery is #1.
r = scoreQuiz(respondent({ coordinate: 1, requirements: 0.75, strategy: 0.75 }), data);
check("Coordinator: Delivery is #1", rankOf(r, "delivery") === 1, topIds(r, 3));

// 11. Contradictory: rates Protect highly but always picks it as least appealing.
const contra = respondent({ protect: 1 });
data.SCENARIOS.forEach((sc) => {
  if (!sc.options.some((o) => o.dim === "protect")) return;
  contra.scenarios[sc.id] = { most: sc.options.find((o) => o.dim !== "protect").dim, least: "protect" };
});
r = scoreQuiz(contra, data);
const protectDim = r.dims.find((d) => d.id === "protect").score;
check("Contradictory: protect pulled down from 1.0", protectDim < 1, protectDim);
check("Contradictory: still returns 3 cards", r.cards.length === 3, r.cards.length);

// 12. Coding-averse person whose top 3 includes Cyber Ops gets a heads-up note.
r = scoreQuiz(respondent({ protect: 1, operate: 1, automate: 0.75 }, 0.25, { workStyle: { coding: 0, urgent: 0 } }), data);
const cyberCard = r.cards.find((c) => c.family.id === "cyber");
check("Coding-averse cyber fan: heads-up shown", !!cyberCard && cyberCard.notes.length >= 1, cyberCard && cyberCard.notes);

// 13. Near-tie between two families is reported, not hidden.
r = scoreQuiz(respondent({ protect: 1, strategy: 1, data: 1 }), data);
check("Close scores: a tie is reported", r.ties.length >= 1, r.top3.map((t) => [t.family.id, t.score.toFixed(3)]));

// 14. Experience marks: tried SQL shows on matching skills.
r = scoreQuiz(respondent({ data: 1 }, 0.25, { experience: { sql: true } }), data);
const sqlSkill = r.cards[0].skills.find((s) => /SQL/.test(s.name));
check("Experience: SQL marked as tried", !!sqlSkill && sqlSkill.tried, r.cards[0].skills);

// 15. Every family can reach #1 for someone (no family is unreachable).
const unreachable = data.FAMILIES.filter((f) => {
  const prefs = {};
  Object.keys(f.weights).forEach((d) => (prefs[d] = f.weights[d] === 1 ? 1 : 0.75));
  return scoreQuiz(respondent(prefs, 0), data).ranked[0].family.id !== f.id;
});
check("Every family can be someone's #1", unreachable.length === 0, unreachable.map((f) => f.id));

console.log(failures ? `\n${failures} check(s) failed.` : "\nAll checks passed.");
process.exit(failures ? 1 : 0);
