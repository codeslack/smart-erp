import React from "react";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

export default function NotFound(): React.JSX.Element {
  return (
    <section className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-cyan-600 lg:text-9xl dark:text-cyan-500">
            404
          </h1>
          <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
            Something's missing.
          </p>
          <p className="mb-8 text-lg font-light text-gray-500 dark:text-gray-400">
            Sorry, we can't find that page. You'll find lots to explore on the
            home page.
          </p>
          <div className="inline-flex w-full justify-center">
            {/* The 'as' prop correctly casts the Button element types to match LinkProps */}
            <Button as={Link} to="/">
              Back to Homepage
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
