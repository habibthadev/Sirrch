const searchInput  = document.getElementById('searchInput');
const searchBtn    = document.getElementById('searchBtn');
const themeBtn     = document.getElementById('themeBtn');
const themeIcon    = document.getElementById('themeIcon');
const recentRow    = document.getElementById('recentRow');
const results      = document.getElementById('results');
const wordTitle    = document.getElementById('wordTitle');
const phonetic     = document.getElementById('phonetic');
const playBtn      = document.getElementById('playBtn');
const playIcon     = document.getElementById('playIcon');
const meaningsList = document.getElementById('meaningsList');
const sourceFooter = document.getElementById('sourceFooter');
const sourceLinks  = document.getElementById('sourceLinks');
const emptyState   = document.getElementById('emptyState');
const errorState   = document.getElementById('errorState');
const errorTitle   = document.getElementById('errorTitle');
const errorSub     = document.getElementById('errorSub');
const tryAgainBtn  = document.getElementById('tryAgainBtn');
const audio        = document.getElementById('audio');

let currentAudioUrl = null;
let isPlaying       = false;
let abortController = null;
const RECENT_KEY    = 'sirrch_recent';
const MAX_RECENT    = 6;

function initTheme() {
  const saved       = localStorage.getItem('sirrch_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.body.classList.add('dark');
    themeIcon.className = 'ti ti-sun';
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  themeIcon.className = isDark ? 'ti ti-sun' : 'ti ti-moon';
  localStorage.setItem('sirrch_theme', isDark ? 'dark' : 'light');
}

function getRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); }
  catch { return []; }
}

function addRecent(word) {
  const recent = getRecent().filter(w => w.toLowerCase() !== word.toLowerCase());
  recent.unshift(word);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
  renderRecent();
}

function renderRecent() {
  const recent = getRecent();
  if (!recent.length) { recentRow.innerHTML = ''; return; }
  recentRow.innerHTML =
    '<span class="recent-label">Recent</span>' +
    recent.map(w =>
      `<button class="chip chip-recent" data-word="${escapeAttr(w)}">${escapeHtml(w)}</button>`
    ).join('');
  recentRow.querySelectorAll('.chip-recent').forEach(btn => {
    btn.addEventListener('click', () => {
      searchInput.value = btn.dataset.word;
      handleSearch();
    });
  });
}

function showEmpty() {
  emptyState.removeAttribute('hidden');
  errorState.setAttribute('hidden', '');
  results.setAttribute('hidden', '');
}

function showError(word, isNetwork) {
  if (isNetwork) {
    errorTitle.textContent = 'Connection error';
    errorSub.textContent   = 'Check your internet connection and try again.';
  } else {
    errorTitle.textContent = `No results for \u201C${word}\u201D`;
    errorSub.textContent   = 'Check the spelling or try a different word.';
  }
  errorState.removeAttribute('hidden');
  results.setAttribute('hidden', '');
  emptyState.setAttribute('hidden', '');
}

function showResults() {
  results.removeAttribute('hidden');
  errorState.setAttribute('hidden', '');
  emptyState.setAttribute('hidden', '');
}

function renderSkeletons() {
  meaningsList.innerHTML = [
    `<div class="skeleton-card">
      <div class="skeleton skeleton-badge"></div>
      <div class="skeleton skeleton-line s-80"></div>
      <div class="skeleton skeleton-line s-55"></div>
      <div class="skeleton skeleton-line s-70"></div>
    </div>`,
    `<div class="skeleton-card">
      <div class="skeleton skeleton-badge"></div>
      <div class="skeleton skeleton-line s-70"></div>
      <div class="skeleton skeleton-line s-40"></div>
    </div>`,
  ].join('');
}

function resetAudioState() {
  isPlaying = false;
  playBtn.classList.remove('playing');
  playIcon.className = 'ti ti-volume';
}

audio.addEventListener('ended', resetAudioState);
audio.addEventListener('pause', resetAudioState);

function handlePlay() {
  if (!currentAudioUrl) return;
  if (isPlaying) {
    audio.pause();
  } else {
    audio.src = currentAudioUrl;
    audio.play().then(() => {
      isPlaying = true;
      playBtn.classList.add('playing');
      playIcon.className = 'ti ti-player-stop';
    }).catch(() => {});
  }
}

function renderResults(data) {
  wordTitle.textContent = data.word || '';

  const phoneticText = data.phonetics?.find(p => p.text?.trim())?.text || data.phonetic || '';
  phonetic.textContent = phoneticText;

  const audioUrl = data.phonetics?.find(p => p.audio?.trim())?.audio || '';
  if (audioUrl) {
    currentAudioUrl = audioUrl;
    playBtn.removeAttribute('hidden');
  } else {
    playBtn.setAttribute('hidden', '');
    currentAudioUrl = null;
  }

  meaningsList.innerHTML = '';

  data.meanings?.forEach((meaning, i) => {
    const card = document.createElement('div');
    card.className = 'meaning-card';
    card.style.animationDelay = `${i * 55}ms`;

    const defs = (meaning.definitions || []).slice(0, 5).map((def, idx) => `
      <li class="def-item">
        <span class="def-num">${idx + 1}.</span>
        <div class="def-body">
          <span class="def-text">${escapeHtml(def.definition || '')}</span>
          ${def.example ? `<span class="def-example">${escapeHtml(def.example)}</span>` : ''}
        </div>
      </li>`).join('');

    const syns = (meaning.synonyms || []).slice(0, 7);
    const ants = (meaning.antonyms || []).slice(0, 5);

    const synHtml = syns.length ? `
      <div class="word-chips-row">
        <span class="chips-label">Synonyms</span>
        ${syns.map(s => `<button class="chip chip-syn" data-word="${escapeAttr(s)}">${escapeHtml(s)}</button>`).join('')}
      </div>` : '';

    const antHtml = ants.length ? `
      <div class="word-chips-row" style="border-top:none;padding-top:6px;margin-top:0;">
        <span class="chips-label">Antonyms</span>
        ${ants.map(a => `<button class="chip chip-ant" data-word="${escapeAttr(a)}">${escapeHtml(a)}</button>`).join('')}
      </div>` : '';

    card.innerHTML = `
      <span class="pos-badge">${escapeHtml(meaning.partOfSpeech || '')}</span>
      <ul class="definitions-list">${defs}</ul>
      ${synHtml}${antHtml}`;

    card.querySelectorAll('.chip-syn, .chip-ant').forEach(chip => {
      chip.addEventListener('click', () => {
        searchInput.value = chip.dataset.word;
        handleSearch();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    meaningsList.appendChild(card);
  });

  if (data.sourceUrls?.length) {
    sourceLinks.innerHTML = data.sourceUrls.map(url => `
      <a class="source-link" href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">
        ${escapeHtml(url)}<i class="ti ti-external-link" style="font-size:11px;opacity:.65;flex-shrink:0;"></i>
      </a>`).join('');
    sourceFooter.removeAttribute('hidden');
  } else {
    sourceFooter.setAttribute('hidden', '');
  }

  document.title = `${data.word} \u2014 Sirrch Dictionary`;
}

async function handleSearch() {
  const word = searchInput.value.trim();
  if (!word) { searchInput.focus(); return; }

  if (abortController) abortController.abort();
  abortController = new AbortController();

  wordTitle.textContent = word;
  phonetic.textContent  = '';
  playBtn.setAttribute('hidden', '');
  sourceFooter.setAttribute('hidden', '');
  resetAudioState();
  renderSkeletons();
  showResults();

  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
      { signal: abortController.signal }
    );
    if (!res.ok) {
      showError(word, false);
      document.title = 'Sirrch \u2014 Instant Word Definitions';
      return;
    }
    const data = await res.json();
    if (!data?.[0]) { showError(word, false); return; }
    addRecent(word);
    renderResults(data[0]);
  } catch (err) {
    if (err.name === 'AbortError') return;
    showError(word, true);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  return String(str).replace(/"/g, '&quot;');
}

function checkUrlQuery() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) {
    searchInput.value = q.trim();
    handleSearch();
  }
}

themeBtn.addEventListener('click', toggleTheme);
searchBtn.addEventListener('click', handleSearch);
playBtn.addEventListener('click', handlePlay);

tryAgainBtn.addEventListener('click', () => {
  showEmpty();
  searchInput.value = '';
  searchInput.focus();
  document.title = 'Sirrch \u2014 Instant Word Definitions';
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleSearch();
});

document.querySelectorAll('.chip-suggest').forEach(chip => {
  chip.addEventListener('click', () => {
    searchInput.value = chip.dataset.word;
    handleSearch();
  });
});

initTheme();
renderRecent();
checkUrlQuery();
