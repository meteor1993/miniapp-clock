// pages/getMoney/getMoney.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: "0",
    disable: false,
    maxMoney: '200',
    money: ''
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
      url: app.globalData.baseUrl + '/miniapp/miniAccount/accountInfo',
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'token': wx.getStorageSync('token')
      },
      success: res => {
        console.log(res);
        wx.hideLoading();
        if (res.data.resultCode === "1") {
          this.setData({
            balance: res.data.resultData.userAccountModel.balance,
            maxMoney: res.data.resultData.clockConfigModel.getMoneyTopLine
          });
        }
      },
      fail: res => {
        wx.hideLoading();
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
  
  },

  moneyInput: function(e) {
    this.setData({
      money: e.detail.value
    });
  },

  // 全部提现
  quanbu: function() {
    this.setData({
      money: this.data.balance
    });
  },

  // 发起提现
  getMoney: function() {
    this.setData({
      disable: true
    });
    let that = this;
    let flag = false;
    let exp = /^(([1-9]\d*)|\d)(\.\d{1,2})?$/;
    if (!exp.test(this.data.money)) {
      wx.showModal({
        content: '金额格式有误，请确认后重新输入',
        showCancel: false,
        success: function (res) {
          flag = false;
          that.setData({
            disable: false
          });
        }
      });
    } else {
      if (parseFloat(this.data.money * 100) > parseFloat(this.data.balance * 100)) {
        wx.showModal({
          content: '您输入的金额超过余额,请重新输入',
          showCancel: false,
          success: function (res) {
            flag = false;
            that.setData({
              money: '',
              disable: false
            });
          }
        });
      } else {
        flag = true;
        disable: false
      }
    }
    if(flag) {
      wx.request({
        url: app.globalData.baseUrl + '/miniapp/miniAccount/getMoney',
        method: 'POST',
        dataType: 'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded', // 默认值
          'token': wx.getStorageSync('token')
        },
        data: {
          money: this.data.money
        },
        success: res => {
          console.log(res);
          if (res.data.resultCode === "1") {
            that.setData({
              disable: false
            });
            wx.navigateTo({
              url: 'msg_success'
            });
          } else {
            that.setData({
              disable: false
            });
            wx.navigateTo({
              url: 'msg_fail?msg=' + res.data.resultMsg
            });
          }
        },
        fail: res => {
          that.setData({
            disable: false
          });
          wx.navigateTo({
            url: 'msg_fail'
          });
          
        }
      })
    }
  }
  
})