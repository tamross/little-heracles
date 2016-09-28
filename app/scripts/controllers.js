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

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', 'UserFactory', 
    function ($scope, ngDialog, $localStorage, AuthFactory, UserFactory) {
    
    $scope.validAgeGroups = ['u6', 'u7', 'u8', 'u9', 'u10', 'u11', 'u12', 'u13', 'u14', 'u15', 'u16', 'u17'];
    $scope.showParents = false;
    $scope.showChildren = false;

    $scope.doRegister = function(kind) {
        $scope.registration.kind = kind;
        AuthFactory.register($scope.registration);
    };

    $scope.getParents = function() {
        if (!$scope.parents) {
            UserFactory.getParents().query(
                function(response) {
                    $scope.parents = response;
                    return $scope.parents;
                },
                function(response) {
                    console.log("Error: " + response.status + " " + response.statusText);
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                    return $scope.message;
                }
            );
        }
    };

    $scope.getAthletesInAgeGroup = function(ageGroup) {
        console.log('getting athletes in ' + ageGroup);
            UserFactory.getAthletesInAgeGroup(ageGroup).query(
                function(response) {
                    console.log('children are ' + response);
                    $scope.children = response;
                    return $scope.children;
                },
                function(response) {
                    console.log("Error: " + response.status + " " + response.statusText);
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                    return $scope.message;
                }
            );
    };
    
}])
;