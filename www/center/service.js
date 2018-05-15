angular.module('MobileService', [])
    .factory('DataCenter', function ($http) {
        var api_gateway_url = 'http://35.201.216.91:2018';
        // var api_gateway_url = 'http://localhost:2018';
        var parameter;
        var url;
        var header = { header: { 'Conntent-Type': 'application/json' } };

        return {
            signIn: function (user_id, user_img) {
                parameter = JSON.stringify({
                    user_id: user_id,
                    user_img: user_img
                });
                url = api_gateway_url + '/mobile';
                return $http.post(url, parameter, header);
            }
        }
    })