import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function NotFound(): React.JSX.Element {
  return (
    <section className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-primary-600 lg:text-9xl dark:text-primary-500">
            404
          </h1>
          <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
            Page Not Found
          </p>
          <p className="mb-8 text-lg font-light text-gray-500 dark:text-gray-400">
            Sorry, we can't find that page. The requested resource does not exist or has been moved.
          </p>
          <div className="inline-flex w-full justify-center">
            <Link to="/dashboard">
              <Button color="primary">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
