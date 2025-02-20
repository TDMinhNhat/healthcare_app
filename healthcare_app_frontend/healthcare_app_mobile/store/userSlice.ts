import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

interface LocationType {
  latitude: number;
  longitude: number;
  address: string;
}

const initialState: {
  user: null | any;
  currentLocation: LocationType | null;
} = {
  user: null,
  currentLocation: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
    logout: (state) => {
      // AsyncStorage.removeItem("accessToken");
      AsyncStorage.clear();
      state.user = null;
      state.currentLocation = null;
    },
  },
});

export const { setUser, setCurrentLocation, logout } = userSlice.actions;
export default userSlice.reducer;
