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

app.controller('HomeCtrl', ['$scope', '$resource', 
    function($scope, $resource){
        var Post = $resource('/api/posts');
         
        Post.query(function(posts){
            console.log(posts);
            $scope.posts = posts;
        });
        // gets three random users
        var User = $resource('/api/users');
        User.query( function(user){
            for (var i = 0; i < user.length; i++){
                if (user[i]._id == localStorage['id']){
                    var currentUser = user[i];
                    $scope.profileName = currentUser.userName;
                    $scope.followers = user[i].following.length;
                    user.splice(i,1);
                }
            }
            for (var j = 0; j < currentUser.following.length; j++){
                for (var k = 0; k < user.length; k++){
                    if (currentUser.following[j] == user[k]._id){
                        user.splice(j,1);
                    }
                }
            }
            while (user.length > 3){
                var x = Math.floor(Math.random() * user.length);
                user.splice(x,1);
            }
            $scope.newUsers = user;
        });

    }]
);

app.controller('AddChirpCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location){
        $scope.save = function(){
            var Chirp = $resource('/api/posts');
            Chirp.save($scope.posts, function(){
                $location.path('/home');
            });
        };
}]);

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
                for (var i = 0; i < user.length; i++){
                    if (user[i].userName == userName){
                        localStorage['id'] = user[i]._id;
                        console.log('User has been saved in the cache');
                    }
                }
                $location.path('/home');
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
        var Chirp = $resource('/api/users/:id', { id: '@_id' }, {
            update: { method: 'PUT' }
        });

        Chirp.get({ id: $scope.currentID }, function(user){
            $scope.user = user;
            console.log(user._id);
            console.log(user.following);
            
        });
        //$scope.followers = $scope.user.following;
        
        $scope.save = function(){
            Chirp.update($scope.user, function(){
                $location.path('/home');
            });
        }
    }]
);

// app.controller('newFollowerCtrl', ['$scope', '$resource', '$location', '$routeParams',
//     function($scope, $resource, $location, $routeParams){
//         $scope.currentID = localStorage['id'];
//         console.log($routeParams.id);	
//         console.log($scope.currentID);
//         var User = $resource('/api/users/:id', { id: '@_id' }, {
//             update: { method: 'PUT' }
//         });
//         console.log("Here 1");
//         User.get({ id: $scope.currentID }, function(current){
//             console.log(current._id);
//             $scope.current = current._id;
//             User.update($scope.current, function(){
//                 $location.path('/home');
//             });
//         });
        
//         console.log("Here 2");
//         $scope.save = function(){
//             User.update($scope.current, function(){
//                 $location.path('/home');
//             });
//         }
        
//         console.log("Here 3");
        
//     }]
// );

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
