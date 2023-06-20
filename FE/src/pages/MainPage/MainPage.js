import React from 'react'
import { logout } from '../../utilities/firebase'


export default function MainPage() {
  const handleSignOut = () => {
    logout();

  }

  return (
    <div>
      MainPage

      <button onClick={handleSignOut}>Hello</button>
    </div>

  )
}
