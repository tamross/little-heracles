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
    $scope.showRegistrationSuccessful = false;

    $scope.doRegister = function(kind) {
        $scope.registration.kind = kind;
        AuthFactory.register($scope.registration);
        $scope.showRegistrationSuccessful = true;
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

.controller('CompetitionController', ['$scope', '$stateParams', '$location', 'ngDialog', '$localStorage', 'AuthFactory', 'CompFactory', 'EventFactory', 'AgeGroupFactory',
    function ($scope, $stateParams, $location, ngDialog, $localStorage, AuthFactory, CompFactory, EventFactory, AgeGroupFactory) {

    $scope.loggedIn = false;
    $scope.username = '';
    $scope.kind = '';
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
        $scope.kind = AuthFactory.getKind();
    }

    // After a competition is created we use the ID to retreive it and view it.
    $scope.compId = $stateParams.compId;
    $scope.compToShow = {};
    if ($scope.compId) {
        CompFactory.getCompetition($scope.compId).get(
            function(response) {
                $scope.compToShow = response;
            },
            function(response) {
                console.log("Error: " + response.status + " " + response.statusText);
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
    }

    $scope.validAgeGroups = AgeGroupFactory.getValidAgeGroups();

    $scope.events = EventFactory.getEvents().query(
        function(response) {
            $scope.events = response;
        },
        function(response) {
            console.log("Error: " + response.status + " " + response.statusText);
            $scope.message = "Error: " + response.status + " " + response.statusText;
        }
    );

    $scope.createCompetition = function() {
        console.log("creating comp");

        var validationMessage = '\
                    <div class="ngdialog-message">\
                    <div><h3>Competition Creation Unsuccessful</h3></div>' +
                      '<p>You must select some events.</p>';

        var comp = {date: $scope.competition.date, events: []};
        if($scope.competition.events) {
            for (var i=0; i < $scope.validAgeGroups.length; i++) {
                var ageGroup = $scope.validAgeGroups[i];
                if($scope.competition.events[ageGroup]) {
                    comp.events = comp.events.concat($scope.competition.events[ageGroup]);
                }
            }
            if (comp.events != []) {
                CompFactory.competition().save(comp,
                     function(response) {
                        $scope.compId = response.id;
                        // Display the competition just created
                        $location.path('/competitions/competition/' + $scope.compId);
                     },
                     function(response){
                      
                        var message = '\
                          <div class="ngdialog-message">\
                          <div><h3>Competition Creation Unsuccessful</h3></div>' +
                            '<div><p>' +  response.data.err.message + 
                            '</p><p>' + response.data.err.name + '</p></div>';
                          ngDialog.openConfirm({ template: message, plain: 'true'});
                     }
                    );
            } else {
                ngDialog.openConfirm({ template: validationMessage, plain: 'true'});
            }
        } else {
            ngDialog.openConfirm({ template: validationMessage, plain: 'true'});
        }
    }

}])
;