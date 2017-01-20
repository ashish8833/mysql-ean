angular.module('main').controller('QuestionDetailsCtrl',function ($scope,$http,$rootScope,$stateParams) {
    console.log("Question Details controller call");
    /**
     * Geting Detais of Question
     */
    var postData = {
        'iQuestionId':$stateParams.id+'',
        'vOperation':'view'
    }
    $http({
        method:'post',
        url:'/questionoperation',
        dataType:'json',
        data:postData
    }).then(function(res){
        console.log("Success call");
        console.log(res);
        $scope.question = res.data.result;
    },function(err){
        console.log("Error");
        console.log(err);
    });
});