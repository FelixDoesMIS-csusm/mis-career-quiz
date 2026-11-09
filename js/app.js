/*
  app.js: the page. Shows one step at a time, records answers,
  then asks scoring.js for the result and draws the results page.
  Content lives in data.js; scoring rules live in scoring.js.
*/

(function () {
  "use strict";

  const DATA = { DIMENSIONS, RATING_SCALE, RATING_ITEMS, SCENARIOS, WORK_STYLE, EXPERIENCE, FAMILIES, SETTINGS };
  const STORAGE_KEY = "misCareerQuiz.v2.lastResult";
  const AUTO_ADVANCE_MS = 220;

  // ---------- State ----------
  let steps = [];
  let index = 0;
  let answers = null;
  let optionOrder = {}; // shuffled option order per scenario
  let advanceTimer = null;

  // ---------- Helpers ----------
  const $ = (id) => document.getElementById(id);
  const views = { start: $("view-start"), quiz: $("view-quiz"), results: $("view-results") };

  function esc(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function showView(name) {
    Object.entries(views).forEach(([key, el]) => (el.hidden = key !== name));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function shuffle(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function familyById(id) {
    return FAMILIES.find((f) => f.id === id);
  }

  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable: fine */ }
  }

  function load(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }

  // ---------- Start screen ----------
  function renderStart() {
    $("family-chips").innerHTML = FAMILIES.map((f) => `<span class="path-chip">${esc(f.name)}</span>`).join("");
    const last = load(STORAGE_KEY);
    const banner = $("last-result");
    if (last && familyById(last.topId)) {
      banner.innerHTML = `Welcome back! Last time your top match was <strong>${esc(familyById(last.topId).name)}</strong>. Take it again to see if anything changed.`;
      banner.hidden = false;
    } else {
      banner.hidden = true;
    }
  }

  function buildSteps() {
    const list = [];
    RATING_ITEMS.forEach((item, i) => list.push({ type: "rating", part: "A", item, n: i + 1, of: RATING_ITEMS.length }));
    SCENARIOS.forEach((sc, i) => {
      list.push({ type: "most", part: "B", scenario: sc, n: i + 1, of: SCENARIOS.length });
      list.push({ type: "least", part: "B", scenario: sc, n: i + 1, of: SCENARIOS.length });
    });
    WORK_STYLE.forEach((q, i) => list.push({ type: "style", part: "C", q, n: i + 1, of: WORK_STYLE.length }));
    list.push({ type: "experience", part: "D", n: 1, of: 1 });
    return list;
  }

  function startQuiz() {
    answers = { ratings: {}, scenarios: {}, workStyle: {}, experience: {} };
    optionOrder = {};
    SCENARIOS.forEach((sc) => (optionOrder[sc.id] = shuffle(sc.options)));
    steps = buildSteps();
    index = 0;
    $("copy-fallback").hidden = true;
    showView("quiz");
    renderStep();
  }

  // ---------- Quiz steps ----------
  function isAnswered(step) {
    switch (step.type) {
      case "rating": return step.item.id in answers.ratings;
      case "most": return !!(answers.scenarios[step.scenario.id] || {}).most;
      case "least": return !!(answers.scenarios[step.scenario.id] || {}).least;
      case "style": return step.q.id in answers.workStyle;
      default: return true;
    }
  }

  function optionCard(name, value, label, key, checked, disabled, badge) {
    return `
      <label class="option-card${disabled ? " is-disabled" : ""}">
        <input type="radio" name="${name}" value="${value}" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""}>
        <span class="option-key" aria-hidden="true">${key}</span>
        <span class="option-text">${esc(label)}</span>
        ${badge ? `<span class="option-badge">${esc(badge)}</span>` : ""}
      </label>`;
  }

  function renderStep() {
    clearTimeout(advanceTimer);
    arrowNavigating = false;
    const step = steps[index];
    const pct = Math.round((index / steps.length) * 100);
    const partNames = { A: "Part A: Rate the task", B: "Part B: Scenarios", C: "Part C: Work style", D: "Part D: Experience" };

    $("part-label").textContent = `${partNames[step.part]} · ${step.n} of ${step.of}`;
    $("progress-pct").textContent = `${pct}% complete`;
    $("progress-bar").style.width = `${pct}%`;
    $("progress-bar").parentElement.setAttribute("aria-valuenow", pct);

    let kicker = "", title = "", sub = "", body = "", tip = "";
    $("btn-skip").hidden = true;

    if (step.type === "rating") {
      kicker = "How would you feel about doing this task?";
      title = step.item.text;
      const current = answers.ratings[step.item.id];
      body = `<div class="options options-rating" role="radiogroup" aria-label="Your rating">${RATING_SCALE.map((opt, i) =>
        optionCard("answer", i, opt.label, i + 1, step.item.id in answers.ratings && current === opt.value, false)).join("")}</div>`;
      tip = "Tip: press 1–5 to answer. You'll move on automatically.";
    } else if (step.type === "most" || step.type === "least") {
      const sc = step.scenario;
      const picks = answers.scenarios[sc.id] || {};
      kicker = `Scenario ${step.n} of ${step.of}`;
      title = sc.text;
      sub = step.type === "most" ? "Which would you MOST like to do?" : "And which would you LEAST like to do?";
      const chosen = step.type === "most" ? picks.most : picks.least;
      body = `<div class="options" role="radiogroup" aria-label="${esc(sub)}">${optionOrder[sc.id].map((opt, i) => {
        const disabled = step.type === "least" && opt.dim === picks.most;
        return optionCard("answer", opt.dim, opt.text, i + 1, chosen === opt.dim, disabled, disabled ? "Your top pick" : "");
      }).join("")}</div>`;
      tip = "Tip: press 1–4 to answer.";
    } else if (step.type === "style") {
      kicker = "Not scored. Used only for \"heads up\" notes on your results.";
      title = step.q.text;
      body = `<div class="options" role="radiogroup" aria-label="Your answer">${step.q.options.map((label, i) =>
        optionCard("answer", i, label, i + 1, answers.workStyle[step.q.id] === i, false)).join("")}</div>`;
      tip = "Tip: press 1–3 to answer.";
    } else {
      kicker = "Optional and not scored";
      title = "Which of these have you tried at least once?";
      sub = "Your results will mark the skills you've already started.";
      body = `<div class="exp-list">${EXPERIENCE.map((e) => {
        const yes = answers.experience[e.id] === true;
        const no = answers.experience[e.id] === false;
        return `<div class="exp-row"><span class="exp-label" id="exp-${e.id}-label">${esc(e.text)}</span>
          <div class="btn-group" role="radiogroup" aria-labelledby="exp-${e.id}-label">
            <input type="radio" class="btn-check" name="exp-${e.id}" id="exp-${e.id}-y" value="yes" ${yes ? "checked" : ""}>
            <label class="btn btn-outline-primary btn-sm" for="exp-${e.id}-y">Yes</label>
            <input type="radio" class="btn-check" name="exp-${e.id}" id="exp-${e.id}-n" value="no" ${no ? "checked" : ""}>
            <label class="btn btn-outline-primary btn-sm" for="exp-${e.id}-n">Not yet</label>
          </div></div>`;
      }).join("")}</div>`;
      $("btn-skip").hidden = false;
    }

    $("step-kicker").textContent = kicker;
    $("step-title").textContent = title;
    $("step-sub").textContent = sub;
    $("step-sub").hidden = !sub;
    $("step-body").innerHTML = body;
    $("key-tip").textContent = tip;

    $("btn-back").disabled = index === 0;
    $("btn-next").innerHTML = index === steps.length - 1 ? "See results &rarr;" : "Next &rarr;";
    $("btn-next").disabled = !isAnswered(step);
    $("step-title").focus({ preventScroll: true });
  }

  let arrowNavigating = false; // arrow keys move between options without auto-advancing

  function record(rawValue) {
    const autoAdvance = !arrowNavigating;
    arrowNavigating = false;
    const step = steps[index];
    if (step.type === "rating") {
      answers.ratings[step.item.id] = RATING_SCALE[Number(rawValue)].value;
    } else if (step.type === "most") {
      const p = (answers.scenarios[step.scenario.id] = answers.scenarios[step.scenario.id] || {});
      p.most = rawValue;
      if (p.least === rawValue) delete p.least; // can't be both
    } else if (step.type === "least") {
      answers.scenarios[step.scenario.id].least = rawValue;
    } else if (step.type === "style") {
      answers.workStyle[step.q.id] = Number(rawValue);
    }
    const input = document.querySelector(`#step-body input[value="${rawValue}"]`);
    if (input) input.checked = true;
    $("btn-next").disabled = false;
    clearTimeout(advanceTimer);
    if (autoAdvance) advanceTimer = setTimeout(goNext, AUTO_ADVANCE_MS);
  }

  function goNext() {
    clearTimeout(advanceTimer);
    if (!isAnswered(steps[index])) return;
    if (index < steps.length - 1) {
      index += 1;
      renderStep();
    } else {
      showResults();
    }
  }

  function goBack() {
    clearTimeout(advanceTimer);
    if (index > 0) {
      index -= 1;
      renderStep();
    }
  }

  // ---------- Results ----------
  function list(items) {
    return items.map((i) => `<li>${esc(i)}</li>`).join("");
  }

  function bandClass(band) {
    return { Strong: "band-strong", Good: "band-good", Some: "band-some" }[band] || "band-low";
  }

  function familyCard(card, rank) {
    const f = card.family;
    const why = card.reasons.length
      ? `<ul class="why-list">${card.reasons.map((r) => `<li><span class="why-how">${esc(r.how)}:</span> ${esc(r.text)}</li>`).join("")}</ul>`
      : `<p class="mb-0 small">Your answers for this family were mostly neutral.</p>`;
    const notes = card.notes.length
      ? `<div class="heads-up"><strong>Heads up:</strong><ul>${list(card.notes)}</ul></div>`
      : "";
    const skills = card.skills.map((s) => `<li>${esc(s.name)}${s.tried ? ' <span class="tried">✓ you\'ve tried this</span>' : ""}</li>`).join("");
    const aiExposure = f.outlook.aiExposure
      ? `<p class="small mb-1">AI exposure (BLS): ${esc(f.outlook.aiExposure)}</p>
          <a class="small d-block" href="https://www.bls.gov/emp/publications/ai-exposure-categories.htm" target="_blank" rel="noopener">BLS AI exposure categories</a>
          <p class="small text-muted mb-0">Relative to other jobs. Not a forecast of job loss.</p>`
      : "";

    const inner = `
      <p class="family-tagline">${esc(f.tagline)}</p>
      <p>${esc(f.description)}</p>
      <div class="why-box"><h3 class="detail-heading">Why it matched</h3>${why}</div>
      ${notes}
      <div class="row g-3 mt-1">
        <div class="col-md-6"><h4 class="detail-heading">A typical week</h4><ul class="detail-list">${list(f.weekly)}</ul></div>
        <div class="col-md-6"><h4 class="detail-heading">Internship and entry titles to search</h4><ul class="detail-list">${list(f.entryTitles)}</ul></div>
        <div class="col-md-6"><h4 class="detail-heading">Skills to build</h4><ul class="detail-list">${skills}</ul></div>
        <div class="col-md-6"><h4 class="detail-heading">Certifications</h4>
          <p class="cert-label">Reachable now</p><ul class="detail-list">${list(f.certs.now)}</ul>
          <p class="cert-label">Later in your career</p><ul class="detail-list">${list(f.certs.later)}</ul></div>
      </div>
      <div class="facts-grid">
        <div class="fact">
          <h4 class="detail-heading">Job outlook, 2025–35</h4>
          <p class="fact-big">${esc(f.outlook.growth)}</p>
          <p class="small mb-1">${esc(f.outlook.occupation)} · median pay ${esc(f.outlook.pay)} (2025)</p>
          <a class="small" href="${f.outlook.url}" target="_blank" rel="noopener">BLS Occupational Outlook Handbook</a>
          ${aiExposure}
        </div>
        <div class="fact">
          <h4 class="detail-heading">How AI is changing it</h4>
          <p class="small mb-0">${esc(f.ai)}</p>
        </div>
      </div>
      <div class="row g-3 mt-1">
        <div class="col-md-6"><h4 class="detail-heading">Where it can lead (later)</h4><ul class="detail-list">${list(f.leadsTo)}</ul></div>
        <div class="col-md-6"><div class="starter"><h4 class="detail-heading">Try it in 1–3 weeks</h4><p class="small mb-0">${esc(f.starter)}</p></div></div>
      </div>
      <p class="small text-muted mt-3 mb-0">Technical intensity: <strong>${esc(f.intensity)}</strong>. Varies a lot by employer.</p>`;

    const header = `
      <span class="rank">${rank}</span>
      <span class="flex-grow-1"><span class="family-name">${esc(f.name)}</span></span>
      <span class="band ${bandClass(card.band)}">${esc(card.band)} match</span>`;

    if (rank === 1) {
      return `<article class="card family-card is-top mb-4"><div class="card-body p-4 p-md-5">
        <div class="family-head">${header}</div>${inner}</div></article>`;
    }
    return `<details class="card family-card mb-3"><summary class="p-4"><div class="family-head">${header}</div></summary>
      <div class="px-4 pb-4">${inner}</div></details>`;
  }

  function profileWord(score) {
    if (score >= 0.75) return "Strong pull";
    if (score >= 0.55) return "Some pull";
    if (score >= 0.35) return "Neutral";
    return "Not for you";
  }

  function showResults() {
    const result = scoreQuiz(answers, DATA);

    // Confidence and ties
    const conf = $("confidence-note");
    if (result.confidence.low) {
      conf.innerHTML = `<strong>Exploratory result.</strong> We couldn't find a clear pattern (${esc(result.confidence.reasons.join("; "))}).
        Treat these as ideas to try, not answers. Good next step: try one starter project below, or talk to MIS Society members in two different families.`;
      conf.hidden = false;
    } else {
      conf.hidden = true;
    }
    const tie = $("tie-note");
    if (result.ties.length) {
      const t = result.ties[0];
      const shared = t.shared.map((id) => DIMENSIONS.find((d) => d.id === id).name.toLowerCase());
      const forTop = t.a.id === result.cards[0].family.id;
      tie.innerHTML = `<strong>Close call:</strong> ${esc(t.a.name)} and ${esc(t.b.name)} are essentially tied ${forTop ? "for your top match" : "with each other"}.` +
        (shared.length ? ` Both draw on <em>${esc(shared.join(" and "))}</em>, so roles that mix them could fit well.` : "");
      tie.hidden = false;
    } else {
      tie.hidden = true;
    }

    // Top 3 family cards
    $("cards").innerHTML = result.cards.map((c, i) => familyCard(c, i + 1)).join("");

    // Profile bars (sorted, animated)
    const dims = result.dims.slice().sort((a, b) => b.score - a.score);
    $("profile").innerHTML = dims.map((d) => `
      <div class="profile-row">
        <div class="d-flex justify-content-between gap-2"><span class="profile-name">${esc(d.name)}</span><span class="profile-word">${profileWord(d.score)}</span></div>
        <div class="profile-track" title="${esc(d.short)}"><div class="profile-bar" data-w="${Math.round(d.score * 100)}" style="width:0%"></div></div>
      </div>`).join("");
    setTimeout(() => document.querySelectorAll(".profile-bar").forEach((b) => (b.style.width = b.dataset.w + "%")), 80);

    // All families by band
    const groups = [["Strong", "Strong match"], ["Good", "Good match"], ["Some", "Some match"], ["Low", "Less likely for you"]];
    $("all-families").innerHTML = groups.map(([band, label]) => {
      const names = result.ranked.filter((r) => r.band === band).map((r) => r.family.name);
      if (!names.length) return "";
      return `<h3 class="group-label">${label}</h3><div class="path-chips mb-3">${names.map((n) => `<span class="path-chip ${bandClass(band)}">${esc(n)}</span>`).join("")}</div>`;
    }).join("");

    // How it works
    $("method-text").innerHTML = `
      <ol class="small">
        <li>Each task rating became a number from 0 (strongly dislike) to 1 (strongly like). "Unsure" answers were skipped.</li>
        <li>Your 10 work-profile scores are the average of two ratings each, nudged up or down by your scenario picks.</li>
        <li>Each career family is defined by three kinds of work, weighted 1.0, 0.6 and 0.4. Its score is the weighted average of your profile on those three.</li>
        <li>Families within ${SETTINGS.strongGap} of your top score count as <em>Strong</em>, within ${SETTINGS.goodGap} as <em>Good</em>. We show bands instead of percentages because a short quiz can't measure fit that precisely.</li>
        <li>Work-style answers (Part C) only add "heads up" notes. They never remove a family.</li>
      </ol>
      <p class="small mb-0">Outlook figures are the U.S. Bureau of Labor Statistics' 2025–35 projections for the closest matching occupation. Certification details were checked ${esc(CONTENT_CHECKED)} and change often. This quiz is an exploration aid. It is not a validated psychological test and says nothing about ability or hiring odds.</p>`;

    // Copy text
    const lines = ["My MIS Career Fit Quiz results:"];
    result.cards.forEach((c, i) => lines.push(`${i + 1}. ${c.family.name} (${c.band} match)`));
    lines.push("", "Top kinds of work for me: " + dims.slice(0, 3).map((d) => d.name).join(", "));
    lines.push("", "Take the quiz: " + window.location.href.split("#")[0]);
    $("btn-copy").dataset.summary = lines.join("\n");
    $("copy-status").textContent = "";

    save(STORAGE_KEY, { topId: result.cards[0].family.id, date: new Date().toISOString() });
    showView("results");
  }

  async function copySummary() {
    const text = $("btn-copy").dataset.summary || "";
    try {
      await navigator.clipboard.writeText(text);
      $("copy-status").textContent = "Copied! Paste it anywhere.";
    } catch (e) {
      const box = $("copy-fallback");
      box.value = text;
      box.hidden = false;
      box.select();
      $("copy-status").textContent = "Copy didn't work here. Select the text below and copy it.";
    }
  }

  function printResults() {
    document.querySelectorAll("#cards details.family-card").forEach((card) => {
      card.open = true;
    });
    window.print();
  }

  // ---------- Events ----------
  $("btn-start").addEventListener("click", startQuiz);
  $("btn-retake").addEventListener("click", () => { renderStart(); startQuiz(); });
  $("btn-next").addEventListener("click", goNext);
  $("btn-back").addEventListener("click", goBack);
  $("btn-skip").addEventListener("click", () => { answers.experience = {}; showResults(); });
  $("btn-copy").addEventListener("click", copySummary);
  $("btn-print").addEventListener("click", printResults);

  $("step-body").addEventListener("change", (e) => {
    const t = e.target;
    if (t.name === "answer") {
      record(t.value);
    } else if (t.name && t.name.startsWith("exp-")) {
      answers.experience[t.name.slice(4)] = t.value === "yes";
    }
  });

  // Keyboard: number keys pick an option, Enter or Right goes on, Left goes back.
  document.addEventListener("keydown", (e) => {
    if (views.quiz.hidden) return;
    const step = steps[index];
    const n = Number(e.key);
    const inputs = Array.from(document.querySelectorAll('#step-body input[name="answer"]'));
    if (n >= 1 && n <= inputs.length && step.type !== "experience") {
      if (!inputs[n - 1].disabled) record(inputs[n - 1].value);
      return;
    }
    if (e.target.type === "radio" && e.key.startsWith("Arrow")) { arrowNavigating = true; return; } // arrows move between options
    if (e.key === "Enter" && e.target.tagName === "BUTTON") return; // the button handles it
    if (e.key === "Enter" || e.key === "ArrowRight") { e.preventDefault(); goNext(); }
    else if (e.key === "ArrowLeft") goBack();
  });

  $("version").textContent = QUIZ_VERSION;
  $("checked").textContent = CONTENT_CHECKED;
  renderStart();
})();
