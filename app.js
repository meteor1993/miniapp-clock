//app.js
App({
  onLaunch: function () {

    wx.showLoading({
      title: '数据加载',
      mask: true
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    this.globalData.baseUrl = 'http://localhost:8081/dailyclock';
    // this.globalData.baseUrl = 'https://mobile.kaixindaka.com/dailyclock';

    



    

    // wx.openSetting({
    //   success: (res) => {
    //     if (res.authSetting["scope.userInfo"]) {
    //       // 授权成功
    //     } else {
    //       //仍然没有授权
    //     }
    //   }
    // })

    wx.getUserInfo({
      success: res => {
        this.globalData.userInfo = res.userInfo;
        wx.setStorageSync('userInfo', res.userInfo);
      }
    })

  },
  globalData: {
    userInfo: null
  }
})