angular.module('main').controller('UsersCtrl',function ($scope,$resource,$http,$state,toastr,DTOptionsBuilder, DTColumnBuilder) {
    console.log("Users controller call");
    // $resource('http://l-lin.github.io/angular-datatables/archives/data.json').query().$promise.then(function(persons) {
    //    $scope.persons = persons;
    // });

    // $http({
    //     method:'get',
    //     url:'http://l-lin.github.io/angular-datatables/archives/data.json',
    //     dataType:'json'
    // }).then(function (res) {
    //     console.log("Success");
    //     $scope.persons = res;
    // },function(err){
    //     console.log("Error show");
    // })
    $http.post('/user').then(function(response) {
        console.log("Success");
        console.log(response);
        $scope.persons = response.data.result;
    });

    $scope.userOperation = function(iUserId,OperationType){
        if(OperationType == 'view'){
            $state.go('admin.userdetails',{'id':iUserId});
        }
        // var postData = {
        //     'id':iUserId,
        //     'vOperation':OperationType
        // }
        // $http({
        //     method:'post',
        //     url:'/useroperation',
        //     dataType:'json',
        //     data:postData
        // }).then(function(res){
        //     console.log("Success call");
        //     console.log(res);
        // },function(err){
        //     console.log("Error");
        //     console.log(err);
        //
        // });
    }


});
