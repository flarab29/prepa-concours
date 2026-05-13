package fr.concoursdgfip.prep;

import android.content.Context;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

final class CorpusRepository {
    private CorpusRepository() {
    }

    static Corpus load(Context context) throws Exception {
        String raw = readAsset(context, "corpus.json");
        JSONObject root = new JSONObject(raw);
        Corpus corpus = new Corpus();
        corpus.officialQcmTotal = root.optInt("officialQcmTotal", 320);
        corpus.questions = questions(root.optJSONArray("questions"));
        corpus.annales = annales(root.optJSONArray("annales"));
        corpus.subjects = writtenSubjects(root.optJSONArray("writtenSubjects"));
        corpus.advices = advices(root.optJSONArray("juryRules"));
        corpus.oralQuestions = strings(root.optJSONArray("oralQuestions"));
        corpus.sources = sources(root.optJSONArray("sources"));
        if (corpus.questions.isEmpty()) throw new IllegalStateException("corpus.json ne contient aucune question");
        return corpus;
    }

    private static String readAsset(Context context, String name) throws Exception {
        try (InputStream in = context.getAssets().open(name);
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[8192];
            int read;
            while ((read = in.read(buffer)) != -1) out.write(buffer, 0, read);
            return out.toString(StandardCharsets.UTF_8.name());
        }
    }

    private static List<MainActivity.Question> questions(JSONArray array) {
        List<MainActivity.Question> result = new ArrayList<>();
        if (array == null) return result;
        for (int i = 0; i < array.length(); i++) {
            JSONObject item = array.optJSONObject(i);
            if (item == null) continue;
            String source = item.optString("source", "QCM " + item.optString("year"));
            result.add(new MainActivity.Question(
                    item.optString("id", ""),
                    item.optString("category"),
                    source,
                    item.optString("prompt"),
                    stringArray(item.optJSONArray("choices")),
                    item.optInt("answer"),
                    item.optString("explanation"),
                    stringArray(item.optJSONArray("supportRows")),
                    stringArray(item.optJSONArray("correctionSteps")),
                    item.optString("domain", ""),
                    stringArray(item.optJSONArray("tags")),
                    item.optString("verificationLevel", ""),
                    item.optString("sourceType", ""),
                    item.optString("difficulty", "")
            ));
        }
        return result;
    }

    private static List<MainActivity.Annal> annales(JSONArray array) {
        List<MainActivity.Annal> result = new ArrayList<>();
        if (array == null) return result;
        for (int i = 0; i < array.length(); i++) {
            JSONObject item = array.optJSONObject(i);
            if (item == null) continue;
            String training = item.optString("training", item.optJSONArray("skills") == null ? "" : join(item.optJSONArray("skills")));
            result.add(new MainActivity.Annal(
                    item.optString("year"),
                    item.optString("title"),
                    item.optString("qcm"),
                    item.optString("ecrit", item.optString("written")),
                    item.optString("jury"),
                    training
            ));
        }
        return result;
    }

    private static List<String> writtenSubjects(JSONArray array) {
        List<String> result = new ArrayList<>();
        if (array == null) return result;
        for (int i = 0; i < array.length(); i++) {
            JSONObject item = array.optJSONObject(i);
            if (item == null) {
                result.add(array.optString(i));
                continue;
            }
            String expected = item.optJSONArray("expected") == null ? "" : "\n\nAttendus : " + join(item.optJSONArray("expected"));
            result.add(item.optString("source") + " - " + item.optString("title") + "\n\n" + item.optString("prompt") + expected);
        }
        return result;
    }

    private static List<MainActivity.Advice> advices(JSONArray array) {
        List<MainActivity.Advice> result = new ArrayList<>();
        if (array == null) return result;
        for (int i = 0; i < array.length(); i++) {
            JSONObject item = array.optJSONObject(i);
            if (item == null) continue;
            result.add(new MainActivity.Advice(item.optString("title"), item.optString("body")));
        }
        return result;
    }

    private static List<MainActivity.Source> sources(JSONArray array) {
        List<MainActivity.Source> result = new ArrayList<>();
        if (array == null) return result;
        for (int i = 0; i < array.length(); i++) {
            JSONObject item = array.optJSONObject(i);
            if (item == null) continue;
            result.add(new MainActivity.Source(
                    item.optString("title"),
                    item.optString("url"),
                    item.optString("type"),
                    item.has("year") ? item.optString("year") : ""
            ));
        }
        return result;
    }

    private static List<String> strings(JSONArray array) {
        List<String> result = new ArrayList<>();
        if (array == null) return result;
        for (int i = 0; i < array.length(); i++) result.add(array.optString(i));
        return result;
    }

    private static String[] stringArray(JSONArray array) {
        if (array == null) return new String[0];
        String[] values = new String[array.length()];
        for (int i = 0; i < array.length(); i++) values[i] = array.optString(i);
        return values;
    }

    private static String join(JSONArray array) {
        List<String> values = strings(array);
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < values.size(); i++) {
            if (i > 0) builder.append(", ");
            builder.append(values.get(i));
        }
        return builder.toString();
    }

    static final class Corpus {
        int officialQcmTotal = 320;
        List<MainActivity.Question> questions = new ArrayList<>();
        List<MainActivity.Advice> advices = new ArrayList<>();
        List<MainActivity.Annal> annales = new ArrayList<>();
        List<String> subjects = new ArrayList<>();
        List<String> oralQuestions = new ArrayList<>();
        List<MainActivity.Source> sources = new ArrayList<>();
    }
}
