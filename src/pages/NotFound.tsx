import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Page not found</h2>
      <p className="text-gray-500 mb-6 max-w-md">
        Sorry, the page you’re looking for doesn’t exist or may have been moved.
      </p>
      <Link
        to="/"
        className="inline-block px-5 py-2.5 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 transition-colors"
      >
        Go back home
      </Link>
    </div>
  );
}
