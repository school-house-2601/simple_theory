import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useAuth } from "../../features/05-Auth/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../index.css";

const NO_SIDEBAR_ROUTES = ["/", "/login", "/register", "/selection"];

export default function Layout() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const showSidebar = user && !NO_SIDEBAR_ROUTES.includes(location.pathname);

  useEffect(() => {
    if (!user) {
      navigate("/")
    }
  }, [user]);

  return (
    <div className="app-layout">
      <Navbar />
      {showSidebar && <Sidebar />}
      <Outlet />
      <Footer />
    </div>
  );
}
