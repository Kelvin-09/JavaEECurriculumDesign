'use strict';

define(['jquery'], function ($) {
    var transform = function (data) {
        // 用于存储转化完的数据
        var tableObject = {};
        // 数据矩阵
        var tableMatrix = [];
        // 用于缓存指针加快程序速度的
        var tempA, tempB, tempC, tempD;

        // 直接缓存数据属性对象和选择的数据属性
        tempA = data.question;
        tempD = data.osms;

        switch (data.question.questionType) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
                tempB = tempA.optionArr;
                $.each(tempB, function (index) {
                    tableMatrix[index] = {};
                });
                $.each(tempD, function (index, element) {
                    tableMatrix[element.optionIndex] = {
                    // optionLabel: element.optionLabel,
                    // count : element.count
                    name: element.optionLabel,
                    y: element.count
                    };
                });
              break;
            case 8:
                // 缓存一下数据的几个重要矩阵和对象
                tempB = tempA.matrixRowTitleArr;
                tempC = tempA.matrixColTitleArr;

                // 构建矩阵数组
                $.each(tempB, function (indexI) {
                    tableMatrix[indexI] = [];
                    $.each(tempC, function (indexJ) {
                        tableMatrix[indexI][indexJ] = [];
                    });
                })

                // 向矩阵数组中填充数据
                $.each(tempD, function (index, element) {
                    tableMatrix[element.matrixRowIndex][element.matrixColIndex][element.matrixSelectIndex] = element.count;
                })

                // 以下标题均按序号排序
                // 行标题
                tableObject.matrixRowTitleArr = tempA.matrixRowTitleArr;
                // 列标题
                tableObject.matrixColTitleArr = tempA.matrixColTitleArr;
                // 选项标题
                tableObject.matrixSelectOptionArr = tempA.matrixSelectOptionArr;
                break;
            default:
                throw new Error('接收到的数据格式错误！');
                break;
        }

        // 将属性附加到返回对象上
        // 总人数
        tableObject.count = data.count;
        // 问卷标题
        tableObject.title = tempA.title;
        // 问题类型
        tableObject.questionType = tempA.questionType;
        // 数据矩阵
        tableObject.dataMatrix = tableMatrix;
        return tableObject;
    }

    // 计算总共sum个的情况下，需要使用的color数组
    var colors = function (sum) {
        var colorArray = [ 'bg-blue ', 'bg-aqua ', 'bg-teal ', 'bg-olive ', 
            'bg-green ', 'bg-lime ', 'bg-yellow ', 'bg-orange ', 
            'bg-red ', 'bg-maroon ', 'bg-fuchsia ', 'bg-purple '//, 'bg-gray '
        ];
        var random = Math.random() * colorArray.length;

        return colorArray.slice(random).concat(colorArray.slice(0, random));
    }

    return {
        colors: colors,
        transform: transform
    };
});