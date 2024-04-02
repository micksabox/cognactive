import fs from 'fs/promises'
import path from 'path'
import { z } from 'zod'

import { StudySchema, studies } from 'src/data/studies'

const MemeSpec = z.object({
  name: z.string(),
  description: z.string(),
  relevance: z.string(),
  studyKeys: z.array(z.string()),
})

const MemeStudies = z.array(StudySchema)

const MemeInfo = MemeSpec.extend({
  studies: MemeStudies,
  imageFiles: z.array(z.string()),
})

type MemeInfoType = z.infer<typeof MemeInfo>

export const getMemeByKey = async (memeKey: string): Promise<MemeInfoType> => {
  const mediaPath = path.join(process.cwd(), `app/routes/memery+/memestore/${memeKey}`)
  const memePath = path.join(mediaPath, `meme.json`)
  const meme = await fs.readFile(memePath, 'utf8')

  const parsedMeme = MemeSpec.parse(JSON.parse(meme))

  const files = await fs.readdir(path.join(process.cwd(), 'public/images/memery/' + memeKey))
  const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file))

  const memeStudies = studies.filter((study) => parsedMeme.studyKeys.includes(study.key))

  return { ...parsedMeme, imageFiles, studies: memeStudies }
}
