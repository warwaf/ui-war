var app = angular.module("app",[
       'ui.war'
])

app.controller('appCtrl',['$scope',function($scope){
	$scope.data = ["11",'222','3333'];
	$scope.click = function(index,value){
		console.log(index,value)
	}
}]);
