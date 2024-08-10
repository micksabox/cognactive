import React, { useEffect, useState } from 'react'
import CognactiveIcon from 'src/assets/icons/cognactive-icon'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from 'src/components/ui/button'

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

      <p>F.R.I.D.A.I. is coming soon. Follow along, join the discussion and construction on Github.</p>
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
