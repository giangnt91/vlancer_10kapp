angular.module('10kControllers', ['ionic', 'ionic-material', 'ratings', 'ngResource', 'ngSanitize', 'ionic.utils', 'ngCordova'])
app
    .controller('AppCtrl', function ($scope, $window, $ionicModal, $state, $timeout, $ionicActionSheet) {
        $scope.auth = JSON.parse(localStorage.getItem('auth'));
        $scope.go_login = function () {
            localStorage.clear();
            $state.go('app.login', {}, {
                reload: true
            });
        }
    })

    .controller('HomeCtrl', function ($scope, $state, $timeout, $ionicHistory, $ionicSideMenuDelegate, ionicMaterialMotion, ionicMaterialInk, DataCenter) {
        $ionicSideMenuDelegate.canDragContent(true);
        ionicMaterialInk.displayEffect();
        ionicMaterialMotion.blinds();
        $scope.auth = JSON.parse(localStorage.getItem('auth'));
        if ($scope.auth) {
            $scope.list_coupon = $scope.auth[0].total_list_coupon;
        }

        $scope.go_coupon = function () {
            $state.go('app.coupon')
        }

        $scope.doRefresh = function () {
            $timeout(function () {
                $scope.$broadcast('scroll.refreshComplete');
                DataCenter.signIn($scope.auth[0].user_id, $scope.auth[0].user_img).then(function (response) {
                    if (response.data.error_code === 0) {
                        localStorage.setItem('auth', JSON.stringify(response.data.auth));
                        $scope.list_coupon = response.data.auth[0].total_list_coupon;
                        $scope.$apply();
                    }
                });
            }, 3000)
        };

        //loading
        $scope.loading = true;
        $timeout(function () {
            $scope.loading = false;
        }, 3000);
    })
