import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useAuth } from "../../features/05-Auth/AuthContext";
import "../../index.css";

const NO_SIDEBAR_ROUTES = ["/", "/login", "/register", "/selection"];
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/selection",
  "/browse",
  "/howitworks",
  "/lessons",
];

export default function Layout() {
  const { user } = useAuth();
  const location = useLocation();
  const showSidebar = user && !NO_SIDEBAR_ROUTES.includes(location.pathname);

  useEffect(() => {
    if (!user && !PUBLIC_ROUTES.includes(location.pathname)) {
      navigate("/login");
    }
  }, [user, location.pathname]);

  return (
    <div className="app-layout">
      <Navbar />
      {showSidebar && <Sidebar />}
      <Outlet />
      <Footer />
    </div>
  );
}
