import { useEffect, useState } from 'react'

const useIsAppInstalled = () => {
  const [isAppInstalled, setIsAppInstalled] = useState(false)

  // @ts-ignore
  useEffect(() => {
    // Detecting iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    // @ts-ignore
    if (isIOS && window.navigator.standalone) {
      setIsAppInstalled(true)
      return
    }

    // Detecting Android
    const isAndroid = /Android/.test(navigator.userAgent)
    if (isAndroid) {
      const mediaQuery = window.matchMedia('(display-mode: standalone)')
      const checkDisplayMode = () => setIsAppInstalled(mediaQuery.matches)

      checkDisplayMode() // Check on initial load

      // Listen for changes in display mode
      mediaQuery.addListener(checkDisplayMode)

      // Cleanup
      return () => mediaQuery.removeListener(checkDisplayMode)
    }
  }, [])

  return isAppInstalled
}

export default useIsAppInstalled
