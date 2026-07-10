// ============ CATCH THE CLUE — GAME ENGINE ============

// Shared grading function — the ONLY copy of this logic in the project (game.js and verify.html
// both call the same normalize/grade pattern to avoid the kind of drift bug that broke
// Pulse Protocol's verify system).
function ctcNormalize(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9\s:]/g, " ").replace(/\s+/g, " ").trim();
}
function ctcGrade(answer, keywordGroups) {
  const norm = ctcNormalize(answer);
  return keywordGroups.some(group => group.every(kw => norm.includes(ctcNormalize(kw))));
}
function ctcVerifyCode(sessionCode, name, gradeLabel, score, timeSec) {
  const str = `${sessionCode.trim().toUpperCase()}|${name.trim().toUpperCase()}|${gradeLabel.trim().toUpperCase()}|${Math.round(score)}|${Math.round(timeSec)}`;
  let hash = 5381;
  for (let i = 0; i < str.length; i++) hash = ((hash * 33) ^ str.charCodeAt(i)) >>> 0;
  const code = hash.toString(36).toUpperCase().padStart(6, "0").slice(-6);
  return code.slice(0, 3) + "-" + code.slice(3, 6);
}

const Game = (() => {
  let state = {
    name: "", sessionCode: "", bandIdx: 0, gradeLabel: "",
    invIdx: 0, score: 0, combo: 0, comboMultiplier: 1,
    invResults: [], reviewLog: [], achievements: new Set(),
    paused: false, missionStartTs: 0, wager: null,
    invWrongCount: 0, invCorrectCount: 0, invQuestionsDone: 0, invTotalQuestions: 5
  };

  const $ = id => document.getElementById(id);
  const allScreens = ["screen-home","screen-register","screen-band","screen-brief","screen-inv","screen-invresult","screen-wager","screen-final"];
  function showScreen(id) { allScreens.forEach(s => $(s).classList.add("hidden")); $(id).classList.remove("hidden"); }

  function updateHud() {
    const scoreEl = $("hudScore");
    if (!scoreEl) return;
    scoreEl.textContent = Math.max(0, Math.round(state.score));
    scoreEl.classList.remove("bump"); void scoreEl.offsetWidth; scoreEl.classList.add("bump");
    const pct = Math.min(100, (state.combo / 6) * 100);
    $("comboFill").style.width = pct + "%";
    $("comboLabel").textContent = state.combo >= 3 ? `INSTINCT x${state.comboMultiplier.toFixed(1)}` : "INSTINCT";
  }

  function addScore(base, isCorrect) {
    if (isCorrect) {
      state.combo++;
      state.comboMultiplier = state.combo >= 6 ? 1.5 : state.combo >= 3 ? 1.2 : 1.0;
      state.score += Math.round(base * state.comboMultiplier);
      state.invCorrectCount++;
      if (state.combo === 3 || state.combo === 6) Audio2.comboMilestone();
    } else {
      state.score = Math.max(0, state.score - 3);
      state.combo = 0; state.comboMultiplier = 1;
      state.invWrongCount++;
    }
    updateHud();
  }

  // ---------- REGISTER / BAND SELECT ----------
  function goTo(where) {
    if (where === "register") { showScreen("screen-register"); Audio2.tap(); Audio2.startMusic(); }
  }

  function confirmRegister() {
    const name = $("regName").value.trim();
    const session = $("regSession").value.trim();
    if (!name || !session) {
      [$("regName"), $("regSession")].forEach(el => { if (!el.value.trim()) el.style.borderColor = "var(--err)"; });
      Audio2.wrong();
      return;
    }
    const existing = getPlayRecord(session, name);
    if (existing) {
      Audio2.wrong();
      showAlreadyPlayed(existing);
      return;
    }
    state.name = name; state.sessionCode = session;
    buildBandGrid();
    showScreen("screen-band");
    Audio2.tap();
  }

  // ---------- ONE-PLAY LOCK (localStorage; see README for what this does and doesn't guarantee) ----------
  function playKey(session, name) {
    return "ctc_played::" + session.trim().toLowerCase() + "::" + name.trim().toLowerCase();
  }
  function getPlayRecord(session, name) {
    try {
      const raw = localStorage.getItem(playKey(session, name));
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function savePlayRecord(record) {
    try { localStorage.setItem(playKey(record.sessionCode, record.name), JSON.stringify(record)); }
    catch (e) { /* storage unavailable — game still works, just without the replay lock */ }
  }
  function showAlreadyPlayed(record) {
    $("finalGrade").textContent = record.grade;
    $("finalScore").textContent = record.score + " PTS";
    $("resultCard").innerHTML = `
      <div class="already-played-note type">⚠ YOU'VE ALREADY PLAYED THIS SESSION — SHOWING YOUR SAVED RESULT</div>
      <div class="result-row"><span>AGENT</span><b>${escapeHtml(record.name)}</b></div>
      <div class="result-row"><span>GRADE</span><b>${escapeHtml(record.gradeLabel)}</b></div>
      <div class="result-row"><span>SESSION</span><b>${escapeHtml(record.sessionCode)}</b></div>
      <div class="result-row"><span>TIME</span><b>${record.timeStr}</b></div>
      <div class="verify-line"><div class="verify-code type">VERIFY: ${record.verifyCode}</div></div>`;
    $("achvList").innerHTML = (record.achievements || []).map(a => `<div class="achv-badge">🏅 ${escapeHtml(a)}</div>`).join("")
      || `<div class="achv-badge" style="opacity:.5">No bonus achievements that run</div>`;
    $("reviewList").innerHTML = `<div class="review-item">Review isn't available for a replay-locked result — it's only kept for the run that just finished.</div>`;
    showScreen("screen-final");
  }


  function buildBandGrid() {
    const grid = $("bandGrid");
    grid.innerHTML = "";
    GRADES.forEach(g => {
      const card = document.createElement("button");
      card.className = "band-card";
      card.innerHTML = `<div class="band-num disp">GRADE ${g.grade}</div>`;
      card.onclick = () => { Audio2.tap(); selectGrade(g); };
      grid.appendChild(card);
    });
  }

  function selectGrade(g) {
    state.bandIdx = g.bandIdx;
    state.gradeLabel = "Grade " + g.grade;
    state.invIdx = 0; state.score = 0; state.combo = 0; state.comboMultiplier = 1;
    state.invResults = []; state.reviewLog = []; state.achievements = new Set();
    state.missionStartTs = Date.now();
    buildBriefing();
    showScreen("screen-brief");
  }

  function buildBriefing() {
    $("briefText").innerHTML = BRIEF_TEXT;
    const rail = $("invRail");
    rail.innerHTML = "";
    ["🕵️","🔬","⚖️"].forEach((icon, i) => {
      const node = document.createElement("div");
      node.className = "rail-node";
      node.id = "rail-" + (i + 1);
      node.textContent = icon;
      rail.appendChild(node);
    });
  }

  function updateRail() {
    [1, 2, 3].forEach(n => {
      const node = $("rail-" + n);
      if (!node) return;
      node.classList.remove("done", "active");
      if (n - 1 < state.invIdx) node.classList.add("done");
      else if (n - 1 === state.invIdx) node.classList.add("active");
    });
  }

  // ---------- COUNTDOWN ----------
  function runCountdown(cb) {
    $("countdownOv").classList.remove("hidden");
    const num = $("countdownNum");
    let n = 3;
    num.textContent = n; Audio2.countdownBeep(false);
    const iv = setInterval(() => {
      n--;
      if (n > 0) { num.textContent = n; Audio2.countdownBeep(false); }
      else {
        num.textContent = "GO"; Audio2.countdownBeep(true);
        clearInterval(iv);
        setTimeout(() => { $("countdownOv").classList.add("hidden"); cb(); }, 450);
      }
    }, 650);
  }

  // ---------- INVESTIGATION FLOW ----------
  function startInvestigation(n) {
    state.invIdx = n - 1;
    updateRail();
    showScreen("screen-inv");
    const band = BANDS[state.bandIdx];
    const inv = band.investigations[state.invIdx];
    state.invWrongCount = 0; state.invCorrectCount = 0; state.invQuestionsDone = 0;
    state.invTotalQuestions = inv.questions.length;

    runCountdown(() => {
      Audio2.pageTurnWhoosh();
      $("invTitle").textContent = `INVESTIGATION ${n} — ${inv.title.toUpperCase()}`;
      $("invSceneImg").src = inv.img;
      $("invSceneText").textContent = inv.scene;
      $("caseBoardBlock").innerHTML = "";
      $("questionBlock").innerHTML = "";
      renderWitnesses(inv);
    });
  }

  function renderWitnesses(inv) {
    const block = $("witnessBlock");
    block.innerHTML = "";
    if (!inv.witnesses || inv.witnesses.length === 0) { renderCaseBoardIfNeeded(inv); renderQuestion(inv, 0); return; }
    let i = 0;
    function next() {
      if (i >= inv.witnesses.length) { renderCaseBoardIfNeeded(inv); renderQuestion(inv, 0); return; }
      const box = document.createElement("div");
      box.className = "witness-box";
      const textEl = document.createElement("span");
      textEl.className = "witness-text";
      box.appendChild(textEl);
      const cursor = document.createElement("span");
      cursor.className = "witness-cursor";
      box.appendChild(cursor);
      block.appendChild(box);
      typewrite(inv.witnesses[i], textEl, () => { cursor.remove(); i++; setTimeout(next, 180); });
    }
    next();
  }

  function typewrite(text, el, done) {
    let idx = 0;
    const speed = text.length > 90 ? 8 : 16; // faster for long statements so it never drags
    const iv = setInterval(() => {
      el.textContent += text[idx];
      if (idx % 2 === 0) Audio2.typewriterKey();
      idx++;
      if (idx >= text.length) { clearInterval(iv); done(); }
    }, speed);
  }

  function renderCaseBoardIfNeeded(inv) {
    if (!inv.destinations) return;
    const block = $("caseBoardBlock");
    block.innerHTML = `<div class="case-board" id="caseBoard"></div>`;
    const boardEl = $("caseBoard");
    inv.destinations.forEach(dest => {
      const card = document.createElement("div");
      card.className = "case-card";
      card.textContent = dest;
      card.dataset.dest = dest;
      boardEl.appendChild(card);
    });
  }

  function renderQuestion(inv, qIdx) {
    const qBlock = $("questionBlock");
    if (qIdx >= inv.questions.length) { finishInvestigation(inv); return; }
    const q = inv.questions[qIdx];
    qBlock.innerHTML = "";
    const card = document.createElement("div");
    card.className = "qcard";
    card.innerHTML = `<div class="qcard-num type">QUESTION ${qIdx + 1} OF ${inv.questions.length}</div>
      <div class="qcard-text">${q.q}</div>`;

    if (q.eliminate) {
      const hint = document.createElement("div");
      hint.style.cssText = "font-size:12px;color:var(--muted);margin-bottom:.6rem";
      hint.textContent = "Tap the case board above to select destinations to eliminate, then submit.";
      card.appendChild(hint);
      const btn = document.createElement("button");
      btn.className = "btn-submit";
      btn.textContent = "SUBMIT ELIMINATION";
      btn.onclick = () => checkElimination(inv, qIdx, q);
      card.appendChild(btn);
    } else {
      const ta = document.createElement("textarea");
      ta.className = "qcard-input";
      ta.placeholder = "Type your answer...";
      card.appendChild(ta);
      const feedback = document.createElement("div");
      feedback.className = "qcard-feedback";
      card.appendChild(feedback);
      const btn = document.createElement("button");
      btn.className = "btn-submit";
      btn.textContent = "SUBMIT ANSWER";
      btn.onclick = () => checkTextAnswer(inv, qIdx, q, ta, feedback, btn);
      card.appendChild(btn);
    }
    qBlock.appendChild(card);
  }

  function checkElimination(inv, qIdx, q) {
    const picked = [...document.querySelectorAll("#caseBoard .case-card.picked")].map(c => c.dataset.dest);
    const correctSet = new Set(q.eliminate);
    const pickedSet = new Set(picked);
    const isCorrect = correctSet.size === pickedSet.size && [...correctSet].every(d => pickedSet.has(d));
    logReview(inv, q, picked.join(", ") || "(none selected)", isCorrect);
    if (isCorrect) {
      [...document.querySelectorAll("#caseBoard .case-card.picked")].forEach(c => { c.classList.add("eliminated"); c.classList.remove("picked"); });
      Audio2.cardEliminate();
      addScore(10, true);
    } else {
      [...document.querySelectorAll("#caseBoard .case-card.picked")].forEach(c => c.classList.remove("picked"));
      Audio2.wrong();
      addScore(10, false);
    }
    advanceQuestion(inv, qIdx);
  }

  function checkTextAnswer(inv, qIdx, q, ta, feedback, btn) {
    const answer = ta.value.trim();
    if (!answer) { feedback.textContent = "Write an answer before submitting."; feedback.className = "qcard-feedback bad"; return; }
    const isCorrect = ctcGrade(answer, q.keywords);
    logReview(inv, q, answer, isCorrect);
    if (isCorrect) {
      feedback.textContent = "✓ Correct — sharp thinking.";
      feedback.className = "qcard-feedback ok";
      Audio2.correct(state.combo);
      addScore(10, true);
    } else {
      feedback.textContent = "✗ Not quite — look again at the evidence.";
      feedback.className = "qcard-feedback bad";
      Audio2.wrong();
      addScore(10, false);
    }
    ta.disabled = true; btn.disabled = true;
    setTimeout(() => advanceQuestion(inv, qIdx), 700);
  }

  function logReview(inv, q, studentAnswer, isCorrect) {
    state.reviewLog.push({ invTitle: inv.title, q: q.q, answer: studentAnswer, auto: isCorrect, overridden: false });
  }

  function advanceQuestion(inv, qIdx) {
    state.invQuestionsDone++;
    renderQuestion(inv, qIdx + 1);
  }

  function finishInvestigation(inv) {
    const bonus = state.invCorrectCount === inv.questions.length ? 5 : 0;
    state.score += bonus;
    updateHud();
    if (state.invWrongCount === 0) unlockAchievement("Flawless — " + inv.title);

    state.invResults.push({ title: inv.title, evidenceIcon: inv.evidenceIcon, evidenceName: inv.evidenceName, correct: state.invCorrectCount, total: inv.questions.length, bonus });

    Audio2.zoneComplete();
    $("irEyebrow").textContent = `${inv.evidenceIcon} CLUE RECOVERED`;
    $("irStamp").textContent = "CONFIRMED";
    $("irStamp").style.animation = "none"; void $("irStamp").offsetWidth; $("irStamp").style.animation = "";
    $("irEvidenceIcon").textContent = inv.evidenceIcon;
    $("irEvidenceLabel").textContent = `Evidence Secured: ${inv.evidenceName}`;
    $("irCorrect").textContent = `${state.invCorrectCount} / ${inv.questions.length}`;
    $("irPoints").textContent = state.invCorrectCount * 10;
    $("irBonus").textContent = "+" + bonus;
    $("irTotal").textContent = state.invCorrectCount * 10 + bonus;
    $("irNextBtn").textContent = state.invIdx < 2 ? "CONTINUE" : "PROCEED TO FINAL MYSTERY";
    showScreen("screen-invresult");
  }

  function unlockAchievement(name) {
    if (!state.achievements.has(name)) { state.achievements.add(name); Audio2.achievement(); }
  }

  function nextInvestigation() {
    if (state.invIdx < 2) startInvestigation(state.invIdx + 2);
    else startFinalMystery();
  }

  // ---------- FINAL MYSTERY / WAGER ----------
  function startFinalMystery() {
    state.score += 10; // "all 3 investigations completed" mission bonus
    updateHud();
    unlockAchievement("Full Case File");
    showScreen("screen-wager");
    document.querySelectorAll(".wager-btn").forEach(b => b.classList.remove("selected"));
    $("wagerConfirmBtn").disabled = true;
    state.wager = null;
  }

  function selectWager(amount) {
    state.wager = amount;
    document.querySelectorAll(".wager-btn").forEach(b => b.classList.toggle("selected", parseInt(b.dataset.w) === amount));
    $("wagerConfirmBtn").disabled = false;
    Audio2.tap();
  }

  function confirmWager() {
    Audio2.wagerLock();
    const wrap = $("screen-wager");
    wrap.innerHTML = `
      <div class="brief-eyebrow type">THE FINAL MYSTERY</div>
      <p class="brief-body">${FINAL_MYSTERY.intro}</p>
      <div class="qcard" style="max-width:480px;margin-top:1rem;width:100%">
        <div class="qcard-text disp" style="font-size:19px">${FINAL_MYSTERY.question}</div>
        <textarea class="qcard-input" id="finalAnswerInput" placeholder="Where does it all lead?"></textarea>
        <div class="qcard-feedback" id="finalFeedback"></div>
        <button class="btn-submit" id="finalSubmitBtn">SUBMIT FINAL ANSWER</button>
      </div>`;
    $("finalSubmitBtn").onclick = submitFinalAnswer;
  }

  function submitFinalAnswer() {
    const input = $("finalAnswerInput");
    const feedback = $("finalFeedback");
    const answer = input.value.trim();
    if (!answer) { feedback.textContent = "Write your answer before submitting."; feedback.className = "qcard-feedback bad"; return; }
    const isCorrect = ctcGrade(answer, FINAL_MYSTERY.need);
    state.reviewLog.push({ invTitle: "Final Mystery", q: FINAL_MYSTERY.question, answer, auto: isCorrect, overridden: false });
    input.disabled = true; $("finalSubmitBtn").disabled = true;
    if (isCorrect) {
      state.score += FINAL_MYSTERY.points + state.wager;
      feedback.textContent = `✓ Correct! +${FINAL_MYSTERY.points} pts, wager doubled: +${state.wager} pts`;
      feedback.className = "qcard-feedback ok";
      Audio2.wagerWin();
      unlockAchievement("Case Closed");
    } else {
      state.score = Math.max(0, state.score - state.wager);
      feedback.textContent = `✗ Not quite. Wager lost: −${state.wager} pts`;
      feedback.className = "qcard-feedback bad";
      Audio2.wagerLose();
    }
    updateHud();
    setTimeout(finishMission, 1200);
  }

  // ---------- FINAL RESULTS ----------
  function finishMission() {
    const totalSeconds = Math.round((Date.now() - state.missionStartTs) / 1000);
    const totalScore = Math.max(0, Math.round(state.score));
    const maxScore = 190;
    let grade = "C";
    const pct = totalScore / maxScore;
    if (pct >= 0.9) grade = "S"; else if (pct >= 0.75) grade = "A"; else if (pct >= 0.55) grade = "B";

    $("finalGrade").textContent = grade;
    $("finalScore").textContent = totalScore + " PTS";

    const timeStr = `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")}`;
    const verifyCode = ctcVerifyCode(state.sessionCode, state.name, state.gradeLabel, totalScore, totalSeconds);

    savePlayRecord({
      name: state.name, sessionCode: state.sessionCode, gradeLabel: state.gradeLabel,
      score: totalScore, timeStr, timeSeconds: totalSeconds, verifyCode, grade,
      achievements: [...state.achievements]
    });

    $("resultCard").innerHTML = `
      <div class="save-confirm type">✓ RESULT SAVED — this session is now locked for ${escapeHtml(state.name)}</div>
      <div class="result-row"><span>AGENT</span><b>${escapeHtml(state.name)}</b></div>
      <div class="result-row"><span>GRADE</span><b>${escapeHtml(state.gradeLabel)}</b></div>
      <div class="result-row"><span>SESSION</span><b>${escapeHtml(state.sessionCode)}</b></div>
      <div class="result-row"><span>TIME</span><b>${timeStr}</b></div>
      <div class="verify-line"><div class="verify-code type">VERIFY: ${verifyCode}</div></div>`;

    const achvList = $("achvList");
    achvList.innerHTML = [...state.achievements].map(a => `<div class="achv-badge">🏅 ${escapeHtml(a)}</div>`).join("")
      || `<div class="achv-badge" style="opacity:.5">No bonus achievements this run</div>`;

    buildReviewList();
    Audio2.missionComplete();
    showScreen("screen-final");
  }

  function escapeHtml(s) { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

  function buildReviewList() {
    const list = $("reviewList");
    const wrongOnes = state.reviewLog.filter(r => !r.auto);
    if (wrongOnes.length === 0) {
      list.innerHTML = `<div class="review-item">No auto-marked misses this run — nothing to review.</div>`;
      return;
    }
    list.innerHTML = "";
    wrongOnes.forEach((r, i) => {
      const item = document.createElement("div");
      item.className = "review-item";
      item.innerHTML = `<div class="rq">${escapeHtml(r.invTitle)}: ${escapeHtml(r.q)}</div>
        <div class="ra">Student answer: "${escapeHtml(r.answer)}"</div>
        <button class="override-btn" id="ov-${i}">MARK CORRECT (+10 pts)</button>`;
      list.appendChild(item);
      item.querySelector(".override-btn").onclick = (e) => {
        r.overridden = true;
        state.score += 10;
        $("finalScore").textContent = Math.round(state.score) + " PTS";
        e.target.disabled = true;
        e.target.textContent = "MARKED CORRECT ✓";
      };
    });
  }

  function toggleReview() { $("reviewList").classList.toggle("hidden"); }

  // ---------- PAUSE ----------
  function pause() { state.paused = true; $("pauseOv").classList.remove("hidden"); }
  function resume() { state.paused = false; $("pauseOv").classList.add("hidden"); }

  return {
    goTo, confirmRegister, startInvestigation, nextInvestigation,
    selectWager, confirmWager, toggleReview, pause, resume,
    _markPicked(el) { el.classList.toggle("picked"); Audio2.tap(); }
  };
})();

// Case-board card click delegation (cards are created dynamically per investigation)
document.addEventListener("click", (e) => {
  const card = e.target.closest(".case-card");
  if (card && !card.classList.contains("eliminated")) Game._markPicked(card);
});
