app
    .controller('CouponCtrl', function ($scope, $state, ionicMaterialInk, $ionicSideMenuDelegate, $ionicHistory, $ionicLoading, $stateParams, $ionicModal, $timeout, DataCenter, Thesocket) {
        //effect for link
        ionicMaterialInk.displayEffect();

        //show back buttom
        $ionicHistory.nextViewOptions({
            disableBack: false
        });

        $scope.auth = JSON.parse(localStorage.getItem('auth'));

        if ($stateParams.id) {
            if ($scope.auth[0].total_list_coupon.length > 0) {
                for (var i = 0; i < $scope.auth[0].total_list_coupon.length; i++) {
                    if ($scope.auth[0].total_list_coupon[i]._id === $stateParams.id) {
                        $scope.coupon_detail = $scope.auth[0].total_list_coupon[i];
                    }
                }
            }
        }

        //feedback
        $ionicModal.fromTemplateUrl('./partial/feedback.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        //error
        $ionicModal.fromTemplateUrl('./partial/error.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.error_modal = modal;
        });

        $scope.close_error = function () {
            $state.transitionTo('app.home', null, { reload: false });
            $scope.error_modal.hide();
        }

        $scope.use = function () {
            $ionicLoading.show({
                template: 'Vui lòng chờ cửa hàng chấp nhận Coupon <br/><br/> <ion-spinner icon="lines" class="spinner-energized"></ion-spinner>',
            })

            DataCenter.UseruseCoupon($scope.coupon_detail.shop_id, $scope.coupon_detail).then(function (response) {
                if (response.data.error_code === 0) {
                    Thesocket.emit('user_use_coupon', $scope.coupon_detail.shop_id, $scope.auth[0].user_img, $scope.auth[0].info[0].fulname);
                }
            });
        }

        //show message shop and require feedback
        Thesocket.on('show_error', function (message, user_id, id) {
            $scope.error_mesa = message;
            if (user_id === $scope.auth[0].user_id) {
                if (id === 1) {
                    $ionicLoading.hide();
                    $scope.error_modal.show();
                } else {
                    $ionicLoading.show({
                        template: 'Coupon của bạn đã được chấp nhận <br/> <i class="ion ion-ios-checkmark coupon-done"></i>',
                        duration: 3000
                    })
                    $timeout(function () {
                        if ($scope.coupon_detail.rfeedback[0].id === 1) {
                            $scope.modal.show();
                        } else {
                            $state.transitionTo('app.home', null, { reload: false });
                            DataCenter.UpdateCouponfeed($scope.auth[0]._id, $scope.coupon_detail._id, null, null).then(function (response) {
                            })
                            DataCenter.UpdateRating($scope.coupon_detail.shop_id, $scope.coupon_detail._id, null, null).then(function (res) {
                            })
                        }
                    }, 3000)

                }
            }
        })

        $scope.rate = function (id) {
            $scope.rating = id;
        }

        //save feedback
        $scope.feedback = function () {
            var _message = $("#message").val();
            if ($scope.rating === undefined || $scope.rating === null || _message === "" || _message === null || _message === undefined) {
                $ionicLoading.show({
                    template: 'Bạn vui lòng chấm điểm và nhập nội dung đánh giá ! <br/> <i class="ion ion-sad coupon-done"></i>',
                    duration: 3000
                })
            } else {
                DataCenter.UpdateCouponfeed($scope.auth[0]._id, $scope.coupon_detail._id, $scope.rating, _message).then(function (response) {
                    if (response.data.error_code === 0) {
                        DataCenter.UpdateRating($scope.coupon_detail.shop_id, $scope.coupon_detail._id, $scope.rating, _message).then(function (res) {
                            if (res.data.error_code === 0) {
                                $ionicLoading.show({
                                    template: 'Cám ơn bạn đã đánh giá và chấm điểm cho dịch vụ của chúng tôi ! <br/> <i class="ion ion-happy coupon-done"></i>',
                                    duration: 3000
                                })
                                $timeout(function () {
                                    $scope.modal.hide();
                                }, 3000)
                            }
                        })
                    }
                })

            }

        }
    })