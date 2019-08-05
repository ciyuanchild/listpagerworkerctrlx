```
/**

    翻页控制，页面执行者数量控制
    create time : 2016-06-03
    author : zhouzhian
*/
// -->列表的翻页控制
var keywordListParam = [];
for(var index=0;index < 1000;index++) {
    keywordListParam.push('keyword'+index);
}

var listPagerCtrl = new ListPagerCtrlx(keywordListParam,10);  // 要请求的列表，以每页10个的数量进行翻页
// console.log(listPagerCtrl.initPage(5));
// console.log(listPagerCtrl.nextPage());


// -->单页面的工作者数量控制
var workerCtrl = new WorkerCtrlx();
workerCtrl.runAutoNextPage(10,listPagerCtrl,function(itemList,workerQueue){  // 一个网页最多一次10个ajax请求

   var setTimeoutFunc = function(){

       console.log(itemList);
       workerQueue.pop();
       console.log(workerQueue);

   };

   setTimeout(setTimeoutFunc,1000*Math.random());

   /*
   $.ajax({
       type: "GET",
       url: reqUrlConfig.loginUrl,
       data: {},
       async: true,
       dataType: "json",
       success: function(data) {
           workerQueue.pop();
           if(data.staus==1){

           }
           else{

           }

       },

       error: function (xhr, textStatus, errorThrown) {

           workerQueue.pop();

           if(xhr.status=='301'){

           }

       }

   });
   */

});


/**
 * 特征组合，翻页
 * create time     :    2016-06-03
 * author        :    zhouzhian
 */

// 测试

var featureList = [{'currIndex':0,'stack':['.com1','.com2','.com3']},{'currIndex':0,'stack':['keyword1','keyword2','keyword3']}];

var multiFeaturePagerCtrlx = new MultiFeaturePagerCtrlx(featureList,2);

console.log(multiFeaturePagerCtrlx.initPage(2));
console.log(multiFeaturePagerCtrlx.nextPage());
console.log(multiFeaturePagerCtrlx.nextPage());
console.log(multiFeaturePagerCtrlx.nextPage());
```
