import { UserButton } from '@clerk/clerk-react'
import React from 'react'

export default function ProtectedPage() {
  return (
    <div><UserButton/></div>
  )
}
