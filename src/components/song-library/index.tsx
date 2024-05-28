import { useLiveQuery } from 'dexie-react-hooks';
import storage from '@/storage/songs';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command.tsx';
import { useCallback } from 'react';
import useAudio from '@/hooks/useAudio.ts';

interface Props {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function SongLibrary({ open, onOpenChange }: Props) {
  const songs = useLiveQuery(() => storage.songs.toArray());

  const { setBpm } = useAudio();

  const hasSongs = songs?.length !== 0;
  const onSelectHandler = useCallback(
    (value: string) => {
      if (!onOpenChange) return;
      onOpenChange(false);

      const selectedSong = songs?.find((song) => song.id?.toString() === value);
      if (selectedSong) {
        setBpm(selectedSong.bpm);
      }
    },
    [onOpenChange, setBpm, songs]
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command
        filter={(value, search) => {
          const song = songs?.find((song) => song.id?.toString() === value);
          const matched = song?.name.toLowerCase().includes(search.toLowerCase());
          return matched ? 1 : 0;
        }}
      >
        <CommandInput placeholder="Type a command or search..." className="text-md" />
        <CommandList>
          {hasSongs && <CommandEmpty>No results found.</CommandEmpty>}

          {!hasSongs && (
            <CommandGroup>
              <p className="p-2 text-center">No songs created yet</p>
            </CommandGroup>
          )}
          {hasSongs && (
            <CommandGroup heading="Songs">
              <CommandSeparator />
              {songs?.map((song) => {
                return (
                  <CommandItem key={song.id} value={song.id?.toString()} onSelect={onSelectHandler}>
                    <span className="mr-2">{song.name}</span>
                    <kbd className="pointer-events-none select-none rounded border bg-amber-200 px-1.5 text-[10px] font-bold text-black">
                      <span className="text-xs">{song.bpm}bpm</span>
                    </kbd>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
