app
    .controller('ShopCtrl', function ($scope, $state, $ionicModal, $timeout, $ionicPopup, $ionicLoading, $ionicHistory, $ionicSideMenuDelegate, ionicMaterialMotion, ionicMaterialInk, DataCenter, Thesocket) {
        $ionicSideMenuDelegate.canDragContent(true);
        ionicMaterialInk.displayEffect();
        ionicMaterialMotion.blinds();
        $scope.auth = JSON.parse(localStorage.getItem('auth'));

        function getShopbyId(shopId) {
            DataCenter.getShopbyId(shopId).then(function (response) {
                if (response.data.error_code === 0) {
                    $scope.list_coupon = [];
                    $scope.shop = response.data.shop;
                    if ($scope.auth[0].user_id === $scope.shop[0].shop_boss) {
                        // $scope.loading = true;
                        // $timeout(function () {
                            if (response.data.shop[0].shop_use_coupon.length > 0) {
                                for (var i = 0; i < response.data.shop[0].shop_use_coupon.length; i++) {
                                    if (response.data.shop[0].shop_use_coupon[i].approved === "pending") {
                                        $scope.list_coupon.push(response.data.shop[0].shop_use_coupon[i]);
                                    }
                                }
                            }
                        //     $scope.loading = false;
                        // }, 1500);
                    }
                    else {
                        if ($scope.shop[0].shop_manager.length > 0) {
                            for (var i = 0; i < $scope.shop[0].shop_manager.length; i++) {
                                if ($scope.shop[0].shop_manager[i].text === $scope.auth[0].user_id) {
                                    // $scope.loading = true;
                                    // $timeout(function () {
                                        if (response.data.shop[0].shop_use_coupon.length > 0) {
                                            for (var i = 0; i < response.data.shop[0].shop_use_coupon.length; i++) {
                                                if (response.data.shop[0].shop_use_coupon[i].approved === "pending") {
                                                    $scope.list_coupon.push(response.data.shop[0].shop_use_coupon[i]);
                                                }
                                            }
                                        }
                                    //     $scope.loading = false;
                                    // }, 1500);
                                }
                            }
                        }
                    }
                }
            })
        }

        if ($scope.auth) {
            getShopbyId($scope.auth[0].role[0].shop);
        }

        //get coupon user use for this shop
        Thesocket.on('show_coupon_for_shop', function (shop_id, _id) {
            $scope.scouponid = '';
            $scope.sfulname = '';
            // $scope.user_img = user_img;
            // $scope.user_name = user_name;
            $scope.shopId = shop_id;
            $scope._id = _id;
            // $scope.list_coupon = [];
            getShopbyId(shop_id);
        });

        //keo de cap nhat
        $scope.doRefresh = function () {
            $timeout(function () {
                $scope.$broadcast('scroll.refreshComplete');
                getShopbyId($scope.auth[0].role[0].shop);
            }, 1500)
        };

        //loading
        $ionicLoading.show({
            template: 'Đang tải dữ liệu <br/><br/> <ion-spinner icon="lines" class="spinner-energized"></ion-spinner>',
            duration: 700
        })
        $scope.loading = true;
        $timeout(function () {
            $scope.loading = false;
        }, 800);


        //reject
        $ionicModal.fromTemplateUrl('./partial/reject.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        //error
        $ionicModal.fromTemplateUrl('./partial/oneconnect.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.one = modal;
        });

        //one connect to coupon
        Thesocket.on('disableconnect', function (coupon_id, fulname, avatar) {
            $scope.sfulname = fulname;
            $scope.scouponid = coupon_id;
            $scope.savatar = avatar;
        })

        $scope.changef = function (user_id, id, coupon_id, avatar, name) {
            if ($scope.scouponid !== '') {
                $scope.one.show();
            } else {
                //accept coupon or cancel coupon

                // $scope.comfirm = function (user_id, id, coupon_id, avatar, name, shop_img) {
                    Thesocket.emit('oneconnect', coupon_id, $scope.auth[0].info[0].fulname, $scope.auth[0].user_img);
                    $scope.user_id = user_id;
                    $scope.couponId = id;
                    $scope.the_id = coupon_id;
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Áp dụng cho khách hàng',
                        cssClass: '',
                        template: '<div class="row" style="margin-top: 45px;"><img class="coupon-img-avatar" src="' + avatar + '"></div> <a class= "item" style="text-align:center;">  <span class="coupon-name">' + name + '</span>  </a> ',
                        buttons: [{
                            text: 'Hủy',
                            type: 'button-positive',
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

                            DataCenter.AcceptCoupon($scope.shop[0].shopId, $scope.couponId, $scope.the_id).then(function (response) {
                                if (response.data.error_code === 0) {
                                    // Thesocket.emit('user_use_coupon', $scope.shop[0].shopId);
                                    getShopbyId($scope.auth[0].role[0].shop);

                                    DataCenter.UpdateCouponfeed($scope._id, $scope.the_id, null, "").then(function (response) {
                                    })
                                    DataCenter.UpdateRating($scope.shopId, $scope.the_id, null, "").then(function (res) {
                                    })
                                }
                            });
                        } else {
                            $scope.modal.show();
                        }
                    });
                // }
            }
        }

        $scope.close_one = function(){
            $scope.one.hide();
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
                $scope._message = jQuery('#rejectmessage').val();
            }

            //send error
            Thesocket.emit('send_error', $scope._message, $scope.user_id, 1);
            $scope.modal.hide();
            $ionicLoading.show({
                template: 'Đã gửi lý do không chấp nhận tới khách hàng! <br/> <i class="ion ion-ios-checkmark coupon-done"></i>',
                duration: 1500
            })
            
            DataCenter.CancelCoupon($scope.shop[0].shopId, $scope.couponId).then(function (response) {
                if (response.data.error_code === 0) {
                    // Thesocket.emit('user_use_coupon', $scope.shop[0].shopId);
                    getShopbyId($scope.auth[0].role[0].shop);
                }
            })
        }
    })