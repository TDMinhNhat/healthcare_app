import {BrowserRouter, Routes, Route} from "react-router";
import {Provider} from "react-redux";
import {useEffect, useState} from "react";
import { store } from "./stores/store.ts";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import ChatPage from "./pages/ChatPage.tsx";
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
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={ <HomePage language={languageData} setLanguage={setLanguage} languageType={language}/>} />
                    <Route path="/login" element={ <LoginPage loginLanguage={languageData.login} /> } />
                    <Route path="/register" element={ <RegisterPage registerLanguage={languageData.register} /> } />
                    <Route path="/admin" element={ <AdminPage adminLanguage={languageData.admin}/> } />
                    <Route path="/chat" element={ <ChatPage chatLanguage={languageData.chat} />}/>
                </Routes>
            </BrowserRouter>
        </Provider>
    )
}

export default App;