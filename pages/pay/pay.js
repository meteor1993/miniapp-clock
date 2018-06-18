// pages/pay/pay.js
const app = getApp();
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: '0.00',
    orderMoney: '',
    orderNo: '',
    productNo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载',
      mask: true
    })
    this.setData({
      productNo: options.productNo
    });
    wx.request({
      url: app.globalData.baseUrl + '/miniapp/pay/saveWxPayOrderModel',
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'token': wx.getStorageSync('token')
      },
      data: {
        productNo: options.productNo
      },
      success: res => {
        if (res.data.resultCode === "1") {
          this.setData({
            balance: util.number_format(res.data.resultData.balance, 2, ".", ","),
            orderMoney: util.number_format(res.data.resultData.orderMoney, 2, ".", ","),
            orderNo: res.data.resultData.orderNo
          });
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

  payByBalance: function() {
    if (parseFloat(this.data.balance) * 100 < parseFloat(this.data.orderMoney) * 100) { // 如果当前余额小于需支付金额
      console.log("balance:" + this.data.balance + "---orderMoney:" + this.data.orderMoney);
      wx.showModal({
        content: '余额不足，请先充值～',
        showCancel: false,
        success: function (res) {

        }
      });
    } else { // 调用后台，完成支付
      console.log("++++++++++++++++++++++++++");
      wx.request({
        url: app.globalData.baseUrl + '/miniapp/pay/payByBalance',
        method: 'POST',
        dataType: 'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded', // 默认值
          'token': wx.getStorageSync('token')
        },
        data: {
          productNo: this.data.productNo,
          orderNo: this.data.orderNo
        },
        success: res => {
          console.log(res);
          if (res.data.resultCode === "1") {
            wx.showModal({
              content: res.data.resultMsg,
              showCancel: false,
              success: function (res) {
                wx.navigateBack({
                  delta: 1
                })
              }
            });
          }
        }
      });
    }
  },

  payByWechat: function() {
    wx.request({
      url: app.globalData.baseUrl + '/miniapp/pay/unifiedOrder',
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'token': wx.getStorageSync('token')
      },
      data: {
        productNo: this.data.productNo,
        orderNo: this.data.orderNo
      },
      success: res => {
        wx.showLoading({
          title: 'Loading',
        });
        console.log(res);
        if (res.data.resultCode === "1") {
          console.log(res.data.resultData);
          wx.requestPayment({
            'timeStamp': res.data.resultData.timeStamp,
            'nonceStr': res.data.resultData.nonceStr,
            'package': 'prepay_id=' + res.data.resultData.package,
            'signType': res.data.resultData.signType,
            'paySign': res.data.resultData.paySign,
            'success': function(res) {
              wx.hideLoading();
              wx.navigateTo({
                url: 'msg_success'
              });
              console.log("success===============" + res.errMsg);
            },
            'fail': function (res) {
              wx.hideLoading();
              wx.navigateTo({
                url: 'msg_fail'
              });
              console.log("fail===============" + res.errMsg);
            }
          })
        } else {
          wx.hideLoading();
          wx.showModal({
            content: res.data.resultMsg,
            showCancel: false,
            success: function (res) {

            }
          });
        }
      }
    })
  }
})