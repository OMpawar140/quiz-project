import { createStore } from 'vuex';

const store = createStore({
  state: {
    user: null,
    profilePicture: null
  },
  mutations: {
    setUser(state, userData) {
      state.user = userData;
    },
    clearUser(state) {
      state.user = null;
    },
    setProfilePicture(state, picture) {
      state.profilePicture = picture;
    }

  },
});

export default store;
