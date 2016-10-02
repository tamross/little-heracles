/*jslint node: true */
'use strict';

angular.module('littleHeraclesApp')
 .constant("baseURL", "https://localhost:3443/")
//.constant("baseURL", "https://little-heracles-server.au-syd.mybluemix.net/")
.factory('$localStorage', ['$window', function ($window) {
    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    };
}])

.factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog',
  function($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog) {
    
    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var username = '';
    var kind = '';
    var authToken = undefined;
    

  function loadUserCredentials() {
    var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
    if (credentials.username !== undefined) {
      useCredentials(credentials);
    }
  }
 
  function storeUserCredentials(credentials) {
    $localStorage.storeObject(TOKEN_KEY, credentials);
    useCredentials(credentials);
  }
 
  function useCredentials(credentials) {
    isAuthenticated = true;
    username = credentials.username;
    authToken = credentials.token;
    kind = credentials.kind;
 
    // Set the token as header for your requests!
    $http.defaults.headers.common['x-access-token'] = authToken;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    kind = '';
    isAuthenticated = false;
    $http.defaults.headers.common['x-access-token'] = authToken;
    $localStorage.remove(TOKEN_KEY);
  }
     
    authFac.login = function(loginData) {
        console.log("logging in");
        $resource(baseURL + "users/login")
        .save(loginData,
           function(response) {
              storeUserCredentials({username:loginData.username, token: response.token, kind: response.kind});
              $rootScope.$broadcast('login:Successful');
              console.log("login successful");
           },
           function(response){
              isAuthenticated = false;
            
              var message = '<div class="ngdialog-message">' +
                '<div><h3>Login Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.err.message + '</p><p>' +
                    response.data.err.name + '</p></div>' +
                '<div class="ngdialog-buttons">' +
                    '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>' +
                '</div>';
            
                ngDialog.openConfirm({ template: message, plain: 'true'});
           }
        
        );

    };
    
    authFac.logout = function() {
        $resource(baseURL + "users/logout").get(function(response){
        });
        destroyUserCredentials();
        $rootScope.$broadcast('logout');
    };
    
    authFac.register = function(registerData) {
        
        $resource(baseURL + "users")
        .save(registerData,
           function(response) {
           
              $rootScope.$broadcast('registration:Successful');
           },
           function(response){
            
              var message = '<div class="ngdialog-message">' +
                '<div><h3>Registration Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.err.message + 
                  '</p><p>' + response.data.err.name + '</p></div>';

                ngDialog.openConfirm({ template: message, plain: 'true'});

           }
        
        );
    };
    
    authFac.isAuthenticated = function() {
        return isAuthenticated;
    };
    
    authFac.getUsername = function() {
        return username;  
    };

    authFac.getKind = function() {
        return kind;  
    };

    loadUserCredentials();
    
    return authFac;
    
}])

.factory('AgeGroupFactory', [function () {
  var ageGroupFac = {};

  ageGroupFac.getValidAgeGroups = function() {
    return ['u6', 'u7', 'u8', 'u9', 'u10', 'u11', 'u12', 'u13', 'u14', 'u15', 'u16', 'u17'];
  };

  return ageGroupFac;
}])

.factory('UserFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog',
  function($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog){
    var userFac = {};

    userFac.getParents = function() {
      return $resource(baseURL + "users/parents", null);
    };

    userFac.getAthletesInAgeGroup = function(ageGroup) {
      return $resource(baseURL + "users/athletes/ageGroup/" + ageGroup, null);
    };

    userFac.personalBests = function(athleteId) {
      return $resource(baseURL + "users/athletes/personalBests/" + athleteId, null);
    };

    return userFac;
}])

.factory('CompFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog',
  function($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog){
    var compFac = {};

    compFac.competitions = function() {
      return $resource(baseURL + "competitions", null);
    };

    compFac.getCompetition = function(compId) {
      return $resource(baseURL + "competitions/" + compId, null);
    };

    compFac.getCompetitionByDate = function(date) {
      return $resource(baseURL + "competitions/date/" + date, null);
    };

    return compFac;
}])

.factory('EventFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog',
  function($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog){
    var eventFac = {};

    eventFac.getEvents = function() {
      return $resource(baseURL + "events", null);
    };

    eventFac.getEventsForAgeGroup = function(ageGroup) {
        return $resource(baseURL + "events/ageGroup/" + ageGroup, null);
    };

    return eventFac;
}])

.factory('ResultFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog',
  function($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog){
    var resultFac = {};

    resultFac.results = function() {
      return $resource(baseURL + "results", null);
    };

    resultFac.clubRecords = function() {
      return $resource(baseURL + "clubRecords", null, {'update':{method:'PUT' }});
    };

    resultFac.getResult = function(resultId) {
      return $resource(baseURL + "results/" + resultId, null);
    };

    return resultFac;
}])

;