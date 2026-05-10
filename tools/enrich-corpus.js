const fs = require("fs");
const path = require("path");

const corpusPath = path.resolve(__dirname, "..", "public_sources", "corpus.json");
const corpus = JSON.parse(fs.readFileSync(corpusPath, "utf8"));

function normalize(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function includesAny(text, values) {
  return values.some(value => text.includes(value));
}

function hasWord(text, values) {
  const words = new Set(String(text).split(/[^a-z0-9]+/).filter(Boolean));
  return values.some(value => words.has(value));
}

function domainOf(category) {
  const c = normalize(category);
  if (includesAny(c, ["calcul", "mathem", "equation", "fraction", "pourcentage", "statistique", "probabilite", "geometrie", "volume", "vitesse", "arithmetique", "proportionnalite", "moyenne", "radicaux", "nombres", "raisonnement", "suite", "logique", "codage", "anagrammes"])) return "Maths et logique";
  if (includesAny(c, ["orthographe", "accord", "grammaire", "conjugaison", "vocabulaire", "expression", "genre", "figure"])) return "Francais";
  if (includesAny(c, ["histoire", "geographie", "geopolitique"])) return "Histoire-geographie";
  if (includesAny(c, ["enseignement", "civique", "institution", "union europeenne", "administration", "administratif"])) return "EMC et institutions";
  if (includesAny(c, ["numerique"])) return "Numerique";
  if (includesAny(c, ["mef", "dgfip", "dgddi", "douane", "douanes", "missions"])) return "MEF / DGFiP / DGDDI";
  if (includesAny(c, ["actualite"])) return "Actualite";
  return "Culture generale";
}

function tagsFor(question, domain) {
  const category = normalize(question.category);
  const text = normalize(`${question.prompt} ${question.explanation}`);
  const tags = new Set([domain, question.category]);

  if (question.year) tags.add(String(question.year));
  if (text.includes("pourcentage") || text.includes("%")) tags.add("pourcentages");
  if (text.includes("graphique") || text.includes("tableau")) tags.add("donnees");
  if (includesAny(text, ["dgfip", "finances publiques", "impot", "tva", "fiscal"])) tags.add("DGFiP");
  if (includesAny(text, ["dgddi", "douane", "douanier"])) tags.add("DGDDI");
  if (includesAny(text, ["usager", "service public", "administration"])) tags.add("service public");
  if (includesAny(text, ["neutralite", "probite", "discretion", "hierarchie"])) tags.add("deontologie");
  if (includesAny(category, ["orthographe", "accord", "conjugaison", "grammaire"])) tags.add("langue");
  if (includesAny(category, ["suite", "raisonnement", "logique", "codage"])) tags.add("logique");
  if (includesAny(category, ["histoire", "geographie", "actualite", "culture"])) tags.add("culture generale");

  return Array.from(tags);
}

const skillByDomain = {
  "Maths et logique": "maths_logique",
  "Francais": "francais",
  "Histoire-geographie": "histoire_geographie",
  "EMC et institutions": "emc_institutions",
  "Numerique": "numerique",
  "MEF / DGFiP / DGDDI": "mef_dgfip_dgddi",
  "Actualite": "actualite",
  "Culture generale": "culture_generale",
};

const subskillByCategory = {
  "Accords": "accords",
  "Administration": "administration",
  "Administratif": "administration",
  "Actualite": "actualites",
  "Actualites": "actualites",
  "Anagrammes": "raisonnement_verbal",
  "Arithmetique": "arithmetique",
  "Art": "arts",
  "Bande dessinee": "arts",
  "Calcul": "calcul",
  "Calcul litteral": "calcul_litteral",
  "Cinema": "arts",
  "Codage": "codage",
  "Conjugaison": "conjugaison",
  "Culture": "culture_generale",
  "Douanes": "missions_dgddi",
  "Enseignement moral et civique": "valeurs_republique",
  "Equations": "equations",
  "Espace": "sciences_et_espace",
  "Expression": "expression",
  "Expression latine": "vocabulaire",
  "Figure de style": "figures_de_style",
  "Fractions": "fractions",
  "Genre": "genre",
  "Geographie": "geographie",
  "Geometrie": "geometrie",
  "Geopolitique": "relations_internationales",
  "Grammaire": "grammaire",
  "Histoire": "histoire",
  "Histoire des idees": "histoire_des_idees",
  "Institutions": "institutions",
  "Litterature": "litterature",
  "Logique": "logique",
  "Maths": "calcul",
  "Mathematiques": "calcul",
  "Missions MEF": "missions_mef_dgfip_dgddi",
  "Moyenne": "moyennes",
  "Musique": "arts",
  "Nombres": "nombres",
  "Numerique": "environnement_numerique",
  "Orthographe": "orthographe",
  "Pourcentages": "pourcentages",
  "Probabilites": "probabilites",
  "Proportionnalite": "proportionnalite",
  "Radicaux": "radicaux",
  "Raisonnement": "raisonnement_logique",
  "Sport": "sport",
  "Statistiques": "statistiques",
  "Suite alphabetique": "suites",
  "Suite logique": "suites",
  "Union europeenne": "union_europeenne",
  "Vitesse": "vitesse",
  "Vocabulaire": "vocabulaire",
  "Vocabulaire administratif": "vocabulaire_administratif",
  "Volumes": "volumes",
};
const normalizedSubskillByCategory = Object.fromEntries(
  Object.entries(subskillByCategory).map(([key, value]) => [normalize(key), value])
);

function sourceTypeOf(question) {
  if (question.year === 2026) return "official_zero_2026";
  return `official_annale_qcm_${question.year}`;
}

function verificationLevelOf(question) {
  if (question.year === 2026) return "official_correction";
  if (question.year >= 2020 && question.year <= 2023) return "public_correction_checked";
  return "manual_verified";
}

function skillOf(domain) {
  return skillByDomain[domain] || "culture_generale";
}

function subskillOf(question, domain) {
  const category = normalize(question.category);
  const text = normalize(`${question.prompt} ${question.explanation}`);
  if (hasWord(text, ["traite", "traites", "guerre", "guerres"])) return "traites_et_guerres";
  if (text.includes("napoleon") || text.includes("code civil")) return "etat_et_institutions";
  if (text.includes("revolution industrielle")) return "revolutions_et_modernisation";
  if (text.includes("empire romain")) return "antiquite";
  if (text.includes("president") || text.includes("constitution")) return "institutions";
  if (text.includes("dgfip") || text.includes("finances publiques") || text.includes("impot")) return "missions_dgfip";
  if (text.includes("dgddi") || text.includes("douane")) return "missions_dgddi";
  if (text.includes("pourcentage") || text.includes("%")) return "pourcentages";
  if (text.includes("moyenne")) return "moyennes";
  if (text.includes("tableau") || text.includes("graphique")) return "lecture_de_donnees";

  const mapped = normalizedSubskillByCategory[category];
  if (mapped) return mapped;
  if (domain === "Francais") return "langue_francaise";
  if (domain === "Maths et logique") return "raisonnement_logique";
  if (domain === "Histoire-geographie") return category.includes("geographie") ? "geographie" : "histoire";
  return skillOf(domain);
}

function difficultyOf(question, subskill) {
  const category = normalize(question.category);
  const text = normalize(`${question.prompt} ${question.explanation}`);
  const hasWork = (question.supportRows || []).length > 0 || (question.correctionSteps || []).length > 0;
  if (hasWork || text.length > 260) return "hard";
  if (includesAny(category, ["raisonnement", "suite", "logique", "codage", "equation", "radicaux", "probabilite"])) return "hard";
  if (includesAny(subskill, ["calcul", "pourcentages", "fractions", "geometrie", "volumes", "vitesse", "statistiques", "moyennes", "proportionnalite", "lecture_de_donnees"])) return "medium";
  if (includesAny(category, ["grammaire", "conjugaison", "accords", "institutions", "union europeenne", "administration", "missions"])) return "medium";
  return "easy";
}

function estimatedTimeSecondsOf(question, difficulty) {
  if (difficulty === "hard") return 135;
  if (difficulty === "medium") return 105;
  if (question.domain === "Francais") return 75;
  return 90;
}

corpus.schemaVersion = 4;
corpus.questions = corpus.questions.map(question => {
  const domain = question.domain || domainOf(question.category);
  const skill = skillOf(domain);
  const subskill = subskillOf(question, domain);
  const difficulty = difficultyOf(question, subskill);
  return {
    ...question,
    verificationLevel: verificationLevelOf(question),
    sourceType: sourceTypeOf(question),
    skill,
    subskill,
    difficulty,
    estimatedTimeSeconds: estimatedTimeSecondsOf({ ...question, domain }, difficulty),
    domain,
    tags: Array.isArray(question.tags) && question.tags.length ? question.tags : tagsFor(question, domain),
  };
});

fs.writeFileSync(corpusPath, `${JSON.stringify(corpus, null, 2)}\n`, "utf8");
console.log(`enriched ${corpus.questions.length} questions with domain/tags`);
