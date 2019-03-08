var app = angular.module('10kCoupon', ['ionic', 'ionic-material', 'ngCordova', 'MobileService', 'btford.socket-io']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
            url: '/app',
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
        })

        .state('app.home', {
            url: '/home',
            views: {
                'menuContent': {
                    templateUrl: 'partial/home.html',
                    controller: 'AppCtrl'
                }
            }
        })

        .state('app.shop', {
            url: '/shop',
            views: {
                'menuContent': {
                    templateUrl: 'partial/shopcoupon.html',
                    controller: 'ShopCtrl'
                }
            }
        })

        .state('app.account', {
            url: '/account',
            views: {
                'menuContent': {
                    templateUrl: 'partial/account.html',
                    controller: 'AccountCtrl',
                    cache: false
                }
            }
        })

        .state('app.coupon', {
            url: '/coupon/:id',
            views: {
                'menuContent': {
                    templateUrl: 'partial/coupon.html',
                    controller: 'CouponCtrl'
                }
            }
        })

        .state('app.shopgifts', {
            url: '/shopgifts',
            views: {
                'menuContent': {
                    templateUrl: 'partial/shopgift.html',
                    controller: 'ShopGiftsCtrl'
                }
            }
        })

        .state('app.gifts', {
            url: '/gifts',
            views: {
                'menuContent': {
                    templateUrl: 'partial/gifts.html',
                    controller: 'GiftsCtrl'
                }
            }
        })

        .state('app.gift', {
            url: '/gift?:id',
            views: {
                'menuContent': {
                    templateUrl: 'partial/gift.html',
                    controller: 'GiftCtrl'
                }
            }
        })

        .state('app.listfeedback', {
            url: '/listfeedback',
            views: {
                'menuContent': {
                    templateUrl: 'partial/listfeedback.html',
                    controller: 'AccountCtrl'
                }
            }
        })

        .state('app.feedback', {
            url: '/feedback/:id',
            views: {
                'menuContent': {
                    templateUrl: 'partial/feedback.html',
                    controller: 'FeedbackCtrl'
                }
            }
        })

        .state('app.login', {
            url: '/login',
            views: {
                'menuContent': {
                    templateUrl: 'partial/login.html',
                    controller: 'LoginCtrl'
                }
            }
        })


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
});
