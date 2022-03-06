import App from "./App";
import React, { ReactElement } from "react";
import { Routes, Route } from "react-router-dom";
import { AppNavbar } from "./navbar/navbar";
import { LoginScreen } from "./login/login";
import { RegisterScreen } from "./register/register";

function MainRouter(): ReactElement {
  return (
    <div>
      <AppNavbar app_name="Hitman" />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
      </Routes>
    </div>
  );
}

export default MainRouter;
