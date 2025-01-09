import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      //clear token
      AsyncStorage.removeItem("accessToken");
      state.user = null;
    },
  },
});
export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
