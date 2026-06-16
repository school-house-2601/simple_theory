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
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import PageTransition from "./shared/PageTransition.jsx";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
  }, []);

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <PageTransition>
              <Landing />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/register"
          element={
            <PageTransition>
              <Register />
            </PageTransition>
          }
        />
        <Route
          path="/selection"
          element={
            <PageTransition>
              <Selection />
            </PageTransition>
          }
        />
        <Route
          path="/howitworks"
          element={
            <PageTransition>
              <HowItWorksPage />
            </PageTransition>
          }
        />
        <Route
          path="/settings"
          element={
            <PageTransition>
              <SettingsPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageTransition>
                <DashboardPage />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lessons"
          element={
            <ProtectedRoute>
              <PageTransition>
                <LessonPage />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/browse"
          element={
            <ProtectedRoute>
              <PageTransition>
                <BrowsePage />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice"
          element={
            <ProtectedRoute>
              <PageTransition>
                <PracticePage />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageTransition>
                <ProfilePage />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <Error404 />
            </PageTransition>
          }
        />
      </Route>
    </Routes>
  );
}
