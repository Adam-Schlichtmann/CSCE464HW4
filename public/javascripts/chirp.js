var app = angular.module('chirpApp', ['ngResource','ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/add-chirp', {
            templateUrl: 'partials/movie-form.html',
            controller: 'AddChirpCtrl'
        })
        .when('/chirp/:id', {
            templateUrl: 'partials/movie-form.html',
            controller: 'EditMovieCtrl'
        })
        .when('/chirp/delete/:id', {
            templateUrl: 'partials/movie-delete.html',
            controller: 'DeleteMovieCtrl'
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
            var Movies = $resource('/api/chirps');
            Movies.save($scope.movie, function(){
                $location.path('/');
            });
        };
}]);


app.controller('EditChirpCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){	
        var Movies = $resource('/api/chirps/:id', { id: '@_id' }, {
            update: { method: 'PUT' }
        });

        Movies.get({ id: $routeParams.id }, function(movie){
            $scope.movie = movie;
        });

        $scope.save = function(){
            Movies.update($scope.movie, function(){
                $location.path('/');
            });
        }
    }]);


app.controller('DeleteChirpCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Movies = $resource('/api/chirps/:id');
        Movies.get({ id: $routeParams.id }, function(movie){
            $scope.movie = movie;
        })
    
        $scope.delete = function(){
            Movies.delete({ id: $routeParams.id }, function(movie){
                $location.path('/');
            });
        }
}]);
