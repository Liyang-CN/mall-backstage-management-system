import { reqSpecsList, reqSpecsCount } from '../../utils/request'
const state = {
    list: [],
    size: 2,
    total: 0,
    page: 1
}
const mutations = {
    changeList(state, arr) {
        state.list = arr
    },
    changeTotal(state, num) {
        state.total = num
    },
    changePage(state, page) {
        state.page = page
    }
}
const actions = {
    //页面请求
    reqListAction(context, bool) {
        // 什么参数不传的话  就默认走后边，传任意一个真值就走前面
        let params = bool ? {} : { page: context.state.page, size: context.state.size }
        reqSpecsList(params).then(res => {
            let list = res.data.list ? res.data.list : []
            if (context.state.page > 1 && list.length == 0) {
                context.commit("changePage", context.state.page - 1)
                context.dispatch("reqListAction")
                return;
            }
            list.forEach(item => {
                item.attrs = JSON.parse(item.attrs)
            })
            context.commit('changeList', list)
        })
    },
    reqTotalAction(context) {
        reqSpecsCount().then(res => {
            context.commit('changeTotal', res.data.list[0].total)
        })
    },
    changePageAction(context, page) {
        context.commit('changePage', page)
        context.dispatch('reqListAction')
    }
}
const getters = {
    list(state) {
        return state.list
    },
    size(state) {
        return state.size
    },
    total(state) {
        return state.total
    }
}

export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true
}