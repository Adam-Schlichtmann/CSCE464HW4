var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
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

router.put('/addFav/:id', function(req, res){
    var collection = db.get('posts');
    var favs = req.body.favorited;
    favs++;
    console.log(favs);
    console.log(req.params.id);
    collection.update({
        _id: req.params.id
    },
    { $set: {
        favorited: favs
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

router.post('/reply/:userID', function(req, res){
    console.log(req);
    var collection = db.get('posts');
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    var authorTemp = req.params.userID;
    var mentionsList = [];
    var post = req.body.content;
    var replies = req.body.postID;
    for(var i = 0; i <post.length; i++){
        if(post[i] == '@'){
            var j = i;
            while(post[j] != ' ' && j < post.length){
                j += 1;
            }
            mentionsList.push(post.substring(i+1,j));

        }
    }
   
    collection.insert({
        content: req.body.content,
        replies: [],
        date: dateTime,
        author: authorTemp,
        mentions: mentionsList,
        favorited: 0
    }, function(err, movie){
        console.log(err);
        if (err) throw err;

        res.json(movie);
    });
});


router.post('/:userID', function(req, res){
    var collection = db.get('posts');
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    var authorTemp = req.params.userID;
    var mentionsList = [];
    var post = req.body.content;

    for(var i = 0; i <post.length; i++){
        if(post[i] == '@'){
            var j = i;
            while(post[j] != ' ' && j < post.length){
                j += 1;
            }
            mentionsList.push(post.substring(i+1,j));

        }
    }

    console.log(req.params.userID);
   
    collection.insert({
        content: req.body.content,
        replies: [],
        date: dateTime,
        author: authorTemp,
        mentions: mentionsList,
        favorited: 0
    }, function(err, movie){
        console.log(err);
        if (err) throw err;

        res.json(movie);
    });
});

module.exports = router;

