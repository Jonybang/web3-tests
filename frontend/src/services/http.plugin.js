import http from './http'
export default {
    http,
    install (Vue, options) {
        Vue.prototype.$http = http
    }
}
