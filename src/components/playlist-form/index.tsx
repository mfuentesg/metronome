import { FormEvent } from 'react';
import storage from '../../storage';
import './styles.css';

interface SongCollection extends HTMLFormControlsCollection {
  songName: HTMLInputElement;
  songBpm: HTMLInputElement;
}

export default function Index() {
  function onSubmitHandler(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const collection = evt.currentTarget.elements as SongCollection;
    storage.create({
      name: collection.songName.value,
      bpm: parseInt(collection.songBpm.value, 10)
    });
  }

  return (
    <form onSubmit={onSubmitHandler} className="playlist-form">
      <input type="text" name="songName" className="input" placeholder="Song name" required />
      <input type="number" name="songBpm" className="input bpm-input" placeholder="120" required />

      <button type="submit">Add Song</button>
    </form>
  );
}
