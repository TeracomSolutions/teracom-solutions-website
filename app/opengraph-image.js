import { ImageResponse } from 'next/og';

export const alt = 'Teracom Solutions -- electronic security, AI and technology';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#050505',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        {/* Red top bar */}
        <div
          style={{
            display: 'flex',
            height: '12px',
            backgroundColor: '#ff1717',
            width: '100%',
          }}
        />
        
        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: '64px',
              letterSpacing: '4px',
              marginBottom: '20px',
            }}
          >
            TERACOM SOLUTIONS
          </h1>
          
          <p
            style={{
              color: 'rgba(255,255,255,.7)',
              fontSize: '36px',
              marginBottom: '40px',
            }}
          >
            Electronic security, AI & technology
          </p>
          
          <p
            style={{
              color: 'rgba(255,255,255,.45)',
              fontSize: '26px',
            }}
          >
            teracomsolutions.com.au  ·  Melbourne & Sydney
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}