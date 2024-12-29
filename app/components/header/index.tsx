import CognactiveIcon from 'src/assets/icons/cognactive-icon'
import { cn } from 'src/lib/utils'
import { Button } from '../ui/button'
import { Github } from 'lucide-react'
import { Link, useNavigation, useMatches } from 'react-router'
import { useSpinDelay } from 'spin-delay'
// import { LanguageSelector } from '../language-selector'
interface IProps {
  className?: string
}
export function Header(props: IProps) {
  const matches = useMatches()

  const isHomepage = matches.every((m) => m.pathname === '/')
  const transition = useNavigation()
  const busy = transition.state !== 'idle'

  const delayedPending = useSpinDelay(busy, {
    delay: 200,
    minDuration: 300,
  })

  return (
    <div
      className={cn(
        props.className,
        'flex w-full items-center justify-between border-b bg-slate-50 px-4 py-4 shadow md:px-12',
      )}
    >
      <Link to="/" className="flex items-center text-base font-semibold">
        <span className="mr-2 inline-block w-8">
          {delayedPending && <div className="loader absolute w-8"></div>}
          <CognactiveIcon biofilmVisibility={delayedPending ? 'hidden' : 'visible'} />
        </span>
        cognactive
      </Link>
      <div className="flex items-center gap-4">
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
