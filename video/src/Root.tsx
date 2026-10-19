import React from 'react';
import {Composition, Still} from 'remotion';
import {Main} from './Main';
import {Cover} from './Cover';
import {H, W} from './theme';
import type {VideoProps} from './types';

const demo: VideoProps = {
  fps: 30, durationInFrames: 300, title: 'Demo Tool', category: 'Video editing',
  host: 'demo.ai', handle: '@theaitoolfinds', keyword: 'TOOL', audio: '', screenshot: '',
  screenshotW: 1200, screenshotH: 3000, logo: null, avatar: null,
  scenes: [{type: 'title', from: 0, to: 300, props: {}}], words: [],
  cover: {line1: 'Demo', line2: 'Tool'},
};

export const Root: React.FC = () => (
  <>
    <Composition id="Main" component={Main as any} width={W} height={H} fps={30}
      durationInFrames={300} defaultProps={demo}
      calculateMetadata={({props}) => ({durationInFrames: (props as VideoProps).durationInFrames,
        fps: (props as VideoProps).fps})} />
    <Still id="Cover" component={Cover as any} width={W} height={H} defaultProps={demo} />
  </>
);
