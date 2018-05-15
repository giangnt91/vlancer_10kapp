app
    .controller('CouponCtrl', function ($scope, ionicMaterialInk, $ionicSideMenuDelegate, $ionicHistory, $ionicLoading, $stateParams, $ionicModal, $timeout) {
        //effect for link
        ionicMaterialInk.displayEffect();

        //show back buttom
        $ionicHistory.nextViewOptions({
            disableBack: false
        });

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

        $scope.close_error = function(){
            $scope.error_modal.hide();
        }

        $scope.use = function () {
            $ionicLoading.show({
                template: 'Vui lòng chờ cửa hàng chấp nhận Coupon <br/><br/> <ion-spinner icon="lines" class="spinner-energized"></ion-spinner>',
                duration: 500
            })

            $timeout(function () {
                //shop apcept coupon
                // $ionicLoading.show({
                //     template: 'Coupon của bạn đã được chấp nhận <br/> <i class="ion ion-ios-checkmark coupon-done"></i>',
                //     duration: 50000
                // })
                //if require feedback
                // $scope.modal.show();

                //shop cancel coupon
                $scope.error_modal.show();
                
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