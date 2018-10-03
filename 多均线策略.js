/*
策略出处: https://www.fmz.com/strategy/47144
策略名称: 多均线策略
策略作者: 小小梦
策略描述:




参数      默认值  描述
----  -----  -----
ma60     60  60日均线
ma10     10  10日均线
ma5       5  5日均线
*/

// 以下是测试代码 
/*- 状态 在使用 模板时需要在 主策略内声明
var TASK_IDLE = 0;
var TASK_OPEN_LONG = 1;
var TASK_OPEN_SHORT = 2;
var TASK_ADD = 3;
var TASK_ST = 4;
var TASK_COVER = 5;
*/

// 全局变量
var currency0 = exchanges[0].GetCurrency();
var ChartObj = null;
var TASK_IDLE = 0;
var TASK_OPEN_LONG = 1;
var TASK_OPEN_SHORT = 2;
var TASK_ADD = 3;
var TASK_ST = 4;
var TASK_COVER = 5;
var IDLE = 11;
var LONG = 22;
var SHORT = 33;
var perRecordsTime = 0;

function onTick1() {
    // 获取K线数据
    var nowTime = new Date().getTime();
    var records = _C(exchanges[0].GetRecords);
    if(records.length < Math.abs(ma60, ma10, ma5)){
        return $.TaskCmd(TASK_IDLE);
    }
    
    var ma60_line = TA.MA(records, ma60);
    var ma10_line = TA.MA(records, ma10);
    var ma5_line = TA.MA(records, ma5);
    
    // $.AddData = function(index, dataKey, dataValue)
    
    // 画图表
    $.PlotRecords(records, currency0);
    $.PlotLine('ma' + ma60, ma60_line[ma60_line.length - 1], records[records.length - 1].Time);
    $.PlotLine('ma' + ma10, ma10_line[ma10_line.length - 1], records[records.length - 1].Time);
    $.PlotLine('ma' + ma5, ma5_line[ma5_line.length - 1], records[records.length - 1].Time);
    
    if(records[records.length - 1].Time !== perRecordsTime){
        isTradeonThieBar = false;
        perRecordsTime = records[records.length - 1].Time;
    }
    
    if($.GetTaskState(exchanges[0].GetName(), exchanges[0].GetLabel()) == IDLE && records[records.length - 2].Close > ma60_line[ma60_line.length - 2] && ma10_line[ma10_line.length - 2] > ma60_line[ma60_line.length - 2] && ma5_line[ma5_line.length - 2] > ma60_line[ma60_line.length - 2] && 
        ma10_line[ma10_line.length - 3] > ma5_line[ma5_line.length - 3] && ma10_line[ma10_line.length - 2] < ma5_line[ma5_line.length - 2]){
        // 标记
        return $.TaskCmd(TASK_OPEN_LONG, 0.5);
    }else if($.GetTaskState(exchanges[0].GetName(), exchanges[0].GetLabel()) == IDLE && records[records.length - 2].Close < ma60_line[ma60_line.length - 2] && ma10_line[ma10_line.length - 2] < ma60_line[ma60_line.length - 2] && ma5_line[ma5_line.length - 2] < ma60_line[ma60_line.length - 2] && 
        ma10_line[ma10_line.length - 3] < ma5_line[ma5_line.length - 3] && ma10_line[ma10_line.length - 2] > ma5_line[ma5_line.length - 2]){
        // 标记
        isTradeonThieBar = true;
        return $.TaskCmd(TASK_OPEN_SHORT, 0.5);
    }
    
    if (($.GetTaskState(exchanges[0].GetName(), exchanges[0].GetLabel()) == LONG && records[records.length - 2].Close < ma5_line[ma5_line.length - 2]) || ($.GetTaskState(exchanges[0].GetName(), exchanges[0].GetLabel()) == SHORT && records[records.length - 2].Close > ma5_line[ma5_line.length - 2])) {
        // 标记
        isTradeonThieBar = true;
        return $.TaskCmd(TASK_COVER);
    } 

    return $.TaskCmd(TASK_IDLE);
}

function main() {
    LogReset(1);
    ChartObj = Chart(null);
    ChartObj.reset();
    ChartObj = $.GetCfg();
    // 处理 指标轴------------------------
    ChartObj.yAxis = [{
            title: {text: 'K线'},//标题
            style: {color: '#4572A7'},//样式 
            opposite: false  //生成右边Y轴
        },
        {
            title:{text: "指标轴"},
            opposite: true,  //生成右边Y轴  ceshi
        }
    ];
    // 初始化指标线
    var records = null;
    while(!records || records.length < 60){
        records = _C(exchange.GetRecords);
        LogStatus("records.length:", records.length);
        Sleep(1000);
    }

    $.PlotRecords(records, currency0);
    $.PlotLine('ma' + ma60, 0, records[records.length - 1].Time);
    $.PlotLine('ma' + ma10, 0, records[records.length - 1].Time);
    var chart = $.PlotLine('ma' + ma5, 0, records[records.length - 1].Time);
    
    chart.update(ChartObj);
    chart.reset();
    
    $.Relation_Exchange_onTick(exchanges[0], onTick1);
    $.Trend();  // 不用传参数。
}
