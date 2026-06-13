import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./shared/components/Layout.jsx";
import Landing from "./features/Landing/LandingPage.jsx";
import Selection from "./features/Selection/SelectionPage.jsx";
import BrowsePage from "./features/Learning/VideoPlayer.jsx";
import LessonPage from "./features/Learning/LessonPage.jsx";
import Register from "./features/Auth/Register";
import Login from "./features/Auth/LoginForm";
import Error404 from "./Error404.jsx";
import PracticePage from "./features/Practice/PracticePage.jsx";
import SettingsPage from "./features/Settings/SettingsPage.jsx";
import HowItWorksPage from "./shared/components/HowItWorks.jsx";
import ProfilePage from "./features/Profile/ProfilePage.jsx";
import DashboardPage from "./features/Dashboard/DashboardPage.jsx";
import ProtectedRoute from "./shared/components/ProtectedRoute.jsx";

export default function App() {
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/selection" element={<Selection />} />
        <Route path="/howitworks" element={<HowItWorksPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lessons"
          element={
            <ProtectedRoute>
              <LessonPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/browse"
          element={
            <ProtectedRoute>
              <BrowsePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice"
          element={
            <ProtectedRoute>
              <PracticePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Error404 />} />
      </Route>
    </Routes>
  );
}
