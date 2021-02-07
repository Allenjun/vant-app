// app.js
import $utils from "./utils/util"
import $api from "./utils/api"

App({
  onLaunch() {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(res => {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success(res) {
              if (res.confirm) {
                updateManager.applyUpdate()
              }
            }
          })
        })
      }
    })
    this.checkToken();
  },
  checkToken() {
    $api.userInfo()
      .then(res => this.loginSuccess(res))
      .catch(() => this.login())
  },
  login() {
    wx.login({
      success: res => {
        const query = {
          code: res.code
        }
        $api.login(query)
          .then(res => this.loginSuccess(res))
      }
    })
  },
  loginSuccess(res) {
    wx.setStorageSync('token', res.token)
    Object.assign(getApp().globalData.userInfo, res)
    if ($utils.isEmpty(res.department)) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
  },
  globalData: {
    userInfo: {
      department: "",
      isAdmin: false,
      name: "",
      token: ""
    }
  }
})