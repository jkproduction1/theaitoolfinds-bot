import React from 'react';
import {Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {useAudioData, visualizeAudio} from '@remotion/media-utils';
import type {Scene, VideoProps} from './types';

// "Scrappy" the raccoon: paper-cutout sticker that pops into each scene in a different
// spot, floats, reacts with a pose that fits the scene, and bounces to the voiceover.
type Pose = 'idle' | 'point' | 'thumb' | 'shock' | 'wave' | 'gadget';
type Spot = 'bl' | 'br' | 'peekL' | 'peekR';

const POSE_FOR: Record<string, Pose> = {
  browser: 'idle', icons: 'point', checklist: 'thumb', chat: 'gadget', flow: 'point',
  big: 'shock', compare: 'point', media: 'thumb', cta: 'wave',
};

function plan(scene: Scene, i: number): {pose: Pose; spot: Spot} | null {
  if (scene.type === 'title' || scene.type === 'avatar') return null; // the hook stays clean
  const pose = POSE_FOR[scene.type] ?? 'idle';
  if (pose === 'idle') return {pose, spot: i % 2 ? 'peekL' : 'peekR'};
  // pointing poses face right -> put them on the left so they point at the content
  if (pose === 'point') return {pose, spot: 'bl'};
  return {pose, spot: i % 2 ? 'br' : 'bl'};
}

const Raccoon: React.FC<{pose: Pose; spot: Spot; dur: number; v: VideoProps; from: number}> = ({
  pose, spot, dur, v, from,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const audio = useAudioData(staticFile(v.audio || 'sfx/pop.wav'));
  let amp = 0;
  if (audio) {
    const vis = visualizeAudio({fps, frame: from + f, audioData: audio, numberOfSamples: 16});
    amp = Math.min(1, (vis.slice(0, 6).reduce((a, b) => a + b, 0) / 6) * 3);
  }
  const enter = spring({frame: f, fps, config: {damping: 11, stiffness: 160}});
  const exit = interpolate(f, [dur - 6, dur], [0, 1], {extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'});
  const float = Math.sin((from + f) / 13) * 8;
  const tilt = Math.sin((from + f) / 21) * 2.2;
  const talk = amp * 14;           // little hops while the voice is loud
  const squash = 1 + amp * 0.035;

  const peek = spot === 'peekL' || spot === 'peekR';
  const h = peek ? 680 : 580;
  const left = spot === 'bl' || spot === 'peekL';
  const flip = left ? 1 : -1;  // mirror on the right side so the gesture faces the content
  const baseX = left ? (peek ? -60 : -30) : undefined;
  const baseR = !left ? (peek ? -60 : -30) : undefined;
  const bottom = peek ? -330 : -90;   // feet below the frame edge; peeking: only the head shows
  const y = (1 - enter) * 520 + exit * 600 - float - talk;

  return (
    <div style={{position: 'absolute', bottom, left: baseX, right: baseR, height: h,
      transform: `translateY(${y}px) rotate(${(left ? 1 : -1) * (tilt + (peek ? 8 : 0))}deg) ` +
        `scale(${flip * (2 - squash)}, ${squash})`,
      transformOrigin: '50% 100%', filter: 'drop-shadow(0 18px 24px rgba(20,20,40,0.25))'}}>
      <Img src={staticFile(`mascot/${pose}.png`)} style={{height: h}} />
    </div>
  );
};

export const Mascot: React.FC<{v: VideoProps}> = ({v}) => (
  <>
    {v.scenes.map((s, i) => {
      const p = plan(s, i);
      if (!p) return null;
      const dur = Math.max(10, s.to - s.from);
      return (
        <Sequence key={'m' + i} from={s.from} durationInFrames={dur} layout="none">
          <Raccoon pose={p.pose} spot={p.spot} dur={dur} v={v} from={s.from} />
        </Sequence>
      );
    })}
  </>
);
