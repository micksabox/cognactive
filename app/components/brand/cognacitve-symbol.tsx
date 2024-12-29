import CognactiveIcon from 'src/assets/icons/cognactive-icon'

interface CognactiveSymbolProps {
  children: React.ReactNode
  iconClassName?: string
}

const CognactiveSymbol: React.FC<CognactiveSymbolProps> = ({ children, iconClassName }) => (
  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold`}>
    {children}
    <CognactiveIcon className={`absolute h-10 w-10 ${iconClassName}`} fungiVisibility="hidden" />
  </div>
)

export default CognactiveSymbol
