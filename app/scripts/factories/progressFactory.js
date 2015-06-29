define(['angular'], function (angular) {
    'use strict';

    var factories = angular.module('progress.factories', []);
    // factory 用于请求数据
    factories.factory('dataFactory', ['$q', '$http', function ($q, $http) {
        // 地址与返回用对象
        var dataUrl = 'data/analyzeDataChart_02.json';
        var returnObject = {};

        // ajax 请求，成功与失败均 promise 化
        returnObject.requestOptions = function () {
            var deferred = $q.defer();
            $http({
                url: dataUrl,
                method: 'GET',
                responseType: 'json'
            }).success(function (data) {
                deferred.resolve(data[0]);
            }).error(function (data) {
                deferred.reject('Can\'t get data');
            });
            return deferred.promise;
        };

        return returnObject;
    }]);

    return factories;
});