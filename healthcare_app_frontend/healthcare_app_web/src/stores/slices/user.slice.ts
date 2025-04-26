import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  user: null | any;
}

// Try to get user from localStorage if available
const getUserFromSessionStorage = (): any | null => {
  try {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    return null;
  }
};

const initialState: UserState = {
  user: getUserFromSessionStorage(),
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logOut: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    },
  },
});

export const { setUser, logOut } = userSlice.actions;
export default userSlice.reducer;
