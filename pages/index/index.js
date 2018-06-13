//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    userBalance0Sum: 0, // 总挑战金
    userCount0: 0, // 总挑战人数
    todayClockUserSum: 0,
    todayUnClockUserSum: 0,
    account_type0: 0,
    productList: [],
    wechatNickName: '',
    wechatHeadImgUrl: '',
    userClockLogDate: '',
    wechatMpUserModelList: [],
    useBalance0: '',
    countDownHour: '00',
    countDownMinute: '00',
    countDownMinute: '00'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {

  },

  onReady: function() {
    
  },

  /**
    * 生命周期函数--监听页面显示
    */
  onShow: function () {
    // 获取服务端token
    wx.request({
      url: app.globalData.baseUrl + '/miniapp/getToken',
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'token': wx.getStorageSync('token')
      },
      data: {
        key: 'oTuDt4BN7CMec87I5N3k5RMLTzLlmwOc'
      },
      success: res => {
        wx.setStorageSync('token', res.data.resultData.token);
        console.log(">>>>>>>>>>token:" + wx.getStorageSync("token"));
        // 登录
        wx.login({
          success: res => {
            console.log(res);
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.request({
              url: app.globalData.baseUrl + '/miniapp/user/login',
              method: 'POST',
              dataType: 'json',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'token': wx.getStorageSync('token')
              },
              data: {
                code: res.code
              },
              success: res => {
                wx.setStorageSync('sessionKey', res.data.resultData.session.sessionKey);
                wx.getSetting({
                  success: res => {
                    if (res.authSetting['scope.userInfo']) {
                      // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                      wx.getUserInfo({
                        success: res => {
                          console.log(res);
                          // 可以将 res 发送给后台解码出 unionId
                          app.globalData.userInfo = res.userInfo
                          wx.request({
                            url: app.globalData.baseUrl + '/miniapp/user/info',
                            method: 'POST',
                            dataType: 'json',
                            header: {
                              'content-type': 'application/x-www-form-urlencoded',
                              'token': wx.getStorageSync('token')
                            },
                            data: {
                              sessionKey: wx.getStorageSync("sessionKey"),
                              signature: res.signature,
                              rawData: res.rawData,
                              encryptedData: res.encryptedData,
                              iv: res.iv
                            },
                            success: res => {
                              console.log("++++++" + res.data);
                              wx.setStorageSync('userInfo', res.data.resultData.userInfo);
                              console.log(wx.getStorageSync('userInfo'));
                              // 初始化首页数据
                              wx.request({
                                url: app.globalData.baseUrl + '/miniapp/clock/index',
                                method: 'POST',
                                header: {
                                  'Content-Type': 'application/x-www-form-urlencoded',
                                  'token': wx.getStorageSync('token')
                                },
                                dataType: 'json',
                                success: res => {
                                  console.log(res);
                                  if (res.data.resultCode === "1") {
                                    var resultData = res.data.resultData;
                                    this.setData({
                                      userBalance0Sum: resultData.userBalance0Sum,
                                      userCount0: resultData.userCount0,
                                      todayClockUserSum: resultData.todayClockUserSum,
                                      todayUnClockUserSum: resultData.needClockUserSum - resultData.todayClockUserSum,
                                      wechatMpUserModelList: resultData.wechatMpUserModelList,
                                      wechatNickName: resultData.wechatMpUserModelFirst.wechatNickName,
                                      wechatHeadImgUrl: resultData.wechatMpUserModelFirst.wechatHeadImgUrl,
                                      userClockLogDate: resultData.userClockLogModel.createStringDate
                                    });
                                    // 如果当前用户有账户信息
                                    if (resultData.userAccountModel != null) {
                                      this.setData({
                                        account_type0: resultData.userAccountModel.type0,
                                        useBalance0: resultData.userAccountModel.useBalance0
                                      });
                                    }
                                    wx.hideLoading();
                                  } else {
                                    wx.showModal({
                                      content: '网络异常，请重试～',
                                      showCancel: false,
                                      success: function (res) {

                                      }
                                    });
                                  }
                                },
                                fail: res => {
                                  wx.showModal({
                                    content: '网络异常，请重试～',
                                    showCancel: false,
                                    success: function (res) {

                                    }
                                  });
                                }
                              })
                            }
                          })
                        }
                      })
                    } else {
                      wx.navigateTo({
                        url: '../auth/auth',
                      })
                    }
                  }
                })
              }
            })
          }
        })
      },
      fail: e => {

      }
    })
    // 获取用户信息





    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },

  open: function() {
    wx.showLoading({
      title: '数据加载',
      mask: true
    })
    wx.request({
      url: app.globalData.baseUrl + '/miniapp/clock/findProductList',
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': wx.getStorageSync('token')
      },
      success: res => {
        wx.hideLoading();
        if (res.data.resultCode === "1") {
          var productList = res.data.resultData.productList;
          var list = [];
          for (var i = 0; i < productList.length; i++) {
            list.push('支付' + productList[i].productName + '元参与挑战')
          }
          this.setData({
            productList: list
          });
        } else {
          wx.showModal({
            content: '网络异常，请重试～',
            showCancel: false,
            success: function (res) {
            }
          })
        }
        
        wx.showActionSheet({
          itemList: this.data.productList,
          success: function (res) {
            if (!res.cancel) {
            
              wx.navigateTo({
                url: '../pay/pay?productNo=' + res.tapIndex,
              })
            }
          }
        });
      },
      fail: res => {
        wx.showModal({
          content: '网络异常，请重试～',
          showCancel: false,
          success: function (res) {

          }
        })
      }
    });
    
  },

  tiaozhanguize: function() {
    wx.navigateTo({
      url: '../role/role'
    })
  }
})
