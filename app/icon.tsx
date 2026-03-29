import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#e85d04',
          borderRadius: '8px',
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: '22px',
            fontWeight: '800',
            fontFamily: 'Georgia, serif',
            lineHeight: 1,
            marginTop: '2px',
          }}
        >
          S
        </span>
      </div>
    ),
    { ...size }
  )
}
