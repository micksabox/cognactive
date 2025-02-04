import { useEffect, useState } from 'react'

// Hook to detect and set state when web app is in standalone. Cross-platform.
const useIsAppInstalled = () => {
  const [isAppInstalled, setIsAppInstalled] = useState(false)

  useEffect(() => {
    // Detecting iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    // @ts-ignore
    if (isIOS && window.navigator.standalone) {
      setIsAppInstalled(true)
      // Empty cleanup function
      return () => ({})
    }

    // Detecting Android
    const isAndroid = /Android/.test(navigator.userAgent)
    if (isAndroid) {
      const mediaQuery = window.matchMedia('(display-mode: standalone)')
      const checkDisplayMode = () => setIsAppInstalled(mediaQuery.matches)

      checkDisplayMode() // Check on initial load

      // Modern browsers
      mediaQuery.addEventListener('change', checkDisplayMode)

      // Cleanup
      return () => mediaQuery.removeEventListener('change', checkDisplayMode)
    }
    // Empty cleanup function
    return () => ({})
  }, [])

  return isAppInstalled
}

export default useIsAppInstalled
