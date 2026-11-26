import { requireAccount } from '@/lib/auth';
import { tiers } from '@/lib/catalog';
import { upNext, videoCards, videoLevels, videoTier } from '@/lib/videos';
import { VideoLibrary } from '@/components/video-library';
export const metadata = { title: 'Video Library' };
export default async function Videos() {
  const user = await requireAccount();
  const cards = videoCards(user.state);
  const tier = videoTier(user.state);
  return (
    <VideoLibrary
      cards={cards}
      levels={videoLevels.map((level, i) => ({ ...level, name: tiers[i] }))}
      approvedTier={tier}
      approvedName={tiers[tier]}
      nextId={upNext(cards)?.id ?? null}
    />
  );
}
