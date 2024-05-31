import { useContext } from 'react';
import { AudioContext } from '@/providers/audio';

const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within a AudioProvider');
  }
  return context;
};

export default useAudio;
