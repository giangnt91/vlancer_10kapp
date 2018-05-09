app
    .controller('LoginCtrl', function ($scope, $rootScope, $state, $location, $ionicHistory, $ionicSideMenuDelegate, $window, $ionicBackdrop, $ionicLoading, $timeout, ionicMaterialInk, ionicMaterialMotion) {
        ionicMaterialInk.displayEffect();
        $ionicSideMenuDelegate.canDragContent(false);
        $scope.login = function () {
            var fbLoginSuccess = function (userData) {
                // console.log(userData.authResponse.userID);
                url = "https://graph.facebook.com/" + userData.authResponse.userID + "/picture?width=1024&height=1024";

                //hide back button when after login
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go("app.home");
                //
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