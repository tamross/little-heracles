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
            // .state('app.clubOfficial', {
            //     url:'/',
            //     views: {
            //         'header': {
            //             templateUrl : 'views/COheader.html',
            //             controller  : 'HeaderController'
            //         },
            //         'content': {
            //             templateUrl : 'views/home.html',
            //             controller  : 'HomeController'
            //         },
            //         'footer': {
            //             templateUrl : 'views/footer.html'
            //         }
            //     }
            // })
            .state('app.clubOfficial.register', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/COheader.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'views/register.html',
                        controller  : 'HomeController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html'
                    }
                }
            })

            // .state('app.ap', {
            //     url:'/',
            //     views: {
            //         'header': {
            //             templateUrl : 'views/APheader.html',
            //             controller  : 'HeaderController'
            //         },
            //         'content': {
            //             templateUrl : 'views/home.html',
            //             controller  : 'HomeController'
            //         },
            //         'footer': {
            //             templateUrl : 'views/footer.html'
            //         }
            //     }
            // });
            ;
    
        $urlRouterProvider.otherwise('/');
    })
;
