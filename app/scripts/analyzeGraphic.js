
function transformData (data) {
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

      tableObject.matrixRowTitleArr = tempA.matrixRowTitleArr;
      tableObject.matrixColTitleArr = tempA.matrixColTitleArr;
      tableObject.matrixSelectOptionArr = tempA.matrixSelectOptionArr;
      break;
    default:
      alert('接收到的数据格式错误！');
      break;
  }

  // 将属性附加到返回对象上
  tableObject.count = data.count;
  tableObject.title = tempA.title;
  tableObject.questionType = tempA.questionType;
  tableObject.dataMatrix = tableMatrix;
  return tableObject;
}

function printData (data, displayType) {
  var graphicTypes  = [ 'pie', 'pie', 'bar', 'column', 'bar', 'column', 'line', 'line' ];
  var graphicTitle    = data.title;
  var graphicData     = data.dataMatrix;
  var graphicType     = graphicTypes[displayType && displayType < graphicTypes.length? displayType : 0];
  var graphic3dDepth  = 0;
  var graphicBarXAxis = [];
  var optionsBasic = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
    },
    plotOptions: {},
    series: [{
      name: '该选项人数',
      data: graphicData
    }]
  };

  // 标题
  optionsBasic.title = {
    text: graphicTitle
  };
  // 图类型
  optionsBasic.chart.type = graphicType;

  if (1 < displayType) {
    $.each(graphicData , function (index, element) {
      graphicBarXAxis.push(graphicData.name);
    });
    // 纵坐标
    optionsBasic.xAxis = {
      categories: graphicBarXAxis,
      title: {
        text: null
      },
      crosshair: true
    };
    // 漂浮框
    optionsBasic.tooltip = {
      valueSuffix: ' 人'
    };
    // 图例
    optionsBasic.legend = {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      x: -40,
      y: 100,
      floating: true,
      borderWidth: 1,
      backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
      shadow: true
    };
  } else {
    Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
      return {
        radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
        stops: [
          [0, color],
          [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
        ]
      };
    });
  }

  switch (displayType) {
    case 1:
      // 3d类型
      optionsBasic.chart.options3d = {
        enabled: true,
        alpha: 45,
        beta: 0
      };
      graphic3dDepth = 35;
    case 0:
      // 改变第一项的状态为选中
      graphicData.length? (graphicData[0].sliced = true, graphicData[0].selected = true) : 0;
      optionsBasic.plotOptions.pie = {
        // 3d图高度
        depth: graphic3dDepth,
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          style: {
            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
          },
          connectorColor: 'silver'
        }
      };
      // 漂浮框
      optionsBasic.tooltip = {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      };
      break;
    case 4:
    case 2:
      // bar基础设置
      optionsBasic.plotOptions.bar = {
        dataLabels: {
          enabled: true
        }
      };
      break;
    case 5:
      optionsBasic.chart.margin = 75;
      optionsBasic.chart.options3d = {
          enabled: true,
          alpha: 10,
          beta: 25,
          depth: 70
      };
    case 3:
      break;
    case 6:
    case 7:
      optionsBasic.plotOptions.line = {
        dataLabels: {
          enabled: true
        },
        enableMouseTracking: true
      };
      break;
    default:
      break;
  }

  $('#GraphicPlace').highcharts(optionsBasic);
}