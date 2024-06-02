import { createClient, type ResultSet } from '@libsql/client';
import { nanoid } from 'nanoid';

export const db = createClient({
  url: import.meta.env.TURSO_DATABASE_URL as string,
  authToken: import.meta.env.TURSO_AUTH_TOKEN as string,
});

export const addFile = async ({
  filename,
  data,
  password = null,
}: {
  filename: string;
  data: Blob;
  password?: string | null;
}) => {
  return new Promise(async (res, rej) => {
    const buf = await data.arrayBuffer();

    await db
      .execute({
        sql: 'INSERT INTO uploads ( imageId, filename, password, data ) VALUES (?,?,?,?);',
        args: [nanoid(6), filename, password, Buffer.from(buf)],
      })
      .catch((err) => rej(err));
    res('row inserted successfully');
  });
};

export const getAllFiles = async (): Promise<ResultSet> => {
  return await db.execute({
    sql: 'SELECT filename, imageId, password, data FROM uploads;',
    args: [],
  });
};

type ImageRow = { imageId: string; filename: string; data: Buffer };

type ExtendedResultSet<T> = ResultSet & {
  rows: T[];
};

export const getImageById = async (
  id: string,
  password: string | null,
): Promise<ExtendedResultSet<ImageRow> | undefined> => {
  try {
    let sql: string;
    let args: (string | null)[];

    if (password) {
      sql = `SELECT imageId, filename, data FROM uploads WHERE imageId = ? AND password = ?;`;
      args = [id, password];
    } else {
      sql = `SELECT imageId, filename, data FROM uploads WHERE imageId = ? AND password IS NULL;`;
      args = [id];
    }

    return (await db.execute({
      sql,
      args,
    })) as ExtendedResultSet<ImageRow>;
  } catch (error) {
    return;
  }
};
