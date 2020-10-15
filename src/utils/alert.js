import Vue from 'vue'
let vm = new Vue()
export const successAlert = (msg) => {
    vm.$message({
        message: msg,
        type: 'success'
    })
}
export const warningAlert = (msg) => {
    vm.$message({
        message: msg,
        type: 'warning'
    })
}