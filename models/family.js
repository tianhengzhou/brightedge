/**
 * Created by test on 11/24/16.
 */
var db = require('./db');

var familySchema = new db.Schema({
  firstName: String,
  lastName: String
});

var familyModel = db.model('Family',familySchema);

function Family(first_name,last_name){
  this.firstName = first_name;
  this.lastName = last_name
}

Family.prototype.save = function (callback) {
  var family = {
    firstName: this.firstName,
    lastName: this.lastName
  };
  var newFamily = new familyModel(family);

  newFamily.save(function(err,family){
    if (err){
      return callback(err);
    }
    callback(null, family);
  })
};

Family.getAll = function (options, callback) {
  familyModel.find({},null,options,function(err,family){
    if (err){
      return callback(err);
    }
    callback(null, family);
  });
};
module.exports = Family;