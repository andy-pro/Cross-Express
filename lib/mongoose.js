var mongoose = require('mongoose');
var log = require('./log')(module);
mongoose.connect(require('../config.json').db);

mongoose.connection.on('error', function (err) {
    log.error('connection error:', err.message);
});
mongoose.connection.once('open', function callback () {
    log.info("Connected to DB!");
});

module.exports = mongoose;
