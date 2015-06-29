define(['angular', 'factories/progressFactory', 'controllers/progressController', 'directives/progressDirective'], function (angular) {
    'use strict';
    return angular.module('progressModule', ['progress.factories', 'progress.controllers', 'progress.directives']);
});