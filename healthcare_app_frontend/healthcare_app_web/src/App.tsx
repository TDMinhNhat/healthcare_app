import {BrowserRouter, Routes, Route} from "react-router";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import {useEffect, useState} from "react";
import vietnamese from "./languages/vietnamese.json";
import english from "./languages/english.json";

function App() {

    const [language, setLanguage] = useState("vietnamese");
    const [languageData, setLanguageData] = useState(vietnamese);

    useEffect(() => {
        async function fetchData() {
            if(language === "vietnamese") setLanguageData(vietnamese);
            else if(language === "english") setLanguageData(english);
        }
        fetchData();
    }, [language]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <HomePage language={languageData} setLanguage={setLanguage} languageType={language}/>} />
                <Route path="/login" element={ <LoginPage loginLanguage={languageData.login} /> } />
                <Route path="/register" element={ <RegisterPage registerLanguage={languageData.register} /> } />
                <Route path="/admin" element={ <AdminPage adminLanguage={languageData.admin}/> } />
            </Routes>
        </BrowserRouter>
    )
}

export default App;