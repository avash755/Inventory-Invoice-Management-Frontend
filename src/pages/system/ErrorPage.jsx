import Button from "@/components/common/Button";

export default function ErrorPage({ title = "Something went wrong", message, onRetry }) {
  return (
    <div className="min-h-screen grid place-items-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-lg font-semibold text-state-danger">{title}</h1>
        {message && <p className="mt-1 text-sm text-ink-500">{message}</p>}
        {onRetry && (
          <Button className="mt-6" variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    </div>
  );
}