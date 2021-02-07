import $request from "./request"
import $constant from "./constant"
export default {
  login(data) {
    return $request.REQUEST($constant.SERVER_URL + "/v2/login", data, 'POST', false)
  },
  userInfo(data) {
    return $request.REQUEST($constant.SERVER_URL + "/v2/checkToken", data, 'POST', false)
  },
  findOrders(data) {
    return $request.REQUEST($constant.SERVER_URL + "/v2/findOrders", data, 'POST')
  },
  addOrUpdateOrder(data) {
    return $request.REQUEST($constant.SERVER_URL + "/v2/addOrUpdateOrder", data, 'POST')
  },
  changeDepartment(data) {
    return $request.REQUEST($constant.SERVER_URL + "/user/changeDepartment", data, 'POST')
  }
}