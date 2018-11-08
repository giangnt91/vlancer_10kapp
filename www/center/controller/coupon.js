app
    .controller('CouponCtrl', function ($scope, $filter, $state, $ionicPopup, ionicMaterialInk, ionicMaterialMotion, $ionicSideMenuDelegate, $ionicHistory, $ionicLoading, $stateParams, $ionicModal, $timeout, DataCenter, Thesocket) {
        //effect for link
        ionicMaterialInk.displayEffect();
        ionicMaterialMotion.blinds();

        // $ionicLoading.show({
        //     template: 'Đang tải dữ liệu <br/><br/> <ion-spinner icon="lines" class="spinner-energized"></ion-spinner>',
        //     duration: 800
        // })

        //loading
        // $scope.loading = true;
        // $timeout(function () {
        //     // get_auth();
        //     $scope.loading = false;
        // }, 1000);

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

        //conver day to int for compare
        function process(x) {
            var parts = x.split("/");
            return parts[2] + parts[1] + parts[0];
        }

        $scope.use = function () {
            var date = new Date();
            _year = date.getFullYear();
            _month = date.getMonth() + 1;
            if (_month < 10) {
                _month = "0" + _month;
            }
            _day = date.getDate();
            var _limit = process($scope.coupon_detail.limit_time);
            var _today = _year + '' + _month + '' + _day;

            // alert(_limit);
            // alert(_today);

            // check expired time
            if (parseInt(_limit) > parseInt(_today)) {
                // <ion-spinner icon="lines" class="spinner-energized"></ion-spinner>
                $ionicLoading.show({
                    template: 'Vui lòng chờ cửa hàng duyệt trong<br/><br/> <div class="timer" data-seconds-left=60><span id="seconds">60</span> giây </div>',
                })

                DataCenter.UseruseCoupon($scope.coupon_detail.shop_id, $scope.coupon_detail).then(function (response) {
                    if (response.data.error_code === 0) {
                        DataCenter.waitShopApproved($scope.auth[0]._id, $scope.coupon_detail._id).then(function (res) {
                            if (res.data.error_code === 0) {
                                Thesocket.emit('user_use_coupon', $scope.coupon_detail.shop_id, $scope.auth[0]._id);
                            }
                        })
                    }
                });

                $scope.shopinreview = false;
                Thesocket.on('disableconnect', function (coupon_id, fulname) {
                    $scope.shopinreview = true;
                })

                //timeout 60s
                $(function(){
                    $('.timer').startTimer();
                });
                $timeout(function () {
                    // if ($scope.shopinreview === false) {
                    DataCenter.TimeoutCoupon($scope.coupon_detail.shop_id, $scope.coupon_detail._id).then(function (response) {
                        if (response.data.error_code === 0) {
                            DataCenter.TimeoutUser($scope.auth[0]._id, $scope.coupon_detail._id).then(function (res) {
                                if (res.data.error_code === 0) {
                                    $ionicLoading.hide();
                                    $ionicLoading.show({
                                        template: 'Cửa hàng không phản hồi vui lòng thử lại.',
                                    })
                                    $timeout(function(){
                                        $ionicLoading.hide();
                                    }, 3000);
                                    Thesocket.emit('user_use_coupon', $scope.coupon_detail.shop_id, $scope.auth[0]._id);
                                }
                            })
                        }
                    })
                    // }
                }, 60000)

            } else {
                $ionicLoading.show({
                    template: 'Coupon của bạn đã hết hạn hệ thống sẽ tiến hành xóa coupon. Vui lòng chờ .... <br/><br/> <ion-spinner icon="lines" class="spinner-energized"></ion-spinner>'
                })
                $timeout(function () {
                    DataCenter.RemoveCoupon($scope.auth[0]._id, $scope.coupon_detail._id).then(function (response) {
                        if (response.data.error_code === 0) {
                            $ionicLoading.hide();
                            $state.transitionTo('app.home', null, { reload: false });
                        } else {
                            $ionicLoading.hide();
                            $state.transitionTo('app.home', null, { reload: false });
                        }
                    })
                }, 3000)
            }
        }

        //show message shop and require feedback
        localStorage.removeItem('last_id');
        Thesocket.on('show_error', function (message, user_id, id) {
            $scope.error_mesa = message;
            var last_id = localStorage.getItem('last_id');
            if (last_id !== $scope.coupon_detail._id) {
                localStorage.setItem('last_id', $scope.coupon_detail._id);
                if (user_id[0].id === $scope.auth[0].user_id) {
                    if (id === 1) {
                        $ionicLoading.hide();
                        $scope.error_modal.show();
                        DataCenter.TimeoutUser($scope.auth[0]._id, $scope.coupon_detail._id).then(function (res) {
                        })
                    } else {
                        $ionicLoading.show({
                            template: 'Coupon của bạn đã được chấp nhận <br/> <i class="ion ion-ios-checkmark coupon-done"></i>',
                            duration: 3000
                        })
                        $timeout(function () {
                            if ($scope.coupon_detail.rfeedback[0].id === 1) {
                                // DataCenter.UpdateCouponfeed($scope.auth[0]._id, $scope.coupon_detail._id, null, "").then(function (response) {
                                // })
                                // DataCenter.UpdateRating($scope.coupon_detail.shop_id, $scope.coupon_detail._id, null, "").then(function (res) {
                                // })
                                $scope.modal.show();
                            } else {
                                $state.transitionTo('app.home', null, { reload: false });
                                // DataCenter.UpdateCouponfeed($scope.auth[0]._id, $scope.coupon_detail._id, null, "").then(function (response) {
                                // })
                                // DataCenter.UpdateRating($scope.coupon_detail.shop_id, $scope.coupon_detail._id, null, "").then(function (res) {
                                // })
                            }
                        }, 3000)
                    }
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
                    template: 'Bạn vui lòng chấm điểm và nhập nội dung đánh giá ! <br/> <i class="ion ion-sad coupon-false"></i>',
                    duration: 3000
                })
            } else {
                DataCenter.UpdateAfterUser($scope.auth[0]._id, $scope.coupon_detail._id, $scope.rating, _message).then(function (response) {
                    if (response.data.error_code === 0) {
                        DataCenter.UpdateRating($scope.coupon_detail.shop_id, $scope.coupon_detail._id, $scope.rating, _message).then(function (res) {
                            if (res.data.error_code === 0) {
                                $ionicLoading.show({
                                    template: 'Cám ơn bạn đã đánh giá và chấm điểm cho dịch vụ của chúng tôi ! <br/> <i class="ion ion-happy coupon-done"></i>',
                                    duration: 3000
                                })

                                $("#message").val(null);

                                $timeout(function () {
                                    $scope.modal.hide();
                                    $state.transitionTo('app.home', null, { reload: false });
                                }, 3000)
                            }
                        })
                    }
                })

            }

        }
    })