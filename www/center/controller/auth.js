app
    .controller('LoginCtrl', function ($scope, $state, $location, $window, $ionicNavBarDelegate, $ionicLoading) {

        $ionicLoading.show({
            template: 'Loading...',
        });

        $window.fbAsyncInit = function () {

            $scope.login = function () {
                FB.login(function (response) {
                });
            }


            //loading facebook
            var finished_rendering = function () {
                $ionicLoading.hide();
            }
            FB.Event.subscribe('xfbml.render', finished_rendering);
            //end loading

            FB.Event.subscribe('auth.login', function (response) {
                if (response) {
                    // get long live access token
                    FB.api('/oauth/access_token?grant_type=fb_exchange_token&client_id=1946240225621730&client_secret=15ecc2d337244c224a6497f9b91931f1&fb_exchange_token=' + response.authResponse.accessToken, function (res) {
                        localStorage.setItem('accessToken', res.access_token);
                    });

                    FB.api('/me?fields=id,name,picture.type(large)', function (res) {
                        if (res.name !== null) {
                            $state.go('app.home', {}, { reload: true });
                            // $window.location.reload(true);
                        }
                    })
                }
            })

        }
    })

    .controller('AccountCtrl', function ($scope, $timeout) {
        $scope.doRefresh = function () {
            $timeout(function () {
                $scope.$broadcast('scroll.refreshComplete');
            }, 3000)
        };
    })