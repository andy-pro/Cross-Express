var express = require('express'),
		router = express.Router(),
		app = express(),
		//path = require('path'),
		fs = require('fs'),
		favicon = require('serve-favicon'),
		log = require('./lib/log')(module),
		Ctrls = require('./lib/controllers'),
		logger = require('morgan'),
		cookieParser = require('cookie-parser'),
		bodyParser = require('body-parser'),
		static_dir = require('./config.json').static;

app.use(favicon(static_dir + '/favicon.ico'));
app.use(logger('dev')); // Predefined Formats: combined, common, dev, short, tiny
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(static_dir));
app.use('/', router);

/* routes */
router.get('/api/crosses', Ctrls.getCrosses);
router.get('/api/crosses/:id', Ctrls.getCrosses);

router.get('/api/lexicon', function(req, res, next) {
  res.send({ Welcome: 'Welcome' });
});

router.get('/', function(req, res, next){
console.log(static_dir);
  fs.readFile(static_dir + '/index.html', "utf-8", function(err, file) {
		if (err) next(new Error(err));
		else res.type('text/html; charset=UTF-8').status(200).send(file);
  });
});
/* end routes */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
		log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.status(err.status || 500).send({ error: err.message });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  log.error('Internal error(%d): %s',res.statusCode,err.message);
  res.status(err.status || 500).send({ });
});

module.exports = app;
