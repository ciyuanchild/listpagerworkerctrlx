/**
 * 特征组合，翻页
 * create time 	:	2016-06-03
 * author		:	zhouzhian
 */
// 测试
//var featureList = [{'currIndex':0,'stack':['.com1','.com2','.com3']},{'currIndex':0,'stack':['keyword1','keyword2','keyword3']}];
//var multiFeaturePagerCtrlx = new MultiFeaturePagerCtrlx(featureList,2);
//console.log(multiFeaturePagerCtrlx.initPage(2));
//console.log(multiFeaturePagerCtrlx.nextPage());
//console.log(multiFeaturePagerCtrlx.nextPage());
//console.log(multiFeaturePagerCtrlx.nextPage());
(function( window, undefined ) {
	// 列表分页控制
	var MultiFeaturePagerCtrlx = function(featureListParam,perPageCount){
		this.currItemIndex = -1;
		this.perPageCount = 5;
		this.featureList = [];
		// 配置
		this.init = function(featureListParam,perPageCount){
			this.perPageCount = perPageCount;
			this.featureList = featureListParam;
			this.currItemIndex = -1;
		};
		
		// 初始化指定数量的列表
		this.initPage = function(initCountParam){
			if(typeof initCountParam == 'undefined'){
				initCountParam = 1;
			}
			return this.getList(0,initCountParam-1);
		};
		
		// 生成关键词，从低位往高位进一计算
		this.isAllEnd = false; // 首次取得列表
		this.getNextOneKeyword = function(){
			if(this.isAllEnd){
				return false;
			}
			else{
				var featureLen = this.featureList.length; // 几个特征值
				// 取出关键词
				var keywordStrTemp = '';
				for(var subIndex = 0;subIndex < featureLen;subIndex++ ){
					var featureInfoTemp = this.featureList[subIndex];
					keywordStrTemp = featureInfoTemp['stack'][featureInfoTemp['currIndex']] + keywordStrTemp;
				}
				// 计数器 + 1
				for(var index = featureLen-1;index >= 0;index-- ){
					if((index==0) && (this.featureList[index]['currIndex'] >= this.featureList[index]['stack'].length - 1)){
						this.isAllEnd = true;
						break;
					}
					else if(this.featureList[index]['currIndex'] < this.featureList[index]['stack'].length - 1){
						this.featureList[index]['currIndex'] = this.featureList[index]['currIndex'] + 1;// 高位 + 1
						// 抹点低位的计数器
						for(var subIndex = index + 1;subIndex < featureLen;subIndex++ ){ 
							this.featureList[subIndex]['currIndex'] = 0;
						}
						break;
					}
				}
				return keywordStrTemp;
			}
		};
		
		// 重置特征列表
		this.resetFeatureList = function(){
			for(var index = 0;index < this.featureList.length;index++ ){
				this.featureList[index]['currIndex'] = 0;
			}
		};
		
		// 取出列表，包括索引startItemIndex和endItemIndex的元素
		this.getListNegative = function(startItemIndex,endItemIndex){
			this.resetFeatureList();
			var indexTemp = 0;
			var keywordList = [];
			var keyword = this.getNextOneKeyword();
			while(keyword!=false){
				if(indexTemp < startItemIndex){
					keyword = this.getNextOneKeyword();
					indexTemp = indexTemp + 1;
					continue;
				}
				else if(indexTemp > endItemIndex){
					break;
				}
				else{
					indexTemp = indexTemp + 1;
					keywordList.push(keyword);
					keyword = this.getNextOneKeyword();
				}
			}
			if(keywordList.length!=(endItemIndex-startItemIndex+1)){
				this.currItemIndex = startItemIndex + keywordList.length;
			}
			else{
				this.currItemIndex = endItemIndex;
			}
			return keywordList;
		};
		
		// 取出列表，包括索引startItemIndex和endItemIndex的元素
		this.getList = function(startItemIndex,endItemIndex){
			// 改动计数器到指定到索引的前一个位置
			var skipItemsTotal = startItemIndex;
			if(skipItemsTotal > 0){
				var featureLen = this.featureList.length;
				var checkCurrIndexTemp = 1;
				for(var index = featureLen-1;index >= 0;index-- ){
					checkCurrIndexTemp = checkCurrIndexTemp * this.featureList[index]['stack'].length;
					if(checkCurrIndexTemp > skipItemsTotal){
						var realCurrIndexTemp = parseInt(checkCurrIndexTemp / this.featureList[index]['stack'].length);
						for(var subIndex = index; subIndex < featureLen-1; subIndex ++ ){
							this.featureList[subIndex]['currIndex'] = parseInt(skipItemsTotal / realCurrIndexTemp);
							skipItemsTotal = skipItemsTotal % realCurrIndexTemp;
							realCurrIndexTemp = parseInt(realCurrIndexTemp / this.featureList[subIndex + 1]['stack'].length);
						}
						this.featureList[featureLen-1]['currIndex'] = skipItemsTotal;
						skipItemsTotal = 0;
						break;
					}
				}
			}
			if(skipItemsTotal > 0){
				return [];
			}
			
			var itemList = [];
			var counter = endItemIndex - startItemIndex + 1;
			var keyword = this.getNextOneKeyword();
			while(keyword!=false){
				itemList.push(keyword);
				counter = counter - 1;
				if(counter<=0){
					break;
				}
				keyword = this.getNextOneKeyword();
			}
			if(counter>0){
				this.currItemIndex = endItemIndex - counter + 1;
			}
			else{
				this.currItemIndex = endItemIndex;
			}
			return itemList;
		};
		
		//　下一页
		this.nextPage = function(){
			return this.getList(this.currItemIndex + 1,(this.currItemIndex + this.perPageCount));
		};
		
		// 初始化
		this.init(featureListParam,perPageCount);
	};
	window.MultiFeaturePagerCtrlx = MultiFeaturePagerCtrlx;
})( window );
