app
    .controller('ShopCtrl', function ($scope, $state, $timeout, $ionicHistory, $ionicSideMenuDelegate, ionicMaterialMotion, ionicMaterialInk, DataCenter, Thesocket) {
        $ionicSideMenuDelegate.canDragContent(true);
        ionicMaterialInk.displayEffect();
        ionicMaterialMotion.blinds();
        $scope.auth = JSON.parse(localStorage.getItem('auth'));
        if ($scope.auth) {
            DataCenter.getShopbyId(shop_id).then(function (response) {
                if (response.data.error_code === 0) {
                    $scope.list_coupon = response.data.shop[0].shop_use_coupon;
                }
            });
        }

        //get coupon user use for this shop
        Thesocket.on('show_coupon_for_shop', function (shop_id) {
            DataCenter.getShopbyId(shop_id).then(function (response) {
                if (response.data.error_code === 0) {
                    $scope.shop = response.data.shop;
                    if ($scope.auth[0].user_id === $scope.shop[0].shop_boss) {
                        // alert('shop ban vua co nguoi su dung coupon shop boss');
                        $scope.shop_detail = false;
                        $scope.loading = true;
                        $timeout(function () {
                            $scope.loading = false;
                            $scope.shop_detail = true;
                        }, 1500);
                    }
                    else {
                        if ($scope.shop[0].shop_manager.length > 0) {
                            for (var i = 0; i < $scope.shop[0].shop_manager.length; i++) {
                                if ($scope.shop[0].shop_manager[i].id === $scope.auth[0].user_id) {
                                    // alert('shop ban vua co nguoi su dung coupon shop manager');
                                    $scope.shop_detail = false;
                                    $scope.loading = true;
                                    $timeout(function () {
                                        $scope.loading = false;
                                        $scope.shop_detail = true;
                                    }, 1500);
                                }
                            }
                        }
                    }
                }
            })
        });

        //loading
        $scope.loading = true;
        $timeout(function () {
            $scope.loading = false;
        }, 3000);

    })