(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.I18N = factory();
  }
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this), function () {
  'use strict';

  var I18N = {
    en: {
      title: "Italian Flashcards — 300 Words",
      subtitle: "Type the Italian translation and click the card. Enter — check, click again — next.",
      langLabel: "Language:",
      themeLabel: "Theme:",
      scoreLabel: "Score: ",
      attemptsLabel: "Attempts: ",
      accuracyLabel: "Accuracy: ",
      streakLabel: "Streak: ",
      sourceLabel: "English word",
      clickHintUnchecked: "Click to check.",
      clickHintChecked: "Click to go next.",
      correct: "Correct! ✅",
      correctAnswerLabel: "Correct answer: ",
      alsoAcceptedPrefix: " (also accepted: ",
      alsoAcceptedSuffix: ")",
      inputLabel: "Enter the Italian translation",
      placeholder: "e.g.: ciao",
      btnCheck: "Check (Enter)",
      btnNext: "Next (→)",
      btnSkip: "Skip",
      btnReveal: "Reveal",
      btnReshuffle: "Reshuffle",
      btnReset: "Reset score/attempts/accuracy and restart",
      strictLabel: "Strict accent check (è ≠ e)",
      counter: function (i, n) { return "Card " + i + " of " + n; },
      tips: "Tips: 1) Enter — check, → — next. 2) Clicking the card also checks/advances. 3) Accents are optional by default (caffe counts as caffè)."
    },
    ru: {
      title: "Итальянские карточки — 300 слов",
      subtitle: "Введи перевод на итальянский и кликни по карточке. Enter — проверить, повторный клик — следующая.",
      langLabel: "Язык:",
      themeLabel: "Тема:",
      scoreLabel: "Очки: ",
      attemptsLabel: "Попытки: ",
      accuracyLabel: "Точность: ",
      streakLabel: "Серия: ",
      sourceLabel: "Русское слово",
      clickHintUnchecked: "Кликни, чтобы проверить.",
      clickHintChecked: "Кликни, чтобы перейти дальше.",
      correct: "Правильно! ✅",
      correctAnswerLabel: "Нужный ответ: ",
      alsoAcceptedPrefix: " (также принимается: ",
      alsoAcceptedSuffix: ")",
      inputLabel: "Введи итальянский перевод",
      placeholder: "например: ciao",
      btnCheck: "Проверить (Enter)",
      btnNext: "Дальше (→)",
      btnSkip: "Пропустить",
      btnReveal: "Показать ответ",
      btnReshuffle: "Перемешать заново",
      btnReset: "Сбросить очки/попытки/точность и начать сначала",
      strictLabel: "Строгая проверка акцентов (è ≠ e)",
      counter: function (i, n) { return "Карточка " + i + " из " + n; },
      tips: "Советы: 1) Enter — проверить, → — следующая. 2) Клик по карточке также проверяет/листает. 3) По умолчанию акценты не обязательны (caffe засчитывается как caffè)."
    },
    de: {
      title: "Italienische Karten — 300 Wörter",
      subtitle: "Gib die italienische Übersetzung ein und klicke auf die Karte. Enter — prüfen, erneuter Klick — nächste.",
      langLabel: "Sprache:",
      themeLabel: "Thema:",
      scoreLabel: "Punkte: ",
      attemptsLabel: "Versuche: ",
      accuracyLabel: "Genauigkeit: ",
      streakLabel: "Serie: ",
      sourceLabel: "Deutsches Wort",
      clickHintUnchecked: "Klicke, um zu prüfen.",
      clickHintChecked: "Klicke, um weiterzugehen.",
      correct: "Richtig! ✅",
      correctAnswerLabel: "Richtige Antwort: ",
      alsoAcceptedPrefix: " (auch akzeptiert: ",
      alsoAcceptedSuffix: ")",
      inputLabel: "Gib die italienische Übersetzung ein",
      placeholder: "z. B.: ciao",
      btnCheck: "Prüfen (Enter)",
      btnNext: "Weiter (→)",
      btnSkip: "Überspringen",
      btnReveal: "Antwort zeigen",
      btnReshuffle: "Neu mischen",
      btnReset: "Punkte/Versuche/Genauigkeit zurücksetzen und neu starten",
      strictLabel: "Strenge Akzentprüfung (è ≠ e)",
      counter: function (i, n) { return "Karte " + i + " von " + n; },
      tips: "Tipps: 1) Enter — prüfen, → — nächste. 2) Klick auf die Karte prüft/blättert. 3) Standardmäßig sind Akzente optional (caffe zählt als caffè)."
    },
    fr: {
      title: "Cartes italiennes — 300 mots",
      subtitle: "Tapez la traduction italienne et cliquez sur la carte. Entrée — vérifier, cliquer encore — suivant.",
      langLabel: "Langue :",
      themeLabel: "Thème :",
      scoreLabel: "Score : ",
      attemptsLabel: "Essais : ",
      accuracyLabel: "Précision : ",
      streakLabel: "Série : ",
      sourceLabel: "Mot français",
      clickHintUnchecked: "Cliquez pour vérifier.",
      clickHintChecked: "Cliquez pour continuer.",
      correct: "Correct ! ✅",
      correctAnswerLabel: "Bonne réponse : ",
      alsoAcceptedPrefix: " (aussi accepté : ",
      alsoAcceptedSuffix: ")",
      inputLabel: "Entrez la traduction italienne",
      placeholder: "par ex. : ciao",
      btnCheck: "Vérifier (Entrée)",
      btnNext: "Suivant (→)",
      btnSkip: "Passer",
      btnReveal: "Révéler",
      btnReshuffle: "Mélanger",
      btnReset: "Réinitialiser score/essais/précision et recommencer",
      strictLabel: "Vérification stricte des accents (è ≠ e)",
      counter: function (i, n) { return "Carte " + i + " sur " + n; },
      tips: "Astuces : 1) Entrée — vérifier, → — suivant. 2) Cliquer sur la carte vérifie/avance. 3) Par défaut, les accents sont optionnels (caffe compte comme caffè)."
    }
  };

  function getDiffStrings(lang) {
    var map = {
      en: {
        yourAnswer: "Your answer",
        correctAnswer: "Correct answer",
        lettersWrong: function (n) { return n + " " + (n === 1 ? "letter was wrong" : "letters were wrong"); }
      },
      de: {
        yourAnswer: "Deine Antwort",
        correctAnswer: "Richtige Antwort",
        lettersWrong: function (n) { return n + " " + (n === 1 ? "Buchstabe war falsch" : "Buchstaben waren falsch"); }
      },
      ru: {
        yourAnswer: "Ваш ответ",
        correctAnswer: "Правильный ответ",
        lettersWrong: function (n) {
          var mod10 = n % 10;
          var mod100 = n % 100;
          if (mod10 === 1 && mod100 !== 11) return n + " буква была неверной";
          if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return n + " буквы были неверны";
          return n + " букв были неверны";
        }
      },
      fr: {
        yourAnswer: "Votre réponse",
        correctAnswer: "Bonne réponse",
        lettersWrong: function (n) { return n + " " + (n === 1 ? "lettre était incorrecte" : "lettres étaient incorrectes"); }
      }
    };
    return map[lang] || map.en;
  }

  I18N.getDiffStrings = getDiffStrings;

  return I18N;
});