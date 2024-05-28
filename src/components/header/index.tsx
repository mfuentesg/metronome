import { ReactNode } from 'react';

export default function Header({ children }: { children: ReactNode }) {
  return <header className="flex justify-end p-4 space-x-2">{children}</header>;
}
