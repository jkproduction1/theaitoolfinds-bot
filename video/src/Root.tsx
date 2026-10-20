import React from 'react';
import {Composition, Still} from 'remotion';
import {Main} from './Main';
import {Cover} from './Cover';
import {ConceptA, ConceptB, ConceptC} from './Concepts';
import {H, W} from './theme';
import type {VideoProps} from './types';

const demo: VideoProps = {
  fps: 30, durationInFrames: 300, title: 'Demo Tool', category: 'Video editing',
  host: 'demo.ai', handle: '@theaitoolfinds', keyword: 'TOOL', audio: '', screenshot: '',
  screenshotW: 1200, screenshotH: 3000, logo: null, avatar: null, media: null,
  scenes: [{type: 'title', from: 0, to: 300, props: {}}], words: [],
  cover: {line1: 'Demo', line2: 'Tool'},
};

export const Root: React.FC = () => (
  <>
    <Composition id="Main" component={Main as any} width={W} height={H} fps={30}
      durationInFrames={300} defaultProps={demo}
      calculateMetadata={({props}) => ({durationInFrames: (props as VideoProps).durationInFrames,
        fps: (props as VideoProps).fps})} />
    <Composition id="ConceptA" component={ConceptA} width={W} height={H} fps={30} durationInFrames={180} />
    <Composition id="ConceptB" component={ConceptB} width={W} height={H} fps={30} durationInFrames={180} />
    <Composition id="ConceptC" component={ConceptC} width={W} height={H} fps={30} durationInFrames={180} />
    <Still id="Cover" component={Cover as any} width={W} height={H} defaultProps={demo} />
  </>
);
