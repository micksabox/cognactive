import { Link } from 'react-router'
import CognactiveIcon from 'src/assets/icons/cognactive-icon'
import { ArrowUpRightSquare, Github } from 'lucide-react'
import { GITHUB_REPO_BASE, TELEGRAM_CHAT_LINK } from 'src/constants'
import { Button } from '../ui/button'

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-foreground p-4 text-xs text-slate-500">
      <div className="flex items-center gap-4">
        <span className="inline-block w-16">
          <CognactiveIcon className="fill-slate-500" darkMode />
        </span>
        <Button size={'sm'} asChild>
          <Link to={TELEGRAM_CHAT_LINK}>
            Chat NAC <ArrowUpRightSquare className="ml-2 inline-block w-4" />
          </Link>
        </Button>
        <Button size={'sm'} asChild>
          <a href={GITHUB_REPO_BASE} target="_blank" rel="noreferrer">
            View Code &nbsp;
            <Github className="w-4" />
          </a>
        </Button>
      </div>
      <p className="my-2">
        <Link className="underline underline-offset-auto" to={'/privacy'}>
          Data Usage & Privacy Policy
        </Link>
      </p>
      <p className="bottom-inset">
        <span className="font-semibold">Medical Disclaimer:</span> This website is provided for educational and
        informational purposes only and does not constitute providing medical advice or professional services. Nothing
        herein should be construed as an attempt to diagnose, treat, cure, or prevent any condition, illness, or
        disease, and those seeking medical advice should consult with a licensed physician.
      </p>
    </footer>
  )
}

export default Footer
