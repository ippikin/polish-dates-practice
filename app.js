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
        this.history = JSON.parse(savedHistory);
        this.renderHistory();
      } catch (e) {
        console.error('Failed to parse history', e);
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
    this.selectors.checkBtn.addEventListener('click', () => this.checkAnswer());
    this.selectors.userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.checkAnswer();
      }
    });

    this.selectors.revealBtn.addEventListener('click', () => this.revealAnswer());
    this.selectors.skipBtn.addEventListener('click', () => this.newRound());

    this.selectors.challengeRevealBtn.addEventListener('click', () => this.revealAnswer());
    this.selectors.challengeSkipBtn.addEventListener('click', () => this.newRound());

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

    // Reset UI Elements
    this.selectors.feedbackEl.className = 'feedback hidden';

    if (this.mode === 'challenge') {
      this.selectors.standardInputForm.classList.add('hidden');
      this.selectors.grammarChoiceForm.classList.remove('hidden');

      this.selectors.contextBadge.textContent = 'Grammar Challenge: Który czy Kiedy?';
      this.selectors.contextPrompt.textContent = 'Posłuchaj zdania i wybierz poprawną formę gramatyczną:';

      this.selectors.grammarSentenceBox.innerHTML = this.currentRound.sentenceHtml;

      // Populate Choices
      this.selectors.grammarChoicesGrid.innerHTML = '';
      this.currentRound.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = `grammar-choice-btn ${opt.endsWith('ego') ? 'gen-choice' : 'nom-choice'}`;
        const endingLabel = opt.endsWith('ego') ? 'Dopełniacz (-ego)' : 'Mianownik (-y / -i)';
        btn.innerHTML = `
          <span>${opt}</span>
          <span class="choice-ending">${endingLabel}</span>
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
        this.selectors.inputHelperText.innerHTML = 'Wpisz datę w formacie dzień.miesiąc (np. <strong>22.09</strong>):';
      } else if (this.mode === 'kiedy') {
        this.selectors.contextBadge.textContent = this.currentRound.promptText || 'Pytanie: Kiedy?';
        this.selectors.contextPrompt.textContent = 'Posłuchaj daty wydarzenia (Dopełniacz: -ego) i wpisz DD.MM:';
        this.selectors.userInput.placeholder = 'np. 01.06';
        this.selectors.inputHelperText.innerHTML = 'Wpisz datę w formacie dzień.miesiąc (np. <strong>01.06</strong>):';
      } else if (this.mode === 'ranges') {
        this.selectors.contextBadge.textContent = 'Zakres dat: Od... do...';
        this.selectors.contextPrompt.textContent = 'Posłuchaj zakresu dat i wpisz początek i koniec (DD.MM - DD.MM):';
        this.selectors.userInput.placeholder = 'np. 02.03 - 09.03';
        this.selectors.inputHelperText.innerHTML = 'Wpisz zakres w formacie <strong>02.03 - 09.03</strong>:';
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
    return str.replace(/\s+/g, ' ').replace(/[\/,-]/g, '.').replace(/\s*\.\s*/g, '.').trim();
  }

  checkAnswer() {
    if (this.mode === 'challenge') return;

    const raw = this.selectors.userInput.value.trim();
    if (!raw) return;

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
      const [d, m] = norm.split('.');
      if (d && m) {
        const padded = `${this.pad(parseInt(d, 10))}.${this.pad(parseInt(m, 10))}`;
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
      spelling: this.currentRound.spelling
    });

    if (this.history.length > 20) {
      this.history.pop();
    }

    if (this.mode !== 'challenge') {
      this.selectors.userInput.disabled = true;
      this.selectors.checkBtn.disabled = true;
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

    this.stats.total += 1;
    this.stats.streak = 0;

    this.showFeedback(false, true);

    this.history.unshift({
      id: Date.now(),
      mode: this.mode,
      displayDate: this.currentRound.displayDate,
      guess: 'Revealed',
      correct: false,
      spelling: this.currentRound.spelling,
      revealed: true
    });

    if (this.history.length > 20) {
      this.history.pop();
    }

    if (this.mode !== 'challenge') {
      this.selectors.userInput.disabled = true;
      this.selectors.checkBtn.disabled = true;
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
      setTimeout(() => this.newRound(), 0);
    });

    const nextKeyListener = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        document.removeEventListener('keydown', nextKeyListener);
        const btn = document.getElementById('next-round-btn');
        if (btn) btn.click();
      }
    };
    document.addEventListener('keydown', nextKeyListener);
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
        : (item.guess !== null ? item.guess : 'None');

      li.innerHTML = `
        <div class="history-header">
          ${badge}
          <span class="history-number">${item.displayDate}</span>
          <span class="history-guess">Guess: ${guessStr}</span>
          <button class="history-replay-btn" title="Replay Audio" data-text="${item.spelling}">🔊</button>
        </div>
        <div class="history-spelling">${item.spelling}</div>
      `;

      const replayBtn = li.querySelector('.history-replay-btn');
      replayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = e.target.dataset.text;
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
