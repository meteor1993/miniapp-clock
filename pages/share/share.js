// pages/share/share.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: '',
    continuousClockNum: '0',
    balanceSum0: '0',
    divIsShow: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      msg: options.msg,
      continuousClockNum: options.continuousClockNum,
      balanceSum0: options.balanceSum0
    });
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
    return {
      title: '我已连续打卡' + this.data.continuousClockNum + '天,累积奖金' + this.data.balanceSum0 + '元',
      path: '/pages/index/index?openid=' + wx.getStorageSync("openid"),
      imageUrl: 'https://yangguangzaochen.oss-cn-shanghai.aliyuncs.com/share.jpg',
      success(e) {

      }
    }
  },
  closeDiv: function () {
    this.setData({
      divIsShow: false
    });
  }
})