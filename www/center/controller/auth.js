app
    .controller('LoginCtrl', function ($scope, $rootScope, $state, $location, $ionicHistory, $ionicSideMenuDelegate, $window, $ionicBackdrop, $ionicLoading, $timeout, ionicMaterialInk, ionicMaterialMotion, DataCenter) {
        ionicMaterialInk.displayEffect();
        $ionicSideMenuDelegate.canDragContent(false);
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
                        $state.go("app.home", {}, {
                            reload: true
                        });
                        //
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
                        $scope.$apply();
                    }, 3500);
                }
            );
        }
    })

    .controller('AccountCtrl', function ($scope, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicSideMenuDelegate) {
        $ionicSideMenuDelegate.canDragContent(true);
        ionicMaterialInk.displayEffect();
    })