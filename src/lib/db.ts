import sqlite3 from 'sqlite3'
import { nanoid } from 'nanoid'

export const db = new sqlite3.Database('./filestore.db')

export const addFile = async ({ filename, data, password = null }: { filename: string, data: Blob, password?: string | null }) => {
  return new Promise(async (res, rej) => {
    const buf = await data.arrayBuffer()

    db.run(`INSERT INTO uploads ( imageId, filename, password, data ) VALUES ( ?, ?, ?, ?)`,
           [nanoid(6), filename, password, Buffer.from(buf)], (err) => {
      if (err) {
        rej(err)
      } else {
        res('row inserted successfully')
      }
    })
  })
}

export const getAllFiles = async () => {
  return new Promise((res, rej) => {
    let result: unknown[] = []
    db.each(`
      SELECT filename, imageId, password, data FROM uploads;
    `, [], (err, row) => {
      if (err) {
        rej(err)
      }

      result = [...result, row]
    }, () => {
      res(result)
    })
  })
}

type ImageRow = {imageId: string, filename: string, data: Buffer}

export const getImageById = async (id: string, password: string | null): Promise<ImageRow> => {
  return new Promise((res, rej) => {
    try {
      let sql: string;
      let params: (string | null)[];

      if (password) {
        sql = `SELECT imageId, filename, data FROM uploads WHERE imageId = ? AND password = ?;`
        params = [id, password]
      } else {
        sql = `SELECT imageId, filename, data FROM uploads WHERE imageId = ? AND password IS NULL;`
        params = [id]
      }

      db.get(sql, params, (err, row: ImageRow) => {
        if (err) {
          rej(err)
        }

        res(row)
      })
    } catch (error) {
      rej(error)
    }
  })
}
