import { createSlice } from "@reduxjs/toolkit";
import {
  setUserAsyncStorage,
  removeUserAsyncStorage,
} from "../../utils/asyncStorage";
import { se } from "date-fns/locale";
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      setUserAsyncStorage(action.payload);
    },
    updateUser: (state, action) => {
      state.user = state.user
        ? { ...state.user, ...action.payload } // ghi đè thông tin user cũ (các trường cùng tên)
        : action.payload;
      setUserAsyncStorage({
        ...state.user,
        ...action.payload,
      }); // ghi đè thông tin user cũ (các trường cùng tên)
    },
    logOut: (state) => {
      state.user = null;
      removeUserAsyncStorage();
    },
  },
});

export const { setUser, logOut, updateUser } = userSlice.actions;
export default userSlice.reducer;
