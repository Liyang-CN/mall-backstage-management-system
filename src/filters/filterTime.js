// 时间戳转换为
export default (time) => {
    let date = new Date(parseInt(time));
    let year = date.getFullYear();
    let month = (date.getMonth() + 1 + '').padStart(2, '0')
    let day = (date.getDate() + '').padStart(2, '0')
    let hours = (date.getHours() + '').padStart(2, '0')
    let minutes = (date.getMinutes() + '').padStart(2, '0')
    let seconds = (date.getSeconds() + '').padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}