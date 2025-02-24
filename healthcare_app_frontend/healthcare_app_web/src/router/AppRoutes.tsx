import { lazy, Suspense } from "react";
import { Loading } from "../components/global/Loading/Loading";
import { BrowserRouter, Route, Routes } from "react-router";
import { ROUTING } from "../constants/routing";

const HomePage = lazy(() => import("../pages/HomePage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const VerifyEmailPage = lazy(() => import("../pages/VerifyEmailPage"));
const AdminPage = lazy(() => import("../pages/AdminPage"));
const ChatPage = lazy(() => import("../pages/ChatPage"));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <BrowserRouter>
        <Routes>
          <Route
            path={ROUTING.HOME}
            element={
              <HomePage
              // language={languageData}
              // setLanguage={setLanguage}
              // languageType={language}
              />
            }
          />
          <Route path={ROUTING.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTING.LOGIN} element={<LoginPage />} />
          <Route path={ROUTING.VERIFY_EMAIL} element={<VerifyEmailPage />} />
          {/* <Route
            path={ROUTING.LOGIN}
            element={<LoginPage loginLanguage={languageData.login} />}
          />
          <Route
            path={ROUTING.REGISTER}
            element={<RegisterPage registerLanguage={languageData.register} />}
          />
          <Route
            path={ROUTING.ADMIN}
            element={<AdminPage adminLanguage={languageData.admin} />}
          />
          <Route
            path={ROUTING.CHAT}
            element={<ChatPage chatLanguage={languageData.chat} />}
          /> */}
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};
