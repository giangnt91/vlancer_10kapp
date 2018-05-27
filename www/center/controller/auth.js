app
    .controller('LoginCtrl', function ($scope, $window, $rootScope, $state, $location, $ionicHistory, $ionicSideMenuDelegate, $window, $ionicBackdrop, $ionicLoading, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicLoading, DataCenter) {
        ionicMaterialInk.displayEffect();
        $ionicSideMenuDelegate.canDragContent(false);

        $scope.auth = JSON.parse(localStorage.getItem('auth'));

        $ionicLoading.show({
            template: 'Đang xử lý dữ liệu <br/><br/> <ion-spinner icon="lines" class="spinner-energized"></ion-spinner>',
            duration: 500
        })

        if ($scope.auth) {
            $timeout(function () {
                $rootScope.auth_menu = $scope.auth;
                if ($scope.auth[0].role[0].id === 2 || $scope.auth[0].role[0].id === 3) {
                    $rootScope._menu_shop = true;
                }else{
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
                        }else{
                            $rootScope._menu_shop = false;
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

    .controller('AccountCtrl', function ($scope, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicSideMenuDelegate, DataCenter) {
        $ionicSideMenuDelegate.canDragContent(true);
        ionicMaterialInk.displayEffect();

        $scope.auth = JSON.parse(localStorage.getItem('auth'));

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