var fs = require('fs'),
		async = require('async'),
		models = require('../lib/models'),
		Cross = models.cross,
		Vertical = models.vertical;

module.exports = {

	getCrosses: function(req, res, next) {
		var id = {};
		if (req.params.id) id._id = req.params.id;
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
					else res.send({crosses:crosses});
				});
			}
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

