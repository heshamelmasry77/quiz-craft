import { Link, NavLink, Outlet } from "react-router-dom";
import Loader from "../components/ui/Loader";
import Modal from "../components/ui/Modal";

export default function Layout() {
  const baseLink = "px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150";
  const inactive = "text-gray-600 hover:text-gray-900 hover:bg-gray-100";
  const active = "bg-blue-100 text-blue-700 font-semibold";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Global overlays */}
      <Loader />
      <Modal />

      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <nav className="max-w-6xl mx-auto flex items-center justify-between p-4">
          {/* Left side: Brand */}
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-blue-600 hover:text-blue-700"
          >
            QuizCraft
          </Link>

          {/* Center: Navigation */}
          <div className="flex items-center gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `${baseLink} ${isActive ? active : inactive}`}
            >
              Builder
            </NavLink>
            <NavLink
              to="/preview"
              className={({ isActive }) => `${baseLink} ${isActive ? active : inactive}`}
            >
              Preview
            </NavLink>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
