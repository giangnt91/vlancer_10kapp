app
  .controller('GiftsCtrl', function ($ionicLoading, $scope, $rootScope, $timeout, DataCenter, Thesocket) {
    $scope.auth = JSON.parse(localStorage.getItem('auth'));
    // loading mở trang
    $ionicLoading.show({
      template: 'Đang tải dữ liệu <br/><br/> <ion-spinner icon="lines" class="spinner-energized"></ion-spinner>',
      duration: 700
    })

    //loading
    $scope.loading = true;
    $timeout(function () {

      // load gift when user get new gift
      Thesocket.on('get_gifts', (uId) => {
        if (uId === $scope.auth[0]._id) {
          getAuth();
        }
      })

      getAuth();
      $scope.loading = false;
    }, 700);

    //keo de cap nhat
    $scope.doRefresh = function () {
      $timeout(function () {
        $scope.$broadcast('scroll.refreshComplete');
        getAuth();
      }, 1500)
    };

    function getAuth() {
      if ($scope.auth) {
        DataCenter.signIn($scope.auth[0].user_id, $scope.auth[0].user_img).then(function (response) {
          if (response.data.error_code === 0) {
            localStorage.setItem('auth', JSON.stringify(response.data.auth));
            $scope.auth = response.data.auth;
            $rootScope.auth_menu = response.data.auth;

            // lấy danh sách quà tặng
            $scope.listGifts = [];
            if ($scope.auth[0].gifts.length > 0) {
              $scope.auth[0].gifts.forEach(element => {
                if (element.giftDisable === false && element.giftUse === false) {
                  $scope.listGifts.push(element);
                }
              })
            }
          }
        });
      }
    }

  })

  .controller('GiftCtrl', function ($scope, $stateParams, $state, $ionicLoading, $ionicModal, $timeout, DataCenter, Thesocket) {
    $scope.auth = JSON.parse(localStorage.getItem('auth'));

    if ($stateParams.id) {
      $scope.auth[0].gifts.forEach(element => {
        if (element._id === $stateParams.id) {
          $scope.giftDetail = element;
        }
      });
    }

    // function check hạn của gift
    formatDayCal = (dayFormat) => {
      if (dayFormat !== undefined) {
        let parts = dayFormat.split("/");
        return parts[2] + '/' + parts[1] + '/' + parts[0];
      }
    }

    dayNow = () => {
      var date = new Date();
      var aaaa = date.getFullYear();
      var gg = date.getDate();
      var mm = (date.getMonth() + 1);

      if (gg < 10)
        gg = "0" + gg;

      if (mm < 10)
        mm = "0" + mm;

      var cur_day = aaaa + "-" + mm + "-" + gg;
      return cur_day;
    }

    treatAsUTC = (date) => {
      var result = new Date(date);
      result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
      return result;
    }

    daysBetween = (startDate, endDate) => {
      var millisecondsPerDay = 24 * 60 * 60 * 1000;
      return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
    }

    // sử dụng quà
    $scope.useGift = () => {
      // kiểm tra thời hạn sử dụng của quà
      if (daysBetween(dayNow(), formatDayCal($scope.giftDetail.giftExpiredDay)) > 0) {
        $ionicLoading.show({
          template: 'Vui lòng chờ cửa hàng duyệt trong<br/><br/> <div class="timerdiv"><span class="timer" data-seconds-left=60></span> giây </div>',
        })

        DataCenter.giftUserUse($scope.auth[0], $scope.giftDetail._id).then(response => {
          if (response.data.error_code === 0) {
            Thesocket.emit('user_use_gift');
          }
        })

        $('.timer').startTimer();


        $scope.shopApproved = false;

        //timeout 60s
        $(function () {
          $('.timer').startTimer();
        });

        $timeout(function () {
          if ($scope.shopApproved === false) {
            DataCenter.giftRemoveUserUse($scope.auth[0], $scope.giftDetail._id).then(response => {
              if (response.data.error_code === 0) {
                $ionicLoading.hide();
                $ionicLoading.show({
                  template: 'Cửa hàng không phản hồi vui lòng thử lại sau.',
                })
                $timeout(function () {
                  $ionicLoading.hide();
                }, 3000);

                // gọi tới shop để làm mới danh sách
                Thesocket.emit('user_use_gift');
              }
            })
          }
        }, 60000);

      } else {

        $ionicLoading.show({
          template: 'Món quà này đã hết hạn và sẽ bị xóa. <br/> Vui lòng chờ .... <br/><br/> <ion-spinner icon="lines" class="spinner-energized"></ion-spinner>'
        })

        $scope.giftDetail.giftDisable = true;
        // quà hết hạn cập nhật disable
        DataCenter.giftEdit($scope.auth[0], $scope.giftDetail).then(response => {
          if (response.data.error_code === 0) {
            $timeout(function () {
              $ionicLoading.hide();
              $state.transitionTo('app.gifts', null, { reload: false });
            }, 3000)
          }
        })

      }
    }

    //error
    $ionicModal.fromTemplateUrl('./partial/gifterror.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.errorGift = modal;
    });

    $scope.closeErrorGift = function () {
      $state.transitionTo('app.gifts', null, { reload: false });
      $scope.errorGift.hide();
    }

    // nhận phản hồi từ shop
    Thesocket.on('show_notif_gift', (sms, shopImage, userId, notifId) => {
      if (userId === $scope.auth[0]._id) {
        $scope.shopApproved = true;
        if (notifId === 1) {
          $scope.sms = sms;
          $scope.shopImg = shopImage;
          $ionicLoading.hide();
          $scope.errorGift.show();
        } else {
          $ionicLoading.show({
            template: 'Phần quà của bạn đã được chấp nhận <br/> <i class="ion ion-ios-checkmark coupon-done"></i>',
            duration: 3000
          })
          $timeout(function () {
            $state.transitionTo('app.gifts', null, { reload: false });
          }, 3000)
        }
      }
    })
  })

  .controller('ShopGiftsCtrl', function ($scope, Thesocket, $ionicModal, $ionicPopup, $ionicLoading, $timeout, DataCenter) {
    $scope.auth = JSON.parse(localStorage.getItem('auth'));

    getAllGiftRequert = () => {
      DataCenter.giftShopGetRequest().then(response => {
        if (response.data.error_code === 0) {
          $scope.listGifts = response.data.gifts;
        }
      })

      DataCenter.getShopbyId($scope.auth[0].role[0].shop).then(function (response) {
        if (response.data.error_code === 0) {
          $scope.shopDetail = response.data.shop[0];
        }
      })
    }
    getAllGiftRequert();

    //keo de cap nhat
    $scope.doRefresh = function () {
      $timeout(function () {
        $scope.$broadcast('scroll.refreshComplete');
        getAllGiftRequert();
      }, 1500)
    };

    //loading
    $ionicLoading.show({
      template: 'Đang tải dữ liệu <br/><br/> <ion-spinner icon="lines" class="spinner-energized"></ion-spinner>',
      duration: 700
    })
    $scope.loading = true;
    $timeout(function () {
      $scope.loading = false;
    }, 800);

    //error
    $ionicModal.fromTemplateUrl('./partial/reviewer.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.inReview = modal;
    });

    //reject
    $ionicModal.fromTemplateUrl('./partial/giftreject.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.reject = modal;
    });

    $scope.closeReviewer = function () {
      $scope.inReview.hide();
    }

    // lấy ds quà tặng đang có yêu cầu sử dụng
    Thesocket.on('shop_check_request_gift', () => {
      if ($scope.auth[0].role[0].id !== 0 && $scope.auth[0].role[0].id !== 1) {
        if ($scope.shopDetail.shopId === $scope.auth[0].role[0].shop) {
          getAllGiftRequert();
        }
      }
    })

    // không cho tương tác nếu đã có người tương tác
    Thesocket.on('shop_in_review_gift', () => {
      getAllGiftRequert();
    })

    $scope.giftApproved = (gift) => {
      $scope.giftDetail = gift;
      if (gift.auth.reviewid !== undefined) {
        if ($scope.auth[0]._id !== gift.auth.reviewid) {
          $scope.reviewer = gift.auth;
          $scope.inReview.show();
        } else {
          working(gift);
        }
      } else {
        Thesocket.emit('shop_review_gift', $scope.auth[0], gift);
        working(gift);
      }
    }

    // xác nhận quà cho khách hàng
    working = (gift) => {
      const confirmPopup = $ionicPopup.confirm({
        title: 'Áp dụng cho khách hàng',
        cssClass: '',
        template: '<div class="row" style="margin-top: 45px;"><img class="coupon-img-avatar" src="' + gift.auth.image + '"></div> <a class= "item" style="text-align:center;">  <span class="coupon-name">' + gift.auth.name + '</span>  </a> ',
        buttons: [{
          text: 'Hủy',
          type: 'button-positive',
          onTap: function (e) {
            return false;
          }
        }, {
          text: 'Ok',
          type: 'button-positive',
          onTap: function (e) {
            return true;
          }
        }]
      });


      confirmPopup.then(function (res) {
        if (res) {
          //send success
          Thesocket.emit('notif_gift', null, $scope.shopDetail.shop_info[0].shop_avatar, $scope.giftDetail.auth.id, 0);
          $ionicLoading.show({
            template: 'Quà đã được chấp nhận <br/> <i class="ion ion-ios-checkmark coupon-done"></i>',
            duration: 1500
          })

          // gọi tới shop để làm mới danh sách
          Thesocket.emit('user_use_gift');

          // cập nhật thông tin cho cửa hàng
          DataCenter.giftAcceptForShop($scope.giftDetail).then(response => {
            if(response.data.error_code === 0){
              getAllGiftRequert();
            }
          })

          // cập nhật thông cho user
          DataCenter.giftAcceptForUser($scope.giftDetail).then(response => {
          })

        } else {
          $scope.reject.show();
        }
      });
    }

    // lấy lý do chủ cửa hàng chọn
    $scope.giftReject = (id) => {
      if (id === 'true') {
        $scope.show_text = false;
      } else {
        $scope.show_text = true;
      }
    }

    // gửi thông báo lỗi cho user
    $scope.sendGiftNotif = function () {
      if ($scope.show_text === false) {
        $scope.sms = 'Khách không có mặt tại cửa hàng';
      } else {
        $scope.sms = jQuery('#giftmessage').val();
      }

      // gọi tới shop để làm mới danh sách
      Thesocket.emit('user_use_gift');

      //send error
      Thesocket.emit('notif_gift', $scope.sms, $scope.shopDetail.shop_info[0].shop_avatar, $scope.giftDetail.auth.id, 1);

      // chạy function hủy phần quà trong kho shop
      removeGiftReject();

      $scope.reject.hide();
      $ionicLoading.show({
        template: 'Đã gửi lý do không chấp nhận tới khách hàng! <br/> <i class="ion ion-ios-checkmark coupon-done"></i>',
        duration: 1500
      })
    }

    removeGiftReject = () => {
      DataCenter.giftRemoveUserUse($scope.giftDetail.auth.id, $scope.giftDetail._id).then(response => {
        if (response.data.error_code === 0) {
          getAllGiftRequert();
        }
      })
    }

  })