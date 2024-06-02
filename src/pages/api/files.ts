import { getAllFiles } from '@/lib/db';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  let isError = false;

  const files = await getAllFiles().catch(() => {
    isError = true;
  });

  if (isError || !files) {
    return Response.json(null, {
      status: 501,
    });
  }

  return Response.json({
    files: files.rows.map((row) => ({
      filename: row.filename,
      id: row.imageId,
    })),
  });
};
