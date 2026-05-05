import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import "../../index.css";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
