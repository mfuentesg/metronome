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
import { ListMusicIcon } from 'lucide-react';

export default function SongLibrary() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <ListMusicIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Song Library</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">Songs will appear here ...</div>
        <DrawerFooter className="items-center">
          <DrawerClose asChild>
            <Button variant="default" className="md:w-3/4">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
