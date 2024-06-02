import { getAllFiles } from '@/lib/db'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  let isError = false

  const files = await getAllFiles()
    .catch((err) => {
      console.log(err)
      isError = true
    })

  if (isError) {
    return Response.json(null, {
      status: 501
    })
  }

  return Response.json({
    files
  })
}
