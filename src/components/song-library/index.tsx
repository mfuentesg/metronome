import { useLiveQuery } from 'dexie-react-hooks';
import storage, { Song } from '@/storage/songs';
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
import React, { useCallback, useState } from 'react';
import useAudio from '@/hooks/useAudio.ts';
import { Button } from '@/components/ui/button.tsx';
import { TrashIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog.tsx';
import { toast } from '@/components/ui/use-toast.ts';

interface Props {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (song: Song) => void;
}

export default function SongLibrary({ open, onOpenChange }: Props) {
  const songs = useLiveQuery(() => storage.songs.toArray());
  const { setBpm } = useAudio();
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const hasSongs = songs?.length !== 0;
  const [selectedSong, setSelectedSong] = useState<Song>();

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

  const onDeleteSongHandler = (song: Song) => (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation();
    setDialogVisible(true);
    setSelectedSong(song);
  };

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
                  <CommandItem
                    key={song.id}
                    value={song.id!.toString()}
                    onSelect={onSelectHandler}
                    className="flex justify-between"
                  >
                    <div>
                      <span className="mr-2">{song.name}</span>
                      <kbd className="pointer-events-none select-none rounded border bg-amber-200 p-1.5 text-[10px] font-bold text-black">
                        <span className="text-xs">{song.bpm}bpm</span>
                      </kbd>
                    </div>
                    <div>
                      <Button size="icon" variant="outline" onClick={onDeleteSongHandler(song)}>
                        <TrashIcon />
                      </Button>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          <AlertDialog open={dialogVisible} onOpenChange={setDialogVisible}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Do you really want to delete this song?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    storage.songs.delete(selectedSong?.id);
                    toast({
                      title: 'Song deleted',
                      description: `Your song "${selectedSong?.name}" was deleted successfully`
                    });
                    setSelectedSong(undefined);
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
