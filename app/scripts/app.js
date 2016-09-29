/*jslint node: true */
'use strict';

angular.module('littleHeraclesApp', ['ui.router','ngResource','ngDialog'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                        controller  : 'HomeController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html'
                    }
                }
            })
            .state('app.register', {
                url:'register',
                views: {
                    'content@': {
                        templateUrl : 'views/users/register.html',
                        controller  : 'HeaderController'
                    }
                }
            })
            .state('app.registerClubOfficial', {
                url:'register/clubOfficial',
                views: {
                    'content@': {
                        templateUrl : 'views/users/registerCO.html',
                        controller  : 'RegisterController'
                    }
                }
            })
            .state('app.registerAgeManager', {
                url:'register/ageManager',
                views: {
                    'content@': {
                        templateUrl : 'views/users/registerAM.html',
                        controller  : 'RegisterController'
                    }
                }
            })
            .state('app.registerParent', {
                url:'register/parent',
                views: {
                    'content@': {
                        templateUrl : 'views/users/registerP.html',
                        controller  : 'RegisterController'
                    }
                }
            })
            .state('app.registerAthlete', {
                url:'register/athlete',
                views: {
                    'content@': {
                        templateUrl : 'views/users/registerA.html',
                        controller  : 'RegisterController'
                    }
                }
            })
            .state('app.registerEdit', {
                url:'register/edit',
                views: {
                    'content@': {
                        templateUrl : 'views/users/editUser.html',
                        controller  : 'RegisterController'
                    }
                }
            })
            .state('app.competitions', {
                url:'competitions',
                views: {
                    'content@': {
                        templateUrl : 'views/competitions/competitions.html',
                        controller  : 'CompetitionController'
                    },
                    'competition': {
                        templateUrl : 'views/competitions/competition.html',
                        controller  : 'CompetitionController'
                    }
                }
            })
            .state('app.competitionsCreate', {
                url:'competitions/create',
                views: {
                    'content@': {
                        templateUrl : 'views/competitions/createCompetition.html',
                        controller  : 'CompetitionController'
                    }
                }
            })
            .state('app.competitionsEdit', {
                url:'competitions/edit',
                views: {
                    'content@': {
                        templateUrl : 'views/competitions/editCompetition.html',
                        controller  : 'CompetitionController'
                    }
                }
            })
            .state('app.competition', {
                url:'competitions/competition/:compId',
                views: {
                    'content@': {
                        templateUrl : 'views/competitions/competition.html',
                        controller  : 'CompetitionController'
                    }
                }
            })
            ;
    
        $urlRouterProvider.otherwise('/');
    })
;
