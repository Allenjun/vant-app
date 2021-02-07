// index.js
import $api from "../../utils/api"
import $utils from "../../utils/util"
import $watcher from "../../utils/watcher"
const app = getApp()
let orderMap = {}
Page({
  data: {
    showTip: new Date().getHours() >= 21 ? 1 : 0,
  },
  onLoad() {
    $watcher.setWatcher(this, getApp().globalData)
    wx.hideHomeButton()
    this.initCalendar()
  },
  initCalendar() {
    this.setData({
      calendar: {
        mindate: new Date().getHours() >= 21 ? $utils.addDay(new Date(), 2).getTime() : $utils.addDay(new Date(), 1).getTime(),
        defaultdate: new Date().getHours() >= 21 ? $utils.addDay(new Date(), 2).getTime() : $utils.addDay(new Date(), 1).getTime(),
        maxdate: $utils.addDay(new Date(), 31).getTime()
      }
    })
    this.loadOrders()
  },
  watch: {
    'userInfo.token': function () {
      this.loadOrders()
    }
  },
  onShow() {

  },
  onPullDownRefresh() {
    this.loadOrders()
  },
  openMeal(event) {
    const formatDay = $utils.formatDate(event.detail, "M 月 d 日") + " " + $utils.formatDay(event.detail)
    const markTime = $utils.formatMarkTime(event.detail)
    const lunchcount = orderMap[markTime] && orderMap[markTime].lunch ? orderMap[markTime].lunch.count : 0
    const dinnercount = orderMap[markTime] && orderMap[markTime].dinner ? orderMap[markTime].dinner.count : 0
    this.setData({
      show: true,
      mealItem: {
        markTime,
        formatDay,
        lunchcount,
        dinnercount
      }
    })
  },
  lunchChange(event) {
    this.setData({
      mealItem: {
        markTime: this.data.mealItem.markTime,
        formatDay: this.data.mealItem.formatDay,
        lunchcount: event.detail,
        dinnercount: this.data.mealItem.dinnercount
      }
    })
  },
  dinnerChange(event) {
    this.setData({
      mealItem: {
        markTime: this.data.mealItem.markTime,
        formatDay: this.data.mealItem.formatDay,
        lunchcount: this.data.mealItem.lunchcount,
        dinnercount: event.detail
      }
    })
  },
  loadOrders() {
    const startTime = $utils.addDay(new Date(), -31)
    const endTime = $utils.addDay(new Date(), 31)
    $api.findOrders({
        startMarkTime: $utils.formatMarkTime(startTime),
        endMarkTime: $utils.formatMarkTime(endTime)
      })
      .then(res => {
        orderMap = {}
        res.forEach(order => {
          if (!orderMap.hasOwnProperty(order.markTime)) {
            orderMap[order.markTime] = {}
          }
          if (!orderMap[order.markTime].hasOwnProperty(order.type)) {
            orderMap[order.markTime][order.type] = order
          }
        })
        this.setData({
          formatter(day) {
            if (day.date.toDateString() === $utils.addDay(new Date(), 1).toDateString()) {
              day.text = '明天'
            }
            const markTime = $utils.formatMarkTime(day.date)
            if (!orderMap[markTime]) {
              return day
            }
            const lunchOrder = orderMap[markTime]['lunch']
            const dinnerOrder = orderMap[markTime]['dinner']
            if (lunchOrder && lunchOrder.count > 0) {
              day.lunch = orderMap[markTime]['lunch'].count
              day.topInfo = '午 x ' + orderMap[markTime]['lunch'].count
            }
            if (dinnerOrder && dinnerOrder.count > 0) {
              day.dinner = orderMap[markTime]['dinner'].count
              day.bottomInfo = '晚 x ' + orderMap[markTime]['dinner'].count
            }
            return day
          }
        })
        wx.stopPullDownRefresh()
      })
      .catch(() => wx.stopPullDownRefresh())
  },
  orderMeal(event) {
    const {
      markTime,
      lunchcount,
      dinnercount
    } = this.data.mealItem
    const data = {
      department: app.globalData.userInfo.department,
      markTime: markTime,
      name: app.globalData.userInfo.name
    }
    const lunchOrder = this.getOrderFromMap(markTime, 'lunch')
    const dinnerOrder = this.getOrderFromMap(markTime, 'dinner')
    if (($utils.isEmpty(lunchOrder) && lunchcount > 0) || (!$utils.isEmpty(lunchOrder) && lunchOrder.count !== lunchcount)) {
      data['type'] = "lunch"
      data['count'] = lunchcount
      $api.addOrUpdateOrder(data).then(() => this.loadOrders())
    }
    if (($utils.isEmpty(dinnerOrder) && dinnercount > 0) || (!$utils.isEmpty(dinnerOrder) && dinnerOrder.count !== dinnercount)) {
      data['type'] = "dinner"
      data['count'] = dinnercount
      $api.addOrUpdateOrder(data).then(() => this.loadOrders())
    }
  },
  getOrderFromMap(markTime, type) {
    if (orderMap[markTime]) {
      return orderMap[markTime][type]
    }
    return {}
  }
})