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
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/add-chirp', {
            templateUrl: 'partials/post-form.html',
            controller: 'AddChirpCtrl'
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
        var User = $resource('/api/posts');
        
        User.query(function(posts){
            console.log(posts);
            $scope.posts = posts;

    });
}]);


app.controller('AddChirpCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location){
        $scope.save = function(){
            var Chirp = $resource('/api/posts');
            Chirp.save($scope.posts, function(){
                $location.path('/');
            });
        };
}]);

app.controller('registerCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location){
        $scope.save = function(){
            var Chirp = $resource('/api/users');
            Chirp.save($scope.users, function(){
                $location.path('/');
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
                $location.path('/');
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
                $location.path('/');
            });
        }
    }]);


app.controller('DeleteChirpCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Chirp = $resource('/api/posts/:id');
        Chirp.get({ id: $routeParams.id }, function(post){
            $scope.post = post;
        })
    
        $scope.delete = function(){
            Chirp.delete({ id: $routeParams.id }, function(posts){
                $location.path('/');
            });
        }
}]);
