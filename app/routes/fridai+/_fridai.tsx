import React, { useEffect, useState } from 'react'

const FridaiAcronym: React.FC = () => {
  const [activeIndices, setActiveIndices] = useState({
    firstI: 0,
    dMeaning: 0,
    aMeaning: 0,
    lastI: 0,
  })

  useEffect(() => {
    const setupCycleAnimation = (key: keyof typeof activeIndices, items: string[], baseInterval: number) => {
      const cycle = () => {
        setActiveIndices((prev) => ({
          ...prev,
          [key]: (prev[key] + 1) % items.length,
        }))

        const variation = Math.random() * 500 - 250 // +/- 250ms
        setTimeout(cycle, baseInterval + variation)
      }

      const timer = setTimeout(cycle, baseInterval)
      return () => clearTimeout(timer)
    }

    setupCycleAnimation('firstI', ['Interactive', 'Intelligent'], 4000)
    setupCycleAnimation('dMeaning', ['Digital', 'Discovery', 'Dynamic', 'Data'], 4500)
    setupCycleAnimation('aMeaning', ['Artificial', 'Assistant'], 4000)
    setupCycleAnimation('lastI', ['Intelligence', 'Interface'], 4000)

    return () => {
      // Clean up timers if needed
    }
  }, [])

  const CycleContainer: React.FC<{ items: string[]; activeIndex: number }> = ({ items, activeIndex }) => (
    <span className="relative h-6 w-32 overflow-hidden">
      {items.map((item, index) => (
        <span
          key={item}
          className={`absolute left-0 top-0 w-full transition-all duration-500 ease-in-out ${
            index === activeIndex ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
        >
          {item}
        </span>
      ))}
    </span>
  )

  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2.5 rounded-lg bg-gray-100 p-5 shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-2xl font-bold text-white">
        F
      </div>
      <div className="flex items-center text-lg">Fungal</div>

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-2xl font-bold text-white">
        R
      </div>
      <div className="flex items-center text-lg">Research</div>

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-2xl font-bold text-white">
        I
      </div>
      <div className="flex items-center text-lg">
        <CycleContainer items={['Interactive', 'Intelligent']} activeIndex={activeIndices.firstI} />
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-2xl font-bold text-white">
        D
      </div>
      <div className="flex items-center text-lg">
        <CycleContainer items={['Digital', 'Discovery', 'Dynamic', 'Data']} activeIndex={activeIndices.dMeaning} />
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-2xl font-bold text-white">
        A
      </div>
      <div className="flex items-center text-lg">
        <CycleContainer items={['Artificial', 'Assistant']} activeIndex={activeIndices.aMeaning} />
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-2xl font-bold text-white">
        I
      </div>
      <div className="flex items-center text-lg">
        <CycleContainer items={['Intelligence', 'Interface']} activeIndex={activeIndices.lastI} />
      </div>
    </div>
  )
}

export default FridaiAcronym
