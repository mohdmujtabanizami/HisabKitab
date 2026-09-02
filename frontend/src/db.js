import Dexie from 'dexie';

export const db = new Dexie('HisabKitabOfflineDB');
db.version(1).stores({
  localData: 'id, data'
});