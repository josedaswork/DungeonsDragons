import { useState } from 'react'
import { Toaster } from 'sonner'
import { getScriptUrl, setScriptUrl, clearCache } from '@/lib/storage'
import CharacterSheet from '@/pages/CharacterSheet'
import SetupScreen from '@/components/SetupScreen'

function App() {
  const [scriptUrl, setUrl] = useState(getScriptUrl())
  const [showSetup, setShowSetup] = useState(!scriptUrl)

  const handleSetupSave = (url) => {
    if (url !== scriptUrl) clearCache()
    setScriptUrl(url)
    setUrl(url)
    setShowSetup(false)
  }

  if (showSetup) {
    return (
      <>
        <SetupScreen onSave={handleSetupSave} initialUrl={scriptUrl} />
        <Toaster richColors position="top-center" />
      </>
    )
  }

  return (
    <>
      <CharacterSheet onOpenSettings={() => setShowSetup(true)} />
      <Toaster richColors position="top-center" />
    </>
  )
}

export default App
