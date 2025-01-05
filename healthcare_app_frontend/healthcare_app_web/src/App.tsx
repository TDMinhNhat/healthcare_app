import {BrowserRouter, Routes, Route} from "react-router";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <HomePage/> } />
                <Route path="/login" element={ <LoginPage/> } />
                <Route path="/register" element={ <RegisterPage/> } />
                <Route path="/admin" element={ <AdminPage/> } />
            </Routes>
        </BrowserRouter>
    )
}

export default App;