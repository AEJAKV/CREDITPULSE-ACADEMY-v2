'use client';
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main id="main" className="standalone-message">
      <span className="eyebrow">A SMALL INTERRUPTION</span>
      <h1>We couldn’t load this page.</h1>
      <p>
        Try again. If you are setting up the site, check your server terminal and database
        configuration.
      </p>
      <button className="button primary" onClick={reset}>
        Try again
      </button>
      <a className="text-link" href="/login">
        Return to sign-in
      </a>
    </main>
  );
}
