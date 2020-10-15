import { reqMenuList } from '../../utils/request'
const state = {
    list: []
}
const mutations = {
    changeList(state, arr) {
        state.list = arr
    }
}
const actions = {
    //页面请求
    reqListAction(context) {
        reqMenuList().then(res => {
            context.commit('changeList', res.data.list)
        })
    }
}
const getters = {
    list(state) {
        return state.list
    }
}

export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true
}