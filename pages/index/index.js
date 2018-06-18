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
    wechatMpUserModelFirstIs: false, // 早起之星
    wechatNickName: '', // 早起之星用户名
    wechatHeadImgUrl: '', // 早起之星用户头像
    userClockLogDate: '', // 早起之星打卡时间
    wechatMpUserModelList: [],
    useBalance0: '',
    maxContinuousClockUserIs: false, // 毅力之星
    maxContinuousWechatHeadImgUrl: '', // 毅力之星头像
    maxContinuousWechatNickName: '', // 毅力之星用户名
    maxContinuousNum: '', // 毅力之星连续次数
    nowDate: 0, // 现在时间
    toStartDate: 0, // 目标打卡时间
    toEndDate: 0,
    clockFlag: false, // 当前是否为打卡时间标记位
    clockDate: '00:00:00'
  },

  onLoad: function () {
    wx.showLoading({
      title: '数据加载',
      mask: true
    })
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
                                      todayUnClockUserSum: resultData.todayUnClockUserSum,
                                      wechatMpUserModelList: resultData.wechatMpUserModelList,
                                      nowDate: parseInt(resultData.nowDate / 1000),
                                      toDate: parseInt(resultData.toDate / 1000),
                                      clockFlag: resultData.clockFlag
                                    });
                                    // 早起之星判断
                                    if (resultData.wechatMpUserModelFirst != null && resultData.userClockLogModel.createStringDate != null) {
                                      this.setData({
                                        wechatMpUserModelFirstIs: true
                                      });
                                    }
                                    if (resultData.wechatMpUserModelFirst != null && resultData.wechatMpUserModelFirst.wechatNickName != null) {
                                      this.setData({
                                        wechatNickName: resultData.wechatMpUserModelFirst.wechatNickName
                                      });
                                    }
                                    if (resultData.wechatMpUserModelFirst != null && resultData.wechatMpUserModelFirst.wechatHeadImgUrl != null) {
                                      this.setData({
                                        wechatHeadImgUrl: resultData.wechatMpUserModelFirst.wechatHeadImgUrl
                                      });
                                    }
                                    if (resultData.wechatMpUserModelFirst != null && resultData.userClockLogModel.createStringDate != null) {
                                      this.setData({
                                        userClockLogDate: resultData.userClockLogModel.createStringDate
                                      });
                                    }
                                    // 毅力之星
                                    if (resultData.maxContinuousClockUserWechat != null && resultData.maxContinuousClockUserAccount.continuousClockNum != null) {
                                      this.setData({
                                        maxContinuousClockUserIs: true
                                      });
                                    }
                                    if (resultData.maxContinuousClockUserWechat != null && resultData.maxContinuousClockUserWechat.wechatHeadImgUrl != null) {
                                      this.setData({
                                        maxContinuousWechatHeadImgUrl: resultData.maxContinuousClockUserWechat.wechatHeadImgUrl
                                      });
                                    }
                                    if (resultData.maxContinuousClockUserWechat != null && resultData.maxContinuousClockUserWechat.wechatNickName != null) {
                                      this.setData({
                                        maxContinuousWechatNickName: resultData.maxContinuousClockUserWechat.wechatNickName
                                      });
                                    }
                                    if (resultData.maxContinuousClockUserAccount != null && resultData.maxContinuousClockUserAccount.continuousClockNum != null) {
                                      this.setData({
                                        maxContinuousNum: resultData.maxContinuousClockUserAccount.continuousClockNum
                                      });
                                    }
                                    // 如果当前用户有账户信息
                                    if (resultData.userAccountModel != null) {
                                      this.setData({
                                        account_type0: resultData.userAccountModel.type0,
                                        useBalance0: resultData.userAccountModel.useBalance0
                                      });
                                    }
                                    this.count_down(this.data.toDate - this.data.nowDate);
                                    wx.hideLoading();
                                  } else {
                                    wx.showModal({
                                      content: '网络异常，请重试～',
                                      showCancel: false,
                                      success: function (res) {
                                        wx.hideLoading();
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
        wx.showModal({
          content: '网络异常，请重试～',
          showCancel: false,
          success: function (res) {

          }
        });
      }
    })
  },

  /**
   * 加载产品列表
   */
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

  /**
   * 挑战规则
   */
  tiaozhanguize: function() {
    wx.navigateTo({
      url: '../role/role'
    })
  },

  /**
   * 开启首页倒计时定时任务
   */
  count_down: function (duringMs) {
    let that = this

    // 渲染倒计时时钟  
    that.setData({
      clockDate: that.date_format(duringMs)
    });

    if (duringMs <= 0) {
      that.setData({
        clockFlag: true
      });
      // timeout则跳出递归  
      return;
    }
    setTimeout(function () {
      // 放在最后--  
      duringMs -= 1;
      that.count_down(duringMs);
    } , 1000)
  },

  /**
   * 格式化倒计时
   */
  date_format: function (micro_second) {
    let that = this
    // 小时位  
    let hr = that.fill_zero_prefix(Math.floor(micro_second / 3600));
    // 分钟位  
    let min = that.fill_zero_prefix(Math.floor((micro_second - hr * 3600) / 60));
    // 秒位  
    let sec = that.fill_zero_prefix(micro_second % 60);// equal to => var sec = second % 60; 
    return hr + ":" + min + ":" + sec + " ";
  },

  /**
   * 分秒位数补0
   */
  fill_zero_prefix: function (num) {
    return num < 10 ? "0" + num : num
  },

  /**
   * 打卡
   */
  formSubmit: function (e) {
    wx.showLoading({
      title: '打卡中',
    })
    console.log('表单id:', e.detail.formId);
    wx.request({
      url: app.globalData.baseUrl + '/miniapp/clock/clock',
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': wx.getStorageSync('token')
      },
      data: {
        formid: e.detail.formId
      },
      success: res => {
        wx.hideLoading();
        if (res.data.resultCode === "1") {
          wx.showModal({
            content: '打卡成功',
            showCancel: false,
            success: function (res) {
            }
          })
        } else {
          wx.showModal({
            content: res.data.resultMsg,
            showCancel: false,
            success: function (res) {
            }
          })
        }
      },
      fail: res => {
        wx.hideLoading();
        wx.showModal({
          content: '网络异常，请重试～',
          showCancel: false,
          success: function (res) {

          }
        })
      }
    })
  }
})
