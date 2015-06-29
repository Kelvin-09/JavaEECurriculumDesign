define(['graphicUtils', 'angular', 'factories/progressFactory'], function (graphicUtils, angular) {
    'use strict';

    var controllers = angular.module('progress.controllers', []);
    // 控制器 用于读取数据
    controllers.controller('dataController', ['$scope', '$q', 'dataFactory', function ($scope, $q, dataFactory) {
        dataFactory.requestOptions().then(function (data) {
            return graphicUtils.transform(data);
        }, function (error) {
            throw new Error(error);
        }).then(function (data) {
            $scope.data = data;
            $scope.legends = data.matrixSelectOptionArr;
        }, function (error) {
            console.error(error);
        });

        $scope.colors = graphicUtils.colors();
    }]);
    return controllers;
});