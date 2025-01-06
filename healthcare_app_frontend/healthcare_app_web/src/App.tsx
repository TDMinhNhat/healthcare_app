import {BrowserRouter, Routes, Route} from "react-router";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import {useState} from "react";
import vietnamese from "./languages/vietnamese.json";
import "./styles/main.scss";

function App() {

    const [language, setLanguage] = useState(vietnamese);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <HomePage language={language} />} />
                <Route path="/login" element={ <LoginPage /> } />
                <Route path="/register" element={ <RegisterPage/> } />
                <Route path="/admin" element={ <AdminPage/> } />
            </Routes>
        </BrowserRouter>
    )
}

export default App;