import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LockKeyhole } from 'lucide-react';
import { requireAccount } from '@/lib/auth';
import { tiers } from '@/lib/catalog';
import { videoCards, videoLevels, videoState } from '@/lib/videos';
import { VideoPlayer } from '@/components/video-library';
export async function generateMetadata({ params }: { params: Promise<{ videoId: string }> }) {
  const { videoId } = await params;
  const card = videoCards({
    activeCourse: null,
    approvedTier: 0,
    enrollments: {},
    offers: [],
    onboardingComplete: false,
  }).find((c) => c.id === videoId);
  return { title: card ? card.title : 'Video' };
}
export default async function VideoPage({ params }: { params: Promise<{ videoId: string }> }) {
  const { videoId } = await params;
  const user = await requireAccount();
  const cards = videoCards(user.state);
  const index = cards.findIndex((c) => c.id === videoId);
  if (index < 0) notFound();
  const video = cards[index];
  if (video.locked)
    return (
      <div className="video-locked-page">
        <LockKeyhole size={32} />
        <h1>This video opens at {video.tierName}</h1>
        <p>
          Video {video.number}, “{video.title}”, becomes available when your membership reaches{' '}
          {video.tierName}.
        </p>
        <Link className="button primary" href="/videos">
          Back to the Video Library
        </Link>
      </div>
    );
  const next = cards[index + 1];
  return (
    <VideoPlayer
      key={video.id}
      video={video}
      playlist={cards.filter((c) => c.tier === video.tier)}
      levelName={tiers[video.tier]}
      levelTheme={videoLevels[video.tier].theme}
      total={cards.length}
      nextVideo={
        next
          ? { id: next.id, title: next.title, locked: next.locked, tierName: next.tierName }
          : null
      }
      takeaway={videoState(user.state).takeaways[video.id] ?? ''}
    />
  );
}
