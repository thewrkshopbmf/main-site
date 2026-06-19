import { ASSESSMENT_SLUG, CLUSTERS, GIFTS, QUESTIONS } from './assessment-data.js';

const ATTEMPT_STORAGE_KEY = `${ASSESSMENT_SLUG}:attempt-id`;
const SNAPSHOT_STORAGE_KEY = `${ASSESSMENT_SLUG}:snapshot`;
const SAVE_ENDPOINT = '/.netlify/functions/assessment-attempt';
const SAVE_DEBOUNCE_MS = 900;
const MAX_GIFT_SCORE = 20;

const state = {
  answers: {},
  currentResults: null,
  attemptId: '',
  saveTimer: null,
  hasPendingSave: false,
  isComplete: false
};

const dom = {};

function generateAttemptId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16);
    const value = character === 'x' ? random : ((random & 0x3) | 0x8);
    return value.toString(16);
  });
}

function setSaveStatus(message, tone = 'muted') {
  const el = dom.saveStatus;
  if (!el) return;
  el.textContent = message;
  el.dataset.tone = tone;
}

function setNotice(message = '', tone = 'warning') {
  if (!dom.notice) return;

  if (!message) {
    dom.notice.textContent = '';
    dom.notice.style.display = 'none';
    dom.notice.dataset.tone = '';
    return;
  }

  dom.notice.textContent = message;
  dom.notice.style.display = 'block';
  dom.notice.dataset.tone = tone;
}

function switchScreen(name) {
  const screens = {
    cover: dom.cover,
    instructions: dom.instructions,
    assessment: dom.assessment,
    results: dom.results
  };

  Object.entries(screens).forEach(([key, element]) => {
    if (!element) return;
    element.classList.toggle('active', key === name);
    element.style.display = key === name ? (key === 'cover' ? 'flex' : 'block') : 'none';
  });

  window.scrollTo(0, 0);
}

function ensureAttemptId() {
  if (state.attemptId) return state.attemptId;
  state.attemptId = localStorage.getItem(ATTEMPT_STORAGE_KEY) || generateAttemptId();
  localStorage.setItem(ATTEMPT_STORAGE_KEY, state.attemptId);
  dom.attemptState.textContent = 'Attempt ID saved for this browser';
  return state.attemptId;
}

function saveSnapshot() {
  const payload = {
    attemptId: state.attemptId,
    answers: state.answers,
    currentResults: state.currentResults,
    isComplete: state.isComplete
  };

  localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(payload));
}

function loadSnapshot() {
  const raw = localStorage.getItem(SNAPSHOT_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearSnapshot() {
  localStorage.removeItem(ATTEMPT_STORAGE_KEY);
  localStorage.removeItem(SNAPSHOT_STORAGE_KEY);
}

function normalizeAnswers(input) {
  const clean = {};

  Object.entries(input || {}).forEach(([key, value]) => {
    const index = Number(key);
    const numeric = Number(value);
    if (Number.isInteger(index) && index >= 0 && index < QUESTIONS.length && numeric >= 1 && numeric <= 5) {
      clean[index] = numeric;
    }
  });

  return clean;
}

function computeResults(answers) {
  const scores = {};
  Object.keys(GIFTS).forEach((gift) => {
    scores[gift] = 0;
  });

  QUESTIONS.forEach((question, index) => {
    scores[question.gift] += Number(answers[index] || 0);
  });

  const normalized = {};
  Object.entries(scores).forEach(([gift, score]) => {
    normalized[gift] = Math.round((score / MAX_GIFT_SCORE) * 100);
  });

  return normalized;
}

function computeTopCluster(normalized) {
  const clusterScores = {};
  Object.keys(CLUSTERS).forEach((cluster) => {
    clusterScores[cluster] = 0;
  });

  Object.entries(normalized).forEach(([giftKey, score]) => {
    const category = GIFTS[giftKey].category;
    if (clusterScores[category] !== undefined) {
      clusterScores[category] += score;
    }
  });

  const [clusterKey] = Object.entries(clusterScores).sort((a, b) => b[1] - a[1])[0];
  return { clusterKey, cluster: CLUSTERS[clusterKey] };
}

function buildShareSummary(results) {
  const sorted = Object.entries(results).sort((a, b) => b[1] - a[1]);
  const topFive = sorted.slice(0, 5);
  const [primaryKey, primaryScore] = topFive[0];
  const primaryGift = GIFTS[primaryKey];
  const { cluster } = computeTopCluster(results);
  const shadowNames = primaryGift.shadow.map((giftKey) => GIFTS[giftKey].name);

  return [
    'SPIRITUAL GIFTS ASSESSMENT - TheWrkShop',
    '--------------------------------------------',
    '',
    `PRIMARY GIFT: ${primaryGift.name.toUpperCase()} (${primaryScore}%)`,
    '',
    primaryGift.desc,
    '',
    'TOP 5 GIFTS:',
    ...topFive.map(([giftKey, score], index) => `  ${index + 1}. ${GIFTS[giftKey].name} - ${score}%`),
    '',
    'SHADOW GIFTS:',
    `  ${shadowNames[0]} + ${shadowNames[1]}`,
    `  ${primaryGift.shadowNote}`,
    '',
    `GIFT CLUSTER: ${cluster.name.toUpperCase()}`,
    `  ${cluster.identity}`,
    `  WHERE YOU BELONG: ${cluster.placement}`,
    `  WHO YOU NEED: ${cluster.partners}`,
    '',
    'thewrkshop.com'
  ].join('\n');
}

function shadowWarning(score, lowNote) {
  if (score < 50) {
    return `<div class="spc-warning"><strong>Scores low (${score}%):</strong> ${lowNote}</div>`;
  }

  if (score < 70) {
    return '<div class="spc-warning" style="background:#fffbec;border-color:var(--gold);"><strong>Developing:</strong> This gift is present but not yet at full expression alongside your primary. Intentional cultivation here will multiply your impact.</div>';
  }

  return '';
}

function buildResults(results) {
  const sorted = Object.entries(results).sort((a, b) => b[1] - a[1]);
  const [primaryKey, primaryScore] = sorted[0];
  const primaryGift = GIFTS[primaryKey];
  const { cluster } = computeTopCluster(results);
  const [shadowOneKey, shadowTwoKey] = primaryGift.shadow;
  const shadowOne = GIFTS[shadowOneKey];
  const shadowTwo = GIFTS[shadowTwoKey];

  const rankingRows = sorted.map(([giftKey, score], index) => {
    const tone = index === 0 ? '' : index <= 2 ? 'secondary' : 'tertiary';
    return `
      <div class="gift-bar-row">
        <div class="gift-bar-meta">
          <span class="gift-bar-name">${GIFTS[giftKey].name}</span>
          <span class="gift-bar-pct">${score}%</span>
        </div>
        <div class="gift-bar-track">
          <div class="gift-bar-fill ${tone}" style="width:${score}%"></div>
        </div>
      </div>
    `;
  }).join('');

  dom.resultsContent.innerHTML = `
    <div class="primary-gift-card">
      <div class="pg-eyebrow">Your Primary Gift</div>
      <div class="pg-name">${primaryGift.name}</div>
      <div class="pg-score">${primaryScore}% strength · ${primaryGift.category}</div>
      <p class="pg-desc">${primaryGift.desc}</p>
    </div>

    <div class="gift-rankings">
      <h3 class="rankings-title">All Gift Rankings</h3>
      ${rankingRows}
    </div>

    <div class="scripture-block">
      <p class="scripture-text">"${primaryGift.scripture.text}"</p>
      <p class="scripture-ref">${primaryGift.scripture.ref}</p>
    </div>

    <div class="shadow-section">
      <h3 class="shadow-section-title">The Shadow Gifts</h3>
      <p class="shadow-section-sub">Every primary gift runs on companion gifts that most assessments ignore. These are the gifts that make yours actually work — and understanding them changes how you read your own calling.</p>
      <div class="shadow-primary-panel">
        <div class="sg-eyebrow">Your Primary Gift</div>
        <div class="sg-title">${primaryGift.name}</div>
        <p class="sg-body">${primaryGift.shadowNote}</p>
      </div>
      <div class="shadow-pair-grid">
        <div class="shadow-pair-card">
          <div class="spc-label">Shadow Gift 1</div>
          <div class="spc-name">${shadowOne.name}</div>
          <div class="spc-score">Your score: ${results[shadowOneKey]}%</div>
          <p class="spc-body">${shadowOne.desc}</p>
          ${shadowWarning(results[shadowOneKey], primaryGift.shadowLow[shadowOneKey])}
        </div>
        <div class="shadow-pair-card">
          <div class="spc-label">Shadow Gift 2</div>
          <div class="spc-name">${shadowTwo.name}</div>
          <div class="spc-score">Your score: ${results[shadowTwoKey]}%</div>
          <p class="spc-body">${shadowTwo.desc}</p>
          ${shadowWarning(results[shadowTwoKey], primaryGift.shadowLow[shadowTwoKey])}
        </div>
      </div>
    </div>

    <div class="cluster-section">
      <div class="cluster-eyebrow">Your Gift Cluster</div>
      <h3 class="cluster-title">${cluster.name}</h3>
      <p class="cluster-desc"><strong>${cluster.identity}</strong> ${cluster.desc}</p>
      <div class="cluster-grid">
        <div class="cluster-card strength">
          <div class="cc-label str">What This Cluster Does Well</div>
          <div class="cc-body">${cluster.strengths.map((item) => `• ${item}`).join('<br><br>')}</div>
        </div>
        <div class="cluster-card danger">
          <div class="cc-label dan">Where This Cluster Gets Into Trouble</div>
          <div class="cc-body">${cluster.dangers.map((item) => `• ${item}`).join('<br><br>')}</div>
        </div>
      </div>
      <div class="cluster-placement">
        <div class="cp-label">Where You Belong</div>
        <div class="cp-body">${cluster.placement}</div>
      </div>
      <div class="cluster-partners">
        <div class="cp2-label">Who You Need Around You</div>
        <div class="cp2-body">${cluster.partners}</div>
      </div>
    </div>

    <div class="next-steps-section">
      <h3 class="ns-title">Your Deployment Plan</h3>
      <p class="ns-sub">A gift profile with no deployment plan is a personality quiz. Here's what to actually do.</p>

      <div class="step-card week">
        <div class="step-num">01</div>
        <div class="step-content">
          <div class="step-title">This Week — Verify It</div>
          <p class="step-body">Take your results to two or three men who know you in real community and ask them if this matches what they see in you.</p>
          <div class="step-action">→ Which two men will you ask?</div>
        </div>
      </div>

      <div class="step-card month">
        <div class="step-num">02</div>
        <div class="step-content">
          <div class="step-title">This Month — Strengthen the Shadow Gifts</div>
          <p class="step-body">Notice which companion gift scored lowest and decide whether you need to cultivate it or partner with someone who carries it strongly.</p>
          <div class="step-action">→ Which shadow gift needs attention first?</div>
        </div>
      </div>

      <div class="step-card season">
        <div class="step-num">03</div>
        <div class="step-content">
          <div class="step-title">This Season — Deploy It Intentionally</div>
          <p class="step-body">Pick one real context where you can use your strongest gift on purpose, then pay attention to the kind of fruit it produces.</p>
          <div class="step-action">→ Where will you use it first?</div>
        </div>
      </div>
    </div>
  `;

  dom.shareSummary.textContent = buildShareSummary(results);
}

function buildQuestions() {
  const markup = QUESTIONS.map((question, index) => `
    <div class="q-block" id="question-${index}">
      <div class="q-number">Q${String(index + 1).padStart(2, '0')} · ${GIFTS[question.gift].name.toUpperCase()}</div>
      <p class="q-text">${question.text}</p>
      <div class="rating-row" role="radiogroup" aria-label="Question ${index + 1}">
        ${[1, 2, 3, 4, 5].map((value) => `
          <button type="button" class="rating-btn" data-question-index="${index}" data-value="${value}" aria-pressed="false">
            ${value}
          </button>
        `).join('')}
      </div>
      <div class="rating-labels">
        <span class="rating-label-text">Not like me</span>
        <span class="rating-label-text">Very much like me</span>
      </div>
    </div>
  `).join('');

  dom.questionsContainer.innerHTML = markup;
}

function renderAnswers() {
  QUESTIONS.forEach((_, index) => {
    const value = state.answers[index];
    const questionEl = document.getElementById(`question-${index}`);
    if (!questionEl) return;

    questionEl.classList.toggle('answered', value !== undefined);
    questionEl.querySelectorAll('.rating-btn').forEach((button) => {
      const selected = Number(button.dataset.value) === value;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  });
}

function updateProgress() {
  const answeredCount = Object.keys(state.answers).length;
  dom.progressCount.textContent = `${answeredCount} / ${QUESTIONS.length}`;
  dom.progressFill.style.width = `${(answeredCount / QUESTIONS.length) * 100}%`;
  dom.attemptState.textContent = answeredCount > 0 ? 'Progress saves automatically' : 'Anonymous attempt ready';
}

async function saveAttempt({ flush = false } = {}) {
  if (!state.hasPendingSave && !flush) return;
  if (!Object.keys(state.answers).length && !state.isComplete) return;

  const attemptId = ensureAttemptId();
  const payload = {
    attempt_id: attemptId,
    assessment_slug: ASSESSMENT_SLUG,
    answers_json: state.answers,
    result_json: state.currentResults ? { normalized: state.currentResults } : null,
    is_complete: state.isComplete
  };

  state.hasPendingSave = false;
  setSaveStatus('Saving...', 'working');

  try {
    const response = await fetch(SAVE_ENDPOINT, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: flush
    });

    if (!response.ok) {
      throw new Error(`Save failed with status ${response.status}`);
    }

    setSaveStatus(state.isComplete ? 'Results saved' : 'Progress saved', 'ok');
  } catch (error) {
    console.error(error);
    state.hasPendingSave = true;
    setSaveStatus('Save pending retry', 'warning');
  }
}

function queueSave() {
  ensureAttemptId();
  saveSnapshot();
  state.hasPendingSave = true;
  setSaveStatus('Saving soon...', 'working');

  if (state.saveTimer) {
    clearTimeout(state.saveTimer);
  }

  state.saveTimer = window.setTimeout(() => {
    state.saveTimer = null;
    void saveAttempt();
  }, SAVE_DEBOUNCE_MS);
}

function handleAnswerChange(index, value) {
  state.answers[index] = value;
  state.isComplete = false;
  state.currentResults = null;
  renderAnswers();
  updateProgress();
  setNotice('');
  queueSave();
}

function restoreFromAttempt(attempt) {
  state.attemptId = attempt.attempt_id || state.attemptId;
  if (state.attemptId) {
    localStorage.setItem(ATTEMPT_STORAGE_KEY, state.attemptId);
  }

  state.answers = normalizeAnswers(attempt.answers_json);
  state.isComplete = Boolean(attempt.is_complete);
  state.currentResults = attempt.result_json?.normalized || (state.isComplete ? computeResults(state.answers) : null);
  saveSnapshot();
  renderAnswers();
  updateProgress();

  if (state.isComplete && state.currentResults) {
    buildResults(state.currentResults);
    switchScreen('results');
    setSaveStatus('Completed results restored', 'ok');
    return;
  }

  if (Object.keys(state.answers).length > 0) {
    switchScreen('assessment');
    setSaveStatus('Saved progress restored', 'ok');
  }
}

async function hydrateAttempt() {
  buildQuestions();

  const storedAttemptId = localStorage.getItem(ATTEMPT_STORAGE_KEY);
  const snapshot = loadSnapshot();
  if (snapshot?.attemptId && !storedAttemptId) {
    localStorage.setItem(ATTEMPT_STORAGE_KEY, snapshot.attemptId);
  }

  const attemptId = storedAttemptId || snapshot?.attemptId;
  if (!attemptId) {
    updateProgress();
    return;
  }

  state.attemptId = attemptId;

  try {
    const response = await fetch(`${SAVE_ENDPOINT}?assessment_slug=${encodeURIComponent(ASSESSMENT_SLUG)}&attempt_id=${encodeURIComponent(attemptId)}`);
    if (!response.ok) {
      throw new Error(`Load failed with status ${response.status}`);
    }

    const payload = await response.json();
    if (payload.attempt) {
      restoreFromAttempt(payload.attempt);
      return;
    }
  } catch (error) {
    console.warn('Falling back to local snapshot', error);
  }

  if (snapshot) {
    restoreFromAttempt({
      attempt_id: snapshot.attemptId,
      answers_json: snapshot.answers,
      result_json: snapshot.currentResults ? { normalized: snapshot.currentResults } : null,
      is_complete: snapshot.isComplete
    });
    setSaveStatus('Restored from this browser', 'warning');
  }
}

function submitAssessment() {
  const unanswered = QUESTIONS.length - Object.keys(state.answers).length;
  if (unanswered > 0) {
    setNotice(`Please answer all questions — ${unanswered} remaining.`, 'warning');
    const firstUnanswered = QUESTIONS.findIndex((_, index) => state.answers[index] === undefined);
    const target = document.getElementById(`question-${firstUnanswered}`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  state.currentResults = computeResults(state.answers);
  state.isComplete = true;
  buildResults(state.currentResults);
  saveSnapshot();
  state.hasPendingSave = true;
  void saveAttempt({ flush: true });
  switchScreen('results');
}

function restartAssessment() {
  if (state.saveTimer) {
    clearTimeout(state.saveTimer);
    state.saveTimer = null;
  }

  state.answers = {};
  state.currentResults = null;
  state.isComplete = false;
  state.hasPendingSave = false;
  state.attemptId = '';
  clearSnapshot();
  buildQuestions();
  updateProgress();
  setNotice('');
  setSaveStatus('Not started', 'muted');
  switchScreen('cover');
}

function bindEvents() {
  dom.coverBeginButton.addEventListener('click', () => {
    if (Object.keys(state.answers).length > 0 || state.isComplete) {
      switchScreen('assessment');
      setSaveStatus('Progress restored', 'ok');
      return;
    }

    switchScreen('instructions');
  });

  dom.instructionsBackButton.addEventListener('click', () => {
    switchScreen('cover');
  });

  dom.instructionsBeginButton.addEventListener('click', () => {
    switchScreen('assessment');
    setSaveStatus(Object.keys(state.answers).length ? 'Progress restored' : 'Progress will autosave after you answer', 'muted');
  });

  dom.assessmentBackButton.addEventListener('click', () => {
    switchScreen('instructions');
  });

  dom.questionsContainer.addEventListener('click', (event) => {
    const button = event.target.closest('.rating-btn');
    if (!button) return;

    const questionIndex = Number(button.dataset.questionIndex);
    const value = Number(button.dataset.value);
    handleAnswerChange(questionIndex, value);
  });

  dom.submitButton.addEventListener('click', submitAssessment);
  dom.restartButton.addEventListener('click', restartAssessment);
  dom.copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(dom.shareSummary.textContent);
      const original = dom.copyButton.textContent;
      dom.copyButton.textContent = 'Copied!';
      dom.copyButton.classList.add('copied');
      window.setTimeout(() => {
        dom.copyButton.textContent = original;
        dom.copyButton.classList.remove('copied');
      }, 1800);
    } catch {
      setNotice('Copy failed on this device. You can still select and copy the summary manually.', 'warning');
    }
  });

  window.addEventListener('pagehide', () => {
    if (state.saveTimer) {
      clearTimeout(state.saveTimer);
      state.saveTimer = null;
    }
    void saveAttempt({ flush: true });
  });
}

function cacheDom() {
  dom.cover = document.getElementById('cover');
  dom.instructions = document.getElementById('instructions');
  dom.assessment = document.getElementById('assessment');
  dom.results = document.getElementById('results');
  dom.coverBeginButton = document.getElementById('coverBeginBtn');
  dom.instructionsBackButton = document.getElementById('instructionsBackBtn');
  dom.instructionsBeginButton = document.getElementById('instructionsBeginBtn');
  dom.assessmentBackButton = document.getElementById('assessmentBackBtn');
  dom.submitButton = document.getElementById('submitAssessmentBtn');
  dom.restartButton = document.getElementById('restartAssessmentBtn');
  dom.copyButton = document.getElementById('copySummaryBtn');
  dom.questionsContainer = document.getElementById('questionsContainer');
  dom.resultsContent = document.getElementById('resultsContent');
  dom.progressCount = document.getElementById('progressCount');
  dom.progressFill = document.getElementById('progressFill');
  dom.attemptState = document.getElementById('attemptState');
  dom.saveStatus = document.getElementById('saveStatus');
  dom.notice = document.getElementById('assessmentNotice');
  dom.shareSummary = document.getElementById('shareSummary');
}

document.addEventListener('DOMContentLoaded', async () => {
  cacheDom();
  bindEvents();
  await hydrateAttempt();
});
