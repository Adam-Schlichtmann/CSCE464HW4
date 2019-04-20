var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/chirps');

router.get('/', function(req, res) {
    var collection = db.get('posts');
    collection.find({}, function(err, posts){
        if (err) throw err;
      	res.json(posts);
    });
});


router.get('/:id', function(req, res) {
    var collection = db.get('posts');
    collection.findOne({ _id: req.params.id }, function(err, post){
        if (err) throw err;

      	res.json(post);
    });
});

router.put('/:id', function(req, res){
    var collection = db.get('posts');
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    console.log(req.params.id);
    collection.update({
        _id: req.params.id
    },
    { $set: {
        content: req.body.content,
        date: dateTime,
        }
    }, function(err, post){
        if (err) throw err;

        res.json(post);
    });
});

router.delete('/:id', function(req, res){
    var collection = db.get('posts');
    collection.remove({ _id: req.params.id }, function(err, post){
        if (err) throw err;

        res.json(post);
    });
});

router.post('/', function(req, res){
    var collection = db.get('posts');
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    collection.insert({
        content: req.body.content,
        replies: [],
        date: dateTime,
        favorited: 0
    }, function(err, movie){
        console.log(err);
        if (err) throw err;

        res.json(movie);
    });
});

module.exports = router;

