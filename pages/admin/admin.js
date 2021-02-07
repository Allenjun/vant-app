// pages/admin/admin.js
import $utils from "../../utils/util"
import $api from "../../utils/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dialogShow: false,
    markTimeComponentShow: false,
    departmentComponentShow: false,
    department: "",
    markTime: "",
    receive: "",
    pay: "",
    type: "lunch",
    orderlist: []
  },
  openDepartmentComponent() {
    this.setData({
      departmentComponentShow: true
    })
  },
  onCloseDepartment: function () {
    this.setData({
      departmentComponentShow: false
    })
  },
  deptCancel: function () {
    this.onCloseDepartment()
  },
  deptConfirm: function (event) {
    this.onCloseDepartment()
    this.setData({
      department: event.detail.value.join("")
    })
  },
  onDeptChange: function (event) {
    const {
      picker,
      value
    } = event.detail;
    picker.setColumnValues(1, $utils.getDepartments(value[0]));
  },
  onCloseCalendar() {
    this.setData({
      markTimeComponentShow: false
    });
  },
  onConfirmCalendar(event) {
    this.setData({
      markTimeComponentShow: false,
      markTime: $utils.formatMarkTime(event.detail),
      markTimeFormat: $utils.formatDate(event.detail, "M 月 d 日") + " " + $utils.formatDay(event.detail)
    })
  },
  confirmPay(event) {
    const {
      token,
      name,
      type,
      count,
      markTime,
      department
    } = this.data.orderlist[event.currentTarget.dataset.index]
    if ($utils.addHour(new Date(), 3).getTime() < $utils.parseDate(String(markTime), 'yyyyMMdd').getTime()) {
      wx.showToast({
        title: '尚未截止报餐，不能刷卡',
        icon: 'none'
      })
      return
    }
    $api.addOrUpdateOrder({
        token,
        name,
        type,
        count,
        markTime,
        department,
        pay: true
      })
      .then(res => {
        this.data.orderlist[event.currentTarget.dataset.index].pay = true
        this.setData({
          orderlist: this.data.orderlist
        })
      })
  },
  loadOrders() {
    const {
      markTime,
      receive,
      pay,
      department,
      type
    } = this.data
    $api.findOrders({
        admin: true,
        startMarkTime: markTime,
        endMarkTime: markTime,
        type,
        department: department === "所有部门" ? "" : department,
        receive: typeof receive === "boolean" ? receive : "",
        pay: typeof pay === "boolean" ? pay : ""
      })
      .then(res => {
        let ordercount = 0
        res.forEach(e => {
          ordercount += e.count
        })
        this.setData({
          orderlist: res,
          ordercount
        })
        wx.stopPullDownRefresh()
      })
      .catch(() => wx.stopPullDownRefresh())
  },
  onConfirmDialog() {
    this.loadOrders()
  },
  onChangeType(event) {
    this.setData({
      type: event.detail
    })
  },
  onChangePayOrder() {

  },
  onChangePay(event) {
    this.setData({
      pay: event.detail
    })
  },
  onChangeReceive(event) {
    this.setData({
      receive: event.detail
    })
  },
  openMarkTimeComponent() {
    this.setData({
      markTimeComponentShow: true
    })
  },
  openDepartmentComponent() {
    this.setData({
      departmentComponentShow: true
    })
  },
  openDialog() {
    this.setData({
      dialogShow: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.openDialog()
    this.setData({
      department: "所有部门",
      markTime: $utils.formatMarkTime(new Date()),
      markTimeFormat: $utils.formatDate(new Date(), "M 月 d 日") + " " + $utils.formatDay(new Date()),
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
    this.loadOrders()
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

  }
})