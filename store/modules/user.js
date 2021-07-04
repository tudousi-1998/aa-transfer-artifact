const user = {
  state: {
    userList: uni.getStorageSync('userList') || []
  },
  mutations: {
    SET_USERLIST: (state, userlist) => {
      state.userList = userlist
      uni.setStorageSync('userList', userlist)
    },
  },
  actions: {

  }
}

export default user