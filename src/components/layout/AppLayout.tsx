import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Topbar } from "./Topbar";

export function AppLayout() {
  return (
    <div className="site-shell" id="top">
      <div className="ambient ambient-top" />
      <div className="ambient ambient-bottom" />

      <Topbar />

      <Outlet />

      <Footer />
    </div>
  );
}
