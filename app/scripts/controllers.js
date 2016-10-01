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

.controller('CompetitionController', ['$scope', '$stateParams', '$location', 'ngDialog', '$localStorage', '$moment', 'AuthFactory', 'CompFactory', 'EventFactory', 'AgeGroupFactory',
    function ($scope, $stateParams, $location, ngDialog, $localStorage, $moment, AuthFactory, CompFactory, EventFactory, AgeGroupFactory) {

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

    // The next upcoming competition
    $scope.nextComp = {};
    CompFactory.getCompetitionByDate(new Date()).get(
            function(response) {
                console.log("got next competition");
                $scope.nextComp = response;
                $scope.showNextComp = true;
            },
            function(response) {
                console.log("Error: " + response.status + " " + response.statusText);
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );

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
                CompFactory.competitions().save(comp,
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
    };

}])

.controller('ResultsController', ['$scope', '$stateParams', '$location', 'ngDialog', '$localStorage', 'AuthFactory', 'UserFactory', 'AgeGroupFactory', 'CompFactory', 'ResultFactory',
    function ($scope, $stateParams, $location, ngDialog, $localStorage, AuthFactory, UserFactory, AgeGroupFactory, CompFactory, ResultFactory) {
    $scope.loggedIn = false;
    $scope.username = '';
    $scope.kind = '';
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
        $scope.kind = AuthFactory.getKind();
    }

    $scope.showCreationSuccessful = false;
    $scope.createdResultId = ''; // This will contain the id of the last successfully created result so we can link to view it.

    $scope.attempts = {};

    $scope.validAgeGroups = AgeGroupFactory.getValidAgeGroups();
    $scope.currentAgeGroup = "";
    $scope.currentAthlete = {};
    $scope.athletes = [];

    $scope.currentCompetition = {};
    $scope.competitions = CompFactory.competitions().query(
            function(response) {
                console.log("got competitions " + response);
                $scope.competitions = response;
            },
            function(response) {
                console.log("Error: " + response.status + " " + response.statusText);
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );

    $scope.clubRecords = [];
    $scope.clubRecords = ResultFactory.clubRecords().query(
        function(response) {
                $scope.clubRecords = response;
            },
            function(response) {
                console.log("Error: " + response.status + " " + response.statusText);
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );

    $scope.getAthletesInAgeGroup = function(ageGroup) {
        console.log('getting athletes in ' + ageGroup);
            UserFactory.getAthletesInAgeGroup(ageGroup).query(
                function(response) {
                    $scope.athletes = response;
                },
                function(response) {
                    console.log("Error: " + response.status + " " + response.statusText);
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );
    };

    // After a competition is created we use the ID to retreive it and view it.
    $scope.resultId = $stateParams.resultId;
    $scope.resultToShow = {};
    if ($scope.resultId) {
        ResultFactory.getResult($scope.resultId).get(
            function(response) {
                $scope.resultToShow = response;
            },
            function(response) {
                console.log("Error: " + response.status + " " + response.statusText);
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
    };

        $scope.saveResult = function() {
        console.log("Saving result ");
        var max = Math.max($scope.attempts.attempt1, $scope.attempts.attempt2, $scope.attempts.attempt3);
        var result = {
            "athlete": $scope.currentAthlete._id,
            "event": $scope.currentEvent._id,
            "competition": $scope.currentCompetition._id,
            "distances": [$scope.attempts.attempt1, $scope.attempts.attempt2, $scope.attempts.attempt3],
            "bestDistance": max
        };

        //See if it is a personal bext for the athlete
        var existingPb = {"eventName": $scope.currentEvent.name, "distance":0};
        if ($scope.currentAthlete.personalBests == null) {
            // Handle accidental nulls in the database
            $scope.currentAthlete.personalBests = [];
        }
        for (var i=0; i < $scope.currentAthlete.personalBests.length; i++) {
            var pb = $scope.currentAthlete.personalBests[i];
            if (pb.eventName == $scope.currentEvent.name) {
                console.log("PB for " + pb.eventName + " is " + pb.distance);
                existingPb = {"eventName": pb.eventName, "distance": pb.distance};
            };
        }
        if (max > existingPb.distance) {
            var message = '\
                  <div class="ngdialog-message">\
                  <div><p>This is a new personal best for ' + $scope.currentAthlete.name + '!</p>\
                  <p>Previous PB: ' + existingPb + ', new PB: ' + max + '</p></div>';
                  ngDialog.openConfirm({ template: message, plain: 'true'});
        } else if (max == existingPb.distance) {
            var message = '\
                  <div class="ngdialog-message">\
                  <div><p>' + $scope.currentAthlete.name + ' has matched their personal best!</p></div>';
                  ngDialog.openConfirm({ template: message, plain: 'true'});
        }

        ResultFactory.results().save(result,
             function(response) {
                $scope.createdResultId = response.id;
                console.log("$scope.createdResultId " + $scope.createdResultId);
                $scope.showCreationSuccessful = true;

                // If it's a new PB replace the old PB on the user
                    if (max > existingPb.distance) {
                        console.log("should be updating the list of pbs");
                        if (existingPb.distance == 0) {
                            // It's a brand new event PB
                            existingPb.distance = max;
                            $scope.currentAthlete.personalBests.push(existingPb);
                        } else {
                            // Need to update the existing one 
                            for (var i=0; i < $scope.currentAthlete.personalBests.length; i++) {
                                var pb = $scope.currentAthlete.personalBests[i];
                                if (pb.eventName == $scope.currentEvent.name) {
                                    $scope.currentAthlete.personalBests[i].distance = max;
                                }
                            }
                        }
                        var pbsToSave = {"personalBests": $scope.currentAthlete.personalBests};
                        console.log("athlete id " + $scope.currentAthlete._id);
                        UserFactory.personalBests($scope.currentAthlete._id).save(pbsToSave,
                             function(response) {
                                console.log("Success saving PBs");
                             },
                             function(response){
                              
                                var message = '\
                                  <div class="ngdialog-message">\
                                  <div><h3>Saving Personal Bests Unsuccessful</h3></div>' +
                                    '<div><p>' +  response.data.err.message + 
                                    '</p><p>' + response.data.err.name + '</p></div>';
                                  ngDialog.openConfirm({ template: message, plain: 'true'});
                             }
                        );
                    }


                // Clear the result
                $scope.attempts = {};
                $scope.currentAthlete = {};
             },
             function(response){
              
                var message = '\
                  <div class="ngdialog-message">\
                  <div><h3>Competition Creation Unsuccessful</h3></div>' +
                    '<div><p>' +  response.data.err.message + 
                    '</p><p>' + response.data.err.name + '</p></div>';
                  ngDialog.openConfirm({ template: message, plain: 'true'});
             });
    };

}])    
;