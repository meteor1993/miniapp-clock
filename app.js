//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'https://mobile.kaixindaka.com/dailyclock/miniapp/user/login',
          method: 'POST',
          dataType: 'json',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: {
            code: res.code
          },
          success: res => {
            console.log(res.header);
            for (let key in res.header) {
              if (key === "Set-Cookie") {
                var list = res.header[key].split(";");
                wx.setStorageSync('sessionId', list[0].split("=")[1]);
                console.log("sessionid:" + wx.getStorageSync('sessionId'));
              }
              // console.log(key)
            }
            // for (let cookie of res.data) {
            //   if (cookie.name === 'JSESSIONID') {
            //     that.globalData.sessionId = cookie.value;
            //   }
            // }
            
          }
        })
      }
    })

    // wx.openSetting({
    //   success: (res) => {
    //     if (res.authSetting["scope.userInfo"]) {
    //       // 授权成功
    //     } else {
    //       //仍然没有授权
    //     }
    //   }
    // })


    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res);
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(this.globalData);

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
                console.log(res);
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})