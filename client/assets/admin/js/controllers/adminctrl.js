angular.module('main').controller('AdminCtrl',function ($scope,$http,$localForage,$state) {
	console.log("Admin Controller call");
	$http({
		method:"post",
		url:"/user",
		dataType:'json',
	}).then(function (data) {
		console.log("After Login");
		console.log(data);
    })

	$scope.logout = function(){
		console.log("Log out call");
		$http({
			method:'post',
			url:'/logout',
			dataType:'json'
		}).then(function(res){
			if(res.data.status == 200){
				$localForage.clear('UserInfo').then(function(res){
					$state.go('login');
				});
			}
		});
	}
});