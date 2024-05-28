import { useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer.tsx';
import { Button } from '@/components/ui/button.tsx';
import { FileMusicIcon, ListMusicIcon } from 'lucide-react';
import SongLibraryForm from '@/components/song-library/form.tsx';
import { useLiveQuery } from 'dexie-react-hooks';
import storage from '@/storage/songs';

export default function SongLibrary() {
  const songs = useLiveQuery(async () => {
    return storage.songs.toArray();
  }, []);

  const [open, setOpen] = useState(false);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <ListMusicIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex justify-between">
            <DrawerTitle>Song Library</DrawerTitle>

            <SongLibraryForm open={open} onOpenChange={setOpen}>
              <Button className="space-x-1">
                <FileMusicIcon />
                <span>Create song</span>
              </Button>
            </SongLibraryForm>
          </div>
        </DrawerHeader>
        <div className="p-4">
          {songs?.length === 0 && <p>no songs created.</p>}
          {songs?.map((song) => {
            return <p key={song.id}>{song.name}</p>;
          })}
        </div>

        <DrawerFooter className="items-center">
          <DrawerClose asChild>
            <Button variant="outline" className="md:w-3/4">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
