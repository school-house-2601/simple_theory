import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./Footer";
import "../../index.css";

export default function Layout() {
  return (
    <>
      <Navbar />

      <main className="app-container">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
