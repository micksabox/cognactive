import React, { startTransition, StrictMode } from 'react'
import { HydratedRouter } from 'react-router/dom'
import { hydrateRoot } from 'react-dom/client'

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  )
})
