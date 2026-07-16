import { defineCollection, z } from 'astro:content';

const kb = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    subcategory: z.string().optional(),
    order: z.number(),
    updated: z.coerce.date(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { kb };
