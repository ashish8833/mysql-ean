angular.module('main').controller('AdminCtrl',function ($scope,$http) {
	console.log("Admin Controller call");
	$http({
		method:"post",
		url:"/user",
		dataType:'json',
	}).then(function (data) {
		console.log("After Login");
		console.log(data);
    })
});