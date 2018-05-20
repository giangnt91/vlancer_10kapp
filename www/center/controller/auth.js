app
    .controller('LoginCtrl', function ($scope, $window, $rootScope, $state, $location, $ionicHistory, $ionicSideMenuDelegate, $window, $ionicBackdrop, $ionicLoading, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicLoading, DataCenter) {
        ionicMaterialInk.displayEffect();
        $ionicSideMenuDelegate.canDragContent(false);
        $window.localStorage.clear();

        $scope.login = function () {
            var fbLoginSuccess = function (userData) {
                url_img = "https://graph.facebook.com/" + userData.authResponse.userID + "/picture?width=180&height=180";
                DataCenter.signIn(userData.authResponse.userID, url_img).then(function (response) {
                    if (response.data.error_code === 0) {
                        localStorage.setItem('auth', JSON.stringify(response.data.auth));

                        //hide back button when after login
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });

                        $ionicLoading.show({
                            template: 'Đang xử lý dữ liệu <br/><br/> <ion-spinner icon="lines" class="spinner-energized"></ion-spinner>',
                            duration: 1500
                        })

                        $timeout(function () {
                            if (response.data.auth[0].role[0].id === 3 || response.data.auth[0].role[0].id === 2) {
                                $state.transitionTo('app.shop', null, { reload: false });
                            } else {
                                $state.transitionTo('app.home', null, { reload: false });
                            }
                        }, 1500)

                        // $timeout(function () {
                        //     $state.go('app.home', {}, {
                        //         reload: true
                        //     });
                        // }, 1500)

                    } else if (response.data.error_code === 5) {
                        $scope._block_login = true;
                        $timeout(function () {
                            $scope._block_login = false;
                        }, 5000)
                    } else if (response.data.error_code === 2) {
                        $scope._error_login = true;
                        $timeout(function () {
                            $scope._error_login = false;
                        }, 5000)
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

    .controller('AccountCtrl', function ($scope, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicSideMenuDelegate) {
        $ionicSideMenuDelegate.canDragContent(true);
        ionicMaterialInk.displayEffect();

        $scope.auth = JSON.parse(localStorage.getItem('auth'));
    })