// pages/binding/binding.js
function countdown(that) {
  var second = 60;
  var time = setInterval(function () {
    second --;
    that.setData({
      disable: true,
      codeMsg: '重新获取' + second + 's'
    });
    if (second == 0) {
      that.setData({
        disable: 'false',
        codeMsg: "重新获取"
      });
      clearInterval(time);
    }
  }, 1000)  
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    codeMsg: '获取验证码',
    disable: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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

  /**
   * 获取验证码
   */
  getCode: function() {
    countdown(this);
  },

  binding: function() {
    wx.navigateTo({
      url: '/pages/index/index'
    })
  }
})