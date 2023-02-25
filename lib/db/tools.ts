import clientPromise from './mongodb';
import { PersonObject } from '../../data';

export type Tools = 'people';

export async function collection(collectionName: Tools) {
  const dbClient = await clientPromise;
  const db = dbClient.db(process.env.DBNAME);

  return db.collection(collectionName);
}

export function createPersonSet(update: Partial<typeof PersonObject>) {
  const failed: Array<keyof typeof PersonObject> = [];
  const set = {
    $set: Object.fromEntries((Object.keys(update) as Array<keyof typeof PersonObject>)
      .reduce<Array<[string, any]>>((fields, key) => {
      if (Object.keys(PersonObject).includes(key)) {
        fields.push([key, update[key]]);
      } else {
        failed.push(key);
      }

      return fields;
    }, [])),
  };

  return {
    failed,
    set,
  };
}
