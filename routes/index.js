var express = require('express');
var router = express.Router();
var Friend = require('../models/friend');
var Family = require('../models/family');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/friends', function (req, res) {
  var options = {
    sort: {
      last_name: -1
    }
  };
  Friend.getAll(options, function (err, friends) {
    res.send(friends);
  });
});
router.post('/friends', function (req, res) {
  var newFriends = new Friend('Joe', 'Doe');
  var count = 0;
  while (count < 100){
    count += 1;
    newFriends.save(function (err) {
      if (err){
        console.error(err);
      }
    })
  }
});
router.get('/families', function (req, res) {
  var options = {
    sort: {
      last_name: -1
    }
  };
  Family.getAll(options, function (err, families) {
    res.send(families);
  });
});
router.post('/families', function (req, res) {
  var newFamilies = new Family('Jane', 'Doe');
  var count = 0;
  while (count < 100){
    count += 1;
    newFamilies.save(function (err) {
      if (err){
        console.error(err);
      }
    })
  }
});
module.exports = router;
