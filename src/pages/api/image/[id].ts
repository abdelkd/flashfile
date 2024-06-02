import { getImageById } from '@/lib/db';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params }) => {
  const imageId = params.id;
  if (!imageId) return Response.json({ message: 'invalid id' });

  const result = await getImageById(imageId, null);

  if (!result || result.rows.length === 0) {
    return Response.json(
      { message: 'not found' },
      {
        status: 404,
      },
    );
  }

  const image = result.rows[0];

  return new Response(image.data);
};
