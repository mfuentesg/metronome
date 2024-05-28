import { MoonIcon, SunIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useCallback } from 'react';
import useTheme from '@/hooks/useTheme';

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const toggleTheme = useCallback(() => {
    setTheme(isDarkMode ? 'light' : 'dark');
  }, [isDarkMode, setTheme]);

  return (
    <Button variant="ghost" onClick={toggleTheme}>
      {isDarkMode ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
