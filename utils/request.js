export default {
  REQUEST
}

function REQUEST(url, data = {}, method, auth = true) {
  let retry = 0
  while (auth && !wx.getStorageSync('token') && retry < 10) {
    sleep(1000)
    retry++
  }
  showLoading()
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method,
      data,
      header: {
        token: wx.getStorageSync('token') || ""
      },
      success(res) {
        if (isHttpSuccess(res.statusCode)) {
          showSuccess()
          resolve(res.data)
        } else {
          const err = {
            msg: "网络错误：" + res.statusCode,
            detail: res
          }
          showErr(err)
          reject(err)
        }
      },
      fail(err) {
        showErr(err)
        reject(err)
      },
      complete() {
        wx.hideLoading()
      }
    })
  })
}

function showLoading() {
  wx.showLoading({
    icon: 'loading',
    mask: true
  })
}

function showSuccess() {
  wx.showToast({
    icon: 'success'
  })
}

function showErr(err) {
  wx.showToast({
    icon: 'error',
    title: errPicker(err)
  });
}

function errPicker(err) {
  if (typeof err === 'string') {
    return err;
  }
  return err.msg || err.errMsg || (err.detail && err.detail.errMsg) || '未知错误';
}

function isHttpSuccess(status) {
  return status >= 200 && status < 300 || status === 304;
}

async function sleep(ms) {
  await new Promise(resolve => setTimeout(resolve, ms))
}