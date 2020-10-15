export const state = {
    // 用户信息
    userInfo: sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : {}
}
export const mutations = {
    changeUserInfo(state, info) {
        state.userInfo = info;
        //由于状态层刷新，数据就没有了，但是我们希望数据还在，所以在本地存储中也存一份
        ///如果info是一个{} ，那么代表要退出，删；如果不是一个空{},代表是登录，存
        if (info.id) {
            // 登录
            sessionStorage.setItem('userInfo', JSON.stringify(info))
        } else {
            // 退出登录
            sessionStorage.removeItem('userInfo')
        }
    }
}
export const getters = {
    userInfo(state) {
        return state.userInfo
    }
}
