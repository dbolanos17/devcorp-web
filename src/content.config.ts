import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['Financiero', 'Tributario', 'Laboral', 'Contable', 'Trámites']),
    date: z.coerce.date(),
    icon: z.string().default('📰'),
    featured: z.boolean().default(false),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: z.object({
    name: z.string(),
    // Cargo o empresa. Opcional: las reseñas reales no siempre lo incluyen y
    // no se debe inventar.
    role: z.string().optional(),
    stars: z.number().min(1).max(5).default(5),
    date: z.coerce.date().optional(),
    order: z.number().default(0),
  }),
});

const clients = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/clients' }),
  schema: z.object({
    name: z.string(),
    logo: z.string(),
    url: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { blog, testimonials, clients };
