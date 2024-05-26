export type Song = {
  id?: string;
  name: string;
  bpm: number;
};

const SONGS_KEY = 'metronome_songs' as const;

type Songs = {
  [key: string]: Song;
};

function generateId(length: number): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export default {
  _getAll(): Songs {
    const item = localStorage.getItem(SONGS_KEY);
    if (!item) {
      return {};
    }
    return JSON.parse(item);
  },
  _set(value: Songs) {
    localStorage.setItem(SONGS_KEY, JSON.stringify(value));
  },
  create(value: Song) {
    const song = {
      id: generateId(10),
      ...value
    };
    this._set({
      ...this._getAll(),
      [song.id]: song
    });
  },
  update(key: string, value: Song) {
    const songs = this._getAll();
    if (!songs[key]) {
      throw new Error(`Could not update song with key "${key}"`);
    }
    this._set({
      ...this._getAll(),
      [key]: value
    });
  },
  delete(key: string) {
    const filteredSongs = Object.entries(this._getAll()).filter(([songId]) => songId !== key);
    const newSongs = Object.fromEntries(filteredSongs);
    this._set(newSongs);
    return newSongs;
  },
  get(): Songs {
    return this._getAll();
  }
};
