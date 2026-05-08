import { Route, Routes } from "react-router-dom";
import Layout from "./shared/components/Layout.jsx";
import Landing from "./features/01-Landing/LandingPage.jsx";
import Selection from "./features/02-Selection/SelectionPage.jsx";
import Register from "./features/05-Auth/Register";
import Login from "./features/05-Auth/LoginForm";
import Error404 from "./Error404.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/selection" element={<Selection />} />
        <Route path="*" element={<Error404 />} />
      </Route>
    </Routes>
  );
}
