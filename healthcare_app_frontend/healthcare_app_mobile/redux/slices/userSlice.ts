import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            sessionStorage.setItem("user", JSON.stringify(action.payload));
        },
        logOut: (state) => {
            state.user = null;
            sessionStorage.removeItem("user");
        }
    }
});

export const { setUser, logOut } = userSlice.actions;
export default userSlice.reducer;