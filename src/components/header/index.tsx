import React, { ReactNode } from 'react'

import CognactiveIcon from 'src/assets/icons/cognactive-icon.svg'
interface IProps {
  leftNode?: ReactNode
}
export function Header(props: IProps) {
  return (
    <div className="flex w-full items-center justify-between border bg-slate-50 bg-opacity-70 px-4 py-4 md:px-12">
      <a href="/" className="flex items-center text-base font-semibold">
        <span className="mr-2 inline-block w-8">
          <CognactiveIcon />
        </span>
        cognactive
      </a>
      <div className="flex items-center gap-4">
        {/* <LanguageSelector /> */}
        {/* <Button asChild>
          <a href="https://github.com/Quilljou/vite-react-ts-tailwind-starter" target="_blank" rel="noreferrer">
            View Code &nbsp;
            <Github className="w-4" />
          </a>
        </Button> */}
      </div>
    </div>
  )
}
