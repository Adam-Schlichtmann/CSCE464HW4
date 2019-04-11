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
    collection.findOne({ _id: req.params.id }, function(err, movie){
        if (err) throw err;

      	res.json(movie);
    });
});

router.put('/:id', function(req, res){
    var collection = db.get('posts');
    collection.update({
        _id: req.params.id
    },
    {
        title: req.body.title,
        director: req.body.director,
        country: req.body.country
    }, function(err, movie){
        if (err) throw err;

        res.json(movie);
    });
});


router.delete('/:id', function(req, res){
    var collection = db.get('posts');
    collection.remove({ _id: req.params.id }, function(err, movie){
        if (err) throw err;

        res.json(movie);
    });
});

router.post('/', function(req, res){
    var collection = db.get('posts');
    collection.insert({
        title: req.body.title,
        director: req.body.director,
        country: req.body.country
    }, function(err, movie){
        if (err) throw err;

        res.json(movie);
    });
});

module.exports = router;

