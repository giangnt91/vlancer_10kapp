app
    .controller('CouponCtrl', function (ionicMaterialInk, $ionicSideMenuDelegate, $ionicHistory) {
        // console.log($routeParams.id)
        ionicMaterialInk.displayEffect();
        $ionicHistory.nextViewOptions({
            disableBack: false
        });
    })