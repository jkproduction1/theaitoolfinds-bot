import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, FONT, fontCss, W} from './theme';
import type {VideoProps} from './types';

// Reel cover: clean grid background, huge words, tilted website card in the middle.
// (If coverImage is given - e.g. an AI generated 3D object - it replaces the card.)
export const Cover: React.FC<VideoProps & {coverImage?: string | null}> = (v) => {
  const line = (t: string, bg: string, color: string, rot: number) => (
    <div style={{fontFamily: FONT, fontWeight: 900, fontSize: t.length > 11 ? 128 : 160,
      lineHeight: 1, letterSpacing: -6, color, background: bg, padding: '14px 40px 22px',
      borderRadius: 34, transform: `rotate(${rot}deg)`, textAlign: 'center', maxWidth: W - 60,
      boxShadow: bg !== 'transparent' ? '0 24px 60px rgba(0,0,0,0.18)' : 'none'}}>{t}</div>
  );
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <style>{fontCss}</style>
      <AbsoluteFill style={{background: '#F6F1E7'}} />
      <AbsoluteFill style={{background: [
        'radial-gradient(circle at 18% 22%, rgba(255,206,64,0.6) 0%, rgba(255,206,64,0) 45%)',
        'radial-gradient(circle at 85% 55%, rgba(255,150,110,0.42) 0%, rgba(255,150,110,0) 45%)',
        'radial-gradient(circle at 25% 88%, rgba(170,160,255,0.4) 0%, rgba(170,160,255,0) 45%)',
      ].join(',')}} />
      <div style={{position: 'absolute', top: 610, left: 90, width: 900, height: 780,
        borderRadius: 40, overflow: 'hidden', transform: 'rotate(3deg)', background: '#fff',
        border: `3px solid ${C.line}`, boxShadow: '0 40px 100px rgba(20,20,30,0.25)'}}>
        {v.coverImage ? (
          <Img src={staticFile(v.coverImage)} style={{width: '100%', height: '100%',
            objectFit: 'cover'}} />
        ) : v.screenshot ? (
          <Img src={staticFile(v.screenshot)} style={{width: '100%', objectFit: 'cover',
            objectPosition: 'top'}} />
        ) : null}
      </div>
      <div style={{position: 'absolute', top: 300, width: W, display: 'flex',
        justifyContent: 'center'}}>{line(v.cover.line1, C.yellow, C.ink, -3)}</div>
      <div style={{position: 'absolute', top: 1440, width: W, display: 'flex',
        justifyContent: 'center'}}>{line(v.cover.line2, C.ink, '#fff', 2)}</div>
    </AbsoluteFill>
  );
};
