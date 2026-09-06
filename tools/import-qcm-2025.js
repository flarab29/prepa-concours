const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const corpusPath = path.join(root, "public_sources", "corpus.json");
const corpus = JSON.parse(fs.readFileSync(corpusPath, "utf8"));

const questions = [];
function add(number, category, domain, skill, subskill, difficulty, estimatedTimeSeconds, prompt, choices, answer, explanation, supportRows = [], correctionSteps = []) {
  questions.push({
    id: `qcm-2025-${String(number).padStart(3, "0")}`,
    year: 2025,
    source: "QCM 2025",
    category,
    prompt,
    choices,
    answer,
    explanation,
    supportRows,
    correctionSteps,
    domain,
    tags: [domain, category, "2025", skill],
    verificationLevel: "public_correction_checked",
    sourceType: "official_annale_qcm_2025",
    skill,
    subskill,
    difficulty,
    estimatedTimeSeconds
  });
}

add(1, "Orthographe", "Francais", "francais", "orthographe_lexicale", "easy", 45,
  "Quelle est la bonne orthographe ?", ["Momentanement", "Momentanément", "Momentannément", "Mommentanément"], 1,
  "L’adverbe « momentanément » prend un accent aigu sur le premier e et conserve un seul n après le a.");
add(2, "Conjugaison", "Francais", "francais", "present_indicatif", "easy", 45,
  "Choisissez la bonne proposition pour compléter : « Je vous……de bien prendre soin du colis ».", ["pri", "prie", "pris", "prit"], 1,
  "Le verbe « prier » au présent de l’indicatif, à la première personne du singulier, s’écrit « je prie ».");
add(3, "Orthographe", "Francais", "francais", "accord_quel_que", "medium", 60,
  "Quelle phrase est correctement orthographiée ?", ["Quels que soient les ingrédients ou la recette, j’aime cuisiner.", "Quel que soit les ingrédients ou la recette, j’aime cuisiner.", "Quelles que soient les ingrédients ou la recette, j’aime cuisiner.", "Quelques soient les ingrédients ou la recette, j’aime cuisiner."], 0,
  "Devant le verbe « soient », « quel que » s’écrit en deux mots et s’accorde avec le sujet pluriel masculin « les ingrédients » : « quels que soient ».");
add(4, "Orthographe grammaticale", "Francais", "francais", "homophones_grammaticaux", "hard", 90,
  "Si/S’il est vrai qu’elle/quel le séduit, Titeuf sait qu’il doit s’attendre à des refus de la/l’a part de Nadia. Pourtant, il la/l’a serrée dans ses bras : elle a compris… Ou alors, il ni/n’y comprend rien ! Quelle proposition orthographie correctement le texte ?", ["S’ – quel – l’a – la – n’y", "S’ – qu’elle – la – l’a – n’y", "Si – qu’elle – l’a – la – ni", "Si – quel – la – l’a – n’y"], 1,
  "La phrase correcte est : « S’il est vrai qu’elle le séduit… de la part… il l’a serrée… il n’y comprend rien ».");
add(5, "Accords", "Francais", "francais", "adjectifs_de_couleur", "medium", 60,
  "Quelle est la proposition correcte ?", ["Je me suis acheté des boucles d’oreilles rose clair", "Je me suis acheté des boucles d’oreilles rose clairs", "Je me suis acheté des boucles d’oreilles rose claire", "Je me suis acheté des boucles d’oreilles roses claires"], 0,
  "Un adjectif de couleur composé de deux mots, comme « rose clair », reste invariable.");
add(6, "Vocabulaire", "Francais", "francais", "sens_des_mots", "easy", 45,
  "Que signifie le mot « réfuter » ?", ["Adhérer", "Admettre", "Argumenter contre", "Sanctionner"], 2,
  "Réfuter consiste à combattre une affirmation par des arguments et à montrer qu’elle est fausse.");
add(7, "Vocabulaire", "Francais", "francais", "sens_des_mots", "easy", 45,
  "Complétez la phrase : « Une personne autodidacte… »", ["fait plus jeune que son âge", "n’aime pas voyager", "ne vote pas lors des élections", "s’est instruite par elle-même"], 3,
  "Une personne autodidacte acquiert des connaissances par elle-même, sans enseignement institutionnel direct.");
add(8, "Figures de style", "Francais", "francais", "pleonasme", "easy", 45,
  "Un seul pléonasme est proposé. Lequel ?", ["Eurêka !", "Kayak", "Monter en haut", "Ne jamais dire jamais"], 2,
  "« Monter » contient déjà l’idée d’un déplacement vers le haut : « monter en haut » est un pléonasme.");
add(9, "Vocabulaire", "Francais", "francais", "synonymes", "easy", 45,
  "Que sont les noms « récit » et « narration » ?", ["Des antonymes", "Des homonymes", "Des paronymes", "Des synonymes"], 3,
  "Dans ce contexte, « récit » et « narration » désignent tous deux l’action ou le résultat de raconter.");
add(10, "Vocabulaire", "Francais", "francais", "champ_lexical", "easy", 45,
  "Un champ lexical est un ensemble de mots :", ["de même classe grammaticale", "de même famille", "de même nature", "de même thème"], 3,
  "Un champ lexical réunit des mots de natures et de familles différentes qui se rapportent à un même thème.");
add(11, "Figures de style", "Francais", "francais", "periphrase", "medium", 60,
  "La phrase « Je rêve de visiter l’Empire du Soleil-Levant » contient une :", ["allégorie", "comparaison", "métaphore", "périphrase"], 3,
  "« L’Empire du Soleil-Levant » désigne le Japon au moyen d’une expression descriptive : c’est une périphrase.");
add(12, "Expressions", "Francais", "francais", "expressions_idiomatiques", "easy", 45,
  "Que signifie l’expression « bouche cousue » ?", ["Dévoiler un secret", "Fermer la bouche", "Garder un secret", "Ouvrir la bouche"], 2,
  "L’expression « bouche cousue » signifie que l’on promet de ne rien révéler.");
add(13, "Vocabulaire", "Francais", "francais", "neologismes", "easy", 45,
  "Que signifie le verbe « ghoster » ?", ["Exercer la profession de parapsychologue", "Rompre soudainement tout contact avec quelqu’un", "Se déguiser en fantôme", "Visiter un château écossais"], 1,
  "« Ghoster » signifie cesser brusquement de répondre et rompre tout contact sans explication.");
add(14, "Vocabulaire", "Francais", "francais", "sens_des_mots", "medium", 45,
  "Que signifie le verbe « se rembrunir » ?", ["Devenir soucieux", "Retrouver la santé", "Rougir", "Se méfier"], 0,
  "Se rembrunir signifie prendre un air sombre, soucieux ou chagrin.");
add(15, "Vocabulaire", "Francais", "francais", "paronymes", "medium", 60,
  "Dans quelle phrase peut-on employer le mot « collusion » ?", ["Ils sont entrés en… à dix heures pétantes.", "La SNCF n’explique toujours pas la… entre ces deux trains.", "On aurait certainement pu éviter cette série de…", "On ne peut que condamner cette… entre le juge et l’un des prévenus."], 3,
  "Une collusion est une entente secrète au préjudice d’un tiers. Une collision désigne un choc.");
add(16, "Conjugaison", "Francais", "francais", "temps_et_modes", "easy", 45,
  "Quels sont le temps et le mode de « fera » dans : « Selon la météo, il fera beau demain » ?", ["Futur de l’indicatif", "Futur antérieur de l’indicatif", "Imparfait de l’indicatif", "Plus-que-parfait de l’indicatif"], 0,
  "« Fera » est la troisième personne du singulier du verbe « faire » au futur simple de l’indicatif.");

add(17, "Europe", "Culture generale", "culture_generale", "union_europeenne", "easy", 45,
  "Qu’est-ce que l’espace Schengen ?", ["Un espace avec des contrôles à chaque frontière intérieure", "Un espace de libre circulation des personnes", "Un programme spatial européen", "Un système bancaire sécurisé"], 1,
  "L’espace Schengen organise la libre circulation des personnes et la suppression des contrôles systématiques aux frontières intérieures entre ses États membres.");
add(18, "Institutions européennes", "EMC et institutions", "emc_institutions", "institutions_europeennes", "easy", 45,
  "Qui est devenue la première femme présidente de la Banque centrale européenne en 2019 ?", ["Christine Lagarde", "Angela Merkel", "Ursula von der Leyen", "Louise Weiss"], 0,
  "Christine Lagarde est devenue présidente de la Banque centrale européenne le 1er novembre 2019.");
add(19, "EMC", "EMC et institutions", "emc_institutions", "valeurs_civiques", "easy", 45,
  "En quoi consiste la tolérance ?", ["Rejeter les autres pour leurs différences", "Tout accepter", "Accepter l’autre avec ses différences et admettre qu’il reste notre égal", "Se faire respecter par les autres"], 2,
  "La tolérance suppose le respect d’autrui et de ses différences dans le cadre des droits et des règles communes ; elle ne signifie pas tout accepter.");
add(20, "Histoire économique", "Histoire-geographie", "histoire_geographie", "histoire_contemporaine", "easy", 45,
  "Comment appelle-t-on la période de croissance économique connue par la France entre 1947 et 1973 ?", ["Les 20 piteuses", "Les 25 savoureuses", "Les 30 glorieuses", "Les sixties"], 2,
  "L’expression « Trente Glorieuses », popularisée par Jean Fourastié, désigne la forte croissance de l’après-guerre jusqu’au choc pétrolier de 1973.");
add(21, "Relations internationales", "Culture generale", "culture_generale", "organisations_internationales", "easy", 45,
  "Que signifie l’acronyme OTAN ?", ["Organisme de défense des nations armées", "Organisation des tireurs anglais et du Nord de l’Amérique", "Organisation du traité de l’Atlantique Nord", "Organisation transverse des armées nationales"], 2,
  "OTAN signifie « Organisation du traité de l’Atlantique Nord ».");
add(22, "Institutions françaises", "EMC et institutions", "emc_institutions", "constitution", "easy", 45,
  "Quel pays a inscrit dans sa Constitution la liberté garantie de recourir à l’avortement en 2024 ?", ["L’Allemagne", "Les États-Unis", "La France", "La Pologne"], 2,
  "Le Parlement français réuni en Congrès a approuvé cette révision constitutionnelle le 4 mars 2024.");
add(23, "Culture numérique", "Numerique", "numerique", "industrie_du_jeu_video", "easy", 45,
  "Qui développe la série de jeux vidéo « Assassin’s Creed » ?", ["Nintendo", "RobTop Games", "Supercell", "Ubisoft"], 3,
  "La série Assassin’s Creed est développée et éditée par Ubisoft.");
add(24, "Culture populaire", "Culture generale", "culture_generale", "musique", "easy", 30,
  "Comment appelle-t-on les fans de Taylor Swift ?", ["Les Taylors", "Les Swifties", "Les Swinnies", "Les Tally’s"], 1,
  "Les admirateurs de Taylor Swift sont couramment appelés les « Swifties ».");
add(25, "Cinéma", "Culture generale", "culture_generale", "cinema", "easy", 30,
  "Avec quel acteur Lady Gaga partage-t-elle l’affiche du film « A Star Is Born » ?", ["Christian Bale", "Bradley Cooper", "Patrick Dempsey", "James Franco"], 1,
  "Lady Gaga partage l’affiche du film de 2018 avec Bradley Cooper, qui en est aussi le réalisateur.");
add(26, "Culture populaire", "Culture generale", "culture_generale", "manga", "easy", 30,
  "Dans le manga One Piece, quelle faiblesse Luffy partage-t-il avec les détenteurs d’un fruit du démon ?", ["La nourriture", "Il ne sait pas nager", "La perte de son chapeau de paille", "La sieste"], 1,
  "Les détenteurs d’un fruit du démon perdent leur capacité à nager.");
add(27, "Musique", "Culture generale", "culture_generale", "recompenses_culturelles", "easy", 30,
  "Quelle distinction récompense des artistes du domaine de la musique aux États-Unis ?", ["Emmy Awards", "Golden Globe Awards", "Grammy Awards", "NRJ Music Awards"], 2,
  "Les Grammy Awards sont les récompenses américaines consacrées à l’industrie musicale.");
add(28, "Géographie", "Histoire-geographie", "histoire_geographie", "geographie_evenementielle", "easy", 45,
  "Où se dérouleront les Jeux olympiques d’hiver de 2030 ?", ["Aux États-Unis", "En France", "En Suède", "En Suisse"], 1,
  "Les Jeux olympiques d’hiver 2030 ont été attribués aux Alpes françaises.");
add(29, "Transition écologique", "Actualite", "actualite", "ecologie", "easy", 45,
  "Laquelle de ces propositions correspond à une recommandation publique de sobriété énergétique ?", ["Acheter une voiture diesel", "Boire au maximum un litre d’eau par jour", "Privilégier l’avion au train", "Régler son chauffage à 19 °C maximum"], 3,
  "La recommandation de sobriété énergétique consiste à limiter le chauffage des pièces occupées autour de 19 °C.");
add(30, "Europe", "Culture generale", "culture_generale", "union_europeenne", "easy", 45,
  "Qu’est-ce que le Brexit ?", ["Un futur modèle de téléphone", "Le retrait du Royaume-Uni de l’Union européenne", "Un programme informatique", "Un programme spatial"], 1,
  "Le terme Brexit désigne le processus de retrait du Royaume-Uni de l’Union européenne.");
add(31, "Intelligence artificielle", "Numerique", "numerique", "intelligence_artificielle", "easy", 45,
  "L’intelligence artificielle générative se caractérise principalement par la faculté, pour une machine :", ["de comprendre et connaître comme un humain", "de produire des contenus textuels, graphiques ou audiovisuels", "de produire uniquement de nouvelles applications", "de produire son propre système d’exploitation"], 1,
  "Une IA générative produit de nouveaux contenus à partir des modèles appris sur ses données d’entraînement.");

add(32, "Arithmétique", "Maths et logique", "maths_logique", "nombres_premiers", "hard", 120,
  "Quel nombre est un nombre premier ?", ["761", "763", "767", "768"], 0,
  "761 n’est divisible par aucun nombre premier inférieur ou égal à sa racine carrée. En revanche, 763 = 7 × 109, 767 = 13 × 59 et 768 est pair.");
add(33, "Calcul", "Maths et logique", "maths_logique", "priorites_operatoires", "easy", 60,
  "Quel est le résultat de l’expression 4 - (5 × 8 + 3) ?", ["-39", "-7", "7", "39"], 0,
  "Dans la parenthèse : 5 × 8 + 3 = 43. Donc 4 - 43 = -39.", [], ["5 × 8 = 40", "40 + 3 = 43", "4 - 43 = -39"]);
add(34, "Équations", "Maths et logique", "maths_logique", "systemes_equations", "medium", 120,
  "Tom achète 1 cahier et 2 stylos pour 4 €. Olive achète 2 cahiers et 2 stylos pour 6 €. Quels sont les prix d’un cahier et d’un stylo ?", ["Cahier : 1 €, stylo : 1 €", "Cahier : 1 €, stylo : 2 €", "Cahier : 2 €, stylo : 1 €", "Cahier : 2 €, stylo : 2 €"], 2,
  "En soustrayant les deux achats, un cahier coûte 2 €. Il reste alors 2 € pour deux stylos, soit 1 € par stylo.", [], ["2C + 2S - (C + 2S) = 6 - 4", "C = 2", "2 + 2S = 4, donc S = 1"]);
add(35, "Pourcentages", "Maths et logique", "maths_logique", "calcul_de_pourcentage", "easy", 60,
  "Une tablette de chocolat de 360 g contient 25 % de matière grasse. Quel est le poids de la matière grasse ?", ["90 grammes", "100 grammes", "120 grammes", "180 grammes"], 0,
  "25 % représente un quart : 360 ÷ 4 = 90 grammes.");
add(36, "Géométrie", "Maths et logique", "maths_logique", "aire_rectangle", "easy", 45,
  "Quelle est l’aire d’un rectangle de 8 cm de longueur et 3 cm de largeur ?", ["11 cm²", "12 cm²", "16 cm²", "24 cm²"], 3,
  "L’aire d’un rectangle vaut longueur × largeur : 8 × 3 = 24 cm².");
add(37, "Statistiques", "Maths et logique", "maths_logique", "moyenne", "easy", 60,
  "Bastien a obtenu les notes 12, 14, 16 et 18. Quelle est sa moyenne ?", ["14", "15", "16", "17"], 1,
  "La somme vaut 60 ; divisée par 4 notes, elle donne une moyenne de 15.");
add(38, "Pourcentages", "Maths et logique", "maths_logique", "reduction", "easy", 60,
  "Un prix initial de 120 € est réduit de 15 %. Quel est le nouveau prix ?", ["100 €", "102 €", "105 €", "108 €"], 1,
  "La réduction vaut 120 × 0,15 = 18 €. Le prix réduit est donc 120 - 18 = 102 €.");
add(39, "Géométrie", "Maths et logique", "maths_logique", "aire_rectangle", "easy", 45,
  "Un rectangle mesure 8 cm de longueur et 5 cm de largeur. Quelle est son aire ?", ["13 cm²", "26 cm²", "40 cm²", "80 cm²"], 2,
  "L’aire vaut 8 × 5 = 40 cm².");
add(40, "Conversions", "Maths et logique", "maths_logique", "unites_de_surface", "medium", 120,
  "Un agriculteur divise son terrain en trois parts égales pour ses filles après avoir conservé 1 500 m². Le terrain mesure 75 ares. Quelle surface aura chaque parcelle ?", ["200 m²", "2 000 m²", "2 500 m²", "25 ares"], 1,
  "75 ares valent 7 500 m². Après retrait de 1 500 m², il reste 6 000 m² ; chaque fille reçoit 6 000 ÷ 3 = 2 000 m².");
add(41, "Conversions", "Maths et logique", "maths_logique", "masses_et_volumes", "medium", 90,
  "On mélange 570 g de farine, 60 g de sucre, 325 g de chocolat et un litre d’eau. Quel est le poids de la préparation ?", ["1 935 g", "1 955 g", "1,945 kg", "1,965 kg"], 1,
  "Un litre d’eau pèse environ 1 000 g. La masse totale vaut 570 + 60 + 325 + 1 000 = 1 955 g.");
add(42, "Pourcentages", "Maths et logique", "maths_logique", "facture_et_tva", "medium", 120,
  "Complétez la facture et choisissez les bons sous-total, TVA à 20 % et total.", ["Sous-total : 24,40 € ; TVA : 4,88 € ; total : 29,28 €", "Sous-total : 24,40 € ; TVA : 5 € ; total : 29,40 €", "Sous-total : 25 € ; TVA : 5 € ; total : 30 €", "Sous-total : 25 € ; TVA : 5,50 € ; total : 30,50 €"], 2,
  "Le sous-total vaut 15,20 + 0,60 + 9,20 = 25 €. La TVA vaut 25 × 20 % = 5 €, puis le total 30 €.", ["4 litres d’huile : 15,20 €", "Joint de vidange : 0,60 €", "Filtre à huile : 9,20 €"]);
add(43, "Vitesse", "Maths et logique", "maths_logique", "vitesse_moyenne", "hard", 135,
  "Jean parcourt 5 500 km en 29 jours et 5 heures. Quelle est sa vitesse moyenne en km/h ?", ["7,85 km/h", "7,90 km/h", "15,80 km/h", "15,58 km/h"], 0,
  "29 jours et 5 heures représentent 29 × 24 + 5 = 701 heures. La vitesse moyenne vaut 5 500 ÷ 701 ≈ 7,85 km/h.");
add(44, "Fractions", "Maths et logique", "maths_logique", "proportionnalite", "easy", 60,
  "Si les deux cinquièmes d’une pizza valent 12 €, quel est le prix de la pizza entière ?", ["24 €", "30 €", "32 €", "60 €"], 1,
  "Un cinquième vaut 12 ÷ 2 = 6 €. Cinq cinquièmes valent donc 5 × 6 = 30 €.");

add(45, "Suite logique", "Maths et logique", "maths_logique", "suites_numeriques", "easy", 60,
  "Quel nombre complète la suite 8, 9, 11, 14, 18… ?", ["21", "22", "23", "24"], 2,
  "Les écarts successifs valent +1, +2, +3 et +4. L’écart suivant vaut +5 : 18 + 5 = 23.");
add(46, "Raisonnement visuel", "Maths et logique", "maths_logique", "intrus_visuel", "hard", 120,
  "Quel est le numéro de l’intrus parmi les quatre figures décrites ?", ["Figure 1", "Figure 2", "Figure 3", "Figure 4"], 1,
  "Dans les figures 1, 3 et 4, le polygone contient un disque noir tandis que le disque blanc reste à l’extérieur. Dans la figure 2, le disque blanc et un disque noir sont à l’intérieur du polygone.", ["Figure 1 : un disque noir dans le polygone ; un noir et un blanc à l’extérieur", "Figure 2 : un disque noir et le disque blanc dans le polygone ; un noir à l’extérieur", "Figure 3 : un disque noir dans le polygone ; un noir et un blanc à l’extérieur", "Figure 4 : un disque noir dans le polygone ; un noir et un blanc à l’extérieur"]);
add(47, "Tableau logique", "Maths et logique", "maths_logique", "croisement_de_regles", "hard", 120,
  "Dans le tableau, quel nombre remplace les points d’interrogation ?", ["26", "27", "36", "37"], 1,
  "La case cherchée est à l’intersection de la ligne des nombres commençant par 2 et de la colonne des nombres finissant par 7 : 27.", ["Dernière colonne, de haut en bas : 27 | 37 | 107 | ?", "Dernière ligne, de gauche à droite : 24 | 22 | 28 | ?"]);
add(48, "Ordonnancement", "Maths et logique", "maths_logique", "relations_ordre", "easy", 60,
  "Antoine est plus âgé que Jean. Karine est née avant Paul et elle est plus jeune que Jean. Qui est le plus âgé ?", ["Antoine", "Jean", "Karine", "Paul"], 0,
  "Les relations donnent Antoine > Jean > Karine > Paul. Antoine est donc le plus âgé.");
add(49, "Suite logique", "Maths et logique", "maths_logique", "suites_de_lettres", "medium", 90,
  "Complétez la suite de lettres : BDF, HJL, … ?", ["MNP", "NPR", "QRT", "RTU"], 1,
  "Chaque groupe avance de deux lettres à l’intérieur du triplet. Après B-D-F puis H-J-L, le groupe suivant est N-P-R.");
add(50, "Suite logique", "Maths et logique", "maths_logique", "suites_numeriques", "medium", 90,
  "La chaîne 3612244896 représente la suite 3, 6, 12, 24, 48, 96 sans séparateurs. Quel chiffre vient ensuite ?", ["1", "4", "7", "8"], 0,
  "Chaque nombre est le double du précédent. Après 96 vient 192 ; le prochain chiffre de la chaîne est donc 1.");
add(51, "Probabilités", "Maths et logique", "maths_logique", "probabilite_simple", "easy", 45,
  "Si vous choisissez au hasard une réponse parmi quatre propositions, quelle est la probabilité de sélectionner la bonne réponse ?", ["10 %", "25 %", "33,3 %", "50 %"], 1,
  "Une proposition sur quatre est correcte : 1 ÷ 4 = 0,25, soit 25 %.");
add(52, "Débit", "Maths et logique", "maths_logique", "debit_et_duree", "medium", 90,
  "La connexion internet fonctionne à 2 Gbit/s et le disque écrit à 4 Gbit/s. Combien de temps faut-il pour télécharger un fichier de 12 Gbit ?", ["2 secondes", "4 secondes", "6 secondes", "12 secondes"], 2,
  "La connexion est le facteur limitant. La durée vaut 12 Gbit ÷ 2 Gbit/s = 6 secondes.");
add(53, "Proportionnalité", "Maths et logique", "maths_logique", "productivite", "medium", 90,
  "Cinq ouvriers construisent cinq maisons en cinq jours. Combien de jours faut-il à dix ouvriers pour construire dix maisons, au même rythme ?", ["2,5 jours", "5 jours", "10 jours", "20 jours"], 1,
  "Chaque ouvrier construit une maison en cinq jours. Dix ouvriers construisent donc dix maisons simultanément en cinq jours.");
add(54, "Calcul", "Maths et logique", "maths_logique", "bilan_achats_ventes", "easy", 60,
  "Un homme achète une voiture 5 000 €, la vend 6 000 €, la rachète 7 000 € et la revend 8 000 €. Quel est son bénéfice total ?", ["1 000 €", "2 000 €", "3 000 €", "4 000 €"], 1,
  "La première opération rapporte 1 000 € et la seconde rapporte aussi 1 000 €. Le bénéfice total est de 2 000 €.");

if (questions.length !== 54) throw new Error(`Expected 54 questions, got ${questions.length}`);
const ids = new Set(questions.map(question => question.id));
corpus.questions = corpus.questions.filter(question => !ids.has(question.id));
corpus.questions.push(...questions);
const provenance = "QCM 2025 officiel et proposition de correction publique vérifiée";
if (!String(corpus.generatedFrom || "").includes(provenance)) {
  corpus.generatedFrom = `${corpus.generatedFrom || "corpus"}; ${provenance}`;
}

const annale2025 = Array.isArray(corpus.annales)
  ? corpus.annales.find(annale => String(annale.year) === "2025")
  : null;
if (annale2025) {
  annale2025.qcm = "54 questions officielles intégrées : français, connaissances générales, calcul et raisonnement ; proposition de correction publique vérifiée";
}

const publicCorrections = [
  ["Français", "https://www.devenez-fonctionnaire.fr/correction-qcm-concours-commun-2025/correction-fran%C3%A7ais-qcm-concours-commun-2025"],
  ["Culture générale", "https://www.devenez-fonctionnaire.fr/correction-qcm-concours-commun-2025/correction-culture-qcm-concours-commun-2025"],
  ["Mathématiques", "https://devenez-fonctionnaire.fr/correction-qcm-concours-commun-2025/correction-maths-qcm-concours-commun-2025"],
  ["Logique", "https://devenez-fonctionnaire.fr/correction-qcm-concours-commun-2025/correction-logique-qcm-concours-commun-2025"]
].map(([section, url]) => ({
  title: `Proposition de correction QCM 2025 — ${section}`,
  url,
  type: "qcm-correction",
  year: 2025
}));
for (const source of publicCorrections) {
  if (!corpus.sources.some(existing => existing.url === source.url)) corpus.sources.push(source);
}

fs.writeFileSync(corpusPath, `${JSON.stringify(corpus, null, 2)}\n`);
console.log(`Imported ${questions.length} QCM 2025 questions into ${corpusPath}`);
