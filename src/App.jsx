import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Dither from './components/Dither'

gsap.registerPlugin(ScrollTrigger)

const navLinks = ['Work', 'About', 'Our services', 'Contact']

const works = [
  { title: 'Choreography — ABBA Voyage',   tags: ['Creative Direction', 'Choreography', 'Live'] },
  { title: 'Show — Melodifestivalen',       tags: ['Show Direction', 'Koreografi', 'Live'] },
  { title: 'Campaign — H&M Studios',        tags: ['Creative Direction', 'Art Direction'] },
  { title: 'Tour — International Artist',   tags: ['Choreography', 'Creative Direction', 'Live'] },
  { title: 'Live Show — Eurovision',        tags: ['Creative Direction', 'Show', 'Koreografi'] },
]

function copyEmail() {
  navigator.clipboard.writeText('hello@jeanbaptistegroup.com')
  const el = document.querySelector('.copy-msg')
  if (el) { el.textContent = 'Copied!'; setTimeout(() => { el.textContent = 'Click to copy' }, 2000) }
}

export default function App() {
  const logoRef    = useRef(null)
  const navLogoRef = useRef(null)
  const navRef     = useRef(null)
  const worksRef   = useRef(null)

  useEffect(() => {
    const lenis = new Lenis()
    const raf = time => { lenis.raf(time); requestAnimationFrame(raf) }
    requestAnimationFrame(raf)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(time => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    // Nav logo shrinks on scroll
    gsap.fromTo(navLogoRef.current,
      { fontSize: '1.6rem' },
      { fontSize: '0.95rem', ease: 'none',
        scrollTrigger: { start: 'top top', end: '300px top', scrub: true } }
    )

    // Nav color flips when white section enters
    ScrollTrigger.create({
      trigger: worksRef.current,
      start: 'top 60px',
      onEnter:     () => gsap.to(navRef.current.querySelectorAll('a, span'), { color: '#111', duration: 0.3 }),
      onLeaveBack: () => gsap.to(navRef.current.querySelectorAll('a, span'), { color: '#fff', duration: 0.3 }),
    })

    // Hero logo entrance
    gsap.fromTo(logoRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.3 }
    )

    // Works
    gsap.utils.toArray('.work-item').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' } }
      )
    })

    // Statement
    gsap.fromTo('.statement-info',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.statement-info', start: 'top 80%' } }
    )

    // Footer
    gsap.fromTo('.footer-talk',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.footer-talk', start: 'top 85%' } }
    )

    return () => { lenis.destroy(); ScrollTrigger.getAll().forEach(t => t.kill()) }
  }, [])

  return (
    <>
      {/* ── NAV ── */}
      <nav ref={navRef} style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: '60px',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}>
        <span ref={navLogoRef} style={{ fontSize: '1.6rem', fontWeight: 600, color: '#fff', letterSpacing: '0.01em' }}>
          Jeanbaptistegroup®
        </span>

        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '32px' }}>
          {navLinks.map((link, i) => (
            <a key={link} href="#" style={{
              fontSize: '1rem', fontWeight: i === 0 ? 600 : 400,
              color: i === 0 ? '#fff' : 'rgba(255,255,255,0.55)', letterSpacing: '0.01em',
            }}>
              {link}
            </a>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Dither
            waveColor={[1, 0.14901960784313725, 0.14901960784313725]}
            disableAnimation={false} enableMouseInteraction mouseRadius={1}
            colorNum={4} pixelSize={2} waveAmplitude={0.3} waveFrequency={3} waveSpeed={0.05}
          />
        </div>
        <div style={{
          position: 'absolute', top: '60px', left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
        }}>
          <img ref={logoRef} src="/logo.png" alt="Jeanbaptistegroup" style={{
            width: 'clamp(400px, 75vw, 1100px)', height: 'auto',
            transform: 'translateX(3.5%)', opacity: 0,
          }} />
        </div>
        {/* Bottom-left hero text */}
        <h2 style={{
          position: 'absolute',
          bottom: '48px',
          left: '32px',
          right: '32px',
          maxWidth: '640px',
          fontSize: 'clamp(1.8rem, 3.5vw, 3.2rem)',
          fontWeight: 500,
          lineHeight: 1.15,
          color: '#fff',
          letterSpacing: '-0.02em',
          pointerEvents: 'none',
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}>
          Stockholm-based production company specializing in live performance and visual concepts.
        </h2>
      </section>

      {/* ── WORKS ── */}
      <section ref={worksRef} style={{
        background: '#fff',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}>
        {/* Selected works header */}
        <div style={{
          padding: '40px 32px 24px',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
        }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 400, letterSpacing: '0.05em', color: '#111' }}>
            Selected works
          </h4>
        </div>

        {/* Work items */}
        <div>
          {works.map((work, i) => (
            <div key={i} className="work-item" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              {/* Image placeholder */}
              <div style={{
                width: '100%',
                aspectRatio: '16/7',
                background: `hsl(${i * 40}, 8%, ${88 - i * 3}%)`,
                overflow: 'hidden',
              }} />

              {/* Info row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 32px',
                gap: '24px',
              }}>
                <h3 style={{
                  fontSize: 'clamp(1rem, 1.8vw, 1.4rem)',
                  fontWeight: 400,
                  color: '#111',
                  letterSpacing: '-0.01em',
                }}>
                  {work.title}
                </h3>
                <ul style={{
                  display: 'flex', gap: '24px', listStyle: 'none',
                  flexShrink: 0,
                }}>
                  {work.tags.map(tag => (
                    <li key={tag} style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.45)', letterSpacing: '0.02em' }}>
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATEMENT ── */}
      <section style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        background: '#fff',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}>
        <div className="statement-info" style={{ padding: '80px 48px 80px 32px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
          <h4 style={{
            fontSize: 'clamp(1.6rem, 2.8vw, 2.6rem)', fontWeight: 400,
            lineHeight: 1.25, color: '#111', marginBottom: '32px',
          }}>
            <small style={{ fontSize: '0.55em', verticalAlign: 'super', marginRight: '2px', color: 'rgba(0,0,0,0.35)' }}>1</small>Creative Direction,{' '}
            <small style={{ fontSize: '0.55em', verticalAlign: 'super', marginRight: '2px', color: 'rgba(0,0,0,0.35)' }}>2</small>Show,{' '}
            <small style={{ fontSize: '0.55em', verticalAlign: 'super', marginRight: '2px', color: 'rgba(0,0,0,0.35)' }}>3</small>Choreography,{' '}
            <span>and <small style={{ fontSize: '0.55em', verticalAlign: 'super', marginRight: '2px', color: 'rgba(0,0,0,0.35)' }}>4</small>Live.</span>
          </h4>
          <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'rgba(0,0,0,0.55)', marginBottom: '32px' }}>
            These values are not only our pillars but also the driving force behind everything we create.
          </p>
          <a href="#" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            fontSize: '0.9rem', color: '#111',
          }}>
            Read more{' '}
            <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.1569 5.86212L13.0188 5.86212L13.0334 5.96394L7.2731 11.7242L6.24032 10.6915L11.1569 5.86212ZM0 5.12026L11.797 5.13481V6.58943L5.41895e-08 6.60397L0 5.12026ZM7.2731 0L13.0334 5.76029L13.0188 5.86212L11.1569 5.86212L6.24032 1.03278L7.2731 0Z" fill="#111"/>
            </svg>
          </a>
        </div>
        <div style={{
          background: '#e8e8e8',
          borderTop: '1px solid rgba(0,0,0,0.1)',
          minHeight: '420px',
        }} />
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: '#fff',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        borderTop: '1px solid rgba(0,0,0,0.1)',
      }}>
        {/* Let's talk */}
        <div className="footer-talk" style={{ padding: '64px 32px 48px' }}>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)', fontWeight: 300, color: '#111', letterSpacing: '-0.02em' }}>
              Let's talk
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="copy-msg" style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.35)', letterSpacing: '0.05em' }}>
              Click to copy
            </span>
            <button onClick={copyEmail} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontSize: 'clamp(1rem, 2vw, 1.4rem)', color: '#111', fontFamily: 'inherit',
              letterSpacing: '-0.01em',
            }}>
              hello@jeanbaptistegroup.com
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '16px',
          padding: '20px 32px',
          borderTop: '1px solid rgba(0,0,0,0.1)',
        }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {navLinks.map((link, i) => (
              <a key={link} href="#" style={{ fontSize: '0.85rem', color: '#111' }}>
                {link}{i < navLinks.length - 1 ? ', ' : ''}
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.85rem', color: '#111', marginRight: '4px' }}>Follow us</span>
            {[['LinkedIn', ','], ['Instagram', ','], ['X (Twitter)', '']].map(([s, comma]) => (
              <a key={s} href="#" style={{ fontSize: '0.85rem', color: '#111' }}>{s}{comma}</a>
            ))}
          </div>

          <span style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.4)' }}>
            Jeanbaptistegroup©2026
          </span>
        </div>
      </footer>
    </>
  )
}
