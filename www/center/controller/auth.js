app
    .controller('LoginCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicSideMenuDelegate, Thesocket, $ionicLoading, $timeout, ionicMaterialInk, $ionicLoading, DataCenter) {
        ionicMaterialInk.displayEffect();
        $ionicSideMenuDelegate.canDragContent(false);

        $scope.auth = JSON.parse(localStorage.getItem('auth'));

        $ionicLoading.show({
            template: 'Đang xử lý dữ liệu <br/><br/> <ion-spinner icon="lines" class="spinner-energized"></ion-spinner>',
            duration: 500
        })

        DataCenter.signIn('131832634444261', 'https://graph.facebook.com/131832634444261/picture?width=180&height=180').then(function (response) {
            if (response.data.error_code === 0) {
                localStorage.setItem('auth', JSON.stringify(response.data.auth));

                $rootScope.auth_menu = response.data.auth;
                if ($scope.auth_menu[0].role[0].id === 2 || $scope.auth_menu[0].role[0].id === 3) {
                    $rootScope._menu_shop = true;
                } else {
                    $rootScope._menu_shop = false;
                }

                $rootScope.list_fb = [];
                //check exit feedback
                if ($scope.auth_menu[0].use_coupon.length > 0) {
                    // $scope.auth_menu[0].use_coupon.forEach(element => {
                    //     if (element.rfeedback[0].id === 1 && element.feedback === "") {
                    //         $rootScope.list_fb.push(element);
                    //     }
                    // });
                    for (var i = 0; i < $scope.auth_menu[0].use_coupon.length; i++) {
                        if($scope.auth_menu[0].use_coupon[i].rfeedback[0].id === 1 && $scope.auth_menu[0].use_coupon[i].feedback === ""){
                            $rootScope.list_fb.push($scope.auth_menu[0].use_coupon[i]);
                        }
                    }
                    localStorage.setItem('list_fb', JSON.stringify($rootScope.list_fb));
                }

                //hide back button when after login
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });

                $ionicLoading.show({
                    template: 'Đang xử lý dữ liệu <br/><br/> <ion-spinner icon="lines" class="spinner-energized"></ion-spinner>',
                    duration: 500
                })

                $timeout(function () {
                    if (response.data.auth[0].role[0].id === 3 || response.data.auth[0].role[0].id === 2) {
                        $state.transitionTo('app.shop', null, { reload: false });
                    } else {
                        $state.transitionTo('app.home', null, { reload: false });
                    }
                }, 500)

            } else if (response.data.error_code === 5) {
                $ionicLoading.show({
                    template: 'Tài khoản của bạn đang bị khóa !',
                    duration: 3500
                })
            } else if (response.data.error_code === 2) {
                $ionicLoading.show({
                    template: 'Truy cập Website để đăng ký tài khoản trước khi đăng nhập trên app !',
                    duration: 3500
                })
            }
        });

        if ($scope.auth) {
            $timeout(function () {
                $rootScope.auth_menu = $scope.auth;
                $rootScope.list_fb = [];
                //check exit feedback
                if ($scope.auth[0].use_coupon.length > 0) {
                    // $scope.auth[0].use_coupon.forEach(element => {
                    //     if (element.rfeedback[0].id === 1 && element.feedback === "") {
                    //         $rootScope.list_fb.push(element);
                    //     }
                    // });
                    for (var i = 0; i < $scope.auth[0].use_coupon.length; i++) {
                        if($scope.auth[0].use_coupon[i].rfeedback[0].id === 1 && $scope.auth[0].use_coupon[i].feedback === ""){
                            $rootScope.list_fb.push($scope.auth[0].use_coupon[i]);
                        }
                    }

                    localStorage.setItem('list_fb', JSON.stringify($rootScope.list_fb));
                }

                if ($scope.auth[0].role[0].id === 2 || $scope.auth[0].role[0].id === 3) {
                    $rootScope._menu_shop = true;
                } else {
                    $rootScope._menu_shop = false;
                }
                //hide back button when after login
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });

                if ($scope.auth[0].role[0].id === 3 || $scope.auth[0].role[0].id === 2) {
                    $state.transitionTo('app.shop', null, { reload: false });
                } else {
                    $state.transitionTo('app.home', null, { reload: false });
                }
            }, 500)
        }

        $scope.login = function () {
            var fbLoginSuccess = function (userData) {
                url_img = "https://graph.facebook.com/" + userData.authResponse.userID + "/picture?width=180&height=180";
                DataCenter.signIn(userData.authResponse.userID, url_img).then(function (response) {
                    if (response.data.error_code === 0) {
                        localStorage.setItem('auth', JSON.stringify(response.data.auth));

                        $rootScope.auth_menu = response.data.auth;
                        if ($scope.auth_menu[0].role[0].id === 2 || $scope.auth_menu[0].role[0].id === 3) {
                            $rootScope._menu_shop = true;
                        } else {
                            $rootScope._menu_shop = false;
                        }

                        $rootScope.list_fb = [];
                        //check exit feedback
                        if ($scope.auth_menu[0].use_coupon.length > 0) {
                            // $scope.auth_menu[0].use_coupon.forEach(element => {
                            //     if (element.rfeedback[0].id === 1 && element.feedback === "") {
                            //         $rootScope.list_fb.push(element);
                            //     }
                            // });
                            for (var i = 0; i < $scope.auth_menu[0].use_coupon.length; i++) {
                                if($scope.auth_menu[0].use_coupon[i].rfeedback[0].id === 1 && $scope.auth_menu[0].use_coupon[i].feedback === ""){
                                    $rootScope.list_fb.push($scope.auth_menu[0].use_coupon[i]);
                                }
                            }
                            localStorage.setItem('list_fb', JSON.stringify($rootScope.list_fb));
                        }

                        //hide back button when after login
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });

                        $ionicLoading.show({
                            template: 'Đang xử lý dữ liệu <br/><br/> <ion-spinner icon="lines" class="spinner-energized"></ion-spinner>',
                            duration: 500
                        })

                        $timeout(function () {
                            if (response.data.auth[0].role[0].id === 3 || response.data.auth[0].role[0].id === 2) {
                                $state.transitionTo('app.shop', null, { reload: false });
                            } else {
                                $state.transitionTo('app.home', null, { reload: false });
                            }
                        }, 500)

                    } else if (response.data.error_code === 5) {
                        $ionicLoading.show({
                            template: 'Tài khoản của bạn đang bị khóa !',
                            duration: 3500
                        })
                    } else if (response.data.error_code === 2) {
                        $ionicLoading.show({
                            template: 'Truy cập Website để đăng ký tài khoản trước khi đăng nhập trên app !',
                            duration: 3500
                        })
                    }
                });
            }

            facebookConnectPlugin.login(["public_profile"], fbLoginSuccess,
                function (error) {
                    $scope.error = true;
                    $timeout(function () {
                        $scope.error = false;
                        // $scope.$apply();
                    }, 3500);
                }
            );
        }
    })

    .controller('AccountCtrl', function ($scope, $timeout, $ionicHistory, $ionicPopup, ionicMaterialInk, $ionicModal, $ionicLoading, $ionicSideMenuDelegate, DataCenter) {
        $ionicSideMenuDelegate.canDragContent(true);
        ionicMaterialInk.displayEffect();

        $scope.auth = JSON.parse(localStorage.getItem('auth'));
        $scope.list_fb = JSON.parse(localStorage.getItem('list_fb'));

         //hide back button when after login
        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        function goFeedback(listFb){
            if($scope.list_fb.length > 0){
                var alertPopup = $ionicPopup.alert({
                    title: 'Thông Báo',
                    template: 'Có '+$scope.list_fb.length+' Coupon chưa được Feedback, bạn phải thực hiện Feedback trước khi sử dụng Coupon mới.',
                });       
            }
        }

        function get_auth() {
            DataCenter.signIn($scope.auth[0].user_id, $scope.auth[0].user_img).then(function (response) {
                if (response.data.error_code === 0) {
                    $scope.list_fb = [];
                    //check exit feedback
                    if (response.data.auth[0].use_coupon.length > 0) {
                        // response.data.auth[0].use_coupon.forEach(element => {
                        //     if (element.rfeedback[0].id === 1 && element.feedback === "") {
                        //         $scope.list_fb.push(element);
                        //     }
                        // });
                        for (var i = 0; i < response.data.auth[0].use_coupon.length; i++) {
                            if(response.data.auth[0].use_coupon[i].rfeedback[0].id === 1 && response.data.auth[0].use_coupon[i].feedback === ""){
                                $scope.list_fb.push(response.data.auth[0].use_coupon[i]);
                            }
                        }

                        goFeedback();
                    }
                }
            });
        }

        get_auth();

        //keo de cap nhat
        $scope.doRefresh = function () {
            $timeout(function () {
                $scope.$broadcast('scroll.refreshComplete');
                get_auth();
            }, 1500)
        };

        //feedback
        $ionicModal.fromTemplateUrl('./partial/refeedback.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.show_feedback = function (id) {
            // $scope.list_fb.forEach(element => {
            //     if(element._id === id){
            //         $scope.coupon_detail = element;
            //     }
            // });
            for(var i =0; i<$scope.list_fb.length; i++){
                if($scope.list_fb[i]._id === id){
                    $scope.coupon_detail = $scope.list_fb[i];
                }
            }
            $scope.modal.show();
        }

        $scope.rate = function (id) {
            $scope.rating = id;
        }

        //save feedback
        $scope.feedback = function () {
            var _message = $("#remessage").val();
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

                                $("#remessage").val(null);

                                $timeout(function () {
                                    get_auth();
                                    $scope.modal.hide();
                                }, 3000)
                            }
                        })
                    }
                })

            }

        }

        if ($scope.auth[0].role[0].id === 2 || $scope.auth[0].role[0].id === 3) {
            $scope._shop_auth = true;
            DataCenter.getShopbyId($scope.auth[0].role[0].shop).then(function (response) {
                if (response.data.error_code === 0) {
                    $scope.shop = response.data.shop;
                }
            });
        } else {
            $scope._shop_auth = false;
        }
    })