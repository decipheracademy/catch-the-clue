// ============ FOLLOW THE EVIDENCE — DATA ============
// Skill Challenge Friday, Week 3. Mission Log #2. 6 grade bands, 3 chained rounds
// per band (Reconstruct -> Follow the Trail -> Close the Case), 5 questions per round.

const GRADES = [
  { label: "Grade 1", bandIdx: 0 }, { label: "Grade 2", bandIdx: 0 },
  { label: "Grade 3", bandIdx: 1 }, { label: "Grade 4", bandIdx: 1 },
  { label: "Grade 5", bandIdx: 2 }, { label: "Grade 6", bandIdx: 2 },
  { label: "Grade 7", bandIdx: 3 }, { label: "Grade 8", bandIdx: 3 },
  { label: "Grade 9", bandIdx: 4 }, { label: "Grade 10", bandIdx: 4 },
  { label: "Grade 11", bandIdx: 5 }, { label: "Grade 12", bandIdx: 5 }
];

// Grading: each question has `groups` — an array of keyword-groups.
// A group is satisfied if ANY phrase in it appears in the answer (OR).
// ALL groups must be satisfied for the answer to be marked correct (AND).
// Bands 1-2 use a single lenient group. Bands 3-6 use 2-4 strict AND groups,
// mirroring the doc's "must include X AND Y" grading language.

const BANDS = [

// ============================================================
// BAND 1 — Grades 1 & 2 — Biscuit the Missing Puppy
// ============================================================
{
  id: 0, gradeLabel: "Band 1 (Grades 1–2)", caseTitle: "The Case of Biscuit's Night Out",
  intro: "The investigation file contains a short diary from a missing puppy named Biscuit. The pages are all mixed up.",
  rounds: [
    {
      key: "r1", title: "Reconstruct the Case", reward: "Case File A — Timeline Recovered",
      brief: "Biscuit's diary has four mixed-up pages. Help put them back in order.",
      sequence: {
        prompt: "Arrange Biscuit's day in order:",
        items: [
          { id: "morning", label: "Morning — Biscuit eats breakfast" },
          { id: "afternoon", label: "Afternoon — Biscuit plays in the garden" },
          { id: "evening", label: "Evening — Biscuit sleeps by the fire" },
          { id: "night", label: "Night — Biscuit hears a strange noise" }
        ],
        correctOrder: ["morning", "afternoon", "evening", "night"]
      },
      questions: [
        { id: "q2", q: "Which entry tells us where Biscuit was last seen awake?", groups: [["night", "strange noise", "heard a"]] },
        { id: "q3", q: "The Morning page is torn. What do we know happened just AFTER the morning entry?", groups: [["garden", "afternoon", "play"]] },
        { id: "q4", q: "A photo shows Biscuit near the garden gate. Which diary entry does this match?", groups: [["afternoon", "garden"]] },
        { id: "q5", q: "Based on the diary order, when did things start to feel unusual for Biscuit?", groups: [["night", "strange", "noise"]] }
      ]
    },
    {
      key: "r2", title: "Follow the Trail", reward: "Case File B — Evidence Trail Recovered",
      brief: "Using the diary timeline, follow the evidence found near each location Biscuit visited.",
      questions: [
        { id: "q1", q: "A paw print is found near the garden gate. Which diary entry does this match?", groups: [["afternoon", "garden"]] },
        { id: "q2", q: "A chewed toy is found near the fireside. Which time of day does this match?", groups: [["evening", "fire"]] },
        { id: "q3", q: "A muddy trail leads from the garden to the back door. What does this tell us?", groups: [["inside", "came in", "connect", "afternoon to evening", "garden to"]] },
        { id: "q4", q: "A leash by the front door does NOT match any diary entry. Why might it be irrelevant?", groups: [["walk", "not mention", "doesn't match", "no walk", "leash"]] },
        { id: "q5", q: "Which location should investigators look at most carefully, and why?", groups: [["garden gate", "paw print", "muddy trail", "garden"]] }
      ]
    },
    {
      key: "r3", title: "Close the Case", reward: "Case File C — Investigation Closed",
      brief: "You have Biscuit's diary timeline and the evidence trail. Where did Biscuit go?",
      conclusions: [
        { id: "A", label: "Behind the sofa" },
        { id: "B", label: "Through the garden gate" },
        { id: "C", label: "Under the bed" }
      ],
      questions: [
        { id: "q1", q: "The paw prints lead to the garden gate. Does this match A, B, or C?", groups: [["b", "garden gate"]], eliminates: [] },
        { id: "q2", q: "Biscuit heard a strange noise at Night. Does this make the garden gate more or less likely?", groups: [["more likely", "outside", "drew", "attracted"]], eliminates: [] },
        { id: "q3", q: "No evidence was found near the sofa or under the bed. What does this tell us about A and C?", groups: [["eliminate", "no evidence", "ruled out"]], eliminates: ["A", "C"] },
        { id: "q4", q: "Using the timeline and evidence trail, which destination is supported by all the evidence?", groups: [["b", "garden gate"]], eliminates: [] },
        { id: "q5", q: "Write one sentence explaining how the evidence led you to this conclusion.", groups: [["paw print", "muddy trail", "noise", "garden gate"]], eliminates: [] }
      ]
    }
  ]
},

// ============================================================
// BAND 2 — Grades 3 & 4 — The Missing School Trophy
// ============================================================
{
  id: 1, gradeLabel: "Band 2 (Grades 3–4)", caseTitle: "The Case of the Missing Trophy",
  intro: "An investigation file about a missing school trophy has been found in the library. The report pages are out of order.",
  rounds: [
    {
      key: "r1", title: "Reconstruct the Case", reward: "Case File A — Timeline Recovered",
      brief: "Reconstruct the timeline of the trophy's disappearance.",
      sequence: {
        prompt: "Arrange these events in chronological order:",
        items: [
          { id: "a900", label: "9:00 AM — Trophy confirmed present at morning assembly" },
          { id: "b100", label: "1:00 PM — Display case left unlocked during lunch" },
          { id: "c330", label: "3:30 PM — Trophy seen in display case by cleaner" },
          { id: "d415", label: "4:15 PM — Caretaker notices display case open" },
          { id: "e500", label: "5:00 PM — Trophy reported missing by sports teacher" }
        ],
        correctOrder: ["a900", "b100", "c330", "d415", "e500"]
      },
      questions: [
        { id: "q2", q: "Which event created the opportunity for the trophy to go missing?", groups: [["1:00", "lunch", "unlocked"]] },
        { id: "q3", q: "What is the smallest possible time window during which the trophy disappeared?", groups: [["3:30"], ["4:15"]] },
        { id: "q4", q: "The teacher reported it missing at 5:00 PM. Does this mean it disappeared at 5:00 PM? Explain.", groups: [["no"], ["3:30", "4:15", "noticed"]] },
        { id: "q5", q: "Which two consecutive events are most important for the investigation and why?", groups: [["3:30"], ["4:15"]] }
      ]
    },
    {
      key: "r2", title: "Follow the Trail", reward: "Case File B — Evidence Trail Recovered",
      brief: "Using the 3:30–4:15 PM window, follow the evidence trail through the school.",
      questions: [
        { id: "q1", q: "A fingerprint is found on the display case glass. Does this confirm the trophy was taken, or just touched?", groups: [["touch", "only touched", "contact"]] },
        { id: "q2", q: "CCTV shows a person near the display case at 3:45 PM. Is this within the critical window?", groups: [["yes"], ["3:45"]] },
        { id: "q3", q: "A muddy shoe print leads from the display case toward the sports room. What does this suggest about direction?", groups: [["sports room", "toward", "moved"]] },
        { id: "q4", q: "A lunchbox is found near the display case. Is this relevant to the investigation? Why or why not?", groups: [["irrelevant", "not relevant", "any student", "unrelated"]] },
        { id: "q5", q: "Based on the trail so far, which location should investigators focus on next?", groups: [["sports room"]] }
      ]
    },
    {
      key: "r3", title: "Close the Case", reward: "Case File C — Investigation Closed",
      brief: "You have the critical window (3:30–4:15 PM) and the trail (display case → sports room). Close the case.",
      conclusions: [
        { id: "A", label: "A student hid the trophy in the sports room" },
        { id: "B", label: "The trophy fell behind the display case" },
        { id: "C", label: "The trophy was taken out of the building" }
      ],
      questions: [
        { id: "q1", q: "The shoe print trail ends at the sports room door. Does this support A, B, or C?", groups: [["a", "sports room"]], eliminates: [] },
        { id: "q2", q: "No evidence was found near the back of the display case. Does this eliminate B?", groups: [["yes"], ["eliminate", "b"]], eliminates: ["B"] },
        { id: "q3", q: "CCTV near the front exit shows no one carrying a large trophy-shaped object. Does this eliminate C?", groups: [["yes"], ["eliminate", "c"]], eliminates: ["C"] },
        { id: "q4", q: "Which conclusion is supported by both the timeline and the evidence trail?", groups: [["a", "sports room"]], eliminates: [] },
        { id: "q5", q: "Write two sentences closing the case using the evidence.", groups: [["sports room"]], eliminates: [] }
      ]
    }
  ]
},

// ============================================================
// BAND 3 — Grades 5 & 6 — The Locked Room
// ============================================================
{
  id: 2, gradeLabel: "Band 3 (Grades 5–6)", caseTitle: "The Case of the Locked Room",
  intro: "Five diary entries, two photographs, and a handwritten note — all about a locked room that was found open one morning.",
  rounds: [
    {
      key: "r1", title: "Reconstruct the Case", reward: "Case File A — Timeline Recovered",
      brief: "Reconstruct the chronological order of the five diary entries.",
      sequence: {
        prompt: "Arrange these entries in chronological order:",
        items: [
          { id: "A", label: "Diary A — Monday 9:00 AM: The room was locked as normal" },
          { id: "C", label: "Diary C — Monday 6:00 PM: I locked the room personally and tested the handle" },
          { id: "E", label: "Diary E — Monday 11:30 PM: I heard footsteps near the room" },
          { id: "D", label: "Diary D — Tuesday 6:45 AM: I passed the room — the door looked different" },
          { id: "B", label: "Diary B — Tuesday 8:00 AM: The room was open when I arrived" }
        ],
        correctOrder: ["A", "C", "E", "D", "B"]
      },
      questions: [
        { id: "q2", q: "Who was the last person to confirm the room was locked?", groups: [["diary c", "c"], ["6:00", "6 pm", "handle", "tested"]] },
        { id: "q3", q: "What is the earliest the door could have been opened, based on the timeline?", groups: [["11:30"], ["6:45"]] },
        { id: "q4", q: "The undated note says 'I heard the key turn twice.' Where does it most logically fit in the timeline?", groups: [["diary c", "6:00", "6 pm"], ["handle", "test", "key"]] },
        { id: "q5", q: "Photo 1 shows the light on; Photo 2 shows it off with the door ajar. Which was taken first?", groups: [["photo 1", "photograph 1", "first"], ["normal", "before", "earlier", "in use"]] }
      ]
    },
    {
      key: "r2", title: "Follow the Trail", reward: "Case File B — Evidence Trail Recovered",
      brief: "Using the confirmed critical window (Mon 11:30 PM – Tue 6:45 AM), follow the evidence trail through the building.",
      questions: [
        { id: "q1", q: "A displaced floor mat is found outside the locked room. What does this suggest about night-time foot traffic?", groups: [["movement", "foot traffic", "passed through", "someone passed"], ["night", "critical window", "unusual"]] },
        { id: "q2", q: "Diary E mentions footsteps. Could they have come from the squeaky staircase? What would confirm this?", groups: [["possible", "maybe", "inconclusive", "could be"], ["recording", "witness", "footprint", "confirm"]] },
        { id: "q3", q: "Match each piece of evidence to a location: displaced mat, unlocked door, footstep sound.", groups: [["corridor"], ["locked room", "room"], ["staircase", "corridor"]] },
        { id: "q4", q: "A coffee cup is found in the storage room. Is this relevant to the investigation? Justify your answer.", groups: [["not relevant", "probably not", "no connect", "unconnected"], ["storage room", "no entry", "overnight", "timeline"]] },
        { id: "q5", q: "Based on all evidence locations, reconstruct the most likely route taken during the critical window.", groups: [["staircase"], ["room", "locked room"]] }
      ]
    },
    {
      key: "r3", title: "Close the Case", reward: "Case File C — Investigation Closed",
      brief: "You have the timeline and the evidence trail (Staircase → Corridor → Locked Room). Close the case.",
      conclusions: [
        { id: "A", label: "The room was never properly locked" },
        { id: "B", label: "Someone with access entered during the night" },
        { id: "C", label: "The door opened by itself due to a faulty lock" },
        { id: "D", label: "Someone entered through a window" }
      ],
      questions: [
        { id: "q1", q: "Diary C confirms the room was locked and the handle was tested. Does this eliminate A?", groups: [["yes"], ["diary c", "handle"]], eliminates: ["A"] },
        { id: "q2", q: "No window disturbance was recorded anywhere. Does this eliminate D?", groups: [["yes"], ["window", "no evidence", "no disturbance"]], eliminates: ["D"] },
        { id: "q3", q: "A faulty lock would not explain the mat or the footsteps. Does this eliminate C?", groups: [["yes"], ["mat", "footstep"]], eliminates: ["C"] },
        { id: "q4", q: "Which conclusion is now the only one supported by all available evidence?", groups: [["b", "access", "internal"]], eliminates: [] },
        { id: "q5", q: "Write a short investigator's report (3–4 sentences) summarising the findings and justifying the conclusion.", groups: [["locked", "6:00", "6 pm"], ["mat", "footstep", "movement"], ["11:30", "6:45", "critical window", "overnight"], ["b", "internal access", "access"]] }
      ]
    }
  ]
},

// ============================================================
// BAND 4 — Grades 7 & 8 — The Research Centre Power Cut
// ============================================================
{
  id: 3, gradeLabel: "Band 4 (Grades 7–8)", caseTitle: "The Case of the Research Centre Power Cut",
  intro: "Six witness reports about an incident at a research centre — filed at different times, with overlapping and conflicting information.",
  rounds: [
    {
      key: "r1", title: "Reconstruct the Case", reward: "Case File A — Partial Timeline Recovered",
      brief: "Six conflicting reports. Reconstruct the most defensible timeline you can.",
      questions: [
        { id: "q1", q: "Three reports give different times for the same power cut: A says 7:15 PM, B says 7:20 PM, C says 7:12 PM. Which is most likely accurate, and why?", groups: [["7:12", "7:15", "7:20"], ["earliest", "estimate", "after the fact", "conservative"]] },
        { id: "q2", q: "Report D says the door was locked at 7:30 PM. Report F says it was open at 7:35 PM. How do you resolve this contradiction?", groups: [["contradiction", "conflict", "disagree"], ["cctv", "log", "witness", "corrobor", "confirm"]] },
        { id: "q3", q: "Report E has a correction — 8:00 PM crossed out, replaced with 7:45 PM. Does this make it more or less reliable? Why?", groups: [["less reliable", "less trustworthy"], ["tamper", "accuracy", "compare", "question"]] },
        { id: "q4", q: "Using only reports you can verify, construct a partial timeline of the most confidently confirmed events.", groups: [["7:12"], ["7:20", "7:30", "7:45"], ["uncertain", "caveat", "unclear", "unresolved"]] },
        { id: "q5", q: "What is the single most important question an investigator should ask to resolve the timeline?", groups: [["log", "cctv", "record", "electronic"], ["objective", "independent", "not rely on memory"]] }
      ]
    },
    {
      key: "r2", title: "Follow the Trail", reward: "Case File B — Evidence Trail Recovered",
      brief: "Using the partial timeline, follow the evidence across the Main Lab, Server Room, and Emergency Exit.",
      questions: [
        { id: "q1", q: "A keycard scan at the Server Room door reads 7:18 PM. Is this within the timeline window? What does it suggest?", groups: [["yes"], ["7:18"], ["power cut", "cover", "after"]] },
        { id: "q2", q: "A second scan at the Emergency Exit shows 7:22 PM. If the same person made both scans, how long were they inside?", groups: [["4 minute", "4 min"]] },
        { id: "q3", q: "The Server Room requires two-person authorisation but only one scan was recorded. What does this inconsistency suggest?", groups: [["bypass", "protocol", "second person", "not recorded"]] },
        { id: "q4", q: "A chair pulled away, a screen left on, a half-drunk coffee — what does this suggest about how the occupant left?", groups: [["hurry", "unexpected", "suddenly", "abrupt"], ["chair", "coffee", "screen"]] },
        { id: "q5", q: "Trace the most likely movement: where did they start, where did they go, how did they leave?", groups: [["server room"], ["emergency exit", "exit"]] }
      ]
    },
    {
      key: "r3", title: "Close the Case", reward: "Case File C — Investigation Closed",
      brief: "You have the partial timeline and the movement trail (Server Room → Emergency Exit in 4 minutes). Close the case.",
      conclusions: [
        { id: "A", label: "Accidental access during power cut confusion" },
        { id: "B", label: "A planned, deliberate entry using the power cut as cover" },
        { id: "C", label: "Authorised access that was incorrectly flagged" },
        { id: "D", label: "A system error that created false scan records" }
      ],
      questions: [
        { id: "q1", q: "The scan happened six minutes after the power cut. Is this consistent with confusion, or something more deliberate?", groups: [["deliberate", "planned", "intentional"], ["6 minute", "waited"]], eliminates: [] },
        { id: "q2", q: "The two-person protocol was bypassed. Does accidental access (A) explain a protocol bypass?", groups: [["no"], ["eliminate", "a"]], eliminates: ["A"] },
        { id: "q3", q: "If access were authorised (C), a matching authorisation record would exist. None does. Does this eliminate C?", groups: [["yes"], ["eliminate", "c"]], eliminates: ["C"] },
        { id: "q4", q: "System errors (D) usually create multiple anomalies. Only one scan is anomalous. Does this eliminate D?", groups: [["yes"], ["eliminate", "d"]], eliminates: ["D"] },
        { id: "q5", q: "Write a structured report (4–5 sentences) identifying and justifying the most supported conclusion.", groups: [["7:12", "7:18", "7:22"], ["server room", "emergency exit"], ["protocol", "authorisation", "two-person"], ["b", "deliberate", "planned"]] }
      ]
    }
  ]
},

// ============================================================
// BAND 5 — Grades 9 & 10 — The Government Archive
// ============================================================
{
  id: 4, gradeLabel: "Band 5 (Grades 9–10)", caseTitle: "The Case of the Vanished Records",
  intro: "Seven documents — internal reports, testimonies, a redacted memo, and a CCTV log with a 20-minute gap. Confidential records have disappeared.",
  rounds: [
    {
      key: "r1", title: "Reconstruct the Case", reward: "Case File A — Partial Timeline Recovered",
      brief: "Seven documents, no master clock, and a CCTV gap. Build the most defensible timeline you can.",
      questions: [
        { id: "q1", q: "Three internal reports give different times for the same event (11:35 / 11:42 / 11:50 PM). Propose a method for determining which is most accurate.", groups: [["cctv", "log", "electronic", "independent"], ["cross-reference", "triangulat", "compare"]] },
        { id: "q2", q: "A redacted memo references '[REDACTED] PM' and 'the person responsible for [REDACTED].' What can be legitimately inferred?", groups: [["event", "documented", "known"], ["person", "identified", "responsible"]] },
        { id: "q3", q: "The CCTV gap runs 11:40 PM–12:00 AM; the disappearance was reported at 12:15 AM. What does the gap tell us?", groups: [["critical", "most important period", "unavailable"], ["deliberate", "coincidental", "coincidence", "investigated"]] },
        { id: "q4", q: "Two testimonies directly contradict each other. Construct a method for evaluating which is more credible.", groups: [["corrobor", "access log", "keycard", "third witness"], ["motive", "benefit", "position", "consistency"]] },
        { id: "q5", q: "Using only elements confirmed by more than one source, construct the most defensible partial timeline.", groups: [["11:35", "11:50"], ["12:15"], ["uncertain", "gap", "overlap", "approximate"]] }
      ]
    },
    {
      key: "r2", title: "Follow the Trail", reward: "Case File B — Evidence Trail Recovered",
      brief: "Using the partial timeline and the CCTV gap, follow the trail through three floors of the archive.",
      questions: [
        { id: "q1", q: "Floor 2 was entered at 11:38 PM using Credential Set X. Floor 3 has no matching log. What are the two most likely explanations?", groups: [["disabled", "bypass", "not logging", "engineered"], ["route", "different route", "log-free", "bypass the standard"]] },
        { id: "q2", q: "The missing records were on Floor 3, which has no access log. Does this mean no one entered? Evaluate this reasoning.", groups: [["absence", "does not mean", "does not prove", "no proof"], ["delete", "bypass", "compromise", "disabled"]] },
        { id: "q3", q: "A fire door between Floors 2 and 3 was found propped open, with no electronic log. What does this add to the trail?", groups: [["log-free", "no log", "bypass"], ["deliberate", "intentional", "suggests"]] },
        { id: "q4", q: "Floor 1 shows a moved chair, an unlogged session, and a visitor sign-in at 11:20 PM. Is this relevant to the Floor 3 disappearance?", groups: [["possibly", "relevant", "could be"], ["11:20", "window", "starting point"]] },
        { id: "q5", q: "Construct the most evidence-supported route from arrival to the removal of the records.", groups: [["11:20"], ["11:38"], ["fire door", "floor 3", "12:15"]] }
      ]
    },
    {
      key: "r3", title: "Close the Case", reward: "Case File C — Investigation Closed",
      brief: "You have the partial timeline and the full movement trail (Floor 1 → Floor 2 → Fire Door → Floor 3). Close the case.",
      conclusions: [
        { id: "A", label: "An external intruder bypassed security" },
        { id: "B", label: "An internal actor with partial credentials used a log-free route" },
        { id: "C", label: "The records were misplaced rather than removed" },
        { id: "D", label: "The CCTV gap and fire door were unrelated coincidences" },
        { id: "E", label: "Multiple people were involved in a coordinated operation" }
      ],
      questions: [
        { id: "q1", q: "The 11:38 PM entry used a legitimate internal credential. Does this support or eliminate an external intruder (A)?", groups: [["eliminate", "eliminates", "rules out"], ["internal", "legitimate", "credential"]], eliminates: ["A"] },
        { id: "q2", q: "The records required specialist knowledge to locate quickly. Does this support B or E more strongly?", groups: [["b", "internal actor", "e", "coordinated"], ["knowledge", "insider", "location", "speed"]], eliminates: [] },
        { id: "q3", q: "No search, misplacement report, or relocation order exists. Does this eliminate C?", groups: [["yes"], ["eliminate", "c"], ["protocol", "paper trail", "documentation"]], eliminates: ["C"] },
        { id: "q4", q: "The CCTV gap, propped door, and credential use all occurred in the same 40-minute window. What is the most defensible position on D?", groups: [["unlikely", "not credible", "eliminate", "d"], ["coincidence", "cluster", "simultaneous"]], eliminates: ["D"] },
        { id: "q5", q: "Write a full investigator's summary (5–6 sentences): most supported conclusion, remaining uncertainty, and next step.", groups: [["b", "internal actor", "e", "coordinated"], ["uncertain", "unconfirmed", "possible"], ["credential", "fire door", "cctv gap", "11:38"], ["next step", "recommend", "identify"]] }
      ]
    }
  ]
},

// ============================================================
// BAND 6 — Grades 11 & 12 — The Cold Case Review
// ============================================================
{
  id: 5, gradeLabel: "Band 6 (Grades 11–12)", caseTitle: "The Cold Case Review",
  intro: "A review board examines whether an investigation closed 15 years ago reached the correct conclusion — the original report, three dissenting memos, a review summary, and an anonymous whistleblower letter.",
  rounds: [
    {
      key: "r1", title: "Reconstruct the Case", reward: "Case File A — Timeline Recovered (with caveats)",
      brief: "Investigating an investigation. Reconstruct the most defensible account of what actually happened.",
      questions: [
        { id: "q1", q: "The original report concluded 'no further action necessary.' Three separate memos dissented. What does this tell us?", groups: [["contested", "disagreement", "not unanimous"], ["overridden", "why", "override", "question"]] },
        { id: "q2", q: "The review board says 'correct procedure was followed.' A memo says 'procedure was followed but evidence was excluded first.' Analyse the relationship.", groups: [["both", "simultaneously", "not contradictory"], ["procedural", "evidential", "structural flaw"]] },
        { id: "q3", q: "An anonymous whistleblower letter names an individual who authorised the exclusion. Evaluate its reliability.", groups: [["unverifiable", "cannot be verified", "anonymous", "cross-examine"], ["value", "checkable", "specific", "direction"]] },
        { id: "q4", q: "Reconstruct the most defensible timeline, accounting for events that may be undocumented or deliberately obscured.", groups: [["event occurred", "evidence collected", "procedure"], ["undocumented", "obscured", "gap", "uncertain"]] },
        { id: "q5", q: "At what point was the original investigation most vulnerable to a flawed conclusion? Justify your answer.", groups: [["evidence selection", "pre-procedure", "before procedure", "earliest stage"], ["highest risk", "no amount of procedural", "vulnerable"]] }
      ]
    },
    {
      key: "r2", title: "Follow the Trail", reward: "Case File B — Evidence Trail Recovered",
      brief: "Working backward from the conclusion to the source, using the reconstructed timeline and the identified vulnerability.",
      questions: [
        { id: "q1", q: "What evidence would have been necessary to support 'no further action' — and what would have undermined it?", groups: [["support", "no wrongdoing", "no risk"], ["undermine", "concealment", "dissent", "excluded", "anomaly"]] },
        { id: "q2", q: "Three memos challenge completeness, interpretation, and witness qualification. Rank these by their power to overturn the conclusion.", groups: [["completeness"], ["interpretation"], ["witness", "qualification"]] },
        { id: "q3", q: "A financial record is referenced in a memo but excluded from the final report. What is the significance of a referenced-but-excluded piece of evidence?", groups: [["referenced", "known", "excluded"], ["deliberate", "selective", "intentional"]] },
        { id: "q4", q: "The review board had access to the dissenting memos and still endorsed the original conclusion. Does this strengthen or weaken confidence in the board?", groups: [["weaken"], ["incompetent", "complicit", "scrutiny"]] },
        { id: "q5", q: "Synthesise the evidence trail into a single statement on the relationship between the conclusion and the evidence.", groups: [["filtered", "selective evidence base"], ["procedural", "evidential", "survives"], ["fragil", "whistleblower", "unresolved"]] }
      ]
    },
    {
      key: "r3", title: "Close the Case", reward: "Case File C — Investigation Status: Formally Inconclusive",
      brief: "You have the reconstructed timeline and the inverted evidence trail. Close the case — or determine whether it can be closed at all.",
      conclusions: [
        { id: "A", label: "The original conclusion was correct; the dissent was unfounded" },
        { id: "B", label: "The conclusion was reached in good faith on incomplete evidence" },
        { id: "C", label: "The conclusion was deliberately shaped to reach a predetermined outcome" },
        { id: "D", label: "The investigation was structurally flawed but not malicious" },
        { id: "E", label: "The case cannot be definitively closed without the excluded record" }
      ],
      questions: [
        { id: "q1", q: "If the original conclusion (A) were clearly correct, what would we expect to find? What do we actually find?", groups: [["expect", "would expect"], ["weaken", "eliminat"]], eliminates: ["A"] },
        { id: "q2", q: "Conclusion B requires the exclusion was accidental. But the record was explicitly referenced elsewhere. Can B survive this fact?", groups: [["b"], ["weaken", "eliminat", "stretch", "barely"]], eliminates: [] },
        { id: "q3", q: "C and D differ on intent. What single piece of evidence would most clearly distinguish between them?", groups: [["intent", "deliberate"], ["whistleblower", "authoris"]], eliminates: [] },
        { id: "q4", q: "Is E a conclusion or an admission of investigative limitation? Is there value in formally recording an inconclusive finding?", groups: [["both", "conclusion and admission"], ["value", "protect", "reopen", "official"]], eliminates: [] },
        { id: "q5", q: "Write a full closing report (6–8 sentences): most defensible conclusion, what remains unresolved, next steps, and a reflection on the limits of investigative work.", groups: [["e", "inconclusive", "cannot be definitively closed"], ["unresolved", "unaddressed", "not resolve"], ["locate", "identify", "protected channel", "next step"], ["integrity", "appearance of justice", "reliable", "limits"]] }
      ]
    }
  ]
}

];

const MISSION_INTRO = "Last week, you successfully completed Catch the Clue and discovered the hidden destination — the Library. But stepping into the Library only uncovered a much bigger mystery. Hidden among the shelves was an old investigation file — filled with scattered reports, misplaced photographs, missing pages, handwritten notes, maps, and pieces of evidence from a case that was never solved. Your mission this week is to follow the evidence, connect every piece together, and uncover what the investigation file is trying to reveal. Every correct decision moves you closer to the truth. Every mistake leads you further away. Your investigation begins now.";

const TRANSITION_LINES = {
  afterR1: "Timeline Restored. Case File A secured. The sequence of events is now confirmed — move to Round 2. The evidence is waiting.",
  afterR2: "Trail Confirmed. Case File B secured. You know where the evidence leads. Now it is time to close this case. Round 3 is now active.",
  afterR3: "Case File recovered. Investigation Closed. Mission Complete."
};

const ENCOURAGEMENT_LINES = [
  "Use what you already know — the timeline you built in Round 1 is your most powerful tool right now.",
  "A good investigator does not guess. Every answer should point to at least one piece of evidence.",
  "If something does not fit the timeline, that is exactly what you should be noting.",
  "You are building a case — not answering questions. Think like an investigator."
];

const MISSION_COMPLETE_TEXT = "You followed the evidence. You reconstructed what others left scattered. You traced every footprint, every timestamp, every clue — and you built a case from nothing. That is not something everyone can do. The investigation file has been closed — for now. But a good investigator knows that a closed case is not always a finished one. The evidence tells you when to stop. Not the clock. Not the deadline. Until the next file opens — stay sharp, Agent.";
