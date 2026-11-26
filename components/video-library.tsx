'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { Check, ChevronLeft, ChevronRight, LockKeyhole, Play, ShieldCheck } from 'lucide-react';
import { post } from '@/lib/client';
import type { VideoCard } from '@/lib/videos';

type Level = { name: string; theme: string; description: string };
const pad = (n: number) => String(n).padStart(2, '0');

function Thumb({ video, large }: { video: VideoCard; large?: boolean }) {
  return (
    <span className={`video-thumb ${video.locked ? 'is-locked' : ''} ${large ? 'is-large' : ''}`}>
      <span className="video-thumb-num" aria-hidden="true">
        {pad(video.number)}
      </span>
      <span className="video-thumb-icon" aria-hidden="true">
        {video.locked ? <LockKeyhole size={large ? 26 : 18} /> : <Play size={large ? 28 : 16} />}
      </span>
      {video.watched && (
        <span className="video-thumb-badge">
          <Check size={12} strokeWidth={3} /> Watched
        </span>
      )}
      {!video.locked && video.progress > 0 && (
        <span className="video-thumb-bar" aria-hidden="true">
          <span style={{ width: `${video.progress}%` }} />
        </span>
      )}
    </span>
  );
}

function statusLabel(v: VideoCard) {
  if (v.locked) return `Opens at ${v.tierName}`;
  if (v.watched) return 'Watched';
  if (v.progress > 0) return `In progress · ${v.progress}%`;
  return 'Not started';
}

export function VideoLibrary({
  cards,
  levels,
  approvedTier,
  approvedName,
  nextId,
}: {
  cards: VideoCard[];
  levels: Level[];
  approvedTier: number;
  approvedName: string;
  nextId: string | null;
}) {
  const next = cards.find((c) => c.id === nextId);
  const watchedCount = cards.filter((c) => c.watched).length;
  const [selected, setSelected] = useState(Math.min(next?.tier ?? approvedTier, 5));
  const [notice, setNotice] = useState('');

  const pick = (i: number) => {
    setSelected(i);
    setNotice('');
    if (window.matchMedia('(min-width: 761px)').matches)
      document.getElementById(`level-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="video-library">
      <div className="page-heading video-heading">
        <div>
          <div className="eyebrow">WATCH &amp; LEARN · {cards.length} SHORT VIDEOS · 6 LEVELS</div>
          <h1>Money &amp; Mind video series</h1>
          <p>
            Short videos for every membership level. New levels open as your membership tier grows.
          </p>
        </div>
        <div className="video-progress-card">
          <div>
            <strong>Your progress</strong>
            <span>
              {watchedCount} of {cards.length} watched
            </span>
          </div>
          <span
            className="video-progress"
            role="progressbar"
            aria-label="Video series progress"
            aria-valuenow={watchedCount}
            aria-valuemin={0}
            aria-valuemax={cards.length}
          >
            <span style={{ width: `${(watchedCount / cards.length) * 100}%` }} />
          </span>
          <small>
            Your approved tier: <strong>{approvedName}</strong>
          </small>
        </div>
      </div>

      {next && (
        <section className="video-upnext" aria-label="Up next">
          <Link href={`/videos/${next.id}`} aria-label={`Play ${next.title}`}>
            <Thumb video={next} large />
          </Link>
          <div>
            <div className="video-chips">
              <span className="chip-lime">UP NEXT</span>
              <span className="chip-soft">
                {next.tierName.toUpperCase()} · VIDEO {next.number} OF {cards.length}
              </span>
            </div>
            <h2>{next.title}</h2>
            <p>
              {next.progress > 0
                ? 'You stopped partway through. Pick up where you left off.'
                : `The next video in your ${next.tierName} level.`}
            </p>
            <Link className="button primary" href={`/videos/${next.id}`}>
              <Play size={16} /> {next.progress > 0 ? 'Resume video' : 'Play video'}
            </Link>
          </div>
        </section>
      )}

      <nav className="video-levels" aria-label="Video levels">
        {levels.map((level, i) => {
          const items = cards.filter((c) => c.tier === i);
          const locked = i > approvedTier;
          const done = items.filter((c) => c.watched).length;
          const complete = !locked && done === items.length;
          return (
            <button
              type="button"
              key={level.name}
              aria-pressed={selected === i}
              className={`video-level ${locked ? 'is-locked' : ''} ${complete ? 'is-complete' : ''}`}
              onClick={() => pick(i)}
            >
              <span className="video-level-dot">
                {complete ? <Check size={13} strokeWidth={3} /> : locked ? '—' : i + 1}
              </span>
              <span>
                <strong>{level.name}</strong>
                <small>
                  {locked ? 'Locked' : complete ? 'Complete' : `${done}/${items.length} watched`}
                </small>
              </span>
            </button>
          );
        })}
      </nav>

      {levels.map((level, i) => {
        const items = cards.filter((c) => c.tier === i);
        const locked = i > approvedTier;
        const done = items.filter((c) => c.watched).length;
        const complete = !locked && done === items.length;
        return (
          <section
            id={`level-${i}`}
            key={level.name}
            className={`video-level-section ${selected === i ? 'is-selected' : ''}`}
            aria-label={`${level.name} videos`}
          >
            <div className="video-level-head">
              <div>
                <div className="video-level-title">
                  <span className={locked ? 'chip-muted' : 'chip-dark'}>LEVEL {i + 1}</span>
                  <h2>
                    {level.name} · {level.theme}
                  </h2>
                </div>
                <p>{level.description}</p>
              </div>
              <span
                className={`video-status ${locked ? 'is-locked' : complete ? 'is-complete' : ''}`}
              >
                {locked
                  ? `Locked · opens at ${level.name}`
                  : complete
                    ? `Complete · ${done} of ${items.length}`
                    : `${done} of ${items.length} watched`}
              </span>
            </div>
            <div className="video-grid">
              {items.map((video) =>
                video.locked ? (
                  <button
                    type="button"
                    key={video.id}
                    className="video-card is-locked"
                    aria-label={`Locked: ${video.title}`}
                    onClick={() =>
                      setNotice(
                        `Video ${video.number} opens when your membership reaches ${video.tierName}.`,
                      )
                    }
                  >
                    <Thumb video={video} />
                    <span className="video-card-body">
                      <strong>{video.title}</strong>
                      <small>{statusLabel(video)}</small>
                    </span>
                  </button>
                ) : (
                  <Link key={video.id} className="video-card" href={`/videos/${video.id}`}>
                    <Thumb video={video} />
                    <span className="video-card-body">
                      <strong>{video.title}</strong>
                      <small className={video.watched ? 'is-watched' : ''}>
                        {statusLabel(video)}
                      </small>
                    </span>
                  </Link>
                ),
              )}
            </div>
          </section>
        );
      })}

      <div className="quiet-note">
        <ShieldCheck size={20} />
        <p>
          Locked levels open automatically when your membership tier is approved. Watching a video
          to the end marks it as watched.
        </p>
      </div>

      {notice && (
        <div className="video-toast" role="status">
          <LockKeyhole size={18} />
          <span>{notice}</span>
          <button type="button" aria-label="Dismiss" onClick={() => setNotice('')}>
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export function VideoPlayer({
  video,
  playlist,
  levelName,
  levelTheme,
  total,
  nextVideo,
  takeaway: initialTakeaway,
}: {
  video: VideoCard;
  playlist: VideoCard[];
  levelName: string;
  levelTheme: string;
  total: number;
  nextVideo: { id: string; title: string; locked: boolean; tierName: string } | null;
  takeaway: string;
}) {
  const router = useRouter();
  const ref = useRef<HTMLVideoElement>(null);
  const sent = useRef(video.progress);
  const [watched, setWatched] = useState(video.watched);
  const [justFinished, setJustFinished] = useState(false);
  const [takeaway, setTakeaway] = useState(initialTakeaway);
  const [saved, setSaved] = useState(Boolean(initialTakeaway));
  const [error, setError] = useState('');
  const [pending, start] = useTransition();

  const send = useCallback(
    (data: Record<string, unknown>) =>
      post('/api/videos', { videoId: video.id, ...data }).catch((e: Error) => setError(e.message)),
    [video.id],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || !video.src) return;
    const onMeta = () => {
      if (video.progress > 0 && video.progress < 95 && el.duration)
        el.currentTime = (el.duration * video.progress) / 100;
    };
    const onTime = () => {
      if (!el.duration) return;
      const pct = Math.floor((el.currentTime / el.duration) * 100);
      if (pct >= sent.current + 10) {
        sent.current = pct;
        send({ action: 'progress', percent: pct });
      }
    };
    const onEnded = () => {
      sent.current = 100;
      send({ action: 'progress', percent: 100 });
      setWatched(true);
      setJustFinished(true);
    };
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('ended', onEnded);
    return () => {
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('ended', onEnded);
    };
  }, [video.src, video.progress, send]);

  const toggleWatched = () => {
    const value = !watched;
    setWatched(value);
    setJustFinished(false);
    start(async () => {
      await send({ action: 'watched', watched: value });
      router.refresh();
    });
  };

  const saveTakeaway = () =>
    start(async () => {
      setError('');
      try {
        await post('/api/videos', { videoId: video.id, action: 'takeaway', text: takeaway.trim() });
        setSaved(true);
      } catch (e) {
        setError((e as Error).message);
      }
    });

  return (
    <div className="video-player-page">
      <nav className="video-breadcrumb" aria-label="Breadcrumb">
        <Link href="/videos">
          <ChevronLeft size={16} /> Video Library
        </Link>
        <span aria-hidden="true">/</span>
        <span>{levelName}</span>
        <span aria-hidden="true">/</span>
        <span>Video {video.number}</span>
      </nav>

      <div className="video-player-layout">
        <div className="video-player-main">
          <div className="video-frame">
            {video.src ? (
              <video ref={ref} src={video.src} controls playsInline preload="metadata">
                <track kind="captions" />
              </video>
            ) : video.driveId ? (
              <iframe
                src={`https://drive.google.com/file/d/${video.driveId}/preview`}
                title={video.title}
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            ) : (
              <div className="video-placeholder">
                <span className="video-thumb-num" aria-hidden="true">
                  {pad(video.number)}
                </span>
                <Play size={32} aria-hidden="true" />
                <strong>Video coming soon</strong>
              </div>
            )}
          </div>

          <div className="video-title-row">
            <div>
              <span className="eyebrow">
                {levelName.toUpperCase()} · {levelTheme.toUpperCase()} · VIDEO {video.number} OF{' '}
                {total}
              </span>
              <h1>{video.title}</h1>
            </div>
            <div className="video-actions">
              <button
                type="button"
                className={`button ${watched ? 'dark' : 'secondary'}`}
                onClick={toggleWatched}
                disabled={pending}
                aria-pressed={watched}
              >
                <Check size={16} /> {watched ? 'Watched' : 'Mark as watched'}
              </button>
              {nextVideo && !nextVideo.locked && (
                <Link className="button primary" href={`/videos/${nextVideo.id}`}>
                  Next video <ChevronRight size={16} />
                </Link>
              )}
            </div>
          </div>

          {watched && (
            <div className="video-done" role="status">
              <Check size={18} strokeWidth={3} />
              <span>
                {justFinished ? 'Video complete. Nice work.' : 'You have watched this video.'}
                {nextVideo &&
                  (nextVideo.locked
                    ? ` The next video opens at ${nextVideo.tierName}.`
                    : ` Up next: ${nextVideo.title}.`)}
              </span>
            </div>
          )}

          <div className="video-takeaway">
            <label htmlFor="takeaway">Your one takeaway</label>
            <p>Write one thing you will try this week. It saves to your Savings Book.</p>
            <textarea
              id="takeaway"
              rows={3}
              maxLength={600}
              value={takeaway}
              placeholder="e.g. Put aside a small amount every payday"
              onChange={(e) => {
                setTakeaway(e.target.value);
                setSaved(false);
              }}
            />
            <div className="video-takeaway-actions">
              <button
                type="button"
                className={`button ${saved ? 'primary' : 'dark'}`}
                onClick={saveTakeaway}
                disabled={pending || (!takeaway.trim() && !initialTakeaway)}
              >
                {saved ? (
                  <>
                    <Check size={16} /> Saved to Savings Book
                  </>
                ) : (
                  'Save takeaway'
                )}
              </button>
              {error && (
                <span className="video-error" role="alert">
                  {error}
                </span>
              )}
            </div>
          </div>
        </div>

        <aside className="video-playlist" aria-label={`Videos in ${levelName}`}>
          <div className="video-playlist-head">
            <strong>
              {levelName} · {playlist.length} videos
            </strong>
            <span>
              {playlist.filter((v) => (v.id === video.id ? watched : v.watched)).length} of{' '}
              {playlist.length} watched
            </span>
          </div>
          <ol>
            {playlist.map((item) => {
              const current = item.id === video.id;
              const isWatched = current ? watched : item.watched;
              return (
                <li key={item.id}>
                  <Link
                    href={`/videos/${item.id}`}
                    aria-current={current ? 'true' : undefined}
                    className={current ? 'is-current' : ''}
                  >
                    <span className="video-mini-thumb">{pad(item.number)}</span>
                    <span>
                      <strong>{item.title}</strong>
                      <small className={isWatched && !current ? 'is-watched' : ''}>
                        {current ? 'Now playing' : isWatched ? 'Watched' : statusLabel(item)}
                      </small>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </aside>
      </div>
    </div>
  );
}
