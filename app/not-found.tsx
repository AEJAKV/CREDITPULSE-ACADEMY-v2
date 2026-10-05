import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="main" className="standalone-message">
      <span className="eyebrow">PAGE NOT FOUND</span>
      <h1>Let’s get you back on track.</h1>
      <p>This page may have moved, or the course link is incomplete.</p>
      <Link href="/dashboard" className="button primary">
        Return to my learning
      </Link>
    </main>
  );
}
