Page({
  complete: function() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }
});