'use strict';
/**
 *这个一个war angularJs UI 插件
 *1001    select 插件       
 */
angular.module("ui.war",[])
/**
 * 名       称:  select 插件
 * 版       本：  1.0
 * 编       号：  1001
 * 内       容：  
 * 用       法：<war-select war-data='data' item-click='click(index,value)' war-hover='false'></war-select>
 *          war-data   传入的数据  数据格式是数组
 *          war-hover  默认为false
 *          item-click 点击item时触发的事件  index 数组的序号  value  点击的值
 */
.directive('warSelect',function(){
	return {
		restrict:"AE",
		replace: true,
		templateUrl:"./war/tpls/select.html",
		scope:{
			warData:"=", //
			itemClick:"&",//方法
			warIndex:"@",
			warHover:'@'
		},
		controller:function($scope){
			if($scope.warIndex =='' || $scope.warIndex==undefined){
				$scope.warIndex = 0;
			}
			if($scope.warHover =='' || $scope.warHover==undefined){
				$scope.warHover = false;
			}
			$scope.selected = $scope.warData[$scope.warIndex];
			$scope.selectClick = function(){
				if( $scope.warHover == "false" ){
					$scope.isOpen = !$scope.isOpen ;
				} 
			}
			$scope.outSelect = function(){
				if( $scope.warHover == "true" )$scope.isOpen = false;
			}
			$scope.overSelect = function(){
				if( $scope.warHover == "true" )$scope.isOpen = true;
			}
			$scope.itemsClick = function(index,e){
				$scope.selected = $scope.warData[index];
				$scope.isOpen = false;
				$scope.itemClick({'index':index,'value':$scope.selected})
			}
		}
	}
})
//.directive('',function(){
//	
//})