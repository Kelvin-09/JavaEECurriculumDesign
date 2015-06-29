define(['modules/progressModule'], function (progressModule) {
    'use strict';

    // 指令，用于生成图例
    progressModule.directive('legendbox', function () {
        return {
            replace: true,
            restrict: 'AE',
            templateUrl: 'views/legendbox.html'
        };
    });
    // 指令，用于生成进度条
    progressModule.directive('progressbox', function () {
        return {
            replace: true,
            restrict: 'AE',
            templateUrl: 'views/progressbox.html'
        }
    });
});