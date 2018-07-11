// pages/center/center.js
const app = getApp();
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneFlag: false,
    amountSum: '0',
    userClockLogSize: '0',
    phone: '',
    todayBalance0: '0.00',
    useBalance0: '0.00',
    balance: '0.00',
    clockBalanceSum: '0',
    unClockBalanceSum: '0',
    rewardBalance: '0',
    month: '',
    userAccountLogList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.request({
      url: app.globalData.baseUrl + '/miniapp/center/center',
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'token': wx.getStorageSync('token')
      },
      data: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': wx.getStorageSync('token')
      },
      success: res => {
        console.log(res);
        let resultData = res.data.resultData;
        if (res.data.resultCode === "1") {
          if (resultData.userAccountModel != null && resultData.userAccountModel.rewardBalance != null) {
            this.setData({
              rewardBalance: util.number_format(resultData.userAccountModel.rewardBalance, 0, ".", ",")
            });
          }
          // 累计奖励
          if (resultData.userAccountModel != null && resultData.userAccountModel.balanceSum0 != null) {
            this.setData({
              amountSum: util.number_format(resultData.userAccountModel.balanceSum0, 2, ".", ",")
            });
          }
          // 累计打卡
          if (resultData.userClockLogSize != null) {
            this.setData({
              userClockLogSize: resultData.userClockLogSize
            });
          }
          // 我的手机
          if (resultData.wechatMpUserModel != null && resultData.wechatMpUserModel.mobile != null) {
            this.setData({
              phoneFlag: true,
              phone: resultData.wechatMpUserModel.mobile
            });
          }
          // 今日奖励
          if (resultData.userAccountModel != null && resultData.userAccountModel.todayBalance0 != null) {
            this.setData({
              todayBalance0: util.number_format(resultData.userAccountModel.todayBalance0, 2, ".", ",")
            });
          }
          // 我的投入
          if (resultData.userAccountModel != null && resultData.userAccountModel.useBalance0 != null) {
            this.setData({
              useBalance0: util.number_format(resultData.userAccountModel.useBalance0, 2, ".", ",")
            });
          }
          // 我的余额
          if (resultData.userAccountModel != null && resultData.userAccountModel.balance != null) {
            this.setData({
              balance: util.number_format(resultData.userAccountModel.balance, 2, ".", ",")
            });
          }
          // 打卡金额
          if (resultData.clockBalanceSum != null) {
            this.setData({
              clockBalanceSum: util.number_format(resultData.clockBalanceSum, 2, ".", ",")
            });
          }
          // 未打卡金额
          if (resultData.unClockBalanceSum != null) {
            this.setData({
              unClockBalanceSum: util.number_format(resultData.unClockBalanceSum, 2, ".", ",")
            });
          }
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
    });
    let d = new Date();
    let nowDate = d.getFullYear() + "-" + change(d.getMonth() + 1);
    this.setData({
      month: nowDate
    });
    wx.request({
      url: app.globalData.baseUrl + '/miniapp/center/findUserAccountLogList',
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'token': wx.getStorageSync('token')
      },
      data: {
        'date': this.data.month
      },
      success: res => {
        this.setData({
          userAccountLogList: res.data.resultData.list
        });
        for (var i = 0; i < this.data.userAccountLogList.length; i++) {
          this.data.userAccountLogList[i].createDate = util.formatDate(new Date(this.data.userAccountLogList[i].createDate));
          this.data.userAccountLogList[i].amount = util.number_format(this.data.userAccountLogList[i].amount, 2, ".", ",");
        }
        
        this.setData({
          userAccountLogList: this.data.userAccountLogList
        });
        console.log(this.data.userAccountLogList);
      },
      fail: res => {

      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '开心打卡赚零花',
      path: '/pages/index/index?openid=' + wx.getStorageSync("openid"),
      imageUrl: 'https://yangguangzaochen.oss-cn-shanghai.aliyuncs.com/share.jpg',
      success(e) {
        
      }
    }
  },

  // 绑定手机
  bindMobile: function() {
    wx.navigateTo({
      url: '../binding/binding',
    })
  },

  // 提现操作
  getMoney: function() {
    if (this.data.phoneFlag === false) {
      wx.showModal({
        content: '请先绑定手机~',
        showCancel: false,
        success: function (res) {
          wx.navigateTo({
            url: '../binding/binding',
          })
        }
      });
    } else {
      wx.navigateTo({
        url: '../getMoney/getMoney',
      })
    }
  },

  /**
   * 月份变动
   */
  changeMonth: function(e) {
    wx.showLoading({
      title: '数据加载',
    });
    this.setData({
      month: e.detail.value
    });
    wx.request({
      url: app.globalData.baseUrl + '/miniapp/center/findUserAccountLogList',
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'token': wx.getStorageSync('token')
      },
      data: {
        'date': e.detail.value
      },
      success: res => {
        this.setData({
          userAccountLogList: res.data.resultData.list
        });
        for (var i = 0; i < this.data.userAccountLogList.length; i++) {
          this.data.userAccountLogList[i].createDate = util.formatDate(new Date(this.data.userAccountLogList[i].createDate));
          this.data.userAccountLogList[i].amount = util.number_format(this.data.userAccountLogList[i].amount, 2, ".", ",");
        }

        this.setData({
          userAccountLogList: this.data.userAccountLogList
        });
        wx.hideLoading();
      },
      fail: res => {
        wx.hideLoading();
      }
    })
  }
})
function change(t) {
  if (t < 10) {
    return "0" + t;
  } else {
    return t;
  }
}