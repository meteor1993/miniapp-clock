Page({
  data: {
    msg: '提现失败，请稍后重试或联系客服，谢谢'
  },
  onLoad: function (options) {
    if (options.msg != '' || options.msg != null) {
      this.setData({
        msg: options.msg
      });
    }
  },
  back: function() {
    wx.navigateBack({
      delta: 2
    });
  }
});