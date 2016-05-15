var async = require('async'),
		//fs = require('fs'),
		//passport = require('passport'),
		//csrf = require('csurf'),
		//multer  = require('multer'),
		//upload = multer(),
		upload = require('multer')(),
		user = require('./user'),
		lexicon = require('./lexicon'),
		T = lexicon.T, // translator
		models = require('./models'),
		//Account = models.account,
		Cable = models.cable,
		Cross = models.cross,
		Vertical = models.vertical,
		Plint = models.plint,
		Tokens = require('csrf'),
		tokens = new Tokens();


//var csrfProtection = csrf({ cookie: true });
//var csrfProtection = csrf({cookie: true, value: function(req) { return (req.body && req.body.formkey); }});


  //if (!tokens.verify(secret, val)) {
    //throw createError(403, 'invalid csrf token', {
      //code: 'EBADCSRFTOKEN'
    //});

function is_auth(req, res, next) {
	//res.append('User-Id', '570b749613e0ec08d88b3f19');
	//if (req.user) {
		////console.log('set header', req.user);
		//next();
	//} else {
		////next(hError(401, 'you are not authorized', 'UNAUTHORIZED'));
		//next(error(401, 'you are not authorized'));
	//}

	var obj = req.user ? null : error(401, 'you are not authorized');
	next(obj);
}

//function add_csrf(session, formname, obj) {
	//if (session && session.passport) {
		//var keyname = '_formkey[' + formname + ']',
				//formkey = tokens.create(tokens.secretSync());
				////sk = req.session[keyname] || [];
		//session[keyname] = (session[keyname] || []).slice(-9);
		//session[keyname].push(formkey);
		//obj.formname = formname;
		//obj.formkey = formkey;
	//}
	//return obj;
//}

function add_csrf(req, res, formname, obj) {
	var session = req.session;
	if (req.user && session && session.passport) {
		var keyname = '_formkey[' + formname + ']',
				formkey = tokens.create(tokens.secretSync());
				//sk = req.session[keyname] || [];
		session[keyname] = (session[keyname] || []).slice(-9);
		session[keyname].push(formkey);
		obj.formname = formname;
		obj.formkey = formkey;
	}
	res.send(obj);
}

module.exports = function(app, passport) {

	//app.all('/api/*', function(req, res, next) {
		//if (req.user) res.append('User-Id', req.user._id);
		//next();
	//});

	app.get('/api/crosses/:id?', crosses);

	app.get('/api/cables', cables);

	app.get('/api/news', news);

	app.get('/api/lexicon', lexicon.send);

	app.all('/api/user/:action', user);

	app.post('/api/:table/:id?', is_auth, upload.array(), post);

	//app.get('*', function(req, res, next){
		//fs.readFile(app.locals.static + '/index.html', "utf-8", function(err, file) {
			//if (err) next(err);
			//else res.type('text/html; charset=UTF-8').status(200).send(file);
		//});
	//});

}

function cables(req, res, next) {

	//console.log(req.session);

  var id = req.params.id ? {_id: req.params.id} : {};
	Cable.find(id).lean().sort({title: 1}).exec(function(err, cables) {
		if (err) next(err);
		else add_csrf(req, res, 'editcables', {cables: cables});
	});
}

function post(req, res, next) {
	var formkey = req.body.formkey,
			formkeys = req.session['_formkey[' + req.body.formname + ']'];
	if(!(formkey && formkeys instanceof Array)) return next(error(500, 'foreign form'));
	var i = formkeys.indexOf(formkey);
	if(i === -1) return next(error(403, 'invalid csrf token'));
	//if (i === -1) return err_next(403, 'invalid csrf token');
	formkeys.splice(i, 1);
	//console.log('cables', JSON.parse(req.body.cables));
	res.send({post: 'ok!'});
}

function error(status, msg) {
  //return {status: e1, message: e2, statusCode: e3}
  //return new Error({status: e1, message: e2, statusCode: e3});
	var err = new Error(msg);
  err.status = status;
	//console.log('my own err', err);
	return err;
}

function crosses(req, res, next) {
	var id = req.params.id ? {_id: req.params.id} : {};
	// lean - return plain js object, not mongoose document
	Cross.find(id).lean().sort({_id: 1}).exec(function(err, crosses) {
		if(err) next(err);
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
				//if( err ) next(new Error(err));
				if(err) next(err);
				//else res.send({crosses: crosses});
				else add_csrf(req, res, 'editcross', {crosses: crosses});
			});
		}
	});
}

function news(req, res, next) {
//req.session.message = 'Hello World';
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


///* routes */
//router.get('/api/crosses', Ctrls.getCrosses);
//router.get('/api/crosses/:id', Ctrls.getCrosses);
//router.get('/api/news', Ctrls.getNews);
//router.get('/api/lexicon', lexicon.send);
//router.post('/api/user/:action', Ctrls.User);

//router.get('/*', function(req, res, next){
  //fs.readFile(static_dir + '/index.html', "utf-8", function(err, file) {
		//if (err) next(new Error(err));
		//else res.type('text/html; charset=UTF-8').status(200).send(file);
  //});
//});
///* end routes */


//module.exports = {

	//getCrosses: function(req, res, next) {
		//var id = {};
		//if (req.params.id) id._id = req.params.id;
		//// lean - return plain js object, not mongoose document
		//Cross.find(id).lean().sort({_id: 1}).exec(function(err, crosses) {
			//if (err) next(new Error(err));
			//else {
				//async.forEachOf(crosses, function(cross, i, cb) {
					//var cid = cross._id;
					//Vertical.find({cross: cid}).lean().sort({_id: 1}).exec(function(err, _verticals) {
						//if(err) cb(err);
						//else {
							//var verticals = [];
							//_verticals.forEach(function(_v) {
								//verticals.push([_v._id, _v.title]);
							//});
							//crosses[i] = [cid, cross.title, verticals];
							//cb();
						//}
					//});
				//}, function(err) {
					//if( err ) next(new Error(err));
					//else res.send({crosses: crosses});
				//});
			//}
		//});
	//},

	//getNews: function(req, res, next) {
		//Plint.find({_id: '570b749613e0ec08d88b3fc2'}).exec(function(err, plints) {
			//res.send({
			  //header: T('_LAST_MODI_'), //'Last modified',
				////plints: plints
				//plints: [
					//{"pairs": [["1555,776 \u041c\u0433\u0446", 0]], "vertical": "V1 new", "title": "M5", "start1": 1, "cross": "test RN", "crossId": "57113fcc92656c8b3d2d01a7", "mby": "570b749613e0ec08d88b3f19", "verticalId": "5711520792656c8b3d2d01aa", "comdata": "test RN 1V M14", "id": "571152b713e0ec1a0cb6997f", "mon": "2016-04-15T22:22:30.431Z"}
				//],
				//"cross": "",
				//"vertical": "",
				//"users": {"570b749613e0ec08d88b3f19": "\u0410\u043d\u0434\u0440\u0435\u0439 \u041f\u0440\u043e\u0446\u0435\u043d\u043a\u043e"}
			//});
		//});
	//},




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
