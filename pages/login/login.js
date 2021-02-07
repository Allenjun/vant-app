// pages/login/login.js
import $utils from "../../utils/util"
import $api from "../../utils/api"
const ORG_PLACEHOLDER = "请选择您所在的部门"
const PASSWORD = "jchr"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPopup: false,
    organization: ORG_PLACEHOLDER,
    username: "",
    password: "",
    columns: [{
        values: []
      },
      {
        values: []
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideHomeButton()
    this.setData({
      columns: [{
          values: $utils.loadCompanys()
        },
        {
          values: $utils.getDepartments($utils.loadCompanys()[0])
        },
      ]
    })
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
  popup: function () {
    this.setData({
      isPopup: true
    })
  },
  closePopup: function () {
    this.setData({
      isPopup: false
    })
  },
  deptCancel: function () {
    this.closePopup()
  },
  deptConfirm: function (event) {
    this.closePopup()
    this.setData({
      organization: event.detail.value.join("")
    })
  },
  deptChange: function (event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    picker.setColumnValues(1, $utils.getDepartments(value[0]));
  },
  signup: function () {
    if ($utils.isEmpty(this.data.organization) || this.data.organization === ORG_PLACEHOLDER) {
      $utils.Toast.tip("部门不能为空")
      return
    }
    if ($utils.isEmpty(this.data.username)) {
      $utils.Toast.tip("姓名不能为空")
      return
    }
    if ($utils.isEmpty(this.data.password) || this.data.password !== PASSWORD) {
      $utils.Toast.tip("口令错误")
      return
    }
    $api.changeDepartment({
        name: this.data.username,
        department: this.data.organization
      })
      .then(res => {
        getApp().globalData.userInfo.department = this.data.organization
        getApp().globalData.userInfo.name = this.data.username
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index',
          })
        }, 1000)
      })
  }

})