var dbUrl = 'tips';

var collections = ['tips'];

var db = require('mongojs').connect(dbUrl, collections);

module.exports = db;
