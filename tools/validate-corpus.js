const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const corpusPath = path.join(root, "public_sources", "corpus.json");
const corpus = JSON.parse(fs.readFileSync(corpusPath, "utf8"));

const errors = [];
if (!Array.isArray(corpus.questions) || corpus.questions.length === 0) {
  errors.push("questions must be a non-empty array");
}

for (const [index, question] of (corpus.questions || []).entries()) {
  const label = question.id || `question #${index + 1}`;
  if (!question.prompt) errors.push(`${label}: missing prompt`);
  if (!Array.isArray(question.choices) || question.choices.length !== 4) {
    errors.push(`${label}: choices must contain exactly 4 items`);
  }
  if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer > 3) {
    errors.push(`${label}: answer must be an index between 0 and 3`);
  }
  if (!question.explanation) errors.push(`${label}: missing explanation`);
  if (!question.category) errors.push(`${label}: missing category`);
}

for (const key of ["annales", "writtenSubjects", "juryRules", "oralQuestions", "sources"]) {
  if (!Array.isArray(corpus[key]) || corpus[key].length === 0) {
    errors.push(`${key} must be a non-empty array`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`corpus-ok: ${corpus.questions.length} questions, ${corpus.sources.length} sources`);
