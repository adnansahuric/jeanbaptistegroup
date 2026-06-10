import * as React from "react"
import Gate, { SESSION_KEY } from "./components/Gate"

export default function App() {
  const [unlocked, setUnlocked] = React.useState(
    () => sessionStorage.getItem(SESSION_KEY) === "1"
  )

  if (unlocked) return null

  return <Gate onUnlock={() => setUnlocked(true)} />
}
