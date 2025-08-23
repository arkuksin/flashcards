(function (global) {
  const ADJEKTIVE_DE = [
    'gut','schlecht','groß','klein','lang','kurz','alt','jung','neu','hoch',
    'niedrig','früh','spät','schnell','langsam','heiß','kalt','warm','kühl','hart',
    'weich','hell','schwer','leicht','einfach','schwierig','simpel','komplex','glücklich','traurig',
    'freundlich','unfreundlich','reich','arm','stark','schwach','laut','leise','hell','dunkel',
    'sauber','schmutzig','voll','leer','dick','dünn','breit','schmal','nah','fern',
    'billig','teuer','beschäftigt','frei','offen','geschlossen','süß','bitter','sauer','salzig',
    'scharf','frisch','altbacken','trocken','nass','sicher','gefährlich','gesund','krank','höflich',
    'unhöflich','hübsch','hässlich','klug','dumm','mutig','feige','ruhig','nervös','ehrlich',
    'unehrlich','interessant','langweilig','wichtig','unwichtig','berühmt','unbekannt','bereit','unvorbereitet','öffentlich',
    'privat','lokal','global','gewöhnlich','selten','ähnlich','getrennt','zentral','gering','groß' 
  ];
  // ensure 100 items
  ADJEKTIVE_DE.push(
    'modern','antik','lautstark','leise','überfüllt','leer','kurvig','gerade','spitz','stumpf'
  );
  if (typeof module === 'object' && module.exports) {
    module.exports = { ADJEKTIVE_DE };
  } else {
    global.GRAMMAR_ADJECTIVES_DE = ADJEKTIVE_DE;
  }
})(typeof self !== 'undefined' ? self : this);
