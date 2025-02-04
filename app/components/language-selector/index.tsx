import { useTranslation } from 'react-i18next'
import { useCallback, useMemo, useState } from 'react'
import { Languages, ChevronDown } from 'lucide-react'
import i18next from 'i18next'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { cn } from 'src/lib/utils'
import { supportedLanguages } from 'app/localization/resource'

const getLocaleDisplayName = (locale: string, displayLocale?: string) => {
  const displayName = new Intl.DisplayNames([displayLocale || locale], {
    type: 'language',
  }).of(locale)
  return displayName ? displayName.charAt(0).toLocaleUpperCase() + displayName.slice(1) : locale
}

type LanguageSelectorProps = {
  triggerClassName?: string
}

const LanguageSelector = ({ triggerClassName }: LanguageSelectorProps) => {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)

  const localesAndNames = useMemo(() => {
    return supportedLanguages.map((locale) => ({
      locale,
      name: getLocaleDisplayName(locale),
    }))
  }, [])

  const languageChanged = useCallback(async (locale: any) => {
    i18next.changeLanguage(locale)
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('lng', locale)
    window.history.replaceState(null, '', `${window.location.pathname}?${searchParams.toString()}`)
    setOpen(false)
  }, [])

  const { resolvedLanguage: currentLanguage } = i18n

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'outline'} className={cn('flex items-center gap-1', triggerClassName)}>
          <Languages size={18} />
          {currentLanguage && getLocaleDisplayName(currentLanguage)}
          <ChevronDown size={12} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Language</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          {localesAndNames.map(({ locale, name }) => {
            const isSelected = currentLanguage === locale
            return (
              <form key={locale} action="/resource/locales" method="post">
                <input type="hidden" name="lng" value={locale} />
                <button
                  className={cn(
                    'relative w-full cursor-pointer select-none rounded-md px-4 py-3 hover:bg-zinc-200',
                    isSelected && 'bg-zinc-100',
                  )}
                  type="submit"
                >
                  <div key={locale}>
                    <span className={cn('block truncate', isSelected && 'font-bold text-primary')}>{name}</span>
                  </div>
                </button>
              </form>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { LanguageSelector }
