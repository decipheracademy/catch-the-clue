# Follow the Evidence — Skill Challenge Friday, Week 3

Direct continuation of Catch the Clue (Week 2) — Mission Log #2. A chained, three-round
investigation game: **Reconstruct the Case → Follow the Trail → Close the Case**, where
each round unlocks the next and builds on the evidence from the one before.

Visual identity: **Classified Dossier** — graphite/charcoal, off-white paper, evidence-tag
red, steel-blue "confirmed" accent. A persistent case board (pins + red string + conclusion
cards) accumulates across all three rounds instead of a plain score counter.

## Deploy free on GitHub Pages
1. Create a new public GitHub repo (suggested name: `FollowTheEvidence`).
2. Upload everything in this folder, keeping structure: `index.html`, `verify.html`,
   `data.js`, `audio.js`, `fx.js`, `game.js`, `assets/audio/bgmusic.mp3`.
3. Settings → Pages → Source: "Deploy from a branch" → `main` → `/ (root)`.
4. Live at `https://<your-username>.github.io/<repo-name>/`.

## Test locally first
```
cd follow-the-evidence
python3 -m http.server 8000
```
Visit `http://localhost:8000`.

## What's implemented
- Full flow: Home → Agent Registration → Grade Select (12 grades) → Case Briefing →
  Round 1 → Round 2 → Round 3 → Mission Complete / Results
- **Chained rounds**: Round 2 is inaccessible until Round 1 is submitted; Round 3 until
  Round 2 is submitted. Advancing happens regardless of right/wrong answers — the doc's
  "high reduction in points" for weak submissions is realized through the one-attempt
  rule below, so there's no separate skip penalty to model.
- **One attempt per question**: no retries. Wrong = −3 pts and an "UNRELIABLE" stamp,
  then auto-advance. Correct = +10 pts and a "CONFIRMED" stamp.
- **90 questions across 6 bands** (15 per band: 5 per round), matching the source doc
  exactly, including Band 1–2's simpler single-answer grading and Band 3–6's stricter
  multi-part "must state X AND Y" grading.
- **AND-logic grading engine**: each question has 1–4 keyword groups; ALL groups must
  match (each group is an OR of acceptable phrasings) — implements the "strict AND"
  approach you chose over Catch the Clue's looser OR-matching.
- **Sequencing mechanic** for Round 1, Question 1, in Bands 1–3 (tap-to-order timeline
  items) — matches the doc's literal bracketed reorder tasks. Bands 4–6 shift Round 1 Q1
  to a conflicting-source evaluation question instead, since the doc itself drops the
  literal ordering task for those bands (see "Design decisions" below).
- **Case board**: persistent visual that accumulates evidence pins + connecting red
  string through Rounds 1–2, and shows tappable-style conclusion cards in Round 3 that
  visually cross out as they're eliminated by correct answers.
- **Case Integrity meter**: drops with each wrong answer — reframes Catch the Clue's
  "Instinct" combo meter to fit this game's more serious investigative tone.
- **Case File reward stamps + transition screens** between rounds, using the doc's exact
  scripted transition lines.
- **Scoring**: +10/correct, −3/wrong, +5 per round completed (×3), +10 full mission
  bonus. Max 175 pts, matching the doc's stated ceiling.
- **One-play session lock** (localStorage, keyed by session code + agent name) — stores
  the full result (score, time, verification code, correct/wrong counts), not just a
  flag. A repeat registration with the exact same name + session code shows the saved
  result card instead of a bare error, so an agent who reloads doesn't lose their score.
  Tradeoff worth knowing (same as the verify-code system): this stops the casual case —
  disliking a score and hitting replay — but doesn't stop someone clearing browser data,
  switching browsers, or switching devices, since there's no server tracking this. A hard
  guarantee against that would need a real backend, which we set aside earlier for
  cost/complexity reasons.
- **Verification code system** (`verify.html`) — byte-identical hash function to
  `game.js`'s copy, same safeguard pattern as the last two games.
- **Facilitator override panel** on the results screen — any auto-marked-wrong answer
  can be manually marked correct, with the score adjustment applied live.
- Fully responsive (tested at 390px mobile and 1440px desktop viewports), no avatars,
  all visuals built in SVG/CSS — no image assets required.

## Design decisions worth knowing about
- **Grading strictness**: keyword groups for Bands 3–6 were hand-derived from the doc's
  "Accept Any Answer That Includes" column, aiming for reasonably generous synonym lists
  within each required group. Given free-text grading is inherently imperfect, expect
  the facilitator override panel to see real use — especially on Band 5–6's longer
  synthesis questions (Round 3, Q5 in every band 3+ requires 3–4 distinct elements).
- **Round 2's "match evidence to location" sub-questions** (e.g., Band 3 R2 Q3) are
  implemented as a single free-text answer covering all matches, graded by checking each
  location name appears — not as a drag-and-drop matching UI. Flagged here since it's a
  simplification from how a facilitator might picture "matching."
- **Round 1 Q1 mechanic differs by band on purpose**: Bands 1–3 get the interactive
  tap-to-order sequencing UI (matches the doc's literal bracketed lists). Bands 4–6 don't
  have a bracketed list in the source doc for Q1 — their Round 1 opens with a
  conflicting-source evaluation question instead — so those bands use free text there too.
- **Band 6's Round 3** intentionally has no single "correct" narrative arc — Conclusion E
  ("cannot be definitively closed") is the strongest answer per the doc's own facilitator
  note, and the game's grading reflects that without forcing a false sense of closure.

## First-pass items worth a closer look before full launch
- Real-device audio autoplay/touch check, same caveat as the last two games.
- The case board's evidence-pin layout scales with question count but hasn't been
  stress-tested visually beyond 15 pins per round — worth a look at very small screens.
- Keyword grading, as always, will need a facilitator's eye — it's a first pass, not a
  final-tuned rubric.
