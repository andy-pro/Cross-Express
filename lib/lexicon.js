/*
  Lexicon helper
  andy-pro
  2016
*/

var Lexicon = {
  setup: function(lex) {
    var L = lex.lexicon,
        langs = {};
    this.li = 0; // language index, default 'en-us'
    this.L = L;
    lex.languages.forEach(function(k, i) { langs[k] = i; });
    this.langs = langs;
    for(var k in L) {
      var pt = k.split(' '),
          lk = pt.length,
          abb = lk > 3,
          w;
      for(var i=0; i<lk; i++) {
        w = pt[i];
        if (abb) w = w.charAt(0); //if more than 3 words, make up abbreviations
        else if (w.length > 7) w = w.slice(0, 4); // trim long words
        pt[i] = w.replace(/\W/g, '').toUpperCase();
      }
      w = abb ? '' : '_';
      var newk = '_' + pt.join(w) + '_';
      while (L[newk]) newk += '_';
      L[k].unshift(k);
      L[newk] = L[k];
      delete L[k];
    }
  },
  setLang: function(req, res, next) {
    var langs = req.acceptsLanguages();
    Lexicon.li = 0; // language index
    if (langs instanceof Array) {
      var i = Lexicon.langs[langs[0]];
      if (i) Lexicon.li = i;
    }
    next();
  },
  send: function(req, res, next) {
    var li = Lexicon.li,
        L = Lexicon.L,
        lex = {};
    for(var k in L) lex[k] = L[k][li];
    res.send(lex);
  },
  T: function(w) {
    return Lexicon.L[w][Lexicon.li]; // provides working in different contexts
  }
}

module.exports = Lexicon;