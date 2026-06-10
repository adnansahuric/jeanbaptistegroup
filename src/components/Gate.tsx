import * as React from "react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./ui/input-otp"

const SECRET_CODE = "123456"
const SESSION_KEY = "jbg_unlocked"

interface GateProps {
  onUnlock: () => void
}

export default function Gate({ onUnlock }: GateProps) {
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    if (value.length === 6) {
      if (value === SECRET_CODE) {
        sessionStorage.setItem(SESSION_KEY, "1")
        onUnlock()
      } else {
        setError(true)
        setTimeout(() => {
          setValue("")
          setError(false)
        }, 700)
      }
    }
  }, [value, onUnlock])

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black">
      <img
        src="/logga-vit.png"
        alt="Jeanbaptistegroup"
        className="mb-12 w-32 opacity-90"
      />
      <p className="mb-8 text-xs tracking-[0.3em] text-white/40 uppercase">
        Enter access code
      </p>
      <InputOTP
        maxLength={6}
        value={value}
        onChange={setValue}
        autoFocus
      >
        <InputOTPGroup className={error ? "animate-shake" : ""}>
          <InputOTPSlot index={0} className={error ? "border-red-500 text-red-400" : ""} />
          <InputOTPSlot index={1} className={error ? "border-red-500 text-red-400" : ""} />
          <InputOTPSlot index={2} className={error ? "border-red-500 text-red-400" : ""} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup className={error ? "animate-shake" : ""}>
          <InputOTPSlot index={3} className={error ? "border-red-500 text-red-400" : ""} />
          <InputOTPSlot index={4} className={error ? "border-red-500 text-red-400" : ""} />
          <InputOTPSlot index={5} className={error ? "border-red-500 text-red-400" : ""} />
        </InputOTPGroup>
      </InputOTP>
      {error && (
        <p className="mt-6 text-xs tracking-widest text-red-400 uppercase">
          Wrong code
        </p>
      )}
    </div>
  )
}

export { SESSION_KEY }
