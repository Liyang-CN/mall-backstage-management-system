export const actions = {
    // 组件触发修改userInfo
    changeUserInfoAction(context,info){
        context.commit('changeUserInfo',info)
    }
}