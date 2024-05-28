import { useState } from 'react';
import storage, { Song } from '../../storage';
import PlaylistForm from '../playlist-form';
import './styles.css';

export default function Playlist({ onChange }: { onChange: (song: Song) => void }) {
  const [songs] = useState(storage.get());

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const updateSongs = async () => {
  //   console.log('here?');
  //   setSongs(storage.get());
  // };

  // useEffect(() => {
  //   window.addEventListener('storage', updateSongs);
  //   return () => window.removeEventListener('storage', updateSongs);
  // }, []);

  return (
    <div className="songs">
      <PlaylistForm />

      <label htmlFor="songs" className="songs-label">
        Songs
      </label>
      <select
        className="playlist-select"
        id="songs"
        onChange={(evt) => {
          onChange(songs[evt.currentTarget.value]);
        }}
      >
        {Object.entries(songs).map(([songId, song]) => {
          return (
            <option key={songId} value={songId}>
              {song.name} - {song.bpm}bpm
            </option>
          );
        })}
      </select>
    </div>
  );
}
