import { Route, Routes } from "react-router-dom";
import Layout from "./shared/components/Layout.jsx";
import Landing from "./features/01-Landing/LandingPage.jsx";
import Selection from "./features/02-Selection/SelectionPage.jsx";
import BrowsePage from "./features/04-Learning/VideoPlayer.jsx";
import LessonPage from "./features/04-Learning/LessonPage.jsx";
import Register from "./features/05-Auth/Register";
import Login from "./features/05-Auth/LoginForm";
import Error404 from "./Error404.jsx";
import PracticePage from "./features/06-Practice/PracticePage.jsx";
import SettingsPage from "./features/06-Settings/SettingsPage.jsx";
import HowItWorksPage from "./shared/components/HowItWorks.jsx";
import ProfilePage from "./features/07-Profile/ProfilePage.jsx";
import ProtectedRoute from "./shared/components/ProtectedRoute.jsx";

export default function App() {
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
