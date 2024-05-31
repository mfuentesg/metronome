import { createContext, useState, useEffect, type ReactNode } from 'react';
import {
  PANNER_LEFT,
  PANNER_RIGHT,
  PANNER_MONO,
  DEFAULT_INTERVAL_TIMEOUT,
  SOUND_FREQUENCY
} from '@/constants.ts';
import * as timers from 'worker-timers';

export type Panner = typeof PANNER_LEFT | typeof PANNER_RIGHT | typeof PANNER_MONO;

type State = {
  playing: boolean;
  panner: Panner;
  bpm: number;
  gain: number;
  play: () => void;
  pause: () => void;
  setPanner: (pan: Panner) => void;
  setBpm: (bpm: number) => void;
  setGain: (gain: number) => void;
};

const initialState: State = {
  playing: false,
  bpm: 120,
  panner: PANNER_MONO,
  gain: 1.0,
  play: () => null,
  pause: () => null,
  setPanner: () => 0,
  setBpm: () => 120,
  setGain: () => 1.0
};

type Props = {
  children: ReactNode;
};

export const AudioContext = createContext<State>(initialState);
let interval = 0.0;
let nextBeatTime = 0.0;
let context: AudioContext;
let stereoPanner: StereoPannerNode;

export function AudioProvider({ children }: Props) {
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState<number>(120);
  const [timesPerBeat] = useState<number>(1);
  const [gain, setGain] = useState<number>(1);
  const [panner, setPanner] = useState<Panner>(PANNER_MONO);

  const playBeat = (time: number) => {
    const gainNode = new GainNode(context, { gain });
    const osc = new OscillatorNode(context, {
      type: 'sine',
      frequency: SOUND_FREQUENCY
    });

    osc.connect(gainNode).connect(stereoPanner).connect(context.destination);

    osc.start(time);
    osc.stop(time + 0.05);
  };

  const scheduleNextBeat = () => {
    const secondsPerBeat = 60.0 / bpm / timesPerBeat;
    nextBeatTime += secondsPerBeat;
  };

  useEffect(() => {
    if (!playing) {
      return;
    }

    interval = timers.setInterval(() => {
      while (nextBeatTime < context.currentTime + 0.1) {
        playBeat(nextBeatTime);
        scheduleNextBeat();
      }
    }, DEFAULT_INTERVAL_TIMEOUT);

    return () => {
      timers.clearInterval(interval);
    };
  }, [bpm, playing, gain]);

  useEffect(() => {
    if (!stereoPanner) return;
    stereoPanner.pan.value = panner;
  }, [panner]);

  const value = {
    playing,
    bpm,
    panner,
    gain,
    pause: () => setPlaying(false),
    play: () => {
      if (!context) {
        context = new window.AudioContext();
        stereoPanner = context.createStereoPanner();
      }
      setPlaying(true);
    },
    setBpm,
    setPanner,
    setGain
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}
