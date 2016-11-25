/**
 * Created by test on 11/24/16.
 */
var db = require('./db');

var friendSchema = new db.Schema({
  firstName: String,
  lastName: String
});

var friendModel = db.model('Friend',friendSchema);

function Friend(first_name,last_name){
  this.firstName = first_name;
  this.lastName = last_name
}

Friend.prototype.save = function (callback) {
  var friend = {
    firstName: this.firstName,
    lastName: this.lastName
  };
  var newFriend = new friendModel(friend);

  newFriend.save(function(err,friend){
    if (err){
      return callback(err);
    }
    callback(null, friend);
  })
};

Friend.getAll = function (options, callback) {
  friendModel.find({},null,options,function(err,friends){
    if (err){
      return callback(err);
    }
    callback(null, friends);
  });
};
module.exports = Friend;