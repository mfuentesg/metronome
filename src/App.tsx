import './App.css'
import {useEffect, useState} from "react";

const MAX_BPM = 400 as const
const MIN_BPM = 20 as const
const SOUND_FREQUENCY = 800 as const;

const PlayIcon = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
}

const PauseIcon = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
}


let interval = 0.0;
let nextNoteTime = 0.0;
const context = new AudioContext()
const stereoPanner = context.createStereoPanner()

function App() {
    const [bpm, setBpm] = useState<number>(120)
    const [realBpm, setRealBpm] = useState<number>(120)
    const [playing, setPlaying] = useState<boolean>(false)
    const [timesPerBeat] = useState<number>(1)

    useEffect(() => {
        if (!playing) {
            return
        }

        interval = setInterval(() => {
            while (nextNoteTime < context.currentTime + 0.1) {
                scheduleNote(nextNoteTime);
                nextNote()
            }
        }, 25)

        return () => {
            clearInterval(interval)
        }
    }, [realBpm, playing])

    const increase = () => {
        if (bpm + 1 > MAX_BPM) {
            return
        }
        setBpm(bpm + 1)
    }
    const decrease = () => {
        if (bpm - 1 < MIN_BPM) {
            return
        }
        setBpm(bpm - 1)
    }

    const nextNote = () => {
        const secondsPerBeat = (60.0 / realBpm) / timesPerBeat;
        nextNoteTime += secondsPerBeat;
    }

    const scheduleNote = (time: number) => {
        const osc = context.createOscillator()
        osc.connect(stereoPanner)
        osc.frequency.value = SOUND_FREQUENCY
        stereoPanner.connect(context.destination)

        osc.start(time);
        osc.stop(time + 0.03);
    }

    const onToggle = () => {
        if (playing) {
            clearInterval(interval)
            setPlaying(false)
            return
        }

        setPlaying(true)
    }

    function setPannerToLeft(){ stereoPanner.pan.value = -1 }
    function setPannerToRight(){ stereoPanner.pan.value = 1 }
    function setPannerToStereo(){ stereoPanner.pan.value = 0 }

    return (
        <div className="container">
            <div className="precision-controls">
                <button onClick={decrease}>-</button>
                <div className="bpm">
                    <p className="bpm-value">{bpm}</p>
                    <p>bpm</p>
                </div>
                <button onClick={increase}>+</button>
            </div>

            <input type="range" min={MIN_BPM} max={MAX_BPM} value={bpm} className="bpm-slider"
                   onMouseUp={(evt) => {
                       setRealBpm(parseInt(evt.currentTarget.value, 10))
                   }} onChange={(evt) => setBpm(parseInt(evt.currentTarget.value, 10))}/>

            <div className="controls">
                <button id="play" onClick={() => {
                    setPlaying(!playing)
                    onToggle()
                }}>{playing ? <PauseIcon/> : <PlayIcon/>}</button>
            </div>
            <div>
                <button onClick={setPannerToLeft}>Left Gain</button>
                <button onClick={setPannerToStereo}>Stereo</button>
                <button onClick={setPannerToRight}>Right Gain</button>
            </div>
        </div>
    )
}

export default App
