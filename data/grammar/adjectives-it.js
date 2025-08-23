(function (global) {
  const AGGETTIVI_IT = [
    'buono','cattivo','grande','piccolo','lungo','corto','vecchio','giovane','nuovo','alto',
    'basso','presto','tardi','veloce','lento','caldo','freddo','tiepido','fresco','duro',
    'morbido','leggero','pesante','facile','difficile','semplice','complesso','felice','triste','gentile',
    'scortese','ricco','povero','forte','debole','rumoroso','silenzioso','luminoso','scuro','pulito',
    'sporco','pieno','vuoto','spesso','sottile','largo','stretto','vicino','lontano','economico',
    'costoso','occupato','libero','aperto','chiuso','dolce','amaro','aspro','salato','piccante',
    'fresco','stantio','secco','bagnato','sicuro','pericoloso','sano','malato','educato','maleducato',
    'amichevole','scostante','fortunato','sfortunato','bello','brutto','intelligente','stupido','coraggioso','codardo',
    'calmo','nervoso','onesto','disonesto','interessante','noioso','importante','irrilevante','famoso','sconosciuto',
    'pronto','impreparato','pubblico','privato','locale','globale','comune','raro','uguale','diverso'
  ];
  AGGETTIVI_IT.push(
    'simile','separato','centrale','minore','maggiore','moderno','antico','rumoroso','tranquillo','affollato'
  );
  if (typeof module === 'object' && module.exports) {
    module.exports = { AGGETTIVI_IT };
  } else {
    global.GRAMMAR_ADJECTIVES_IT = AGGETTIVI_IT;
  }
})(typeof self !== 'undefined' ? self : this);
