import { getImageById } from '@/lib/db'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ params }) => {
  const imageId = params.id
  if (!imageId) return Response.json({message: 'invalid id'})

  const image = await getImageById(imageId, null)
  console.log(image)
  if (!image) {
    return Response.json({message: 'not found'}, {
      status: 404
    })
  }

  const { data } = image

  return new Response(data)
}
