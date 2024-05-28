import Header from '@/components/header';
import BpmControl from '@/components/bpm-control';

export default function App() {
  return (
    <main className="h-dvh">
      <Header />
      <section className="flex justify-center items-center px-10 h-[calc(100%-68px)]">
        <BpmControl />
      </section>
    </main>
  );
}
