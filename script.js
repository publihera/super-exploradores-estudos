// =========================================================================
// SUPER EXPLORADORES — INTERACTIVE STUDY ENGINE (ICA & LANGUAGE ARTS)
// =========================================================================

let soundEnabled = true;
let starsCount = 0;
const unlockedItems = new Set();

const xpCountEl = document.getElementById('xp-count');
const progressEl = document.getElementById('study-progress');
const progressPercentEl = document.getElementById('progress-percent');
const soundToggleBtn = document.getElementById('sound-toggle');

// Award stars & update progress bar
function awardStar(itemId, points = 1) {
  if (unlockedItems.has(itemId)) return;
  unlockedItems.add(itemId);
  starsCount += points;
  if (xpCountEl) xpCountEl.textContent = String(starsCount);

  // Progress reaches 100% around 35 stars
  const pct = Math.min(100, Math.round((starsCount / 35) * 100));
  if (progressEl) progressEl.value = pct;
  if (progressPercentEl) progressPercentEl.textContent = `${pct}%`;
}

// Web Speech API (English pronunciation helper for kids)
function speakEnglish(text) {
  if (!soundEnabled || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.92; // Friendly clear speed for children
    utterance.pitch = 1.08;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Ignore speech synthesis errors on restricted platforms
  }
}

if (soundToggleBtn) {
  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggleBtn.setAttribute('aria-pressed', String(soundEnabled));
    soundToggleBtn.textContent = soundEnabled ? '🔊 Voz & Sons: ON' : '🔇 Voz & Sons: OFF';
    if (!soundEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  });
}

// =========================================================================
// 1. THE HUMAN BODY — INTERACTIVE SVG & 12 CARDS
// =========================================================================
const organCards = document.querySelectorAll('.organ-card');
const svgOrganSpots = document.querySelectorAll('.svg-organ-spot');
const spotIcon = document.getElementById('spot-icon');
const spotEn = document.getElementById('spot-en');
const spotPt = document.getElementById('spot-pt');
const spotFn = document.getElementById('spot-fn');
const spotSpeakBtn = document.getElementById('spot-speak-btn');

function selectOrgan(organName) {
  const targetCard = document.querySelector(`.organ-card[data-organ="${organName}"]`);
  if (!targetCard) return;

  organCards.forEach(c => c.classList.toggle('active', c === targetCard));
  svgOrganSpots.forEach(s => s.classList.toggle('active-spot', s.dataset.organ === organName));

  const en = targetCard.dataset.en || organName;
  const pt = targetCard.dataset.pt || '';
  const fn = targetCard.dataset.fn || '';
  const icon = targetCard.dataset.icon || '✨';

  if (spotIcon) spotIcon.textContent = icon;
  if (spotEn) spotEn.textContent = en;
  if (spotPt) spotPt.textContent = pt;
  if (spotFn) spotFn.textContent = fn;

  speakEnglish(en);
  awardStar(`organ-${organName}`, 1);
}

organCards.forEach(card => {
  card.addEventListener('click', () => selectOrgan(card.dataset.organ));
});

svgOrganSpots.forEach(spot => {
  spot.addEventListener('click', () => selectOrgan(spot.dataset.organ));
  spot.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectOrgan(spot.dataset.organ);
    }
  });
});

if (spotSpeakBtn) {
  spotSpeakBtn.addEventListener('click', () => {
    if (spotEn) speakEnglish(spotEn.textContent);
  });
}

// =========================================================================
// 2. THE RESPIRATORY SYSTEM — SIMULATOR
// =========================================================================
const btnInhale = document.getElementById('btn-inhale');
const btnExhale = document.getElementById('btn-exhale');
const lungsVisual = document.getElementById('lungs-visual');
const airParticles = document.getElementById('air-particles');
const breathStatus = document.getElementById('breath-status');
const respSteps = document.querySelectorAll('.resp-step');

if (btnInhale && btnExhale && lungsVisual) {
  btnInhale.addEventListener('click', () => {
    lungsVisual.classList.add('inhaling');
    lungsVisual.classList.remove('exhaling');
    if (airParticles) airParticles.textContent = '⬆️ Inhale: Oxygen (O₂) entrando pelo nariz/boca até os pulmões!';
    if (breathStatus) breathStatus.textContent = 'Os pulmões (lungs) se enchem de ar e o oxigênio passa para o sangue!';
    speakEnglish('Inhale. We breathe air with oxygen.');
    awardStar('sim-inhale', 1);
  });

  btnExhale.addEventListener('click', () => {
    lungsVisual.classList.add('exhaling');
    lungsVisual.classList.remove('inhaling');
    if (airParticles) airParticles.textContent = '⬇️ Exhale: Carbon dioxide (CO₂) saindo!';
    if (breathStatus) breathStatus.textContent = 'Na expiração (exhale), eliminamos o ar rico em gás carbônico!';
    speakEnglish('Exhale. We release carbon dioxide.');
    awardStar('sim-exhale', 1);
  });
}

respSteps.forEach(step => {
  step.addEventListener('click', () => {
    respSteps.forEach(s => s.classList.remove('active-step'));
    step.classList.add('active-step');
    awardStar(`resp-step-${step.dataset.step}`, 1);
  });
});

// =========================================================================
// 3 & 4. STAMINA CHECKLIST & HABITS AUDIO
// =========================================================================
const staminaChecks = document.querySelectorAll('.stamina-check');
const staminaBarFill = document.getElementById('stamina-bar-fill');
const staminaLevelText = document.getElementById('stamina-level-text');

function updateStaminaMeter() {
  if (!staminaChecks.length) return;
  let checked = 0;
  staminaChecks.forEach(c => {
    if (c.checked) checked++;
  });
  const pct = Math.round((checked / staminaChecks.length) * 100);
  if (staminaBarFill) staminaBarFill.style.width = `${pct}%`;
  if (staminaLevelText) {
    if (pct === 100) staminaLevelText.textContent = '100% Super Atleta! 🏆';
    else if (pct >= 60) staminaLevelText.textContent = `${pct}% Boa Energia! ⚡`;
    else staminaLevelText.textContent = `${pct}% Precisa descansar e beber água! 💧`;
  }
  awardStar('stamina-meter', 1);
}

staminaChecks.forEach(chk => chk.addEventListener('change', updateStaminaMeter));

// Generic click-to-speak for all [data-speak] elements
document.querySelectorAll('[data-speak]').forEach((el, idx) => {
  el.addEventListener('click', () => {
    const phrase = el.getAttribute('data-speak');
    if (phrase) {
      speakEnglish(phrase);
      awardStar(`speak-${idx}`, 1);
    }
  });
});

// =========================================================================
// 5. TAKING THE PULSE — HEARTBEAT & 15s TIMER
// =========================================================================
const beatingHeart = document.getElementById('beating-heart');
const currentBpmEl = document.getElementById('current-bpm');
const bpmStateLabel = document.getElementById('bpm-state-label');
const pulseModeBtns = document.querySelectorAll('.btn-pulse-mode');
const beats15sInput = document.getElementById('beats-15s');
const calcBpmResult = document.getElementById('calc-bpm-result');
const start15sTimerBtn = document.getElementById('start-15s-timer');
const timerDisplay = document.getElementById('timer-display');

function setPulseBpm(bpm, label) {
  if (currentBpmEl) currentBpmEl.textContent = String(bpm);
  if (bpmStateLabel) bpmStateLabel.textContent = label;
  if (beatingHeart) {
    const durationSec = (60 / bpm).toFixed(2);
    beatingHeart.style.animationDuration = `${durationSec}s`;
  }
}

pulseModeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    pulseModeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const bpm = Number(btn.dataset.bpm || 80);
    const label = btn.dataset.label || '';
    setPulseBpm(bpm, label);
    speakEnglish(label);
    awardStar(`pulse-mode-${bpm}`, 1);
  });
});

if (beats15sInput && calcBpmResult) {
  beats15sInput.addEventListener('input', () => {
    const val = Math.max(1, Number(beats15sInput.value || 20));
    const totalBpm = val * 4;
    calcBpmResult.textContent = `${totalBpm} beats per minute!`;
    setPulseBpm(totalBpm, `Calculado: ${val} batimentos × 4 = ${totalBpm} bpm`);
    awardStar('pulse-calc', 1);
  });
}

let timerInterval = null;
if (start15sTimerBtn && timerDisplay) {
  start15sTimerBtn.addEventListener('click', () => {
    if (timerInterval) clearInterval(timerInterval);
    let remaining = 15;
    start15sTimerBtn.disabled = true;
    timerDisplay.textContent = `⏱️ Contando... ${remaining}s (conte seus batimentos no pulso!)`;
    awardStar('pulse-timer', 2);

    timerInterval = setInterval(() => {
      remaining--;
      if (remaining > 0) {
        timerDisplay.textContent = `⏱️ Contando... ${remaining}s`;
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        start15sTimerBtn.disabled = false;
        timerDisplay.textContent = '🎉 Tempo esgotado (15s)! Digite acima quantos batimentos você contou!';
        speakEnglish('Time is up! Multiply your beats by four.');
      }
    }, 1000);
  });
}

// =========================================================================
// 16. FIRST CONDITIONAL — ORDER SWAPPER
// =========================================================================
const btnSwapConditional = document.getElementById('btn-swap-conditional');
const conditionalOrderDisplay = document.getElementById('conditional-order-display');
let conditionalStartsWithIf = false;

if (btnSwapConditional && conditionalOrderDisplay) {
  btnSwapConditional.addEventListener('click', () => {
    conditionalStartsWithIf = !conditionalStartsWithIf;
    if (conditionalStartsWithIf) {
      conditionalOrderDisplay.innerHTML = '<strong>If it rains,</strong> I will stay home. <small>(Com vírgula!)</small>';
      conditionalOrderDisplay.setAttribute('data-speak', 'If it rains, I will stay home.');
      speakEnglish('If it rains, I will stay home.');
    } else {
      conditionalOrderDisplay.innerHTML = '<strong>I will stay home</strong> if it rains. <small>(Começando pelo resultado!)</small>';
      conditionalOrderDisplay.setAttribute('data-speak', 'I will stay home if it rains.');
      speakEnglish('I will stay home if it rains.');
    }
    awardStar('swap-conditional', 1);
  });
}

// =========================================================================
// SCROLLSPY ACCESSIBILITY & FALLBACK (Modern Web Guidance `scrollspy`)
// =========================================================================
const supportsScrollTargetGroup = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('scroll-target-group: auto');

if (supportsScrollTargetGroup) {
  const syncAriaCurrent = () => {
    const currentLink = document.querySelector('.scrollspy-nav a:target-current');
    document.querySelectorAll('.scrollspy-nav a').forEach(link => {
      link.setAttribute('aria-current', link === currentLink ? 'true' : 'false');
    });
  };
  syncAriaCurrent();
  document.addEventListener('scrollend', syncAriaCurrent);
} else {
  const navLinks = document.querySelectorAll('.scrollspy-nav a');
  const sections = document.querySelectorAll('main section[id]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.classList.toggle(':target-current', isActive);
          link.setAttribute('aria-current', String(isActive));
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => observer.observe(section));
}

// =========================================================================
// PARTE 3 — SIMULADO INTERATIVO (15 QUESTÕES OFICIAIS + GABARITO COMENTADO)
// =========================================================================
const QUIZ_QUESTIONS = [
  {
    id: 1,
    category: 'ICA — Sistema respiratório',
    question: '1. Which organs help us breathe?',
    options: [
      { letter: 'A', text: 'A) The stomach and the brain.' },
      { letter: 'B', text: 'B) The lungs.' },
      { letter: 'C', text: 'C) The bones.' }
    ],
    correct: 'B',
    explanation: 'Gabarito: B! Os pulmões (The lungs) são os órgãos do sistema respiratório que nos ajudam a respirar ("The lungs help us breathe"). O estômago faz a digestão, o cérebro controla pensamentos e movimentos, e os ossos sustentam o corpo.'
  },
  {
    id: 2,
    category: 'ICA — Pulso',
    question: '2. What usually happens to your heart rate after running?',
    options: [
      { letter: 'A', text: 'A) It usually increases.' },
      { letter: 'B', text: 'B) It always stops.' },
      { letter: 'C', text: 'C) It always decreases.' }
    ],
    correct: 'A',
    explanation: 'Gabarito: A! A frequência cardíaca (heart rate) geralmente aumenta (increases) após correr porque os músculos precisam de mais oxigênio durante o exercício (ex.: de 80 bpm para 120 bpm).'
  },
  {
    id: 3,
    category: 'ICA — Stamina',
    question: '3. What helps you improve your stamina?',
    options: [
      { letter: 'A', text: 'A) Never sleeping.' },
      { letter: 'B', text: 'B) Exercising regularly and resting well.' },
      { letter: 'C', text: 'C) Avoiding water.' }
    ],
    correct: 'B',
    explanation: 'Gabarito: B! Praticar exercícios regularmente (exercising regularly), descansar/dormir bem (resting well), beber água e comer de forma equilibrada ajudam a melhorar a resistência física (stamina).'
  },
  {
    id: 4,
    category: 'ICA — Hábitos saudáveis',
    question: '4. Choose the healthy habit.',
    options: [
      { letter: 'A', text: 'A) Never drinking water.' },
      { letter: 'B', text: 'B) Sleeping very little every night.' },
      { letter: 'C', text: 'C) Eating balanced meals and exercising.' }
    ],
    correct: 'C',
    explanation: 'Gabarito: C! Comer refeições equilibradas e se exercitar ("Eating balanced meals and exercising") são hábitos saudáveis essenciais para o bem-estar.'
  },
  {
    id: 5,
    category: 'Language Arts — Should',
    question: '5. You have a headache. You ______ rest.',
    options: [
      { letter: 'A', text: 'A) should' },
      { letter: 'B', text: "B) shouldn't" },
      { letter: 'C', text: "C) couldn't" }
    ],
    correct: 'A',
    explanation: 'Gabarito: A! Se você está com dor de cabeça (headache), o conselho positivo é que você deveria descansar: "You should rest."'
  },
  {
    id: 6,
    category: "Language Arts — Shouldn't",
    question: '6. Choose the correct advice: You ______ run in a museum.',
    options: [
      { letter: 'A', text: 'A) should' },
      { letter: 'B', text: "B) shouldn't to" },
      { letter: 'C', text: "C) shouldn't" }
    ],
    correct: 'C',
    explanation: "Gabarito: C! Para recomendar que alguém NÃO corra no museu, usamos shouldn't seguido do verbo sem 'to': 'You shouldn't run in a museum.'"
  },
  {
    id: 7,
    category: 'Language Arts — Requests',
    question: '7. You want your friend to help you. What do you say?',
    options: [
      { letter: 'A', text: 'A) Could you help me, please?' },
      { letter: 'B', text: 'B) Could I help you, please?' },
      { letter: 'C', text: 'C) Do you mind if I helps?' }
    ],
    correct: 'A',
    explanation: 'Gabarito: A! Quando pedimos para outra pessoa fazer algo por nós, usamos "Could you...?" → "Could you help me, please?".'
  },
  {
    id: 8,
    category: 'Language Arts — Permission',
    question: "8. Complete: 'Do you mind if I sit here?' 'No, not at all.'",
    options: [
      { letter: 'A', text: 'A) A permissão foi negada.' },
      { letter: 'B', text: 'B) A pessoa permite que você se sente.' },
      { letter: 'C', text: 'C) A pessoa não entendeu a pergunta.' }
    ],
    correct: 'B',
    explanation: 'Gabarito: B! Como "Do you mind...?" significa "Você se importa...?", responder "No, not at all" significa "Não me importo de jeito nenhum", ou seja, a pessoa permite que você se sente!'
  },
  {
    id: 9,
    category: 'Language Arts — Be made of',
    question: '9. The table is ______ wood.',
    options: [
      { letter: 'A', text: 'A) used for' },
      { letter: 'B', text: 'B) made of' },
      { letter: 'C', text: 'C) made for' }
    ],
    correct: 'B',
    explanation: 'Gabarito: B! Wood (madeira) é o material do qual a mesa é feita, portanto usamos "made of": "The table is made of wood."'
  },
  {
    id: 10,
    category: 'Language Arts — Be used for',
    question: '10. A pencil is used ______ writing.',
    options: [
      { letter: 'A', text: 'A) of' },
      { letter: 'B', text: 'B) to' },
      { letter: 'C', text: 'C) for' }
    ],
    correct: 'C',
    explanation: 'Gabarito: C! Para indicar a finalidade de um objeto com verbo no -ing (writing), usamos "used for": "A pencil is used for writing."'
  },
  {
    id: 11,
    category: "Language Arts — Possessive 's",
    question: '11. This is ______ book. (O livro pertence à Anna.)',
    options: [
      { letter: 'A', text: 'A) Anna book' },
      { letter: 'B', text: "B) Annas'" },
      { letter: 'C', text: "C) Anna's" }
    ],
    correct: 'C',
    explanation: "Gabarito: C! Usamos o nome do dono + 's antes do objeto para indicar posse: \"Anna's book\" (O livro da Anna)."
  },
  {
    id: 12,
    category: 'Language Arts — Prepositions',
    question: '12. The cat is behind the box. Where is the cat?',
    options: [
      { letter: 'A', text: 'A) Atrás da caixa.' },
      { letter: 'B', text: 'B) Na frente da caixa.' },
      { letter: 'C', text: 'C) À direita da caixa.' }
    ],
    correct: 'A',
    explanation: 'Gabarito: A! A preposição "behind" significa "atrás de". Na frente é "in front of" e à direita é "to the right of".'
  },
  {
    id: 13,
    category: 'Language Arts — Will',
    question: '13. Your friend has many bags. You offer to help. What do you say?',
    options: [
      { letter: 'A', text: 'A) I helped you yesterday.' },
      { letter: 'B', text: "B) I'll carry your bags." },
      { letter: 'C', text: 'C) I have just carried your bags.' }
    ],
    correct: 'B',
    explanation: "Gabarito: B! Usamos 'will' (contraído como I'll) para fazer ofertas no momento da fala: \"I'll carry your bags\" (Eu vou carregar suas bolsas)."
  },
  {
    id: 14,
    category: 'Language Arts — Present Perfect + Just',
    question: "14. Choose the correct sentence: 'Ela acabou de chegar.'",
    options: [
      { letter: 'A', text: 'A) She have just arrived.' },
      { letter: 'B', text: 'B) She has just arrive.' },
      { letter: 'C', text: 'C) She has just arrived.' }
    ],
    correct: 'C',
    explanation: 'Gabarito: C! Com "She" usamos o auxiliar "has" + "just" + verbo no particípio ("arrived"): "She has just arrived."'
  },
  {
    id: 15,
    category: 'Language Arts — First Conditional',
    question: '15. Complete: If it rains tomorrow, we ______ at home.',
    options: [
      { letter: 'A', text: 'A) stayed' },
      { letter: 'B', text: 'B) will stay' },
      { letter: 'C', text: 'C) will staying' }
    ],
    correct: 'B',
    explanation: 'Gabarito: B! No First Conditional (If + Simple Present), a segunda parte usa "will + verbo na forma básica": "If it rains tomorrow, we will stay at home."'
  }
];

const quizContainer = document.getElementById('quiz-questions-container');
const answeredCountEl = document.getElementById('quiz-answered-count');
const correctCountEl = document.getElementById('quiz-correct-count');
const btnCheckAll = document.getElementById('btn-check-all');
const btnResetQuiz = document.getElementById('btn-reset-quiz');
const btnRetryBottom = document.getElementById('btn-retry-bottom');
const finalReportCard = document.getElementById('quiz-final-report');
const reportTrophy = document.getElementById('report-trophy');
const reportTitle = document.getElementById('report-title');
const reportSummary = document.getElementById('report-summary');

const userAnswers = {};

function renderQuiz() {
  if (!quizContainer) return;
  quizContainer.innerHTML = '';

  QUIZ_QUESTIONS.forEach(q => {
    const card = document.createElement('article');
    card.className = 'quiz-card';
    card.id = `q-card-${q.id}`;

    const badge = document.createElement('span');
    badge.className = 'quiz-topic-badge';
    badge.textContent = q.category;

    const title = document.createElement('h3');
    title.className = 'quiz-question-title';
    title.textContent = q.question;

    const optionsWrap = document.createElement('div');
    optionsWrap.className = 'quiz-options';

    const expBox = document.createElement('div');
    expBox.className = 'quiz-explanation';
    expBox.id = `q-exp-${q.id}`;
    expBox.hidden = true;

    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-option-btn';
      btn.dataset.letter = opt.letter;
      btn.textContent = opt.text;

      btn.addEventListener('click', () => {
        handleSelectAnswer(q, opt.letter, card, optionsWrap, expBox);
      });

      optionsWrap.appendChild(btn);
    });

    card.append(badge, title, optionsWrap, expBox);
    quizContainer.appendChild(card);
  });

  updateQuizCounters();
}

function handleSelectAnswer(q, chosenLetter, card, optionsWrap, expBox) {
  userAnswers[q.id] = chosenLetter;
  const isCorrect = chosenLetter === q.correct;

  card.classList.remove('answered-correct', 'answered-wrong');
  card.classList.add(isCorrect ? 'answered-correct' : 'answered-wrong');

  optionsWrap.querySelectorAll('.quiz-option-btn').forEach(btn => {
    const letter = btn.dataset.letter;
    btn.classList.remove('selected', 'correct-choice', 'wrong-choice');
    if (letter === q.correct) {
      btn.classList.add('correct-choice');
    } else if (letter === chosenLetter && !isCorrect) {
      btn.classList.add('wrong-choice');
    }
  });

  expBox.hidden = false;
  expBox.innerHTML = `${isCorrect ? '✅ <strong>Muito bem!</strong> ' : '💡 <strong>Atenção:</strong> '} ${q.explanation}`;

  if (isCorrect) {
    awardStar(`quiz-q-${q.id}`, 2);
  }
  updateQuizCounters();
}

function updateQuizCounters() {
  const answeredIds = Object.keys(userAnswers);
  let correct = 0;
  answeredIds.forEach(id => {
    const q = QUIZ_QUESTIONS.find(item => item.id === Number(id));
    if (q && userAnswers[id] === q.correct) correct++;
  });

  if (answeredCountEl) answeredCountEl.textContent = String(answeredIds.length);
  if (correctCountEl) correctCountEl.textContent = String(correct);

  if (answeredIds.length === QUIZ_QUESTIONS.length) {
    showFinalReport(correct);
  }
}

function showFinalReport(correct) {
  if (!finalReportCard) return;
  finalReportCard.hidden = false;
  if (reportTrophy) {
    reportTrophy.textContent = correct >= 13 ? '🏆🌟' : correct >= 9 ? '🥇🎉' : '💪📚';
  }
  if (reportTitle) {
    reportTitle.textContent =
      correct === 15
        ? 'Pontuação Perfeita! Você é Mestre em ICA e Inglês!'
        : correct >= 12
        ? 'Excelente Trabalho, Super Explorador!'
        : 'Bom treino! Revise o gabarito comentado e tente mais uma vez!';
  }
  if (reportSummary) {
    reportSummary.textContent = `Você acertou ${correct} de ${QUIZ_QUESTIONS.length} questões no Simulado!`;
  }
}

if (btnCheckAll) {
  btnCheckAll.addEventListener('click', () => {
    QUIZ_QUESTIONS.forEach(q => {
      const card = document.getElementById(`q-card-${q.id}`);
      const expBox = document.getElementById(`q-exp-${q.id}`);
      if (!card || !expBox) return;
      const chosen = userAnswers[q.id];
      const isCorrect = chosen === q.correct;

      card.classList.remove('answered-correct', 'answered-wrong');
      card.classList.add(isCorrect ? 'answered-correct' : 'answered-wrong');

      card.querySelectorAll('.quiz-option-btn').forEach(btn => {
        const letter = btn.dataset.letter;
        btn.classList.remove('selected', 'correct-choice', 'wrong-choice');
        if (letter === q.correct) btn.classList.add('correct-choice');
        else if (chosen && letter === chosen) btn.classList.add('wrong-choice');
      });

      expBox.hidden = false;
      expBox.innerHTML = `${isCorrect ? '✅ <strong>Acertou!</strong> ' : '📌 <strong>Gabarito Comentado:</strong> '} ${q.explanation}`;
    });

    updateQuizCounters();
    let correct = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (userAnswers[q.id] === q.correct) correct++;
    });
    showFinalReport(correct);
    finalReportCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

function resetQuiz() {
  Object.keys(userAnswers).forEach(k => delete userAnswers[k]);
  if (finalReportCard) finalReportCard.hidden = true;
  renderQuiz();
}

if (btnResetQuiz) btnResetQuiz.addEventListener('click', resetQuiz);
if (btnRetryBottom) btnRetryBottom.addEventListener('click', resetQuiz);

renderQuiz();

// =========================================================================
// GAME: LABORATÓRIO MONTE O CORPO HUMANO (12 ÓRGÃOS E PARTES)
// =========================================================================
const BODY_GAME_PARTS = [
  { id: 'Head', en: 'Head', pt: 'Cabeça', fn: 'Protege o cérebro, que controla o corpo.', icon: '🙂' },
  { id: 'Brain', en: 'Brain', pt: 'Cérebro', fn: 'Controla pensamentos e movimentos.', icon: '🧠' },
  { id: 'Heart', en: 'Heart', pt: 'Coração', fn: 'Bombeia o sangue.', icon: '❤️' },
  { id: 'Lungs', en: 'Lungs', pt: 'Pulmões', fn: 'Ajudam na respiração.', icon: '🫁' },
  { id: 'Nose', en: 'Nose', pt: 'Nariz', fn: 'Ajuda a respirar e sentir cheiros.', icon: '👃' },
  { id: 'Mouth', en: 'Mouth', pt: 'Boca', fn: 'Ajuda a comer e falar.', icon: '👄' },
  { id: 'Trachea', en: 'Trachea', pt: 'Traqueia', fn: 'Conduz o ar até os brônquios.', icon: '🌬️' },
  { id: 'Stomach', en: 'Stomach', pt: 'Estômago', fn: 'Ajuda na digestão dos alimentos.', icon: '🍽️' },
  { id: 'Arms', en: 'Arms', pt: 'Braços', fn: 'Ajudam a levantar e carregar objetos.', icon: '💪' },
  { id: 'Legs', en: 'Legs', pt: 'Pernas', fn: 'Ajudam a ficar em pé, andar e correr.', icon: '🦵' },
  { id: 'Muscles', en: 'Muscles', pt: 'Músculos', fn: 'Permitem os movimentos.', icon: '🏃' },
  { id: 'Bones', en: 'Bones', pt: 'Ossos', fn: 'Sustentam e protegem o corpo.', icon: '🦴' }
];

const trayGridEl = document.getElementById('parts-tray-grid');
const trayRemainingEl = document.getElementById('tray-remaining');
const gamePlacedCountEl = document.getElementById('game-placed-count');
const gameScorePtsEl = document.getElementById('game-score-pts');
const modeBuildBtn = document.getElementById('mode-build');
const modeMissionBtn = document.getElementById('mode-mission');
const resetBodyGameBtn = document.getElementById('btn-reset-body-game');
const playAgainVictoryBtn = document.getElementById('btn-play-again-victory');
const missionIconEl = document.getElementById('game-mission-icon');
const missionTitleEl = document.getElementById('game-mission-title');
const missionDescEl = document.getElementById('game-mission-desc');
const hintAudioBtn = document.getElementById('game-hint-audio-btn');
const victoryBannerEl = document.getElementById('body-game-victory');
const dropSlots = document.querySelectorAll('.body-drop-slot');

let bodyGameMode = 'build'; // 'build' | 'mission'
let selectedPieceId = null;
let placedPartsSet = new Set();
let bodyGameScore = 0;
let missionQueue = [];
let currentMissionTarget = null;

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function initBodyGame() {
  if (!trayGridEl) return;
  placedPartsSet.clear();
  selectedPieceId = null;
  bodyGameScore = 0;
  if (victoryBannerEl) victoryBannerEl.hidden = true;

  // Reset all 12 drop slots on the body board
  dropSlots.forEach(slot => {
    const slotId = slot.dataset.slot;
    const partData = BODY_GAME_PARTS.find(p => p.id === slotId);
    slot.classList.remove('slot-filled', 'slot-wrong', 'drop-hover');
    slot.disabled = false;
    slot.innerHTML = `
      <span class="slot-placeholder">?</span>
      <span class="slot-hint-label">${partData ? partData.fn : ''}</span>
    `;
  });

  // Render shuffled tray pieces
  const shuffled = shuffleArray(BODY_GAME_PARTS);
  trayGridEl.innerHTML = '';

  shuffled.forEach(part => {
    const card = document.createElement('div');
    card.className = 'game-piece-card';
    card.dataset.piece = part.id;
    card.setAttribute('role', 'listitem');

    // Dedicated drag handle following Modern Web Guidance `drag`
    const handle = document.createElement('div');
    handle.className = 'drag-handle';
    handle.tabIndex = 0;
    handle.setAttribute('aria-label', `Arrastar ${part.en} (${part.pt}) ou usar setas do teclado`);
    handle.title = 'Arraste para o corpo';
    handle.textContent = '⠿';

    // Select button for click/tap-to-place
    const selectBtn = document.createElement('button');
    selectBtn.type = 'button';
    selectBtn.className = 'piece-select-btn';
    selectBtn.innerHTML = `
      <strong>${part.icon} ${part.en}</strong>
      <span>${part.pt}</span>
    `;

    selectBtn.addEventListener('click', () => {
      selectBodyPiece(part.id);
    });

    setupPointerDrag(handle, card, part);

    card.append(handle, selectBtn);
    trayGridEl.appendChild(card);
  });

  // Prepare Detective Mission Queue if in mission mode
  missionQueue = shuffleArray(BODY_GAME_PARTS);
  currentMissionTarget = missionQueue[0] || null;

  updateBodyGameUI();
}

function selectBodyPiece(partId) {
  if (placedPartsSet.has(partId)) return;
  selectedPieceId = partId;
  const part = BODY_GAME_PARTS.find(p => p.id === partId);

  document.querySelectorAll('.game-piece-card').forEach(card => {
    card.classList.toggle('selected-piece', card.dataset.piece === partId);
  });

  if (part) {
    speakEnglish(part.en);
    if (bodyGameMode === 'build') {
      setBannerMessage(
        part.icon,
        `Peça selecionada: ${part.en} (${part.pt})`,
        `Dica de função: "${part.fn}" — Agora clique no círculo certo no corpo!`
      );
    }
  }
}

function setBannerMessage(icon, title, desc) {
  if (missionIconEl) missionIconEl.textContent = icon;
  if (missionTitleEl) missionTitleEl.textContent = title;
  if (missionDescEl) missionDescEl.textContent = desc;
}

function updateBodyGameUI() {
  const placedCount = placedPartsSet.size;
  const remaining = BODY_GAME_PARTS.length - placedCount;

  if (gamePlacedCountEl) gamePlacedCountEl.textContent = String(placedCount);
  if (trayRemainingEl) trayRemainingEl.textContent = String(remaining);
  if (gameScorePtsEl) gameScorePtsEl.textContent = String(bodyGameScore);

  if (placedCount === BODY_GAME_PARTS.length) {
    if (victoryBannerEl) {
      victoryBannerEl.hidden = false;
      victoryBannerEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    setBannerMessage(
      '🏆',
      'Parabéns! Corpo Humano 100% Montado!',
      'Você colocou todos os 12 órgãos e partes no lugar certo! Clique em "Jogar de Novo" para praticar mais.'
    );
    if (hintAudioBtn) hintAudioBtn.hidden = true;
    awardStar('body-game-complete-bonus', 10);
    speakEnglish('Congratulations! You completed the human body!');
    return;
  }

  if (bodyGameMode === 'mission') {
    currentMissionTarget = missionQueue.find(p => !placedPartsSet.has(p.id)) || null;
    if (currentMissionTarget) {
      setBannerMessage(
        '🕵️',
        `Missão Detetive (${placedCount + 1} de 12): Qual órgão tem esta função?`,
        `👉 "${currentMissionTarget.fn}" — Encontre a peça certa e coloque no lugar dela no corpo!`
      );
      if (hintAudioBtn) {
        hintAudioBtn.hidden = false;
        hintAudioBtn.onclick = () => speakEnglish(currentMissionTarget.en);
      }
    }
  } else {
    if (hintAudioBtn) hintAudioBtn.hidden = true;
    if (!selectedPieceId) {
      setBannerMessage(
        '👆',
        'Modo Montar Livre:',
        'Arraste qualquer órgão pela alça ⠿ até o corpo, ou clique na peça e depois clique no espaço certo!'
      );
    }
  }
}

function attemptPlaceOrgan(pieceId, targetSlotEl) {
  if (!pieceId || !targetSlotEl) return;
  const slotId = targetSlotEl.dataset.slot;
  if (placedPartsSet.has(slotId)) return;

  const part = BODY_GAME_PARTS.find(p => p.id === pieceId);
  if (!part) return;

  // Check if in Detective Mission mode and user tried a different organ than the mission clue
  if (bodyGameMode === 'mission' && currentMissionTarget && pieceId !== currentMissionTarget.id) {
    targetSlotEl.classList.add('slot-wrong');
    setTimeout(() => targetSlotEl.classList.remove('slot-wrong'), 450);
    setBannerMessage(
      '🔎',
      'Quase lá! Leia a pista da Missão Detetive:',
      `Procuramos o órgão que: "${currentMissionTarget.fn}". Tente escolher essa peça!`
    );
    return;
  }

  if (pieceId === slotId) {
    // Correct match!
    placedPartsSet.add(slotId);
    bodyGameScore += 10;
    selectedPieceId = null;

    targetSlotEl.classList.remove('slot-wrong', 'drop-hover');
    targetSlotEl.classList.add('slot-filled');
    targetSlotEl.innerHTML = `
      <span class="slot-placeholder">${part.icon} ${part.en}</span>
      <span class="slot-hint-label">✅ ${part.pt}</span>
    `;

    const pieceCard = document.querySelector(`.game-piece-card[data-piece="${pieceId}"]`);
    if (pieceCard) {
      pieceCard.classList.remove('selected-piece');
      pieceCard.classList.add('placed-piece');
    }

    speakEnglish(`${part.en}.`);
    awardStar(`game-placed-${part.id}`, 1);

    if (bodyGameMode === 'build') {
      setBannerMessage(
        '🌟',
        `Muito bem! ${part.en} (${part.pt}) encaixado!`,
        `Função: ${part.fn}`
      );
    }
    updateBodyGameUI();
  } else {
    // Wrong slot
    bodyGameScore = Math.max(0, bodyGameScore - 2);
    if (gameScorePtsEl) gameScorePtsEl.textContent = String(bodyGameScore);
    targetSlotEl.classList.add('slot-wrong');
    setTimeout(() => targetSlotEl.classList.remove('slot-wrong'), 450);

    setBannerMessage(
      '💡',
      `Ops! Esse não é o lugar de ${part.en} (${part.pt})!`,
      `Lembre-se: ${part.en} (${part.pt}) → "${part.fn}". Tente outro círculo no corpo!`
    );
  }
}

// Click on a drop slot to place the currently selected piece (or hear an already placed organ)
dropSlots.forEach(slot => {
  slot.addEventListener('click', () => {
    const slotId = slot.dataset.slot;
    if (placedPartsSet.has(slotId)) {
      const part = BODY_GAME_PARTS.find(p => p.id === slotId);
      if (part) speakEnglish(part.en);
      return;
    }
    if (!selectedPieceId) {
      setBannerMessage(
        '👈',
        'Selecione uma peça primeiro!',
        'Clique em um dos órgãos na bandeja "Peças do Corpo" à esquerda ou arraste-o até aqui!'
      );
      return;
    }
    attemptPlaceOrgan(selectedPieceId, slot);
  });
});

// Pointer Dragging with setPointerCapture & Viewport Clamping (Modern Web Guidance `drag`)
function setupPointerDrag(handle, card, part) {
  let avatar = null;
  let offsetX = 0;
  let offsetY = 0;
  let startX = 0;
  let startY = 0;

  function moveAvatarTo(left, top) {
    if (!avatar) return;
    const maxLeft = Math.max(0, window.innerWidth - avatar.offsetWidth);
    const maxTop = Math.max(0, window.innerHeight - avatar.offsetHeight);
    avatar.style.left = `${Math.max(0, Math.min(left, maxLeft))}px`;
    avatar.style.top = `${Math.max(0, Math.min(top, maxTop))}px`;
  }

  function findHoveredSlot(clientX, clientY) {
    let found = null;
    dropSlots.forEach(slot => {
      if (placedPartsSet.has(slot.dataset.slot)) return;
      const r = slot.getBoundingClientRect();
      if (clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom) {
        found = slot;
      }
    });
    return found;
  }

  handle.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || placedPartsSet.has(part.id)) return;
    selectBodyPiece(part.id);
    startX = event.clientX;
    startY = event.clientY;
    const rect = card.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;
    handle.setPointerCapture(event.pointerId);
  });

  handle.addEventListener('pointermove', (event) => {
    if (!handle.hasPointerCapture(event.pointerId)) return;
    const dist = Math.hypot(event.clientX - startX, event.clientY - startY);
    if (!avatar && dist < 4) return;

    if (!avatar) {
      handle.classList.add('dragging');
      avatar = document.createElement('div');
      avatar.className = 'floating-drag-avatar';
      avatar.innerHTML = `<span>${part.icon}</span> <strong>${part.en}</strong> <small>(${part.pt})</small>`;
      document.body.appendChild(avatar);
    }

    moveAvatarTo(event.clientX - offsetX, event.clientY - offsetY);

    dropSlots.forEach(s => s.classList.remove('drop-hover'));
    const hoveredSlot = findHoveredSlot(event.clientX, event.clientY);
    if (hoveredSlot) hoveredSlot.classList.add('drop-hover');
  });

  function finishPointerDrag(event) {
    handle.classList.remove('dragging');
    dropSlots.forEach(s => s.classList.remove('drop-hover'));
    if (avatar) {
      avatar.remove();
      avatar = null;
      if (event && typeof event.clientX === 'number') {
        const targetSlot = findHoveredSlot(event.clientX, event.clientY);
        if (targetSlot) {
          attemptPlaceOrgan(part.id, targetSlot);
        }
      }
    }
  }

  handle.addEventListener('pointerup', finishPointerDrag);
  handle.addEventListener('lostpointercapture', () => finishPointerDrag(null));

  // Keyboard accessibility on handle: Enter/Space selects piece; Arrow keys cycle drop slots
  handle.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectBodyPiece(part.id);
    } else if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      selectBodyPiece(part.id);
      const firstOpenSlot = Array.from(dropSlots).find(s => !placedPartsSet.has(s.dataset.slot));
      if (firstOpenSlot) firstOpenSlot.focus();
    }
  });
}

if (modeBuildBtn && modeMissionBtn) {
  modeBuildBtn.addEventListener('click', () => {
    bodyGameMode = 'build';
    modeBuildBtn.classList.add('active');
    modeMissionBtn.classList.remove('active');
    initBodyGame();
  });

  modeMissionBtn.addEventListener('click', () => {
    bodyGameMode = 'mission';
    modeMissionBtn.classList.add('active');
    modeBuildBtn.classList.remove('active');
    initBodyGame();
  });
}

if (resetBodyGameBtn) resetBodyGameBtn.addEventListener('click', initBodyGame);
if (playAgainVictoryBtn) playAgainVictoryBtn.addEventListener('click', initBodyGame);

initBodyGame();

