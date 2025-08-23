(function (global) {
  const ADJECTIVES_EN = [
    'good','bad','big','small','long','short','old','young','new','high',
    'low','early','late','fast','slow','hot','cold','warm','cool','hard',
    'soft','light','heavy','easy','difficult','simple','complex','happy','sad','kind',
    'mean','rich','poor','strong','weak','loud','quiet','bright','dark','clean',
    'dirty','full','empty','thick','thin','wide','narrow','near','far','cheap',
    'expensive','busy','free','open','closed','sweet','bitter','sour','salty','spicy',
    'fresh','stale','dry','wet','safe','dangerous','healthy','sick','polite','rude',
    'friendly','unfriendly','lucky','unlucky','beautiful','ugly','clever','stupid','brave','cowardly',
    'calm','nervous','honest','dishonest','interesting','boring','important','unimportant','famous','unknown',
    'ready','unready','public','private','local','global','common','rare','equal','different'
  ];
  // ensure 100 items by adding similar-level basics
  ADJECTIVES_EN.push(
    'similar','separate','central','minor','major','modern','ancient','noisy','quiet','crowded'
  );
  if (typeof module === 'object' && module.exports) {
    module.exports = { ADJECTIVES_EN };
  } else {
    global.GRAMMAR_ADJECTIVES_EN = ADJECTIVES_EN;
  }
})(typeof self !== 'undefined' ? self : this);
