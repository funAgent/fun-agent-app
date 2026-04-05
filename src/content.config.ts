import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    tagline: z.object({ zh: z.string(), en: z.string() }),
    description: z.object({ zh: z.string(), en: z.string() }),
    category: z.enum(['tool', 'course', 'experiment']),
    status: z.enum(['released', 'beta', 'wip']),
    website: z.string().url().optional(),
    github: z.string().url(),
    download: z.string().url().optional(),
    logo: z.string(),
    hero: z.string().optional(),
    screenshots: z.array(z.string()).default([]),
    techStack: z.array(z.string()).default([]),
    highlights: z
      .object({ zh: z.array(z.string()), en: z.array(z.string()) })
      .optional(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

export const collections = { projects };
