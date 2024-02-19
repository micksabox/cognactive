import { Link } from '@remix-run/react'
import CognactiveIcon from 'src/assets/icons/cognactive-icon'

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-foreground p-4 text-center text-xs text-slate-500">
      <span className="inline-block w-16">
        <CognactiveIcon className="fill-slate-500" darkMode />
      </span>
      <p className="my-2">
        <Link className="underline underline-offset-auto" to={'/privacy'}>
          Privacy Policy
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
