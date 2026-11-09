# MIS Career Fit Quiz

A career exploration quiz for business and MIS students. It asks how you feel about real work tasks, builds a 10-part **work profile**, and matches it with **12 Information Systems career families**. Each match shows its 2025–35 job outlook and how AI is changing the work.

**Live app:** _add your GitHub Pages link here_

Built by Felix Gross. A version of this quiz is planned for the MIS 410 final project (MIS Society website redesign).

## What makes it different

- **Four parts, about 7 minutes.** A: rate 20 tasks (Strongly dislike to Strongly like, with Unsure). B: 6 workplace scenarios where you pick the most and least appealing option. C: work style (not scored). D: what you've tried so far (optional).
- **Match levels, not fake percentages.** Results show Strong, Good and Some matches. Near-ties are called out, and a mostly-"Unsure" quiz gets an "exploratory" result instead of false confidence.
- **Explains itself.** Each match lists the answers that led to it, any "heads up" mismatches with your work style, and a "How this quiz works" section.
- **Future-facing content.** U.S. Bureau of Labor Statistics 2025–35 projections, AI notes per family, and certifications checked in November 2026 (for example, Microsoft AB-900, which replaced MS-900).
- **Responsive and keyboard friendly.** Works on phones; number keys answer, Enter continues, Left arrow goes back.

## Files

```
index.html              Page structure: start, quiz and results screens
css/style.css           Blue-and-white styling on top of Bootstrap
js/data.js              ALL content: dimensions, questions, scenarios, career families, settings
js/scoring.js           Scoring rules (no page code, so it can be tested)
js/app.js               Page behavior: steps, answers, results page
tests/test-scoring.js   Automated checks with 15 made-up test respondents
vendor/bootstrap.min.css  Bootstrap 5.3.8 (MIT license)
```

## How scoring works

1. Each rating becomes a number from 0 (strongly dislike) to 1 (strongly like). "Unsure" is skipped.
2. Each of the 10 work-profile scores is the average of two ratings, nudged up or down by scenario picks.
3. Each career family is defined by three kinds of work, weighted 1.0, 0.6 and 0.4.
4. Families within 0.05 of the top score are *Strong*, within 0.15 are *Good*.

To change content, edit `js/data.js` only. After changing weights, run the tests.

## Run it

- **Use it:** open `index.html` in a browser. No install needed.
- **Run the tests** (needs Node.js): `node tests/test-scoring.js`. Every line should say PASS.

## Sources

- Job outlook: [BLS Occupational Outlook Handbook](https://www.bls.gov/ooh/), 2025–35 projections (released August 27, 2026)
- AI context: [BLS AI exposure categories](https://www.bls.gov/emp/publications/ai-exposure-categories.htm), [WEF Future of Jobs Report 2025](https://www.weforum.org/publications/the-future-of-jobs-report-2025/digest)
- Question format: [O*NET Interest Profiler](https://services.onetcenter.org/reference/mpp/ip/ip_questions_30) answer scale; [Smyth et al. 2006](https://digitalcommons.unl.edu/sociologyfacpub/674) on check-all vs. forced-choice questions
- Certifications: checked on official and industry pages, November 8, 2026. Re-check before each semester.

## AI use

The first version and this redesign were drafted with Claude (Anthropic). The app was then improved in VS Code with GitHub Copilot. All prompts are listed in the submission's prompt log.

This quiz is an exploration aid. It is not a validated psychological test and says nothing about ability or hiring odds.
