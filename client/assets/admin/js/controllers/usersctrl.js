angular.module('main').controller('UsersCtrl',function ($scope,$rootScope,$resource,$http,$state,toastr,DTOptionsBuilder, DTColumnBuilder) {
    console.log("Users controller call");

    loadList();
    $scope.onUserStatusChange = function(status,id){
        $rootScope.hideLoad = false;  //Loading Stop For Network Operation Start
        $http({
            method:'post',
            url:'/useroperation',
            data:{
                'id':id,
                'vOperation':'status',
                'eStatus':status
            }
        }).then(function(res){
            console.log($rootScope.hideLoad);
            $rootScope.hideLoad = true; //Loading Stop For Network Operation Success
            toastr.success(res.data.message,"Successs");
            console.log(res);
        },function(err){
            console.log($rootScope.hideLoad);
            $rootScope.hideLoad = true;  //Loading Stop For Network Operation Error
            console.log("error call");
            console.log(err);
        })
    }
    $scope.userOperation = function(iUserId,OperationType){
        console.log("Operation Type");
        console.log(OperationType);
        var postData = {
            'id':iUserId,
            'vOperation':OperationType
        }
        if(OperationType == 'view'){
            // $state.go('admin.userdetails',{'id':iUserId});

        }else if(OperationType == 'delete'){
            $http({
                method:'post',
                url:'/useroperation',
                dataType:'json',
                data:postData
            }).then(function(res){
                loadList();
                console.log("Success call");
                console.log(res);
            },function(err){
                console.log("Error");
                console.log(err);
            });
        }else if(OperationType == 'edit'){
            $state.current.data.form_action = "Edit";
            $state.go('admin.userform',{'id':iUserId,'action':'Edit'});
        }

    }
    function loadList() {
        $rootScope.hideLoad = false;  //Loading Stop For Network Operation Start
        $http.post('/user').then(function(response) {
            console.log("Success");
            console.log(response);
            $scope.users = response.data.result;
            $rootScope.hideLoad = true; //Loading Stop For Network Operation Success
        },function(err){
            console.log("Something wrong in list");
            $rootScope.hideLoad = true; //Loading Stop For Network Operation Error
        });
    }

    /**
     * Data Table Integration
     */

    $scope.dtColumns = [
        //here We will add .withOption('name','column_name') for send column name to the server
        //here we will add .newColumn('column_name','Title for column name')
        DTColumnBuilder.newColumn("iUserId", "User ID").withOption('name', 'iUserId'),
        DTColumnBuilder.newColumn("vUserName", "User Name").withOption('name', 'vUserName'),
        DTColumnBuilder.newColumn("vEmail", "Email").withOption('name', 'vEmail'),
        DTColumnBuilder.newColumn("eStatus",'Status').withOption('name','eStatus')
    ];

    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
        dataSrc: "data",
        url: "/serverData",
        type: 'POST',
        dataType:'json'
    }).withOption('processing', true) //for show progress bar
      .withOption('serverSide', true) // for server side processing
      .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
      .withDisplayLength(10) // Page size
      .withOption('aaSorting',[0,'desc']);



});
