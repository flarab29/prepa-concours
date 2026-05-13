const officialPage = "https://www.economie.gouv.fr/rejoignez-nous/agent-administratif-principal-des-finances-publiques-de-2eme-classe-externe-dgfip";
let officialQcmTotal = 320;
const qcmUrls = {
  2024: "https://www.economie.gouv.fr/files/files/directions_services/rejoignez-nous/DGFiP/recrutement-par-concours/categorie-C_brevet/Concours_Commun_C/Annales_et_rapport_de_jury/2025_03_ccc_qcm_metropole2024.pdf",
  2023: "https://www.economie.gouv.fr/files/files/directions_services/rejoignez-nous/DGFiP/recrutement-par-concours/categorie-C_brevet/Concours_Commun_C/Annales_et_rapport_de_jury/2024_03_qcm_metropole.pdf",
  2022: "https://www.economie.gouv.fr/files/files/directions_services/rejoignez-nous/DGFiP/recrutement-par-concours/categorie-C_brevet/Concours_Commun_C/Annales_et_rapport_de_jury/2022_ccc_qcm-metro.pdf",
  2021: "https://www.economie.gouv.fr/files/files/directions_services/rejoignez-nous/DGFiP/recrutement-par-concours/categorie-C_brevet/Concours_Commun_C/Annales_et_rapport_de_jury/2021_ccc_qcm.pdf",
  2020: "https://www.economie.gouv.fr/files/files/directions_services/rejoignez-nous/DGFiP/recrutement-par-concours/categorie-C_brevet/Concours_Commun_C/Annales_et_rapport_de_jury/2020_ccc_qcm.pdf"
};
const correctionUrls = {
  2023: "https://monconcoursdgfip.fr/correction-qcm-concours-commun-categorie-c-2023/",
  2022: "https://monconcoursdgfip.fr/correction-qcm-concours-commun-categorie-c-2022/",
  2021: "https://monconcoursdgfip.fr/correction-qcm-concours-commun-categorie-c-2021/",
  2020: "https://monconcoursdgfip.fr/correction-qcm-concours-commun-categorie-c-2020/"
};
const ecritUrls = {
  2024: "https://www.economie.gouv.fr/files/files/directions_services/rejoignez-nous/DGFiP/recrutement-par-concours/categorie-C_brevet/Concours_Commun_C/Annales_et_rapport_de_jury/2025_03_ccc_admissibilite_metropole2024.pdf",
  2023: "https://www.economie.gouv.fr/files/files/directions_services/rejoignez-nous/DGFiP/recrutement-par-concours/categorie-C_brevet/Concours_Commun_C/Annales_et_rapport_de_jury/2024_03__sujet%20admissibilite.pdf",
  2022: "https://www.economie.gouv.fr/files/files/directions_services/rejoignez-nous/DGFiP/recrutement-par-concours/categorie-C_brevet/Concours_Commun_C/Annales_et_rapport_de_jury/2022_ccc_epreuve_admissibilite.pdf",
  2021: "https://www.economie.gouv.fr/files/files/directions_services/rejoignez-nous/DGFiP/recrutement-par-concours/categorie-C_brevet/Concours_Commun_C/Annales_et_rapport_de_jury/2021_ccc_epreuve_admissibilite.pdf",
  2020: "https://www.economie.gouv.fr/files/files/directions_services/rejoignez-nous/DGFiP/recrutement-par-concours/categorie-C_brevet/Concours_Commun_C/Annales_et_rapport_de_jury/2020_ccc_epreuve_admissibilite.pdf"
};
const reportUrls = {
  2024: "https://www.economie.gouv.fr/files/files/directions_services/rejoignez-nous/DGFiP/recrutement-par-concours/categorie-C_brevet/Concours_Commun_C/Annales_et_rapport_de_jury/2025_03_ccc_rapport_jury_2024_administratif.pdf",
  2023: "https://www.economie.gouv.fr/files/files/directions_services/rejoignez-nous/DGFiP/recrutement-par-concours/categorie-C_brevet/Concours_Commun_C/Annales_et_rapport_de_jury/2024_03_rapport%20jury_ccc_2023_Adm.pdf",
  2022: "https://www.economie.gouv.fr/files/files/directions_services/rejoignez-nous/DGFiP/recrutement-par-concours/categorie-C_brevet/Concours_Commun_C/Annales_et_rapport_de_jury/2022_ccc_rapport_jury.pdf",
  2021: "https://www.economie.gouv.fr/files/files/directions_services/rejoignez-nous/DGFiP/recrutement-par-concours/categorie-C_brevet/Concours_Commun_C/Annales_et_rapport_de_jury/2021_ccc_rapport_jury.pdf",
  2020: "https://www.economie.gouv.fr/files/files/directions_services/rejoignez-nous/DGFiP/recrutement-par-concours/categorie-C_brevet/Concours_Commun_C/Annales_et_rapport_de_jury/2020_ccc_rapport_jury.pdf"
};
const zero = {
  qcm: "https://rejoindrelesfinancespubliques.economie.gouv.fr//files/files/concours/Sujets_zero/CCC%20-%202026%20-%20Sujet%20test%20-%20%C3%89preuve%20de%20pr%C3%A9admissibilit%C3%A9.pdf",
  ecrit: "https://rejoindrelesfinancespubliques.economie.gouv.fr/files/files/concours/Sujets_zero/CCC%20-%202026%20-%20sujet%20test%20-%20admissibilit%C3%A9.pdf"
};

let annales = [];

let qcm = [];

let subjects = [];

let juryRules = [];

let oralQuestions = [];

const tabs = ["Accueil", "Annales", "QCM", "Écrit", "Jury", "Oral", "Suivi", "Sources"];
let currentTab = "Accueil";
let quiz = { list: [], index: 0, score: 0, answers: [], startedAt: 0, questionStartedAt: 0, questionTimes: [] };
let selectedSubject = 0;
let activeQuizMode = "Libre";
let sourceItems = null;
let corpusLoadError = null;
const domains = ["Tous les domaines", "Maths et logique", "Francais", "Histoire-geographie", "EMC et institutions", "Numerique", "MEF / DGFiP / DGDDI", "Actualite", "Culture generale"];
const quizModes = ["Libre", "Diagnostic initial", "Serie courte 10 min", "Examen ancien format — 54 questions / 1h30", "Sujet zéro 2026 — 50 questions", "Simulation QCM 1h30", "Annale complete", "Faiblesses du jour", "Carnet d'erreurs"];
const app = document.querySelector("#app");
const nav = document.querySelector("#nav");

function q(year, category, prompt, choices, answer, explanation, supportRows = [], correctionSteps = []) {
  return { year, category, prompt, choices, answer, explanation, supportRows, correctionSteps };
}
function applyCorpus(corpus) {
  officialQcmTotal = corpus.officialQcmTotal || officialQcmTotal;
  qcm = (corpus.questions || []).map(item => ({
    year: item.year,
    id: item.id,
    category: item.category,
    prompt: item.prompt,
    choices: item.choices || [],
    answer: item.answer,
    explanation: item.explanation,
    domain: item.domain,
    tags: item.tags || [],
    supportRows: item.supportRows || [],
    correctionSteps: item.correctionSteps || [],
    verificationLevel: item.verificationLevel || "",
    sourceType: item.sourceType || "",
    difficulty: item.difficulty || "",
    skill: item.skill || "",
    subskill: item.subskill || "",
    estimatedTimeSeconds: item.estimatedTimeSeconds || 90
  }));
  annales = corpus.annales || annales;
  subjects = corpus.writtenSubjects || subjects;
  juryRules = (corpus.juryRules || juryRules).map(item => Array.isArray(item) ? item : [item.title, item.body]);
  oralQuestions = corpus.oralQuestions || oralQuestions;
  sourceItems = corpus.sources || sourceItems;
}
async function loadCorpus() {
  try {
    const response = await fetch("public_sources/corpus.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    applyCorpus(await response.json());
  } catch (error) {
    corpusLoadError = error;
    console.warn("Impossible de charger public_sources/corpus.json", error);
  }
  render();
}
function setTab(tab) {
  if (tab !== "Oral" && oralTimerHandle) {
    clearInterval(oralTimerHandle);
    oralTimerHandle = null;
  }
  currentTab = tab;
  render();
}
function card(title, body = "", extra = "") {
  return `<section class="card ${extra}"><h3>${escapeHtml(title)}</h3>${body}</section>`;
}
function coachMessage(message) {
  return `<section class="card coach span-12">${escapeHtml(message)}</section>`;
}
function reliabilityLabel(level, type = "") {
  if (level === "official_correction" || type.startsWith("official_")) return "Fiabilité maximale";
  if (level === "public_correction_checked") return "Correction publique vérifiée";
  if (level === "manual_verified") return "Vérification interne";
  if (type === "qcm-correction") return "Correction tierce";
  return "À contextualiser";
}
function reliabilityBadge(level, type = "") {
  const label = reliabilityLabel(level, type);
  const cls = label.includes("maximale") || label.includes("publique") ? "good" : label.includes("tierce") || label.includes("contextualiser") ? "warn" : "soft";
  return `<span class="badge ${cls}">${escapeHtml(label)}</span>`;
}
function questionBadges(item) {
  return `${reliabilityBadge(item.verificationLevel, item.sourceType)}<span class="badge">${escapeHtml(item.difficulty || "niveau non précisé")}</span><span class="badge">${escapeHtml(item.sourceType || "source non précisée")}</span>`;
}
function questionSupport(item) {
  if (!item.supportRows || !item.supportRows.length) return "";
  return `<section class="question-support"><strong>Support</strong><pre>${item.supportRows.map(escapeHtml).join("\n")}</pre></section>`;
}
function questionBlock(item) {
  return `${card(item.prompt)}${questionSupport(item)}`;
}
function correctionBlock(item) {
  if (!item.correctionSteps || !item.correctionSteps.length) return escapeHtml(item.explanation);
  return `<div class="correction-steps">${item.correctionSteps.map(step => `<div>${escapeHtml(step)}</div>`).join("")}</div>`;
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]));
}
function pct(value, total) {
  return total ? Math.round(value * 100 / total) : 0;
}
function normalizeText(value) {
  return String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function domainOf(item) {
  if (item.domain) return item.domain;
  const c = normalizeText(item.category);
  if (/calcul|mathem|equation|fraction|pourcentage|statistique|probabilite|geometrie|volume|vitesse|arithmetique|proportionnalite|moyenne|radicaux|nombres|raisonnement|suite|logique|codage|anagrammes/.test(c)) return "Maths et logique";
  if (/orthographe|accord|grammaire|conjugaison|vocabulaire|expression|genre|figure/.test(c)) return "Francais";
  if (/histoire|geographie|geopolitique/.test(c)) return "Histoire-geographie";
  if (/enseignement|civique|institution|union europeenne|administration|administratif/.test(c)) return "EMC et institutions";
  if (/numerique/.test(c)) return "Numerique";
  if (/mef|dgfip|dgddi|douane|douanes|missions/.test(c)) return "MEF / DGFiP / DGDDI";
  if (/actualite/.test(c)) return "Actualite";
  return "Culture generale";
}
function questionId(item) {
  if (item.id) return item.id;
  return `${item.year}|${item.category}|${item.prompt}`.replace(/\W+/g, "_").slice(0, 120);
}
function loadJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
}
function addDays(days) {
  return Date.now() + days * 86400000;
}
function reviewCards() {
  const cards = loadJson("dgfipReviewCards", {});
  const legacyMisses = loadJson("dgfipMisses", {});
  const legacyDue = loadJson("dgfipDue", {});
  let changed = false;
  Object.entries(legacyMisses).forEach(([id, failures]) => {
    if ((failures || 0) > 0 && !cards[id]) {
      cards[id] = {
        attempts: failures,
        successes: 0,
        failures,
        consecutiveSuccesses: 0,
        lastAttemptAt: null,
        nextReviewAt: legacyDue[id] || Date.now(),
        mastery: "fragile"
      };
      changed = true;
    }
  });
  if (changed) localStorage.setItem("dgfipReviewCards", JSON.stringify(cards));
  return cards;
}
function saveReviewCards(cards) {
  localStorage.setItem("dgfipReviewCards", JSON.stringify(cards));
}
function reviewCard(item) {
  return reviewCards()[questionId(item)] || null;
}
function isMistake(item) {
  const card = reviewCard(item);
  return !!card && card.failures > 0 && card.mastery !== "mastered";
}
function isDueMistake(item) {
  const card = reviewCard(item);
  return !!card && card.failures > 0 && card.mastery !== "mastered" && (card.nextReviewAt || 0) <= Date.now();
}
function mistakeQuestions() {
  return qcm.filter(isMistake);
}
function dueMistakeQuestions() {
  return qcm.filter(isDueMistake);
}
function masteredMistakeQuestions() {
  return qcm.filter(item => reviewCard(item)?.mastery === "mastered");
}
function fragileMistakeQuestions() {
  return qcm.filter(item => {
    const card = reviewCard(item);
    return card && card.failures > 0 && ["new", "fragile", "review_tomorrow"].includes(card.mastery);
  });
}
function reviewStats() {
  return {
    due: dueMistakeQuestions().length,
    mastered: masteredMistakeQuestions().length,
    fragile: fragileMistakeQuestions().length,
    total: mistakeQuestions().length
  };
}
function recordQuestion(item, ok) {
  const cards = reviewCards();
  const stats = loadJson("dgfipDomainStats", {});
  const domain = domainOf(item);
  const id = questionId(item);
  const existing = cards[id] || {
    attempts: 0,
    successes: 0,
    failures: 0,
    consecutiveSuccesses: 0,
    lastAttemptAt: null,
    nextReviewAt: Date.now(),
    mastery: "new"
  };
  stats[domain] = stats[domain] || { attempts: 0, correct: 0 };
  stats[domain].attempts += 1;
  existing.attempts += 1;
  existing.lastAttemptAt = Date.now();
  if (ok) {
    stats[domain].correct += 1;
    existing.successes += 1;
    existing.consecutiveSuccesses += 1;
    if (existing.failures > 0 && existing.consecutiveSuccesses >= 3) {
      existing.mastery = "mastered";
      existing.nextReviewAt = addDays(30);
    } else if (existing.failures > 0 && existing.consecutiveSuccesses >= 2) {
      existing.mastery = "review_7_days";
      existing.nextReviewAt = addDays(7);
    } else if (existing.failures > 0) {
      existing.mastery = "review_3_days";
      existing.nextReviewAt = addDays(3);
    }
  } else {
    existing.failures += 1;
    existing.consecutiveSuccesses = 0;
    existing.mastery = "fragile";
    existing.nextReviewAt = addDays(1);
  }
  cards[id] = existing;
  saveReviewCards(cards);
  localStorage.setItem("dgfipDomainStats", JSON.stringify(stats));
}
function weakestDomain() {
  const stats = loadJson("dgfipDomainStats", {});
  let weakest = domains.find(d => d !== "Tous les domaines");
  let low = 101;
  let hasStats = false;
  domains.filter(d => d !== "Tous les domaines").forEach(domain => {
    const s = stats[domain];
    if (!s || !s.attempts) {
      if (!hasStats) weakest = domain;
      return;
    }
    hasStats = true;
    const rate = pct(s.correct, s.attempts);
    if (rate < low) { low = rate; weakest = domain; }
  });
  return weakest;
}
function domainStatsHtml() {
  const stats = loadJson("dgfipDomainStats", {});
  const rows = domains.filter(d => d !== "Tous les domaines" && stats[d]?.attempts)
    .map(d => `${escapeHtml(d)} : ${stats[d].correct}/${stats[d].attempts} (${pct(stats[d].correct, stats[d].attempts)}%)`);
  return rows.length ? rows.join("\n") : "Aucune statistique par domaine pour l'instant.";
}
function hasDomainStats() {
  const stats = loadJson("dgfipDomainStats", {});
  return domains.some(d => d !== "Tous les domaines" && stats[d]?.attempts);
}
function lastScore() {
  return loadJson("dgfipScores", [])[0] || null;
}
function recommendedDomain() {
  return hasDomainStats() ? weakestDomain() : "Diagnostic initial";
}
function todayRecommendation() {
  if (!hasDomainStats()) return "Commencer par un diagnostic initial pour mesurer les domaines.";
  if (dueMistakeQuestions().length) return "Revoir les erreurs dues puis compléter avec le sujet zéro 2026.";
  if (mistakeQuestions().length) return "Réactiver le carnet d'erreurs et renforcer le domaine faible.";
  return `Faire 10 questions ciblées sur ${weakestDomain()} avec priorité au sujet zéro 2026.`;
}
function homeCoachMessages(last, mistakes) {
  const messages = [];
  if (!hasDomainStats()) messages.push("Commence par un diagnostic.");
  if (!mistakes) messages.push("Lance une série pour créer ton premier diagnostic.");
  if (last && pct(last.score, last.total) < 50) messages.push("Ce score sert à identifier quoi travailler, pas à te juger.");
  if (last && pct(last.score, last.total) >= 80) messages.push("Bon niveau, consolide maintenant les erreurs.");
  if (mistakes >= 15) messages.push("Priorité à la correction active, pas à l’enchaînement de nouvelles questions.");
  return messages.map(coachMessage).join("");
}
function scoreCoachMessage(scorePct, missesCount) {
  if (scorePct < 50) return "Ce score sert à identifier quoi travailler, pas à te juger.";
  if (scorePct >= 80) return "Bon niveau, consolide maintenant les erreurs.";
  if (missesCount >= 8) return "Priorité à la correction active, pas à l’enchaînement de nouvelles questions.";
  return "Prochaine étape : corrige une erreur activement, puis seulement ensuite ajoute de nouvelles questions.";
}
function takeUnique(target, source, limit = Infinity) {
  const seen = new Set(target.map(questionId));
  for (const item of source) {
    const id = questionId(item);
    if (seen.has(id)) continue;
    target.push(item);
    seen.add(id);
    if (target.length >= limit) break;
  }
}
function reliableFirst(list) {
  return [...list].sort((a, b) => {
    const score = item => (item.verificationLevel === "official_correction" ? 0 : item.sourceType === "official_zero_2026" ? 1 : item.verificationLevel === "manual_verified" ? 2 : 3);
    return score(a) - score(b);
  });
}
function diagnosticFirst(list) {
  const difficultyScore = item => item.difficulty === "easy" ? 0 : item.difficulty === "medium" ? 1 : 2;
  return reliableFirst(list).sort((a, b) => difficultyScore(a) - difficultyScore(b));
}
function isDiagnosticMode() {
  return activeQuizMode === "Diagnostic initial";
}
function isOldExamMode(mode = activeQuizMode) {
  return mode === "Examen ancien format — 54 questions / 1h30" || mode === "Mode examen 54";
}
function isZero2026Mode(mode = activeQuizMode) {
  return mode === "Sujet zéro 2026 — 50 questions" || mode === "Sujet zero 2026";
}
function isSimulationMode(mode = activeQuizMode) {
  return mode === "Simulation QCM 1h30";
}
function isDeferredCorrectionMode() {
  return isDiagnosticMode() || isSimulationMode();
}
function makeQuiz(list) {
  const now = Date.now();
  return { list, index: 0, score: 0, answers: [], startedAt: now, questionStartedAt: now, questionTimes: [] };
}
function markQuestionTime() {
  const now = Date.now();
  const elapsed = quiz.questionStartedAt ? now - quiz.questionStartedAt : 0;
  quiz.questionTimes[quiz.index] = elapsed;
  return elapsed;
}
function nextQuestion() {
  quiz.index++;
  quiz.questionStartedAt = Date.now();
  renderQuestion();
}
function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes} min ${String(seconds).padStart(2, "0")} s`;
}
function simulationElapsedMs() {
  return Date.now() - (quiz.startedAt || Date.now());
}
function simulationLimitMs() {
  return 90 * 60 * 1000;
}
function simulationTimerHtml() {
  if (!isSimulationMode()) return "";
  const elapsed = simulationElapsedMs();
  const remaining = Math.max(0, simulationLimitMs() - elapsed);
  return `<div class="card"><strong>Simulation QCM 1h30</strong>\nTemps écoulé : ${formatDuration(elapsed)}\nTemps restant indicatif : ${formatDuration(remaining)}\nCorrections affichées à la fin.</div>`;
}
function buildDailySessionQuestions() {
  const selected = [];
  const statsExist = hasDomainStats();
  const weak = weakestDomain();
  const mistakes = reliableFirst([...dueMistakeQuestions(), ...mistakeQuestions()]);
  takeUnique(selected, mistakes, Math.min(3, mistakes.length));

  const zero2026 = reliableFirst(qcm.filter(item => item.sourceType === "official_zero_2026" || String(item.year) === "2026"));
  if (statsExist) {
    takeUnique(selected, zero2026.filter(item => domainOf(item) === weak), 7);
    takeUnique(selected, reliableFirst(qcm.filter(item => domainOf(item) === weak)), 7);
  } else {
    for (const domain of domains.filter(d => d !== "Tous les domaines")) {
      takeUnique(selected, zero2026.filter(item => domainOf(item) === domain), Math.min(10, selected.length + 1));
    }
  }
  takeUnique(selected, zero2026, 10);
  takeUnique(selected, reliableFirst(qcm), 10);
  return selected.slice(0, 10);
}
function pickDailyJuryRule() {
  if (!juryRules.length) return null;
  return juryRules[new Date().getDate() % juryRules.length];
}
function pickDailyOralQuestion() {
  if (!oralQuestions.length) return "";
  return oralQuestions[new Date().getDate() % oralQuestions.length];
}
function startDailySession() {
  activeQuizMode = "Séance du jour";
  const list = buildDailySessionQuestions();
  quiz = makeQuiz(list);
  renderQuestion();
}
function startInitialDiagnostic() {
  activeQuizMode = "Diagnostic initial";
  quiz = makeQuiz(buildInitialDiagnostic(qcm));
  renderQuestion();
}
function daysUntil(dateText) {
  const [d, m, y] = dateText.split("/").map(Number);
  return Math.max(0, Math.ceil((new Date(y, m - 1, d) - new Date()) / 86400000));
}
function qcmIssues() {
  return qcm.filter(item => !item.prompt || !item.explanation || !Array.isArray(item.choices) || item.choices.length !== 4 || item.answer < 0 || item.answer >= item.choices.length);
}
function auditText() {
  const issues = qcmIssues().length;
  return issues === 0
    ? "Contrôle interne : aucune question active sans réponse."
    : `Contrôle interne : ${issues} question(s) à corriger avant entraînement.`;
}
function saveScore(score, total, details = {}) {
  const history = JSON.parse(localStorage.getItem("dgfipScores") || "[]");
  history.unshift({ score, total, mode: activeQuizMode, at: new Date().toLocaleString("fr-FR"), ...details });
  localStorage.setItem("dgfipScores", JSON.stringify(history.slice(0, 10)));
}
function renderNav() {
  nav.innerHTML = tabs.map(t => `<button class="${t === currentTab ? "active" : ""}" onclick="setTab('${t}')">${t}</button>`).join("");
}
function render() {
  renderNav();
  if (currentTab === "Annales") return renderAnnales();
  if (currentTab === "QCM") return renderQcmHome();
  if (currentTab === "Écrit") return renderWritten();
  if (currentTab === "Jury") return renderJury();
  if (currentTab === "Oral") return renderOral();
  if (currentTab === "Suivi") return renderProgress();
  if (currentTab === "Sources") return renderSources();
  renderHome();
}
function renderHome() {
  if (!qcm.length) {
    app.innerHTML = `<h2>Corpus JSON requis</h2>${card("Chargement impossible", `La preview web attend public_sources/corpus.json. Double-cliquez plutot sur ouvrir-preview.bat a la racine du projet. Le navigateur bloque souvent le chargement du JSON quand la page est ouverte directement en file://.\n\nDetail : ${escapeHtml(corpusLoadError?.message || "corpus absent")}`)}`;
    return;
  }
  const last = lastScore();
  const mistakes = mistakeQuestions().length;
  const due = dueMistakeQuestions().length;
  const reviews = reviewStats();
  app.innerHTML = `
    <h2>Tableau de bord</h2>
    <div class="grid">
      ${homeCoachMessages(last, mistakes)}
      ${card("S’entraîner aujourd’hui", `
        <div class="stat">10 QCM</div>
        <div class="muted">Domaine recommandé : ${escapeHtml(recommendedDomain())}.</div>
        <div class="muted">Carnet d’erreurs : ${mistakes} question${mistakes > 1 ? "s" : ""}${due ? `, dont ${due} due${due > 1 ? "s" : ""} aujourd’hui` : ""}.</div>
        <div class="muted">Fragiles : ${reviews.fragile} · maîtrisées : ${reviews.mastered}.</div>
        <div class="muted">Dernier score : ${last ? `${last.score}/${last.total} (${last.mode || "QCM"})` : "aucune série terminée"}.</div>
        <div style="margin:12px 0"><strong>Recommandation claire :</strong> ${escapeHtml(todayRecommendation())}</div>
        <button class="primary-action" onclick="startDailySession()">Lancer la séance du jour</button>
        <div class="toolbar" style="margin:12px 0 0">
          <button onclick="startDueReview()" ${due ? "" : "disabled"}>Réviser ce qui est dû aujourd’hui</button>
          <button onclick="startMistakeQuiz()" ${mistakes ? "" : "disabled"}>Revoir mes erreurs</button>
          ${hasDomainStats() ? "" : `<button onclick="startInitialDiagnostic()">Diagnostic initial</button>`}
        </div>
      `, "span-12")}
      ${card("QCM corrigés", `<div class="stat">${qcm.length}</div><div class="muted">questions actives avec réponse et explication, dont les 50 questions du sujet zéro QCM 2026.</div>`, "span-3")}
      ${card("Écrits", `<div class="stat">5 + 1</div><div class="muted">annales 2020-2024 + sujet zéro 2026.</div>`, "span-3")}
      ${card("Jury", `<div class="stat">5</div><div class="muted">rapports transformés en règles d’alerte.</div>`, "span-3")}
      ${card("Échéance", `<div class="stat">29/09</div><div class="muted">épreuves écrites 2026.</div>`, "span-3")}
      ${card("Carnet d’erreurs", `<div class="stat">${reviews.due}</div><div class="muted">erreur(s) à revoir aujourd'hui.\nQuestions encore fragiles : ${reviews.fragile}.\nErreurs maîtrisées : ${reviews.mastered}.\nCarnet actif : ${reviews.total}.</div>`, "span-12")}
      ${card("Aujourd'hui", `<div class="stat">${dueMistakeQuestions().length}</div><div class="muted">révision(s) dues aujourd'hui. Carnet total : ${mistakeQuestions().length}. Domaine a travailler : ${escapeHtml(weakestDomain())}. Jours avant les epreuves ecrites : ${daysUntil("29/09/2026")}.</div>`, "span-12")}
      ${card("Audit QCM", `<div class="stat">${qcm.length}/${officialQcmTotal}</div><div class="muted">${auditText()} Reste à intégrer avec corrigé vérifié : ${Math.max(0, officialQcmTotal - qcm.length)}.</div>`, "span-12")}
      ${card("Format 2026", `QCM de 1 h 30 sans calculatrice, coefficient 1.\nCas pratique écrit de 3 h avec calculatrice, coefficient 2.\nOral de 20 minutes, coefficient 3, avec présentation du parcours en 2 minutes.\nToute note inférieure à 5/20 est éliminatoire.`, "span-6")}
      ${card("Ancien format vs format 2026", `Les annales 2020-2024 restent utiles.\nLe sujet zéro 2026 est prioritaire pour se caler sur le nouveau format.\nLe mode 54 questions correspond aux anciennes annales.\nLe QCM 2026 reste une épreuve de 1h30 sans calculatrice.`, "span-6")}
      ${card("Plan d’attaque", `1. QCM quotidien : français, calcul, logique, culture générale.\n2. Une annale écrite par semaine : lecture rapide, plan, livrable.\n3. Une simulation orale tous les 10 jours : parcours, missions, déontologie.\n4. Relecture systématique : consigne, chiffres, structure, orthographe.`, "span-6")}
      ${card("Règle qualité", `Une question affichée dans l’entraînement doit toujours avoir une réponse attendue et une explication. Le sujet zéro QCM 2026 est intégré en totalité ; les autres items officiels dont le corrigé n’est pas encore vérifié restent dans les sources tant que l’intégration serait incomplète.`, "span-12")}
    </div>
    <div class="toolbar" style="margin-top:14px">
      <button onclick="startDailySession()">Lancer la séance du jour</button>
      <button onclick="setTab('QCM')">Lancer une série QCM</button>
      <button onclick="setTab('Écrit')">Travailler l’écrit</button>
      <button onclick="setTab('Annales')">Voir le corpus</button>
    </div>`;
}
function renderAnnales() {
  app.innerHTML = `<h2>Corpus d’annales utilisé</h2><div class="grid">${
    annales.map(a => card(`${a.year} · ${a.title}`, `<span class="pill">QCM</span> ${escapeHtml(a.qcm)}\n<span class="pill">Écrit</span> ${escapeHtml(a.ecrit)}\n<span class="pill">Jury</span> ${escapeHtml(a.jury)}\n\n${a.skills.map(s => `<span class="pill">${escapeHtml(s)}</span>`).join(" ")}`, "span-6")).join("")
  }</div>`;
}
function renderQcmHome() {
  const years = ["Toutes", ...new Set(qcm.map(q => q.year))];
  const cats = ["Toutes", ...new Set(qcm.map(q => q.category))];
  app.innerHTML = `<h2>Entraînement QCM</h2>
    <div class="card">
      <div class="toolbar">
        <select id="mode">${quizModes.map(m => `<option>${m}</option>`).join("")}</select>
        <select id="domain">${domains.map(d => `<option>${d}</option>`).join("")}</select>
        <select id="year">${years.map(y => `<option>${y}</option>`).join("")}</select>
        <select id="cat">${cats.map(c => `<option>${c}</option>`).join("")}</select>
        <select id="size"><option>10</option><option>20</option><option>50</option><option>54</option><option>Toutes</option></select>
        <button onclick="startQuiz()">Démarrer</button>
        ${dueMistakeQuestions().length ? `<button onclick="startDueReview()">Réviser ce qui est dû aujourd’hui (${dueMistakeQuestions().length})</button>` : ""}
        ${mistakeQuestions().length ? `<button onclick="startMistakeQuiz()">Carnet d'erreurs${dueMistakeQuestions().length ? ` (${dueMistakeQuestions().length})` : ""}</button>` : ""}
      </div>
      <div class="muted">Banque corrigee par domaines officiels. ${auditText()} Carnet d'erreurs : ${mistakeQuestions().length}. Domaine faible : ${escapeHtml(weakestDomain())}.</div>
    </div>
    <div class="grid">${homeCoachMessages(lastScore(), mistakeQuestions().length)}</div>
    ${card("Ancien format vs format 2026", `Les annales 2020-2024 restent utiles.\nLe sujet zéro 2026 est prioritaire pour se caler sur le nouveau format.\nLe mode 54 questions correspond aux anciennes annales.\nLe QCM 2026 reste une épreuve de 1h30 sans calculatrice.`)}
    <div class="grid">${summaryByDomain().map(s => card(s.name, `<div class="stat">${s.count}</div><div class="muted">${escapeHtml(s.rate)}</div>`, "span-3")).join("")}</div>`;
}
function summaryByDomain() {
  const map = {};
  qcm.forEach(item => map[domainOf(item)] = (map[domainOf(item)] || 0) + 1);
  const stats = loadJson("dgfipDomainStats", {});
  return Object.entries(map).map(([name, count]) => {
    const s = stats[name];
    return { name, count, rate: s?.attempts ? `${s.correct}/${s.attempts} bonnes reponses (${pct(s.correct, s.attempts)}%)` : "pas encore travaille" };
  });
}
function startQuiz() {
  const mode = document.querySelector("#mode").value;
  const domain = document.querySelector("#domain").value;
  const y = document.querySelector("#year").value;
  const c = document.querySelector("#cat").value;
  const size = document.querySelector("#size").value;
  activeQuizMode = mode;
  let list = qcm.filter(item => (y === "Toutes" || String(item.year) === y) && (c === "Toutes" || item.category === c) && (domain === "Tous les domaines" || domainOf(item) === domain));
  if (mode === "Carnet d'erreurs") list = dueMistakeQuestions().length ? dueMistakeQuestions() : mistakeQuestions();
  if (mode === "Faiblesses du jour") list = qcm.filter(item => domainOf(item) === weakestDomain());
  if (isZero2026Mode(mode)) list = list.filter(item => String(item.year) === "2026");
  if (mode === "Annale complete") list = list.filter(item => String(item.year) === (y === "Toutes" ? "2024" : y));
  if (mode === "Diagnostic initial") list = buildInitialDiagnostic(list);
  list = list.sort(() => Math.random() - .5);
  const plannedSize = mode === "Diagnostic initial" ? 20 : mode === "Serie courte 10 min" ? 10 : isOldExamMode(mode) || mode === "Annale complete" ? 54 : isZero2026Mode(mode) || isSimulationMode(mode) ? 50 : mode === "Faiblesses du jour" || mode === "Carnet d'erreurs" ? 20 : size === "Toutes" ? 0 : Number(size);
  if (plannedSize) list = list.slice(0, plannedSize);
  if (!list.length) {
    app.innerHTML = `<h2>Entraînement QCM</h2>${card("Aucune question disponible", "Aucune question corrigée ne correspond à ces filtres. Élargissez l’année ou la catégorie.")}<button onclick="renderQcmHome()">Retour aux filtres</button>`;
    return;
  }
  quiz = makeQuiz(list);
  renderQuestion();
}
function balancedDiagnostic(list) {
  return buildInitialDiagnostic(list);
}
function buildInitialDiagnostic(list) {
  const out = [];
  const easyMedium = list.filter(item => item.difficulty !== "hard");
  const source = easyMedium.length >= 20 ? easyMedium : list;
  domains.filter(d => d !== "Tous les domaines").forEach(domain => {
    takeUnique(out, diagnosticFirst(source.filter(item => domainOf(item) === domain)), Math.min(20, out.length + 3));
  });
  takeUnique(out, diagnosticFirst(source), 20);
  return (out.length ? out : source).slice(0, 20);
}
function startMistakeQuiz() {
  activeQuizMode = "Carnet d'erreurs";
  const list = dueMistakeQuestions().length ? dueMistakeQuestions() : mistakeQuestions();
  quiz = makeQuiz(list.sort(() => Math.random() - .5).slice(0, 20));
  renderQuestion();
}
function startDueReview() {
  activeQuizMode = "Révisions dues";
  const list = dueMistakeQuestions();
  quiz = makeQuiz(list.sort(() => Math.random() - .5).slice(0, 20));
  renderQuestion();
}
function renderQuestion() {
  if (!quiz.list.length) return renderQcmHome();
  if (isSimulationMode() && quiz.startedAt && simulationElapsedMs() >= simulationLimitMs() && quiz.index < quiz.list.length) {
    for (let i = quiz.index; i < quiz.list.length; i++) {
      const item = quiz.list[i];
      recordQuestion(item, false);
      saveErrorReason(questionId(item), "Temps écoulé");
      quiz.answers.push({ item, choice: null, ok: false, reason: "Temps écoulé", timeMs: 0 });
    }
    quiz.index = quiz.list.length;
    return renderQuestion();
  }
  if (quiz.index >= quiz.list.length) {
    const totalTimeMs = quiz.startedAt ? Date.now() - quiz.startedAt : 0;
    const answeredTimes = quiz.questionTimes.filter(time => Number.isFinite(time));
    const averageTimeMs = answeredTimes.length ? Math.round(answeredTimes.reduce((sum, time) => sum + time, 0) / answeredTimes.length) : 0;
    saveScore(quiz.score, quiz.list.length, { totalTimeMs, averageTimeMs, questionTimes: quiz.questionTimes });
    if (isDiagnosticMode()) return renderDiagnosticResult();
    if (isSimulationMode()) return renderSimulationResult(totalTimeMs, averageTimeMs);
    const scorePct = pct(quiz.score, quiz.list.length);
    const misses = quiz.answers.filter(a => !a.ok);
    const missDomains = [...new Set(misses.map(a => domainOf(a.item)))].join(", ") || "aucun";
    const dailyJury = activeQuizMode === "Séance du jour" ? pickDailyJuryRule() : null;
    const dailyOral = activeQuizMode === "Séance du jour" ? pickDailyOralQuestion() : "";
    const dailyFollowup = activeQuizMode === "Séance du jour"
      ? `${dailyJury ? card("Règle de jury à lire", `<strong>${escapeHtml(dailyJury[0])}</strong>\n${escapeHtml(dailyJury[1])}`) : ""}${dailyOral ? card("Question orale à répondre à voix haute", escapeHtml(dailyOral)) : ""}<button onclick="startDailySession()">Relancer une séance du jour</button>`
      : "";
    app.innerHTML = `<h2>Résultat</h2>${coachMessage(scoreCoachMessage(scorePct, misses.length))}${card("Score", `<div class="stat">${quiz.score}/${quiz.list.length}</div><div class="progress"><div style="width:${scorePct}%"></div></div>${scorePct >= 80 ? "Très solide. Passez en mode examen complet." : scorePct >= 60 ? "Base correcte. Reprenez les domaines perdus." : "Priorité aux fondamentaux et aux erreurs récurrentes."}\n\nMode : ${escapeHtml(activeQuizMode)}\nErreurs de la serie : ${misses.length}\nDomaines a revoir : ${escapeHtml(missDomains)}\nRecommandation : ${escapeHtml(todayRecommendation())}`)}${dailyFollowup}<button onclick="renderQcmHome()">Nouvelle série</button>${mistakeQuestions().length ? `<button onclick="startMistakeQuiz()">Revoir le carnet d'erreurs</button>` : ""}`;
    return;
  }
  const item = quiz.list[quiz.index];
  app.innerHTML = `<h2>Question ${quiz.index + 1}/${quiz.list.length}</h2>
    ${simulationTimerHtml()}
    <span class="pill">${item.year}</span><span class="pill">${escapeHtml(domainOf(item))}</span><span class="pill">${escapeHtml(item.category)}</span>${questionBadges(item)}
    <div class="muted">Progression : ${quiz.index + 1} sur ${quiz.list.length}. Réponds, puis lis la correction activement.</div>
    ${questionBlock(item)}
    ${item.choices.map((choice, i) => `<button class="choice" onclick="answer(${i})">${i + 1}. ${escapeHtml(choice)}</button>`).join("")}
    ${isDeferredCorrectionMode() ? `<button class="choice" onclick="skipQuestion()">Je ne sais pas / passer</button><div class="muted">${isSimulationMode() ? "Simulation QCM : corrections et bilan affichés à la fin." : "Diagnostic initial : les corrections seront affichées à la fin."}</div>` : ""}`;
}
function answer(choice) {
  const item = quiz.list[quiz.index];
  const ok = choice === item.answer;
  const timeMs = markQuestionTime();
  if (ok) quiz.score++;
  recordQuestion(item, ok);
  quiz.answers.push({ item, choice, ok, timeMs });
  if (isDeferredCorrectionMode()) {
    nextQuestion();
    return;
  }
  app.innerHTML = `<h2>${ok ? "Bonne réponse" : "À revoir"}</h2>
    <div class="card">
      ${questionBadges(item)}
      <h3>${escapeHtml(item.prompt)}</h3>
      <div class="answer-summary">
        <div><strong>Votre réponse</strong><br>${escapeHtml(item.choices[choice])}</div>
        <div><strong>Réponse attendue</strong><br>${escapeHtml(item.choices[item.answer])}</div>
      </div>
    </div>
    ${questionSupport(item)}
    ${card("Correction", correctionBlock(item))}
    ${ok ? "" : errorReasonHtml(item)}
    <button onclick="nextQuestion()">Question suivante</button>`;
}
function skipQuestion() {
  const item = quiz.list[quiz.index];
  const timeMs = markQuestionTime();
  recordQuestion(item, false);
  saveErrorReason(questionId(item), "Question non répondue");
  quiz.answers.push({ item, choice: null, ok: false, reason: "Question non répondue", timeMs });
  nextQuestion();
}
function renderSimulationResult(totalTimeMs, averageTimeMs) {
  const scorePct = pct(quiz.score, quiz.list.length);
  const misses = quiz.answers.filter(answer => !answer.ok);
  const weakDomains = [...new Set(misses.map(answer => domainOf(answer.item)))];
  const recommendation = weakDomains.length
    ? `Prochaine séance : revoir ${weakDomains[0]} puis lancer la révision du carnet d'erreurs.`
    : "Prochaine séance : passer sur une autre annale ou refaire une simulation complète dans 48 h.";
  const missedHtml = misses.length
    ? misses.map(answer => card(answer.item.prompt, `
        <span class="pill">${escapeHtml(domainOf(answer.item))}</span>
        <div>Votre réponse : ${answer.choice === null ? "Question non répondue" : escapeHtml(answer.item.choices[answer.choice])}</div>
        <div>Réponse attendue : ${escapeHtml(answer.item.choices[answer.item.answer])}</div>
        <div>Temps : ${formatDuration(answer.timeMs || 0)}</div>
        <div>${correctionBlock(answer.item)}</div>
        ${errorReasonHtml(answer.item, answer.reason || "")}
      `)).join("")
    : card("Erreurs à revoir", "Aucune erreur dans cette simulation.");
  app.innerHTML = `<h2>Bilan simulation QCM 1h30</h2>
    ${card("Score", `<div class="stat">${quiz.score}/${quiz.list.length}</div><div class="progress"><div style="width:${scorePct}%"></div></div>${scorePct}%`)}
    ${card("Temps", `Temps total : ${formatDuration(totalTimeMs)}\nTemps moyen par question : ${formatDuration(averageTimeMs)}\nTemps par question enregistré localement dans l'historique.`)}
    ${card("Domaines faibles", weakDomains.length ? escapeHtml(weakDomains.join(", ")) : "Aucun domaine faible détecté sur cette simulation.")}
    ${card("Erreurs à revoir", `${misses.length} erreur${misses.length > 1 ? "s" : ""} dans la simulation.\nCarnet d'erreurs actif : ${mistakeQuestions().length} question${mistakeQuestions().length > 1 ? "s" : ""}.`)}
    ${card("Recommandation", escapeHtml(recommendation))}
    <div class="toolbar"><button onclick="startDueReview()" ${dueMistakeQuestions().length ? "" : "disabled"}>Réviser ce qui est dû aujourd’hui</button><button onclick="startMistakeQuiz()" ${mistakeQuestions().length ? "" : "disabled"}>Revoir mes erreurs</button><button onclick="renderQcmHome()">Nouvelle simulation</button></div>
    <h2>Corrections</h2>${missedHtml}`;
}
function diagnosticDomainRows() {
  const stats = {};
  quiz.answers.forEach(answer => {
    const domain = domainOf(answer.item);
    stats[domain] = stats[domain] || { total: 0, correct: 0 };
    stats[domain].total += 1;
    if (answer.ok) stats[domain].correct += 1;
  });
  return Object.entries(stats).map(([domain, values]) => ({ domain, ...values, rate: pct(values.correct, values.total) }))
    .sort((a, b) => a.rate - b.rate);
}
function renderDiagnosticResult() {
  const rows = diagnosticDomainRows();
  const weakest = rows[0]?.domain || weakestDomain();
  const scorePct = pct(quiz.score, quiz.list.length);
  const misses = quiz.answers.filter(answer => !answer.ok);
  const domainHtml = rows.map(row => `<div><strong>${escapeHtml(row.domain)}</strong><br>${row.correct}/${row.total} (${row.rate}%)</div>`).join("");
  const recommendation = scorePct >= 80
    ? `Diagnostic solide. Entretiens le rythme avec la séance du jour et une simulation écrite courte.`
    : `Priorité : travailler ${weakest} aujourd’hui, puis refaire les erreurs du diagnostic demain.`;
  const missedHtml = misses.length
    ? misses.map(answer => card(answer.item.prompt, `
        <span class="pill">${escapeHtml(domainOf(answer.item))}</span>
        <div>Votre réponse : ${answer.choice === null ? "Question non répondue" : escapeHtml(answer.item.choices[answer.choice])}</div>
        <div>Réponse attendue : ${escapeHtml(answer.item.choices[answer.item.answer])}</div>
        <div>${correctionBlock(answer.item)}</div>
        ${errorReasonHtml(answer.item, answer.reason || "")}
      `)).join("")
    : card("Erreurs", "Aucune erreur dans ce diagnostic.");
  app.innerHTML = `<h2>Résultat du diagnostic initial</h2>
    ${card("Score global", `<div class="stat">${quiz.score}/${quiz.list.length}</div><div class="progress"><div style="width:${scorePct}%"></div></div>${scorePct}%`)}
    ${card("Score par domaine", `<div class="rubric">${domainHtml}</div>`)}
    ${card("Domaine le plus faible", `<div class="stat">${escapeHtml(weakest)}</div>${escapeHtml(recommendation)}`)}
    <div class="toolbar"><button onclick="startTargetedDomain('${escapeHtml(weakest)}')">Lancer une séance ciblée</button><button onclick="startInitialDiagnostic()">Refaire un diagnostic</button></div>
    <h2>Corrections et causes d’erreur</h2>${missedHtml}`;
}
function startTargetedDomain(domain) {
  activeQuizMode = `Séance ciblée ${domain}`;
  const list = reliableFirst(qcm.filter(item => domainOf(item) === domain)).slice(0, 10);
  quiz = makeQuiz(list);
  renderQuestion();
}
function errorReasonHtml(item, selected = "") {
  const reasons = ["Je ne savais pas", "J’ai mal lu", "Erreur de calcul", "J’ai répondu trop vite", "J’ai hésité"];
  return `<div class="card"><h3>Pourquoi ai-je raté ?</h3><div class="toolbar">${reasons.map(reason => `<button class="choice" onclick="saveErrorReason('${questionId(item)}','${escapeHtml(reason)}')" ${selected === reason ? "disabled" : ""}>${escapeHtml(reason)}</button>`).join("")}</div></div>`;
}
function saveErrorReason(id, reason) {
  const reasons = loadJson("dgfipErrorReasons", {});
  reasons[id] = reason;
  localStorage.setItem("dgfipErrorReasons", JSON.stringify(reasons));
}
const writtenRubric = [
  ["Compréhension de la consigne", 4],
  ["Structure", 3],
  ["Exploitation des documents", 4],
  ["Clarté", 3],
  ["Qualité opérationnelle du livrable", 4],
  ["Orthographe et expression", 2]
];
const deliverableTemplates = {
  "Synthèse": "Titre : Synthèse opérationnelle\n\nIntroduction\n- Objet du dossier : ...\n- Problème à traiter : ...\n\n1. Constats essentiels\n- Élément du dossier : ...\n- Chiffre ou donnée utile : ...\n\n2. Enjeux et risques\n- Pour le service : ...\n- Pour les usagers : ...\n\n3. Pistes d'action\n- Action prioritaire : ...\n- Point de vigilance : ...\n\nConclusion\n- Décision ou suite proposée : ...\n",
  "Réponse structurée": "Introduction : réponse directe à la consigne.\n\n1. Analyse de la situation\n- Faits du dossier : ...\n- Données à retenir : ...\n\n2. Réponse attendue\n- Argument 1 : ...\n- Argument 2 : ...\n\n3. Mise en œuvre\n- Action concrète : ...\n- Contrôle ou suivi : ...\n\nConclusion courte : ...\n",
  "Fiche": "FICHE\nObjet : ...\nDestinataire : ...\n\nContexte\n- ...\n\nPoints clés du dossier\n- ...\n\nAnalyse\n- Risques : ...\n- Chiffres utiles : ...\n\nPropositions\n- Action immédiate : ...\n- Action de suivi : ...\n\nVigilances\n- Délai : ...\n- Traçabilité : ...\n",
  "Courriel": "Objet : ...\n\nMadame, Monsieur,\n\nÀ la suite de ..., voici les éléments utiles.\n\n1. Constat\n...\n\n2. Points d'attention\n...\n\n3. Suite proposée\n...\n\nJe reste disponible pour tout complément.\n\nCordialement,\n",
  "Support de communication": "Titre du support : ...\n\nMessage principal\n- ...\n\nPublic visé\n- ...\n\nInformations à retenir\n- ...\n- Chiffre clé : ...\n\nConsignes pratiques\n- Étape 1 : ...\n- Étape 2 : ...\n\nContact / suite\n- ...\n"
};
function writtenRubricHtml() {
  return writtenRubric.map(([label, max]) => `<div><strong>${escapeHtml(label)}</strong><br>${max} pts</div>`).join("");
}
function selectedDeliverable() {
  return document.querySelector("#deliverable")?.value || "Synthèse";
}
function writtenSubjectYear(subject) {
  const match = String(subject?.source || "").match(/\d{4}/);
  return match ? match[0] : "";
}
function writtenPdfSource(subject) {
  const year = writtenSubjectYear(subject);
  if (!year) return null;
  const type = year === "2026" ? "zero-written" : "written";
  const source = (sourceItems || []).find(item => item.type === type && String(item.year) === year);
  if (source) return source;
  const fallbackUrl = year === "2026" ? zero.ecrit : ecritUrls[year];
  return fallbackUrl ? { title: `${subject.source} · PDF officiel`, year, type, url: fallbackUrl } : null;
}
function isPdfUrl(url) {
  return /\.pdf($|[?#])/i.test(url || "");
}
function canEmbedWrittenPdf(url) {
  try {
    const host = new URL(url).hostname;
    return host === "rejoindrelesfinancespubliques.economie.gouv.fr";
  } catch {
    return false;
  }
}
function writtenPdfViewer(subject) {
  const pdf = writtenPdfSource(subject);
  const viewerUrl = pdf?.localUrl || pdf?.url || "";
  if (!viewerUrl) return card("PDF du sujet", "Aucun PDF direct n’est référencé pour ce sujet. Utilisez la page Sources pour retrouver la référence officielle.", "span-12");
  const hasLocalPdf = Boolean(pdf.localUrl);
  const canEmbed = isPdfUrl(viewerUrl) && (hasLocalPdf || canEmbedWrittenPdf(viewerUrl));
  const escapedViewerUrl = escapeHtml(viewerUrl);
  const escapedOfficialUrl = escapeHtml(pdf.url || viewerUrl);
  const sourceLink = pdf.url && pdf.url !== viewerUrl
    ? `<a class="source" href="${escapedOfficialUrl}" target="_blank" rel="noreferrer">Ouvrir la source officielle</a>`
    : "";
  return `<section class="card span-12">
    <h3>PDF du sujet</h3>
    <span class="badge good">${escapeHtml(sourceReliability(pdf.type))}</span>
    <span class="badge soft">${escapeHtml(sourceTypeLabel(pdf.type))}</span>
    <span class="badge">${escapeHtml(pdf.year || "sans année")}</span>
    ${hasLocalPdf ? `<span class="badge good">PDF local embarqué</span>` : `<span class="badge warn">PDF distant</span>`}
    <div class="toolbar">
      <a class="source" href="${escapedViewerUrl}" target="_blank" rel="noreferrer">Ouvrir le PDF</a>
      ${sourceLink}
    </div>
    ${canEmbed
      ? `<iframe class="pdf-viewer" src="${escapedViewerUrl}#toolbar=1&navpanes=0" title="PDF du sujet écrit"></iframe><a class="pdf-fallback" href="${escapedViewerUrl}" target="_blank" rel="noreferrer">Si le PDF ne s’affiche pas, l’ouvrir dans un nouvel onglet.</a>`
      : `<div class="pdf-blocked"><strong>Affichage intégré indisponible</strong><br>Le fichier local n’est pas disponible pour ce sujet. Le lien officiel reste accessible dans un nouvel onglet.</div>`}
  </section>`;
}
function renderWritten() {
  const s = subjects[selectedSubject];
  app.innerHTML = `<h2>Écrit d’admissibilité</h2>
    <div class="toolbar">
      <select id="subject">${subjects.map((x, i) => `<option value="${i}" ${i === selectedSubject ? "selected" : ""}>${x.source} · ${x.title}</option>`).join("")}</select>
      <button onclick="selectedSubject=Number(document.querySelector('#subject').value);renderWritten()">Charger</button>
      <button onclick="selectedSubject=(selectedSubject+1)%subjects.length;renderWritten()">Autre sujet</button>
    </div>
    ${card(`${s.source} · ${s.title}`, `${s.prompt}\n\nAttendus : ${s.expected.join(", ")}`)}
    ${writtenPdfViewer(s)}
    <div class="grid">
      ${card("Parcours d'entraînement", "1. Lire le sujet et identifier le livrable demandé.\n2. Extraire les informations importantes du dossier.\n3. Construire un plan visible.\n4. Rédiger comme un futur agent public.\n5. Auto-évaluer avec la grille sur 20.\n6. Relire : consigne, chiffres, forme, orthographe.", "span-12")}
      ${card("Atelier 3 heures", "0-20 min : lire le sujet, entourer la consigne, repérer le livrable.\n20-45 min : extraire faits, chiffres, acteurs, risques, documents à citer.\n45-65 min : construire un plan court et opérationnel.\n65-165 min : rédiger le livrable.\n165-180 min : relire et corriger.", "span-6")}
      ${card("Conseils courts", "Éviter le hors-sujet.\nCiter les éléments du dossier.\nFaire un plan visible.\nUtiliser les chiffres proprement.\nRédiger comme un futur agent public.", "span-6")}
      ${card("Grille d'auto-évaluation sur 20", `<div class="rubric">${writtenRubricHtml()}</div>`, "span-12")}
    </div>
    <div class="card">
      <h3>Livrable à produire</h3>
      <div class="toolbar">
        <select id="deliverable">${Object.keys(deliverableTemplates).map(name => `<option>${name}</option>`).join("")}</select>
        <button onclick="insertPlan()">Insérer un squelette adapté</button>
      </div>
      <div class="muted">Types prévus : synthèse, réponse structurée, fiche, courriel, support de communication.</div>
    </div>
    <textarea id="copy" placeholder="Rédigez votre production ici. Commencez par le livrable, puis appuyez-vous sur les éléments du dossier."></textarea>
    <div class="toolbar"><button onclick="gradeCopy()">Auto-évaluer ma production</button><button onclick="insertPlan()">Insérer un squelette de plan</button></div>
    <div id="grade"></div>`;
}
function insertPlan() {
  document.querySelector("#copy").value = deliverableTemplates[selectedDeliverable()];
}
function gradeCopy() {
  const text = document.querySelector("#copy").value.trim();
  const lower = text.toLowerCase();
  const checks = [
    ["Compréhension de la consigne", 4, text.length > 700 && /consigne|objectif|demande|enjeu|probl[eè]me|livrable/.test(lower), text.length > 350],
    ["Structure", 3, /1\.|2\.|d'abord|ensuite|enfin|partie|conclusion|objet|contexte/.test(lower), text.split(/\n/).length > 6],
    ["Exploitation des documents", 4, /document|donnée|donnee|chiffre|pourcentage|graphique|tableau|dossier/.test(lower), /fait|constat|acteur|usager/.test(lower)],
    ["Clarté", 3, text.split(/[.!?]/).length > 8 && text.length > 500, text.length > 250],
    ["Qualité opérationnelle du livrable", 4, /fiche|courriel|synthèse|synthese|support|action|priorité|priorite|délai|delai|suivi|usager|service/.test(lower), /proposition|mesure|alerte|contrôle|controle/.test(lower)],
    ["Orthographe et expression", 2, text.split(/[.!?]/).length > 8 && !/\s{3,}/.test(text), text.length > 350]
  ];
  let total = 0;
  const rows = checks.map(([name, max, ok, partial]) => {
    const pts = ok ? max : partial ? Math.max(1, Math.floor(max / 2)) : 0;
    total += pts;
    return `<div><strong>${name}</strong><br>${pts}/${max}</div>`;
  }).join("");
  const advice = [];
  if (text.length < 700) advice.push("Développer la copie : une réponse trop courte couvre rarement le dossier.");
  if (!/document|dossier|fait|donnée|donnee|chiffre|pourcentage|graphique|tableau/.test(lower)) advice.push("Citer davantage les éléments du dossier, avec au moins un chiffre ou fait précis.");
  if (!/1\.|2\.|conclusion|objet|contexte/.test(lower)) advice.push("Rendre le plan plus visible.");
  if (!/action|priorité|priorite|suivi|délai|delai|usager|service/.test(lower)) advice.push("Rendre le livrable plus opérationnel.");
  if (!/dgfip|dgddi|finances publiques|douane|service public|agent public|administration/.test(lower)) advice.push("Adopter davantage la posture d'un futur agent public.");
  document.querySelector("#grade").innerHTML = card("Auto-évaluation indicative", `<div class="stat">${Math.min(20,total)}/20</div><div class="rubric">${rows}</div>\n${advice.length ? advice.join("\n") : "Copie structurée, exploitable et relue. Prochaine étape : refaire en 3 heures en conditions réelles."}`);
}
function renderJury() {
  app.innerHTML = `<h2>Rapports de jury transformés en règles</h2><div class="grid">${
    juryRules.map(r => card(r[0], escapeHtml(r[1]), "span-6")).join("")
  }${card("Seuil de sécurité", "Toute note inférieure à 5/20 est éliminatoire. L’application pousse donc à sécuriser chaque épreuve avant de viser la performance.", "span-12")}</div>`;
}
let oralTimerStart = 0;
let oralTimerHandle = null;
const oralRubric = [
  ["Clarté", 3],
  ["Motivation", 3],
  ["Connaissance des missions", 3],
  ["Posture de service public", 3],
  ["Comportement face à une situation difficile", 3],
  ["Concision", 2],
  ["Sincérité", 3]
];
const oralMotivationQuestions = [
  "Pourquoi ce concours et pourquoi maintenant ?",
  "Quelle expérience de votre parcours peut servir dans un accueil administratif ?",
  "Qu’attendez-vous d’un poste de catégorie C au quotidien ?",
  "Quelle qualité devez-vous encore renforcer avant l’oral ?",
  "Comment réagissez-vous lorsque vous ne réussissez pas du premier coup ?",
  "Qu’est-ce qui vous motive dans le contact avec les usagers ?"
];
const oralMissionQuestions = [
  "Quelles sont les grandes missions de la DGFiP ?",
  "Que savez-vous des missions de la DGDDI ?",
  "Pourquoi la confidentialité est-elle centrale dans ces administrations ?",
  "Comment définiriez-vous la neutralité du service public ?",
  "Que signifie continuité du service public pour un agent administratif ?",
  "Comment un agent de catégorie C contribue-t-il à la qualité du service rendu ?"
];
const oralSituations = [
  "Un usager s’énerve à l’accueil car il ne comprend pas un courrier.",
  "Un collègue vous demande de consulter un dossier sans motif professionnel.",
  "Vous constatez une erreur dans un courrier déjà envoyé.",
  "Deux agents vous donnent des consignes contradictoires.",
  "Un proche vous demande une information sur son dossier.",
  "Vous êtes en retard sur une tâche sensible et votre responsable vous sollicite sur une urgence.",
  "Un usager insiste pour obtenir une information confidentielle.",
  "Vous remarquez qu’un document contenant des données personnelles est laissé visible."
];
function oralRubricHtml() {
  return oralRubric.map(([label, max]) => `<div><strong>${escapeHtml(label)}</strong><br>${max} pts</div>`).join("");
}
function currentOralTime() {
  return oralTimerStart ? Date.now() - oralTimerStart : 0;
}
function updateOralTimer() {
  const target = document.querySelector("#oralTimer");
  if (!target) return;
  const elapsed = currentOralTime();
  const remaining = Math.max(0, 120000 - elapsed);
  target.innerHTML = `<div class="stat">${formatDuration(elapsed)}</div><div class="progress"><div style="width:${Math.min(100, Math.round(elapsed / 1200))}%"></div></div>Temps restant : ${formatDuration(remaining)}${elapsed > 120000 ? "\nObjectif dépassé : conclure en une phrase." : ""}`;
}
function startOralTimer() {
  oralTimerStart = Date.now();
  if (oralTimerHandle) clearInterval(oralTimerHandle);
  oralTimerHandle = setInterval(updateOralTimer, 500);
  updateOralTimer();
}
function resetOralTimer() {
  oralTimerStart = 0;
  if (oralTimerHandle) clearInterval(oralTimerHandle);
  oralTimerHandle = null;
  updateOralTimer();
}
function questionCards(title, questions) {
  return questions.map(q => card(title, escapeHtml(q), "span-6")).join("");
}
function renderOral() {
  const corpusQuestions = oralQuestions.filter(q => !oralMotivationQuestions.includes(q) && !oralMissionQuestions.includes(q) && !oralSituations.includes(q));
  app.innerHTML = `<h2>Oral d’admission</h2>
    <div class="grid">
      ${card("Présentation 2 minutes", `<div id="oralTimer"><div class="stat">0 min 00 s</div><div class="progress"><div style="width:0%"></div></div>Temps restant : 2 min 00 s</div><div class="toolbar"><button onclick="startOralTimer()">Démarrer le chronomètre</button><button onclick="resetOralTimer()">Réinitialiser</button></div>30 s : parcours et fil directeur.\n45 s : expériences utiles.\n30 s : compréhension DGFiP/DGDDI.\n15 s : motivation sobre et concrète.`, "span-12")}
      ${card("Méthode de réponse en mise en situation", "1. Comprendre la situation.\n2. Rappeler la règle ou le principe.\n3. Agir calmement.\n4. Alerter si nécessaire.\n5. Respecter l’usager, la hiérarchie et la déontologie.", "span-6")}
      ${card("Avertissement", "Les réponses types doivent aider à structurer, mais ne doivent pas être récitées mécaniquement. Le jury attend une réponse personnelle, calme et adaptée à la situation.", "span-6")}
      ${card("Simulation 20 minutes", "0-2 min : présentation personnelle chronométrée.\n2-7 min : motivation et parcours.\n7-12 min : DGFiP / DGDDI / service public.\n12-18 min : mises en situation.\n18-20 min : questions de rebond et conclusion.", "span-6")}
      ${card("Grille d'auto-évaluation sur 20", `<div class="rubric">${oralRubricHtml()}</div>`, "span-6")}
      ${card("Réflexes DGFiP / DGDDI / service public", "DGFiP : impôts, dépenses publiques, gestion publique locale, accueil, contrôle, recouvrement.\nDGDDI : protection du territoire, contrôle des marchandises, fiscalité douanière, lutte contre les trafics.\nService public : neutralité, continuité, égalité, discrétion professionnelle, probité, respect de la hiérarchie.", "span-12")}
      ${questionCards("Motivation", oralMotivationQuestions)}
      ${questionCards("DGFiP / DGDDI / service public", oralMissionQuestions)}
      ${questionCards("Mise en situation", oralSituations)}
      ${questionCards("Question réaliste", corpusQuestions)}
    </div>`;
  updateOralTimer();
}
function renderProgress() {
  const tasks = ["QCM français", "QCM calcul", "QCM culture générale", "QCM raisonnement", "Écrit 2020", "Écrit 2021", "Écrit 2022", "Écrit 2023", "Écrit 2024", "Sujet zéro 2026", "Présentation orale", "Mises en situation"];
  const done = JSON.parse(localStorage.getItem("dgfipDone") || "{}");
  const history = JSON.parse(localStorage.getItem("dgfipScores") || "[]");
  const count = tasks.filter(t => done[t]).length;
  app.innerHTML = `<h2>Suivi local</h2>
    ${card("Avancement", `<div class="stat">${count}/${tasks.length}</div><div class="progress"><div style="width:${pct(count,tasks.length)}%"></div></div>`, "span-12")}
    ${card("Pilotage QCM", `<div class="stat">${dueMistakeQuestions().length}</div><div class="muted">révision(s) dues aujourd'hui. Carnet total : ${mistakeQuestions().length}. Questions fragiles : ${fragileMistakeQuestions().length}. Questions maîtrisées : ${masteredMistakeQuestions().length}. Domaine fragile : ${escapeHtml(weakestDomain())}.\n${domainStatsHtml()}</div>`, "span-12")}
    <div class="toolbar">${dueMistakeQuestions().length ? `<button onclick="startDueReview()">Réviser ce qui est dû aujourd’hui</button>` : ""}${mistakeQuestions().length ? `<button onclick="startMistakeQuiz()">Revoir le carnet d'erreurs</button>` : ""}<button onclick="setTab('QCM')">Nouvelle serie</button></div>
    <div class="grid">
      <section class="card span-6"><h3>Checklist</h3>${tasks.map(t => `<label class="check"><input type="checkbox" ${done[t] ? "checked" : ""} onchange="toggleTask('${t}', this.checked)">${t}</label>`).join("")}</section>
      <section class="card span-6"><h3>Historique QCM</h3>${history.length ? history.map(h => `${h.at} · ${h.mode || "Libre"} · ${h.score}/${h.total}`).join("\n") : "Aucune série terminée pour l’instant."}</section>
    </div>`;
}
function toggleTask(task, checked) {
  const done = JSON.parse(localStorage.getItem("dgfipDone") || "{}");
  done[task] = checked;
  localStorage.setItem("dgfipDone", JSON.stringify(done));
  renderProgress();
}
function sourceFamily(type) {
  if (type === "official") return "Sources officielles";
  if (type === "qcm" || type === "written") return "Annales";
  if (type === "jury-report") return "Rapports de jury";
  if (type === "zero-qcm" || type === "zero-written") return "Sujets zéro";
  if (type === "qcm-correction") return "Corrections tierces";
  return "Questions générées ou adaptées";
}
function sourceTypeLabel(type) {
  return ({
    official: "page officielle",
    qcm: "annale QCM",
    written: "annale écrit",
    "jury-report": "rapport de jury",
    "zero-qcm": "sujet zéro QCM",
    "zero-written": "sujet zéro écrit",
    "qcm-correction": "correction tierce",
    adapted: "questions adaptées"
  })[type] || type || "source";
}
function sourceReliability(type) {
  if (["official", "qcm", "written", "jury-report", "zero-qcm", "zero-written"].includes(type)) return "Officielle";
  if (type === "qcm-correction") return "Tierce à vérifier";
  return "Adaptée, vérifiée par le validateur";
}
function sourceIntegrationStatus(type, year) {
  if (type === "zero-qcm") return "Sujet zéro QCM 2026 intégré en questions.";
  if (type === "zero-written") return "Sujet zéro écrit disponible dans l’entraînement écrit.";
  if (type === "qcm") {
    const count = qcm.filter(item => String(item.year) === String(year)).length;
    return count ? `${count} question(s) intégrée(s) ou adaptée(s).` : "Référencée, intégration QCM à compléter.";
  }
  if (type === "qcm-correction") return "Utilisée comme aide de contrôle, fiabilité inférieure à l’officiel.";
  if (type === "written") return "Disponible dans les sujets écrits ou le corpus d’annales.";
  if (type === "jury-report") return "Transformé en règles et alertes de préparation.";
  if (type === "adapted") return "Présente dans corpus.json, contrôlée par le validateur local.";
  return "Référence de cadrage.";
}
function sourceCard(item) {
  const type = item.type || "adapted";
  const href = item.url || "public_sources/corpus.json";
  const localLink = item.localUrl ? `<a class="source" href="${escapeHtml(item.localUrl)}" target="_blank" rel="noreferrer">PDF local embarqué</a>` : "";
  return `<div class="source-card">
    <strong>${escapeHtml(item.title)}</strong>
    <span class="badge">${escapeHtml(item.year || "sans année")}</span>
    <span class="badge soft">${escapeHtml(sourceTypeLabel(type))}</span>
    <span class="badge ${sourceReliability(type).startsWith("Officielle") ? "good" : "warn"}">${escapeHtml(sourceReliability(type))}</span>
    <div class="muted">Statut d’intégration : ${escapeHtml(sourceIntegrationStatus(type, item.year))}</div>
    <div class="muted">Lien : ${escapeHtml(href)}</div>
    ${item.localUrl ? `<div class="muted">Fichier local : ${escapeHtml(item.localUrl)}</div>` : ""}
    <div class="toolbar">
      <a class="source" href="${escapeHtml(href)}" target="_blank" rel="noreferrer">Source officielle</a>
      ${localLink}
    </div>
  </div>`;
}
function completeSources() {
  const items = sourceItems ? [...sourceItems] : [
    { title: "Page officielle", url: officialPage, type: "official" },
    { title: "Sujet zéro QCM 2026 avec corrigé", url: zero.qcm, type: "zero-qcm", year: 2026 },
    { title: "Sujet zéro écrit 2026", url: zero.ecrit, type: "zero-written", year: 2026 }
  ];
  const sourceTypes = [...new Set(qcm.map(item => item.sourceType).filter(Boolean))];
  sourceTypes.forEach(type => {
    if (type.startsWith("official_")) return;
    const count = qcm.filter(item => item.sourceType === type).length;
    items.push({
      title: `${count} question(s) générée(s) ou adaptée(s) · ${type}`,
      url: "public_sources/corpus.json",
      type: "adapted",
      year: "multi"
    });
  });
  items.push({
    title: `${qcm.length} question(s) structurée(s) dans le corpus local`,
    url: "public_sources/corpus.json",
    type: "adapted",
    year: "multi"
  });
  return items;
}
function renderSources() {
  const groups = {};
  completeSources().forEach(item => {
    const family = sourceFamily(item.type);
    groups[family] = groups[family] || [];
    groups[family].push(item);
  });
  const order = ["Sources officielles", "Sujets zéro", "Annales", "Rapports de jury", "Corrections tierces", "Questions générées ou adaptées"];
  app.innerHTML = `<h2>Sources et fiabilité</h2>
    ${card("Lecture des sources", "Les sources officielles servent de référence. Les corrections tierces aident à contrôler certains QCM mais restent moins fiables. Les questions générées ou adaptées sont conservées dans le corpus local et doivent passer le validateur.", "span-12")}
    ${order.filter(name => groups[name]?.length).map(name => `<h2>${name}</h2><div class="source-grid">${groups[name].map(sourceCard).join("")}</div>`).join("")}`;
}
loadCorpus();
