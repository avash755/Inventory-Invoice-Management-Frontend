import { Link } from "react-router-dom";
import Button from "@/components/common/Button";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center px-6">
      <div className="text-center">
        <p className="text-6xl font-semibold text-ink-300">404</p>
        <h1 className="mt-3 text-lg font-semibold text-ink-900">Page not found</h1>
        <p className="mt-1 text-sm text-ink-500">
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <Link to={ROUTES.LOGIN} className="inline-block mt-6">
          <Button variant="primary">Back to home</Button>
        </Link>
      </div>
    </div>
  );
}