import { createContext } from 'react';

interface Props {
  context: AudioContext;
  stereoPanner: StereoPannerNode
}

// @ts-ignore
export const AudioContext = createContext<Props>({})
