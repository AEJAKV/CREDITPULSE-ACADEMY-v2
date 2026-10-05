export type AmbientEffect = 'glow' | 'pulse';
// Decorative only. All styling and motion live in premium.css under ".ambient-*";
// the layer animates transform and opacity only and never takes pointer events.
export function AmbientBackground({
  effects = ['glow'],
  placement = 'fixed',
  intensity = 'full',
  still = false,
}: {
  effects?: AmbientEffect[];
  /** "fixed" sits behind the whole page; "contained" fills its positioned parent. */
  placement?: 'fixed' | 'contained';
  intensity?: 'full' | 'faint';
  /** Renders the still version with no motion at all. */
  still?: boolean;
}) {
  return (
    <div
      className={`ambient-bg is-${placement} is-${intensity} ${still ? 'is-still' : ''}`}
      aria-hidden="true"
    >
      {effects.includes('glow') && (
        <div className="ambient-glow">
          <span className="ambient-blob blob-teal" />
          <span className="ambient-blob blob-lime" />
          <span className="ambient-blob blob-pale" />
          <span className="ambient-blob blob-lime-soft" />
        </div>
      )}
      {effects.includes('pulse') && (
        <div className="ambient-pulse">
          <div className="ambient-pulse-reveal">
            <div className="ambient-pulse-line">
              {/* Same heartbeat blip as the Logo line, extended into a full-width trace. */}
              <svg viewBox="0 0 600 24" focusable="false">
                <path
                  d="M0 12H350l5-3 5 6 5-3h16l4-9 5 18 5-17 5 8H600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
