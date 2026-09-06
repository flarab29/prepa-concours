const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const corpusPath = path.join(root, "public_sources", "corpus.json");

const allowedVerificationLevels = new Set([
  "official_correction",
  "manual_verified",
  "public_correction_checked",
  "needs_review",
]);
const allowedSourceTypes = new Set([
  "official_zero_2026",
  "official_annale_qcm_2024",
  "official_annale_qcm_2025",
  "official_annale_qcm_2023",
  "official_annale_qcm_2022",
  "official_annale_qcm_2021",
  "official_annale_qcm_2020",
]);
const allowedDifficulties = new Set(["easy", "medium", "hard"]);

const errors = [];
const warnings = [];

function readCorpus() {
  let raw;
  try {
    raw = fs.readFileSync(corpusPath, "utf8");
  } catch (error) {
    errors.push(`cannot read ${corpusPath}: ${error.message}`);
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    errors.push(`invalid JSON in ${corpusPath}: ${error.message}`);
    return null;
  }
}

function isBlank(value) {
  return typeof value !== "string" || value.trim().length === 0;
}

function normalizePrompt(value) {
  return String(value).trim().replace(/\s+/g, " ");
}

function labelFor(question, index) {
  if (question && typeof question === "object" && !isBlank(question.id)) return question.id;
  return `question #${index + 1}`;
}

function increment(counter, value) {
  const key = isBlank(value) ? "(missing)" : String(value);
  counter.set(key, (counter.get(key) || 0) + 1);
}

function sortedEntries(counter) {
  return Array.from(counter.entries()).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]);
  });
}

function printCounter(title, counter) {
  console.log(`${title}:`);
  if (counter.size === 0) {
    console.log("  (none)");
    return;
  }
  for (const [key, value] of sortedEntries(counter)) {
    console.log(`  ${key}: ${value}`);
  }
}

function validateQuestion(question, index, seenIds, seenPrompts, counters) {
  const label = labelFor(question, index);
  if (!question || typeof question !== "object" || Array.isArray(question)) {
    errors.push(`${label}: question must be an object`);
    return;
  }

  if (isBlank(question.id)) {
    errors.push(`${label}: missing id`);
  } else if (seenIds.has(question.id)) {
    errors.push(`${label}: duplicate id "${question.id}"`);
  } else {
    seenIds.add(question.id);
  }

  if (!Number.isInteger(question.year)) {
    errors.push(`${label}: year must be an integer`);
  }
  if (isBlank(question.category)) {
    errors.push(`${label}: missing category`);
  }
  if (isBlank(question.prompt)) {
    errors.push(`${label}: missing prompt`);
  } else {
    const normalizedPrompt = normalizePrompt(question.prompt);
    if (seenPrompts.has(normalizedPrompt)) {
      const previous = seenPrompts.get(normalizedPrompt);
      if (previous.year === question.year) {
        errors.push(`${label}: duplicate prompt also used by ${previous.label} in the same year`);
      } else {
        warnings.push(`${label}: official prompt repeated from ${previous.label} (${previous.year} → ${question.year})`);
      }
    } else {
      seenPrompts.set(normalizedPrompt, { label, year: question.year });
    }
  }
  if (!Array.isArray(question.choices) || question.choices.length !== 4) {
    errors.push(`${label}: choices must contain exactly 4 items`);
  }
  if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer > 3) {
    errors.push(`${label}: answer must be an integer between 0 and 3`);
  }
  if (isBlank(question.explanation)) {
    errors.push(`${label}: missing explanation`);
  }

  increment(counters.verificationLevel, question.verificationLevel);
  if (isBlank(question.verificationLevel) || !allowedVerificationLevels.has(question.verificationLevel)) {
    errors.push(`${label}: verificationLevel must be one of ${Array.from(allowedVerificationLevels).join(", ")}`);
  }
  if (question.verificationLevel === "needs_review") {
    warnings.push(`${label}: needs_review`);
  }

  increment(counters.sourceType, question.sourceType);
  if (isBlank(question.sourceType) || !allowedSourceTypes.has(question.sourceType)) {
    errors.push(`${label}: sourceType must be one of ${Array.from(allowedSourceTypes).join(", ")}`);
  }

  increment(counters.difficulty, question.difficulty);
  if (isBlank(question.difficulty) || !allowedDifficulties.has(question.difficulty)) {
    errors.push(`${label}: difficulty must be one of ${Array.from(allowedDifficulties).join(", ")}`);
  }

  increment(counters.skill, question.skill);
  if (isBlank(question.skill)) {
    errors.push(`${label}: missing skill`);
  }
  if (isBlank(question.subskill)) {
    errors.push(`${label}: missing subskill`);
  }

  if (typeof question.estimatedTimeSeconds !== "number" || !Number.isFinite(question.estimatedTimeSeconds)) {
    errors.push(`${label}: estimatedTimeSeconds must be a number`);
  } else if (question.estimatedTimeSeconds <= 0 || question.estimatedTimeSeconds > 600) {
    errors.push(`${label}: estimatedTimeSeconds must be positive and at most 600`);
  }
}

const corpus = readCorpus();
const counters = {
  verificationLevel: new Map(),
  sourceType: new Map(),
  difficulty: new Map(),
  skill: new Map(),
};

let questions = [];
if (corpus && (typeof corpus !== "object" || Array.isArray(corpus))) {
  errors.push("root JSON value must be an object");
} else if (corpus) {
  if (!Array.isArray(corpus.questions)) {
    errors.push("questions must exist and be an array");
  } else {
    questions = corpus.questions;
  }
}

const seenIds = new Set();
const seenPrompts = new Map();
for (const [index, question] of questions.entries()) {
  validateQuestion(question, index, seenIds, seenPrompts, counters);
}

console.log("Corpus validation report");
console.log(`Total questions: ${questions.length}`);
printCounter("By verificationLevel", counters.verificationLevel);
printCounter("By sourceType", counters.sourceType);
printCounter("By difficulty", counters.difficulty);
printCounter("By skill", counters.skill);
console.log(`Questions to review: ${warnings.filter(warning => warning.endsWith(": needs_review")).length}`);

console.log("Blocking errors:");
if (errors.length === 0) {
  console.log("  none");
} else {
  for (const error of errors) console.log(`  - ${error}`);
}

console.log("Warnings:");
if (warnings.length === 0) {
  console.log("  none");
} else {
  for (const warning of warnings) console.log(`  - ${warning}`);
}

if (errors.length > 0) {
  process.exit(1);
}
