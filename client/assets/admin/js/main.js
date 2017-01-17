'use strict';
var app = angular.module('main',['ui.router',
    'ui.bootstrap',
    'ngAnimate',
    'oc.lazyLoad',
    'LocalForageModule',
	'toastr',
    'datatables',
    'ngResource'

]);
app.config(function($stateProvider,$urlRouterProvider,$locationProvider,$ocLazyLoadProvider,$localForageProvider,toastrConfig){
	$ocLazyLoadProvider.config({
		cssFilesInsertBefore:'ng_load_plugins_before'
	});
	$urlRouterProvider.otherwise('/admin/dashboard');
	$stateProvider.state('login',{
		url:'/',
		templateUrl:'templates/admin/login.html',
		data : { pageTitle: 'Login',bodyClass:'login'},
		controller:'LoginCtrl',
		resolve: {
			depends: ['$ocLazyLoad',function($ocLazyLoad){
				return $ocLazyLoad.load({
					name: 'main',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before
                        files: [
                            'assets/admin/pages/css/login.css',
                            'assets/admin/js/controllers/loginctrl.js',
                        ]
				});
			}]
		}
	})
	.state('admin',{
		url:'/admin',
		templateUrl:'templates/admin/admin.html',
		data : {bodyClass:'page-header-fixed page-sidebar-closed-hide-logo page-sidebar-closed-hide-logo' },
		controller:'AdminCtrl',
		abstract:true,
		resolve:{
			depends:['$ocLazyLoad',function($ocLazyLoad){
				return $ocLazyLoad.load({
					name:'main',
					insertBefore: '#ng_load_plugins_before',
					files:[
						'assets/admin/js/controllers/adminCtrl.js'
					]
				});
			}]
		}
	})
	.state('admin.dashboard',{
		url:'/dashboard',
		templateUrl:'templates/admin/dashboard.html',
		data :{ pageTitle:'Dashboard',bodyClass:'page-header-fixed page-sidebar-closed-hide-logo page-sidebar-closed-hide-logo' },
		controller:'DashboardCtrl',
		resolve:{
			depends:['$ocLazyLoad',function($ocLazyLoad){
				console.log("Lazy Load Call");
				return $ocLazyLoad.load({
					name:'main',
                    insertBefore:'#ng_load_plugins_before',
					files:[
						'assets/admin/js/controllers/dashboardctrl.js'
					]
				});
			}]
		}
	})
    .state('admin.cpass',{
            url:'/cpass',
            templateUrl:'templates/admin/cpass.html',
            data :{ pageTitle:'Change Password',bodyClass:'page-header-fixed page-sidebar-closed-hide-logo page-sidebar-closed-hide-logo' },
            controller:'ChangePassCtrl',
            resolve:{
                depends:['$ocLazyLoad',function($ocLazyLoad){
                    console.log("Lazy Load Call");
                    return $ocLazyLoad.load({
                        name:'main',
                        insertBefore:'#ng_load_plugins_before',
                        files:[
                            'assets/admin/js/controllers/changepassctrl.js',
                        ]
                    });
            }]
    	}
    })
    .state('admin.sitesetting',{
        url:'/sitesetting',
        templateUrl:'templates/admin/sitesettings.html',
        data :{ pageTitle:'Change Password',bodyClass:'page-header-fixed page-sidebar-closed-hide-logo page-sidebar-closed-hide-logo' },
        controller:'SiteSettingsCtrl',
        resolve:{
            depends:['$ocLazyLoad',function($ocLazyLoad){
                console.log("Lazy Load Call");
                return $ocLazyLoad.load({
                    name:'main',
                    insertBefore:'#ng_load_plugins_before',
                    files:[
                        'assets/admin/js/controllers/sitesettingctrl.js',
                    ]
                });
            }]
        }
    })
    .state('admin.users',{
            url:'/users',
            templateUrl:'templates/admin/users.html',
            data :{ pageTitle:'Change Password',bodyClass:'page-header-fixed page-sidebar-closed-hide-logo page-sidebar-closed-hide-logo' },
            controller:'UsersCtrl',
            resolve:{
                depends:['$ocLazyLoad',function($ocLazyLoad){
                    console.log("Lazy Load Call");
                    return $ocLazyLoad.load({
                        name:'main',
                        insertBefore:'#ng_load_plugins_before',
                        files:[
                            'assets/admin/js/controllers/usersctrl.js',
                            //This css for datatable with bootstrap class name table table-striped table-bordered
                            // 'node_modules/datatables/media/css/jquery.dataTables.min.css'
                           ]
                    });
                }]
            }
    })
    .state('admin.userdetails',{
            url:'/userdetails/:id',
            templateUrl:'templates/admin/userdetails.html',
            data :{ pageTitle:'Change Password',bodyClass:'page-header-fixed page-sidebar-closed-hide-logo page-sidebar-closed-hide-logo' },
            controller:'UserDetailsCtrl',
            resolve:{
                depends:['$ocLazyLoad',function($ocLazyLoad){
                    console.log("Lazy Load Call");
                    return $ocLazyLoad.load({
                        name:'main',
                        insertBefore:'#ng_load_plugins_before',
                        files:[
                            'assets/admin/pages/css/profile.css',
                            'assets/admin/js/controllers/userdetailsctrl.js',

                        ]
                    });
                }]
            }
    });
	$locationProvider.hashPrefix('');

	// To define only one db driver - Logout issue (Because WebSql and Indexdb both store data)
    $localForageProvider.config({
        driver      : localforage.WEBSQL, // Force WebSQL; same as using setDriver()
        name        : 'Pemdas',
        version     : 1.0,
        size        : 4980736, // Size of database, in bytes. WebSQL-only for now.
    });

    angular.extend(toastrConfig, {
        allowHtml: false,
        closeButton: false,
        closeHtml: '<button>&times;</button>',
        extendedTimeOut: 1000,
		timeOut: 3000,
        toastClass: 'toast',
        titleClass: 'toast-title'
    });

});

app.run(function($state,$rootScope,$http,$localForage){
	$rootScope.$on('$stateChangeStart',function(event,toState,fromState,fromParams,$localtion){
		var currentState = toState.name;
		if(currentState){
			console.log(currentState);
			$localForage.getItem('UserInfo').then(function(data){
				if(data != null){
					console.log(data.status === 200);
                    if(data.status === 200){
						var notAllowed = ['login','admin'];
                        if(notAllowed.indexOf(currentState) > -1){
                            $state.go('admin.dashboard');
                        }
                        $http.defaults.headers.common.Authorization = 'JWT '+data.token;
					}
					else{
                    	$state.go("login");
					}
                }else{
                    $state.go('login');
                }
			});
		}



	});
	$rootScope.$state = $state;
	console.log("hello");

})

app.controller('GlobalCtrl',function ($scope) {
	console.log("Global Controller call");
});
app.controller('AppCtrl', function ($scope) {
	console.log("App Controller call");
});

app.directive('ngSpinnerBar', ['$rootScope',
    function ($rootScope) {
        return {
            link: function (scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide');

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function() {
                    element.removeClass('hide'); // show spinner bar
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function() {
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu

                    // // auto scorll to page top
                    // setTimeout(function() {
                    //     Metronic.scrollTop(); // scroll to the top on content load
                    // }, $rootScope.settings.layout.pageAutoScrollOnLoad);
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function() {
                    element.addClass('hide'); // hide spinner bar
                });


                // handle errors
                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('hide'); // hide spinner bar
                });

                // count how many time requests were sent to the server
                // so when they all done the spinner will be removed
                scope.counterNetwork = 0;
				$rootScope.$on('$stateNetworkRequestStarted', function () {
                    scope.counterNetwork++;
                    element.removeClass('hide'); // show spinner bar
                    //  $('body').addClass('page-on-load');
                });

                $rootScope.$on('$stateNetworkRequestEnded', function () {
                    scope.counterNetwork--;
                    if (scope.counterNetwork <= 0) {
                        scope.counterNetwork = 0;
                        element.addClass('hide'); // show spinner bar
                        //  $('body').removeClass('page-on-load'); // remove page loading indicator
                    }

                });

            }
        };
    }
]);
//Angular Bootstrap Switch
app.directive('bootstrapSwitch', [
    function() {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function(scope, element, attrs, ngModel) {
                element.bootstrapSwitch();

                element.on('switchChange.bootstrapSwitch', function(event, state) {
                    if (ngModel) {
                        scope.$apply(function() {
                            ngModel.$setViewValue(state);
                        });
                    }
                });

                scope.$watch(attrs.ngModel, function(newValue, oldValue) {
                    if (newValue) {
                        console.log("True");
                        element.bootstrapSwitch('state', true, true);
                    } else {
                        console.log("False");
                        element.bootstrapSwitch('state', false, true);
                    }
                });
            }
        };
    }
]);

