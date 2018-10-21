const app = getApp();

Page({
  data:{
    orderNo: ''
  },
  onLoad: function (options) {
    this.setData({
      orderNo: options.orderNo
    });
  },
  complete: function() {
    wx.request({
      url: app.globalData.baseUrl + '/miniapp/pay/orderquery',
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'token': wx.getStorageSync('token')
      },
      data: {
        orderNo: this.data.orderNo
      },
      success: res => {
        wx.reLaunch({
          url: '/pages/index/index',
        })
      },
      fail: res => {
        wx.reLaunch({
          url: '/pages/index/index',
        })
      },
      complete: res => {
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
    })
  }
});