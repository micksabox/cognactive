import React from 'react'

import CognactiveIcon from 'src/assets/icons/cognactive-icon'
import { cn } from 'src/lib/utils'
import { Button } from '../ui/button'
import { Github } from 'lucide-react'
import { useMatches } from 'react-router'
import { Link } from '@remix-run/react'
interface IProps {
  className?: string
}
export function Header(props: IProps) {
  const matches = useMatches()

  const isHomepage = matches.findLastIndex((m) => m.pathname === '/') == matches.length - 1

  return (
    <div
      className={cn(
        props.className,
        'flex w-full items-center justify-between border-b bg-slate-50 px-4 py-4 shadow md:px-12',
      )}
    >
      <Link prefetch="render" to="/" className="flex items-center text-base font-semibold">
        <span className="mr-2 inline-block w-8">
          <CognactiveIcon />
        </span>
        cognactive
      </Link>
      <div className="flex items-center gap-4">
        {/* <LanguageSelector /> */}
        {isHomepage && (
          <Button asChild>
            <a href="https://github.com/micksabox/cognactive" target="_blank" rel="noreferrer">
              View Code &nbsp;
              <Github className="w-4" />
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}
