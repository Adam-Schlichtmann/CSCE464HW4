var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/chirps');

router.get('/', function(req, res) {
    var collection = db.get('users');
    collection.find({}, function(err, posts){
        if (err) throw err;
      	res.json(posts);
    });
});

// For login
router.get('/:userName', function(req, res) {
  var collection = db.get('users');
  console.log(req.body.userName);
  console.log("HERE");
  collection.findOne({ userName: req.body.userName }, function(err, user){
      if (err) throw err;
      window.localStorage.set("id", 1234);
      res.json(user);
  });
});

// For registering a new user
router.post('/', function(req, res){
  var collection = db.get('users');
  console.log(req.body.userName);
  collection.insert({
      userName: req.body.userName,
      password: req.body.password,
      name: req.body.name
  }, function(err, user){
      if (err) throw err;

      res.json(user);
  });
});

module.exports = router;
