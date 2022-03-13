import App from "./App";
import React, { ReactElement } from "react";
import { Routes, Route } from "react-router-dom";
import { AppNavbar } from "./navbar/navbar";
import { LoginScreen } from "./login/login";
import { RegisterScreen } from "./register/register";
import { AuthProvider } from "./authentication/auth-provider";

function MainRouter(): ReactElement {
  return (
    <div>
      <AuthProvider>
        <AppNavbar app_name="Hitman" />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default MainRouter;
