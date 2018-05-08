angular.module('10kControllers', ['ionic', 'ionic-material', 'ngResource', 'ngSanitize', 'ionic.utils', 'ngCordova'])
app
    .controller('AppCtrl', function ($scope, $window, $ionicModal, $state, $timeout, $ionicActionSheet) {
        $scope.go_login = function () {
            localStorage.clear();
            $state.go('app.login', {}, {
                reload: true
            });
        }
    })

    .controller('HomeCtrl', function ($scope, $timeout, $ionicHistory, $ionicSideMenuDelegate, ionicMaterialMotion, ionicMaterialInk) {
        $ionicSideMenuDelegate.canDragContent(true);
        ionicMaterialInk.displayEffect();
        $scope.go_coupon = function () {
            $state.go('app.coupon')
        }
        // ionicMaterialMotion.pushDown({
        //     selector: '.push-down'
        // });
        // ionicMaterialMotion.fadeSlideInRight({
        //     selector: '.item'
        // });
    })
