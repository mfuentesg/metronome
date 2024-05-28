import { useContext } from 'react';
import { AudioProviderContext } from '@/components/AudioProvider';

const useAudio = () => {
  const context = useContext(AudioProviderContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within a AudioProvider');
  }
  return context;
};

export default useAudio;