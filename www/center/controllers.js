angular.module('10kControllers', ['ionic', 'ionic-material', 'ratings', 'ngResource', 'ngSanitize', 'ionic.utils', 'ngCordova'])
app
    .filter('unsafe', function ($sce) { return $sce.trustAsHtml; })
    .controller('AppCtrl', function ($scope, $rootScope, $ionicLoading, $ionicModal, $state, $timeout, $ionicPopup, $ionicActionSheet, $ionicHistory, $ionicSideMenuDelegate, ionicMaterialMotion, ionicMaterialInk, DataCenter, Thesocket) {
        $scope.auth = JSON.parse(localStorage.getItem('auth'));
        $scope.list_fb = JSON.parse(localStorage.getItem('list_fb'))
        document.addEventListener("deviceready", onDeviceReady, false);

        // load data when user get new coupon from web
        Thesocket.on('user_mobile', function (uid) {
            if (uid === $scope.auth[0].user_id) {
                get_auth();
            }
        })

        function onDeviceReady() {
            var push = PushNotification.init({
                "android": { "senderID": "642203001429" }
            });

            push.on('registration', function (data) {
                if (data.registrationId) {
                    if ($scope.auth !== null && $scope.auth !== undefined) {
                        DataCenter.UpdateNotif($scope.auth[0]._id, data.registrationId).then(function (response) {
                        })
                    }
                }
                // data.registrationId
            });

            push.on('notification', function (data) {
                // alert(data.additionalData.userid + ' - ' + $scope.auth[0].user_id)
                if (data.additionalData.userid === $scope.auth[0].user_id) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Thông báo',
                        template: data.message
                    });
                    data.sound
                }
            });

            push.on('error', function (e) {
                alert(e)
            });
        }

        $ionicSideMenuDelegate.canDragContent(true);
        ionicMaterialInk.displayEffect();
        ionicMaterialMotion.blinds();

        if ($scope.auth) {
            $scope.list_coupon = $scope.auth[0].total_list_coupon;
        }

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

        function get_auth() {
            if ($scope.auth) {
                DataCenter.signIn($scope.auth[0].user_id, $scope.auth[0].user_img).then(function (response) {
                    if (response.data.error_code === 0) {
                        localStorage.setItem('auth', JSON.stringify(response.data.auth));
                        $rootScope.auth_menu = response.data.auth;
                        $scope.list_coupon = response.data.auth[0].total_list_coupon;

                        // kiểm tra coupon chưa feedback
                        if (response.data.auth[0].use_coupon.length > 0) {
                            for (var i = 0; i < response.data.auth[0].use_coupon.length; i++) {
                                if (response.data.auth[0].use_coupon[i].rfeedback[0].id === 1 && response.data.auth[0].use_coupon[i].feedback === "") {
                                    $state.transitionTo('app.listfeedback', null, { reload: false });
                                }
                            }
                        }

                        localStorage.removeItem('last_id');

                        // kiểm tra coupon đang ở trạng thái pending
                        if (response.data.auth[0].role[0].id === 0) {
                            if (response.data.auth[0].total_list_coupon.length > 0) {
                                for (var i = 0; i < response.data.auth[0].total_list_coupon.length; i++) {
                                    if (response.data.auth[0].total_list_coupon[i].approved === "pending") {

                                        $scope.coupon_detail = response.data.auth[0].total_list_coupon[i];

                                        //show message shop and require feedback
                                        Thesocket.on('show_error', function (message, user_id, id) {
                                            var last_id = localStorage.getItem('last_id');
                                            if (last_id !== $scope.coupon_detail._id) {
                                                localStorage.setItem('last_id', $scope.coupon_detail._id);
                                                $scope.error_mesa = message;
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

                                    }
                                }
                            }
                        }

                    }
                });
            }
        }


        $scope.logout = function () {
            $state.transitionTo('app.login', null, { reload: false });
            facebookConnectPlugin.logout();
            $ionicLoading.show({
                template: 'Đang xử lý dữ liệu <br/><br/> <ion-spinner icon="lines" class="spinner-energized"></ion-spinner>',
                duration: 700
            })
            localStorage.clear();
        }

        //keo de cap nhat
        $scope.doRefresh = function () {
            $timeout(function () {
                $scope.$broadcast('scroll.refreshComplete');
                get_auth();
            }, 1500)
        };

        //loading
        $ionicLoading.show({
            template: 'Đang tải dữ liệu <br/><br/> <ion-spinner icon="lines" class="spinner-energized"></ion-spinner>',
            duration: 700
        })
        $scope.loading = true;
        $timeout(function () {
            get_auth();
            $scope.loading = false;
        }, 800);
    })
