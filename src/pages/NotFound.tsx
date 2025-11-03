import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      {/* Page header */}
      <PageHeader
        title="Page not found"
        subtitle="Sorry, we couldn’t find the page you’re looking for."
      />

      {/* Main 404 message */}
      <div className="mt-6">
        <h1 className="text-6xl font-bold text-gray-900 mb-3">404</h1>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        {/* Action */}
        <Link to="/">
          <Button variant="primary" size="md">
            Go back home
          </Button>
        </Link>
      </div>
    </section>
  );
}
