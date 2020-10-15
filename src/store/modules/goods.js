import { reqGoodsList, reqGoodsCount } from '../../utils/request'
const state = {
    list: [],
    total: 0,
    size: 2,
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
        let params = bool ? {} : { page: context.state.page, size: context.state.size }
        reqGoodsList(params).then(res => {
            let list = res.data.list ? res.data.list : []

            if (context.state.page > 1 && list.length == 0) {
                context.commit('changePage', context.state.page - 1);
                context.dispatch('reqListAction')
                return;
            }

            context.commit('changeList', list)
        })
    },
    reqTotalAction(context) {
        reqGoodsCount().then(res => {
            context.commit('changeTotal', res.data.list[0].total)
        })
    },
    changePageAction(context, page) {
        // 修改页码
        context.commit('changePage', page);
        context.dispatch('reqListAction')
    }
}
const getters = {
    list(state) {
        return state.list
    },
    total(state) {
        return state.total
    },
    size(state) {
        return state.size
    }
}

export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true
}