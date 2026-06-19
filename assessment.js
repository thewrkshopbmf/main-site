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
    dom.notice.hidden = true;
    dom.notice.textContent = '';
    dom.notice.dataset.tone = '';
    return;
  }

  dom.notice.hidden = false;
  dom.notice.textContent = message;
  dom.notice.dataset.tone = tone;
}

function switchScreen(name) {
  const screens = {
    intro: dom.intro,
    flow: dom.flow,
    results: dom.results
  };

  Object.entries(screens).forEach(([key, el]) => {
    if (!el) return;
    el.classList.toggle('assessment-screen--active', key === name);
  });

  window.scrollTo(0, 0);
}

function ensureAttemptId() {
  if (state.attemptId) return state.attemptId;
  state.attemptId = localStorage.getItem(ATTEMPT_STORAGE_KEY) || generateAttemptId();
  localStorage.setItem(ATTEMPT_STORAGE_KEY, state.attemptId);
  dom.attemptState.textContent = `Attempt ID saved for this browser`;
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
    return `<div class="assessment-warning"><strong>Needs support (${score}%):</strong> ${lowNote}</div>`;
  }

  if (score < 70) {
    return '<div class="assessment-warning assessment-warning--warm"><strong>Developing:</strong> This companion gift is present, but intentional growth here will strengthen your primary gift.</div>';
  }

  return '';
}

function buildResults(results) {
  const sorted = Object.entries(results).sort((a, b) => b[1] - a[1]);
  const topThree = sorted.slice(0, 3);
  const [primaryKey, primaryScore] = topThree[0];
  const primaryGift = GIFTS[primaryKey];
  const { cluster } = computeTopCluster(results);
  const [shadowOneKey, shadowTwoKey] = primaryGift.shadow;
  const shadowOne = GIFTS[shadowOneKey];
  const shadowTwo = GIFTS[shadowTwoKey];

  const rankingRows = sorted.map(([giftKey, score]) => {
    const tone = giftKey === primaryKey ? 'assessment-rank__fill--primary' : score >= 70 ? 'assessment-rank__fill--strong' : 'assessment-rank__fill--base';
    return `
      <div class="assessment-rank">
        <div class="assessment-rank__meta">
          <span>${GIFTS[giftKey].name}</span>
          <span>${score}%</span>
        </div>
        <div class="assessment-rank__track">
          <div class="assessment-rank__fill ${tone}" style="width:${score}%"></div>
        </div>
      </div>
    `;
  }).join('');

  dom.resultsContent.innerHTML = `
    <section class="assessment-primary">
      <p class="assessment-primary__eyebrow">Primary Gift</p>
      <h3>${primaryGift.name}</h3>
      <p class="assessment-primary__meta">${primaryScore}% strength · ${primaryGift.category}</p>
      <p>${primaryGift.desc}</p>
    </section>

    <section class="assessment-section">
      <h3>Gift Rankings</h3>
      <div class="assessment-rankings">${rankingRows}</div>
    </section>

    <section class="assessment-section assessment-scripture">
      <p>"${primaryGift.scripture.text}"</p>
      <span>${primaryGift.scripture.ref}</span>
    </section>

    <section class="assessment-section">
      <h3>The Shadow Gifts</h3>
      <p class="assessment-section__intro">
        Every primary gift depends on supporting gifts that help it land with health, wisdom, and durability.
      </p>
      <div class="assessment-shadow">
        <div class="assessment-shadow__primary">
          <p class="assessment-primary__eyebrow">Your Primary Gift</p>
          <h4>${primaryGift.name}</h4>
          <p>${primaryGift.shadowNote}</p>
        </div>
        <div class="assessment-shadow__grid">
          <article class="assessment-shadow__card">
            <p class="assessment-shadow__label">Shadow Gift 1</p>
            <h4>${shadowOne.name}</h4>
            <p class="assessment-shadow__score">${results[shadowOneKey]}%</p>
            <p>${shadowOne.desc}</p>
            ${shadowWarning(results[shadowOneKey], primaryGift.shadowLow[shadowOneKey])}
          </article>
          <article class="assessment-shadow__card">
            <p class="assessment-shadow__label">Shadow Gift 2</p>
            <h4>${shadowTwo.name}</h4>
            <p class="assessment-shadow__score">${results[shadowTwoKey]}%</p>
            <p>${shadowTwo.desc}</p>
            ${shadowWarning(results[shadowTwoKey], primaryGift.shadowLow[shadowTwoKey])}
          </article>
        </div>
      </div>
    </section>

    <section class="assessment-section">
      <h3>${cluster.name}</h3>
      <p class="assessment-section__intro"><strong>${cluster.identity}</strong> ${cluster.desc}</p>
      <div class="assessment-cluster">
        <article class="assessment-cluster__card assessment-cluster__card--light">
          <h4>Strengths</h4>
          <ul>${cluster.strengths.map((item) => `<li>${item}</li>`).join('')}</ul>
        </article>
        <article class="assessment-cluster__card assessment-cluster__card--warm">
          <h4>Watchouts</h4>
          <ul>${cluster.dangers.map((item) => `<li>${item}</li>`).join('')}</ul>
        </article>
      </div>
      <div class="assessment-cluster__foot">
        <p><strong>Where you likely fit:</strong> ${cluster.placement}</p>
        <p><strong>Who you need around you:</strong> ${cluster.partners}</p>
      </div>
    </section>

    <section class="assessment-section">
      <h3>Deployment Plan</h3>
      <div class="assessment-steps">
        <article class="assessment-step">
          <span>01</span>
          <div>
            <h4>Verify it with other men</h4>
            <p>Take these results to two or three men who know you in real community and ask if they see the same pattern.</p>
          </div>
        </article>
        <article class="assessment-step">
          <span>02</span>
          <div>
            <h4>Strengthen the shadow gifts</h4>
            <p>Notice which companion gift scored lowest and decide whether you need to cultivate it or partner with someone who carries it strongly.</p>
          </div>
        </article>
        <article class="assessment-step">
          <span>03</span>
          <div>
            <h4>Use it intentionally this month</h4>
            <p>Pick one real context where you can deploy your strongest gift on purpose and then pay attention to the fruit it produces.</p>
          </div>
        </article>
      </div>
    </section>
  `;

  dom.shareSummary.value = buildShareSummary(results);
}

function buildQuestions() {
  const markup = QUESTIONS.map((question, index) => `
    <article class="assessment-question" id="question-${index}">
      <p class="assessment-question__meta">Q${String(index + 1).padStart(2, '0')} · ${GIFTS[question.gift].name}</p>
      <h3>${question.text}</h3>
      <div class="assessment-question__ratings" role="radiogroup" aria-label="Question ${index + 1}">
        ${[1, 2, 3, 4, 5].map((value) => `
          <button type="button" class="assessment-rating" data-question-index="${index}" data-value="${value}" aria-pressed="false">
            ${value}
          </button>
        `).join('')}
      </div>
      <div class="assessment-question__labels">
        <span>Not like me</span>
        <span>Very much like me</span>
      </div>
    </article>
  `).join('');

  dom.questionsContainer.innerHTML = markup;
}

function renderAnswers() {
  QUESTIONS.forEach((_, index) => {
    const value = state.answers[index];
    const questionEl = document.getElementById(`question-${index}`);
    if (!questionEl) return;

    questionEl.classList.toggle('assessment-question--answered', value !== undefined);
    questionEl.querySelectorAll('.assessment-rating').forEach((button) => {
      const selected = Number(button.dataset.value) === value;
      button.classList.toggle('assessment-rating--selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  });
}

function updateProgress() {
  const answeredCount = Object.keys(state.answers).length;
  dom.progressCount.textContent = `${answeredCount} / ${QUESTIONS.length} answered`;
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
    switchScreen('flow');
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
    setNotice(`Please answer all questions before continuing. ${unanswered} remaining.`, 'warning');
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
  switchScreen('intro');
}

function bindEvents() {
  dom.startButton.addEventListener('click', () => {
    switchScreen('flow');
    setSaveStatus(Object.keys(state.answers).length ? 'Progress restored' : 'Progress will autosave after you answer', 'muted');
  });

  dom.questionsContainer.addEventListener('click', (event) => {
    const button = event.target.closest('.assessment-rating');
    if (!button) return;

    const questionIndex = Number(button.dataset.questionIndex);
    const value = Number(button.dataset.value);
    handleAnswerChange(questionIndex, value);
  });

  dom.submitButton.addEventListener('click', submitAssessment);
  dom.restartButton.addEventListener('click', restartAssessment);
  dom.copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(dom.shareSummary.value);
      const original = dom.copyButton.textContent;
      dom.copyButton.textContent = 'Copied';
      window.setTimeout(() => {
        dom.copyButton.textContent = original;
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
  dom.intro = document.getElementById('assessmentIntro');
  dom.flow = document.getElementById('assessmentFlow');
  dom.results = document.getElementById('assessmentResults');
  dom.startButton = document.getElementById('startAssessmentBtn');
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
