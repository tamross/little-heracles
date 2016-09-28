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
                        templateUrl : 'views/register.html',
                        controller  : 'HeaderController'
                    }
                }

            })
            .state('app.registerClubOfficial', {
                url:'register/clubOfficial',
                views: {
                    'content@': {
                        templateUrl : 'views/registerCO.html',
                        controller  : 'RegisterController'
                    }
                }

            })
            .state('app.registerAgeManager', {
                url:'/register/ageManager',
                views: {
                    'content@': {
                        templateUrl : 'views/registerAM.html',
                        controller  : 'RegisterController'
                    }
                }

            })
            .state('app.registerParent', {
                url:'/register/parent',
                views: {
                    'content@': {
                        templateUrl : 'views/registerP.html',
                        controller  : 'RegisterController'
                    }
                }

            })
            .state('app.registerAthlete', {
                url:'/register/athlete',
                views: {
                    'content@': {
                        templateUrl : 'views/registerA.html',
                        controller  : 'RegisterController'
                    }
                }

            })
            .state('app.registerEdit', {
                url:'/register/edit',
                views: {
                    'content@': {
                        templateUrl : 'views/editUser.html',
                        controller  : 'RegisterController'
                    }
                }

            })
            ;
    
        $urlRouterProvider.otherwise('/');
    })
;
