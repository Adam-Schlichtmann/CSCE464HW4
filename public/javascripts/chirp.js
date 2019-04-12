var app = angular.module('chirpApp', ['ngResource','ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
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
            redirectTo: '/'
        });
}]);

app.controller('HomeCtrl', ['$scope', '$resource', 
    function($scope, $resource){
        var Chirp = $resource('/api/posts');
        Chirp.query(function(posts){
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
