import { z } from 'zod'

export const StudySchema = z.object({
  key: z.string(),
  title: z.string(),
  url: z.string(),
})

export type StudyTag = ['crossing-blood-brain-barrier']

export type Study = z.infer<typeof StudySchema>

export const studies: Study[] = [
  {
    key: 'mycobiome-gut-brain-axis',
    title: 'The Mycobiome: A Neglected Component in the Microbiota-Gut-Brain Axis',
    url: 'https://www.mdpi.com/2076-2607/6/1/22',
  },
]
