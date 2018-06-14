angular.module('MobileService', [])
    .factory('DataCenter', function ($http) {
        var api_gateway_url = 'http://35.200.213.108:2018';
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
            },
            UseruseCoupon: function (_id, coupon) {
                parameter = JSON.stringify({
                    _id: _id,
                    coupon: coupon
                });
                url = api_gateway_url + '/musecoupon';
                return $http.post(url, parameter, header);
            },
            getShopbyId: function (shopId) {
                parameter = JSON.stringify({
                    shopId: shopId
                })
                url = api_gateway_url + '/getShopId';
                return $http.post(url, parameter, header);
            },
            CancelCoupon: function (shopid, couponId) {
                parameter = JSON.stringify({
                    shopid: shopid,
                    couponId: couponId
                })
                url = api_gateway_url + '/removecouponcancel';
                return $http.post(url, parameter, header);
            },
            AcceptCoupon: function (shopid, couponId, get_coupon_id) {
                parameter = JSON.stringify({
                    shopid: shopid,
                    couponId: couponId,
                    get_couponId: get_coupon_id
                })
                url = api_gateway_url + '/mshopaccept';
                return $http.post(url, parameter, header);
            },
            UpdateCouponfeed: function (_id, couponId, rating, feedback) {
                parameter = JSON.stringify({
                    _id: _id,
                    couponId: couponId,
                    rating: rating,
                    feedback: feedback
                });
                url = api_gateway_url + '/couponfeed';
                return $http.post(url, parameter, header);
            },
            UpdateRating: function (shopid, couponId, rating, feedback) {
                parameter = JSON.stringify({
                    shopid: shopid,
                    couponId: couponId,
                    rating: rating,
                    feedback: feedback
                })
                url = api_gateway_url + '/mupdaterating';
                return $http.post(url, parameter, header);
            },
            UpdateAfterUser: function(_id, couponId, rating, feedback){
                parameter = JSON.stringify({
                    _id: _id,
                    couponId: couponId,
                    rating: rating,
                    feedback: feedback
                });
                url = api_gateway_url + '/afteruser';
                return $http.post(url, parameter, header);
            },
            RemoveCoupon: function (_id, couponId) {
                parameter = JSON.stringify({
                    _id: _id,
                    couponId: couponId
                })
                url = api_gateway_url + '/rcoupon';
                return $http.post(url, parameter, header);
            },
            UpdateNotif: function (_id, notifId) {
                parameter = JSON.stringify({
                    _id: _id,
                    notifId: notifId
                })
                url = api_gateway_url + '/notifid';
                return $http.post(url, parameter, header);
            }
        }
    })

    .factory('Thesocket', function (socketFactory) {
        var api_gateway_url = 'http://35.200.213.108:2018';
        var socketConnection = io.connect(api_gateway_url);
        var socket = socketFactory({
            ioSocket: socketConnection
        });
        return socket;
    });