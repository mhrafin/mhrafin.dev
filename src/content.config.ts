import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";

const experiences = defineCollection({
  loader: file("src/data/experiences.json"),
  schema: z.object({
    jobTitle: z.string(),
    organization: z.string(),
    location: z.string().optional(),
    locationType: z.string().optional(),
    employmentType: z.string().optional(),
    currentlyWorking: z.coerce.boolean().optional(),

    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),

    highlight: z.string().optional(),

    skills: z.array(z.string()).optional(),
  }),
});

export const collections = { experiences };
