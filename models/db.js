/**
 * Created by test on 11/24/16.
 */
var mongoose = require('mongoose');
var config =  require('./config');
db = mongoose.connect(config.dev.connectionstring);
var connection = db.connection;
connection.on('error', function (err) {
  console.error('connect to %s error: ', config.dev.connectionstring, err.message);
  process.exit(1);
});
connection.once('open', function () {
  console.log('%s has been connected.', config.dev.connectionstring);
});
module.exports = db;