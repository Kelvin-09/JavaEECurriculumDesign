define(['angular'], function (angular) {
    'use strict';

    var directives = angular.module('progress.directives', []);
    // 指令，用于生成图例
    directives.directive('legendbox', function () {
        return {
            replace: true,
            restrict: 'AE',
            templateUrl: 'views/legendbox.html'
        };
    });
    // 指令，用于生成进度条
    directives.directive('progressbox', function () {
        return {
            replace: true,
            restrict: 'AE',
            templateUrl: 'views/progressbox.html'
        }
    });
    return directives;
});