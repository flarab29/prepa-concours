# Prépa DGFiP C

Application Android native et prévisualisation navigateur pour préparer le concours externe d'agent administratif principal des finances publiques de 2e classe.

## Contenu

- Tableau de bord avec calendrier 2026, coefficients, seuil éliminatoire et plan de travail.
- Corpus référencé : QCM 2020 à 2025, sujet zéro QCM 2026, écrits 2020 à 2025, rapports de jury 2020 à 2025, sujets zéro 2026.
- Source de données unique : le corpus pédagogique est dans `public_sources/corpus.json`, empaqueté comme asset Android et chargé par la prévisualisation web.
- QCM filtrable par année, catégorie et taille de série dans l'application Android et dans la prévisualisation navigateur.
- Modes QCM plus utiles : libre, diagnostic initial, série courte, mode examen 54 questions, sujet zéro 2026, annale complète, faiblesses du jour et carnet d'erreurs.
- Regroupement automatique des questions par grands domaines : maths/logique, français, histoire-géographie, EMC/institutions, numérique, MEF/DGFiP/DGDDI, actualité et culture générale.
- Carnet d'erreurs local : les mauvaises réponses sont conservées, reproposées et diminuent quand elles sont réussies.
- Pilotage par domaine : l'application repère le domaine le plus fragile et propose une action de travail prioritaire.
- Programme personnel selon la date des écrits, le temps disponible et la priorité du candidat dans la prévisualisation web.
- Suivi par compétence avec volume réellement évalué, taux de réussite et acquis confirmés après révision différée.
- Reprise d'une série QCM interrompue, expiration automatique des simulations et signalement des annales partielles.
- Banque corrigée renforcée : 218 questions actives ont une réponse et une explication, dont les 50 questions du sujet zéro QCM 2026 et 49 questions issues de l’annale QCM 2024.
- Audit intégré : l'app signale que toutes les questions sélectionnables sont corrigées, et distingue clairement les questions officielles encore à intégrer avec un corrigé vérifié.
- Annales écrites transformées en thèmes d'entraînement : égalité professionnelle, France Relance, services publics écoresponsables, dématérialisation, sujet zéro économie du livre.
- Grille de relecture par critères : compréhension, structure, exploitation des données, caractère opérationnel et langue, sans note automatique fondée sur des mots-clés.
- Atelier écrit avec tableau d'extraction, brouillons sauvegardés automatiquement, versions restaurables et relecture guidée sans note automatique trompeuse.
- Fiches anti-erreurs fondées sur les rapports de jury.
- Entraînement oral : présentation de 2 minutes, motivations, DGFiP/DGDDI, déontologie et mises en situation.
- Enregistrement et réécoute locale de la présentation orale dans la prévisualisation web.
- Export et import des données de progression au format JSON.
- Suivi local dans l'application Android et dans la prévisualisation navigateur : checklist, avancement, historique des scores QCM, statistiques par domaine et carnet d'erreurs.

## Sources utilisées

- Page officielle du concours DGFiP externe.
- Sujet zéro 2026 de préadmissibilité.
- Sujet zéro 2026 d'admissibilité.
- Annales QCM 2024 et 2025.
- Rapports de jury 2024 et 2025.
- Sujet zéro QCM 2026 avec corrigé officiel intégré en totalité.
- Propositions de correction QCM 2020 à 2023 utilisées pour élargir la banque corrigée.

L'application référence les annales QCM et écrites ainsi que les rapports de jury de 2020 à 2025. La banque corrigée couvre actuellement 2020 à 2024 et le sujet zéro 2026 ; l'annale 2025 reste une source officielle consultable tant qu'un corrigé vérifié n'est pas intégré.

## Source JSON

Le corpus éditable est `public_sources/corpus.json`.

Il contient :

- `questions` : QCM, choix, réponse attendue, explication et supports éventuels ;
- `verificationLevel`, `sourceType`, `skill`, `subskill`, `difficulty`, `estimatedTimeSeconds` : métadonnées obligatoires pour guider les séances, distinguer les sources et suivre les faiblesses ;
- `annales` : vue synthétique par millésime ;
- `writtenSubjects` : sujets d'entraînement à l'écrit ;
- `juryRules` : alertes issues des rapports de jury ;
- `oralQuestions` : banque de questions d'oral ;
- `sources` : liens officiels et compléments.

Avant de modifier l'application après édition du JSON, lancer :

```powershell
node tools\validate-corpus.js
```

## Tester sur ordinateur

Option simple sous Windows : double-cliquer sur `ouvrir-preview.bat`.

Le script démarre un petit serveur local et ouvre automatiquement la bonne adresse dans le navigateur. Pour l'arrêter, double-cliquer sur `fermer-preview.bat`.

Option manuelle : depuis ce dossier, lancer un petit serveur local puis ouvrir la prévisualisation :

```powershell
python -m http.server 8000
```

Puis ouvrir `http://localhost:8000/index.html`.

La prévisualisation charge `public_sources/corpus.json`. Un double-clic direct sur `index.html` ou `web-preview.html` peut être bloqué par le navigateur, car le fichier JSON local n'est pas toujours accessible en `file://`.

## Tester sur smartphone Android émulé

Option simple :

1. Ouvrir le dossier dans Android Studio.
2. Aller dans Device Manager et créer un téléphone virtuel si aucun n’existe.
3. Désinstaller l’ancienne app `Prépa DGFiP C` de l’émulateur si elle est déjà présente.
4. Lancer l’app avec le bouton Run.

Option automatisée sous Windows :

1. Ouvrir PowerShell dans ce dossier.
2. Lancer `.\tools\run-emulator.ps1`.
3. Si plusieurs émulateurs existent, lancer par exemple `.\tools\run-emulator.ps1 -AvdName Pixel_8`.

Le script utilise le Java intégré à Android Studio, construit l’APK debug, démarre l’émulateur, installe l’application et ouvre l’écran d’accueil.

Si Android Studio demande d’installer des composants, accepter au minimum Android SDK Build-Tools 36.0.0 et la plateforme Android utilisée par le projet.

Si l'app revient encore à l'accueil Android au lancement, exécuter `.\tools\diagnose-crash.ps1`. Le fichier `android-crash-report.txt` contiendra l'erreur Android exacte.

## Ouvrir le projet

1. Ouvrir ce dossier dans Android Studio.
2. Laisser Android Studio synchroniser Gradle.
3. Lancer l'application sur un émulateur ou un téléphone Android.

Si Gradle ne se lance pas hors d'Android Studio, utiliser `tools\run-emulator.ps1`, ou définir `JAVA_HOME` sur `C:\Program Files\Android\Android Studio\jbr` puis lancer `gradlew.bat assembleDebug`.
