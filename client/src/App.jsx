import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";

import { useAuthStore } from "./store/useAuthStore.js";
import { Loader } from "lucide-react";

import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/auth/signup/SignUpPage.jsx";
import LoginPage from "./pages/auth/login/LoginPage.jsx";
import DocumentsPage from "./pages/documents/DocumentsPage.jsx";
import UserRolesPage from "./pages/user-roles/UserRolesPage.jsx";
import FoldersPage from "./pages/folders/FoldersPage.jsx";
import SettingsPage from "./pages/settings/SettingsPage.jsx";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader className="size-10 animate-spin" />
			</div>
		);
	}

  console.log("authUser", authUser);

  return (
    <>
      <div className="h-full">
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/documents"
            element={!authUser ? <LoginPage /> : <DocumentsPage />}
          />
          <Route
            path="/users"
            element={!authUser ? <LoginPage /> : <UserRolesPage/>}
          />
          <Route
            path="/folders"
            element={!authUser ? <LoginPage /> : <FoldersPage />}
          />
          <Route
            path="/settings"
            element={!authUser ? <LoginPage /> : <SettingsPage />}
          />
        </Routes>
      </div>
    </>
  )
}

export default App