import { addFile } from '@/lib/db';
import type { APIRoute } from 'astro';
import { z } from 'zod';

const formDataSchema = z.object({
  filename: z.string(),
  file: z.instanceof(Blob),
});

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const result = formDataSchema.safeParse(Object.fromEntries(form.entries()));

  if (!result.success) {
    return Response.json(
      {
        message: 'invalid request',
      },
      { status: 400 },
    );
  }

  const { filename, file: data } = result.data;

  await addFile({
    filename,
    data,
  }).catch((err) => console.log(err));

  return Response.json({});
};
