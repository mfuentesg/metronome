import Dexie, { Table } from 'dexie';

export interface Song {
  id?: string;
  name: string;
  bpm: number;
}

class Songs extends Dexie {
  songs!: Table<Song>;

  public constructor() {
    super('metronome');
    this.version(1).stores({
      songs: '++id, name, bpm'
    });
  }
}

const db = new Songs();
export default db;
