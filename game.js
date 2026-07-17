// ============ FOLLOW THE EVIDENCE — GAME LOGIC ============

const Game = (() => {
  const app = () => document.getElementById("app");

  let state = {
    screen: "home",
    playerName: "",
    sessionCode: "",
    gradeLabel: "",
    bandIdx: 0,
    roundIdx: 0,          // 0,1,2
    flatQuestions: [],    // current round's flattened question list
    qIdx: 0,
    score: 0,
    integrity: 100,
    correctCount: 0,
    wrongCount: 0,
    answerLog: [],        // {round, qText, userAnswer, correct, points, overridden}
    board: { pins: [], strings: [], stampCount: 0 },
    conclusions: [],       // current round-3 conclusion cards with .eliminated flag
    startTime: null,
    roundLocked: [false, true, true], // round 2,3 locked until previous submitted
    sequenceArranged: [],
    sequencePool: []
  };

  function fmtTime(sec) {
    const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function elapsedSec() {
    return state.startTime ? (Date.now() - state.startTime) / 1000 : 0;
  }

  // ---------- Grading ----------
  function gradeFreeText(answer, groups) {
    const a = (answer || "").trim().toLowerCase();
    if (!a) return false;
    return groups.every(group => group.some(phrase => a.includes(phrase.toLowerCase())));
  }

  function gradeSequence(arranged, correctOrder) {
    if (arranged.length !== correctOrder.length) return false;
    return arranged.every((id, i) => id === correctOrder[i]);
  }

  // ---------- Verification hash (same djb2-style pattern as prior games) ----------
  function fteVerifyCode(sessionCode, name, gradeLabel, score, timeSec) {
    const str = `${sessionCode.trim().toUpperCase()}|${name.trim().toUpperCase()}|${gradeLabel.trim().toUpperCase()}|${Math.round(score)}|${Math.round(timeSec)}`;
    let hash = 5381;
    for (let i = 0; i < str.length; i++) hash = ((hash * 33) ^ str.charCodeAt(i)) >>> 0;
    const code = hash.toString(36).toUpperCase().padStart(6, "0").slice(-6);
    return code.slice(0, 3) + "-" + code.slice(3, 6);
  }

  // ---------- Round setup ----------
  function buildFlatQuestions(round) {
    const list = [];
    if (round.sequence) {
      list.push({ type: "sequence", ...round.sequence });
    }
    round.questions.forEach(q => list.push({ type: "freetext", ...q }));
    return list;
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function startRound(idx) {
    state.roundIdx = idx;
    state.qIdx = 0;
    const round = BANDS[state.bandIdx].rounds[idx];
    state.flatQuestions = buildFlatQuestions(round);
    if (idx === 2) {
      state.conclusions = round.conclusions.map(c => ({ ...c, eliminated: false }));
    }
    if (round.sequence) {
      state.sequencePool = shuffle(round.sequence.items.map(it => it.id));
      state.sequenceArranged = [];
    }
    state.screen = "round";
    render();
    FTEAudio.pageShuffle();
  }

  // ---------- Answer handling ----------
  function submitSequence() {
    const round = BANDS[state.bandIdx].rounds[state.roundIdx];
    const correct = gradeSequence(state.sequenceArranged, round.sequence.correctOrder);
    resolveAnswer(correct, "Sequence: " + round.sequence.prompt, state.sequenceArranged.join(" → "), null);
  }

  function submitFreeText() {
    const q = state.flatQuestions[state.qIdx];
    const input = document.getElementById("answerInput");
    const val = input ? input.value : "";
    const correct = gradeFreeText(val, q.groups);
    resolveAnswer(correct, q.q, val, q.eliminates);
  }

  function resolveAnswer(correct, qText, userAnswer, eliminates) {
    let points = 0;
    if (correct) {
      points = 10;
      state.score += 10;
      state.correctCount++;
      FTEAudio.correct();
      if (eliminates && eliminates.length) {
        eliminates.forEach(cid => {
          const c = state.conclusions.find(x => x.id === cid);
          if (c) c.eliminated = true;
        });
        FTEAudio.conclusionEliminated();
      }
      pushBoardEvidence();
    } else {
      points = -3;
      state.score = Math.max(0, state.score - 3);
      state.wrongCount++;
      state.integrity = Math.max(0, state.integrity - 15);
      FTEAudio.wrong();
      FTEAudio.integrityDrop();
    }
    state.answerLog.push({
      round: BANDS[state.bandIdx].rounds[state.roundIdx].title,
      qText, userAnswer, correct, points, overridden: false
    });
    showFeedback(correct, qText);
  }

  function pushBoardEvidence() {
    const n = state.board.pins.length;
    state.board.pins.push({ id: n });
    if (n > 0) state.board.strings.push([n - 1, n]);
  }

  function showFeedback(correct, qText) {
    state.screen = "feedback";
    state.lastCorrect = correct;
    render();
  }

  function nextQuestion() {
    state.qIdx++;
    if (state.qIdx >= state.flatQuestions.length) {
      finishRound();
    } else {
      state.screen = "round";
      render();
    }
  }

  function finishRound() {
    state.score += 5; // round completion bonus
    FTEAudio.caseFileSecured();
    state.board.stampCount++;
    if (state.roundIdx < 2) {
      state.roundLocked[state.roundIdx + 1] = false;
    }
    state.screen = "transition";
    render();
  }

  function continueAfterTransition() {
    if (state.roundIdx < 2) {
      startRound(state.roundIdx + 1);
    } else {
      state.score += 10; // full mission bonus
      markPlayed(); // persist + freeze the record now that scoring is final
      state.screen = "results";
      render();
    }
  }

  // ---------- Session lock ----------
  // Stores the full result record (not just a flag) so a repeat registration attempt
  // can show the agent their saved result instead of a bare "already played" error.
  function sessionKey() {
    return `fte_played_${state.sessionCode.trim().toUpperCase()}_${state.playerName.trim().toUpperCase()}`;
  }
  function alreadyPlayed() {
    const raw = localStorage.getItem(sessionKey());
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }
  function markPlayed() {
    // Freeze the final time + verification code once, at completion — screenResults()
    // reads these frozen values rather than recomputing, so the number shown never
    // drifts while the agent lingers on the results screen.
    const timeSec = elapsedSec();
    const code = fteVerifyCode(state.sessionCode, state.playerName, state.gradeLabel, state.score, timeSec);
    state.finalTimeSec = timeSec;
    state.verifyCode = code;
    const record = {
      playerName: state.playerName, sessionCode: state.sessionCode, gradeLabel: state.gradeLabel,
      score: state.score, timeSec, code,
      correctCount: state.correctCount, wrongCount: state.wrongCount
    };
    localStorage.setItem(sessionKey(), JSON.stringify(record));
  }

  // ---------- Screens ----------
  function screenHome() {
    return `
    <div class="screen home-screen">
      <div class="folder-mark">📁</div>
      <div class="eyebrow">MISSION LOG #2 · SKILL CHALLENGE FRIDAY</div>
      <h1 class="dossier-title">FOLLOW THE<br>EVIDENCE</h1>
      <p class="home-sub">Decipher Academy — Journey to Victory · Week 3</p>
      <button class="btn-primary" onclick="Game.goRegister()">BEGIN INVESTIGATION</button>
      <button class="btn-ghost" id="muteBtn" onclick="FTEAudio.toggleMute()">🔊 SOUND ON</button>
    </div>`;
  }

  function screenRegister() {
    return `
    <div class="screen">
      <div class="eyebrow">AGENT REGISTRATION</div>
      <h2 class="section-title">Identify Yourself, Agent</h2>
      <div class="field-group">
        <label>Agent Name</label>
        <input id="regName" type="text" placeholder="Your full name" value="${state.playerName}">
      </div>
      <div class="field-group">
        <label>Session Code</label>
        <input id="regSession" type="text" placeholder="Given by your facilitator" value="${state.sessionCode}">
      </div>
      <button class="btn-primary" onclick="Game.submitRegister()">CONTINUE</button>
      <p class="error-msg" id="regError"></p>
    </div>`;
  }

  function screenGradeSelect() {
    const buttons = GRADES.map(g =>
      `<button class="grade-btn" onclick="Game.selectGrade('${g.label}', ${g.bandIdx})">${g.label}</button>`
    ).join("");
    return `
    <div class="screen">
      <div class="eyebrow">CASE ASSIGNMENT</div>
      <h2 class="section-title">Select Your Grade</h2>
      <div class="grade-grid">${buttons}</div>
    </div>`;
  }

  function screenBriefing() {
    const band = BANDS[state.bandIdx];
    return `
    <div class="screen">
      <div class="eyebrow">${band.gradeLabel.toUpperCase()}</div>
      <h2 class="section-title">${band.caseTitle}</h2>
      <div class="dossier-card">
        <p>${band.intro}</p>
        <hr class="dossier-rule">
        <p class="mission-log-text">${MISSION_INTRO}</p>
      </div>
      <button class="btn-primary" onclick="Game.beginRound1()">OPEN THE FILE</button>
    </div>`;
  }

  function progressDots() {
    const total = state.flatQuestions.length;
    return `<div class="progress-dots">${state.flatQuestions.map((_, i) =>
      `<span class="dot ${i < state.qIdx ? 'done' : i === state.qIdx ? 'active' : ''}"></span>`
    ).join("")}</div>`;
  }

  function integrityBar() {
    return `
    <div class="integrity-wrap">
      <div class="integrity-label">CASE INTEGRITY</div>
      <div class="integrity-track"><div class="integrity-fill" style="width:${state.integrity}%"></div></div>
    </div>`;
  }

  function caseBoardHTML() {
    const round = BANDS[state.bandIdx].rounds[state.roundIdx];
    let boardInner = "";
    if (state.roundIdx === 2) {
      boardInner = `<div class="conclusion-cards">${state.conclusions.map(c =>
        `<div class="conclusion-card ${c.eliminated ? 'eliminated' : ''}">
          <span class="conclusion-letter">${c.id}</span>
          <span class="conclusion-label">${c.label}</span>
        </div>`).join("")}</div>`;
    } else {
      const pins = state.board.pins.map((p, i) =>
        `<circle cx="${30 + i * 60}" cy="40" r="6" class="board-pin"></circle>`).join("");
      const strings = state.board.strings.map(([a, b]) =>
        `<line x1="${30 + a * 60}" y1="40" x2="${30 + b * 60}" y2="40" class="board-string"></line>`).join("");
      boardInner = `<svg viewBox="0 0 ${Math.max(300, state.board.pins.length * 60 + 30)} 80" class="board-svg" preserveAspectRatio="xMinYMid meet">${strings}${pins}</svg>`;
    }
    return `<div class="case-board"><div class="case-board-label">${round.reward}</div>${boardInner}</div>`;
  }

  function screenRound() {
    const round = BANDS[state.bandIdx].rounds[state.roundIdx];
    const q = state.flatQuestions[state.qIdx];
    let body = "";
    if (q.type === "sequence") {
      const poolHTML = state.sequencePool.map(id => {
        const item = round.sequence.items.find(it => it.id === id);
        return `<button class="seq-chip" onclick="Game.pickSequence('${id}')">${item.label}</button>`;
      }).join("");
      const arrangedHTML = state.sequenceArranged.map((id, i) => {
        const item = round.sequence.items.find(it => it.id === id);
        return `<div class="seq-slot filled">${i + 1}. ${item.label}</div>`;
      }).join("") || `<div class="seq-slot-empty">Tap items below to place them in order</div>`;
      body = `
        <p class="q-text">${q.prompt}</p>
        <div class="seq-arranged">${arrangedHTML}</div>
        <div class="seq-pool">${poolHTML}</div>
        <button class="btn-primary" ${state.sequenceArranged.length === round.sequence.items.length ? "" : "disabled"} onclick="Game.submitSequenceAnswer()">LOCK IN ORDER</button>
      `;
    } else {
      body = `
        <p class="q-text">${q.q}</p>
        <textarea id="answerInput" class="answer-input" placeholder="Type your answer, Agent..." rows="4"></textarea>
        <p class="one-shot-note">⚠ One attempt only — answer carefully.</p>
        <button class="btn-primary" onclick="Game.submitFreeTextAnswer()">SUBMIT FINDING</button>
      `;
    }
    return `
    <div class="screen round-screen">
      <div class="round-header">
        <div class="eyebrow">${round.title.toUpperCase()} — Q${state.qIdx + 1} of ${state.flatQuestions.length}</div>
        ${integrityBar()}
      </div>
      ${progressDots()}
      ${caseBoardHTML()}
      <div class="question-card">${body}</div>
    </div>`;
  }

  function screenFeedback() {
    const correct = state.lastCorrect;
    return `
    <div class="screen feedback-screen ${correct ? 'fb-correct' : 'fb-wrong'}">
      <div class="stamp ${correct ? 'stamp-confirmed' : 'stamp-unreliable'}">${correct ? 'CONFIRMED' : 'UNRELIABLE'}</div>
      <p class="fb-points">${correct ? '+10 pts' : '−3 pts'}</p>
      <button class="btn-primary" onclick="Game.advanceAfterFeedback()">CONTINUE</button>
    </div>`;
  }

  function screenTransition() {
    const round = BANDS[state.bandIdx].rounds[state.roundIdx];
    const key = state.roundIdx === 0 ? "afterR1" : state.roundIdx === 1 ? "afterR2" : "afterR3";
    return `
    <div class="screen transition-screen">
      <div class="stamp stamp-secured">${round.reward}</div>
      <p class="transition-line">${TRANSITION_LINES[key]}</p>
      <button class="btn-primary" onclick="Game.continueAfterTransition()">${state.roundIdx < 2 ? "PROCEED TO NEXT ROUND" : "SEE RESULTS"}</button>
    </div>`;
  }

  function screenResults() {
    const timeSec = state.finalTimeSec;
    const code = state.verifyCode;
    const logRows = state.answerLog.map((l, i) => `
      <tr class="${l.overridden ? 'overridden' : ''}">
        <td>${l.round}</td>
        <td class="log-q">${l.qText}</td>
        <td>${l.userAnswer || "—"}</td>
        <td>${l.correct ? "✓" : "✗"}</td>
        <td>${l.points > 0 ? "+" : ""}${l.points}</td>
        <td>${!l.correct ? `<button class="override-btn" onclick="Game.overrideAnswer(${i})">Mark Correct</button>` : ""}</td>
      </tr>`).join("");
    return `
    <div class="screen results-screen">
      <div class="stamp stamp-secured">MISSION COMPLETE</div>
      <p class="mission-complete-text">${MISSION_COMPLETE_TEXT}</p>
      <div class="score-summary">
        <div class="score-big">${state.score} pts</div>
        <div class="score-sub">${state.correctCount} correct · ${state.wrongCount} wrong · Time ${fmtTime(timeSec)}</div>
      </div>
      <div class="verify-card">
        <div class="verify-label">VERIFICATION CODE</div>
        <div class="verify-code">${code}</div>
        <p class="verify-hint">Facilitator: enter this on the Verify page to confirm this result is legitimate.</p>
      </div>
      <details class="facilitator-panel">
        <summary>Facilitator Override Panel</summary>
        <table class="log-table">
          <thead><tr><th>Round</th><th>Question</th><th>Answer</th><th>✓/✗</th><th>Pts</th><th></th></tr></thead>
          <tbody>${logRows}</tbody>
        </table>
      </details>
      <button class="btn-ghost" onclick="location.reload()">NEW AGENT</button>
    </div>`;
  }

  function screenAlreadyPlayed() {
    const r = state.savedRecord;
    return `
    <div class="screen results-screen">
      <div class="already-played-banner">⚠ CASE FILE ALREADY CLOSED</div>
      <p class="transition-line">This agent name and session code already have a completed investigation on file. Showing the saved result below instead of starting a new one.</p>
      <div class="score-summary">
        <div class="score-big">${r.score} pts</div>
        <div class="score-sub">${r.gradeLabel} · ${r.correctCount} correct · ${r.wrongCount} wrong · Time ${fmtTime(r.timeSec)}</div>
      </div>
      <div class="verify-card">
        <div class="verify-label">VERIFICATION CODE</div>
        <div class="verify-code">${r.code}</div>
        <p class="verify-hint">This is the same code shown when the case was originally closed. Facilitator: check it on the Verify page if needed.</p>
      </div>
      <button class="btn-ghost" onclick="location.reload()">TRY A DIFFERENT AGENT NAME</button>
    </div>`;
  }

  function overrideAnswer(i) {
    const log = state.answerLog[i];
    if (log.correct) return;
    log.correct = true;
    log.overridden = true;
    state.score += 13; // undo -3, add +10
    state.correctCount++;
    state.wrongCount--;
    markPlayed(); // keep the saved record in sync with the facilitator's correction
    render();
  }

  // ---------- Sequence interaction ----------
  function pickSequence(id) {
    state.sequencePool = state.sequencePool.filter(x => x !== id);
    state.sequenceArranged.push(id);
    FTEAudio.pinClick();
    render();
  }

  // ---------- Render dispatch ----------
  function render() {
    const map = {
      home: screenHome, register: screenRegister, gradeselect: screenGradeSelect,
      briefing: screenBriefing, round: screenRound, feedback: screenFeedback,
      transition: screenTransition, results: screenResults, alreadyplayed: screenAlreadyPlayed
    };
    app().innerHTML = map[state.screen]();
  }

  // ---------- Public API ----------
  return {
    init() {
      render();
    },
    goRegister() {
      FTEAudio.startMusic();
      FTEAudio.tap();
      state.screen = "register";
      render();
    },
    submitRegister() {
      const name = document.getElementById("regName").value.trim();
      const session = document.getElementById("regSession").value.trim();
      if (!name || !session) {
        document.getElementById("regError").textContent = "Both fields are required, Agent.";
        return;
      }
      state.playerName = name;
      state.sessionCode = session;
      const existing = alreadyPlayed();
      if (existing) {
        state.savedRecord = existing;
        state.screen = "alreadyplayed";
        render();
        return;
      }
      state.screen = "gradeselect";
      render();
    },
    selectGrade(label, bandIdx) {
      state.gradeLabel = label;
      state.bandIdx = bandIdx;
      FTEAudio.tap();
      state.screen = "briefing";
      render();
    },
    beginRound1() {
      state.startTime = Date.now();
      startRound(0);
    },
    pickSequence,
    submitSequenceAnswer() { submitSequence(); },
    submitFreeTextAnswer() { submitFreeText(); },
    advanceAfterFeedback() { nextQuestion(); },
    continueAfterTransition() {
      continueAfterTransition();
    },
    overrideAnswer
  };
})();

document.addEventListener("DOMContentLoaded", () => Game.init());
