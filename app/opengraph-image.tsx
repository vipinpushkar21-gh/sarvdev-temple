import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Sarvdev — Temple Directory & Devotional Hub'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2c1a0e 60%, #3d2010 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '64px 80px',
          position: 'relative',
        }}
      >
        {/* Saffron accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, #FF9933, #E67E22)',
          }}
        />
        {/* Om symbol watermark */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            right: 80,
            fontSize: 200,
            color: 'rgba(255,153,51,0.08)',
            fontFamily: 'serif',
            lineHeight: 1,
            display: 'flex',
          }}
        >
          ॐ
        </div>
        {/* Saffron pill label */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 24,
            background: 'rgba(255,153,51,0.15)',
            border: '1px solid rgba(255,153,51,0.3)',
            borderRadius: 999,
            padding: '6px 16px',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#FF9933',
              display: 'flex',
            }}
          />
          <span style={{ color: '#FF9933', fontSize: 14, letterSpacing: '0.12em', fontFamily: 'sans-serif' }}>
            TEMPLE DIRECTORY & DEVOTIONAL HUB
          </span>
        </div>
        {/* Title */}
        <div
          style={{
            fontSize: 88,
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            fontFamily: 'serif',
            display: 'flex',
          }}
        >
          Sarvdev
        </div>
        {/* Tagline */}
        <div
          style={{
            marginTop: 20,
            fontSize: 24,
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.02em',
            fontFamily: 'sans-serif',
            display: 'flex',
          }}
        >
          Discover sacred temples across India and the world
        </div>
      </div>
    ),
    { ...size }
  )
}
