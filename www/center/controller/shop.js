app
    .controller('ShopCtrl', function ($scope, $state, $ionicModal, $timeout, $ionicPopup, $ionicLoading, $ionicHistory, $ionicSideMenuDelegate, ionicMaterialMotion, ionicMaterialInk, DataCenter, Thesocket) {
        $ionicSideMenuDelegate.canDragContent(true);
        ionicMaterialInk.displayEffect();
        ionicMaterialMotion.blinds();
        $scope.auth = JSON.parse(localStorage.getItem('auth'));
        if ($scope.auth) {
            DataCenter.getShopbyId($scope.auth[0].role[0].shop).then(function (response) {
                if (response.data.error_code === 0) {
                    $scope.list_coupon = response.data.shop[0].shop_use_coupon;
                }
            });
        }

        //get coupon user use for this shop
        Thesocket.on('show_coupon_for_shop', function (shop_id, user_img, user_name) {
            $scope.user_img = user_img;
            $scope.user_name = user_name;
            DataCenter.getShopbyId(shop_id).then(function (response) {
                if (response.data.error_code === 0) {
                    $scope.shop = response.data.shop;
                    if ($scope.auth[0].user_id === $scope.shop[0].shop_boss) {
                        $scope.loading = true;
                        $timeout(function () {
                            $scope.list_coupon = response.data.shop[0].shop_use_coupon;
                            $scope.loading = false;
                        }, 1500);
                    }
                    else {
                        if ($scope.shop[0].shop_manager.length > 0) {
                            for (var i = 0; i < $scope.shop[0].shop_manager.length; i++) {
                                if ($scope.shop[0].shop_manager[i].id === $scope.auth[0].user_id) {
                                    $scope.loading = true;
                                    $timeout(function () {
                                        $scope.list_coupon = response.data.shop[0].shop_use_coupon;
                                        $scope.loading = false;
                                    }, 1500);
                                }
                            }
                        }
                    }
                }
            })
        });

        //keo de cap nhat
        $scope.doRefresh = function () {
            $timeout(function () {
                $scope.$broadcast('scroll.refreshComplete');
                DataCenter.getShopbyId($scope.auth[0].role[0].shop).then(function (response) {
                    if (response.data.error_code === 0) {
                        $scope.list_coupon = response.data.shop[0].shop_use_coupon;
                    }
                });
            }, 1500)
        };

        //loading
        $scope.loading = true;
        $timeout(function () {
            $scope.loading = false;
        }, 1500);


        //reject
        $ionicModal.fromTemplateUrl('./partial/reject.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        //accept coupon or cancel coupon
        $scope.comfirm = function (user_id, id) {
            $scope.user_id = user_id;
            $scope.couponId = id;
            var confirmPopup = $ionicPopup.confirm({
                title: 'Áp dụng Coupon cho khách hàng',
                template: '<div class="row" style="margin-top: 45px;"><img class="coupon-img-avatar" src="' + $scope.user_img + '"></div> <a class= "item" style="text-align:center;">  <span class="coupon-name">' + $scope.user_name + '</span>  </a> ',
                buttons: [{
                    text: 'Hủy',
                    onTap: function (e) {
                        return false;
                    }
                }, {
                    text: 'Ok',
                    type: 'button-positive',
                    onTap: function (e) {
                        return true;
                    }
                }]
            });

            confirmPopup.then(function (res) {
                if (res) {
                    //send success
                    Thesocket.emit('send_error', $scope._message, $scope.user_id, 0);
                    $ionicLoading.show({
                        template: 'Coupon đã được chấp nhận <br/> <i class="ion ion-ios-checkmark coupon-done"></i>',
                        duration: 1500
                    })
                } else {
                    $scope.modal.show();
                }
            });
        }

        //send error message for user
        $scope._message;
        $scope.reject = function (id) {
            if (id === 'true') {
                $scope.show_text = false;
            } else {
                $scope.show_text = true;
            }
        }


        $scope.send_error = function () {
            if ($scope.show_text === false) {
                $scope._message = "Khách không có mặt tại cửa hàng";
            } else {
                $scope._message = jQuery('#message').val();
            }

            //send error
            Thesocket.emit('send_error', $scope._message, $scope.user_id, 1);
            $scope.modal.hide();
            $ionicLoading.show({
                template: 'Đã gửi lý do không chấp nhận tới khách hàng! <br/> <i class="ion ion-ios-checkmark coupon-done"></i>',
                duration: 1500
            })
            DataCenter.CancelCoupon($scope.shop[0].shopId, $scope.couponId).then(function (response) {
                if(response.data.error_code === 0){
                    DataCenter.getShopbyId($scope.auth[0].role[0].shop).then(function (response) {
                        if (response.data.error_code === 0) {
                            $scope.list_coupon = response.data.shop[0].shop_use_coupon;
                        }
                    });
                }
            })
        }
    })