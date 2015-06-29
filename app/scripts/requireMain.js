'use strict';

require.config({
    baseUrl: 'scripts',
    paths: {
        jquery: 'jquery',
        angular: 'angular',
        bootstrap: 'bootstrap'
    },
    shim: {
        'jquery': {
            exports: 'jquery'
        },
        'angular': {
            exports: 'angular'
        },
        'bootstrap': {
            deps: ['jquery'],
            exports: 'bootstrap'
        }
    }
});

require(['angular', 'bootstrap', 'modules/progressModule', 'factories/progressFactory', 
    'controllers/progressController', 'directives/progressDirective'], function (angular) {
    angular.element(document).ready(function() {
        angular.bootstrap(document.getElementById('angularProgress'), ['progressModule']);
    });
});
