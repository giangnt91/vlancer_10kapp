app
    .controller('LoginCtrl', function ($scope, $state, $location, $window, $ionicNavBarDelegate, $ionicLoading, $timeout) {

        $scope.login = function () {

            var fbLoginSuccess = function (userData) {
                // console.log(userData.authResponse.userID);
                url = "https://graph.facebook.com/" + userData.authResponse.userID + "/picture?width=1024&height=1024";
                alert(url);
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

    .controller('AccountCtrl', function ($scope, $timeout) {
        $scope.doRefresh = function () {
            $timeout(function () {
                $scope.$broadcast('scroll.refreshComplete');
            }, 3000)
        };
    })