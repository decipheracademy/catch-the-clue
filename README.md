# Catch the Clue — Skill Challenge Friday, Week 2

A detective/case-file investigation game, built distinct from last week's Pulse Protocol — new visual identity (amber/sepia case-file look, Playfair Display + Special Elite type), new structure (3 Investigations instead of 3 Zones), and new mechanics (case board elimination, typewriter witness statements, evidence stamps, point-wager finale).

## Deploy free on GitHub Pages
1. Create a new public GitHub repo.
2. Upload everything in this folder, keeping the structure: `index.html`, `verify.html`, `data.js`, `audio.js`, `fx.js`, `game.js`, `assets/images/`, `assets/audio/`.
3. Settings → Pages → Source: "Deploy from a branch" → `main` → `/ (root)`.
4. Live at `https://<your-username>.github.io/<repo-name>/`.

## Test locally first
```
cd catch-the-clue
python3 -m http.server 8000
```
Visit `http://localhost:8000`.

## What's implemented
- Full flow: Home → Agent Registration (name + session code) → Grade Select (all 12 grades individually) → Case File Briefing → 3 Investigations → Final Mystery (with point wager) → Results
- All 90 questions across 6 bands, each graded by keyword-matching rules that were dry-run tested against realistic sample answers before being wired to the UI (see "Grading accuracy" below)
- Investigation 3's elimination-style questions use a tappable case board (not free text) — matching how the document actually describes them
- Typewriter-style witness statement reveal, stamp-slam animation on evidence recovery, combo "Instinct" meter with escalating multiplier
- The shared closing Final Mystery Question, with a 0/10/25 point wager before answering — this is the one moment I added beyond the source document, to give the climax real stakes (see the design discussion in-chat for why)
- 190-point max scoring, matching the document's stated formula
- Facilitator override panel on the results screen — any auto-marked-wrong answer can be manually marked correct
- Verification code system (`verify.html`) — same pattern as Pulse Protocol's, but this time both copies of the hash function were checked byte-for-byte identical *before* shipping, specifically because a hash mismatch was the exact bug that slipped through in Pulse Protocol's first build

## Grading accuracy — what was actually tested
All keyword rules live in `data.js` (`keywords` field per question). Before wiring any of it to the UI, I ran an automated dry-run (in `gen/dry_run_grading.py`, not needed for the live game, kept here for your reference) that:
- Fed 27 realistic sample answers (phrased the way a student plausibly would, not copied verbatim from the document) through the actual grading function and confirmed all 27 pass
- Confirmed obviously-wrong answers ("banana", "the sky is blue") correctly fail — so the rules aren't so loose they accept anything
- Swept all 90 questions to confirm none have empty or broken keyword rules

This is meaningfully more testing than a first pass usually gets, but keyword grading on free-text answers will never be perfect — that's exactly why the facilitator override panel exists. Expect to use it occasionally, especially on Band 5–6's more complex reasoning questions.

## First-pass items worth a closer look before full launch
- Case board elimination checks for an *exact* match against the intended eliminate set — if a student selects a technically-also-reasonable extra destination the document didn't flag, it'll mark wrong. Worth a real playtest pass on Investigation 3 specifically.
- The point-wager mechanic and the "all investigations complete" flow haven't been tested end-to-end on a real device yet.
- Same caveat as Pulse Protocol: mobile audio autoplay and touch behavior should get a real-phone check before rollout.
- Scoring note: the combo multiplier (1.2x/1.5x on streaks) means a flawless, fast run can technically score slightly above the document's stated 190-point max. This is intentional — it rewards sustained accuracy — but flagging it since 190 is used as the reference ceiling for the S/A/B/C grade bands.
