import { reqManageList, reqManageCount } from '../../utils/request'
const state = {
    list: [],
    size: 2,     //一页有多少个
    total: 0,    //总个数
    page: 1      //当前页
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
    reqListAction(context) {
        reqManageList({ page: context.state.page, size: context.state.size }).then(res => {

            let list = res.data.list ? res.data.list : []

            // 如果取到的数据是null，并且不是第一页，那么页码就减一，重新请求list

            if (context.state.page > 1 && list.length == 0) {
                context.commit('changePage', context.state.page - 1)
                context.dispatch('reqListAction')
            }
            context.commit('changeList', list)
        })
    },
    // 获取总数
    reqTotalAction(context) {
        reqManageCount().then(res => {
            context.commit('changeTotal', res.data.list[0].total)
        })
    },
    // 修改页码
    changePageAction(context, page) {
        context.commit('changePage', page);
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