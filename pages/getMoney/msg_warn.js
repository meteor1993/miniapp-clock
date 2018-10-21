Page({
  data: {
    msg: '提现已提交管理员审核，请耐心等待，谢谢'
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