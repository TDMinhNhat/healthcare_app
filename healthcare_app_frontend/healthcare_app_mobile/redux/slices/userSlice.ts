import { createSlice } from "@reduxjs/toolkit";
import {
  setUserAsyncStorage,
  removeUserAsyncStorage,
} from "../../utils/asyncStorage";
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
    logOut: (state) => {
      state.user = null;
      removeUserAsyncStorage();
    },
  },
});

export const { setUser, logOut } = userSlice.actions;
export default userSlice.reducer;
