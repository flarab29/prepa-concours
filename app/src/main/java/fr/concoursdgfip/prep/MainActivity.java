package fr.concoursdgfip.prep;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.content.Intent;
import android.view.Gravity;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.HorizontalScrollView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;
import android.text.Editable;
import android.text.TextWatcher;

import androidx.core.content.FileProvider;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.text.Normalizer;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

public class MainActivity extends Activity {
    private static final int BRAND = Color.rgb(36, 75, 90);
    private static final int BRAND_DARK = Color.rgb(23, 50, 61);
    private static final int ACCENT = Color.rgb(201, 80, 59);
    private static final int PAPER = Color.rgb(247, 244, 238);
    private static final int INK = Color.rgb(33, 38, 43);
    private static final int MUTED = Color.rgb(91, 104, 113);
    private static final int LINE = Color.rgb(222, 216, 206);
    private static final int SOFT = Color.rgb(252, 250, 246);
    private static final int OK = Color.rgb(47, 125, 87);
    private static final int OFFICIAL_QCM_TOTAL = 374;
    private static final String[] YEAR_FILTERS = {"Toutes", "2026", "2025", "2024", "2023", "2022", "2021", "2020"};
    private static final String[] SIZE_FILTERS = {"10", "20", "50", "54", "Toutes"};
    private static final String[] DOMAIN_FILTERS = {
            "Tous les domaines", "Maths et logique", "Francais", "Histoire-geographie",
            "EMC et institutions", "Numerique", "MEF / DGFiP / DGDDI", "Actualite", "Culture generale"
    };
    private static final String[] QUIZ_MODES = {
            "Libre", "Diagnostic initial", "Serie courte 10 min", "Examen ancien format — 54 questions / 1h30",
            "Sujet zéro 2026 — 50 questions", "Simulation QCM 1h30", "Annale complete", "Faiblesses du jour", "Carnet d'erreurs"
    };
    private static final String[] PROGRESS_TASKS = {
            "QCM français", "QCM calcul", "QCM culture générale", "QCM raisonnement",
            "Écrit 2020", "Écrit 2021", "Écrit 2022", "Écrit 2023", "Écrit 2024", "Écrit 2025",
            "Sujet zéro 2026", "Présentation orale", "Mises en situation"
    };

    private LinearLayout root;
    private LinearLayout content;
    private ScrollView scrollView;
    private int currentQuestion = 0;
    private int score = 0;
    private List<Question> allQuestions = new ArrayList<>();
    private List<Question> quiz = new ArrayList<>();
    private List<Advice> adviceItems = new ArrayList<>();
    private List<Annal> annalItems = new ArrayList<>();
    private List<String> subjectItems = new ArrayList<>();
    private List<String> oralQuestionItems = new ArrayList<>();
    private List<Source> sourceItems = new ArrayList<>();
    private EditText productionInput;
    private TextView gradingResult;
    private TextView subjectText;
    private int subjectIndex = 0;
    private int selectedYearIndex = 0;
    private int selectedCategoryIndex = 0;
    private int selectedSizeIndex = 0;
    private int selectedDomainIndex = 0;
    private int selectedModeIndex = 0;
    private String activeQuizMode = "Libre";
    private int officialQcmTotal = OFFICIAL_QCM_TOTAL;
    private final List<Question> currentMistakes = new ArrayList<>();
    private final List<QuizAnswer> quizAnswers = new ArrayList<>();
    private final List<Long> questionTimes = new ArrayList<>();
    private long quizStartedAt = 0L;
    private long questionStartedAt = 0L;
    private final Handler oralTimerHandler = new Handler(Looper.getMainLooper());
    private long oralPresentationStart = 0L;
    private TextView oralTimerText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            loadCorpus();
            quiz = new ArrayList<>(allQuestions);
            showApp();
        } catch (Throwable error) {
            showStartupError(error);
        }
    }

    private void loadCorpus() throws Exception {
        CorpusRepository.Corpus corpus = CorpusRepository.load(this);
        officialQcmTotal = corpus.officialQcmTotal;
        allQuestions = corpus.questions;
        adviceItems = corpus.advices;
        annalItems = corpus.annales;
        subjectItems = corpus.subjects;
        oralQuestionItems = corpus.oralQuestions;
        sourceItems = corpus.sources;
    }

    private void showStartupError(Throwable error) {
        LinearLayout fallback = new LinearLayout(this);
        fallback.setOrientation(LinearLayout.VERTICAL);
        fallback.setPadding(dp(20), dp(24), dp(20), dp(20));
        fallback.setBackgroundColor(PAPER);
        TextView title = text("Prépa DGFiP C", 24, BRAND_DARK, true);
        TextView body = text("L'application a rencontré une erreur au démarrage.\n\n" + error.getClass().getSimpleName() + " : " + String.valueOf(error.getMessage()), 15, INK, false);
        body.setPadding(0, dp(12), 0, 0);
        fallback.addView(title);
        fallback.addView(body);
        setContentView(fallback);
    }

    private void showApp() {
        root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(PAPER);

        LinearLayout header = new LinearLayout(this);
        header.setOrientation(LinearLayout.VERTICAL);
        header.setPadding(dp(20), dp(24), dp(20), dp(18));
        header.setBackground(rounded(BRAND, BRAND_DARK, 0, 0));
        TextView title = text("Prépa DGFiP C", 27, Color.WHITE, true);
        TextView subtitle = text("Concours externe · entraînement QCM, écrit, oral et jury", 14, Color.WHITE, false);
        subtitle.setAlpha(0.86f);
        header.addView(title);
        header.addView(subtitle);
        root.addView(header);

        HorizontalScrollView tabScroller = new HorizontalScrollView(this);
        tabScroller.setHorizontalScrollBarEnabled(false);
        tabScroller.setBackgroundColor(Color.WHITE);
        LinearLayout tabs = new LinearLayout(this);
        tabs.setOrientation(LinearLayout.HORIZONTAL);
        tabs.setPadding(dp(8), dp(8), dp(8), dp(8));
        String[] names = {"Accueil", "Annales", "QCM", "Jury", "Ecrit", "Oral", "Suivi", "Sources"};
        for (String name : names) {
            Button b = button(name, true);
            b.setTextSize(12);
            b.setOnClickListener(v -> route(name));
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(dp(102), dp(44));
            lp.setMargins(0, 0, dp(8), 0);
            tabs.addView(b, lp);
        }
        tabScroller.addView(tabs);
        root.addView(tabScroller);

        scrollView = new ScrollView(this);
        content = new LinearLayout(this);
        content.setOrientation(LinearLayout.VERTICAL);
        content.setPadding(dp(16), dp(16), dp(16), dp(28));
        scrollView.addView(content, new ScrollView.LayoutParams(-1, -2));
        root.addView(scrollView, new LinearLayout.LayoutParams(-1, 0, 1));
        setContentView(root);
        route("Accueil");
    }

    private void route(String name) {
        if (!"Oral".equals(name)) stopOralTimer();
        content.removeAllViews();
        if ("QCM".equals(name)) showQuizHome();
        else if ("Annales".equals(name)) showAnnales();
        else if ("Jury".equals(name)) showMistakes();
        else if ("Ecrit".equals(name)) showWritten();
        else if ("Oral".equals(name)) showOral();
        else if ("Suivi".equals(name)) showProgress();
        else if ("Sources".equals(name)) showSources();
        else showDashboard();
        scrollTop();
    }

    private void showDashboard() {
        addSection("Objectif 2026");
        int mistakes = mistakeCount();
        int due = dueMistakeCount();
        for (String message : coachMessages(mistakes)) content.addView(card("Conseil", message));
        content.addView(card("S'entraîner aujourd'hui",
                "Domaine recommandé : " + recommendedDomainLabel() + ".\n" +
                        "Carnet d'erreurs : " + mistakes + " question" + (mistakes > 1 ? "s" : "") +
                        (due > 0 ? ", dont " + due + " due" + (due > 1 ? "s" : "") + " aujourd'hui" : "") + ".\n" +
                        "Dernier score : " + lastScoreText() + ".\n" +
                        "Action recommandée : " + dailyRecommendation() + ".\n\n" +
                        "Séance prévue : 10 QCM, priorité aux erreurs, au sujet zéro 2026 et aux questions les plus fiables."));
        addPrimaryAction("Lancer la séance du jour", this::startDailySession);
        if (due > 0) addAction("Réviser ce qui est dû aujourd'hui", this::startDueReview);
        else addDisabledAction("Réviser ce qui est dû aujourd'hui");
        if (mistakes > 0) addAction("Revoir mes erreurs", this::startMistakeQuiz);
        else addDisabledAction("Revoir mes erreurs");
        if (!hasDomainStats()) addAction("Diagnostic initial", this::startInitialDiagnostic);
        content.addView(card("Aujourd'hui",
                "Jours avant les epreuves ecrites : " + daysUntil("29/09/2026") + ".\n" +
                        "Révisions dues aujourd'hui : " + dueMistakeCount() + ".\n" +
                        "Carnet d'erreurs QCM : " + mistakes + " question" + (mistakes > 1 ? "s" : "") + " au total.\n" +
                        "Questions fragiles : " + fragileMistakeCount() + ".\n" +
                        "Erreurs maîtrisées : " + masteredMistakeCount() + ".\n" +
                        "Domaine le plus fragile : " + weakestDomain() + ".\n" +
                        "Prochaine action conseillee : " + dailyRecommendation()));
        content.addView(card("Corpus exploité",
                allQuestions.size() + " questions corrigées avec réponse et explication.\nQCM 2020-2025 et sujet zéro QCM 2026 référencés, dont le sujet zéro 2026 complet en entraînement corrigé.\n6 annales écrites 2020-2025 analysées par thème, livrable et compétence.\n6 rapports de jury 2020-2025 référencés et transformés en règles d’alerte.\n2 sujets zéro 2026 intégrés pour coller au nouveau format."));
        content.addView(card("Audit QCM",
                bankHealth() + "\nQuestions officielles QCM référencées : " + officialQcmTotal + ".\nQuestions corrigées sélectionnables : " + allQuestions.size() + ".\nReste à intégrer avec corrigé vérifié : " + Math.max(0, officialQcmTotal - allQuestions.size()) + "."));
        content.addView(card("Calendrier officiel",
                "Inscriptions : 27 avril au 9 juin 2026\nÉpreuves écrites : 29 septembre 2026\nRésultats pré-admissibilité : 16 octobre 2026\nAdmissibilité : 6 novembre 2026\nOraux : 4 au 8 janvier 2027\nAdmission : 22 janvier 2027"));
        content.addView(card("Format des épreuves",
                "QCM de 1 h 30, coefficient 1, sans calculatrice.\nCas pratique écrit de 3 h, coefficient 2, calculatrice autorisée.\nOral de 20 minutes, coefficient 3, avec présentation du parcours en 2 minutes.\nToute note inférieure à 5/20 est éliminatoire."));
        content.addView(card("Ancien format vs format 2026",
                "Les annales 2020-2025 restent utiles.\nLe sujet zéro 2026 est prioritaire pour se caler sur le nouveau format.\nLe mode 54 questions correspond aux anciennes annales.\nLe QCM 2026 reste une épreuve de 1h30 sans calculatrice."));
        content.addView(card("Plan intelligent",
                "Phase 1 : sécuriser le QCM avec 15 minutes par jour sur français, calcul, logique et culture générale.\nPhase 2 : refaire chaque annale écrite en conditions dégradées : lecture rapide, plan, livrable opérationnel.\nPhase 3 : oral coefficient 3 : présentation de 2 minutes, missions DGFiP/DGDDI, mises en situation et déontologie.\nObjectif : ne jamais descendre sous 5/20 et viser 12+ sur les deux écrits."));
        content.addView(card("Couverture corrigée",
                "Toutes les questions proposées dans l’entraînement ont une réponse attendue et une explication. Le sujet zéro QCM 2026 est intégré en totalité. Les autres questions officielles dont le corrigé n’est pas encore vérifié restent signalées dans les sources plutôt que transformées en QCM incomplet."));
        addAction("Lancer la recommandation", this::startRecommendedQuiz);
        addAction("Commencer un QCM", () -> route("QCM"));
        addAction("Explorer les annales", () -> route("Annales"));
        addAction("M’entraîner à l’écrit", () -> route("Ecrit"));
    }

    private void showAnnales() {
        addSection("Toutes les annales");
        content.addView(card("Couverture officielle",
                "Cette version référence toute la liste publiée sur la page officielle : QCM, écrits et rapports de jury 2020 à 2025, ainsi que les deux sujets zéro 2026. Les questions 2025 restent hors entraînement tant qu’un corrigé vérifié n’est pas intégré."));
        for (Annal annal : annalItems) {
            content.addView(card(annal.year + " · " + annal.title,
                    "QCM : " + annal.qcm + "\nÉcrit : " + annal.written + "\nSignal jury : " + annal.jury + "\nÀ travailler : " + annal.training));
        }
    }

    private void showQuizHome() {
        addSection("Entraînement QCM");
        List<Question> filtered = buildQuizList();
        TextView selectionSummary = card("Sélection", quizSelectionBody(filtered.size()));
        content.addView(selectionSummary);

        content.addView(selector("Mode", Arrays.asList(QUIZ_MODES), selectedModeIndex, index -> {
            selectedModeIndex = index;
            applyModeDefaults();
            updateQuizSelectionSummary(selectionSummary);
        }));

        content.addView(selector("Domaine officiel", Arrays.asList(DOMAIN_FILTERS), selectedDomainIndex, index -> {
            selectedDomainIndex = index;
            updateQuizSelectionSummary(selectionSummary);
        }));

        content.addView(selector("Année", Arrays.asList(YEAR_FILTERS), selectedYearIndex, index -> {
            selectedYearIndex = index;
            updateQuizSelectionSummary(selectionSummary);
        }));

        List<String> categoryOptions = categories();
        if (selectedCategoryIndex >= categoryOptions.size()) selectedCategoryIndex = 0;
        content.addView(selector("Catégorie", categoryOptions, selectedCategoryIndex, index -> {
            selectedCategoryIndex = index;
            updateQuizSelectionSummary(selectionSummary);
        }));

        content.addView(selector("Taille de série", Arrays.asList(SIZE_FILTERS), selectedSizeIndex, index -> {
            selectedSizeIndex = index;
            updateQuizSelectionSummary(selectionSummary);
        }));

        Button reset = button("Réinitialiser la sélection", true);
        reset.setOnClickListener(v -> {
            selectedYearIndex = 0;
            selectedCategoryIndex = 0;
            selectedSizeIndex = 0;
            selectedDomainIndex = 0;
            selectedModeIndex = 0;
            content.removeAllViews();
            showQuizHome();
        });
        LinearLayout.LayoutParams resetLp = new LinearLayout.LayoutParams(-1, dp(48));
        resetLp.setMargins(0, 0, 0, dp(12));
        content.addView(reset, resetLp);
        if (mistakeCount() > 0) addAction("Revoir mon carnet d'erreurs", this::startMistakeQuiz);

        addAction("Démarrer la série", this::startQuizFromFilters);
        content.addView(card("Ancien format vs format 2026",
                "Les annales 2020-2025 restent utiles.\nLe sujet zéro 2026 est prioritaire pour se caler sur le nouveau format.\nLe mode 54 questions correspond aux anciennes annales.\nLe QCM 2026 reste une épreuve de 1h30 sans calculatrice."));
        content.addView(card("Qualité de la banque",
                bankHealth() + "\nSeules les questions avec réponse attendue et explication sont proposées en entraînement."));

        addSection("Par catégorie");
        for (String summary : domainSummary()) {
            content.addView(card(summary, ""));
        }
    }

    private void showQuiz() {
        content.removeAllViews();
        scrollTop();
        if (quiz.isEmpty()) {
            addSection("QCM indisponible");
            content.addView(card("Aucune question disponible", "Aucune question corrigée ne correspond aux filtres choisis. Revenez à la sélection QCM et élargissez l'année ou la catégorie."));
            addAction("Retour aux filtres", this::goQuizHome);
            return;
        }
        if (isSimulationMode() && quizStartedAt > 0L && System.currentTimeMillis() - quizStartedAt >= simulationLimitMs() && currentQuestion < quiz.size()) {
            while (currentQuestion < quiz.size()) {
                Question remaining = quiz.get(currentQuestion);
                while (questionTimes.size() <= currentQuestion) questionTimes.add(0L);
                questionTimes.set(currentQuestion, 0L);
                recordQuestionResult(remaining, false);
                quizAnswers.add(new QuizAnswer(remaining, -1, false, 0L));
                currentMistakes.add(remaining);
                getPreferences(MODE_PRIVATE).edit().putString("reason_" + questionId(remaining), "Temps écoulé").apply();
                currentQuestion++;
            }
        }
        if (currentQuestion >= quiz.size()) {
            addSection("Résultat QCM");
            int percent = Math.round((score * 100f) / quiz.size());
            saveScore(score, quiz.size(), percent);
            if ("Diagnostic initial".equals(activeQuizMode)) {
                showDiagnosticResult(percent);
                return;
            }
            if (isSimulationMode()) {
                showSimulationResult(percent);
                return;
            }
            content.addView(card("Conseil", scoreCoachMessage(percent, currentMistakes.size())));
            content.addView(card("Score", score + "/" + quiz.size() + " - " + percent + "%\n" + feedback(percent) + "\n\n" + sessionReviewText()));
            if ("Séance du jour".equals(activeQuizMode)) {
                Advice advice = dailyAdvice();
                if (advice != null) content.addView(card("Règle de jury à lire", advice.title + "\n\n" + advice.body));
                String oral = dailyOralQuestion();
                if (!oral.isEmpty()) content.addView(card("Question orale à répondre à voix haute", oral));
                addAction("Relancer la séance du jour", this::startDailySession);
            }
            if (!currentMistakes.isEmpty()) addAction("Rejouer les erreurs de cette serie", this::startSessionMistakeQuiz);
            if (mistakeCount() > 0) addAction("Revoir tout mon carnet d'erreurs", this::startMistakeQuiz);
            addAction("Recommencer", () -> {
                currentQuestion = 0;
                score = 0;
                currentMistakes.clear();
                quizAnswers.clear();
                questionTimes.clear();
                quizStartedAt = System.currentTimeMillis();
                questionStartedAt = quizStartedAt;
                showQuiz();
            });
            addAction("Nouvelle sélection", this::goQuizHome);
            return;
        }
        Question q = quiz.get(currentQuestion);
        addSection("Question " + (currentQuestion + 1) + "/" + quiz.size());
        if (isSimulationMode()) content.addView(card("Simulation QCM 1h30",
                "Temps écoulé : " + formatDuration(System.currentTimeMillis() - quizStartedAt) +
                        "\nTemps restant indicatif : " + formatDuration(Math.max(0L, simulationLimitMs() - (System.currentTimeMillis() - quizStartedAt))) +
                        "\nCorrections affichées à la fin."));
        TextView meta = pill(q.category + " · " + q.source);
        content.addView(meta);
        addQuestionPrompt(q);
        for (int i = 0; i < q.choices.length; i++) {
            final int index = i;
            Button b = button((i + 1) + ". " + q.choices[i], true);
            b.setGravity(Gravity.START | Gravity.CENTER_VERTICAL);
            b.setOnClickListener(v -> answerQuestion(q, index));
            b.setMinHeight(dp(58));
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(-1, -2);
            lp.setMargins(0, 0, 0, dp(8));
            content.addView(b, lp);
        }
        if (isDeferredCorrectionMode()) addAction("Je ne sais pas / passer", this::skipDeferredQuestion);
        addAction("Arrêter la série", this::goQuizHome);
    }

    private void answerQuestion(Question q, int picked) {
        boolean ok = picked == q.answer;
        long timeMs = markCurrentQuestionTime();
        if (ok) score++;
        if (isDeferredCorrectionMode()) {
            recordQuestionResult(q, ok);
            quizAnswers.add(new QuizAnswer(q, picked, ok, timeMs));
            if (!ok) currentMistakes.add(q);
            currentQuestion++;
            questionStartedAt = System.currentTimeMillis();
            showQuiz();
            return;
        }
        showAnswer(q, picked, timeMs);
    }

    private void skipDeferredQuestion() {
        Question q = quiz.get(currentQuestion);
        long timeMs = markCurrentQuestionTime();
        recordQuestionResult(q, false);
        quizAnswers.add(new QuizAnswer(q, -1, false, timeMs));
        currentMistakes.add(q);
        currentQuestion++;
        questionStartedAt = System.currentTimeMillis();
        showQuiz();
    }

    private long markCurrentQuestionTime() {
        long elapsed = questionStartedAt > 0L ? System.currentTimeMillis() - questionStartedAt : 0L;
        while (questionTimes.size() <= currentQuestion) questionTimes.add(0L);
        questionTimes.set(currentQuestion, elapsed);
        return elapsed;
    }

    private void showAnswer(Question q, int picked, long timeMs) {
        content.removeAllViews();
        scrollTop();
        boolean ok = picked == q.answer;
        recordQuestionResult(q, ok);
        if (!ok) currentMistakes.add(q);
        addSection(ok ? "Bonne réponse" : "À revoir");
        content.addView(card(q.prompt, "Votre réponse : " + q.choices[picked] + "\nRéponse attendue : " + q.choices[q.answer]));
        addQuestionSupport(q);
        content.addView(card("Correction", correctionText(q)));
        if (!ok) addErrorReasonActions(questionId(q));
        addAction("Question suivante", () -> {
            currentQuestion++;
            questionStartedAt = System.currentTimeMillis();
            showQuiz();
        });
        addAction("Revenir aux filtres", this::goQuizHome);
    }

    private void goQuizHome() {
        content.removeAllViews();
        showQuizHome();
    }

    private void startQuizFromFilters() {
        List<Question> list = buildQuizList();
        if (list.isEmpty()) {
            quiz = new ArrayList<>();
            currentQuestion = 0;
            score = 0;
            content.removeAllViews();
            showQuiz();
            return;
        }
        Collections.shuffle(list);
        int requested = selectedSizeForMode();
        if (requested > 0 && list.size() > requested) {
            list = new ArrayList<>(list.subList(0, requested));
        }
        quiz = list;
        currentQuestion = 0;
        score = 0;
        currentMistakes.clear();
        quizAnswers.clear();
        questionTimes.clear();
        quizStartedAt = System.currentTimeMillis();
        questionStartedAt = quizStartedAt;
        activeQuizMode = selectedModeLabel();
        content.removeAllViews();
        showQuiz();
    }

    private List<Question> buildQuizList() {
        String mode = selectedModeLabel();
        if ("Carnet d'erreurs".equals(mode)) return dueMistakeQuestions().isEmpty() ? mistakeQuestions() : dueMistakeQuestions();
        if ("Faiblesses du jour".equals(mode)) return questionsForDomain(weakestDomain());

        List<Question> base = new ArrayList<>();
        String forcedYear = null;
        if (isZero2026Mode(mode)) forcedYear = "2026";
        if ("Annale complete".equals(mode)) forcedYear = "Toutes".equals(selectedYearLabel()) ? "2024" : selectedYearLabel();

        String year = forcedYear == null ? selectedYearLabel() : forcedYear;
        String category = selectedCategoryLabel();
        String domain = selectedDomainLabel();
        for (Question q : allQuestions) {
            if (!"Toutes".equals(year) && !year.equals(questionYear(q))) continue;
            if (!"Toutes".equals(category) && !category.equals(q.category)) continue;
            if (!"Tous les domaines".equals(domain) && !domain.equals(domainOf(q))) continue;
            base.add(q);
        }
        if ("Diagnostic initial".equals(mode)) return balancedDiagnostic(base);
        return base;
    }

    private List<Question> balancedDiagnostic(List<Question> source) {
        List<Question> result = new ArrayList<>();
        List<Question> base = new ArrayList<>();
        for (Question q : source) if (!"hard".equals(q.difficulty)) base.add(q);
        if (base.size() < 20) base = source;
        for (String domain : DOMAIN_FILTERS) {
            if ("Tous les domaines".equals(domain)) continue;
            takeUnique(result, reliableFirst(filterByDomain(base, domain)), Math.min(20, result.size() + 3));
        }
        takeUnique(result, reliableFirst(new ArrayList<>(base)), 20);
        if (result.isEmpty()) result.addAll(source);
        return result.size() > 20 ? new ArrayList<>(result.subList(0, 20)) : result;
    }

    private void applyModeDefaults() {
        String mode = selectedModeLabel();
        if (isZero2026Mode(mode)) {
            selectedYearIndex = indexOf(YEAR_FILTERS, "2026");
            selectedSizeIndex = indexOf(SIZE_FILTERS, "50");
        } else if (isOldExamMode(mode) || "Annale complete".equals(mode)) {
            selectedSizeIndex = indexOf(SIZE_FILTERS, "54");
            if ("Annale complete".equals(mode) && "Toutes".equals(selectedYearLabel())) selectedYearIndex = indexOf(YEAR_FILTERS, "2024");
        } else if (isSimulationMode(mode)) {
            selectedSizeIndex = indexOf(SIZE_FILTERS, "50");
        } else if ("Serie courte 10 min".equals(mode)) {
            selectedSizeIndex = indexOf(SIZE_FILTERS, "10");
        } else if ("Faiblesses du jour".equals(mode)) {
            selectedDomainIndex = indexOf(DOMAIN_FILTERS, weakestDomain());
            selectedSizeIndex = indexOf(SIZE_FILTERS, "20");
        }
    }

    private int indexOf(String[] values, String value) {
        for (int i = 0; i < values.length; i++) if (values[i].equals(value)) return i;
        return 0;
    }

    private void startRecommendedQuiz() {
        if (mistakeCount() > 0) {
            startMistakeQuiz();
            return;
        }
        selectedModeIndex = indexOf(QUIZ_MODES, "Faiblesses du jour");
        selectedDomainIndex = indexOf(DOMAIN_FILTERS, weakestDomain());
        startQuizFromFilters();
    }

    private void startInitialDiagnostic() {
        List<Question> list = balancedDiagnostic(new ArrayList<>(allQuestions));
        if (list.size() > 20) list = new ArrayList<>(list.subList(0, 20));
        startQuizWithList(list, "Diagnostic initial", false);
    }

    private void startDailySession() {
        startQuizWithList(buildDailySessionQuestions(), "Séance du jour", false);
    }

    private List<Question> buildDailySessionQuestions() {
        List<Question> selected = new ArrayList<>();
        List<Question> mistakes = reliableFirst(new ArrayList<>(dueMistakeQuestions()));
        mistakes.addAll(reliableFirst(new ArrayList<>(mistakeQuestions())));
        takeUnique(selected, mistakes, Math.min(3, mistakes.size()));

        List<Question> zero2026 = reliableFirst(questionsFromZero2026());
        if (hasDomainStats()) {
            String weak = weakestDomain();
            takeUnique(selected, filterByDomain(zero2026, weak), 7);
            takeUnique(selected, reliableFirst(questionsForDomain(weak)), 7);
        } else {
            for (String domain : DOMAIN_FILTERS) {
                if ("Tous les domaines".equals(domain)) continue;
                takeUnique(selected, filterByDomain(zero2026, domain), Math.min(10, selected.size() + 1));
            }
        }
        takeUnique(selected, zero2026, 10);
        takeUnique(selected, reliableFirst(new ArrayList<>(allQuestions)), 10);
        if (selected.size() > 10) return new ArrayList<>(selected.subList(0, 10));
        return selected;
    }

    private void takeUnique(List<Question> target, List<Question> source, int maxSize) {
        Set<String> seen = new LinkedHashSet<>();
        for (Question q : target) seen.add(questionId(q));
        for (Question q : source) {
            if (target.size() >= maxSize) return;
            if (seen.add(questionId(q))) target.add(q);
        }
    }

    private List<Question> reliableFirst(List<Question> source) {
        Collections.sort(source, (a, b) -> reliableRank(a) - reliableRank(b));
        return source;
    }

    private int reliableRank(Question q) {
        if ("official_correction".equals(q.verificationLevel)) return 0;
        if ("official_zero_2026".equals(q.sourceType)) return 1;
        if ("manual_verified".equals(q.verificationLevel)) return 2;
        return 3;
    }

    private List<Question> questionsFromZero2026() {
        List<Question> result = new ArrayList<>();
        for (Question q : allQuestions) {
            if ("official_zero_2026".equals(q.sourceType) || "2026".equals(questionYear(q))) result.add(q);
        }
        return result;
    }

    private List<Question> filterByDomain(List<Question> source, String domain) {
        List<Question> result = new ArrayList<>();
        for (Question q : source) if (domain.equals(domainOf(q))) result.add(q);
        return result;
    }

    private void startMistakeQuiz() {
        List<Question> due = dueMistakeQuestions();
        startQuizWithList(due.isEmpty() ? mistakeQuestions() : due, "Carnet d'erreurs", true);
    }

    private void startDueReview() {
        startQuizWithList(dueMistakeQuestions(), "Révisions dues", true);
    }

    private void startSessionMistakeQuiz() {
        startQuizWithList(new ArrayList<>(currentMistakes), "Erreurs de la serie", true);
    }

    private void startQuizWithList(List<Question> list, String mode, boolean shuffle) {
        if (shuffle) Collections.shuffle(list);
        int requested = selectedSizeForMode();
        if (requested > 0 && list.size() > requested) list = new ArrayList<>(list.subList(0, requested));
        quiz = list;
        currentQuestion = 0;
        score = 0;
        currentMistakes.clear();
        quizAnswers.clear();
        questionTimes.clear();
        quizStartedAt = System.currentTimeMillis();
        questionStartedAt = quizStartedAt;
        activeQuizMode = mode;
        content.removeAllViews();
        showQuiz();
    }

    private LinearLayout selector(String label, List<String> values, int selectedIndex, SelectionHandler handler) {
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setPadding(dp(14), dp(10), dp(14), dp(12));
        box.setBackground(rounded(Color.WHITE, LINE, 1, 8));
        LinearLayout.LayoutParams boxLp = new LinearLayout.LayoutParams(-1, -2);
        boxLp.setMargins(0, 0, 0, dp(10));
        box.setLayoutParams(boxLp);

        TextView title = text(label, 13, MUTED, true);
        title.setPadding(0, 0, 0, dp(6));
        box.addView(title);

        Spinner spinner = new Spinner(this);
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item, values);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner.setAdapter(adapter);
        spinner.setSelection(Math.max(0, Math.min(selectedIndex, values.size() - 1)), false);
        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                handler.onSelected(position);
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
        box.addView(spinner, new LinearLayout.LayoutParams(-1, dp(48)));
        return box;
    }

    private void updateQuizSelectionSummary(TextView selectionSummary) {
        selectionSummary.setText("Sélection\n\n" + quizSelectionBody(buildQuizList().size()));
    }

    private String quizSelectionBody(int available) {
        int requested = selectedSizeForMode();
        int planned = requested > 0 ? Math.min(requested, available) : available;
        String status = available == 0
                ? "\nAucune question ne correspond à ces filtres : élargissez l'année ou la catégorie."
                : "\nSérie prévue : " + planned + " question" + (planned > 1 ? "s" : "") + ".";
        return "Mode : " + selectedModeLabel() +
                "\nDomaine : " + selectedDomainLabel() +
                "\nAnnée : " + selectedYearLabel() +
                "\nCatégorie : " + selectedCategoryLabel() +
                "\nTaille demandée : " + selectedSizeLabel() +
                "\nQuestions disponibles : " + available +
                status;
    }

    private List<Question> filteredQuestions() {
        List<Question> result = new ArrayList<>();
        String year = selectedYearLabel();
        String category = selectedCategoryLabel();
        String domain = selectedDomainLabel();
        for (Question q : allQuestions) {
            if (!"Toutes".equals(year) && !year.equals(questionYear(q))) continue;
            if (!"Toutes".equals(category) && !category.equals(q.category)) continue;
            if (!"Tous les domaines".equals(domain) && !domain.equals(domainOf(q))) continue;
            result.add(q);
        }
        return result;
    }

    private List<String> categories() {
        Set<String> values = new LinkedHashSet<>();
        for (Question q : allQuestions) values.add(q.category);
        List<String> result = new ArrayList<>();
        result.add("Toutes");
        result.addAll(values);
        return result;
    }

    private List<String> categorySummary() {
        List<String> result = new ArrayList<>();
        for (String category : categories()) {
            if ("Toutes".equals(category)) continue;
            int count = 0;
            for (Question q : allQuestions) if (category.equals(q.category)) count++;
            result.add(category + " : " + count + " question" + (count > 1 ? "s" : ""));
        }
        return result;
    }

    private List<String> domainSummary() {
        List<String> result = new ArrayList<>();
        for (String domain : DOMAIN_FILTERS) {
            if ("Tous les domaines".equals(domain)) continue;
            int count = 0;
            int attempts = getPreferences(MODE_PRIVATE).getInt(statKey("attempts", domain), 0);
            int correct = getPreferences(MODE_PRIVATE).getInt(statKey("correct", domain), 0);
            for (Question q : allQuestions) if (domain.equals(domainOf(q))) count++;
            String rate = attempts == 0 ? "pas encore travaille" : Math.round((correct * 100f) / attempts) + "% de reussite";
            result.add(domain + " : " + count + " question" + (count > 1 ? "s" : "") + " · " + rate);
        }
        return result;
    }

    private String selectedYearLabel() {
        return YEAR_FILTERS[Math.max(0, Math.min(selectedYearIndex, YEAR_FILTERS.length - 1))];
    }

    private String selectedCategoryLabel() {
        List<String> categories = categories();
        if (selectedCategoryIndex >= categories.size()) selectedCategoryIndex = 0;
        return categories.get(selectedCategoryIndex);
    }

    private String selectedSizeLabel() {
        return SIZE_FILTERS[Math.max(0, Math.min(selectedSizeIndex, SIZE_FILTERS.length - 1))];
    }

    private String selectedDomainLabel() {
        return DOMAIN_FILTERS[Math.max(0, Math.min(selectedDomainIndex, DOMAIN_FILTERS.length - 1))];
    }

    private String selectedModeLabel() {
        return QUIZ_MODES[Math.max(0, Math.min(selectedModeIndex, QUIZ_MODES.length - 1))];
    }

    private boolean isOldExamMode(String mode) {
        return "Examen ancien format — 54 questions / 1h30".equals(mode) || "Mode examen 54".equals(mode);
    }

    private boolean isZero2026Mode(String mode) {
        return "Sujet zéro 2026 — 50 questions".equals(mode) || "Sujet zero 2026".equals(mode);
    }

    private boolean isSimulationMode() {
        return "Simulation QCM 1h30".equals(activeQuizMode);
    }

    private boolean isSimulationMode(String mode) {
        return "Simulation QCM 1h30".equals(mode);
    }

    private boolean isDeferredCorrectionMode() {
        return "Diagnostic initial".equals(activeQuizMode) || isSimulationMode();
    }

    private int selectedSize() {
        String label = selectedSizeLabel();
        if ("Toutes".equals(label)) return -1;
        return Integer.parseInt(label);
    }

    private int selectedSizeForMode() {
        String mode = selectedModeLabel();
        if ("Diagnostic initial".equals(mode)) return 20;
        if ("Serie courte 10 min".equals(mode)) return 10;
        if (isOldExamMode(mode) || "Annale complete".equals(mode)) return 54;
        if (isZero2026Mode(mode) || isSimulationMode(mode)) return 50;
        if ("Faiblesses du jour".equals(mode) || "Carnet d'erreurs".equals(mode)) return 20;
        return selectedSize();
    }

    private String questionYear(Question q) {
        for (String year : YEAR_FILTERS) {
            if (!"Toutes".equals(year) && q.source.contains(year)) return year;
        }
        return q.source;
    }

    private String bankHealth() {
        int invalid = 0;
        for (Question q : allQuestions) {
            if (q.prompt == null || q.prompt.trim().isEmpty()) invalid++;
            else if (q.choices == null || q.choices.length != 4) invalid++;
            else if (q.answer < 0 || q.answer >= q.choices.length) invalid++;
            else if (q.explanation == null || q.explanation.trim().isEmpty()) invalid++;
        }
        if (invalid == 0) return "Contrôle interne : aucune question active sans réponse.";
        return "Contrôle interne : " + invalid + " question(s) à corriger avant entraînement.";
    }

    private String domainOf(Question q) {
        if (q.domain != null && !q.domain.trim().isEmpty()) return q.domain;
        String c = normalize(q.category);
        if (hasAny(c, "calcul", "mathem", "equation", "fraction", "pourcentage", "statistique", "probabilite", "geometrie", "volume", "vitesse", "arithmetique", "proportionnalite", "moyenne", "radicaux", "nombres", "raisonnement", "suite", "logique", "codage", "anagrammes")) {
            return "Maths et logique";
        }
        if (hasAny(c, "orthographe", "accord", "grammaire", "conjugaison", "vocabulaire", "expression", "genre", "figure")) {
            return "Francais";
        }
        if (hasAny(c, "histoire", "geographie", "geopolitique")) {
            return "Histoire-geographie";
        }
        if (hasAny(c, "enseignement", "civique", "institution", "union europeenne", "administration", "administratif")) {
            return "EMC et institutions";
        }
        if (hasAny(c, "numerique")) {
            return "Numerique";
        }
        if (hasAny(c, "mef", "dgfip", "dgddi", "douane", "douanes", "missions")) {
            return "MEF / DGFiP / DGDDI";
        }
        if (hasAny(c, "actualite")) {
            return "Actualite";
        }
        return "Culture generale";
    }

    private String normalize(String value) {
        String normalized = Normalizer.normalize(String.valueOf(value).toLowerCase(Locale.FRANCE), Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
    }

    private boolean hasAny(String text, String... values) {
        for (String value : values) if (text.contains(value)) return true;
        return false;
    }

    private String questionId(Question q) {
        if (q.id != null && !q.id.trim().isEmpty()) return q.id;
        return "q" + Math.abs((q.source + "|" + q.category + "|" + q.prompt).hashCode());
    }

    private String statKey(String kind, String domain) {
        return "domain_" + kind + "_" + normalize(domain).replaceAll("[^a-z0-9]+", "_");
    }

    private void recordQuestionResult(Question q, boolean ok) {
        SharedPreferences prefs = getPreferences(MODE_PRIVATE);
        String domain = domainOf(q);
        String id = questionId(q);
        int attempts = prefs.getInt("review_attempts_" + id, prefs.getInt("miss_" + id, 0));
        int successes = prefs.getInt("review_successes_" + id, 0);
        int failures = prefs.getInt("review_failures_" + id, prefs.getInt("miss_" + id, 0));
        int streak = prefs.getInt("review_streak_" + id, prefs.getInt("streak_" + id, 0));
        String mastery = prefs.getString("review_mastery_" + id, failures > 0 ? "fragile" : "new");
        long nextReview = prefs.getLong("review_next_" + id, prefs.getLong("due_" + id, 0));
        SharedPreferences.Editor editor = prefs.edit()
                .putInt(statKey("attempts", domain), prefs.getInt(statKey("attempts", domain), 0) + 1)
                .putString("last_domain", domain)
                .putInt("review_attempts_" + id, attempts + 1)
                .putLong("review_last_" + id, System.currentTimeMillis());
        if (ok) {
            editor.putInt(statKey("correct", domain), prefs.getInt(statKey("correct", domain), 0) + 1);
            int nextStreak = streak + 1;
            editor.putInt("review_successes_" + id, successes + 1)
                    .putInt("review_failures_" + id, failures)
                    .putInt("review_streak_" + id, nextStreak)
                    .putInt("streak_" + id, nextStreak);
            if (failures > 0 && nextStreak >= 3) {
                mastery = "mastered";
                nextReview = addDays(30);
                editor.putInt("miss_" + id, 0);
            } else if (failures > 0 && nextStreak >= 2) {
                mastery = "review_7_days";
                nextReview = addDays(7);
                editor.putInt("miss_" + id, failures);
            } else if (failures > 0) {
                mastery = "review_3_days";
                nextReview = addDays(3);
                editor.putInt("miss_" + id, failures);
            }
        } else {
            failures += 1;
            mastery = "fragile";
            nextReview = addDays(1);
            editor.putInt("review_successes_" + id, successes)
                    .putInt("review_failures_" + id, failures)
                    .putInt("review_streak_" + id, 0)
                    .putInt("miss_" + id, failures)
                    .putInt("streak_" + id, 0);
        }
        editor.putString("review_mastery_" + id, mastery)
                .putLong("review_next_" + id, nextReview)
                .putLong("due_" + id, nextReview);
        editor.apply();
    }

    private boolean isMistake(Question q) {
        String id = questionId(q);
        SharedPreferences prefs = getPreferences(MODE_PRIVATE);
        return reviewFailures(id) > 0 && !"mastered".equals(prefs.getString("review_mastery_" + id, "fragile"));
    }

    private boolean isDueMistake(Question q) {
        SharedPreferences prefs = getPreferences(MODE_PRIVATE);
        String id = questionId(q);
        return reviewFailures(id) > 0
                && prefs.getLong("review_next_" + id, prefs.getLong("due_" + id, 0)) <= System.currentTimeMillis();
    }

    private int reviewFailures(String id) {
        SharedPreferences prefs = getPreferences(MODE_PRIVATE);
        return prefs.getInt("review_failures_" + id, prefs.getInt("miss_" + id, 0));
    }

    private long addDays(int days) {
        return System.currentTimeMillis() + days * 86400000L;
    }

    private List<Question> mistakeQuestions() {
        List<Question> result = new ArrayList<>();
        for (Question q : allQuestions) if (isMistake(q)) result.add(q);
        return result;
    }

    private int mistakeCount() {
        return mistakeQuestions().size();
    }

    private List<Question> dueMistakeQuestions() {
        List<Question> result = new ArrayList<>();
        for (Question q : allQuestions) if (isDueMistake(q)) result.add(q);
        return result;
    }

    private int dueMistakeCount() {
        return dueMistakeQuestions().size();
    }

    private int masteredMistakeCount() {
        SharedPreferences prefs = getPreferences(MODE_PRIVATE);
        int count = 0;
        for (Question q : allQuestions) {
            String id = questionId(q);
            if (reviewFailures(id) > 0 && "mastered".equals(prefs.getString("review_mastery_" + id, ""))) count++;
        }
        return count;
    }

    private int fragileMistakeCount() {
        SharedPreferences prefs = getPreferences(MODE_PRIVATE);
        int count = 0;
        for (Question q : allQuestions) {
            String id = questionId(q);
            String mastery = prefs.getString("review_mastery_" + id, "");
            if (reviewFailures(id) > 0 && !"mastered".equals(mastery)
                    && ("".equals(mastery) || "new".equals(mastery) || "fragile".equals(mastery) || "review_tomorrow".equals(mastery))) {
                count++;
            }
        }
        return count;
    }

    private List<Question> questionsForDomain(String domain) {
        List<Question> result = new ArrayList<>();
        for (Question q : allQuestions) if (domain.equals(domainOf(q))) result.add(q);
        if (result.isEmpty()) result.addAll(allQuestions);
        return result;
    }

    private String weakestDomain() {
        SharedPreferences prefs = getPreferences(MODE_PRIVATE);
        String weakest = "Maths et logique";
        int lowest = 101;
        boolean hasStats = false;
        for (String domain : DOMAIN_FILTERS) {
            if ("Tous les domaines".equals(domain)) continue;
            int attempts = prefs.getInt(statKey("attempts", domain), 0);
            if (attempts == 0) {
                if (!hasStats) weakest = domain;
                continue;
            }
            hasStats = true;
            int correct = prefs.getInt(statKey("correct", domain), 0);
            int rate = Math.round((correct * 100f) / attempts);
            if (rate < lowest) {
                lowest = rate;
                weakest = domain;
            }
        }
        return weakest;
    }

    private boolean hasDomainStats() {
        SharedPreferences prefs = getPreferences(MODE_PRIVATE);
        for (String domain : DOMAIN_FILTERS) {
            if (!"Tous les domaines".equals(domain) && prefs.getInt(statKey("attempts", domain), 0) > 0) {
                return true;
            }
        }
        return false;
    }

    private String recommendedDomainLabel() {
        return hasDomainStats() ? weakestDomain() : "Diagnostic initial";
    }

    private String lastScoreText() {
        int last = getPreferences(MODE_PRIVATE).getInt("last_score", -1);
        return last >= 0 ? last + "% au dernier QCM terminé" : "aucune série terminée";
    }

    private List<String> coachMessages(int mistakes) {
        List<String> messages = new ArrayList<>();
        int last = getPreferences(MODE_PRIVATE).getInt("last_score", -1);
        if (!hasDomainStats()) messages.add("Commence par un diagnostic.");
        if (mistakes == 0) messages.add("Lance une série pour créer ton premier diagnostic.");
        if (last >= 0 && last < 50) messages.add("Ce score sert à identifier quoi travailler, pas à te juger.");
        if (last >= 80) messages.add("Bon niveau, consolide maintenant les erreurs.");
        if (mistakes >= 15) messages.add("Priorité à la correction active, pas à l’enchaînement de nouvelles questions.");
        return messages;
    }

    private String scoreCoachMessage(int percent, int misses) {
        if (percent < 50) return "Ce score sert à identifier quoi travailler, pas à te juger.";
        if (percent >= 80) return "Bon niveau, consolide maintenant les erreurs.";
        if (misses >= 8) return "Priorité à la correction active, pas à l’enchaînement de nouvelles questions.";
        return "Prochaine étape : corrige une erreur activement, puis ajoute seulement ensuite de nouvelles questions.";
    }

    private String dailyRecommendation() {
        if (dueMistakeCount() > 0) return "rejouer les erreurs dues aujourd'hui avant d'ajouter de nouvelles questions";
        if (mistakeCount() > 0) return "continuer le domaine faible en attendant la prochaine révision du carnet";
        String weak = weakestDomain();
        if (getPreferences(MODE_PRIVATE).getInt(statKey("attempts", weak), 0) == 0) {
            return "faire un diagnostic initial pour mesurer les domaines";
        }
        return "faire une serie courte sur " + weak;
    }

    private Advice dailyAdvice() {
        if (adviceItems.isEmpty()) return null;
        return adviceItems.get(Math.abs(new Date().getDate()) % adviceItems.size());
    }

    private String dailyOralQuestion() {
        if (oralQuestionItems.isEmpty()) return "";
        return oralQuestionItems.get(Math.abs(new Date().getDate()) % oralQuestionItems.size());
    }

    private void showDiagnosticResult(int percent) {
        content.addView(card("Score global", score + "/" + quiz.size() + " - " + percent + "%"));
        String weakest = weakestDiagnosticDomain();
        content.addView(card("Score par domaine", diagnosticDomainText()));
        content.addView(card("Domaine le plus faible",
                weakest + "\n\n" + (percent >= 80
                        ? "Diagnostic solide : gardez la séance du jour et ajoutez une simulation écrite."
                        : "Priorité : travailler ce domaine aujourd'hui, puis refaire les erreurs du diagnostic demain.")));
        addAction("Lancer une séance ciblée", () -> startTargetedDomain(weakest));
        if (!currentMistakes.isEmpty()) {
            content.addView(card("Pourquoi ai-je raté ?",
                    "À renseigner après relecture des corrections : Je ne savais pas, J'ai mal lu, Erreur de calcul, J'ai répondu trop vite, J'ai hésité."));
            addErrorReasonActions("last_diagnostic_error");
            for (QuizAnswer answer : quizAnswers) {
                if (!answer.ok) {
                    String picked = answer.picked < 0 ? "Question non répondue" : answer.question.choices[answer.picked];
                    content.addView(card(answer.question.prompt,
                            "Votre réponse : " + picked + "\nRéponse attendue : " + answer.question.choices[answer.question.answer] +
                                    "\n\nCorrection : " + correctionText(answer.question)));
                }
            }
        }
        addAction("Refaire un diagnostic", this::startInitialDiagnostic);
        addAction("Nouvelle sélection", this::goQuizHome);
    }

    private void showSimulationResult(int percent) {
        long totalTime = totalQuizTimeMs();
        long averageTime = averageQuestionTimeMs();
        String weakDomains = weakDomainsFromMistakes();
        String recommendation = currentMistakes.isEmpty()
                ? "Prochaine séance : refaire une simulation complète dans 48 h ou passer sur une annale écrite."
                : "Prochaine séance : revoir " + weakDomains + ", puis lancer le carnet d'erreurs.";
        content.addView(card("Score", score + "/" + quiz.size() + " - " + percent + "%"));
        content.addView(card("Temps",
                "Temps total : " + formatDuration(totalTime) +
                        "\nTemps moyen par question : " + formatDuration(averageTime) +
                        "\nTemps par question enregistré localement dans l'historique."));
        content.addView(card("Domaines faibles", currentMistakes.isEmpty() ? "Aucun domaine faible détecté sur cette simulation." : weakDomains));
        content.addView(card("Erreurs à revoir",
                currentMistakes.size() + " erreur" + (currentMistakes.size() > 1 ? "s" : "") + " dans la simulation.\n" +
                        "Carnet d'erreurs actif : " + mistakeCount() + " question" + (mistakeCount() > 1 ? "s" : "") + "."));
        content.addView(card("Recommandation", recommendation));
        for (QuizAnswer answer : quizAnswers) {
            if (!answer.ok) {
                String picked = answer.picked < 0 ? "Question non répondue" : answer.question.choices[answer.picked];
                content.addView(card(answer.question.prompt,
                        "Domaine : " + domainOf(answer.question) +
                                "\nVotre réponse : " + picked +
                                "\nRéponse attendue : " + answer.question.choices[answer.question.answer] +
                                "\nTemps : " + formatDuration(answer.timeMs) +
                                "\n\nCorrection : " + correctionText(answer.question)));
                addErrorReasonActions(questionId(answer.question));
            }
        }
        if (dueMistakeCount() > 0) addAction("Réviser ce qui est dû aujourd'hui", this::startDueReview);
        if (mistakeCount() > 0) addAction("Revoir mes erreurs", this::startMistakeQuiz);
        addAction("Nouvelle simulation", this::goQuizHome);
    }

    private long simulationLimitMs() {
        return 90L * 60L * 1000L;
    }

    private long totalQuizTimeMs() {
        if (quizStartedAt <= 0L) return 0L;
        return Math.max(0L, System.currentTimeMillis() - quizStartedAt);
    }

    private long averageQuestionTimeMs() {
        long total = 0L;
        int count = 0;
        for (long time : questionTimes) {
            if (time >= 0L) {
                total += time;
                count++;
            }
        }
        return count == 0 ? 0L : Math.round(total / (float) count);
    }

    private String formatDuration(long ms) {
        long seconds = Math.max(0L, Math.round(ms / 1000f));
        long minutes = seconds / 60L;
        long rest = seconds % 60L;
        return minutes + " min " + (rest < 10 ? "0" : "") + rest + " s";
    }

    private String weakDomainsFromMistakes() {
        Set<String> domains = new LinkedHashSet<>();
        for (Question q : currentMistakes) domains.add(domainOf(q));
        return domains.isEmpty() ? "aucun" : String.join(", ", domains);
    }

    private String diagnosticDomainText() {
        StringBuilder builder = new StringBuilder();
        for (String domain : DOMAIN_FILTERS) {
            if ("Tous les domaines".equals(domain)) continue;
            int total = 0;
            int correct = 0;
            for (QuizAnswer answer : quizAnswers) {
                if (domain.equals(domainOf(answer.question))) {
                    total++;
                    if (answer.ok) correct++;
                }
            }
            if (total > 0) {
                if (builder.length() > 0) builder.append("\n");
                builder.append(domain).append(" : ").append(correct).append("/").append(total)
                        .append(" (").append(Math.round((correct * 100f) / total)).append("%)");
            }
        }
        return builder.length() == 0 ? "Aucun domaine calculé." : builder.toString();
    }

    private String weakestDiagnosticDomain() {
        String weakest = weakestDomain();
        int lowest = 101;
        for (String domain : DOMAIN_FILTERS) {
            if ("Tous les domaines".equals(domain)) continue;
            int total = 0;
            int correct = 0;
            for (QuizAnswer answer : quizAnswers) {
                if (domain.equals(domainOf(answer.question))) {
                    total++;
                    if (answer.ok) correct++;
                }
            }
            if (total > 0) {
                int rate = Math.round((correct * 100f) / total);
                if (rate < lowest) {
                    lowest = rate;
                    weakest = domain;
                }
            }
        }
        return weakest;
    }

    private void startTargetedDomain(String domain) {
        startQuizWithList(reliableFirst(questionsForDomain(domain)), "Séance ciblée " + domain, false);
    }

    private String sessionReviewText() {
        if (currentMistakes.isEmpty()) return "Aucune erreur dans cette serie : passez au mode examen ou a un autre domaine.";
        Set<String> domains = new LinkedHashSet<>();
        for (Question q : currentMistakes) domains.add(domainOf(q));
        return "Erreurs de la serie : " + currentMistakes.size() + ".\nDomaines a revoir : " + String.join(", ", domains) + ".";
    }

    private String domainStatsText() {
        SharedPreferences prefs = getPreferences(MODE_PRIVATE);
        StringBuilder builder = new StringBuilder();
        for (String domain : DOMAIN_FILTERS) {
            if ("Tous les domaines".equals(domain)) continue;
            int attempts = prefs.getInt(statKey("attempts", domain), 0);
            if (attempts == 0) continue;
            int correct = prefs.getInt(statKey("correct", domain), 0);
            if (builder.length() > 0) builder.append("\n");
            builder.append(domain).append(" : ").append(correct).append("/").append(attempts)
                    .append(" (").append(Math.round((correct * 100f) / attempts)).append("%)");
        }
        return builder.length() == 0 ? "Aucune statistique par domaine pour l'instant." : builder.toString();
    }

    private long daysUntil(String frenchDate) {
        try {
            Date target = new SimpleDateFormat("dd/MM/yyyy", Locale.FRANCE).parse(frenchDate);
            long diff = target.getTime() - new Date().getTime();
            return Math.max(0, Math.round(diff / 86400000f));
        } catch (Exception ignored) {
            return 0;
        }
    }

    private void showMistakes() {
        addSection("Anti-erreurs du jury");
        for (Advice advice : adviceItems) {
            content.addView(card(advice.title, advice.body));
        }
        addSection("Routine avant épreuve");
        content.addView(card("Check-list copie",
                "Lire la consigne jusqu’au verbe d’action.\nIdentifier le livrable attendu : réponse, synthèse, tableau, courriel ou fiche.\nRéserver 10 minutes à la relecture : orthographe, chiffres, politesse, cohérence."));
    }

    private void showOral() {
        addSection("Oral coefficient 3");
        content.addView(card("Présentation 2 minutes",
                "30 secondes : parcours et fil directeur.\n45 secondes : expériences utiles pour un poste de catégorie C.\n30 secondes : compréhension des missions DGFiP/DGDDI.\n15 secondes : motivation sobre et concrète."));
        oralTimerText = card("Chronomètre présentation", "0 min 00 s\nTemps restant : 2 min 00 s");
        content.addView(oralTimerText);
        addAction("Démarrer le chronomètre 2 minutes", this::startOralTimer);
        addAction("Réinitialiser le chronomètre", this::resetOralTimer);
        content.addView(card("Méthode de réponse en mise en situation",
                "1. Comprendre la situation.\n2. Rappeler la règle ou le principe.\n3. Agir calmement.\n4. Alerter si nécessaire.\n5. Respecter l’usager, la hiérarchie et la déontologie."));
        content.addView(card("Avertissement",
                "Les réponses types doivent aider à structurer, mais ne doivent pas être récitées mécaniquement. Le jury attend une réponse personnelle, calme et adaptée à la situation."));
        content.addView(card("Simulation 20 minutes",
                "0-2 min : présentation personnelle chronométrée.\n" +
                        "2-7 min : motivation et parcours.\n" +
                        "7-12 min : DGFiP / DGDDI / service public.\n" +
                        "12-18 min : mises en situation.\n" +
                        "18-20 min : questions de rebond et conclusion."));
        content.addView(card("Grille d'auto-évaluation sur 20",
                "Clarté : 3 pts\nMotivation : 3 pts\nConnaissance des missions : 3 pts\nPosture de service public : 3 pts\nComportement face à une situation difficile : 3 pts\nConcision : 2 pts\nSincérité : 3 pts"));
        content.addView(card("Réflexes DGFiP / DGDDI / service public",
                "DGFiP : impôts, dépenses publiques, gestion publique locale, accueil des usagers, contrôle et recouvrement.\n" +
                        "DGDDI : protection du territoire, contrôle des marchandises, fiscalité douanière, lutte contre les trafics.\n" +
                        "Service public : neutralité, continuité, égalité, discrétion professionnelle, probité, respect de la hiérarchie."));
        List<String> motivation = motivationOralQuestions();
        List<String> missions = missionOralQuestions();
        List<String> situations = situationOralQuestions();
        List<String> complement = new ArrayList<>(oralQuestionItems);
        complement.removeAll(motivation);
        complement.removeAll(missions);
        complement.removeAll(situations);
        addOralBank("Questions de motivation", motivation);
        addOralBank("DGFiP / DGDDI / service public", missions);
        addOralBank("Mises en situation", situations);
        addOralBank("Banque réaliste complémentaire", complement);
        updateOralTimer();
    }

    private void addOralBank(String title, List<String> questions) {
        addSection(title);
        for (String question : questions) {
            content.addView(card("Question", question));
        }
    }

    private List<String> motivationOralQuestions() {
        return Arrays.asList(
                "Pourquoi ce concours et pourquoi maintenant ?",
                "Quelle expérience de votre parcours peut servir dans un accueil administratif ?",
                "Qu’attendez-vous d’un poste de catégorie C au quotidien ?",
                "Quelle qualité devez-vous encore renforcer avant l’oral ?",
                "Comment réagissez-vous lorsque vous ne réussissez pas du premier coup ?",
                "Qu’est-ce qui vous motive dans le contact avec les usagers ?");
    }

    private List<String> missionOralQuestions() {
        return Arrays.asList(
                "Quelles sont les grandes missions de la DGFiP ?",
                "Que savez-vous des missions de la DGDDI ?",
                "Pourquoi la confidentialité est-elle centrale dans ces administrations ?",
                "Comment définiriez-vous la neutralité du service public ?",
                "Que signifie continuité du service public pour un agent administratif ?",
                "Comment un agent de catégorie C contribue-t-il à la qualité du service rendu ?");
    }

    private List<String> situationOralQuestions() {
        return Arrays.asList(
                "Un usager s’énerve à l’accueil car il ne comprend pas un courrier.",
                "Un collègue vous demande de consulter un dossier sans motif professionnel.",
                "Vous constatez une erreur dans un courrier déjà envoyé.",
                "Deux agents vous donnent des consignes contradictoires.",
                "Un proche vous demande une information sur son dossier.",
                "Vous êtes en retard sur une tâche sensible et votre responsable vous sollicite sur une urgence.",
                "Un usager insiste pour obtenir une information confidentielle.",
                "Vous remarquez qu’un document contenant des données personnelles est laissé visible.");
    }

    private final Runnable oralTimerTick = new Runnable() {
        @Override
        public void run() {
            updateOralTimer();
            if (oralPresentationStart > 0L) oralTimerHandler.postDelayed(this, 500L);
        }
    };

    private void startOralTimer() {
        oralPresentationStart = System.currentTimeMillis();
        oralTimerHandler.removeCallbacks(oralTimerTick);
        oralTimerHandler.post(oralTimerTick);
    }

    private void resetOralTimer() {
        oralPresentationStart = 0L;
        oralTimerHandler.removeCallbacks(oralTimerTick);
        updateOralTimer();
    }

    private void stopOralTimer() {
        oralPresentationStart = 0L;
        oralTimerHandler.removeCallbacks(oralTimerTick);
    }

    private void updateOralTimer() {
        if (oralTimerText == null) return;
        long elapsed = oralPresentationStart > 0L ? System.currentTimeMillis() - oralPresentationStart : 0L;
        long remaining = Math.max(0L, 120000L - elapsed);
        String message = formatDuration(elapsed) + "\nTemps restant : " + formatDuration(remaining);
        if (elapsed > 120000L) message += "\nObjectif dépassé : concluez en une phrase.";
        oralTimerText.setText("Chronomètre présentation\n\n" + message);
    }

    private void showWritten() {
        addSection("Sujet d’écrit");
        subjectText = card("Sujet proposé", subjectItems.get(subjectIndex));
        content.addView(subjectText);
        Source pdfSource = writtenPdfSourceForCurrentSubject();
        if (pdfSource != null && (hasText(pdfSource.url) || hasText(pdfSource.localUrl))) {
            boolean localPdf = hasText(pdfSource.localUrl);
            content.addView(card("PDF officiel du sujet",
                    "Année : " + (pdfSource.year.isEmpty() ? writtenSubjectYear(subjectItems.get(subjectIndex)) : pdfSource.year) + "\n" +
                            "Type : " + sourceTypeLabel(pdfSource.type) + "\n" +
                            "Fiabilité : " + sourceReliability(pdfSource.type) + "\n" +
                            (localPdf
                                    ? "Fichier : PDF embarqué dans l’application, ouvert dans le lecteur PDF du téléphone."
                                    : "Fichier : source officielle distante, ouverte dans le navigateur ou le lecteur PDF du téléphone.")));
            addAction(localPdf ? "Ouvrir le PDF embarqué" : "Ouvrir / visualiser le PDF officiel", () -> openPdfSource(pdfSource));
        } else {
            content.addView(card("PDF officiel du sujet", "Aucun PDF direct n’est référencé pour ce sujet. Consultez la page Sources."));
        }
        content.addView(card("Parcours d'entraînement",
                "1. Lire le sujet et identifier le livrable demandé.\n" +
                        "2. Extraire les informations importantes : faits, chiffres, acteurs, risques.\n" +
                        "3. Construire un plan visible.\n" +
                        "4. Rédiger comme un futur agent public.\n" +
                        "5. Auto-évaluer avec la grille sur 20.\n" +
                        "6. Relire : consigne, chiffres, forme, orthographe."));
        content.addView(card("Atelier 3 heures",
                "0-20 min : lire la consigne, entourer le livrable et classer les documents.\n" +
                        "20-45 min : extraire faits, chiffres utiles, acteurs, risques et documents à citer.\n" +
                        "45-65 min : construire un plan court et opérationnel.\n" +
                        "65-165 min : rédiger le livrable attendu.\n" +
                        "165-180 min : relecture ciblée : consigne, chiffres, orthographe, anonymat, politesse."));
        content.addView(card("Ce que le correcteur doit voir",
                "Éviter le hors-sujet.\n" +
                        "Citer les éléments du dossier.\n" +
                        "Faire un plan visible.\n" +
                        "Utiliser les chiffres proprement.\n" +
                        "Rédiger comme un futur agent public."));
        content.addView(card("Grille d'auto-évaluation sur 20",
                "Compréhension de la consigne : 4 pts\n" +
                        "Structure : 3 pts\n" +
                        "Exploitation des documents : 4 pts\n" +
                        "Clarté : 3 pts\n" +
                        "Qualité opérationnelle du livrable : 4 pts\n" +
                        "Orthographe et expression : 2 pts"));
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        Button prev = button("Précédent", false);
        Button next = button("Nouveau sujet", false);
        prev.setOnClickListener(v -> changeSubject(-1));
        next.setOnClickListener(v -> changeSubject(1));
        row.addView(prev, new LinearLayout.LayoutParams(0, dp(48), 1));
        row.addView(next, new LinearLayout.LayoutParams(0, dp(48), 1));
        content.addView(row);

        addSection("Production");
        content.addView(card("Livrables prévus",
                "Synthèse · réponse structurée · fiche · courriel · support de communication."));
        productionInput = new EditText(this);
        productionInput.setMinLines(9);
        productionInput.setGravity(Gravity.TOP | Gravity.START);
        productionInput.setTextColor(INK);
        productionInput.setHint("Rédigez ici votre synthèse, réponse structurée, fiche, courriel ou support de communication...");
        productionInput.setBackground(rounded(Color.WHITE, LINE, 1, 8));
        productionInput.setPadding(dp(14), dp(14), dp(14), dp(14));
        String draftKey = "written_draft_" + Math.abs(subjectItems.get(subjectIndex).hashCode());
        productionInput.setText(getPreferences(MODE_PRIVATE).getString(draftKey, ""));
        productionInput.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {
                getPreferences(MODE_PRIVATE).edit().putString(draftKey, s.toString()).apply();
            }
            @Override public void afterTextChanged(Editable s) {}
        });
        content.addView(productionInput, new LinearLayout.LayoutParams(-1, dp(220)));
        addAction("Squelette synthèse", () -> insertDeliverableTemplate("Synthèse"));
        addAction("Squelette réponse structurée", () -> insertDeliverableTemplate("Réponse structurée"));
        addAction("Squelette fiche", () -> insertDeliverableTemplate("Fiche"));
        addAction("Squelette courriel", () -> insertDeliverableTemplate("Courriel"));
        addAction("Squelette support de communication", () -> insertDeliverableTemplate("Support de communication"));
        addAction("Auto-évaluer ma production", this::gradeProduction);
        gradingResult = text("", 15, INK, false);
        gradingResult.setPadding(0, dp(10), 0, 0);
        content.addView(gradingResult);
    }

    private void changeSubject(int delta) {
        List<String> subjects = subjectItems;
        subjectIndex = (subjectIndex + delta + subjects.size()) % subjects.size();
        content.removeAllViews();
        showWritten();
        scrollTop();
    }

    private void gradeProduction() {
        String text = productionInput.getText().toString().trim();
        String lower = text.toLowerCase(Locale.FRANCE);
        List<String> checks = new ArrayList<>();
        if (text.isEmpty()) checks.add("Rédigez d’abord une production complète.");
        if (!hasAny(lower, "document", "dossier", "fait", "donnée", "chiffre", "pourcentage", "graphique", "tableau")) checks.add("Appuyez les idées sur des faits, chiffres ou documents précis.");
        if (!hasAny(lower, "1.", "2.", "conclusion", "objet", "contexte")) checks.add("Rendez le plan et le type de livrable immédiatement visibles.");
        if (!hasAny(lower, "action", "priorité", "suivi", "délai", "usager", "service")) checks.add("Précisez les actions, acteurs et échéances utiles.");
        String detected = checks.isEmpty() ? "Aucun signal simple détecté : vérifiez maintenant la justesse de chaque information avec le dossier." : String.join("\n", checks);
        gradingResult.setText("Relecture guidée — aucune note automatique\n\n" + detected +
                "\n\nÀ valider personnellement :\n• toutes les parties de la consigne sont traitées ;\n• chaque idée importante repose sur le dossier ;\n• calculs et unités sont vérifiés ;\n• le livrable est adapté ;\n• orthographe, anonymat et présentation sont relus.");
    }

    private void insertPlan() {
        insertDeliverableTemplate("Synthèse");
    }

    private void insertDeliverableTemplate(String kind) {
        String text;
        if ("Réponse structurée".equals(kind)) {
            text = "Introduction : réponse directe à la consigne.\n\n" +
                    "1. Analyse de la situation\n- Faits du dossier : ...\n- Données à retenir : ...\n\n" +
                    "2. Réponse attendue\n- Argument 1 : ...\n- Argument 2 : ...\n\n" +
                    "3. Mise en œuvre\n- Action concrète : ...\n- Contrôle ou suivi : ...\n\nConclusion courte : ...\n";
        } else if ("Fiche".equals(kind)) {
            text = "FICHE\nObjet : ...\nDestinataire : ...\n\n" +
                    "Contexte\n- ...\n\nPoints clés du dossier\n- ...\n\nAnalyse\n- Risques : ...\n- Chiffres utiles : ...\n\n" +
                    "Propositions\n- Action immédiate : ...\n- Action de suivi : ...\n\nVigilances\n- Délai : ...\n- Traçabilité : ...\n";
        } else if ("Courriel".equals(kind)) {
            text = "Objet : ...\n\nMadame, Monsieur,\n\nÀ la suite de ..., voici les éléments utiles.\n\n" +
                    "1. Constat\n...\n\n2. Points d'attention\n...\n\n3. Suite proposée\n...\n\n" +
                    "Je reste disponible pour tout complément.\n\nCordialement,\n";
        } else if ("Support de communication".equals(kind)) {
            text = "Titre du support : ...\n\nMessage principal\n- ...\n\nPublic visé\n- ...\n\n" +
                    "Informations à retenir\n- ...\n- Chiffre clé : ...\n\nConsignes pratiques\n- Étape 1 : ...\n- Étape 2 : ...\n\nContact / suite\n- ...\n";
        } else {
            text = "Titre : Synthèse opérationnelle\n\nIntroduction\n- Objet du dossier : ...\n- Problème à traiter : ...\n\n" +
                    "1. Constats essentiels\n- Élément du dossier : ...\n- Chiffre ou donnée utile : ...\n\n" +
                    "2. Enjeux et risques\n- Pour le service : ...\n- Pour les usagers : ...\n\n" +
                    "3. Pistes d'action\n- Action prioritaire : ...\n- Point de vigilance : ...\n\nConclusion\n- Décision ou suite proposée : ...\n";
        }
        productionInput.setText(text);
        productionInput.setSelection(productionInput.getText().length());
    }

    private String writtenSubjectYear(String subject) {
        for (String year : YEAR_FILTERS) {
            if (!"Toutes".equals(year) && subject != null && subject.contains(year)) return year;
        }
        return "";
    }

    private Source writtenPdfSourceForCurrentSubject() {
        if (subjectItems.isEmpty()) return null;
        String year = writtenSubjectYear(subjectItems.get(subjectIndex));
        if (year.isEmpty()) return null;
        String expectedType = "2026".equals(year) ? "zero-written" : "written";
        for (Source source : sourceItems) {
            if (expectedType.equals(source.type) && year.equals(source.year)) return source;
        }
        String fallbackUrl = null;
        if ("2026".equals(year)) fallbackUrl = "https://rejoindrelesfinancespubliques.economie.gouv.fr/files/files/concours/Sujets_zero/CCC%20-%202026%20-%20sujet%20test%20-%20admissibilit%C3%A9.pdf";
        else if ("2024".equals(year)) fallbackUrl = "https://www.economie.gouv.fr/files/files/directions_services/rejoignez-nous/DGFiP/recrutement-par-concours/categorie-C_brevet/Concours_Commun_C/Annales_et_rapport_de_jury/2025_03_ccc_admissibilite_metropole2024.pdf";
        else if ("2023".equals(year)) fallbackUrl = "https://www.economie.gouv.fr/files/files/directions_services/rejoignez-nous/DGFiP/recrutement-par-concours/categorie-C_brevet/Concours_Commun_C/Annales_et_rapport_de_jury/2024_03__sujet%20admissibilite.pdf";
        else if ("2022".equals(year)) fallbackUrl = "https://www.economie.gouv.fr/files/files/directions_services/rejoignez-nous/DGFiP/recrutement-par-concours/categorie-C_brevet/Concours_Commun_C/Annales_et_rapport_de_jury/2022_ccc_epreuve_admissibilite.pdf";
        else if ("2021".equals(year)) fallbackUrl = "https://www.economie.gouv.fr/files/files/directions_services/rejoignez-nous/DGFiP/recrutement-par-concours/categorie-C_brevet/Concours_Commun_C/Annales_et_rapport_de_jury/2021_ccc_epreuve_admissibilite.pdf";
        else if ("2020".equals(year)) fallbackUrl = "https://www.economie.gouv.fr/files/files/directions_services/rejoignez-nous/DGFiP/recrutement-par-concours/categorie-C_brevet/Concours_Commun_C/Annales_et_rapport_de_jury/2020_ccc_epreuve_admissibilite.pdf";
        if (fallbackUrl == null) return null;
        return new Source("PDF officiel du sujet écrit", fallbackUrl, expectedType, year);
    }

    private void openUrl(String url) {
        startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private void openPdfSource(Source source) {
        if (source == null) return;
        if (hasText(source.localUrl)) {
            try {
                openLocalPdf(source.localUrl);
                return;
            } catch (ActivityNotFoundException e) {
                Toast.makeText(this, "Aucun lecteur PDF disponible sur ce téléphone.", Toast.LENGTH_LONG).show();
                return;
            } catch (Exception e) {
                if (!hasText(source.url)) {
                    Toast.makeText(this, "PDF local indisponible.", Toast.LENGTH_LONG).show();
                    return;
                }
            }
        }
        if (hasText(source.url)) openUrl(source.url);
    }

    private void openLocalPdf(String localUrl) throws Exception {
        String assetPath = localUrl.replaceFirst("^public_sources/", "");
        String fileName = assetPath.substring(assetPath.lastIndexOf('/') + 1);
        File dir = new File(getCacheDir(), "pdfs");
        if (!dir.exists() && !dir.mkdirs()) throw new IllegalStateException("Impossible de préparer le cache PDF");
        File outFile = new File(dir, fileName);
        try (InputStream in = getAssets().open(assetPath);
             FileOutputStream out = new FileOutputStream(outFile)) {
            byte[] buffer = new byte[8192];
            int read;
            while ((read = in.read(buffer)) != -1) out.write(buffer, 0, read);
        }
        Uri uri = FileProvider.getUriForFile(this, getPackageName() + ".fileprovider", outFile);
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setDataAndType(uri, "application/pdf");
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        startActivity(intent);
    }

    private void showSources() {
        addSection("Sources et fiabilité");
        content.addView(card("Base officielle",
                "Les sources officielles servent de référence. Les corrections tierces aident à contrôler certains QCM mais restent moins fiables. Les questions générées ou adaptées sont conservées dans le corpus local et contrôlées par le validateur."));
        String[] families = {"Sources officielles", "Sujets zéro", "Annales", "Rapports de jury", "Corrections tierces", "Questions générées ou adaptées"};
        for (String family : families) {
            boolean printed = false;
            for (Source source : sourceItems) {
                if (!family.equals(sourceFamily(source.type))) continue;
                if (!printed) {
                    addSection(family);
                    printed = true;
                }
                addSourceCard(source);
            }
        }
        addSection("Questions générées ou adaptées");
        content.addView(card("Corpus local",
                "Titre : questions QCM enrichies et adaptées\nAnnée : multi\nType : questions adaptées\nLien : public_sources/corpus.json\nStatut d’intégration : présentes dans le corpus local.\nNiveau de fiabilité : contrôlées par validate-corpus.js."));
    }

    private void addSourceCard(Source source) {
        content.addView(card(source.title,
                "Année : " + (source.year.isEmpty() ? "sans année" : source.year) + "\n" +
                        "Type : " + sourceTypeLabel(source.type) + "\n" +
                        "Lien : " + source.url + "\n" +
                        (source.localUrl.isEmpty() ? "" : "Fichier local : " + source.localUrl + "\n") +
                        "Statut d’intégration : " + sourceIntegrationStatus(source.type, source.year) + "\n" +
                        "Niveau de fiabilité : " + sourceReliability(source.type)));
        if (source.url != null && source.url.startsWith("http")) {
            Button b = button("Ouvrir la source", true);
            b.setOnClickListener(v -> openUrl(source.url));
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(-1, dp(52));
            lp.setMargins(0, 0, 0, dp(10));
            content.addView(b, lp);
        }
    }

    private String sourceFamily(String type) {
        if ("official".equals(type)) return "Sources officielles";
        if ("zero-qcm".equals(type) || "zero-written".equals(type)) return "Sujets zéro";
        if ("qcm".equals(type) || "written".equals(type)) return "Annales";
        if ("jury-report".equals(type)) return "Rapports de jury";
        if ("qcm-correction".equals(type)) return "Corrections tierces";
        return "Questions générées ou adaptées";
    }

    private String sourceTypeLabel(String type) {
        if ("official".equals(type)) return "page officielle";
        if ("zero-qcm".equals(type)) return "sujet zéro QCM";
        if ("zero-written".equals(type)) return "sujet zéro écrit";
        if ("qcm".equals(type)) return "annale QCM";
        if ("written".equals(type)) return "annale écrit";
        if ("jury-report".equals(type)) return "rapport de jury";
        if ("qcm-correction".equals(type)) return "correction tierce";
        return type == null || type.isEmpty() ? "source" : type;
    }

    private String sourceReliability(String type) {
        if ("qcm-correction".equals(type)) return "Tierce à vérifier";
        if ("official".equals(type) || "zero-qcm".equals(type) || "zero-written".equals(type)
                || "qcm".equals(type) || "written".equals(type) || "jury-report".equals(type)) return "Officielle";
        return "Adaptée, vérifiée par le validateur";
    }

    private String sourceIntegrationStatus(String type, String year) {
        if ("zero-qcm".equals(type)) return "Sujet zéro QCM 2026 intégré en questions.";
        if ("zero-written".equals(type)) return "Sujet zéro écrit disponible dans l’entraînement écrit.";
        if ("qcm".equals(type)) {
            int count = qcmCountForYear(year);
            return count > 0 ? count + " question(s) intégrée(s) ou adaptée(s)." : "Source officielle référencée ; corrigé vérifié non intégré.";
        }
        if ("qcm-correction".equals(type)) return "Utilisée comme aide de contrôle, fiabilité inférieure à l’officiel.";
        if ("written".equals(type)) return "Disponible dans les sujets écrits ou le corpus d’annales.";
        if ("jury-report".equals(type)) return "Transformé en règles et alertes de préparation.";
        return "Référence de cadrage.";
    }

    private int qcmCountForYear(String year) {
        int count = 0;
        for (Question q : allQuestions) if (year != null && year.equals(questionYear(q))) count++;
        return count;
    }

    private void showProgress() {
        addSection("Suivi local");
        SharedPreferences prefs = getPreferences(MODE_PRIVATE);
        int last = prefs.getInt("last_score", -1);
        String scoreText = last >= 0 ? last + "% au dernier QCM terminé" : "Aucune série terminée pour l’instant.";
        content.addView(card("Dernier score", scoreText));
        content.addView(card("Pilotage QCM",
                "Domaine fragile : " + weakestDomain() + ".\n" +
                        "Révisions dues : " + dueMistakeCount() + ".\n" +
                        "Carnet d'erreurs : " + mistakeCount() + " question" + (mistakeCount() > 1 ? "s" : "") + ".\n" +
                        "Questions fragiles : " + fragileMistakeCount() + ".\n" +
                        "Erreurs maîtrisées : " + masteredMistakeCount() + ".\n" +
                        domainStatsText()));
        if (dueMistakeCount() > 0) addAction("Réviser ce qui est dû aujourd'hui", this::startDueReview);
        if (mistakeCount() > 0) addAction("Revoir le carnet d'erreurs", this::startMistakeQuiz);
        int done = 0;
        for (int i = 0; i < PROGRESS_TASKS.length; i++) {
            if (prefs.getBoolean("task_" + i, false)) done++;
        }
        content.addView(card("Avancement", done + "/" + PROGRESS_TASKS.length + " jalons cochés\n" + progressBarText(done, PROGRESS_TASKS.length)));

        addSection("Checklist");
        for (int i = 0; i < PROGRESS_TASKS.length; i++) {
            final int index = i;
            CheckBox box = new CheckBox(this);
            box.setText(PROGRESS_TASKS[i]);
            box.setTextColor(INK);
            box.setTextSize(15);
            box.setChecked(prefs.getBoolean("task_" + i, false));
            box.setPadding(dp(8), dp(7), dp(8), dp(7));
            box.setOnCheckedChangeListener((buttonView, isChecked) ->
                    getPreferences(MODE_PRIVATE).edit().putBoolean("task_" + index, isChecked).apply());
            content.addView(box, new LinearLayout.LayoutParams(-1, -2));
        }

        addSection("Historique QCM");
        String history = prefs.getString("score_history", "");
        content.addView(card("Séries terminées", history.isEmpty() ? "Aucune série terminée pour l’instant." : history));
        content.addView(card("Routine hebdomadaire",
                "3 séries QCM courtes : français, calcul, culture.\n1 sujet écrit : plan en 15 minutes, rédaction en 2 h 30, relecture en 15 minutes.\n1 oral blanc : présentation 2 minutes puis 4 mises en situation.\n1 revue jury : relire les alertes et transformer chaque erreur en action."));
        content.addView(card("Priorité si le temps manque",
                "1. Refaire les erreurs QCM.\n2. Apprendre les missions DGFiP/DGDDI en exemples concrets.\n3. S’entraîner aux pourcentages, moyennes, graphiques et tableaux.\n4. Garder une présentation orale sobre, personnelle et chronométrée."));
    }

    private void saveScore(int rawScore, int total, int percent) {
        SharedPreferences prefs = getPreferences(MODE_PRIVATE);
        String stamp = new SimpleDateFormat("dd/MM HH:mm", Locale.FRANCE).format(new Date());
        String entry = stamp + " · " + activeQuizMode + " · " + rawScore + "/" + total + " (" + percent + "%)";
        if (isSimulationMode()) {
            entry += " · temps " + formatDuration(totalQuizTimeMs()) + " · moy. " + formatDuration(averageQuestionTimeMs());
        }
        String previous = prefs.getString("score_history", "");
        String next = entry + (previous.isEmpty() ? "" : "\n" + previous);
        String[] lines = next.split("\n");
        StringBuilder kept = new StringBuilder();
        for (int i = 0; i < lines.length && i < 10; i++) {
            if (i > 0) kept.append("\n");
            kept.append(lines[i]);
        }
        prefs.edit().putInt("last_score", percent).putString("score_history", kept.toString()).apply();
    }

    private String progressBarText(int value, int total) {
        int percent = total == 0 ? 0 : Math.round((value * 100f) / total);
        int filled = Math.round(percent / 10f);
        StringBuilder bar = new StringBuilder();
        for (int i = 0; i < 10; i++) bar.append(i < filled ? "■" : "□");
        return bar + " " + percent + "%";
    }

    private void addSection(String label) {
        TextView t = text(label, 20, BRAND_DARK, true);
        t.setPadding(0, dp(8), 0, dp(8));
        content.addView(t);
    }

    private void addQuestionPrompt(Question q) {
        content.addView(card(q.prompt, ""));
        addQuestionSupport(q);
    }

    private void addQuestionSupport(Question q) {
        if (q.supportRows == null || q.supportRows.length == 0) return;
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setPadding(dp(17), dp(13), dp(17), dp(15));
        box.setBackground(rounded(Color.WHITE, LINE, 1, 8));
        box.setElevation(dp(1));

        TextView label = text("Support", 13, MUTED, true);
        label.setPadding(0, 0, 0, dp(8));
        box.addView(label);

        TextView rows = text(joinLines(q.supportRows), 16, BRAND_DARK, false);
        rows.setTypeface(Typeface.MONOSPACE);
        rows.setGravity(Gravity.CENTER);
        rows.setLineSpacing(6f, 1f);
        box.addView(rows, new LinearLayout.LayoutParams(-1, -2));

        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(-1, -2);
        lp.setMargins(0, 0, 0, dp(12));
        content.addView(box, lp);
    }

    private String correctionText(Question q) {
        if (q.correctionSteps == null || q.correctionSteps.length == 0) return q.explanation;
        return joinLines(q.correctionSteps);
    }

    private String joinLines(String[] values) {
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < values.length; i++) {
            if (i > 0) builder.append("\n");
            builder.append(values[i]);
        }
        return builder.toString();
    }

    private TextView card(String title, String body) {
        TextView t = text(title + (body.isEmpty() ? "" : "\n\n" + body), 15, INK, false);
        t.setLineSpacing(4f, 1.06f);
        t.setPadding(dp(17), dp(15), dp(17), dp(15));
        t.setBackground(rounded(SOFT, LINE, 1, 8));
        t.setElevation(dp(1));
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(-1, -2);
        lp.setMargins(0, 0, 0, dp(12));
        t.setLayoutParams(lp);
        return t;
    }

    private TextView pill(String label) {
        TextView t = text(label, 13, Color.WHITE, true);
        t.setPadding(dp(12), dp(7), dp(12), dp(7));
        t.setBackground(rounded(ACCENT, ACCENT, 0, 30));
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(-2, -2);
        lp.setMargins(0, 0, 0, dp(10));
        t.setLayoutParams(lp);
        return t;
    }

    private void addAction(String label, Runnable action) {
        Button b = button(label, false);
        b.setOnClickListener(v -> action.run());
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(-1, dp(52));
        lp.setMargins(0, dp(4), 0, dp(12));
        content.addView(b, lp);
    }

    private void addPrimaryAction(String label, Runnable action) {
        Button b = button(label, false);
        b.setTextSize(18);
        b.setBackground(rounded(BRAND, BRAND, 1, 8));
        b.setOnClickListener(v -> action.run());
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(-1, dp(62));
        lp.setMargins(0, dp(4), 0, dp(12));
        content.addView(b, lp);
    }

    private void addDisabledAction(String label) {
        Button b = button(label, false);
        b.setEnabled(false);
        b.setAlpha(0.55f);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(-1, dp(52));
        lp.setMargins(0, dp(4), 0, dp(12));
        content.addView(b, lp);
    }

    private void addErrorReasonActions(String id) {
        content.addView(card("Pourquoi ai-je raté ?", ""));
        String[] reasons = {"Je ne savais pas", "J'ai mal lu", "Erreur de calcul", "J'ai répondu trop vite", "J'ai hésité"};
        for (String reason : reasons) {
            Button b = button(reason, true);
            b.setOnClickListener(v -> getPreferences(MODE_PRIVATE).edit().putString("reason_" + id, reason).apply());
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(-1, dp(46));
            lp.setMargins(0, 0, 0, dp(8));
            content.addView(b, lp);
        }
    }

    private Button button(String label, boolean light) {
        Button b = new Button(this);
        b.setText(label);
        b.setAllCaps(false);
        b.setTextColor(light ? BRAND_DARK : Color.WHITE);
        b.setTextSize(light ? 13 : 15);
        b.setSingleLine(false);
        b.setMaxLines(2);
        b.setBackground(rounded(light ? Color.WHITE : ACCENT, light ? LINE : ACCENT, 1, 8));
        b.setPadding(dp(10), 0, dp(10), 0);
        return b;
    }

    private GradientDrawable rounded(int fill, int stroke, int strokeDp, int radiusDp) {
        GradientDrawable drawable = new GradientDrawable();
        drawable.setColor(fill);
        drawable.setCornerRadius(dp(radiusDp));
        if (strokeDp > 0) drawable.setStroke(dp(strokeDp), stroke);
        return drawable;
    }

    private TextView text(String value, int sp, int color, boolean bold) {
        TextView t = new TextView(this);
        t.setText(value);
        t.setTextSize(sp);
        t.setTextColor(color);
        if (bold) t.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        return t;
    }

    private String feedback(int percent) {
        if (percent >= 85) return "Très solide. Continuez avec des séries chronométrées.";
        if (percent >= 65) return "Base correcte. Analysez les thèmes perdus et refaites-les demain.";
        return "Priorité aux fondamentaux : calcul sans calculatrice, vocabulaire, institutions, logique.";
    }

    private int dp(int v) {
        return Math.round(v * getResources().getDisplayMetrics().density);
    }

    private void scrollTop() {
        if (scrollView != null) {
            scrollView.post(() -> scrollView.scrollTo(0, 0));
        }
    }

    interface SelectionHandler {
        void onSelected(int index);
    }

    static class QuizAnswer {
        final Question question;
        final int picked;
        final boolean ok;
        final long timeMs;
        QuizAnswer(Question question, int picked, boolean ok) {
            this(question, picked, ok, 0L);
        }
        QuizAnswer(Question question, int picked, boolean ok, long timeMs) {
            this.question = question;
            this.picked = picked;
            this.ok = ok;
            this.timeMs = timeMs;
        }
    }

    static class Question {
        final String id, category, source, prompt, explanation, domain, verificationLevel, sourceType, difficulty;
        final String[] choices, supportRows, correctionSteps, tags;
        final int answer;
        Question(String category, String source, String prompt, String[] choices, int answer, String explanation) {
            this(null, category, source, prompt, choices, answer, explanation, null, null, null, null, null, null, null);
        }
        Question(String category, String source, String prompt, String[] choices, int answer, String explanation, String[] supportRows, String[] correctionSteps) {
            this(null, category, source, prompt, choices, answer, explanation, supportRows, correctionSteps, null, null, null, null, null);
        }
        Question(String category, String source, String prompt, String[] choices, int answer, String explanation, String[] supportRows, String[] correctionSteps, String domain, String[] tags) {
            this(null, category, source, prompt, choices, answer, explanation, supportRows, correctionSteps, domain, tags, null, null, null);
        }
        Question(String id, String category, String source, String prompt, String[] choices, int answer, String explanation, String[] supportRows, String[] correctionSteps, String domain, String[] tags) {
            this(id, category, source, prompt, choices, answer, explanation, supportRows, correctionSteps, domain, tags, null, null, null);
        }
        Question(String id, String category, String source, String prompt, String[] choices, int answer, String explanation, String[] supportRows, String[] correctionSteps, String domain, String[] tags, String verificationLevel, String sourceType, String difficulty) {
            this.id = id;
            this.category = category;
            this.source = source;
            this.prompt = prompt;
            this.choices = choices;
            this.answer = answer;
            this.explanation = explanation;
            this.supportRows = supportRows;
            this.correctionSteps = correctionSteps;
            this.domain = domain;
            this.tags = tags;
            this.verificationLevel = verificationLevel == null ? "" : verificationLevel;
            this.sourceType = sourceType == null ? "" : sourceType;
            this.difficulty = difficulty == null ? "" : difficulty;
        }
    }

    static class Advice {
        final String title, body;
        Advice(String title, String body) { this.title = title; this.body = body; }
    }

    static class Source {
        final String title, url, type, year, localUrl;
        Source(String title, String url) {
            this(title, url, "", "", "");
        }
        Source(String title, String url, String type, String year) {
            this(title, url, type, year, "");
        }
        Source(String title, String url, String type, String year, String localUrl) {
            this.title = title;
            this.url = url;
            this.type = type == null ? "" : type;
            this.year = year == null ? "" : year;
            this.localUrl = localUrl == null ? "" : localUrl;
        }
    }

    static class Annal {
        final String year, title, qcm, written, jury, training;
        Annal(String year, String title, String qcm, String written, String jury, String training) {
            this.year = year;
            this.title = title;
            this.qcm = qcm;
            this.written = written;
            this.jury = jury;
            this.training = training;
        }
    }

    static class Grade {
        final int score;
        final String comment;
        Grade(int score, String comment) { this.score = score; this.comment = comment; }
    }

    static class Grader {
        static Grade grade(String text) {
            if (text.length() < 120) return new Grade(5, "Production trop courte : le jury attend une réponse structurée et exploitable.\n\nPriorité : annoncer le livrable, organiser en parties et ajouter des actions concrètes.");
            String lower = text.toLowerCase(Locale.FRANCE);
            int comprehension = points(4,
                    text.length() > 700 && hasAny(lower, "consigne", "objectif", "demande", "enjeu", "problème", "livrable"),
                    text.length() > 350);
            int structure = points(3,
                    hasAny(lower, "1.", "2.", "d'abord", "ensuite", "enfin", "partie", "conclusion", "objet", "contexte"),
                    countLines(text) > 6);
            int exploitation = points(4,
                    hasAny(lower, "document", "donnée", "donnee", "chiffre", "pourcentage", "graphique", "tableau", "dossier"),
                    hasAny(lower, "fait", "constat", "acteur", "usager"));
            int clarity = points(3,
                    countSentences(text) > 8 && text.length() > 500,
                    text.length() > 250);
            int operational = points(4,
                    hasAny(lower, "fiche", "courriel", "synthèse", "synthese", "support", "action", "priorité", "priorite", "délai", "delai", "suivi", "usager", "service"),
                    hasAny(lower, "proposition", "mesure", "alerte", "contrôle", "controle"));
            int language = points(2,
                    countSentences(text) > 8 && text.length() > 350 && !text.contains("   "),
                    text.length() > 350);
            int score = Math.min(20, comprehension + structure + exploitation + clarity + operational + language);

            List<String> advice = new ArrayList<>();
            if (text.length() < 700) advice.add("Développer la copie : une réponse trop courte couvre rarement tout le dossier.");
            if (!hasAny(lower, "document", "dossier", "fait", "donnée", "donnee", "chiffre", "pourcentage", "graphique", "tableau")) advice.add("Citer davantage les éléments du dossier, avec au moins un chiffre ou fait précis.");
            if (!hasAny(lower, "1.", "2.", "conclusion", "objet", "contexte")) advice.add("Rendre le plan plus visible.");
            if (!hasAny(lower, "action", "priorité", "priorite", "suivi", "délai", "delai", "usager", "service")) advice.add("Rendre le livrable plus opérationnel.");
            if (!hasAny(lower, "dgfip", "dgddi", "finances publiques", "douane", "service public", "agent public", "administration")) advice.add("Adopter davantage la posture d'un futur agent public.");
            if (advice.isEmpty()) advice.add("Copie structurée, exploitable et relue. Prochaine étape : refaire l’exercice en 3 heures avec relecture finale.");

            String rubric = "Compréhension de la consigne : " + comprehension + "/4\n" +
                    "Structure : " + structure + "/3\n" +
                    "Exploitation des documents : " + exploitation + "/4\n" +
                    "Clarté : " + clarity + "/3\n" +
                    "Qualité opérationnelle du livrable : " + operational + "/4\n" +
                    "Orthographe et expression : " + language + "/2\n\n" +
                    String.join("\n", advice);
            return new Grade(score, rubric);
        }

        private static int points(int max, boolean strong, boolean partial) {
            if (strong) return max;
            if (partial) return Math.max(1, max / 2);
            return 0;
        }

        private static boolean hasAny(String text, String... words) {
            for (String word : words) if (text.contains(word)) return true;
            return false;
        }

        private static int countSentences(String text) {
            int count = 0;
            for (char c : text.toCharArray()) if (c == '.' || c == '!' || c == '?') count++;
            return count;
        }

        private static int countLines(String text) {
            return text.split("\n", -1).length;
        }
    }


}
