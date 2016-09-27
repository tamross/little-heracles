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
        console.log("scope kind is" + $scope.kind);
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
        
    // $rootScope.$on('registration:Successful', function () {
    //     $scope.loggedIn = AuthFactory.isAuthenticated();
    //     $scope.username = AuthFactory.getUsername();
    // });
    
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };
    
}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.register={};
    $scope.loginData={};
    
    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration);
        
        ngDialog.close();

    };
}])
;