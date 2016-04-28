var db = require('./mongoose'),
    Schema = db.Schema,
    Oid = Schema.Types.ObjectId;

function getCurrentUser() {
  return Oid('570b749613e0ec08d88b3f17');
}

// Schemas
var Cable = new Schema({
  title: {type: String, required: true},
  details: {type: String},
  color: {type: Number, required: true}
});

var Cross = new Schema({
  title: {type: String, required: true}
});

var Vertical = new Schema({
  title: {type: String, required: true},
  cross: {type: Oid, ref: 'Cross', required: true}
});

var Plint = new Schema({
  title: {type: String, required: true},
  vertical: {type: Oid, ref: 'Vertical', required: true},
  cable: {type: Oid, ref: 'Cable', default: null},
  mon: {type: Date, default: Date.now},
  mby: {type: Oid, ref: 'User', default: getCurrentUser},
  comdata: {type: String},
  start1: {type: Number, default: 1},
  pairs: [{}]
});

module.exports = {
  cable: db.model('cable', Cable),
  cross: db.model('cross', Cross),
  vertical: db.model('vertical', Vertical),
  plint: db.model('plint', Plint)
}







/*
var Schema = mongoose.Schema;

// Schemas
var Images = new Schema({
    kind: {
        type: String,
        enum: ['thumbnail', 'detail'],
        required: true
    },
    url: { type: String, required: true }
});

var Article = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    images: [Images],
    modified: { type: Date, default: Date.now }
});

// validation
Article.path('title').validate(function (v) {
    return v.length > 5 && v.length < 70;
});

var ArticleModel = mongoose.model('Article', Article);

module.exports.ArticleModel = ArticleModel;

*/