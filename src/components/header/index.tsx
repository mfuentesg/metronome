import { ReactNode } from 'react';
import { ThemeProvider } from '@/providers/theme';

export default function Header({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider storageKey="ui-theme">
      <header className="flex justify-end p-4 space-x-2">{children}</header>
    </ThemeProvider>
  );
}
