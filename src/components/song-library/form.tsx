import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger
} from '@/components/ui/drawer.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form.tsx';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import storage from '@/storage/songs';
import { useToast } from '@/components/ui/use-toast';

interface Props {
  children?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SongLibraryForm({ children, open, onOpenChange }: Props) {
  const { toast } = useToast();

  const formSchema = z.object({
    name: z.string().min(2).max(100),
    bpm: z.coerce.number().min(20).max(400)
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      bpm: 120
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await storage.songs.add({
      name: values.name,
      bpm: values.bpm
    });

    onOpenChange(false);
    toast({
      title: 'Song created',
      description: `Your song "${values.name}" was created successfully`
    });
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>Create new song</DrawerHeader>

        <Form {...form}>
          <form className="p-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="My song ..." {...field} className="text-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bpm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beats per minute (bpm)</FormLabel>
                  <FormControl>
                    <Input placeholder="120" {...field} type="number" className="text-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DrawerFooter>
              <Button type="submit">Submit</Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
