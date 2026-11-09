/*
  scoring.js: turns answers into a work profile and career-family matches.
  Pure functions only (no page code), so the automated tests can run them.

  How it works, in plain words:
  1. Each Part A rating becomes a number from 0 (strongly dislike) to 1
     (strongly like). "Unsure" is skipped but counted.
  2. Each dimension's score is the average of its two ratings, nudged up or
     down by Part B "most / least appealing" picks.
  3. Each family's score is a weighted average of its three dimensions.
  4. Families are grouped into bands (Strong / Good / Some) by how close they
     are to the top one, instead of showing a fake-precise percentage.
*/

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

function round2(x) {
  return Math.round(x * 100) / 100;
}

/* Step 1 + 2: the 10-dimension work profile. */
function scoreDimensions(answers, data) {
  const ratings = answers.ratings || {};
  const picks = answers.scenarios || {};
  let unsureCount = 0;

  const dims = data.DIMENSIONS.map((dim) => {
    const items = data.RATING_ITEMS.filter((item) => item.dim === dim.id);
    const values = [];
    items.forEach((item) => {
      const v = ratings[item.id];
      if (v === null) unsureCount += 1;
      else if (typeof v === "number") values.push(v);
    });
    const base = values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0.5;

    // Part B: how often this dimension appears, and its net most/least picks.
    let appearances = 0;
    let net = 0;
    data.SCENARIOS.forEach((sc) => {
      if (!sc.options.some((o) => o.dim === dim.id)) return;
      appearances += 1;
      const p = picks[sc.id] || {};
      if (p.most === dim.id) net += 1;
      if (p.least === dim.id) net -= 1;
    });
    const shift = appearances ? (data.SETTINGS.scenarioMaxShift * net) / appearances : 0;

    return {
      id: dim.id,
      name: dim.name,
      short: dim.short,
      score: clamp01(base + shift),
      rated: values.length,
    };
  });

  return { dims, unsureCount };
}

/* Step 3: family scores. */
function scoreFamilies(dims, data) {
  const byId = {};
  dims.forEach((d) => (byId[d.id] = d.score));
  return data.FAMILIES.map((family, order) => {
    let total = 0;
    Object.entries(family.weights).forEach(([dimId, w]) => {
      total += w * (byId[dimId] ?? 0.5);
    });
    return { family, order, score: total / data.SETTINGS.weightSum };
  }).sort((a, b) => b.score - a.score || a.order - b.order);
}

/* Step 4: bands relative to the top family. */
function bandFor(score, top, s) {
  const gap = top - score;
  if (gap <= s.strongGap + 1e-9) return "Strong";
  if (gap <= s.goodGap + 1e-9) return "Good";
  if (score >= s.someFloor) return "Some";
  return "Low";
}

/* Families in the top 3 that are close enough to call a tie. */
function findTies(top3, s) {
  const ties = [];
  for (let i = 0; i < top3.length; i++) {
    for (let j = i + 1; j < top3.length; j++) {
      if (Math.abs(top3[i].score - top3[j].score) <= s.strongGap + 1e-9) {
        const shared = Object.keys(top3[i].family.weights).filter((d) => d in top3[j].family.weights);
        ties.push({ a: top3[i].family, b: top3[j].family, shared });
      }
    }
  }
  return ties;
}

/* "Heads up" notes comparing a family with the Part C work-style answers. */
function workStyleNotes(family, style) {
  const notes = [];
  if (!style) return notes;
  if (style.coding === 0 && family.coding === "heavy")
    notes.push("This path usually involves regular scripting. You said you'd rather avoid coding. It's learnable, but go in knowing that.");
  else if (style.coding === 0 && family.coding === "some")
    notes.push("Some roles here use SQL or light scripting. Many don't, so read job descriptions closely.");
  if (style.coding === 2 && family.coding === "none")
    notes.push("You enjoy coding: look for roles in this family that also use SQL or automation.");
  if (style.urgent === 0 && family.urgent)
    notes.push("Some roles here involve urgent incidents or on-call shifts.");
  if (style.client === 0 && family.client)
    notes.push("Consulting roles often involve outside clients and travel. Internal strategy roles exist too.");
  if (style.social === 0 && family.peopleHeavy)
    notes.push("This path is people-heavy: lots of interviews, meetings or workshops.");
  return notes;
}

/* Which of the person's answers support a family (for the "Why" section). */
function reasonsFor(family, answers, data) {
  const ratings = answers.ratings || {};
  const weights = family.weights;
  const rated = data.RATING_ITEMS
    .filter((item) => item.dim in weights && typeof ratings[item.id] === "number" && ratings[item.id] >= 0.75)
    .sort((a, b) => ratings[b.id] - ratings[a.id] || weights[b.dim] - weights[a.dim])
    .map((item) => ({ text: item.text, how: ratings[item.id] === 1 ? "You strongly liked" : "You liked" }));

  const picked = [];
  data.SCENARIOS.forEach((sc) => {
    const p = (answers.scenarios || {})[sc.id];
    if (!p || !(p.most in weights)) return;
    const opt = sc.options.find((o) => o.dim === p.most);
    if (opt) picked.push({ text: opt.text, how: "You picked" });
  });

  return rated.slice(0, 3).concat(picked.slice(0, 1));
}

/* The whole result, in one object. */
function scoreQuiz(answers, data) {
  const s = data.SETTINGS;
  const { dims, unsureCount } = scoreDimensions(answers, data);
  const ranked = scoreFamilies(dims, data);
  const top = ranked[0].score;

  ranked.forEach((r) => (r.band = bandFor(r.score, top, s)));
  const top3 = ranked.slice(0, 3);

  const dimScores = dims.map((d) => d.score);
  const range = Math.max(...dimScores) - Math.min(...dimScores);
  const reasons = [];
  if (unsureCount >= s.lowConfidenceUnsure) reasons.push("many \"Unsure\" answers");
  if (top < s.lowConfidenceTop) reasons.push("no family drew a strong reaction");
  if (range < s.flatProfileRange) reasons.push("you rated most kinds of work about the same");

  const experience = answers.experience || {};
  const cards = top3.map((r) => ({
    family: r.family,
    band: r.band,
    score: r.score,
    reasons: reasonsFor(r.family, answers, data),
    notes: workStyleNotes(r.family, answers.workStyle),
    skills: r.family.skills.map((sk) => ({ name: sk.name, tried: !!(sk.key && experience[sk.key]) })),
  }));

  return {
    dims,
    unsureCount,
    ranked,
    top3,
    cards,
    ties: findTies(top3, s),
    confidence: { low: reasons.length > 0, reasons },
  };
}

if (typeof module !== "undefined") {
  module.exports = { scoreQuiz, scoreDimensions, scoreFamilies, bandFor, round2 };
}
