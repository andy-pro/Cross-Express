var db = require('./mongoose');
var Schema = db.Schema;
var Oid = Schema.Types.ObjectId;

// Schemas
var Cross = new Schema({
    title: { type: String, required: true }
});

var Vertical = new Schema({
    title: {type: String, required: true},
    cross: {type: Oid, ref: 'Cross', required: true }
});

//var models = {
  //CrossModel: db.model('Cross', Cross)
//}

//module.exports.CrossModel = CrossModel;
module.exports = {
  cross: db.model('cross', Cross),
  vertical: db.model('vertical', Vertical)
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