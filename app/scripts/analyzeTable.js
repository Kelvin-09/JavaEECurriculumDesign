// $(function () {
  function transformData (data) {
    // 用于存储转化完的数据
    var tableObject = {};
    // 数据矩阵
    var tableMatrix = [];
    // 用于缓存指针加快程序速度的
    var tempA, tempB, tempC, tempD;

    switch (data.question.questionType) {
      case 8:
        // 缓存一下数据的几个重要矩阵和对象
        tempA = data.question;
        tempB = tempA.matrixRowTitleArr;
        tempC = tempA.matrixColTitleArr;
        tempD = data.osms;

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

        // 将属性附加到返回对象上
        tableObject.count = data.count;
        tableObject.title = tempA.title;
        tableObject.questionType = tempA.questionType;
        tableObject.matrixRowTitleArr = tempA.matrixRowTitleArr;
        tableObject.matrixColTitleArr = tempA.matrixColTitleArr;
        tableObject.matrixSelectOptionArr = tempA.matrixSelectOptionArr;
        tableObject.dataMatrix = tableMatrix;
        break;
      default:
        alert('接收到的数据格式错误！');
        break;
    }
    return tableObject;
  }

  // 计算总共sum个的情况下，需要使用的color数组
  function calculateColors (sum) {
    // return [ 'bg-blue ', 'bg-aqua ', 'bg-teal ', 'bg-olive ', 
    //   'bg-green ', 'bg-lime ', 'bg-yellow ', 'bg-orange ', 
    //   'bg-red ', 'bg-maroon ', 'bg-fuchsia ', 'bg-purple ', 'bg-gray '
    // ];

    var colorArray = [ 'bg-blue ', 'bg-aqua ', 'bg-teal ', 'bg-olive ', 
      'bg-green ', 'bg-lime ', 'bg-yellow ', 'bg-orange ', 
      'bg-red ', 'bg-maroon ', 'bg-fuchsia ', 'bg-purple '//, 'bg-gray '
    ];
    var random = Math.random() * colorArray.length;

    return colorArray.slice(random).concat(colorArray.slice(0, random));
  }

  // 图例标题模板
  var legendTextTemplate = '<label class="control-label col-sm-2">图例</label>';
  // 图例中的container模板
  var colSm10Template = '<div class="col-sm-10"></div>';
  // 图例图像模板
  var legendContainerTemplate = '' + 
    '<div class="legend-container">' + 
      '<div class="legend-box"></div>' + 
      '<label class="legend-label">{0}</label>' + 
    '</div>';
  // form-group模板
  var formGroupTemplate = '<div class="form-group"></div>';
  var progressRowTextTemplate = '<label class="control-label col-sm-2 col-lg-1"></label>';
  var progressColTextTemplate = '<label class="control-label col-xs-2 col-lg-1"></label>';
  var progressRowOutTemplate = '<div class="col-sm-10 col-lg-11"></div>';
  var progressRowInTemplate = '<div class="col-xs-10  col-lg-11"><div class="progress"></div></div>';
  var progressBarTemplate = '<div class="progress-bar"></div>';
  // style="min-width: 4em;"

  // 制作图例
  function produceLegend (selectOptions, colors) {
    var legendText, legendContainer, legendContainers = [];

    legendText = $(legendTextTemplate);
    $.each(selectOptions, function (index, element) {
      legendContainer = $(legendContainerTemplate.replace(/\{0\}/, element));
      legendContainer.find('.legend-box').addClass(colors[index]);
      legendContainers.push(legendContainer);
    })

    return $(formGroupTemplate).append(legendText, $(colSm10Template).append(legendContainers));
  }

  function transformSelectResult (selects) {
    var backupArray, sortedArray, result = {};
    backupArray = selects.slice();
    sortedArray = selects.slice().sort(function (a, b) { return a - b; });

    $.each(sortedArray, function (indexArray, elementArray) {
      var positionArray = backupArray.indexOf(elementArray);
      backupArray[positionArray] = undefined;
      result[elementArray]? result[elementArray].push(positionArray): result[elementArray] = [positionArray];
    });

    return result;
  }

  function printData (data) {
    // 用于缓存数据矩阵和总投票人数
    var tempMatrix, personCount;
    // 用于缓存行列以及选项的文字
    var tempRowOptions, tempColOptions, tempSelectOptions;

    var colors;                   // 进度条颜色数组
    var formGroups = [];          // 所有form-group框体

    // 初始化对应数据
    personCount = data.count;
    tempMatrix = data.dataMatrix;
    tempRowOptions = data.matrixRowTitleArr;
    tempColOptions = data.matrixColTitleArr;
    tempSelectOptions = data.matrixSelectOptionArr;

    colors = calculateColors();   // 初始化颜色
    formGroups.push(produceLegend(data.matrixSelectOptionArr, colors));   // 初始化图例

    // 遍历行数据
    $.each(tempMatrix, function (indexRow, elementRow) {
      var matrixRowText, matrixRow;
      var matrixCols = [];            // 存储该行中所有列

      // 初始化行标题
      matrixRowText = $(progressRowTextTemplate).text(tempRowOptions[indexRow]);

      // 遍历列数据
      $.each(elementRow, function (indexCol, elementCol) {
        // 思想：
        // 备份出两个数组来，一个排序一个不动（数组内容为选择对应选项的人数）
        // 遍历排序过的数组，将未排序的数组对应数字的位置提取出来并存入对象map中
        // 格式为：{ 人数: [ 选项1编号, 选项2编号 ] }（未排序时选项的编号和位置是相等的）
        // 并将未排序的备份的对应位置置undefined（防止重复选择）
        var matrixColText, matrixColBody, progresseBars = [];
        var progressMatrix, tempLast = 0;

        // 初始化列名
        matrixColText = $(progressColTextTemplate).text(tempColOptions[indexCol]);
        // 合并同样人数的项
        progressMatrix = transformSelectResult(elementCol);

        // 遍历人数统计，将人数相同的多个项合并为一个进度条
        $.each(progressMatrix, function (indexPersonCount, elementPersonCount) {
          var progressMerge = [];       // 用于存储相同人数选项的名称的数组
          // 初始化进度条并设置宽度
          var progressBar = $(progressBarTemplate).css({
            'width': ((indexPersonCount - tempLast) / personCount * 100) + '%'
          });
          // 设置上次的长度，下次的减去上次的就是中间应该显示的长出来的那一段的长度
          tempLast = indexPersonCount;

          // 把同名的名字都加上，并赋值颜色
          $.each(elementPersonCount, function (indexSelect, elementSelect) {
            progressMerge.push(tempSelectOptions[elementSelect]);
            progressBar.addClass(colors[elementSelect]);
          });

          progressBar.text(progressMerge.join('&') + ' : ' + indexPersonCount + '人');
          progresseBars.push(progressBar);
        });

        matrixColBody = $(progressRowInTemplate).find('.progress').append(progresseBars)

        matrixCols.push($(formGroupTemplate).append(matrixColText, matrixColBody));
      });

      matrixRow = $(formGroupTemplate).append(matrixRowText, $(progressRowOutTemplate).append(matrixCols));
      formGroups.push(matrixRow);
    });

    $('#chartContent').append(formGroups);
  }
// });


// var i, tempColor, result = [];
// var colorSalt = 3355443, colorScope = 16777215 - 2 * colorSalt;

// for (i = 0; i < sum; ++i) {
//   tempColor = (colorScope * i / sum + colorSalt).toString(16);
//   tempColor = '#' + new Array(tempColor.length > 6 ? 0 : 6 - tempColor.length + 1).join('0') + tempColor;
//   result.push(tempColor);
// }

// return result;

// [ 'bg-navy', 'bg-blue ', 'bg-aqua ', 'bg-teal ', 
//   'bg-olive ', 'bg-green ', 'bg-lime ', 'bg-yellow ', 
//   'bg-orange ', 'bg-red ', 'bg-fuchsia ', 'bg-purple ', 
//   'bg-maroon ', 'bg-white ', 'bg-gray ', 'bg-silver ', 'bg-black'
// ]
