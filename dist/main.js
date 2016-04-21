/**
 * 作者:war
 * 时间:16/3/25
 * 内容:angularjs 的配置信息
 */
'use strict';
(function () {
    angular.module('app',[]).config(config);
    function config() {
        
    }
})();
/**
 * 作者:war
 * 时间:16/3/25
 * 内容: angularjs 引用外部模块信息   ui-war
 */
'use strict';
(function () {
     angular.module("app",[
         'ui.war'
         // 'ui.router'
     ]);
})();
/**
 * 作者:war
 * 时间:16/3/25
 * 内容: 路由
 */
// 'use strict';
// (function () {
//    angular.module("app").config(routerConfig);
//     /**
//      *
//      * @param $stateProvider
//      * @param $urlRouterProvider
//      */
//     function routerConfig($stateProvider,$urlRouterProvider) {
//
//     }
//
// })();
/**
 * 作者:war
 * 时间:16/3/25
 * 内容: run
 */
'use strict';
(function () {
   angular.module("app").run(runBlock);
    /**
     *
     * @param $log
     */
    function runBlock($log) {
        $log.debug("run");
        
    }
})();
/**
 * 作者:war
 * 时间:16/3/28
 * 内容:
 */
'use strict';
(function () {
    angular.module("app")
        .controller("MainCtrl",mainCtrl);
    function mainCtrl($scope) {
        $scope.gridConfig = {
            pageSize: 20,
            method: 'GET',
            url: '',
            columns: [{
                field: 'id',
                title: "编码",
                width: 80
            }, {
                field: "name",
                title: "名称"
            }, {
                field: "insNums",
                title: "仪器数"

            }, {
                field: "chnNums",
                title: "渠道数"
            }]
        }
    }
})();