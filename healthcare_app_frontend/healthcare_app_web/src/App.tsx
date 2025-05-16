import { I18nextProvider } from "react-i18next";
import i18n from "./languages/i18n";
import { AppRoutes } from "./router/AppRoutes.tsx";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AppRoutes />
    </I18nextProvider>
  );
}

export default App;
