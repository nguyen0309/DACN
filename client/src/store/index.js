import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: {
        name: "",
        role: "",
        id: "",
        auth: false
    }
  },
  mutations: {
    setUser (state, value) {
        state.user.name = value.name
        state.user.role = value.role
        state.user.id = value.id
        state.user.auth = value.auth
    },
  
  }
})
export default store