import { Button } from '@/components/ui/button.tsx';
import { MinusIcon, PauseIcon, PlayIcon, PlusIcon } from 'lucide-react';
import { Slider } from '@/components/ui/slider.tsx';
import { useCallback } from 'react';
import { MAX_BPM, MIN_BPM } from '@/constants.ts';
import useAudio from '@/hooks/useAudio.ts';

export default function BpmControl() {
  const { playing, play, pause, setBpm, bpm } = useAudio();
  const onBpmChange = useCallback(
    (value: number[]) => {
      setBpm(value[0]);
    },
    [setBpm]
  );

  const increaseBpm = useCallback(() => {
    if (bpm + 1 > MAX_BPM) {
      return;
    }
    setBpm(bpm + 1);
  }, [bpm, setBpm]);

  const decreaseBpm = useCallback(() => {
    if (bpm - 1 < MIN_BPM) {
      return;
    }
    setBpm(bpm - 1);
  }, [bpm, setBpm]);

  return (
    <div className="flex flex-col w-full items-center space-y-10">
      <div className="flex items-center space-x-3">
        <Button variant="ghost" onClick={decreaseBpm}>
          <MinusIcon />
        </Button>
        <div className="font-thin text-7xl min-w-[166px] text-center">
          {bpm}
          <small className="text-[16px] font-bold"> bpm</small>
        </div>
        <Button variant="ghost" onClick={increaseBpm}>
          <PlusIcon />
        </Button>
      </div>
      <div className="w-full max-w-[400px]">
        <Slider max={400} min={20} step={1} onValueChange={onBpmChange} value={[bpm]} />
      </div>
      <Button
        className="h-[56px] rounded-full"
        variant={playing ? 'default' : 'outline'}
        onClick={playing ? pause : play}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </Button>
    </div>
  );
}
