// ------>测试  test<------
//// -->列表的翻页控制
//var keywordListParam = [];
//for(var index=0;index < 1000;index++) {
//	keywordListParam.push('keyword'+index);
//}
//var listPagerCtrl = new ListPagerCtrlx(keywordListParam,10);  // 要请求的列表，以每页10个的数量进行翻页
////console.log(listPagerCtrl.initPage(5));
////console.log(listPagerCtrl.nextPage());
//
//// -->单页面的工作者数量控制
//var workerCtrl = new WorkerCtrlx();
//workerCtrl.runAutoNextPage(10,listPagerCtrl,function(itemList,workerQueue){  // 一个网页最多一次10个ajax请求
//	var setTimeoutFunc = function(){
//		console.log(itemList);
//		workerQueue.pop();
//		console.log(workerQueue);
//	};
//	setTimeout(setTimeoutFunc,1000*Math.random());
//	/*
//	$.ajax({
//	    type: "GET",
//	    url: reqUrlConfig.loginUrl,
//	    data: {},
//	    async: true,
//	    dataType: "json",
//	    success: function(data) {
//	    	workerQueue.pop();
//	    	if(data.staus==1){
//	    		
//	    	}
//	    	else{
//	    		
//	    	}
//        },
//	    error: function (xhr, textStatus, errorThrown) {
//	    	workerQueue.pop();
//	    	if(xhr.status=='301'){
//	    		
//	    	}
//	    }
//	});
//	*/
//});
(function( window, undefined ) {
	// 列表分页控制
	var ListPagerCtrlx = function(keywordListParam,perPageCount){
		this.keywordList = [];
		this.currItemIndex = 0;
		this.perPageCount = 5;
		
		// 配置
		this.init = function(keywordListParam,perPageCount){
			this.keywordList = keywordListParam;
			this.currItemIndex = 0;
			if(typeof perPageCount == 'undefined'){
				this.perPageCount = 5;
			}
			else{
				this.perPageCount = perPageCount;
			}	
		};
		
		// 初始化指定数量的列表
		this.initPage = function(initCountParam){
			if(typeof initCountParam == 'undefined'){
				initCountParam = 1;
			}
			this.endItemIndex = initCountParam-1;
			return this.getList(0,initCountParam-1);
		};
		
		// 取出列表
		this.getList = function(startItemIndex,endItemIndex){
			var itemList = [];
			if(this.keywordList.length<=0){
				return [];
			}
			if((this.keywordList.length-1)<endItemIndex){
				endItemIndex = this.keywordList.length-1;
			}
			for(var index = startItemIndex;index <= endItemIndex;index++){
				itemList.push(this.keywordList[index]);
			}
			this.currItemIndex = endItemIndex;
			return itemList;
		};
		
		//　下一页
		this.nextPage = function(){
			return this.getList(this.currItemIndex+1,(this.currItemIndex+this.perPageCount));
		};
		
		this.init(keywordListParam,perPageCount);
	};
	
	// Worker 数量控制器
	var WorkerCtrlx = function(){
		this.maxWorkerCount = 10;
		this.workerQueue = [];
		
		// 观察队列是否空闲，如果空闲，自动进行分配任务
		this.watcherQueue = function(listPagerCtrl,workerFunc){
			var setTimeoutHandler = null;
			var thisTemp = this;
			var setTimeoutFunc = function(){
				clearTimeout(setTimeoutHandler);
				if(thisTemp.workerQueue.length<thisTemp.maxWorkerCount){
					var needAppendCount = thisTemp.maxWorkerCount - thisTemp.workerQueue.length;
					for(var index=0;index < needAppendCount;index++) {
						var itemList = listPagerCtrl.nextPage();
						if(itemList.length>0){
							workerFunc(itemList,thisTemp.workerQueue);
							thisTemp.workerQueue.push('1');
						}
						else{
							return;
						}
					}
				}
				setTimeoutHandler = setTimeout(setTimeoutFunc,100);
			};
			setTimeoutFunc();
		};
		
		// 初始化进行N个请求
		this.init = function(listPagerCtrl,workerFunc){
			for(var index=0;index < this.maxAjaxCount;index++) {
				var itemList = listPagerCtrl.nextPage();
				workerFunc(itemList,this.workerQueue);
				this.workerQueue.push('1');
			}
		};
		
		// 主函数
		this.runAutoNextPage = function(maxWorkerCountParam,listPagerCtrl,workerFunc){
			this.maxWorkerCount = maxWorkerCountParam;
			this.init(listPagerCtrl,workerFunc);
			this.watcherQueue(listPagerCtrl,workerFunc);
		};
	}
	window.ListPagerCtrlx = ListPagerCtrlx;
	window.WorkerCtrlx = WorkerCtrlx;
})( window );

