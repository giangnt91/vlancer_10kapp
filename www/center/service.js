angular.module('MobileService', [])
	.factory('DataCenter', function ($http) {
		// var api_gateway_url = 'https://api.coupon10k.com';
		// var api_gateway_url = 'http://35.244.36.175:2018';
		var api_gateway_url = 'http://localhost:2018';
		var parameter;
		var url;
		var header = {
			header: {
				'Conntent-Type': 'application/json'
			}
		};

		return {
			signIn: function (user_id, user_img) {
				parameter = JSON.stringify({
					user_id: user_id,
					user_img: user_img
				});
				url = api_gateway_url + '/mobile';
				return $http.post(url, parameter, header);
			},
			signUp: function (user_id, user_img, info, point_per_day, point_per_today, total_slot, _class, download, access_time_per_day, point_plus, point_bad, total_list_coupon, empty_slot, use_coupon, call_server_in_day, role, access_token, _status) {
				parameter = JSON.stringify({
					user_id: user_id,
					user_img: user_img,
					info: info,
					point_per_day: point_per_day,
					point_per_today: point_per_today,
					total_slot: total_slot,
					user_class: _class,
					download: download,
					access_time_per_day: access_time_per_day,
					point_plus: point_plus,
					point_bad: point_bad,
					total_list_coupon: total_list_coupon,
					empty_slot: empty_slot,
					use_coupon: use_coupon,
					call_server_in_day: call_server_in_day,
					role: role,
					access_token: access_token,
					_status: _status
				});
				url = api_gateway_url + '/signup';
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
			waitShopApproved: function (_id, couponId) {
				parameter = JSON.stringify({
					_id: _id,
					couponId: couponId
				});
				url = api_gateway_url + '/waitshopapproved';
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
			TimeoutCoupon: function (shopid, couponId) {
				parameter = JSON.stringify({
					shopid: shopid,
					couponId: couponId
				});
				url = api_gateway_url + '/timeoutcoupon';
				return $http.post(url, parameter, header);
			},
			TimeoutUser: function (_id, couponId) {
				parameter = JSON.stringify({
					_id: _id,
					couponId: couponId
				});
				url = api_gateway_url + '/timeoutuser';
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
			UpdateAfterUser: function (_id, couponId, rating, feedback) {
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
			},
			giftEdit: (auth, gift) => {
				parameter = JSON.stringify({
					auth: auth,
					gift: gift
				})
				url = api_gateway_url + '/updateuserexpire';
				return $http.post(url, parameter, header);
			},
			giftUserUse: (auth, _id) => {
				parameter = JSON.stringify({
					auth: auth,
					_id: _id
				})
				url = api_gateway_url + '/userusegift';
				return $http.post(url, parameter, header);
			},
			giftRemoveUserUse: (auth, _id) => {
				parameter = JSON.stringify({
					auth: auth,
					_id: _id
				})
				url = api_gateway_url + '/giftrmuseruse';
				return $http.post(url, parameter, header);
			},
			giftShopGetRequest: () => {
				url = api_gateway_url + '/shopgetgiftrequest';
				return $http.get(url, header);
			},
			giftAcceptForShop: (gift) => {
				url = api_gateway_url + '/giftacceptforshop';
				parameter = JSON.stringify({
					gift: gift
				})
				return $http.post(url, parameter, header);
			},
			giftAcceptForUser: (gift) => {
				url = api_gateway_url + '/giftacceptforuser';
				parameter = JSON.stringify({
					gift: gift
				})
				return $http.post(url, parameter, header);
			}
		}
	})

	.factory('Thesocket', function (socketFactory) {
		// var api_gateway_url = 'http://35.244.36.175:2018';
		// var api_gateway_url = 'https://api.coupon10k.com';
		var api_gateway_url = 'http://localhost:2018';
		var socketConnection = io.connect(api_gateway_url);
		var socket = socketFactory({
			ioSocket: socketConnection
		});
		return socket;
	});
