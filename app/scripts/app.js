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
            .state('app.registerClubOfficial', {
                url:'register/clubOfficial',
                views: {
                    'content@': {
                        templateUrl : 'views/registerCO.html',
                        controller  : 'RegisterController'
                    }
                }

            })
            .state('app.register.ageManager', {
                url:'/register/ageManager',
                views: {
                    'content@': {
                        templateUrl : 'views/registerAM.html',
                        controller  : 'RegisterController'
                    }
                }

            })
            .state('app.register.parent', {
                url:'/register/parent',
                views: {
                    'content@': {
                        templateUrl : 'views/registerP.html',
                        controller  : 'RegisterController'
                    }
                }

            })
            .state('app.register.athlete', {
                url:'/register/athlete',
                views: {
                    'content@': {
                        templateUrl : 'views/registerA.html',
                        controller  : 'RegisterController'
                    }
                }

            })
            .state('app.register.edit', {
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
