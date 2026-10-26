/**
 * Daty po Polsku (Polish Dates Practice)
 * Logic, Grammar Declension Engine (Który vs Kiedy), Speech Synthesis & State Management
 */

class PolishDatesPractice {
  constructor() {
    this.mode = 'ktory'; // 'ktory', 'kiedy', 'challenge', 'ranges'
    this.speechRate = 1.0;
    this.synth = window.speechSynthesis;
    this.polishVoice = null;
    this.voices = [];

    // Current Round State
    this.currentRound = null;
    this.isAnsweredState = false;

    // Stats
    this.stats = {
      correct: 0,
      total: 0,
      streak: 0,
      maxStreak: 0
    };

    // History Log
    this.history = [];

    // Polish Dates Grammar Reference
    this.daysGrammar = {
      1: { nom: 'pierwszy', gen: 'pierwszego' },
      2: { nom: 'drugi', gen: 'drugiego' },
      3: { nom: 'trzeci', gen: 'trzeciego' },
      4: { nom: 'czwarty', gen: 'czwartego' },
      5: { nom: 'piąty', gen: 'piątego' },
      6: { nom: 'szósty', gen: 'szóstego' },
      7: { nom: 'siódmy', gen: 'siódmego' },
      8: { nom: 'ósmy', gen: 'ósmego' },
      9: { nom: 'dziewiąty', gen: 'dziewiątego' },
      10: { nom: 'dziesiąty', gen: 'dziesiątego' },
      11: { nom: 'jedenasty', gen: 'jedenastego' },
      12: { nom: 'dwunasty', gen: 'dwunastego' },
      13: { nom: 'trzynasty', gen: 'trzynastego' },
      14: { nom: 'czternasty', gen: 'czternastego' },
      15: { nom: 'piętnasty', gen: 'piętnastego' },
      16: { nom: 'szesnasty', gen: 'szesnastego' },
      17: { nom: 'siedemnasty', gen: 'siedemnastego' },
      18: { nom: 'osiemnasty', gen: 'osiemnastego' },
      19: { nom: 'dziewiętnasty', gen: 'dziewiętnastego' },
      20: { nom: 'dwudziesty', gen: 'dwudziestego' },
      21: { nom: 'dwudziesty pierwszy', gen: 'dwudziestego pierwszego' },
      22: { nom: 'dwudziesty drugi', gen: 'dwudziestego drugiego' },
      23: { nom: 'dwudziesty trzeci', gen: 'dwudziestego trzeciego' },
      24: { nom: 'dwudziesty czwarty', gen: 'dwudziestego czwartego' },
      25: { nom: 'dwudziesty piąty', gen: 'dwudziestego piątego' },
      26: { nom: 'dwudziesty szósty', gen: 'dwudziestego szóstego' },
      27: { nom: 'dwudziesty siódmy', gen: 'dwudziestego siódmego' },
      28: { nom: 'dwudziesty ósmy', gen: 'dwudziestego ósmego' },
      29: { nom: 'dwudziesty dziewiąty', gen: 'dwudziestego dziewiątego' },
      30: { nom: 'trzydziesty', gen: 'trzydziestego' },
      31: { nom: 'trzydziesty pierwszy', gen: 'trzydziestego pierwszego' }
    };

    this.months = [
      { num: 1, name: 'styczeń', gen: 'stycznia', maxDays: 31 },
      { num: 2, name: 'luty', gen: 'lutego', maxDays: 28 },
      { num: 3, name: 'marzec', gen: 'marca', maxDays: 31 },
      { num: 4, name: 'kwiecień', gen: 'kwietnia', maxDays: 30 },
      { num: 5, name: 'maj', gen: 'maja', maxDays: 31 },
      { num: 6, name: 'czerwiec', gen: 'czerwca', maxDays: 30 },
      { num: 7, name: 'lipiec', gen: 'lipca', maxDays: 31 },
      { num: 8, name: 'sierpień', gen: 'sierpnia', maxDays: 31 },
      { num: 9, name: 'wrzesień', gen: 'września', maxDays: 30 },
      { num: 10, name: 'październik', gen: 'października', maxDays: 31 },
      { num: 11, name: 'listopad', gen: 'listopada', maxDays: 30 },
      { num: 12, name: 'grudzień', gen: 'grudnia', maxDays: 31 }
    ];

    // UI Selectors
    this.selectors = {
      modeTabs: document.querySelectorAll('.mode-tab'),
      contextBanner: document.getElementById('context-banner'),
      contextBadge: document.getElementById('context-badge'),
      contextPrompt: document.getElementById('context-prompt'),
      playBtn: document.getElementById('play-btn'),
      playSlowBtn: document.getElementById('play-slow-btn'),
      audioHint: document.getElementById('audio-hint'),
      transcriptToggleBtn: document.getElementById('transcript-toggle-btn'),
      transcriptBtnLabel: document.getElementById('transcript-btn-label'),
      spokenTranscriptCard: document.getElementById('spoken-transcript-card'),
      spokenTranscriptText: document.getElementById('spoken-transcript-text'),
      standardInputForm: document.getElementById('standard-input-form'),
      userInput: document.getElementById('user-input'),
      inputHelperText: document.getElementById('input-helper-text'),
      monthChips: document.querySelectorAll('.month-chip'),
      checkBtn: document.getElementById('check-btn'),
      revealBtn: document.getElementById('reveal-btn'),
      skipBtn: document.getElementById('skip-btn'),
      grammarChoiceForm: document.getElementById('grammar-choice-form'),
      grammarSentenceBox: document.getElementById('grammar-sentence-box'),
      grammarChoicesGrid: document.getElementById('grammar-choices-grid'),
      challengeRevealBtn: document.getElementById('challenge-reveal-btn'),
      challengeSkipBtn: document.getElementById('challenge-skip-btn'),
      feedbackEl: document.getElementById('feedback'),
      feedbackTitle: document.getElementById('feedback-title'),
      feedbackMessage: document.getElementById('feedback-message'),
      feedbackSpoken: document.getElementById('feedback-spoken'),
      feedbackSpokenText: document.getElementById('feedback-spoken-text'),
      feedbackSpelling: document.getElementById('feedback-spelling'),
      grammarRuleTip: document.getElementById('grammar-rule-tip'),
      voiceSelect: document.getElementById('voice-select'),
      voiceWarning: document.getElementById('voice-warning'),
      statsCorrect: document.getElementById('stats-correct'),
      statsTotal: document.getElementById('stats-total'),
      statsAccuracy: document.getElementById('stats-accuracy'),
      statsStreak: document.getElementById('stats-streak'),
      statsMaxStreak: document.getElementById('stats-max-streak'),
      resetStatsBtn: document.getElementById('reset-stats-btn'),
      historyList: document.getElementById('history-list')
    };
  }

  init() {
    this.loadStateFromStorage();
    this.setupEventListeners();
    this.initVoices();

    if (this.synth && this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.initVoices();
    }

    this.newRound();
  }

  loadStateFromStorage() {
    const savedStats = localStorage.getItem('pl_dates_stats');
    if (savedStats) {
      try {
        this.stats = JSON.parse(savedStats);
      } catch (e) {
        console.error('Failed to parse stats', e);
      }
    }

    const savedHistory = localStorage.getItem('pl_dates_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        this.history = Array.isArray(parsed) ? parsed : [];
        this.renderHistory();
      } catch (e) {
        console.error('Failed to parse history', e);
        this.history = [];
      }
    }

    const savedRate = localStorage.getItem('pl_dates_rate');
    if (savedRate) {
      this.speechRate = parseFloat(savedRate);
    }

    const savedMode = localStorage.getItem('pl_dates_mode');
    if (savedMode && ['ktory', 'kiedy', 'challenge', 'ranges'].includes(savedMode)) {
      this.mode = savedMode;
      this.updateActiveModeTab();
    }

    this.updateStatsUI();
  }

  saveStateToStorage() {
    localStorage.setItem('pl_dates_stats', JSON.stringify(this.stats));
    localStorage.setItem('pl_dates_history', JSON.stringify(this.history));
    localStorage.setItem('pl_dates_rate', this.speechRate);
    localStorage.setItem('pl_dates_mode', this.mode);
  }

  updateActiveModeTab() {
    this.selectors.modeTabs.forEach(tab => {
      if (tab.dataset.mode === this.mode) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Update cheat sheet / helper cards to be context specific for the selected mode
    const ruleKtory = document.querySelector('.rule-ktory');
    const ruleKiedy = document.querySelector('.rule-kiedy');
    const ruleOdDo = document.querySelector('.rule-od-do');

    [ruleKtory, ruleKiedy, ruleOdDo].forEach(el => {
      if (el) el.classList.remove('active-rule', 'dimmed-rule');
    });

    if (this.mode === 'ktory') {
      if (ruleKtory) ruleKtory.classList.add('active-rule');
      if (ruleKiedy) ruleKiedy.classList.add('dimmed-rule');
      if (ruleOdDo) ruleOdDo.classList.add('dimmed-rule');
    } else if (this.mode === 'kiedy') {
      if (ruleKiedy) ruleKiedy.classList.add('active-rule');
      if (ruleKtory) ruleKtory.classList.add('dimmed-rule');
      if (ruleOdDo) ruleOdDo.classList.add('dimmed-rule');
    } else if (this.mode === 'ranges') {
      if (ruleOdDo) ruleOdDo.classList.add('active-rule');
      if (ruleKtory) ruleKtory.classList.add('dimmed-rule');
      if (ruleKiedy) ruleKiedy.classList.add('dimmed-rule');
    } else if (this.mode === 'challenge') {
      // In challenge mode, highlight both to show the contrast
      if (ruleKtory) ruleKtory.classList.add('active-rule');
      if (ruleKiedy) ruleKiedy.classList.add('active-rule');
      if (ruleOdDo) ruleOdDo.classList.add('dimmed-rule');
    }
  }

  setupEventListeners() {
    // Mode Switcher
    this.selectors.modeTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const targetMode = e.currentTarget.dataset.mode;
        if (this.mode !== targetMode) {
          this.mode = targetMode;
          this.updateActiveModeTab();
          this.saveStateToStorage();
          this.newRound();
        }
      });
    });

    // Audio Playback
    this.selectors.playBtn.addEventListener('click', () => {
      this.speechRate = 1.0;
      this.saveStateToStorage();
      this.speakCurrentRound(1.0);
      if (this.mode !== 'challenge') {
        this.selectors.userInput.focus();
      }
    });

    this.selectors.playSlowBtn.addEventListener('click', () => {
      this.speechRate = 0.55;
      this.saveStateToStorage();
      this.speakCurrentRound(0.55);
      if (this.mode !== 'challenge') {
        this.selectors.userInput.focus();
      }
    });

    // Form Submissions
    this.selectors.checkBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.isAnsweredState) {
        this.newRound();
      } else {
        this.checkAnswer();
      }
    });

    this.selectors.userInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (this.isAnsweredState) {
          this.newRound();
        } else {
          this.checkAnswer();
        }
      }
    });

    // Global Enter key & Challenge mode number keys (1 & 2)
    document.addEventListener('keydown', (e) => {
      if (this.mode === 'challenge' && !this.isAnsweredState && this.currentRound && this.currentRound.options) {
        if (e.key === '1' && this.currentRound.options[0]) {
          e.preventDefault();
          this.handleChallengeChoice(this.currentRound.options[0]);
          return;
        }
        if (e.key === '2' && this.currentRound.options[1]) {
          e.preventDefault();
          this.handleChallengeChoice(this.currentRound.options[1]);
          return;
        }
      }

      if (e.key === 'Enter') {
        if (document.activeElement === this.selectors.userInput) {
          return;
        }
        e.preventDefault();
        if (this.isAnsweredState) {
          this.newRound();
        } else if (this.mode !== 'challenge') {
          this.checkAnswer();
        }
      }
    });

    this.selectors.revealBtn.addEventListener('click', () => this.revealAnswer());
    this.selectors.skipBtn.addEventListener('click', () => this.newRound());

    this.selectors.challengeRevealBtn.addEventListener('click', () => this.revealAnswer());
    this.selectors.challengeSkipBtn.addEventListener('click', () => this.newRound());

    // Transcript Toggle
    if (this.selectors.transcriptToggleBtn) {
      this.selectors.transcriptToggleBtn.addEventListener('click', () => {
        this.toggleTranscript();
      });
    }

    // Month Chips Quick Selection
    this.selectors.monthChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const m = chip.dataset.month;
        let current = this.selectors.userInput.value.trim();
        // If current has a day e.g. "15", turn into "15.05"
        if (/^\d{1,2}$/.test(current)) {
          const d = current.padStart(2, '0');
          this.selectors.userInput.value = `${d}.${m}`;
        } else if (current.includes('.')) {
          const parts = current.split('.');
          const d = parts[0] ? parts[0].padStart(2, '0') : '01';
          this.selectors.userInput.value = `${d}.${m}`;
        } else {
          this.selectors.userInput.value = `.${m}`;
          this.selectors.userInput.setSelectionRange(0, 0);
        }
        this.selectors.userInput.focus();
      });
    });

    // Reset Stats
    this.selectors.resetStatsBtn.addEventListener('click', () => this.resetStats());

    // Voice Selection
    this.selectors.voiceSelect.addEventListener('change', (e) => {
      const idx = e.target.value;
      if (idx !== '') {
        this.polishVoice = this.voices[idx];
        this.speakCurrentRound();
      }
    });
  }

  initVoices() {
    if (!this.synth) return;
    const all = this.synth.getVoices();
    this.voices = all.filter(v => v.lang.includes('pl-PL') || v.lang.startsWith('pl'));

    this.selectors.voiceSelect.innerHTML = '';

    if (this.voices.length === 0) {
      this.selectors.voiceSelect.innerHTML = '<option value="">No Polish voice found - falling back to browser default</option>';
      this.selectors.voiceWarning.style.display = 'block';
      this.voices = all;
      all.forEach((voice, index) => {
        const opt = document.createElement('option');
        opt.value = index;
        opt.textContent = `${voice.name} (${voice.lang})`;
        this.selectors.voiceSelect.appendChild(opt);
      });
      this.polishVoice = all.find(v => v.default) || all[0];
    } else {
      this.selectors.voiceWarning.style.display = 'none';
      this.voices.forEach((voice, index) => {
        const opt = document.createElement('option');
        opt.value = index;
        opt.textContent = `${voice.name} (${voice.lang})`;
        if (voice.name.includes('Google') || voice.name.includes('Natural')) {
          opt.selected = true;
          this.polishVoice = voice;
        }
        this.selectors.voiceSelect.appendChild(opt);
      });
      if (!this.polishVoice) {
        this.polishVoice = this.voices[0];
      }
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  formatSpokenSentenceHtml(spokenText, spelling) {
    if (!spokenText) return '';
    if (!spelling) return `„${this.escapeHtml(spokenText)}”`;

    const cleanSpoken = spokenText.trim();
    const cleanSpelling = spelling.trim();
    const lowerSpoken = cleanSpoken.toLowerCase();
    const lowerSpelling = cleanSpelling.toLowerCase();

    const idx = lowerSpoken.indexOf(lowerSpelling);
    if (idx !== -1) {
      const before = this.escapeHtml(cleanSpoken.substring(0, idx));
      const match = this.escapeHtml(cleanSpoken.substring(idx, idx + cleanSpelling.length));
      const after = this.escapeHtml(cleanSpoken.substring(idx + cleanSpelling.length));
      return `„${before}<span class="polish-spelling-highlight">${match}</span>${after}”`;
    }
    return `„${this.escapeHtml(cleanSpoken)}”`;
  }

  toggleTranscript(forceShow = null) {
    if (!this.selectors.spokenTranscriptCard || !this.currentRound) return;
    const isHidden = this.selectors.spokenTranscriptCard.classList.contains('hidden');
    const shouldShow = forceShow !== null ? forceShow : isHidden;

    if (shouldShow) {
      this.selectors.spokenTranscriptCard.classList.remove('hidden');
      if (this.selectors.transcriptToggleBtn) {
        this.selectors.transcriptToggleBtn.classList.add('active');
      }
      if (this.selectors.transcriptBtnLabel) {
        this.selectors.transcriptBtnLabel.textContent = 'Ukryj co powiedziano (Hide spoken text)';
      }
      if (this.selectors.spokenTranscriptText) {
        this.selectors.spokenTranscriptText.innerHTML = this.formatSpokenSentenceHtml(
          this.currentRound.spokenText,
          this.currentRound.spelling
        );
      }
    } else {
      this.selectors.spokenTranscriptCard.classList.add('hidden');
      if (this.selectors.transcriptToggleBtn) {
        this.selectors.transcriptToggleBtn.classList.remove('active');
      }
      if (this.selectors.transcriptBtnLabel) {
        this.selectors.transcriptBtnLabel.textContent = 'Pokaż co powiedziano (Reveal spoken text)';
      }
    }
  }

  pad(num) {
    return num.toString().padStart(2, '0');
  }

  generateRandomDate() {
    const monthObj = this.months[Math.floor(Math.random() * this.months.length)];
    const day = Math.floor(Math.random() * monthObj.maxDays) + 1;
    return { day, month: monthObj };
  }

  generateRound() {
    if (this.mode === 'ktory') {
      const { day, month } = this.generateRandomDate();
      const nomDay = this.daysGrammar[day].nom;
      const genMonth = month.gen;
      const dateStr = `${this.pad(day)}.${this.pad(month.num)}`;
      const phrases = [
        `Dziś jest ${nomDay} ${genMonth}.`,
        `Dzisiaj jest ${nomDay} ${genMonth}.`,
        `Dzień dobry, dzisiaj jest ${nomDay} ${genMonth}.`
      ];
      const sentence = phrases[Math.floor(Math.random() * phrases.length)];

      return {
        mode: 'ktory',
        day,
        month,
        expectedAnswer: dateStr,
        displayDate: dateStr,
        spokenText: sentence,
        spelling: `${nomDay} ${genMonth}`,
        ruleTip: `<strong>Który dziś jest?</strong> wymaga Mianownika (końcówka <strong>-y / -i</strong>: <em>${nomDay}</em>) oraz dopełniacza dla miesiąca (<em>${genMonth}</em>).`
      };
    } 
    
    if (this.mode === 'kiedy') {
      const { day, month } = this.generateRandomDate();
      const genDay = this.daysGrammar[day].gen;
      const genMonth = month.gen;
      const dateStr = `${this.pad(day)}.${this.pad(month.num)}`;

      const contexts = [
        { text: `Mam urodziny ${genDay} ${genMonth}.`, prompt: 'Kiedy masz urodziny?' },
        { text: `Sylwester jest ${genDay} ${genMonth}.`, prompt: 'Kiedy jest to wydarzenie?' },
        { text: `Kurs kończy się ${genDay} ${genMonth}.`, prompt: 'Kiedy kończy się kurs?' },
        { text: `Mam test w piątek, ${genDay} ${genMonth}.`, prompt: 'Kiedy masz test?' },
        { text: `Mam wizytę u lekarza ${genDay} ${genMonth}.`, prompt: 'Kiedy masz wizytę?' },
        { text: `Dzień Dziecka jest ${genDay} ${genMonth}.`, prompt: 'Kiedy jest to święto?' },
        { text: `Jesień rozpoczyna się ${genDay} ${genMonth}.`, prompt: 'Kiedy rozpoczyna się jesień?' },
        { text: `Wakacje zaczynają się ${genDay} ${genMonth}.`, prompt: 'Kiedy zaczynają się wakacje?' }
      ];
      const ctx = contexts[Math.floor(Math.random() * contexts.length)];

      return {
        mode: 'kiedy',
        day,
        month,
        expectedAnswer: dateStr,
        displayDate: dateStr,
        spokenText: ctx.text,
        promptText: ctx.prompt,
        spelling: `${genDay} ${genMonth}`,
        ruleTip: `<strong>Kiedy?</strong> dla wydarzeń wymaga Dopełniacza (końcówka <strong>-ego</strong>: <em>${genDay}</em>) oraz dopełniacza dla miesiąca (<em>${genMonth}</em>).`
      };
    }

    if (this.mode === 'challenge') {
      const { day, month } = this.generateRandomDate();
      const nomDay = this.daysGrammar[day].nom;
      const genDay = this.daysGrammar[day].gen;
      const genMonth = month.gen;
      const dateStr = `${this.pad(day)}.${this.pad(month.num)}`;

      // 50% chance Który (Nominative), 50% chance Kiedy (Genitive)
      const isNom = Math.random() < 0.5;

      let sentenceTpl, spokenText, expectedChoice, ruleTip;

      if (isNom) {
        expectedChoice = nomDay;
        sentenceTpl = `Dziś jest <span class="blank">[ ? ]</span> (${this.pad(day)}) ${genMonth}.`;
        spokenText = `Dziś jest ${nomDay} ${genMonth}.`;
        ruleTip = `W zdaniu pytającym <em>Który dziś jest?</em> (np. <em>Dziś jest...</em>) używamy Mianownika (<strong>-y / -i</strong>: <em>${nomDay}</em>).`;
      } else {
        expectedChoice = genDay;
        const events = [
          `Mam urodziny <span class="blank">[ ? ]</span> (${this.pad(day)}) ${genMonth}.`,
          `Kurs kończy się <span class="blank">[ ? ]</span> (${this.pad(day)}) ${genMonth}.`,
          `Mam test <span class="blank">[ ? ]</span> (${this.pad(day)}) ${genMonth}.`,
          `Wizyta u lekarza jest <span class="blank">[ ? ]</span> (${this.pad(day)}) ${genMonth}.`,
          `Koncert odbędzie się <span class="blank">[ ? ]</span> (${this.pad(day)}) ${genMonth}.`
        ];
        sentenceTpl = events[Math.floor(Math.random() * events.length)];
        spokenText = sentenceTpl.replace('<span class="blank">[ ? ]</span>', genDay).replace(`(${this.pad(day)})`, '').replace(/\s+/g, ' ');
        ruleTip = `W zdaniu odpowiadającym na <em>Kiedy?</em> (urodziny, test, kurs) używamy Dopełniacza (<strong>-ego</strong>: <em>${genDay}</em>).`;
      }

      return {
        mode: 'challenge',
        day,
        month,
        isNom,
        expectedChoice,
        options: [nomDay, genDay],
        sentenceHtml: sentenceTpl,
        displayDate: dateStr,
        spokenText,
        spelling: `${expectedChoice} ${genMonth}`,
        ruleTip
      };
    }

    if (this.mode === 'ranges') {
      const month = this.months[Math.floor(Math.random() * this.months.length)];
      const maxD = month.maxDays;
      const d1 = Math.floor(Math.random() * (maxD - 5)) + 1;
      const span = Math.floor(Math.random() * 8) + 2;
      const d2 = Math.min(d1 + span, maxD);

      const genD1 = this.daysGrammar[d1].gen;
      const genD2 = this.daysGrammar[d2].gen;
      const genMonth = month.gen;
      const dateRangeStr = `${this.pad(d1)}.${this.pad(month.num)} - ${this.pad(d2)}.${this.pad(month.num)}`;

      const contexts = [
        `Będę w Warszawie od ${genD1} do ${genD2} ${genMonth}.`,
        `Jestem na urlopie od ${genD1} do ${genD2} ${genMonth}.`,
        `Festiwal trwa od ${genD1} do ${genD2} ${genMonth}.`,
        `Będziemy w Polsce od ${genD1} do ${genD2} ${genMonth}.`
      ];
      const sentence = contexts[Math.floor(Math.random() * contexts.length)];

      return {
        mode: 'ranges',
        d1,
        d2,
        month,
        expectedAnswer: `${this.pad(d1)}.${this.pad(month.num)} - ${this.pad(d2)}.${this.pad(month.num)}`,
        displayDate: dateRangeStr,
        spokenText: sentence,
        spelling: `od ${genD1} do ${genD2} ${genMonth}`,
        ruleTip: `W wyrażeniach <strong>od ... do ...</strong> obie daty przyjmują końcówkę Dopełniacza (<strong>-ego</strong>): <em>od ${genD1} do ${genD2}</em>.`
      };
    }
  }

  newRound() {
    this.currentRound = this.generateRound();
    this.isAnsweredState = false;

    // Reset UI Elements
    this.selectors.feedbackEl.className = 'feedback hidden';

    // Reset Transcript Box
    if (this.selectors.spokenTranscriptCard) {
      this.selectors.spokenTranscriptCard.classList.add('hidden');
    }
    if (this.selectors.transcriptToggleBtn) {
      this.selectors.transcriptToggleBtn.classList.remove('active');
    }
    if (this.selectors.transcriptBtnLabel) {
      this.selectors.transcriptBtnLabel.textContent = 'Pokaż co powiedziano (Reveal spoken text)';
    }

    if (this.mode === 'challenge') {
      this.selectors.standardInputForm.classList.add('hidden');
      this.selectors.grammarChoiceForm.classList.remove('hidden');

      this.selectors.contextBadge.textContent = 'Grammar Challenge: Który czy Kiedy?';
      this.selectors.contextPrompt.textContent = 'Posłuchaj zdania i wybierz poprawną formę gramatyczną:';

      this.selectors.grammarSentenceBox.innerHTML = this.currentRound.sentenceHtml;

      // Populate Choices
      this.selectors.grammarChoicesGrid.innerHTML = '';
      this.currentRound.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = `grammar-choice-btn ${opt.endsWith('ego') ? 'gen-choice' : 'nom-choice'}`;
        const endingLabel = opt.endsWith('ego') ? 'Dopełniacz (-ego)' : 'Mianownik (-y / -i)';
        btn.innerHTML = `
          <span>${opt}</span>
          <span class="choice-ending">${endingLabel} <span class="kbd">${idx + 1}</span></span>
        `;
        btn.addEventListener('click', () => this.handleChallengeChoice(opt));
        this.selectors.grammarChoicesGrid.appendChild(btn);
      });
    } else {
      this.selectors.standardInputForm.classList.remove('hidden');
      this.selectors.grammarChoiceForm.classList.add('hidden');

      this.selectors.userInput.disabled = false;
      this.selectors.checkBtn.disabled = false;
      this.selectors.revealBtn.disabled = false;
      this.selectors.userInput.value = '';

      if (this.mode === 'ktory') {
        this.selectors.contextBadge.textContent = 'Pytanie: Który dziś jest?';
        this.selectors.contextPrompt.textContent = 'Posłuchaj dzisiejszej daty (Mianownik: -y / -i) i wpisz DD.MM:';
        this.selectors.userInput.placeholder = 'np. 22.09';
        this.selectors.inputHelperText.innerHTML = '📅 <strong>Mianownik (-y / -i)</strong>: Wpisz datę (np. <strong>22.09</strong>) lub wybierz miesiąc poniżej:';
      } else if (this.mode === 'kiedy') {
        this.selectors.contextBadge.textContent = this.currentRound.promptText || 'Pytanie: Kiedy?';
        this.selectors.contextPrompt.textContent = 'Posłuchaj daty wydarzenia (Dopełniacz: -ego) i wpisz DD.MM:';
        this.selectors.userInput.placeholder = 'np. 01.06';
        this.selectors.inputHelperText.innerHTML = '🎂 <strong>Dopełniacz (-ego)</strong>: Wpisz datę (np. <strong>01.06</strong>) lub wybierz miesiąc poniżej:';
      } else if (this.mode === 'ranges') {
        this.selectors.contextBadge.textContent = 'Zakres dat: Od... do...';
        this.selectors.contextPrompt.textContent = 'Posłuchaj zakresu dat i wpisz początek i koniec (DD.MM - DD.MM):';
        this.selectors.userInput.placeholder = 'np. 02.03 - 09.03';
        this.selectors.inputHelperText.innerHTML = '↔️ <strong>Od... do...</strong> (obie daty w <strong>-ego</strong>): Wpisz zakres (np. <strong>02.03 - 09.03</strong>):';
      }

      setTimeout(() => {
        this.selectors.userInput.focus();
      }, 50);
    }

    setTimeout(() => {
      this.speakCurrentRound();
    }, 150);
  }

  speakCurrentRound(speed = null) {
    if (!this.currentRound) return;
    const rate = speed !== null ? speed : this.speechRate;
    this.speakText(this.currentRound.spokenText, rate);
  }

  speakText(text, speed = 1.0) {
    if (!this.synth) return;
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.mode !== 'challenge' && this.selectors.userInput && !this.selectors.userInput.disabled) {
      this.selectors.userInput.focus();
    }

    if (this.polishVoice) {
      utterance.voice = this.polishVoice;
    }

    utterance.lang = 'pl-PL';
    utterance.rate = speed;
    utterance.pitch = 1.0;

    const activeBtn = speed < 0.8 ? this.selectors.playSlowBtn : this.selectors.playBtn;
    activeBtn.classList.add('playing');

    utterance.onend = () => activeBtn.classList.remove('playing');
    utterance.onerror = () => activeBtn.classList.remove('playing');

    this.synth.speak(utterance);
  }

  normalizeDateInput(str) {
    if (!str) return '';
    let s = str.trim().toLowerCase();

    // Map common Polish month names/abbreviations to 2-digit numbers
    const monthWords = {
      'stycznia': '01', 'styczen': '01', 'styczeń': '01', 'sty': '01',
      'lutego': '02', 'luty': '02', 'lut': '02',
      'marca': '03', 'marzec': '03', 'mar': '03',
      'kwietnia': '04', 'kwiecien': '04', 'kwiecień': '04', 'kwi': '04',
      'maja': '05', 'maj': '05',
      'czerwca': '06', 'czerwiec': '06', 'cze': '06',
      'lipca': '07', 'lipiec': '07', 'lip': '07',
      'sierpnia': '08', 'sierpien': '08', 'sierpień': '08', 'sie': '08',
      'wrzesnia': '09', 'wrzesień': '09', 'wrzesien': '09', 'wrz': '09',
      'pazdziernika': '10', 'pazdziernik': '10', 'październik': '10', 'października': '10', 'paz': '10', 'paź': '10',
      'listopada': '11', 'listopad': '11', 'lis': '11',
      'grudnia': '12', 'grudzien': '12', 'grudzień': '12', 'gru': '12'
    };

    for (const [name, num] of Object.entries(monthWords)) {
      const reg = new RegExp(`\\b${name}\\b`, 'i');
      if (reg.test(s)) {
        s = s.replace(reg, num);
        break;
      }
    }

    return s
      .replace(/[\/,-]/g, '.')
      .replace(/\s+/g, ' ')
      .replace(/^(\d{1,2})\s+(\d{1,2})\.?$/, '$1.$2')
      .replace(/\s*\.\s*/g, '.')
      .replace(/\.+$/, '')
      .trim();
  }

  checkAnswer() {
    if (this.mode === 'challenge') return;

    const raw = this.selectors.userInput.value.trim();
    if (!raw) {
      this.selectors.userInput.focus();
      this.selectors.userInput.classList.add('input-error-shake');
      setTimeout(() => {
        this.selectors.userInput.classList.remove('input-error-shake');
      }, 500);
      return;
    }

    let isCorrect = false;

    if (this.mode === 'ranges') {
      // Compare e.g. "02.03 - 09.03"
      const cleaned = raw.replace(/\s*-\s*/, '-').replace(/\s+/g, '');
      const expectedClean = this.currentRound.expectedAnswer.replace(/\s*-\s*/, '-').replace(/\s+/g, '');
      isCorrect = cleaned === expectedClean;
    } else {
      // Normal single date e.g. 20.03
      const norm = this.normalizeDateInput(raw);
      const expected = this.currentRound.expectedAnswer;
      // Also allow 20.3 matching 20.03
      const parts = norm.split('.');
      if (parts.length >= 2 && parts[0] && parts[1]) {
        const padded = `${this.pad(parseInt(parts[0], 10))}.${this.pad(parseInt(parts[1], 10))}`;
        isCorrect = padded === expected;
      }
    }

    this.processOutcome(isCorrect, raw);
  }

  handleChallengeChoice(selectedOption) {
    const isCorrect = selectedOption === this.currentRound.expectedChoice;
    this.processOutcome(isCorrect, selectedOption);
  }

  processOutcome(isCorrect, userGuess) {
    this.isAnsweredState = true;
    this.stats.total += 1;
    if (isCorrect) {
      this.stats.correct += 1;
      this.stats.streak += 1;
      if (this.stats.streak > this.stats.maxStreak) {
        this.stats.maxStreak = this.stats.streak;
      }
      this.showFeedback(true);
    } else {
      this.stats.streak = 0;
      this.showFeedback(false);
    }

    this.history.unshift({
      id: Date.now(),
      mode: this.mode,
      displayDate: this.currentRound.displayDate,
      guess: userGuess,
      correct: isCorrect,
      spelling: this.currentRound.spelling,
      spokenText: this.currentRound.spokenText
    });

    if (this.history.length > 20) {
      this.history.pop();
    }

    if (this.mode !== 'challenge') {
      this.selectors.userInput.disabled = true;
      this.selectors.revealBtn.disabled = true;
    } else {
      const btns = this.selectors.grammarChoicesGrid.querySelectorAll('button');
      btns.forEach(b => b.disabled = true);
    }

    this.saveStateToStorage();
    this.updateStatsUI();
    this.renderHistory();

    this.attachNextButton();
  }

  revealAnswer() {
    if (!this.currentRound) return;

    this.isAnsweredState = true;
    this.stats.total += 1;
    this.stats.streak = 0;

    this.showFeedback(false, true);
    this.toggleTranscript(true);

    this.history.unshift({
      id: Date.now(),
      mode: this.mode,
      displayDate: this.currentRound.displayDate,
      guess: 'Revealed',
      correct: false,
      spelling: this.currentRound.spelling,
      spokenText: this.currentRound.spokenText,
      revealed: true
    });

    if (this.history.length > 20) {
      this.history.pop();
    }

    if (this.mode !== 'challenge') {
      this.selectors.userInput.disabled = true;
      this.selectors.revealBtn.disabled = true;
    } else {
      const btns = this.selectors.grammarChoicesGrid.querySelectorAll('button');
      btns.forEach(b => b.disabled = true);
    }

    this.saveStateToStorage();
    this.updateStatsUI();
    this.renderHistory();

    this.attachNextButton();
  }

  attachNextButton() {
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-primary next-round-btn';
    nextBtn.id = 'next-round-btn';
    nextBtn.innerHTML = 'Następna data (Next Date) <span class="kbd">Enter</span>';

    const existing = document.getElementById('next-round-btn');
    if (existing) existing.remove();

    this.selectors.feedbackEl.appendChild(nextBtn);
    nextBtn.focus();

    nextBtn.addEventListener('click', () => {
      nextBtn.remove();
      this.newRound();
    });
  }

  showFeedback(isCorrect, isRevealed = false) {
    this.selectors.feedbackEl.classList.remove('hidden', 'correct', 'incorrect');

    const existing = document.getElementById('next-round-btn');
    if (existing) existing.remove();

    if (isCorrect) {
      this.selectors.feedbackEl.classList.add('correct');
      this.selectors.feedbackTitle.textContent = 'Dobrze! (Correct!) 🎉';
      this.selectors.feedbackMessage.innerHTML = `Data (Date): <strong>${this.currentRound.displayDate}</strong>`;
    } else {
      this.selectors.feedbackEl.classList.add('incorrect');
      if (isRevealed) {
        this.selectors.feedbackTitle.textContent = 'Odkryta data (Revealed)';
      } else {
        this.selectors.feedbackTitle.textContent = 'Źle (Incorrect) 😢';
      }
      this.selectors.feedbackMessage.innerHTML = `Poprawna odpowiedź: <strong>${this.currentRound.displayDate}</strong>`;
    }

    if (this.selectors.feedbackSpokenText && this.currentRound) {
      this.selectors.feedbackSpokenText.innerHTML = this.formatSpokenSentenceHtml(
        this.currentRound.spokenText,
        this.currentRound.spelling
      );
    }

    this.selectors.feedbackSpelling.innerHTML = `Słownie (In words): <span class="polish-spelling-highlight">${this.currentRound.spelling}</span>`;
    this.selectors.grammarRuleTip.innerHTML = `💡 <strong>Reguła gramatyczna:</strong> ${this.currentRound.ruleTip}`;
  }

  updateStatsUI() {
    const accuracy = this.stats.total > 0
      ? Math.round((this.stats.correct / this.stats.total) * 100)
      : 0;

    this.selectors.statsCorrect.textContent = this.stats.correct;
    this.selectors.statsTotal.textContent = this.stats.total;
    this.selectors.statsAccuracy.textContent = `${accuracy}%`;
    this.selectors.statsStreak.textContent = this.stats.streak;
    this.selectors.statsMaxStreak.textContent = this.stats.maxStreak;
  }

  renderHistory() {
    this.selectors.historyList.innerHTML = '';

    if (this.history.length === 0) {
      this.selectors.historyList.innerHTML = '<li class="history-empty">Brak historii sesji (No session history yet)</li>';
      return;
    }

    this.history.forEach(item => {
      const li = document.createElement('li');
      li.className = `history-item ${item.correct ? 'history-correct' : 'history-incorrect'}`;

      const badge = item.correct
        ? '<span class="history-badge badge-correct">✓</span>'
        : '<span class="history-badge badge-incorrect">✗</span>';

      const guessStr = item.revealed
        ? '<i>revealed</i>'
        : (item.guess !== null ? this.escapeHtml(item.guess) : 'None');

      const spokenHtml = this.formatSpokenSentenceHtml(item.spokenText, item.spelling);

      li.innerHTML = `
        <div class="history-header">
          ${badge}
          <span class="history-number">${this.escapeHtml(item.displayDate)}</span>
          <span class="history-guess">Guess: ${guessStr}</span>
          <button class="history-replay-btn" title="Odtwórz zdanie (Replay Audio)" data-text="${this.escapeHtml(item.spokenText || item.spelling)}">🔊</button>
        </div>
        <div class="history-spoken">🗣️ ${spokenHtml}</div>
        <div class="history-spelling">Słownie: ${this.escapeHtml(item.spelling)}</div>
      `;

      const replayBtn = li.querySelector('.history-replay-btn');
      replayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = e.currentTarget.dataset.text;
        this.speakText(text, 1.0);
      });

      this.selectors.historyList.appendChild(li);
    });
  }

  resetStats() {
    if (confirm('Czy na pewno chcesz zresetować statystyki? (Are you sure you want to reset stats?)')) {
      this.stats = { correct: 0, total: 0, streak: 0, maxStreak: 0 };
      this.history = [];
      this.saveStateToStorage();
      this.updateStatsUI();
      this.renderHistory();
      this.newRound();
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const app = new PolishDatesPractice();
  app.init();
  window.appInstance = app;
});
