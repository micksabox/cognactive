import { Switch } from 'src/components/ui/switch'
import db, { IRegimen } from 'src/pages/tracker/db'
import { useCallback } from 'react'

// Define the toggleHidden function
const toggleHidden = async (regimenId: number, hidden: boolean) => {
  await db.regimen.update(regimenId, { hidden: !hidden })
}

// Define the HiddenSwitch component
const HiddenSwitch: React.FC<{ regimen: IRegimen }> = ({ regimen }) => {
  const handleToggle = useCallback(() => {
    toggleHidden(regimen.id!, regimen.hidden || false)
  }, [regimen])

  return <Switch checked={!regimen.hidden || false} onCheckedChange={handleToggle} />
}

export default HiddenSwitch
