import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SettingsIcon } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx';
import { Label } from '@/components/ui/label';
import useAudio from '@/hooks/useAudio.ts';
import { Panner } from '@/components/audio-provider';
import { PANNER_LEFT, PANNER_RIGHT, PANNER_STEREO } from '@/constants.ts';
import { Slider } from '@/components/ui/slider.tsx';

export default function Settings() {
  const { setPanner, panner, gain, setGain } = useAudio();
  const roundedGain = Math.round(gain * 100);

  const setPannerHandler = (panner: Panner) => () => {
    setPanner(panner);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <SettingsIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 space-y-3" side="bottom">
        <div className="flex flex-col space-y-3">
          <Label>Panning</Label>
          <ToggleGroup type="single" value={panner.toString()}>
            <ToggleGroupItem value={PANNER_LEFT.toString()} onClick={setPannerHandler(PANNER_LEFT)}>
              Left Speaker
            </ToggleGroupItem>
            <ToggleGroupItem
              value={PANNER_STEREO.toString()}
              onClick={setPannerHandler(PANNER_STEREO)}
            >
              Stereo
            </ToggleGroupItem>
            <ToggleGroupItem
              value={PANNER_RIGHT.toString()}
              onClick={setPannerHandler(PANNER_RIGHT)}
            >
              Right Speaker
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="flex flex-col space-y-3">
          <Label>Volume</Label>
          <div className="flex space-x-2">
            <Slider
              min={10}
              max={100}
              value={[roundedGain]}
              onValueChange={([newGain]) => {
                setGain(newGain / 100);
              }}
            />
            <span className="font-bold">{roundedGain}</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
