var express = require('express'),
		//router = express.Router(),
		app = express(),
		//path = require('path'),
		fs = require('fs'),
		favicon = require('serve-favicon'),
		log = require('./lib/log')(module),
		lexicon = require('./lib/lexicon'),
		//Ctrls = require('./lib/controllers'),
		blade = require('blade'),
		logger = require('morgan'),
		cookieParser = require('cookie-parser'),
		bodyParser = require('body-parser'),
		passport = require('passport'),
		LocalStrategy = require('passport-local').Strategy;
		//static_dir = require('./config.json').static;

app.locals.static = __dirname + '/public';
app.use(favicon(app.locals.static + '/favicon.ico'));
app.use(logger('dev')); // Predefined Formats: combined, common, dev, short, tiny
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
		cookie: {maxAge: 86400000}
}));
app.use(passport.initialize());
app.use(passport.session());


app.set('views', __dirname + '/views'); //tells Express where our views are stored
app.set('view engine', 'blade'); //Yes! Blade works with Express out of the box!

app.use(blade.middleware(__dirname + '/views') ); //for client-side templates
app.use('/static', express.static(app.locals.static));

//app.use(function(req, res, next) {
	////res.append('User-Id', '570b749613e0ec08d88b3f19');
	//res.append('User-Id', 0);
	//next();
//});

//app.use(function(req, res, next) {
	////res.append('User-Id', '570b749613e0ec08d88b3f19');
	////res.append('User-Id', 0);
	////console.log(req);
	//next();
//});

app.use(lexicon.setLang);

//app.use('/', router);

// passport config
var Account = require('./lib/models').account;

//var User = require('./models/user');

//passport.use(new LocalStrategy(Account.authenticate()));
// CHANGE: USE "createStrategy" INSTEAD OF "authenticate", passport-local-mongoose
passport.use(Account.createStrategy());
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.use(function(req, res, next) {
	//res.append('User-Id', '570b749613e0ec08d88b3f19');
	if (req.user) res.append('User-Id', req.user._id);
	//console.log('set header', req.user);
	next();
});

// routes ======================================================================
//require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./lib/controllers')(app, passport); // load our routes and pass in our app and fully configured passport

app.get('*', function(req, res, next)	{ // index.html on any request
	res.render('layout');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
	//console.log('error handler express:', err, err.message, err.status);
  log.error('Internal error(%d): %s', res.statusCode, err.message);
	// development will print stacktrace, production - no stacktraces leaked to user
  res.status(err.status || 500).send(app.get('env') === 'development' ? {error: err.message} : {});
});

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

module.exports = app;
