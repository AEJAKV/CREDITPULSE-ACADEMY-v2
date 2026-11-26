import type { MemberState, Tier, Video, VideoState } from './types';
import { tiers, canAccess } from './catalog';
import library from '@/content/videos.json';

export const videoSeriesTitle = library.title;
export const videoLevels = library.levels;
export const videos = library.videos as Video[];

export function getVideo(id: string) {
  return videos.find((video) => video.id === id);
}

/** The highest tier the member has been approved for, across their account and courses. */
export function videoTier(state: MemberState): Tier {
  const enrolled = Object.values(state.enrollments).map((e) => e.tier);
  return Math.max(state.approvedTier, ...enrolled) as Tier;
}

export function videoState(state: MemberState): VideoState {
  return state.videos ?? { watched: [], progress: {}, takeaways: {} };
}

export function canWatch(state: MemberState, video: Video) {
  return canAccess(videoTier(state), video.tier);
}

export type VideoCard = Video & {
  locked: boolean;
  watched: boolean;
  progress: number;
  tierName: string;
};

export function videoCards(state: MemberState): VideoCard[] {
  const tier = videoTier(state);
  const vs = videoState(state);
  return videos.map((video) => {
    const locked = !canAccess(tier, video.tier);
    const watched = !locked && vs.watched.includes(video.id);
    return {
      ...video,
      locked,
      watched,
      progress: locked ? 0 : watched ? 100 : (vs.progress[video.id] ?? 0),
      tierName: tiers[video.tier],
    };
  });
}

/** The video to resume, else the first unwatched open video. */
export function upNext(cards: VideoCard[]) {
  const open = cards.filter((c) => !c.locked && !c.watched);
  return open.find((c) => c.progress > 0) ?? open[0];
}
