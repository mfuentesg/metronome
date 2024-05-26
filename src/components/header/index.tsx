import ModeToggle from '@/components/dark-mode';
import Settings from '@/components/settings';

export default function Header() {
  return (
    <header className="flex justify-end p-4 space-x-2">
      <Settings />
      <ModeToggle />
    </header>
  );
}
