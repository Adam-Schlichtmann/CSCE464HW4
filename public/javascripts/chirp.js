var app = angular.module('chirpApp', ['ngResource','ngRoute']);


app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/login', {
            templateUrl: 'partials/login-form.html',
            controller: 'loginCtrl'
        })
        .when('/register', {
            templateUrl: 'partials/register-form.html',
            controller: 'registerCtrl'
        })
        .when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/favorite/:id', {
            templateUrl: 'partials/home.html',
            controller: 'favoriteCtrl'
        })
        .when('/add-chirp', {
            templateUrl: 'partials/post-form.html',
            controller: 'AddChirpCtrl'
        })
        .when('/newFollow/:id', {
            templateUrl: 'partials/addingFollower.html',
            controller: 'newFollowerCtrl'
        })
        .when('/chirp/:id', {
            templateUrl: 'partials/update-form.html',
            controller: 'EditChirpCtrl'
        })
        .when('/chirp/delete/:id', {
            templateUrl: 'partials/post-delete.html',
            controller: 'DeleteChirpCtrl'
        })
        .otherwise({
            redirectTo: '/login'
        });
}]);

app.controller('HomeCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Post = $resource('/api/posts');
         
        Post.query(function(posts){
            console.log(posts);
            $scope.posts = posts;
        });

        // gets three random users
        var User = $resource('/api/users');
        User.query( function(userl){
            for (var i = 0; i < userl.length; i++){
                if (userl[i]._id == localStorage['id']){
                    var user = userl[i];
                    $scope.profileName = user.userName;
                    $scope.profileID= user._id;
                    $scope.followers = user.following.length;
                    $scope.favs = user.favorites;
                    userl.splice(i,1);
                }
            }
            $scope.user = user;
            for (var j = 0; j < user.following.length; j++){
                for (var k = 0; k < userl.length; k++){
                    if (user.following[j] == userl[k]._id){
                        userl.splice(k,1);
                    }
                }
            }
            while (userl.length > 3){
                var x = Math.floor(Math.random() * userl.length);
                userl.splice(x,1);
            }
            $scope.newUsers = userl;
        });

        $scope.save = function(){
            console.log("creating new post");
            var Chirp = $resource('/api/posts/'+localStorage['id']);
            Chirp.save($scope.posts, function(){
                $location.path('/home');
            });
        };

        $scope.favorite = function(postID){
            $scope.currentID = localStorage['id'];
            console.log(postID);

            var Poster = $resource('/api/posts/:id');
            Poster.get({ id: postID }, function(post){
                $scope.postToUpdate = post;
            });
            console.log($scope.postToUpdate);
            var Post = $resource('/api/posts/addFav/:id', { id:  postID}, {
                update: { method: 'PUT' }
            });

            // Has to wait so that the post can be gotten and passed in
            setTimeout(function(){
                Post.update($scope.postToUpdate, function(){
                    
                });
    
                var Chirp = $resource('/api/users/favorite/:id', { id:  postID}, {
                    update: { method: 'PUT' }
                });
            
                Chirp.update($scope.user, function(){
                    $location.path('/home');
                });

                var P = $resource('/api/posts');

                P.query(function(posts){
                    console.log(posts);
                    $scope.posts = posts;
                });
            }, 250);
        }

    }]
);

app.controller('registerCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location){
        $scope.save = function(){
            var Chirp = $resource('/api/users');
            Chirp.save($scope.users, function(){
                $location.path('/login');
            });
        };
}]);

app.controller('loginCtrl', ['$scope', '$location', '$resource',
    function($scope, $location, $resource){
        var User = $resource('/api/users/:userName',  { userName: '@userName' });
        $scope.save = function(userName,password){
            User.query( function(user){
                var verified = false;
                for (var i = 0; i < user.length; i++){
                    if (user[i].userName == userName){
                        localStorage['id'] = user[i]._id;
                        console.log('User has been saved in the cache');
                        verified = true;
                    }
                }
                if(verified){
                    $location.path('/home');
                } else {
                    $location.path('/');
                }
                

                
            });
    };
}]);

app.controller('EditChirpCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        
        var Chirp = $resource('/api/posts/:id', { id: '@_id' }, {
            update: { method: 'PUT' }
        });

        Chirp.get({ id: $routeParams.id }, function(posts){
            $scope.posts = posts;
        });
        
        $scope.save = function(){
            Chirp.update($scope.posts, function(){
                $location.path('/home');
            });
        }
    }]
);


app.controller('newFollowerCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        $scope.currentID = localStorage['id'];
        $scope.newID = $routeParams.id;
        
        var Chirp = $resource('/api/users/:id', { id: $scope.newID }, {
            update: { method: 'PUT' }
        });

        Chirp.get({ id: $scope.currentID }, function(user){
            $scope.user = user;
            
        });

        Chirp.get({ id: $scope.newID }, function(newUser){
            $scope.newUser = newUser;
            
        });
        $scope.save = function(){
            Chirp.update($scope.user, function(){
                $location.path('/home');
            });
        }
    }]
);

app.controller('favoriteCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        $scope.currentID = localStorage['id'];
        
        var Chirp = $resource('/api/users/favorite/:id', { id: $scope.currentID }, {
            update: { method: 'PUT' }
        });

        var user = $resource('/api/users/:id', { id: $scope.currentID }, {
            update: { method: 'PUT' }
        });
        user.get({ id: $scope.currentID }, function(user){
            $scope.user = user;
            
        });

       
        Chirp.update($scope.user, function(){
            $location.path('/home');
        });
        
    }]
);


app.controller('DeleteChirpCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Chirp = $resource('/api/posts/:id');
        Chirp.get({ id: $routeParams.id }, function(post){
            $scope.post = post;
        })
    
        $scope.delete = function(){
            Chirp.delete({ id: $routeParams.id }, function(posts){
                $location.path('/home');
            });
        }
}]);
