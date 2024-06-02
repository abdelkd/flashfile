import { addFile } from '@/lib/db'
import { defineAction, z } from 'astro:actions'

export const server = {
  uploadFile: defineAction({
    accept: 'form',
    input: z.object({
      file: z.instanceof(Blob),
      filename: z.string().min(4),
    }),
    async handler(input, context) {
      await addFile({
        filename: input.filename,
        data: input.file,
      })
        .catch(err => console.log(err, 'pew'))
    },
  })
}
