import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    userData: null,
  },
  reducers: {
    registerSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.userData = action.payload; // {name, email, avatar, ...}
    },
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.userData = action.payload; // {name, email, avatar, ...}
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userData = null;
    },
    updateUserInfo: (state, action) => {
      if (state.userData) {
        state.userData = {
          ...state.userData,
          ...action.payload,
        };
      }
    },
  },
});

export const { loginSuccess, logout, registerSuccess, updateUserInfo } =
  userSlice.actions;
export default userSlice.reducer;
