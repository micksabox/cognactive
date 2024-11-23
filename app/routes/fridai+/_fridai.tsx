import React, { useEffect, useState } from 'react'
import CognactiveIcon from 'src/assets/icons/cognactive-icon'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from 'src/components/ui/button'
import { Form, useLoaderData, LoaderFunction } from 'react-router'
import { PaperSearchItem, semanticScholarClient } from '@/utils/semantic-scholar.server'

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const searchTerm = url.searchParams.get('searchTerm')

  if (!searchTerm) {
    return { papers: [], searchTerm: '' }
  }

  const papers = await semanticScholarClient.searchPapers(searchTerm, 10)

  console.log(papers)

  return { papers: papers.data, searchTerm }
}

const Letter: React.FC<{ letter: string }> = ({ letter }) => (
  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold`}>
    {letter}
    <CognactiveIcon className="absolute h-10 w-10" fungiVisibility="hidden" />
  </div>
)

const CycleText = ({ words, interval = 3500 }: { words: string[]; interval?: number }) => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length)
    }, interval + (Math.random() * 500 - 250)) // Add some variation

    return () => clearInterval(timer)
  }, [words, interval])

  return (
    <div style={{ position: 'relative', height: '1.5em', width: '120px' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          style={{ position: 'absolute' }}
        >
          {words[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

const FridaiAcronym: React.FC = () => {
  const { papers, searchTerm } = useLoaderData()

  return (
    <div className="container flex flex-col items-center justify-center">
      <p className="my-8 text-2xl">Construct a vector to explore and navigate the fungal academic research space</p>
      <div className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2.5 p-4">
        <Letter letter="F" />
        <div className="flex items-center text-lg">Fungal</div>

        <Letter letter="R" />
        <div className="flex items-center text-lg">Research</div>

        <Letter letter="I" />
        <div className="flex items-center text-lg">
          <CycleText words={['Interactive', 'Investigative']} interval={4000} />
        </div>

        <Letter letter="D" />
        <div className="flex items-center text-lg">
          <CycleText words={['Digital', 'Discovery', 'Dynamic', 'Data']} interval={4500} />
        </div>

        <Letter letter="A" />
        <div className="flex items-center text-lg">
          <CycleText words={['Assistant', 'Artificial']} interval={3600} />
        </div>

        <Letter letter="I" />
        <div className="flex items-center text-lg">
          <CycleText words={['Intelligence', 'Interface']} interval={3900} />
        </div>
      </div>

      <Form method="get" className="my-8 flex w-full max-w-md flex-col items-center">
        <input
          defaultValue={searchTerm}
          type="text"
          name="searchTerm"
          placeholder="Enter search term"
          className="w-full rounded-md border p-2"
        />
        <Button type="submit" className="mt-4">
          Search
        </Button>
      </Form>

      {papers.length > 0 && (
        <div className="mt-8 w-full max-w-2xl">
          <h2 className="mb-4 text-xl font-bold">Search Results:</h2>
          <ul className="space-y-4">
            {papers.map((paper: PaperSearchItem, index: number) => (
              <li key={index} className="rounded-md border p-4">
                <h3 className="text-lg font-semibold">
                  <a
                    href={`/fridai/${paper.paperId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {paper.title}
                  </a>
                </h3>
                <p className="mt-2 text-sm">{paper.title}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-8">F.R.I.D.A.I. is coming soon. Follow along, join the discussion and construction on Github.</p>
      <Button className="my-8" asChild>
        <a href="https://github.com/micksabox/cognactive/discussions/4" target="_blank" rel="noopener noreferrer">
          Launch Discussion
        </a>
      </Button>
      <br />
    </div>
  )
}

export default FridaiAcronym
