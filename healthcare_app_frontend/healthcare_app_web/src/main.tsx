import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/tab-chat.scss";
import { Provider } from "react-redux";
import { store } from "./stores/store.ts";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./styles/theme.ts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
        <ToastContainer position="top-center" autoClose={5000} />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
