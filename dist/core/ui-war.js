/**
 * 作者:war
 * 时间:16/4/14
 * 内容:
 */
'use strict';
(function () {
    /**
     * 引入所需要的module
     */
    angular.module("ui.war",[]);
})();
/**
 * 作者:war
 * 时间:16/3/25
 * 内容:
 */
// 'use strict';
(function () {

    angular.module("ui.war").directive("warGrid",warGrid)
    /**
     * 把tbody 的展示和 thead 对应起来
     *
     */
    .filter('GridFilter', function() {
        return function(obj, param1) {
            var arr = [];
            for (var i = 0; i < param1.length; i++) {
                arr.push(obj[param1[i]]);
            }
            return arr;
        }
    })
    .filter('replaceFilter',function(){

        return function (obj,param1){
            for (var i =0 ;i<param1.length;i++){
                for (var j = 0 ; j<param1[i].replaceArr.length;j++){
                    if(obj[param1[i].field] == param1[i].replaceArr[j].tags)
                        obj[param1[i].field] = param1[i].replaceArr[j].name;
                }
            }
            return obj;
        }
    })

    function warGrid($http) {
        return {
            restrict: "AE",
            replace: true,
            scope: {
                gridConfig: "=",
                clickcell: '&',
                onloadsuccess: '&',
                ondelete: '&',
                clearSelect:'='
            },
            templateUrl: "app/tableGrid/war.tableGrid.html",
            link: function(scope, element, attrs) {

                /**
                 * 当前显示的页数,默认为第一页.
                 * @type {number}
                 */
                scope.currentPage = 0;

                scope.GridFilterArr = [];
                scope.ReplaceFilter = [];
                scope.totalCountArr = [];
                scope.tabs = [true];
                scope.selects = [];
                scope.width = 0;
                if (!angular.isDefined(scope.gridConfig.radio)) scope.gridConfig.radio = true;
                angular.forEach(scope.gridConfig.columns, function(data) {
                    if (!angular.isDefined(data.type)) data.type = "text";
                    scope.GridFilterArr.push(data.field);
                    var fn = eval( data.filter);
                    if(data.filter) scope.ReplaceFilter.push({
                        field : data.field,
                        replaceArr: fn()
                    });
                    scope.width += data.width;
                });
                /**
                 *  获取回调函数
                 * @type {scope.onCellClick|*|$scope.gridConfig.onCellClick}
                 */
                var cellClick = scope.gridConfig.onCellClick;
                /**
                 * 点击单元格事件
                 * @param data
                 * @param data1
                 * @param event
                 */
                scope.onCellClick = function(data,data1,value,event){
                    var d ={
                        id:data.id,
                        field:data1,
                        value:value
                    };
                    if(cellClick ){
                        cellClick(d);
                        //阻止向上冒泡
                        event.stopPropagation();
                    }else{
                        //阻止向上冒泡
                        event.stopPropagation();
                        throw "xGrid 配置没有 onCellClick 函数,请添加!"
                    }
                }

                scope.delete = function(data) {
                    scope.ondelete(data)
                    angular.forEach(scope.data, function(value, key) {
                        if (value == data.data) {
                            scope.data.splice(key, 1);
                        }
                    });
                }
                /**
                 *
                 * @param {Object} data
                 * @param {Object} index
                 */
                scope.onclickcell = function(data, index) {
                    if(typeof scope.clearSelect != 'undefined' ){
                        scope.clearSelect = false;
                    }
                    if (scope.gridConfig.radio == true) {
                        if (scope.selects[index] == true) {
                            scope.selects[index] = false;
                            for (var o in data) {
                                data[o] = '';
                            }
                            scope.clickcell(data);
                        } else {
                            scope.clickcell(data);
                            pitchOn(index);
                        }
                    }
                }
                /**
                 *
                 * @param {Object} index
                 */
                function pitchOn(index) {
                    angular.forEach(scope.selects, function(i, v) {
                        scope.selects[v] = false;
                    });
                    scope.selects[index] = true;
                }
                /**
                 * 高亮当前页数
                 * @param {Object} index
                 */
                function changetab(index) {
                    angular.forEach(scope.tabs, function(i, v) {
                        scope.tabs[v] = false;
                    });
                    scope.tabs[index] = true;
                    scope.currentPage = index;
                }
                /**
                 * 切换页数
                 * @param {Object} index 页数
                 */
                scope.tab = function(index) {
                    changetab(index);
                    scope.gridConfig.data = angular.extend({}, scope.gridConfig.data);
                    scope.gridConfig.data.page =  scope.currentPage;
                };
                /**
                 *上一页
                 */
                scope.next = function() {
                    if ( scope.currentPage < scope.total) {
                        scope.tab(++ scope.currentPage);
                    }
                };
                /**
                 * 下一页
                 */
                scope.prev = function() {
                    if ( scope.currentPage > 0) {
                        scope.tab(-- scope.currentPage);
                    }
                };
                /**
                 * 第一页
                 */
                scope.first = function () {
                    scope.tab(1);
                };
                /**
                 * 最后一页
                 */
                scope.last = function () {
                    scope.tab(scope.total);
                }
                /**
                 * $watch 通过监听这个函数达到监听配置变化
                 */
                function getConfig() {
                    var config = {};
                    config = angular.extend(config, scope.gridConfig);
                    return JSON.stringify(config);
                }

                function filterColumns(){

                }
                /**
                 * 如果有变化 重新加载请求数据函数
                 */
                function iWatch() {
                    var config = {
                        method: scope.gridConfig.method,
                        url: scope.gridConfig.url
                    }
                    if ("POST" === scope.gridConfig.method) {
                        config.data = angular.extend({}, scope.gridConfig.data);
                        if (config.data.page == undefined ||
                            config.data.page == '') {
                            config.data.page = 1;
                            changetab(1);
                        }
                        config.data.pageSize = scope.gridConfig.pageSize;
                    } else if ("GET" === scope.gridConfig.method) {
                        config.params = scope.gridConfig.data;
                    };
                    if(scope.gridConfig.url !='' && scope.gridConfig.url !=undefined){
                        $http(config).success(function(data) {
                            scope.onloadsuccess({
                                data: data
                            });
                            var myData = data.data;
                            if(data.flag=='yes'){
                                myData = eval('(' + data.data + ')');
                                data.totalCount = myData.length;
                            }
                            scope.data = myData;
                            //需要显示的页数集合
                            scope.totalCountArr = [];
                            //总页数
                            scope.total= Math.ceil(data.totalCount / scope.gridConfig.pageSize);
                            //判断是否是非数字
                            scope.totalIsNaN = isNaN(scope.total);
                            if(scope.total>6){
                                //开始显示的页数
                                var startPage = scope.currentPage-2;
                                //显示页数结束
                                var endPage = scope.currentPage+2;
                                //判断前面几页时
                                if(startPage<=0){
                                    endPage -= (startPage-1);
                                    startPage -=(startPage-1);
                                }
                                //判断到最后的5页时
                                if(endPage>=scope.total){
                                    startPage = scope.total - 5;
                                    endPage = scope.total;
                                }
                            }else{
                                var startPage = 1;
                                //显示页数结束
                                var endPage = scope.total;
                            }
                            for (var i =  startPage; i <= endPage; i++) {
                                scope.totalCountArr.push(i);
                            }
                        }).error(function(err) {
                            throw '数据加载错误，请联系管理员!';
                        })
                    } else {
                        var data = {"statusCode":"200","data":[],"totalCount":0};
                        scope.onloadsuccess({
                            data: data
                        });
                        scope.data = data.data;
                        //需要显示的页数集合
                        scope.totalCountArr = [];
                        //总页数
                        scope.total= Math.ceil(data.totalCount / scope.gridConfig.pageSize);
                        //判断是否是非数字
                        scope.totalIsNaN = isNaN(scope.total);
                        if(scope.total>6){
                            //开始显示的页数
                            var startPage = scope.currentPage-2;
                            //显示页数结束
                            var endPage = scope.currentPage+2;
                            //判断前面几页时
                            if(startPage<=0){
                                endPage -= (startPage-1);
                                startPage -=(startPage-1);
                            }
                            //判断到最后的5页时
                            if(endPage>=scope.total){
                                startPage = scope.total - 5;
                                endPage = scope.total;
                            }
                        }else{
                            var startPage = 1;
                            //显示页数结束
                            var endPage = scope.total;
                        }

                        for (var i =  startPage; i <= endPage; i++) {
                            scope.totalCountArr.push(i);
                        }
                    }
                }

                /**
                 * 新增 清除选中
                 */
                scope.$watch('clearSelect',function(){
                    if(scope.clearSelect == true){
                        scope.selects = [];
                    }
                })
                /**
                 * 监听配置信息变化
                 */
                scope.$watch(getConfig, function(newValue, oldValue) {
                    iWatch();
                    pitchOn(-1);
                });
            }
        }
    };
})();
/**
 * 作者:war
 * 时间:16/3/25
 * 内容:
 */
'use strict';
(function () {
    angular.module("ui.war").directive("warTree", warTree);

    function warTree() {
        return {
            restrict: "EA",
            replace: true,
            // transclude:true,
            // require:"^tab",
            scope: {},
            templateUrl: "",
            // controller:"",
            //
            link: function (scope, element, attrs) {

            },
            //
            // compile:function (elm, attrs, transclude) {
            //
            // }
        }
    }
})();
angular.module("ui.war").run(["$templateCache", function($templateCache) {$templateCache.put("app/tableGrid/war.tableGrid.html","<div class=\"table-responsive\"><table class=\"table b-t b-light\" ng-style=\"{\'width\':width}\" ng-class=\"{\'table-hover\':gridConfig.radio||gridConfig.checkbox}\"><thead><tr><th ng-repeat=\"item in gridConfig.columns\" ng-bind=\"item.title\" ng-style=\"{\'width\':item.width}\"></th><th ng-if=\"gridConfig.button.delete\"></th></tr></thead><tbody><tr ng-repeat=\"item in data\" ng-click=\"onclickcell({data:item},$index)\" ng-class=\'{\"striped\":$index%2==0,\"active\":selects[$index]}\'><td ng-repeat=\"items in item | replaceFilter:ReplaceFilter |GridFilter:GridFilterArr track by $index\" ng-switch=\"gridConfig.columns[$index].type\"><a ng-switch-when=\"text\" ng-bind=\"items\"></a> <input ng-switch-when=\"input\" ng-model=\"items\"> <a ng-switch-when=\"link\" ng-bind=\"items\" class=\"\" ng-click=\"onCellClick(item,gridConfig.columns[$index].field,items,$event)\"></a></td><td ng-if=\"gridConfig.button.delete\"><i class=\"fa fa-close text-danger\" ng-click=\"delete({data:item})\"></i></td></tr></tbody></table><div class=\"b-t text-center padder-h-xs\" ng-class=\"{\'hide\':total<=1 || total == undefined || totalIsNaN}\"><ul class=\"pagination pagination-sm m-t-none m-b-none\"><li ng-click=\"prev()\"><a href=\"\"><i class=\"fa fa-chevron-left\"></i></a></li><li ng-if=\"currentPage > 3 && total>6\" ng-click=\"first()\"><a href=\"\">1</a></li><li ng-if=\"currentPage > 3 && total>6\"><a href=\"\"><i class=\"fa fa-ellipsis-h\"></i></a></li><li ng-click=\"tab(item)\" ng-repeat=\"item in totalCountArr\" ng-class=\"{\'active\':tabs[item]}\"><a href=\"\" ng-bind=\"item\">1</a></li><li ng-if=\"currentPage < total-3 && total>6\"><a href=\"\"><i class=\"fa fa-ellipsis-h\"></i></a></li><li ng-if=\"currentPage < total-3 && total>6\" ng-click=\"last()\"><a href=\"\" ng-bind=\"total\"></a></li><li ng-click=\"next()\"><a href=\"\"><i class=\"fa fa-chevron-right\"></i></a></li></ul></div></div>");
$templateCache.put("app/tree/war.tree.html","<div>tree</div>");}]);