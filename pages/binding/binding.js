// pages/binding/binding.js
const app = getApp();
function countdown(that) {
  var second = 10;
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
    disable: false,
    mobile: '',
    code: ''
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

  mobileInput: function(e) {
    this.setData({
      mobile: e.detail.value
    });
  },

  codeInput: function(e) {
    this.setData({
      code: e.detail.value
    });
  },

  /**
   * 获取验证码
   */
  getCode: function() {
    console.log(this.data.mobile)
    var flag = false;
    if (this.data.mobile.length != 11) {
      wx.showModal({
        content: '请输入正确的手机号',
        showCancel: false,
        success: function (res) {
          flag = false;
        }
      });
    } else {
      flag = true;
    }
    if (flag) {
      wx.request({
        url: app.globalData.baseUrl + '/miniapp/sms/sendSMS',
        method: 'POST',
        dataType: 'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded', // 默认值
          'token': wx.getStorageSync('token')
        },
        data: {
          mobile: this.data.mobile
        },
        success: res => {
          var that = this;
          if (res.data.resultCode === "1") {
            wx.showModal({
              content: '短信发送成功',
              showCancel: false,
              success: function (res) {
                countdown(that);
              }
            });
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
    }
  },

  binding: function() {
    wx.request({
      url: app.globalData.baseUrl + '/miniapp/sms/binding',
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'token': wx.getStorageSync('token')
      },
      data: {
        mobile: this.data.mobile,
        code: this.data.code
      },
      success: res => {
        if (res.data.resultCode === "1") {
          wx.showModal({
            content: '绑定成功',
            showCancel: false,
            success: function (res) {
              wx.navigateBack({
                delta: 1
              });
            }
          });
        } else {
          wx.showModal({
            content: res.data.resultMsg,
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
    
  }
})