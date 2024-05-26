import { createContext, useState, useEffect, type ReactNode } from 'react';
import {
  PANNER_LEFT,
  PANNER_RIGHT,
  PANNER_STEREO,
  DEFAULT_INTERVAL_TIMEOUT,
  SOUND_FREQUENCY
} from '@/constants.ts';

export type Panner = typeof PANNER_LEFT | typeof PANNER_RIGHT | typeof PANNER_STEREO;

type AudioProviderState = {
  playing: boolean;
  panner: Panner;
  bpm: number;
  play: () => void;
  pause: () => void;
  setPanner: (pan: Panner) => void;
  setBpm: (bpm: number) => void;
};

const initialState: AudioProviderState = {
  playing: false,
  bpm: 120,
  panner: PANNER_STEREO,
  play: () => null,
  pause: () => null,
  setPanner: () => 0,
  setBpm: () => 120
};

type AudioProviderProps = {
  children: ReactNode;
};

export const AudioProviderContext = createContext<AudioProviderState>(initialState);
let interval = 0.0;
let nextBeatTime = 0.0;
const context = new AudioContext();
const stereoPanner = context.createStereoPanner();

export function AudioProvider({ children }: AudioProviderProps) {
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState<number>(120);
  const [timesPerBeat] = useState<number>(1);
  const [panner, setPanner] = useState<Panner>(PANNER_STEREO);

  const playBeat = (time: number) => {
    const osc = context.createOscillator();
    osc.connect(stereoPanner);
    osc.frequency.value = SOUND_FREQUENCY;
    stereoPanner.connect(context.destination);

    osc.start(time);
    osc.stop(time + 0.03);
  };

  const scheduleNextBeat = () => {
    const secondsPerBeat = 60.0 / bpm / timesPerBeat;
    nextBeatTime += secondsPerBeat;
  };

  useEffect(() => {
    if (!playing) {
      return;
    }

    interval = setInterval(() => {
      while (nextBeatTime < context.currentTime + 0.1) {
        playBeat(nextBeatTime);
        scheduleNextBeat();
      }
    }, DEFAULT_INTERVAL_TIMEOUT);

    return () => {
      clearInterval(interval);
    };
  }, [bpm, playing]);

  useEffect(() => {
    stereoPanner.pan.value = panner;
  }, [panner]);

  const value = {
    playing,
    bpm,
    panner,
    pause: () => setPlaying(false),
    play: () => setPlaying(true),
    setBpm: setBpm,
    setPanner
  };

  return <AudioProviderContext.Provider value={value}>{children}</AudioProviderContext.Provider>;
}
