import React, { useContext, useEffect, useState } from 'react';
import ButtonToggle from './components/toggle.tsx';
import { PauseIcon, PlayIcon } from './components/icons.tsx';
import { AudioContext as ReactAudioContext } from './audioContext'

import './App.css';
import {
  DEFAULT_INTERVAL_TIMEOUT,
  MAX_BPM,
  MIN_BPM,
  PANNER_LEFT,
  PANNER_RIGHT,
  PANNER_STEREO,
  SOUND_FREQUENCY
} from './constants.ts';

let interval = 0.0;
let nextNoteTime = 0.0;

function App() {
  const { context, stereoPanner } = useContext(ReactAudioContext);
  const [bpm, setBpm] = useState<number>(120);
  const [playing, setPlaying] = useState<boolean>(false);
  const [timesPerBeat] = useState<number>(1);
  const [panner, setPanner] = useState<number>(0);

  useEffect(() => {
    if (!playing) {
      return;
    }

    interval = setInterval(() => {
      while (nextNoteTime < context.currentTime + 0.1) {
        playBeat(nextNoteTime);
        nextNote();
      }
    }, DEFAULT_INTERVAL_TIMEOUT);

    return () => {
      clearInterval(interval);
    };
  }, [bpm, playing]);

  useEffect(() => {
    stereoPanner.pan.value = panner;
  }, [panner]);

  const increaseTime = () => {
    if (bpm + 1 > MAX_BPM) {
      return;
    }
    setBpm(bpm + 1);
  };

  const decreaseTime = () => {
    if (bpm - 1 < MIN_BPM) {
      return;
    }
    setBpm(bpm - 1);
  };

  const nextNote = () => {
    const secondsPerBeat = (60.0 / bpm) / timesPerBeat;
    nextNoteTime += secondsPerBeat;
  };

  const playBeat = (time: number) => {
    const osc = context.createOscillator();
    osc.connect(stereoPanner);
    osc.frequency.value = SOUND_FREQUENCY;
    stereoPanner.connect(context.destination);

    osc.start(time);
    osc.stop(time + 0.03);
  };

  const onTogglePlayingState = () => {
    if (playing) {
      clearInterval(interval);
    }
    setPlaying(!playing);
  };

  function setPannerValue(value: number) {
    return () => setPanner(value);
  }

  function onSliderEvent(evt: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>) {
    setBpm(parseInt(evt.currentTarget.value, 10));
  }

  return (
    <div className="container">
      <div className="precision-controls">
        <button onClick={decreaseTime}>-</button>
        <div className="bpm">
          <p className="bpm-value">{bpm}</p>
          <p>bpm</p>
        </div>
        <button onClick={increaseTime}>+</button>
      </div>

      <input
        type="range"
        min={MIN_BPM}
        max={MAX_BPM}
        value={bpm}
        className="bpm-slider"
        onMouseUp={onSliderEvent}
        onTouchEnd={onSliderEvent}
        onChange={onSliderEvent}
      />

      <div className="controls">
        <button id="play" onClick={onTogglePlayingState}>
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      <div className="gain-controls">
        <ButtonToggle toggled={panner === PANNER_LEFT} onClick={setPannerValue(PANNER_LEFT)}>Left Gain</ButtonToggle>
        <ButtonToggle toggled={panner === PANNER_STEREO} onClick={setPannerValue(PANNER_STEREO)}>Stereo</ButtonToggle>
        <ButtonToggle toggled={panner === PANNER_RIGHT} onClick={setPannerValue(PANNER_RIGHT)}>Right Gain</ButtonToggle>
      </div>
    </div>
  );
}

export default App;
