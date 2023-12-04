import { Document } from 'mongodb';
import clientPromise from './mongodb';

export type Collection = 'people' | 'profiles' | 'calendars' | 'forums' | 'threads' | 'posts' | 'documents' | 'families';

export async function collection<T extends Document>(collectionName: Collection) {
  const dbClient = await clientPromise;
  const db = dbClient.db(process.env.DBNAME);

  return db.collection<T>(collectionName);
}

export function createSet<T extends Record<string, any>>(update: Partial<T>, baseObject: T) {
  const failed: Array<keyof T> = [];
  const set = {
    $set: Object.fromEntries((Object.keys(update) as Array<keyof T & string>)
      .reduce<Array<[string, any]>>((fields, key) => {
      if (Object.keys(baseObject).includes(key)) {
        if (typeof update[key] === 'object') {
          Object
            .entries(update[key] ?? {})
            .forEach(([objectKey, objectValue]) => fields.push([`${key}.${objectKey}`, objectValue]));

          return fields;
        }

        fields.push([key, update[key]]);

        return fields;
      }

      failed.push(key);

      return fields;
    }, [])),
  };

  return {
    failed,
    set,
  };
}
