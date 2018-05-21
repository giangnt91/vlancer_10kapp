app
    .controller('CouponCtrl', function ($scope, ionicMaterialInk, $ionicSideMenuDelegate, $ionicHistory, $ionicLoading, $stateParams, $ionicModal, $timeout, DataCenter, Thesocket) {
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
                    if ($scope.auth[0].total_list_coupon[i].id === $stateParams.id) {
                        $scope.coupon_detail = element;
                    }
                }
                // $scope.auth[0].total_list_coupon.forEach(element => {
                //     if (element._id === $stateParams.id) {
                //         $scope.coupon_detail = element;
                //     }
                // });
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

        $scope.error_mesa = "bạn xài coupon giả nên không được chấp nhận nhé !";

        $scope.close_error = function () {
            $scope.error_modal.hide();
        }

        $scope.use = function () {
            $ionicLoading.show({
                template: 'Vui lòng chờ cửa hàng chấp nhận Coupon <br/><br/> <ion-spinner icon="lines" class="spinner-energized"></ion-spinner>',
                duration: 5000
            })

            DataCenter.UseruseCoupon($scope.coupon_detail.shop_id, $scope.coupon_detail).then(function (response) {
                if (response.data.error_code === 0) {
                    Thesocket.emit('user_use_coupon', $scope.coupon_detail.shop_id, $scope.auth[0].user_img, $scope.auth[0].info[0].fulname);
                }
            });


            $timeout(function () {
                //shop apcept coupon
                // $ionicLoading.show({
                //     template: 'Coupon của bạn đã được chấp nhận <br/> <i class="ion ion-ios-checkmark coupon-done"></i>',
                //     duration: 50000
                // })
                //if require feedback
                // $scope.modal.show();

                //shop cancel coupon
                // $scope.error_modal.show();
                Thesocket.on('show_error', function (message, user_id) {
                    alert('user id: ' + user_id + ' tin nhan: ' + message)
                })
            }, 500)

        }


        $scope.rate = function (id) {
            $scope.rating = id;
        }

        $scope.feedback = function () {
            var _message = $("#message").val();
            alert(_message)
        }

    })