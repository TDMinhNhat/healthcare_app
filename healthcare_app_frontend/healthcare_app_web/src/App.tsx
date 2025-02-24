import { I18nextProvider } from "react-i18next";
import i18n from "./languages/i18n";
import { AppRoutes } from "./router/AppRoutes.tsx";

function App() {
  //   const [language, setLanguage] = useState("vietnamese");
  //   const [languageData, setLanguageData] = useState(vietnamese);

  //   useEffect(() => {
  //     async function fetchData() {
  //       if (language === "vietnamese") setLanguageData(vietnamese);
  //       else if (language === "english") setLanguageData(english);
  //     }
  //     fetchData();
  //   }, [language]);

  return (
    <I18nextProvider i18n={i18n}>
      {/* <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                language={languageData}
                setLanguage={setLanguage}
                languageType={language}
              />
            }
          />
          <Route
            path="/login"
            element={<LoginPage loginLanguage={languageData.login} />}
          />
          <Route
            path="/register"
            element={<RegisterPage registerLanguage={languageData.register} />}
          />
          <Route
            path="/admin"
            element={<AdminPage adminLanguage={languageData.admin} />}
          />
          <Route
            path="/chat"
            element={<ChatPage chatLanguage={languageData.chat} />}
          />
        </Routes>
      </BrowserRouter> */}
      <AppRoutes />
    </I18nextProvider>
  );
}

export default App;
