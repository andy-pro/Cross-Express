var fs = require('fs'),
		async = require('async'),
		T = require('./lexicon').T, // translator
		models = require('./models'),
		Cable = models.cable,
		Cross = models.cross,
		Vertical = models.vertical,
		Plint = models.plint;

module.exports = {

	getCrosses: function(req, res, next) {
		var id = {};
		if (req.params.id) id._id = req.params.id;
		// lean - return plain js object, not mongoose document
		Cross.find(id).lean().sort({_id: 1}).exec(function(err, crosses) {
			if (err) next(new Error(err));
			else {
				async.forEachOf(crosses, function(cross, i, cb) {
					var cid = cross._id;
					Vertical.find({cross: cid}).lean().sort({_id: 1}).exec(function(err, _verticals) {
						if(err) cb(err);
						else {
							var verticals = [];
							_verticals.forEach(function(_v) {
								verticals.push([_v._id, _v.title]);
							});
							crosses[i] = [cid, cross.title, verticals];
							cb();
						}
					});
				}, function(err) {
					if( err ) next(new Error(err));
					else res.send({crosses: crosses});
				});
			}
		});
	},

	getNews: function(req, res, next) {
		Plint.find({_id: '570b749613e0ec08d88b3fc2'}).exec(function(err, plints) {
			res.send({
			  header: T('_LAST_MODI_'), //'Last modified',
				//plints: plints
				plints: [
					{"pairs": [["1555,776 \u041c\u0433\u0446", 0]], "vertical": "V1 new", "title": "M5", "start1": 1, "cross": "test RN", "crossId": "57113fcc92656c8b3d2d01a7", "mby": "570b749613e0ec08d88b3f19", "verticalId": "5711520792656c8b3d2d01aa", "comdata": "test RN 1V M14", "id": "571152b713e0ec1a0cb6997f", "mon": "2016-04-15T22:22:30.431Z"}
				],
				"cross": "",
				"vertical": "",
				"users": {"570b749613e0ec08d88b3f19": "\u0410\u043d\u0434\u0440\u0435\u0439 \u041f\u0440\u043e\u0446\u0435\u043d\u043a\u043e"}
			});
		});
	}

}


/*
router.get('/api/crosses', function(req, res, next) {
	console.log(req.params);
  //Cross.find(null, null, {sort: {_id: 1}}, function(err, crosses) {
  Cross.find().lean().sort({_id: 1}).exec(function(err, crosses) {



    if (err) {
      //res.statusCode = 500;
      //log.error('Internal error(%d): %s', res.statusCode, err.message);
      //return res.send({ error: 'Server error' });
			next(new Error(err));
    } else {
			async.forEachOf(crosses, function(cross, i, cb) {
			//async.each(_crosses, function(cross, cb) {
				var cid = cross._id;
				Vertical.find({cross: cid}).lean().sort({_id: 1}).exec(function(err, _verticals) {
					if(err) cb(err);
					else {
						var verticals = [];
						_verticals.forEach(function(_v) {
							verticals.push([_v._id, _v.title]);
						});
						crosses[i] = [cid, cross.title, verticals];
						cb();
					}
				});
			}, function(err) {
					if( err ) {
						// One of the iterations produced an error.
						// All processing will now stop.
						//console.log('A file failed to process');
						next(new Error(err));
					} else {
						//console.log('All files have been processed successfully');
						return res.send({crosses:crosses});
					}
			});
    }
  });
});
*/

