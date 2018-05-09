app
    .controller('CouponCtrl', function ($scope, ionicMaterialInk, $ionicSideMenuDelegate, $ionicHistory, $ionicLoading, $stateParams, $ionicModal, $timeout) {
        //effect for link
        ionicMaterialInk.displayEffect();

        //show back buttom
        $ionicHistory.nextViewOptions({
            disableBack: false
        });

        $ionicModal.fromTemplateUrl('./partial/feedback.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.use = function () {
            $ionicLoading.show({
                template: 'Vui lòng chờ cửa hàng chấp nhận Coupon <br/><br/> <ion-spinner icon="lines" class="spinner-energized"></ion-spinner>',
                duration: 500
            })

            $timeout(function () {
                $scope.modal.show();
            }, 500)

        }

    })