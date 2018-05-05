angular.module('10kControllers', ['ionic', 'ngResource', 'ngSanitize', 'ionic.utils', 'ngCordova'])
app
    .controller('AppCtrl', function ($scope, $window, $ionicModal, $state, $timeout, $ionicActionSheet) {

        $scope.go_home = function () {
            $state.go('app.home');
        }

        $scope.go_account = function () {
            $state.go('app.account');
        }

        // $scope.go_login = function () {
        //     $state.go('app.login', {}, {
        //         reload: true
        //     });
        //     // $window.location.reload(true);
        // }

        // Triggered on a button click, or some other target
        $scope.go_share = function () {

            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: 'Share This' },
                ],
                // destructiveText: 'Delete',
                // titleText: 'Chia Sẻ App',
                cancelText: 'Cancel',
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked: function (index) {
                    return true;
                }
            });
        };
    })

    .controller('HomeCtrl', function ($scope) {
    })
