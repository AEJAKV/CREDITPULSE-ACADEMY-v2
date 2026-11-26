import { currentAccount } from '@/lib/auth';
import { body, checkOrigin, errorResponse, InputError, stringField } from '@/lib/http';
import { addAudit, mutateAccount } from '@/lib/store';
import { canWatch, getVideo, videoState } from '@/lib/videos';

export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const user = await currentAccount();
    if (!user) throw new InputError('Please sign in again.', 401);
    const data = await body(request);
    const video = getVideo(stringField(data.videoId, 'video'));
    if (!video) throw new InputError('This video could not be found.', 404);
    await mutateAccount(user.id, async (account) => {
      const state = account.state;
      if (!canWatch(state, video))
        throw new InputError('This video opens with a higher membership level.', 403);
      const vs = (state.videos = videoState(state));
      if (data.action === 'progress') {
        const percent = Number(data.percent);
        if (!Number.isFinite(percent) || percent < 0 || percent > 100)
          throw new InputError('Invalid progress.');
        vs.progress[video.id] = Math.max(vs.progress[video.id] ?? 0, Math.round(percent));
        if (percent >= 95 && !vs.watched.includes(video.id)) vs.watched.push(video.id);
        return;
      }
      if (data.action === 'watched') {
        vs.watched = vs.watched.filter((id) => id !== video.id);
        if (data.watched === true) vs.watched.push(video.id);
        return;
      }
      if (data.action === 'takeaway') {
        if (data.text === '') {
          delete vs.takeaways[video.id];
          return;
        }
        vs.takeaways[video.id] = stringField(data.text, 'takeaway', 600);
        return;
      }
      throw new InputError('Unknown action.');
    });
    if (data.action !== 'progress')
      await addAudit(user.id, `video-${String(data.action)}`, video.id);
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
