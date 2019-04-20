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
// router.get('/:userName', function(req, res) {
//   var collection = db.get('users');
//   console.log(req.body.userName);
//   collection.findOne({ userName: req.params.id }, function(err, user){
//       if (err) throw err;
//       res.json(user);
//   });
// });

// router.get('/:id', function(req, res) {
//   var collection = db.get('users');
//   console.log("here wer");
//   collection.findOne({ _id: "5cb8cb2d304fa022cad80e34" }, function(err, user){
//       if (err) throw err;

//       res.json(user);
//   });
// });

router.get('/:id', function(req, res) {
  var collection = db.get('users');
  collection.findOne({ _id: req.params.id }, function(err, user){
      if (err) throw err;

      res.json(user);
  });
});

router.put('/:id', function(req, res){
  var collection = db.get('users');
  console.log(collection);
  // var follow = req.body.followers;
  // follow.push(req.params.id);

  console.log(req.body._id);
  console.log(req.body.following)
  var follow = req.body.following;
  follow.push(req.params.id);
  collection.update({
      _id: req.body._id
  },
  { $set: {
      following: follow
  }
  }, function(err, user){
      if (err) throw err;

      res.json(user);
  });
});

// //modify followers
// router.put('/:id', function(req, res){
//   console.log("Here 4");
//   console.log(req.body.currentID);
//   var collection = db.get('users');
//   for (var i = 0; i < collection.length; i++){
//     if ( collection[i]._id == "5cb8cb2d304fa022cad80e34"){
//       var followers = collection[i].following;
//     }
//   }
//   console.log("Here 6");
//   followers.push(req.body.currentID);
//   collection.update({
//       _id: "5cb8cb2d304fa022cad80e34"
//   },
//   {
//       following: followers
//   }, function(err, user){
//       if (err) throw err;

//       res.json(user);
//   });
// });

// For registering a new user
router.post('/', function(req, res){
  var collection = db.get('users');
  console.log(req.body.userName);
  collection.insert({
      userName: req.body.userName,
      password: req.body.password,
      name: req.body.name,
      following: [],
      favorites: []
  }, function(err, user){
      if (err) throw err;

      res.json(user);
  });
});

module.exports = router;
