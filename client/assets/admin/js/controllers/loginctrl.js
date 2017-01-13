angular.module('main').controller('LoginCtrl',function ($scope,$http,$localForage,$state) {
	$scope.doLogin = function (data) {
        console.log(data);
        console.log($scope.user);
        $http({
            method:'post',
            url:'/login',
            dataType:"json",
            data:{"vEmail":$scope.user.vEmail,"vPassword":$scope.user.vPassword},
        }).then(function(res){
            console.log(res);
            if(res.status == 200){
                $localForage.setItem('UserInfo',res.data).then(function(){

                    $localForage.getItem('UserInfo').then(function(data){
                       console.log("Local Storage Call");
                       console.log(data);
                       $state.go('admin.dashboard');
                   });

                });
            }else{

            }
            console.log("Success call");
        },function(err){
            console.log("Error call");
        });

    }


    $scope.forgotPass = function(data){
	    $http({
	        method:'post',
            url:'/fpass',
            dataType:'json',
            data:{"vEmail":$scope.email}
        }).then(function (res) {
            console.log(res.data.status);
            if(res.data.status == 200){
                console.log("check mail");
            }else if(res.status == 404){
                console.log("User not exists");
            }
        });
    }

});