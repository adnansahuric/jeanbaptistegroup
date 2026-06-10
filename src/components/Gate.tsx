import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"

const SECRET_CODE = "123456"
const SESSION_KEY = "jbg_unlocked"

interface GateProps {
  onUnlock: () => void
}

function OTPSlot({ index, error }: { index: number; error: boolean }) {
  const ctx = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = ctx?.slots[index] ?? {}

  return (
    <div style={{
      position: 'relative',
      width: 48,
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderTop: `1px solid ${error ? '#ef4444' : isActive ? '#fff' : 'rgba(255,255,255,0.3)'}`,
      borderBottom: `1px solid ${error ? '#ef4444' : isActive ? '#fff' : 'rgba(255,255,255,0.3)'}`,
      borderRight: `1px solid ${error ? '#ef4444' : isActive ? '#fff' : 'rgba(255,255,255,0.3)'}`,
      borderLeft: index === 0 || index === 3 ? `1px solid ${error ? '#ef4444' : isActive ? '#fff' : 'rgba(255,255,255,0.3)'}` : 'none',
      borderRadius: index === 0 ? '6px 0 0 6px' : index === 2 || index === 5 ? '0 6px 6px 0' : 0,
      color: error ? '#ef4444' : '#fff',
      fontSize: 20,
      fontFamily: 'inherit',
    }}>
      {char}
      {hasFakeCaret && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ width: 1, height: 20, background: '#fff', animation: 'blink 1s step-end infinite' }} />
        </div>
      )}
    </div>
  )
}

export default function Gate({ onUnlock }: GateProps) {
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  React.useEffect(() => {
    if (value.length === 6) {
      if (value === SECRET_CODE) {
        sessionStorage.setItem(SESSION_KEY, "1")
        document.body.style.overflow = ''
        document.body.classList.remove('locked')
        onUnlock()
      } else {
        setError(true)
        setTimeout(() => { setValue(""); setError(false) }, 700)
      }
    }
  }, [value, onUnlock])

  return (
    <>
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} } @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} } .gate-shake{animation:shake 0.3s ease-in-out}`}</style>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 999999,
        background: '#000',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}>
        <img src="/logga-vit.png" alt="Jeanbaptistegroup" style={{ width: 120, marginBottom: 48, opacity: 0.9 }} />
        <p style={{ fontSize: 11, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 32 }}>
          Enter access code
        </p>
        <div className={error ? 'gate-shake' : ''}>
          <OTPInput
            maxLength={6}
            value={value}
            onChange={setValue}
            autoFocus
            containerClassName=""
            style={{ display: 'flex', alignItems: 'center', gap: 12 }}
            render={({ slots }) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex' }}>
                  {[0,1,2].map(i => <OTPSlot key={i} index={i} error={error} />)}
                </div>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>–</span>
                <div style={{ display: 'flex' }}>
                  {[3,4,5].map(i => <OTPSlot key={i} index={i} error={error} />)}
                </div>
              </div>
            )}
          />
        </div>
        {error && (
          <p style={{ marginTop: 24, fontSize: 11, letterSpacing: '0.2em', color: '#ef4444', textTransform: 'uppercase' }}>
            Wrong code
          </p>
        )}
      </div>
    </>
  )
}

export { SESSION_KEY }
