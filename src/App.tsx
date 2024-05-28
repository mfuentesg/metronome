import Header from '@/components/header';
import BpmControl from '@/components/bpm-control';
import SongLibrary from '@/components/song-library';
import Settings from '@/components/settings';
import DarkModeToggle from '@/components/dark-mode';
import { Button } from '@/components/ui/button.tsx';
import { ListMusicIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import SongLibraryForm from '@/components/song-library/form.tsx';

export default function App() {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const toggleSongLibrary = useCallback(() => {
    setLibraryOpen((prevState) => !prevState);
  }, []);

  const toggleForm = useCallback(() => {
    setFormOpen((prevState) => !prevState);
  }, []);

  return (
    <main className="h-dvh">
      <Header>
        <Button onClick={toggleForm}>New song</Button>
        <Button variant="outline" onClick={toggleSongLibrary}>
          <ListMusicIcon />
        </Button>
        <Settings />
        <DarkModeToggle />
      </Header>
      <section className="flex justify-center items-center px-10 h-[calc(100%-68px)]">
        <BpmControl />
        <SongLibrary open={libraryOpen} onOpenChange={setLibraryOpen} />
        <SongLibraryForm open={formOpen} onOpenChange={setFormOpen} />
      </section>
      <p className="fixed bottom-0 p-4 text-center w-full">
        <span className="text-muted-foreground">Created by </span>
        <a
          className="text-black dark:text-white font-medium"
          href="https://github.com/mfuentesg"
          target="_blank"
        >
          @mfuentesg
        </a>
      </p>
    </main>
  );
}
