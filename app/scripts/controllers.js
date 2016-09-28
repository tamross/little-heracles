/*jslint node: true */
'use strict';

angular.module('littleHeraclesApp')

.controller('HomeController', ['$scope', function ($scope) {

    $scope.message = "Loading ...";
}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData);

        ngDialog.close();

    };
            
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };
    
}])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

    $scope.loggedIn = false;
    $scope.username = '';
    $scope.kind = '';
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
        $scope.kind = AuthFactory.getKind();
    }
        
    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
    };
    
    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
        $scope.kind = '';
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
        $scope.kind = AuthFactory.getKind();
    });
    
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };
    
}])

.controller('RegisterController', ['$scope', '$location', 'ngDialog', '$localStorage', 'AuthFactory', 'UserFactory', 'AgeGroupFactory',
    function ($scope, $location, ngDialog, $localStorage, AuthFactory, UserFactory, AgeGroupFactory) {
    
    $scope.validAgeGroups = AgeGroupFactory.getValidAgeGroups();
    $scope.showParents = false;
    $scope.showChildren = false;

    $scope.doRegister = function(kind) {
        $scope.registration.kind = kind;
        AuthFactory.register($scope.registration);
        $location.path('/register');
    };

    $scope.getParents = function() {
        if (!$scope.parents) {
            UserFactory.getParents().query(
                function(response) {
                    $scope.parents = response;
                },
                function(response) {
                    console.log("Error: " + response.status + " " + response.statusText);
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );
        }
    };

    $scope.getAthletesInAgeGroup = function(ageGroup) {
        console.log('getting athletes in ' + ageGroup);
            UserFactory.getAthletesInAgeGroup(ageGroup).query(
                function(response) {
                    $scope.children = response;
                },
                function(response) {
                    console.log("Error: " + response.status + " " + response.statusText);
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );
    };
    
}])

.controller('CompetitionController', ['$scope', '$location', 'ngDialog', '$localStorage', 'AuthFactory', 'CompFactory', 'EventFactory', 'AgeGroupFactory',
    function ($scope, $location, ngDialog, $localStorage, AuthFactory, CompFactory, EventFactory, AgeGroupFactory) {

    $scope.loggedIn = false;
    $scope.username = '';
    $scope.kind = '';
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
        $scope.kind = AuthFactory.getKind();
    }

    $scope.validAgeGroups = AgeGroupFactory.getValidAgeGroups();

    $scope.getEventsForAgeGroup = function(ageGroup) {
        console.log('getting events in ' + ageGroup);
        EventFactory.getEventsForAgeGroup(ageGroup).query(
            function(response) {
                $scope.events = response;
            },
            function(response) {
                console.log("Error: " + response.status + " " + response.statusText);
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
    };

}])
;