/*jslint node: true */
'use strict';

angular.module('littleHeraclesApp', ['ui.router','ngResource','ngDialog'/*, 'angular-momentjs'*/])
.config(function($stateProvider, $urlRouterProvider/*, $momentProvider*/) {
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
            .state('app.results', {
                url:'results/results',
                views: {
                    'content@': {
                        templateUrl : 'views/results/results.html',
                        controller  : 'PBController'
                    }
                }
            })
            .state('app.resultsEntry', {
                url:'results/entry',
                views: {
                    'content@': {
                        templateUrl : 'views/results/resultsEntry.html',
                        controller  : 'ResultsController'
                    }
                }
            })
            .state('app.viewResult', {
                url:'results/view/:resultId',
                views: {
                    'content@': {
                        templateUrl : 'views/results/viewResult.html',
                        controller  : 'ResultsController'
                    }
                }
            })
            .state('app.about', {
                url:'about',
                views: {
                    'content@': {
                        templateUrl : 'views/about.html',
                        controller  : 'HomeController'
                    }
                }
            })
            .state('app.contact', {
                url:'contact',
                views: {
                    'content@': {
                        templateUrl : 'views/contact.html',
                        controller  : 'HomeController'
                    }
                }
            })
            ;
    
        $urlRouterProvider.otherwise('/');

        // $momentProvider.asyncLoading(false).scriptUrl('//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min.js');
    })
;
