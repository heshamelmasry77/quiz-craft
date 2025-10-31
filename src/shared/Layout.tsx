import { Link, NavLink, Outlet } from "react-router-dom";
import Loader from "../components/ui/Loader";

export default function Layout() {
  const link = "px-3 py-2 rounded hover:bg-gray-100";
  const active = "bg-gray-200";
  return (
    <div className="min-h-screen">
      {/* Global loader overlay */}
      <Loader />

      <header className="border-b">
        <nav className="max-w-5xl mx-auto flex items-center gap-2 p-3">
          <Link to="/" className="font-semibold">
            QuizCraft
          </Link>
          <NavLink to="/" end className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
            Builder
          </NavLink>
          <NavLink to="/preview" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
            Preview
          </NavLink>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
