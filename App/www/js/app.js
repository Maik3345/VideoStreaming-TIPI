// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ionic.service.core', 'ionic.service.push','ngCordova'])

.run(function($ionicPlatform,$state) {
  $ionicPlatform.ready(function() {


    //
    cordova.plugins.autoStart.enable();
    //
  });
})



.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.conect', {
    url: '/conect',
    views: {
      'tab-conect': {
        templateUrl: 'templates/tab-conect.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.listen', {
    url: '/listen',
    views: {
      'tab-listen': {
        templateUrl: 'templates/tab-listen.html',
        controller: 'DashCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/listen');

});
