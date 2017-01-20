angular.module('main').controller('QuestionCtrl',function ($scope,$http,$rootScope,toastr,$state) {
    console.log("Question controller call");
    /**
     * Generate Question List
     */
    listQuestion();
    function listQuestion(){
        $rootScope.hideLoad = false;  //Loading Stop For Network Operation Start
        $http.post('/question').then(function(response) {
            console.log("Success");
            console.log(response);
            $scope.questions = response.data.result;
            $rootScope.hideLoad = true; //Loading Stop For Network Operation Success
        },function(err){
            console.log("Something wrong in list");
            $rootScope.hideLoad = true; //Loading Stop For Network Operation Error
        });
    }


    /**
     * Question Operation View,Status,Delete
     */
    $scope.qOperation = function(id,vOperation,eStatus = ""){
        if(vOperation == 'view'){
            $state.go('admin.questiondetails',{'id':id});
        }else{
            $http({
                method:'post',
                url:'/questionoperation',
                dataType:'json',
                data:{'iQuestionId':id+'','vOperation':vOperation,'eStatus':eStatus}
            }).then(function(res){
                console.log("Success call");
                console.log(res.data.status);
                if(res.data.status == 200){
                    toastr.success(res.data.message,"Successs");
                }else{
                    toastr.error(res.data.message,"Error");
                }
            },function(err){
                console.log("Error");
                console.log(err);
            });
        }
    }
});

