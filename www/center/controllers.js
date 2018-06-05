angular.module('10kControllers', ['ionic', 'ionic-material', 'ratings', 'ngResource', 'ngSanitize', 'ionic.utils', 'ngCordova'])
app
    .filter('unsafe', function ($sce) { return $sce.trustAsHtml; })
    .controller('AppCtrl', function ($scope, $rootScope, $window, $ionicModal, $ionicLoading, $state, $timeout, $ionicActionSheet, $ionicHistory, $ionicSideMenuDelegate, ionicMaterialMotion, ionicMaterialInk, DataCenter, Thesocket) {
        

        $scope.auth = JSON.parse(localStorage.getItem('auth'));

        $ionicSideMenuDelegate.canDragContent(true);
        ionicMaterialInk.displayEffect();
        ionicMaterialMotion.blinds();

        if ($scope.auth) {
            $scope.list_coupon = $scope.auth[0].total_list_coupon;
        }

        function get_auth() {
            DataCenter.signIn($scope.auth[0].user_id, $scope.auth[0].user_img).then(function (response) {
                if (response.data.error_code === 0) {
                    localStorage.setItem('auth', JSON.stringify(response.data.auth));
                    $rootScope.auth_menu = response.data.auth;
                    $scope.list_coupon = response.data.auth[0].total_list_coupon;
                }
            });
        }

        $scope.logout = function () {
            $state.transitionTo('app.login', null, { reload: false });
            facebookConnectPlugin.logout();
            $ionicLoading.show({
                template: 'Đang xử lý dữ liệu <br/><br/> <ion-spinner icon="lines" class="spinner-energized"></ion-spinner>',
                duration: 700
            })
            localStorage.clear();
        }

        //keo de cap nhat
        $scope.doRefresh = function () {
            $timeout(function () {
                $scope.$broadcast('scroll.refreshComplete');
                get_auth();
            }, 1500)
        };

        //loading
        $scope.loading = true;
        $timeout(function () {
            get_auth();
            $scope.loading = false;
        }, 1500);
    })
